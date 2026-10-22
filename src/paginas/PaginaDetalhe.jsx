import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Selo from "../components/Selo";
import CampoTexto from "../components/CampoTexto";
import MensagemErro from "../components/MensagemErro";
import ConfirmacaoExclusao from "../components/ConfirmacaoExclusao";
import {
  buscarChamado,
  iniciarChamado,
  resolverChamado,
  excluirChamado,
} from "../services/chamadoService";
import mensagemDeErro from "../services/mensagemDeErro";
import { formatarData } from "../utils/formatarData";

function PaginaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState("");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("erro");
  const [confirmando, setConfirmando] = useState(false);

  useEffect(function () {
    let ativo = true;

    async function carregarChamado() {
      try {
        const dados = await buscarChamado(id);
        if (ativo) {
          setChamado(dados);
          setErroCarregar("");
        }
      } catch (e) {
        if (ativo) {
          setErroCarregar("Não foi possível carregar. " + mensagemDeErro(e));
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarChamado();

    return function () {
      ativo = false;
    };
  }, [id]);

  async function aoAvancar(e) {
    e.preventDefault();
    setEnviando(true);
    setMensagem("");
    const estavaAberto = chamado.status === "aberto";
    try {
      if (estavaAberto) {
        await iniciarChamado(id, texto.trim());
      } else {
        await resolverChamado(id, texto.trim());
      }
      setTexto("");
      const atualizado = await buscarChamado(id);
      setChamado(atualizado);
      setTipoMensagem("sucesso");
      setMensagem(estavaAberto ? "Atendimento iniciado." : "Chamado resolvido.");
    } catch (erro) {
      setTipoMensagem("erro");
      setMensagem(mensagemDeErro(erro));
    } finally {
      setEnviando(false);
    }
  }

  async function aoExcluir() {
    setEnviando(true);
    setMensagem("");
    try {
      await excluirChamado(id);
      navigate("/");
    } catch (erro) {
      setConfirmando(false);
      setTipoMensagem("erro");
      setMensagem(mensagemDeErro(erro));
      setEnviando(false);
    }
  }

  if (carregando) {
    return <p className="estado">Carregando chamado...</p>;
  }

  if (erroCarregar) {
    return (
      <div className="pagina-detalhe">
        <Link to="/" className="voltar">← Voltar</Link>
        <MensagemErro mensagem={erroCarregar} />
      </div>
    );
  }

  const resolvido = chamado.status === "resolvido";
  const aberto = chamado.status === "aberto";

  return (
    <div className="pagina-detalhe">
      <Link to="/" className="voltar">← Voltar</Link>

      <div className="detalhe">
        <div className="detalhe-topo">
          <h2>{chamado.titulo}</h2>
          <div className="selos">
            <Selo tipo="status" texto={chamado.status} />
            <Selo tipo="prioridade" texto={chamado.prioridade} />
          </div>
        </div>

        <div className="campos-detalhe">
          <div className="campo-largo">
            <span className="rotulo-detalhe">Descrição</span>
            <p>{chamado.descricao}</p>
          </div>
          <div>
            <span className="rotulo-detalhe">Tipo</span>
            <p>{chamado.tipo}</p>
          </div>
          <div>
            <span className="rotulo-detalhe">Local</span>
            <p>{chamado.local}</p>
          </div>
          <div>
            <span className="rotulo-detalhe">Aberto em</span>
            <p>{formatarData(chamado.data_abertura)}</p>
          </div>
          <div>
            <span className="rotulo-detalhe">Responsável</span>
            <p>{chamado.responsavel || "—"}</p>
          </div>
          <div className="campo-largo">
            <span className="rotulo-detalhe">Solução</span>
            <p>{chamado.solucao || "—"}</p>
          </div>
          {resolvido && (
            <div>
              <span className="rotulo-detalhe">Resolvido em</span>
              <p>{formatarData(chamado.data_resolucao)}</p>
            </div>
          )}
        </div>

        <MensagemErro mensagem={mensagem} tipo={tipoMensagem} />

        {!resolvido && (
          <form className="proxima-etapa" onSubmit={aoAvancar}>
            <h3>Próxima etapa</h3>
            <CampoTexto
              rotulo={aberto ? "Responsável" : "Solução"}
              valor={texto}
              aoAlterar={setTexto}
              dica={aberto ? "Quem vai atender?" : "O que foi feito para resolver?"}
              obrigatorio={true}
            />
            <button type="submit" className="botao-principal" disabled={enviando}>
              {enviando ? "Enviando..." : aberto ? "Iniciar atendimento" : "Resolver chamado"}
            </button>
          </form>
        )}

        <div className="acoes">
          {!resolvido && (
            <Link to={"/editar/" + chamado.id} className="botao-secundario">Editar</Link>
          )}
          <button className="botao-perigo" onClick={function () { setConfirmando(true); }} disabled={enviando}>
            Excluir
          </button>
        </div>
      </div>

      {confirmando && (
        <ConfirmacaoExclusao
          aoConfirmar={aoExcluir}
          aoCancelar={function () { setConfirmando(false); }}
          enviando={enviando}
        />
      )}
    </div>
  );
}

export default PaginaDetalhe;