import { Link } from "react-router-dom";

function BarraNavegacao(props) {
  let saudacao = "Carregando...";

  if (props.erroUsuario) {
    saudacao = "Chave inválida";
  } else if (props.nomeUsuario) {
    saudacao = "Olá, " + props.nomeUsuario;
  }

  return (
    <nav className="barra-navegacao">
      <Link to="/">Chamados</Link>
      <Link to="/novo">Abrir chamado</Link>
      <span className="saudacao">{saudacao}</span>
    </nav>
  );
}

export default BarraNavegacao;