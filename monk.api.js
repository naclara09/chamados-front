import http from "node:http";

const PORT = 3001;
const TIPOS = ["elétrica", "hidráulica", "ar-condicionado", "informática", "mobiliário", "outros"];
const LOCAIS = ["sala de aula", "laboratório", "biblioteca", "banheiro", "refeitório", "quadra", "administração"];
const PRIORIDADES = ["baixa", "média", "alta"];

let proximoId = 4;
let chamados = [
  { id: 1, titulo: "Ar-condicionado pingando", descricao: "Pinga água em cima das carteiras.", tipo: "ar-condicionado", local: "sala de aula", prioridade: "alta", data_abertura: "2026-10-12", status: "aberto", responsavel: null, solucao: null, data_resolucao: null },
  { id: 2, titulo: "Lâmpada queimada", descricao: "Duas lâmpadas do corredor não acendem.", tipo: "elétrica", local: "biblioteca", prioridade: "média", data_abertura: "2026-10-10", status: "em andamento", responsavel: "Seu José", solucao: null, data_resolucao: null },
  { id: 3, titulo: "Computador não liga", descricao: "PC da bancada 4 não dá sinal de vida.", tipo: "informática", local: "laboratório", prioridade: "baixa", data_abertura: "2026-10-05", status: "resolvido", responsavel: "Equipe de TI", solucao: "Fonte trocada.", data_resolucao: "2026-10-08" },
];

function enviar(res, status, corpo) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  });
  res.end(status === 204 ? undefined : JSON.stringify(corpo));
}

const erro = (res, status, detail) => enviar(res, status, { detail });

function lerCorpo(req) {
  return new Promise((resolve) => {
    let txt = "";
    req.on("data", (c) => (txt += c));
    req.on("end", () => {
      try { resolve(JSON.parse(txt || "{}")); } catch { resolve(null); }
    });
  });
}

function validarChamado(c) {
  const faltando = [];
  for (const campo of ["titulo", "descricao", "tipo", "local", "prioridade", "data_abertura"]) {
    if (!c[campo] || typeof c[campo] !== "string" || !c[campo].trim()) {
      faltando.push({ loc: ["body", campo], msg: "campo obrigatório" });
    }
  }
  if (c.tipo && !TIPOS.includes(c.tipo)) faltando.push({ loc: ["body", "tipo"], msg: "tipo inválido" });
  if (c.local && !LOCAIS.includes(c.local)) faltando.push({ loc: ["body", "local"], msg: "local inválido" });
  if (c.prioridade && !PRIORIDADES.includes(c.prioridade)) faltando.push({ loc: ["body", "prioridade"], msg: "prioridade inválida" });
  if (c.data_abertura && !/^\d{4}-\d{2}-\d{2}$/.test(c.data_abertura)) faltando.push({ loc: ["body", "data_abertura"], msg: "use o formato AAAA-MM-DD" });
  return faltando;
}

const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const servidor = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return enviar(res, 204);

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const partes = url.pathname.split("/").filter(Boolean);

  if (!req.headers["x-api-key"]) return erro(res, 401, "Chave de API ausente ou inválida.");

  const [recurso, idTexto, acao] = partes;

  if (req.method === "GET" && recurso === "eu") return enviar(res, 200, { nome: "Aluno(a) (API local)" });
  if (req.method === "GET" && recurso === "tipos") return enviar(res, 200, TIPOS);
  if (req.method === "GET" && recurso === "locais") return enviar(res, 200, LOCAIS);
  if (req.method === "GET" && recurso === "prioridades") return enviar(res, 200, PRIORIDADES);

  if (recurso !== "chamados") return erro(res, 404, "Rota não encontrada.");

  if (!idTexto) {
    if (req.method === "GET") {
      const q = url.searchParams;
      let lista = chamados.filter((c) =>
        ["status", "tipo", "local", "prioridade"].every((k) => !q.get(k) || c[k] === q.get(k))
      );
      if (q.get("busca")) {
        const b = norm(q.get("busca"));
        lista = lista.filter((c) => norm(c.titulo).includes(b) || norm(c.descricao).includes(b));
      }
      return enviar(res, 200, lista);
    }
    if (req.method === "POST") {
      const corpo = await lerCorpo(req);
      if (!corpo) return erro(res, 422, "JSON inválido.");
      const problemas = validarChamado(corpo);
      if (problemas.length) return erro(res, 422, problemas);
      const novo = {
        id: proximoId++,
        titulo: corpo.titulo.trim(), descricao: corpo.descricao.trim(),
        tipo: corpo.tipo, local: corpo.local, prioridade: corpo.prioridade,
        data_abertura: corpo.data_abertura, status: "aberto",
        responsavel: null, solucao: null, data_resolucao: null,
      };
      chamados.push(novo);
      return enviar(res, 201, novo);
    }
    return erro(res, 404, "Rota não encontrada.");
  }
  const id = Number(idTexto);
  const chamado = chamados.find((c) => c.id === id);
  if (!chamado) return erro(res, 404, "Chamado não encontrado.");

  if (!acao) {
    if (req.method === "GET") return enviar(res, 200, chamado);
    if (req.method === "DELETE") {
      chamados = chamados.filter((c) => c.id !== id);
      return enviar(res, 204);
    }
    if (req.method === "PUT") {
      if (chamado.status === "resolvido") return erro(res, 400, "Chamado resolvido não pode ser editado.");
      const corpo = await lerCorpo(req);
      if (!corpo) return erro(res, 422, "JSON inválido.");
      const problemas = validarChamado(corpo);
      if (problemas.length) return erro(res, 422, problemas);
      Object.assign(chamado, {
        titulo: corpo.titulo.trim(), descricao: corpo.descricao.trim(),
        tipo: corpo.tipo, local: corpo.local, prioridade: corpo.prioridade,
        data_abertura: corpo.data_abertura,
      });
      return enviar(res, 200, chamado);
    }
  }

  if (req.method === "PATCH" && acao === "iniciar") {
    if (chamado.status !== "aberto") return erro(res, 400, "Só é possível iniciar um chamado aberto.");
    const corpo = await lerCorpo(req);
    if (!corpo?.responsavel?.trim()) return erro(res, 422, [{ loc: ["body", "responsavel"], msg: "campo obrigatório" }]);
    chamado.status = "em andamento";
    chamado.responsavel = corpo.responsavel.trim();
    return enviar(res, 200, chamado);
  }

  if (req.method === "PATCH" && acao === "resolver") {
    if (chamado.status !== "em andamento") return erro(res, 400, "Só é possível resolver um chamado em andamento.");
    const corpo = await lerCorpo(req);
    if (!corpo?.solucao?.trim()) return erro(res, 422, [{ loc: ["body", "solucao"], msg: "campo obrigatório" }]);
    chamado.status = "resolvido";
    chamado.solucao = corpo.solucao.trim();
    chamado.data_resolucao = new Date().toISOString().slice(0, 10);
    return enviar(res, 200, chamado);
  }

  return erro(res, 404, "Rota não encontrada.");
});

servidor.listen(PORT, () => {
  console.log(`API local rodando em http://localhost:${PORT}`);
});