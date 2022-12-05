const token = JSON.parse(window.Cookies.get("userData")).token;
const submit = document.querySelector("#submit");
const contentText = document.querySelector(".content-text");

submit.addEventListener("click", (e) => {
  e.preventDefault();
  const form = document.querySelector("#form");
  let resume = form.resume.value;
  let description = form.description.value;

  if (verifyFields(resume, description)) {
    sendNote(resume, description);
  }
});

function sendNote(resume, description) {
  const options = {
    method: "POST",
    url: "https://gototask.herokuapp.com/todo/create",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: {
      resume: resume,
      description: description,
    },
  };

  window.axios
    .request(options)
    .then((response) => {
      console.log(response.data);
      clearStatusDiv();
      succefulDiv();
    })
    .catch((error) => {
      // handle error
      console.error(error);
      clearStatusDiv();
      failedDiv();
    });
}

function succefulDiv() {
  let stronText = document.createElement("strong");
  stronText.innerHTML = " Success!";

  let icon = document.createElement("i");
  icon.classList.add("bi", "bi-check-circle-fill");
  icon.style.color = "green";

  const div = document.createElement("div");
  div.classList.add("succeful", "status");

  div.appendChild(stronText);

  div.appendChild(icon);
  div.appendChild(stronText);
  div.innerHTML += " Your note was created with success!";

  contentText.appendChild(div);
}

function failedDiv() {
  let stronText = document.createElement("strong");
  stronText.innerHTML = " Fail!";

  let icon = document.createElement("i");
  icon.classList.add("bi", "bi-x-circle-fill");
  icon.style.color = "red";

  const div = document.createElement("div");
  div.classList.add("failed", "status");

  div.appendChild(stronText);

  div.appendChild(icon);
  div.appendChild(stronText);
  div.innerHTML += " Your note not was create!";

  contentText.appendChild(div);
}

function clearStatusDiv() {
  const statusDiv = document.querySelector(".status");
  if (statusDiv) {
    statusDiv.remove();
  }
}

function verifyFields(resume, description) {
  if (resume == "" || description == "") {
    
    alert("Please fill all fields");
    return false;
  } else {
    return true;
  }
}
