import { paraClasse } from "../utils/formatarData";

function Selo(props) {
  return (
    <span className={"selo " + props.tipo + "-" + paraClasse(props.texto)}>
      {props.texto}
    </span>
  );
}

export default Selo;