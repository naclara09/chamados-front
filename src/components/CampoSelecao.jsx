function textoDaOpcao(opcao) {
  if (typeof opcao === "string") {
    return opcao;
  }
  if (opcao && typeof opcao === "object") {
    return opcao.nome || opcao.valor || opcao.value || opcao.descricao || String(Object.values(opcao)[0]);
  }
  return String(opcao);
}

function CampoSelecao(props) {

  function aoEscolher(evento) {
    props.aoAlterar(evento.target.value);
  }

  const opcoes = [];

  for (let i = 0; i < props.opcoes.length; i++) {
    const texto = textoDaOpcao(props.opcoes[i]);
    opcoes.push(
      <option key={texto} value={texto}>{texto}</option>
    );
  }

  return (
    <div className="campo-texto">
      <label>{props.rotulo}</label>
      <select value={props.valor} onChange={aoEscolher} required={props.obrigatorio}>
        <option value="">{props.textoVazio || "Selecione..."}</option>
        {opcoes}
      </select>
    </div>
  );
}

export default CampoSelecao;