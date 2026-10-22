function ConfirmacaoExclusao(props) {
  return (
    <div className="fundo-confirmacao">
      <div className="caixa-confirmacao">
        <p>Tem certeza que deseja excluir este chamado?</p>
        <div className="acoes">
          <button className="botao-perigo" onClick={props.aoConfirmar} disabled={props.enviando}>
            {props.enviando ? "Excluindo..." : "Excluir"}
          </button>
          <button className="botao-secundario" onClick={props.aoCancelar} disabled={props.enviando}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmacaoExclusao;