import api from "./api";

export async function buscarUsuario() {
  const resposta = await api.get("/eu");
  return resposta.data;
}
export async function listarTipos() {
  const resposta = await api.get("/tipos");
  return resposta.data;
}
export async function listarLocais() {
  const resposta = await api.get("/locais");
  return resposta.data;
}
export async function listarPrioridades() {
  const resposta = await api.get("/prioridades");
  return resposta.data;
}
export async function listarChamados(filtros) {
  const params = {};
  if (filtros.busca) params.busca = filtros.busca;
  if (filtros.status) params.status = filtros.status;
  if (filtros.tipo) params.tipo = filtros.tipo;
  if (filtros.local) params.local = filtros.local;
  if (filtros.prioridade) params.prioridade = filtros.prioridade;

  const resposta = await api.get("/chamados", { params: params });
  return resposta.data;
}
export async function buscarChamado(id) {
  const resposta = await api.get("/chamados/" + id);
  return resposta.data;
}
export async function criarChamado(chamado) {
  const resposta = await api.post("/chamados", chamado);
  return resposta.data;
}
export async function atualizarChamado(id, chamado) {
  const resposta = await api.put("/chamados/" + id, chamado);
  return resposta.data;
}
export async function iniciarChamado(id, responsavel) {
  const resposta = await api.patch("/chamados/" + id + "/iniciar", { responsavel: responsavel });
  return resposta.data;
}
export async function resolverChamado(id, solucao) {
  const resposta = await api.patch("/chamados/" + id + "/resolver", { solucao: solucao });
  return resposta.data;
}
export async function excluirChamado(id) {
  await api.delete("/chamados/" + id);
}