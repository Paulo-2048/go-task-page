const token = JSON.parse(window.Cookies.get("userData")).token;

let notesList;
let options;

// Carregar notas
options = {
  method: "GET",
  url: "https://gototask.herokuapp.com/todo",
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
    finishNoteListener();
    deleteNoteListener();
  })
  .catch((error) => {
    console.error(error);
  });

function setNotes(notes) {
  notesList = document.querySelector(".notes-list");

  notes.forEach((note) => {
    let noteFinishAction = document.createElement("a");
    // noteDeleteAction.href = "#";
    noteFinishAction.classList.add(
      "btn",
      "btn-secondary",
      "me-1",
      "finish-note"
    );
    noteFinishAction.innerHTML = "Finish";

    let noteDeleteAction = document.createElement("a");
    // noteDeleteAction.href = "#";
    noteDeleteAction.classList.add("btn", "btn-danger", "me-1", "delete-note");
    noteDeleteAction.innerHTML = "Delete";

    let noteEditAction = document.createElement("a");
    // noteEditAction.href = "#";
    noteEditAction.classList.add("btn", "btn-primary", "me-1", "edit-note");
    noteEditAction.innerHTML = "Edit";

    let noteCardStartDate = document.createElement("p");
    noteCardStartDate.classList.add("card-text", "start-date");
    let startData = new Date(note.createdAt);
    noteCardStartDate.innerHTML =
      "Create: " +
      startData.getDate() +
      "/" +
      (startData.getMonth() + 1) +
      "/" +
      startData.getFullYear();

    let noteCardEndDate = document.createElement("p");
    noteCardEndDate.classList.add("card-text", "end-date");
    if (note.finishedAt != null) {
      let endData = new Date(note.finishedAt);
      noteCardEndDate.innerHTML =
        "Finish: " +
        endData.getDate() +
        "/" +
        (endData.getMonth() + 1) +
        "/" +
        endData.getFullYear();
    } else {
      noteCardEndDate.innerHTML = "Not finished yet";
    }

    let noteCardText = document.createElement("p");
    noteCardText.classList.add("card-text");
    noteCardText.innerHTML = note.description;

    let noteCardTitle = document.createElement("h5");
    noteCardTitle.classList.add("card-title");
    noteCardTitle.innerHTML = note.resume;

    let noteCardInfo = document.createElement("div");

    let noteCardContentText = document.createElement("div");
    noteCardContentText.classList.add("me-2");

    let noteCardContent = document.createElement("div");
    noteCardContent.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-start"
    );

    let noteCardBody = document.createElement("div");
    noteCardBody.classList.add("card-body");

    let noteCard = document.createElement("div");
    noteCard.classList.add("card");
    noteCard.id = "note_" + note.id;

    let separator = document.createElement("hr");
    separator.id = "separator_" + note.id;

    noteCardInfo.appendChild(noteCardStartDate);
    noteCardInfo.appendChild(noteCardEndDate);

    noteCardContentText.appendChild(noteCardTitle);
    noteCardContentText.appendChild(noteCardText);

    noteCardContent.appendChild(noteCardContentText);
    noteCardContent.appendChild(noteCardInfo);

    noteCardBody.appendChild(noteCardContent);
    if (note.finishedAt == null) {
      noteCardBody.appendChild(noteEditAction);
      noteCardBody.appendChild(noteFinishAction);
    }
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
  let note;

  const card = document.querySelector(`#${noteId}`);

  const cardContent = card.querySelector(".card-body");

  card.querySelector(".edit-note").remove();
  card.querySelector(".delete-note").remove();

  const cardTitle = card.querySelector(".card-title");
  let currentResume = cardTitle.innerHTML;

  const cardText = card.querySelector(".card-text");
  let currentDescription = cardText.innerHTML;

  const cardStartDate = card.querySelector(".start-date");
  let currentStartDate = cardStartDate.innerHTML;

  const cardEndDate = card.querySelector(".end-date");
  let currentEndDate = cardEndDate.innerHTML;

  cardContent.remove();

  let noteCardContent = document.createElement("div");
  noteCardContent.classList.add("card-body");

  let noteEditResume = document.createElement("input");
  noteEditResume.classList.add("form-control", "mb-2");
  noteEditResume.id = "resume";
  noteEditResume.value = currentResume;

  let noteEditText = document.createElement("textarea");
  noteEditText.classList.add("form-control", "mb-2");
  noteEditText.id = "description";
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

  note = {
    id: noteId,
    resume: currentResume,
    description: currentDescription,
    createdAt: currentStartDate,
    finishedAt: currentEndDate,
  };

  noteEditSaveAction.addEventListener("click", (e) => {
    const resume = e.target.parentElement.querySelector("input").value;
    const description = e.target.parentElement.querySelector("textarea").value;
    if (verifyFields(e)) {
      updateNoteAPI(noteId, resume, description);
      note.currentResume = resume;
      note.currentDescription = description;
      editNoteSave(note, e);
    }
  });

  noteEditCancelAction.addEventListener("click", (e) => {
    editNoteCancel(note, e);
  });
}

function editNoteSave(note, element) {
  const card = element.target.parentElement.parentElement;
  element.target.parentElement.remove();

  let noteFinishAction = document.createElement("a");
  // noteDeleteAction.href = "#";
  noteFinishAction.classList.add("btn", "btn-secondary", "me-1", "finish-note");
  noteFinishAction.innerHTML = "Finish";

  let noteDeleteAction = document.createElement("a");
  // noteDeleteAction.href = "#";
  noteDeleteAction.classList.add("btn", "btn-danger", "delete-note");
  noteDeleteAction.innerHTML = "Delete";

  let noteEditAction = document.createElement("a");
  // noteEditAction.href = "#";
  noteEditAction.classList.add("btn", "btn-primary", "me-1", "edit-note");
  noteEditAction.innerHTML = "Edit";

  let noteCardStartDate = document.createElement("p");
  noteCardStartDate.classList.add("card-text", "start-date");
  noteCardStartDate.innerHTML = note.createdAt;

  let noteCardEndDate = document.createElement("p");
  noteCardEndDate.classList.add("card-text", "end-date");
  if (note.finishedAt != "Not finished yet") {
    noteCardEndDate.innerHTML = note.finishedAt;
  } else {
    noteCardEndDate.innerHTML = "Not finished yet";
  }

  let noteCardText = document.createElement("p");
  noteCardText.classList.add("card-text");
  noteCardText.innerHTML = note.currentDescription;

  let noteCardTitle = document.createElement("h5");
  noteCardTitle.classList.add("card-title");
  noteCardTitle.innerHTML = note.currentResume;

  let noteCardInfo = document.createElement("div");

  let noteCardContentText = document.createElement("div");
  noteCardContentText.classList.add("me-2");

  let noteCardContent = document.createElement("div");
  noteCardContent.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-start"
  );

  let noteCardBody = document.createElement("div");
  noteCardBody.classList.add("card-body");

  noteCardInfo.appendChild(noteCardStartDate);
  noteCardInfo.appendChild(noteCardEndDate);

  noteCardContentText.appendChild(noteCardTitle);
  noteCardContentText.appendChild(noteCardText);

  noteCardContent.appendChild(noteCardContentText);
  noteCardContent.appendChild(noteCardInfo);

  noteCardBody.appendChild(noteCardContent);
  noteCardBody.appendChild(noteEditAction);
  noteCardBody.appendChild(noteFinishAction);
  noteCardBody.appendChild(noteDeleteAction);

  card.appendChild(noteCardBody);

  editNoteListener();
  finishNoteListener();
  deleteNoteListener();

  //card.appendChild(noteCard);
  //card.appendChild(separator);
}

