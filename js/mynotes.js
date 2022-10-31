
const token = JSON.parse(window.Cookies.get("userData")).token;

const options = {
  method: "GET",
  url: "https://gototask-api.herokuapp.com/todo",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
};

window.axios
  .request(options)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    // handle error
    console.error(error);
    alert("Ocorreu um erro ao tentar carregar as notas");
  });


