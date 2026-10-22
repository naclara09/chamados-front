import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import BarraNavegacao from "./components/BarraNavegacao";
import PaginaInicial from "./paginas/PaginaInicial";
import PaginaDetalhe from "./paginas/PaginaDetalhe";
import PaginaFormulario from "./paginas/PaginaFormulario";
import {
  buscarUsuario,
  listarTipos,
  listarLocais,
  listarPrioridades,
} from "./services/chamadoService";

function App() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [erroUsuario, setErroUsuario] = useState(false);
  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  useEffect(function () {
    async function carregarUsuario() {
      try {
        const dados = await buscarUsuario();
        setNomeUsuario(dados.nome || dados.name || dados.dono || "");
      } catch {
        setErroUsuario(true);
      }
    }
    carregarUsuario();
  }, []);

  useEffect(function () {
    async function carregarOpcoes() {
      try {
        setTipos(await listarTipos());
        setLocais(await listarLocais());
        setPrioridades(await listarPrioridades());
      } catch {
        setTipos([]);
        setLocais([]);
        setPrioridades([]);
      }
    }
    carregarOpcoes();
  }, []);

  return (
    <div className="App">
      <header className="cabecalho">
        <img
          src="/IFRN.png"
          alt="Logo IFRN"
          className="logo-ifrn"
          onError={function (e) { e.target.style.display = "none"; }}
        />
        <div>
          <h1>Zelo</h1>
          <p>Chamados de manutenção do campus</p>
        </div>
      </header>

      <BarraNavegacao nomeUsuario={nomeUsuario} erroUsuario={erroUsuario} />

      <Routes>
        <Route
          path="/"
          element={<PaginaInicial tipos={tipos} locais={locais} prioridades={prioridades} />}
        />
        <Route path="/chamado/:id" element={<PaginaDetalhe />} />
        <Route
          path="/novo"
          element={<PaginaFormulario tipos={tipos} locais={locais} prioridades={prioridades} />}
        />
        <Route
          path="/editar/:id"
          element={<PaginaFormulario tipos={tipos} locais={locais} prioridades={prioridades} />}
        />
        <Route
          path="*"
          element={
            <div className="estado">
              <p>Página não encontrada.</p>
              <Link to="/" className="botao-link">Voltar ao início</Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;