const token = JSON.parse(window.Cookies.get("userData")).token;

let notesList;
let options;

// Carregar notas
options = {
  method: "GET",
  url: "https://gototask-api.herokuapp.com/todo",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
};

window.axios
  .request(options)
  .then((response) => {
    console.log(response.data);
    setNotes(response.data);
    editNoteListener();
    deleteNoteListener();
  })
  .catch((error) => {
    // handle error
    console.error(error);
    //alert("Ocorreu um erro ao tentar carregar as notas");
  });

function setNotes(notes) {
  notesList = document.querySelector(".notes-list");

  notes.forEach((note) => {
    let noteDeleteAction = document.createElement("a");
    // noteDeleteAction.href = "#";
    noteDeleteAction.classList.add("btn", "btn-danger", "delete-note");
    noteDeleteAction.innerHTML = "Delete";

    let noteEditAction = document.createElement("a");
    // noteEditAction.href = "#";
    noteEditAction.classList.add("btn", "btn-primary", "me-1", "edit-note");
    noteEditAction.innerHTML = "Edit";

    let noteCardText = document.createElement("p");
    noteCardText.classList.add("card-text");
    noteCardText.innerHTML = note.description;

    let noteCardTitle = document.createElement("h5");
    noteCardTitle.classList.add("card-title");
    noteCardTitle.innerHTML = note.resume;

    let noteCardBody = document.createElement("div");
    noteCardBody.classList.add("card-body");

    let noteCard = document.createElement("div");
    noteCard.classList.add("card");
    noteCard.id = "note_" + note.id;

    let separator = document.createElement("hr");
    separator.id = "separator_" + note.id;

    noteCardBody.appendChild(noteCardTitle);
    noteCardBody.appendChild(noteCardText);
    noteCardBody.appendChild(noteEditAction);
    noteCardBody.appendChild(noteDeleteAction);

    noteCard.appendChild(noteCardBody);

    notesList.appendChild(noteCard);
    notesList.appendChild(separator);
  });
}

// Editar Notas

function editNoteListener() {
  const editButton = document.querySelectorAll(".edit-note");

  editButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      const noteId = e.target.parentElement.parentElement.id;
      editNote(noteId);
    });
  });
}

function editNote(noteId) {
  const card = document.querySelector(`#${noteId}`);

  const cardContent = card.querySelector(".card-body");

  card.querySelector(".edit-note").remove();
  card.querySelector(".delete-note").remove();

  const cardTitle = card.querySelector(".card-title");
  let currentResume = cardTitle.innerHTML;

  const cardText = card.querySelector(".card-text");
  let currentDescription = cardText.innerHTML;

  cardContent.remove();

  let noteCardContent = document.createElement("div");
  noteCardContent.classList.add("card-body");

  let noteEditResume = document.createElement("input");
  noteEditResume.classList.add("form-control", "mb-2");
  noteEditResume.value = currentResume;

  let noteEditText = document.createElement("textarea");
  noteEditText.classList.add("form-control", "mb-2");
  noteEditText.innerText = currentDescription;

  let noteEditSaveAction = document.createElement("a");
  noteEditSaveAction.classList.add("btn", "btn-primary", "me-1", "edit-note");
  noteEditSaveAction.innerHTML = "Save";

  let noteEditCancelAction = document.createElement("a");
  noteEditCancelAction.classList.add("btn", "btn-danger", "edit-note");
  noteEditCancelAction.innerHTML = "Cancel";

  noteCardContent.appendChild(noteEditResume);
  noteCardContent.appendChild(noteEditText);
  noteCardContent.appendChild(noteEditSaveAction);
  noteCardContent.appendChild(noteEditCancelAction);
  card.appendChild(noteCardContent);

  noteEditSaveAction.addEventListener("click", (e) => {
    const resume = e.target.parentElement.querySelector("input").value;
    const description = e.target.parentElement.querySelector("textarea").value;
    updateNoteAPI(noteId, resume, description);
    editNoteSave(resume, description, e);
  });

  noteEditCancelAction.addEventListener("click", (e) => {
    editNoteCancel(currentResume, currentDescription, e);
  });
}

