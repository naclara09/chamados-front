import { Link } from "react-router-dom";
import Selo from "./Selo";
import { formatarData, paraClasse } from "../utils/formatarData";

function CardChamado(props) {
  const chamado = props.chamado;

  return (
    <Link
      to={"/chamado/" + chamado.id}
      className={"card-chamado borda-" + paraClasse(chamado.status)}
    >
      <div className="card-chamado-topo">
        <h3>{chamado.titulo}</h3>
        <div className="selos">
          <Selo tipo="status" texto={chamado.status} />
          <Selo tipo="prioridade" texto={chamado.prioridade} />
        </div>
      </div>
      <p>
        {chamado.tipo} · {chamado.local} · aberto em {formatarData(chamado.data_abertura)}
      </p>
    </Link>
  );
}

export default CardChamado;