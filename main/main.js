const btn = document.querySelector(".btn");
const name = document.querySelector("#name");
const phone = document.querySelector("#phone");
const img = document.querySelector("#image");
const inp = document.querySelector(".input");
const list = document.querySelector(".contact-list");

btn.addEventListener("click", () => {
  if (!name.value.trim() || !phone.value.trim()) {
    alert("Заполните все поля!");
    return;
  }
  const contact = {
    image: "",
    name: name.value,
    phone: phone.value,
  };
  const file = img.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      contact.image = event.target.result;
      setItemToStorage(contact);
      render();
    };
    reader.readAsDataURL(file);
  } else {
    setItemToStorage(contact);
    render();
  }
});

function setItemToStorage(contact) {
  if (!localStorage.getItem("contact-book")) {
    localStorage.setItem("contact-book", "[]");
  }
  const data = JSON.parse(localStorage.getItem("contact-book"));
  data.push(contact);
  localStorage.setItem("contact-book", JSON.stringify(data));
}
function render() {
  const newData = JSON.parse(localStorage.getItem("contact-book"));
  const list = document.getElementById("list");
  list.innerHTML = "";

  newData.forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.style.maxWidth = "100%";
      card.appendChild(img);
    }

    const nameElement = document.createElement("div");
    nameElement.classList.add("name");
    nameElement.innerText = item.name;
    card.appendChild(nameElement);

    const phoneElement = document.createElement("div");
    phoneElement.classList.add("phone");
    phoneElement.innerText = item.phone;
    card.appendChild(phoneElement);

    const btnDelete = document.createElement("button");
    btnDelete.innerText = "Delete";
    btnDelete.addEventListener("click", () => {
      deleteContact(index);
      render();
    });
    btnDelete.classList.add("delete-btn");
    card.appendChild(btnDelete);

    const btnEdit = document.createElement("button");
    btnEdit.innerText = "Edit";
    btnEdit.addEventListener("click", () => {
      editContact(index);
    });
    btnEdit.classList.add("edit-btn");
    card.appendChild(btnEdit);

    list.appendChild(card);
  });
}

function deleteContact(index) {
  const data = JSON.parse(localStorage.getItem("contact-book"));
  data.splice(index, 1);
  localStorage.setItem("contact-book", JSON.stringify(data));
  render();
}
const modal = document.querySelector(".main-modal");
const editNameInput = document.querySelector("#editNameInput");
const editPhoneInput = document.querySelector("#editPhoneInput");
const btnSave = document.querySelector(".btn-save");
const btnCloser = document.querySelector(".btn-closer");

function editContact(index) {
  modal.style.display = "block";
  const data = JSON.parse(localStorage.getItem("contact-book"));
  const editedContact = data[index];
  editNameInput.value = editedContact.name;
  editPhoneInput.value = editedContact.phone;
  btnSave.setAttribute("data-index", index);
}
btnSave.addEventListener("click", () => {
  const index = parseInt(btnSave.getAttribute("data-index"));
  let data = JSON.parse(localStorage.getItem("contact-book"));
  const newName = editNameInput.value;
  const newPhone = editPhoneInput.value;
  const newImage = document.getElementById("editImageInput").files[0];

  if (!newName.trim() || !newPhone.trim()) {
    alert("Заполните все поля!");
    return;
  }

  data[index].name = newName;
  data[index].phone = newPhone;
  if (newImage) {
    const reader = new FileReader();
    reader.onload = function (event) {
      data[index].image = event.target.result;
      localStorage.setItem("contact-book", JSON.stringify(data));
      modal.style.display = "none";
      render();
    };
    reader.readAsDataURL(newImage);
  } else {
    localStorage.setItem("contact-book", JSON.stringify(data));
    modal.style.display = "none";

    render();
  }
});

btnCloser.addEventListener("click", () => {
  modal.style.display = "none";
});

render();
