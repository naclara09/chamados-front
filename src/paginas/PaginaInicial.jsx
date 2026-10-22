import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CampoSelecao from "../components/CampoSelecao";
import ListaChamados from "../components/ListaChamados";
import MensagemErro from "../components/MensagemErro";
import { listarChamados } from "../services/chamadoService";
import mensagemDeErro from "../services/mensagemDeErro";

const STATUS = ["aberto", "em andamento", "resolvido"];

function PaginaInicial(props) {
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const [status, setStatus] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");

  // Recarrega a lista sempre que a busca aplicada ou algum filtro mudar
  useEffect(function () {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const dados = await listarChamados({
          busca: buscaAplicada,
          status: status,
          tipo: tipo,
          local: local,
          prioridade: prioridade,
        });
        if (ativo) {
          setChamados(dados);
        }
      } catch (e) {
        if (ativo) {
          setChamados([]);
          setErro("Não foi possível carregar. " + mensagemDeErro(e));
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return function () {
      ativo = false;
    };
  }, [buscaAplicada, status, tipo, local, prioridade]);

  function aoBuscar(e) {
    e.preventDefault();
    setBuscaAplicada(busca.trim());
  }

  function limparFiltros() {
    setBusca("");
    setBuscaAplicada("");
    setStatus("");
    setTipo("");
    setLocal("");
    setPrioridade("");
  }

  const temFiltro = buscaAplicada || status || tipo || local || prioridade;

  let conteudo;
  if (carregando) {
    conteudo = <p className="estado">Carregando chamados...</p>;
  } else if (erro) {
    conteudo = <MensagemErro mensagem={erro} />;
  } else if (chamados.length === 0) {
    conteudo = <p className="estado">Nenhum chamado encontrado.</p>;
  } else {
    conteudo = <ListaChamados chamados={chamados} />;
  }

  return (
    <div className="pagina-inicial">
      <div className="titulo-linha">
        <h2>Chamados</h2>
        <Link to="/novo" className="botao-link">+ Abrir chamado</Link>
      </div>

      <form className="busca" onSubmit={aoBuscar}>
        <input
          type="search"
          placeholder="Buscar por título ou descrição..."
          value={busca}
          onChange={function (e) { setBusca(e.target.value); }}
        />
        <button type="submit" className="botao-secundario">Buscar</button>
      </form>

      <div className="filtros">
        <CampoSelecao rotulo="Status" textoVazio="Todos" valor={status} aoAlterar={setStatus} opcoes={STATUS} />
        <CampoSelecao rotulo="Tipo" textoVazio="Todos" valor={tipo} aoAlterar={setTipo} opcoes={props.tipos} />
        <CampoSelecao rotulo="Local" textoVazio="Todos" valor={local} aoAlterar={setLocal} opcoes={props.locais} />
        <CampoSelecao rotulo="Prioridade" textoVazio="Todas" valor={prioridade} aoAlterar={setPrioridade} opcoes={props.prioridades} />
      </div>

      {temFiltro && (
        <button className="botao-link-texto" onClick={limparFiltros}>Limpar busca e filtros</button>
      )}

      {conteudo}
    </div>
  );
}

export default PaginaInicial;