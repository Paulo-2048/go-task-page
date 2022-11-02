const login = document.querySelector("#login-btn");

const viewPassword = document.querySelector("#view-password");

viewPassword.addEventListener("click", () => {
  if (password.type == "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
});

login.addEventListener("click", (e) => {
  e.preventDefault();

  let form = document.querySelector("#login-form");

  const email = form.email.value;
  const password = form.password.value;

  const options = {
    method: "POST",
    url: "https://gototask-api.herokuapp.com/jwt/login",
    headers: { "Content-Type": "application/json" },
    data: {
      username: email,
      password: password,
    },
  };

  window.axios
    .request(options)
    .then((response) => {
      if (response.data.token == undefined) {throw "Usuário não encontrado";}

      // set cookie
      window.Cookies.set("userData", JSON.stringify(response.data), {
        expires: 1,
      });
      window.location.assign("/index.html");
    })
    .catch((error) => {
      // handle error
      console.error(error);
      alert("Erro na autenticação");
    });
});
