function mensagemDeErro(erro) {
  
    const resposta = erro.response;
  if (!resposta) {
    return "Não foi possível conectar à API. Verifique sua conexão (ou se a API local está rodando).";
  }

  const detail = resposta.data ? resposta.data.detail : null;
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const partes = [];
    for (let i = 0; i < detail.length; i++) {
      const item = detail[i];
      let campo = "";
      if (Array.isArray(item.loc) && item.loc.length > 0) {
        campo = item.loc[item.loc.length - 1] + ": ";
      }
      partes.push(campo + item.msg);
    }
    return partes.join(" · ");
  }

  if (resposta.status === 401) {
    return "Chave de API inválida. Verifique o arquivo .env.";
  }

  return "Erro " + resposta.status + " ao falar com a API.";
}

export default mensagemDeErro;