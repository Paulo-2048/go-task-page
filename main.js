try {
  let cksAcess = JSON.parse(window.Cookies.get("userData")).token;
  if (cksAcess == "NA") {
    throw "Não Autorizado";
  }
} catch (error) {
  if (location.pathname != "/login.html")
    window.location.replace("/login.html");
}