function editNoteCancel(note, element) {
  const card = element.target.parentElement.parentElement;
  element.target.parentElement.remove();

  let noteFinishAction = document.createElement("a");
  // noteDeleteAction.href = "#";
  noteFinishAction.classList.add("btn", "btn-secondary", "me-1", "finish-note");
  noteFinishAction.innerHTML = "Finish";

  let noteDeleteAction = document.createElement("a");
  // noteDeleteAction.href = "#";
  noteDeleteAction.classList.add("btn", "btn-danger", "delete-note");
  noteDeleteAction.innerHTML = "Delete";

  let noteEditAction = document.createElement("a");
  // noteEditAction.href = "#";
  noteEditAction.classList.add("btn", "btn-primary", "me-1", "edit-note");
  noteEditAction.innerHTML = "Edit";

  let noteCardStartDate = document.createElement("p");
  noteCardStartDate.classList.add("card-text", "start-date");
  noteCardStartDate.innerHTML = note.createdAt;

  let noteCardEndDate = document.createElement("p");
  noteCardEndDate.classList.add("card-text", "end-date");
  if (note.finishedAt != "Not finished yet") {
    noteCardEndDate.innerHTML = note.finishedAt;
  } else {
    noteCardEndDate.innerHTML = "Not finished yet";
  }

  let noteCardText = document.createElement("p");
  noteCardText.classList.add("card-text");
  noteCardText.innerHTML = note.description;

  let noteCardTitle = document.createElement("h5");
  noteCardTitle.classList.add("card-title");
  noteCardTitle.innerHTML = note.resume;

  let noteCardInfo = document.createElement("div");

  let noteCardContentText = document.createElement("div");
  noteCardContentText.classList.add("me-2");

  let noteCardContent = document.createElement("div");
  noteCardContent.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-start"
  );

  let noteCardBody = document.createElement("div");
  noteCardBody.classList.add("card-body");

  // let noteCard = document.createElement("div");
  // noteCard.classList.add("card");
  // noteCard.id = "note_" + noteId;

  noteCardInfo.appendChild(noteCardStartDate);
  noteCardInfo.appendChild(noteCardEndDate);

  noteCardContentText.appendChild(noteCardTitle);
  noteCardContentText.appendChild(noteCardText);

  noteCardContent.appendChild(noteCardContentText);
  noteCardContent.appendChild(noteCardInfo);

  noteCardBody.appendChild(noteCardContent);
  noteCardBody.appendChild(noteEditAction);
  noteCardBody.appendChild(noteFinishAction);
  noteCardBody.appendChild(noteDeleteAction);

  card.appendChild(noteCardBody);

  editNoteListener();
  finishNoteListener();
  deleteNoteListener();

  //card.appendChild(noteCard);
  //card.appendChild(separator);
}

