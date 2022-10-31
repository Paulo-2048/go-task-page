try {
  let cksAcess = JSON.parse(window.Cookies.get("userData")).token;
  if (cksAcess == "NA") {
    throw "Não Autorizado";
  }
} catch (error) {
  if (location.pathname != "/pages/login.html")
    window.location.replace("/pages/login.html");
}
