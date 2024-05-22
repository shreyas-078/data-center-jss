const personTypeSelector = document.getElementById("stud-emp");
const branchSelector = document.getElementById("branch");
const fieldsList = document.getElementById("fields-list");
const searchBox = document.getElementById("search-bar");
const selectAllDiv = document.getElementById("select-all");
const previewButton = document.getElementById("preview-btn");
const selectAllButton = selectAllDiv.querySelector("input");

let selectedPersonType = "";
let selectedBranch = "";

branchSelector.addEventListener("change", (event) => {
  selectedBranch = event.target.value;
  if (
    selectedBranch === "none" ||
    selectedPersonType === "none" ||
    selectedPersonType === "" ||
    selectedBranch === ""
  ) {
    selectAllDiv.classList.add("invisible");
    fieldsList.innerHTML = `<p id="select-text">--SELECT YOUR BRANCH AND PERSON TYPE--</p>`;
    return;
  }
  displayFields(selectedPersonType, selectedBranch);
});

personTypeSelector.addEventListener("change", (event) => {
  selectedPersonType = event.target.value;
  if (
    selectedBranch === "none" ||
    selectedPersonType === "none" ||
    selectedPersonType === "" ||
    selectedBranch === ""
  ) {
    selectAllDiv.classList.add("invisible");
    fieldsList.innerHTML = `<p id="select-text">--SELECT YOUR BRANCH AND PERSON TYPE--</p>`;
    return;
  }

  displayFields(selectedPersonType, selectedBranch);
});

async function fetchFields(selectedPersonType, selectedBranch) {
  return fetch(`/${selectedBranch}-${selectedPersonType}-data`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const fields = data["civil-fields"];
      return fields;
    });
}

function displayFields(selectedPersonType, selectedBranch) {
  fetchFields(selectedPersonType, selectedBranch).then((fields) => {
    fieldsList.innerHTML = "";
    fields.forEach((field) => {
      const newField = document.createElement("li");
      newField.id = field;
      newField.className = "field";
      const checkBoxField = document.createElement("input");
      checkBoxField.type = "checkbox";
      const checkBoxLabel = document.createElement("label");
      checkBoxLabel.textContent = field;
      newField.appendChild(checkBoxField);
      newField.appendChild(checkBoxLabel);
      fieldsList.append(newField);
    });
  });
  selectAllDiv.classList.remove("invisible");
}

searchBox.addEventListener("input", (event) => {
  if (fieldsList.innerHTML === "") return;
  const searchTerm = event.target.value.toLowerCase();
  const checkboxes = document.querySelectorAll("#fields-list li");
  checkboxes.forEach((checkbox) => {
    const label = checkbox.querySelector("label");
    const labelText = label.textContent.toLowerCase();

    if (labelText.includes(searchTerm)) {
      checkbox.style.display = "block";
    } else {
      checkbox.style.display = "none";
    }
  });
});

selectAllButton.addEventListener("click", (event) => {
  const check = event.target.checked;
  const checkboxes = document.querySelectorAll("#fields-list li input");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = check === true ? true : false;
  });
});

previewButton.addEventListener("click", () => {
  const allFields = document.querySelectorAll("#fields-list li");
  let selectedFields = [];
  allFields.forEach((field) => {
    if (field.querySelector("input").checked === true) {
      selectedFields.push(field.querySelector("label").textContent);
    }
  });
  fetch("/return-selected-fields", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selectedFields),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);
    });
});