function updateNoteAPI(noteId, resume, description) {
  noteId = parseInt(noteId.replace("note_", ""));

  console.log(noteId);
  console.log(resume);
  console.log(description);

  options = {
    method: "PATCH",
    url: "https://gototask.herokuapp.com/todo/edit",
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
    .then((response) => {})
    .catch((error) => {
      console.error(error);
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

  options = {
    method: "DELETE",
    url: "https://gototask.herokuapp.com/todo/" + noteId,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  window.axios
    .request(options)
    .then((response) => {
      deleteNote(noteId);
    })
    .catch((error) => {
      console.error(error);
    });
}

function deleteNote(noteId) {
  const note = document.querySelector("#note_" + noteId);
  const separator = document.querySelector("#separator_" + noteId);
  note.remove();
  separator.remove();
}

// Finalizar Notas

function finishNoteListener() {
  const finishButton = document.querySelectorAll(".finish-note");

  finishButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      const noteId = e.target.parentElement.parentElement.id;
      console.log(noteId);
      finishNoteAPI(noteId);
      finishNote(noteId, e);
    });
  });
}

function finishNote(noteId, element) {
  const today = new Date();

  const card = element.target.parentElement.parentElement;
  card.querySelector(".end-date").innerHTML =
    "Finish: " + today.toLocaleDateString("pt-BR");

  card.querySelector(".edit-note").remove();
  card.querySelector(".finish-note").remove();
}

function finishNoteAPI(noteId) {
  noteId = noteId.replace("note_", "");

  options = {
    method: "PATCH",
    url: "https://gototask.herokuapp.com/todo/finish/" + noteId,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  window.axios
    .request(options)
    .then((response) => {})
    .catch((error) => {
      console.error(error);
    });
}

// Outras Lógicas

const createNewButton = document.querySelector("#btnCreateNew");

createNewButton.addEventListener("click", () => {
  window.location.href = "createNew-blank.html";
});

function verifyFields(e) {
  const resume = e.target.parentElement.querySelector("input").value;
  const description = e.target.parentElement.querySelector("textarea").value;

  if (resume == "" || description == "") {
    e.preventDefault();
    alert("Please fill all fields");
    return false;
  } else {
    return true;
  }
}
