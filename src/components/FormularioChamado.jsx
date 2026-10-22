import { useState } from "react";
import CampoTexto from "./CampoTexto";
import CampoSelecao from "./CampoSelecao";
import { dataDeHoje } from "../utils/formatarData";

function FormularioChamado(props) {
  const inicial = props.chamadoInicial;

  const [titulo, setTitulo] = useState(inicial ? inicial.titulo : "");
  const [descricao, setDescricao] = useState(inicial ? inicial.descricao : "");
  const [tipo, setTipo] = useState(inicial ? inicial.tipo : "");
  const [local, setLocal] = useState(inicial ? inicial.local : "");
  const [prioridade, setPrioridade] = useState(inicial ? inicial.prioridade : "");
  const [dataAbertura, setDataAbertura] = useState(inicial ? inicial.data_abertura : dataDeHoje());

  function aoEnviar(e) {
    e.preventDefault();
    const chamado = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      tipo: tipo,
      local: local,
      prioridade: prioridade,
      data_abertura: dataAbertura,
    };
    props.aoSalvar(chamado);
  }

  return (
    <form className="formulario-chamado" onSubmit={aoEnviar}>
      <CampoTexto rotulo="Título" valor={titulo} aoAlterar={setTitulo} dica="Ex.: Ar-condicionado pingando" obrigatorio={true} />
      <CampoTexto rotulo="Descrição" tipo="textarea" valor={descricao} aoAlterar={setDescricao} dica="Conte o que está acontecendo" obrigatorio={true} />
      <CampoSelecao rotulo="Tipo" valor={tipo} aoAlterar={setTipo} opcoes={props.tipos} obrigatorio={true} />
      <CampoSelecao rotulo="Local" valor={local} aoAlterar={setLocal} opcoes={props.locais} obrigatorio={true} />
      <CampoSelecao rotulo="Prioridade" valor={prioridade} aoAlterar={setPrioridade} opcoes={props.prioridades} obrigatorio={true} />
      <CampoTexto rotulo="Data de abertura" tipo="date" valor={dataAbertura} aoAlterar={setDataAbertura} obrigatorio={true} />

      <div className="acoes">
        <button type="submit" className="botao-principal" disabled={props.enviando}>
          {props.enviando ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" className="botao-secundario" onClick={props.aoCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormularioChamado;