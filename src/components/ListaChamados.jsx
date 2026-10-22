import CardChamado from "./CardChamado";

function ListaChamados(props) {
  const cards = [];

  for (let i = 0; i < props.chamados.length; i++) {
    const chamado = props.chamados[i];
    cards.push(
      <CardChamado key={chamado.id} chamado={chamado} />
    );
  }

  return (
    <div className="lista-chamados">
      {cards}
    </div>
  );
}

export default ListaChamados;