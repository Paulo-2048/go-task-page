
let isLogin = false;

try {
  let cksAcess = JSON.parse(window.Cookies.get("userData")).token;
  isLogin = true;
  if (cksAcess == "NA") {
    throw "Não Autorizado";
  }
} catch (error) {
  if (location.pathname != "/pages/login.html")
    window.location.replace("/pages/login.html");
}

const loginButton = document.getElementById("btnLogin");
const registerButton = document.getElementById("btnRegister");
const logoutButton = document.getElementById("btnLogout");

if(isLogin){
  loginButton.classList.add("d-none");
  registerButton.classList.add("d-none");
  logoutButton.classList.remove("d-none");
}

logoutButton.addEventListener("click", () => {
  window.Cookies.remove("userData");
  window.location.replace("/pages/login.html");
})