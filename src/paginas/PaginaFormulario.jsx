import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormularioChamado from "../components/FormularioChamado";
import MensagemErro from "../components/MensagemErro";
import { buscarChamado, criarChamado, atualizarChamado } from "../services/chamadoService";
import mensagemDeErro from "../services/mensagemDeErro";

function PaginaFormulario(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(editando);
  const [erroCarregar, setErroCarregar] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(function () {
    if (!editando) {
      return;
    }

    async function carregar() {
      try {
        const dados = await buscarChamado(id);
        setChamado(dados);
      } catch (e) {
        setErroCarregar("Não foi possível carregar. " + mensagemDeErro(e));
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id, editando]);

  async function aoSalvar(dados) {
    setEnviando(true);
    setErro("");
    try {
      if (editando) {
        await atualizarChamado(id, dados);
        navigate("/chamado/" + id);
      } else {
        const criado = await criarChamado(dados);
        if (criado && criado.id) {
          navigate("/chamado/" + criado.id);
        } else {
          navigate("/");
        }
      }
    } catch (e) {
      setErro(mensagemDeErro(e));
      setEnviando(false);
    }
  }

  function aoCancelar() {
    if (editando) {
      navigate("/chamado/" + id);
    } else {
      navigate("/");
    }
  }

  if (carregando) {
    return <p className="estado">Carregando chamado...</p>;
  }

  if (erroCarregar) {
    return (
      <div className="pagina-formulario">
        <Link to="/" className="voltar">← Voltar</Link>
        <MensagemErro mensagem={erroCarregar} />
      </div>
    );
  }

  if (editando && chamado && chamado.status === "resolvido") {
    return (
      <div className="pagina-formulario">
        <Link to={"/chamado/" + id} className="voltar">← Voltar</Link>
        <MensagemErro mensagem="Chamados resolvidos não podem ser editados." />
      </div>
    );
  }

  return (
    <div className="pagina-formulario">
      <Link to={editando ? "/chamado/" + id : "/"} className="voltar">← Voltar</Link>
      <h2>{editando ? "Editar chamado" : "Abrir chamado"}</h2>
      <MensagemErro mensagem={erro} />
      <FormularioChamado
        chamadoInicial={chamado}
        tipos={props.tipos}
        locais={props.locais}
        prioridades={props.prioridades}
        aoSalvar={aoSalvar}
        aoCancelar={aoCancelar}
        enviando={enviando}
      />
    </div>
  );
}

export default PaginaFormulario;