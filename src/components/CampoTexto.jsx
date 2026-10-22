function CampoTexto(props) {

  function aoDigitar(evento) {
    const valorDigitado = evento.target.value;
    props.aoAlterar(valorDigitado);
  }
  
  let campo;

  if (props.tipo === "textarea") {
    campo = (
      <textarea
        rows="4"
        value={props.valor}
        onChange={aoDigitar}
        placeholder={props.dica}
        required={props.obrigatorio}
      />
    );
  } else {
    campo = (
      <input
        type={props.tipo || "text"}
        value={props.valor}
        onChange={aoDigitar}
        placeholder={props.dica}
        required={props.obrigatorio}
      />
    );
  }

  return (
    <div className="campo-texto">
      <label>{props.rotulo}</label>
      {campo}
    </div>
  );
}

export default CampoTexto;