function MensagemErro(props) {
  if (!props.mensagem) {
    return null;
  }

  const tipo = props.tipo || "erro";

  return (
    <div className={"mensagem-" + tipo}>
      <p>{props.mensagem}</p>
    </div>
  );
}

export default MensagemErro;