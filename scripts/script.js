document
  .getElementById("userRegistration")
  .addEventListener("click", modalOpen);
document.getElementById("modalClose").addEventListener("click", modalClose);
document.getElementById("saveValues").addEventListener("click", saveValues);
document.getElementById("cancelButton").addEventListener("click", modalClose);

function modalOpen() {
  document.querySelector("h2").innerText = "Novo Usuário";
  document.getElementById("saveValues").innerText = "Salvar";
  document.getElementById("modal").classList.add("active");
}

function modalClose() {
  document.getElementById("modal").classList.remove("active");
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("cel").value = "";
  document.getElementById("city").value = "";
}

const celInput = document.getElementById("cel");
celInput.addEventListener("input", function (event) {
  let value = event.target.value.replace(/\D/g, "");

  let formattedValue = "";
  if (value.length > 0) {
    formattedValue += "(" + value.substring(0, 2);
  }
  if (value.length > 2) {
    formattedValue += ") " + value.substring(2, 7);
  }
  if (value.length > 7) {
    formattedValue += "-" + value.substring(7, 11);
  }
  event.target.value = formattedValue;
});

function gerarId() {
  let idUser = 0;
  if (localStorage.getItem("lastUserId")) {
    idUser = JSON.parse(localStorage.getItem("lastUserId"));
  }
  idUser++;
  localStorage.setItem("lastUserId", JSON.stringify(idUser));
  return idUser;
}

// Função para salvar os valores do formulário no localStorage
function saveValues() {
  let listData = [];

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const cel = document.getElementById("cel").value;
  const city = document.getElementById("city").value;

  if (name && email && city && cel) {
    const data = {
      idUser: gerarId(),
      name: name,
      email: email,
      cel: cel,
      city: city,
    };

    if (localStorage.getItem("users")) {
      listData = JSON.parse(localStorage.getItem("users"));
    }

    listData.push(data);
    localStorage.setItem("users", JSON.stringify(listData));
    console.log(data);

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("cel").value = "";
    document.getElementById("city").value = "";

    modalClose();
    insertTable(); // Chama a função para atualizar a tabela

  } else {
    alert("Preencha todos os campos!!!");
  }
}

function insertTable() {
  let listData = [];
  let tableData = document.getElementById("tbody");
  if (localStorage.getItem("users")) {
    listData = JSON.parse(localStorage.getItem("users"));
    let template = "";

    listData.forEach((user) => {
      template += `<tr>
            <td> ${user.name}</td>
            <td> ${user.email}</td>
            <td> ${user.cel}</td>
            <td> ${user.city}</td>
            <td>
                <button type="button" class="button green" onclick="updateUser(${user.idUser})">Editar</button>
                <button type="button" class="button red" onclick="deleteUser(${user.idUser})">Excluir</button>
            </td>
        </tr>`;
    });
    tableData.innerHTML = template;
  }

  if (listData.length == 0) {
    tableData.innerHTML = `<tr><td class="empty-message" colspan="5"> Nenhum usuário cadastrado!</td></tr>`;
  }
}

function updateUser(idUser) {
  document
    .getElementById("saveValues")
    .removeEventListener("click", saveValues);

  modalOpen();
  const textTitleUpdateUser = document.querySelector("h2");
  textTitleUpdateUser.innerText = "Editar Usuario";
  document.getElementById("saveValues").innerText = "Atualizar";

  const getUserData = JSON.parse(localStorage.getItem("users"));
  const userData = getUserData.find((userId) => userId.idUser === idUser);

  document.getElementById("name").value = `${userData.name}`;
  document.getElementById("email").value = `${userData.email}`;
  document.getElementById("cel").value = `${userData.cel}`;
  document.getElementById("city").value = `${userData.city}`;

  document
    .getElementById("saveValues")
    .addEventListener("click", () => updateUserInfo(idUser));
}

function updateUserInfo(idUser) {
  const newName = document.getElementById("name").value;
  const newEmail = document.getElementById("email").value;
  const newCel = document.getElementById("cel").value;
  const newCity = document.getElementById("city").value;

  if(newName && newEmail && newCel && newCity){
  const userList = JSON.parse(localStorage.getItem("users")) || [];
  const userIndexFind = userList.findIndex((user) => user.idUser == idUser);

 

  if (userIndexFind !== -1) {
    userList[userIndexFind].name = newName;
    userList[userIndexFind].cel = newCel;
    userList[userIndexFind].email = newEmail;
    userList[userIndexFind].city = newCity;

    localStorage.setItem("users", JSON.stringify(userList));

    modalClose();
  }
}else{
  alert("Prencha todos os dados para atualizar!")
  return;
}
  window.location.reload();
}

window.addEventListener("DOMContentLoaded", insertTable);

function deleteUser(idUser) {
  const getUserData = JSON.parse(localStorage.getItem("users"));

  const findUser = getUserData.findIndex((user) => user.idUser == idUser);

  if (findUser !== -1) {
    getUserData.splice(findUser, 1);
    localStorage.setItem("users", JSON.stringify(getUserData));
    insertTable();

  }
}

