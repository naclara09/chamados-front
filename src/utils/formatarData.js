export function formatarData(iso) {
  if (!iso) {
    return "—";
  }
  const partes = iso.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

export function dataDeHoje() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return agora.getFullYear() + "-" + mes + "-" + dia;
}

export function paraClasse(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}