function editNoteSave(resume, description, element) {
  const card = element.target.parentElement.parentElement;
  element.target.parentElement.remove();

  let noteDeleteAction = document.createElement("a");
  // noteDeleteAction.href = "#";
  noteDeleteAction.classList.add("btn", "btn-danger", "delete-note");
  noteDeleteAction.innerHTML = "Delete";

  let noteEditAction = document.createElement("a");
  // noteEditAction.href = "#";
  noteEditAction.classList.add("btn", "btn-primary", "me-1", "edit-note");
  noteEditAction.innerHTML = "Edit";

  let noteCardText = document.createElement("p");
  noteCardText.classList.add("card-text");
  noteCardText.innerHTML = description;

  let noteCardTitle = document.createElement("h5");
  noteCardTitle.classList.add("card-title");
  noteCardTitle.innerHTML = resume;

  let noteCardBody = document.createElement("div");
  noteCardBody.classList.add("card-body");

  // let noteCard = document.createElement("div");
  // noteCard.classList.add("card");
  // noteCard.id = "note_" + noteId;

  let separator = document.createElement("hr");

  noteCardBody.appendChild(noteCardTitle);
  noteCardBody.appendChild(noteCardText);
  noteCardBody.appendChild(noteEditAction);
  noteCardBody.appendChild(noteDeleteAction);

  card.appendChild(noteCardBody);

  editNoteListener();

  //card.appendChild(noteCard);
  //card.appendChild(separator);
}

function editNoteCancel(resume, description, element) {
  const card = element.target.parentElement.parentElement;
  element.target.parentElement.remove();

  let noteDeleteAction = document.createElement("a");
  // noteDeleteAction.href = "#";
  noteDeleteAction.classList.add("btn", "btn-danger", "delete-note");
  noteDeleteAction.innerHTML = "Delete";

  let noteEditAction = document.createElement("a");
  // noteEditAction.href = "#";
  noteEditAction.classList.add("btn", "btn-primary", "me-1", "edit-note");
  noteEditAction.innerHTML = "Edit";

  let noteCardText = document.createElement("p");
  noteCardText.classList.add("card-text");
  noteCardText.innerHTML = description;

  let noteCardTitle = document.createElement("h5");
  noteCardTitle.classList.add("card-title");
  noteCardTitle.innerHTML = resume;

  let noteCardBody = document.createElement("div");
  noteCardBody.classList.add("card-body");

  // let noteCard = document.createElement("div");
  // noteCard.classList.add("card");
  // noteCard.id = "note_" + noteId;

  let separator = document.createElement("hr");

  noteCardBody.appendChild(noteCardTitle);
  noteCardBody.appendChild(noteCardText);
  noteCardBody.appendChild(noteEditAction);
  noteCardBody.appendChild(noteDeleteAction);

  card.appendChild(noteCardBody);

  editNoteListener();

  //card.appendChild(noteCard);
  //card.appendChild(separator);
}

function updateNoteAPI(noteId, resume, description) {
  noteId = noteId.replace("note_", "");
  console.log(resume, description);

  options = {
    method: "PATCH",
    url: "https://gototask-api.herokuapp.com/todo/edit",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: {
      id: noteId,
      resume: resume,
      description: description,
    },
  };

  window.axios
    .request(options)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      // handle error
      console.error(error);
      //alert("Ocorreu um erro ao tentar carregar as notas");
    });
}

// Deletar Notas
function deleteNoteListener() {
  const deleteButton = document.querySelectorAll(".delete-note");

  deleteButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      const noteId = e.target.parentElement.parentElement.id;
      deleteNoteAPI(noteId);
    });
  });
}

function deleteNoteAPI(noteId) {
  noteId = noteId.replace("note_", "");

  console.log(noteId);

  options = {
    method: "DELETE",
    url: "https://gototask-api.herokuapp.com/todo/" + noteId,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  window.axios
    .request(options)
    .then((response) => {
      console.log(response.data);
      deleteNote(noteId);
    })
    .catch((error) => {
      // handle error
      console.error(error);
      // alert("Ocorreu um erro ao tentar deletar a notas");
    });
}

function deleteNote(noteId) {
  const note = document.querySelector("#note_" + noteId);
  const separator = document.querySelector("#separator_" + noteId);
  note.remove();
  separator.remove();
}