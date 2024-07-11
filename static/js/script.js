const personTypeSelector = document.getElementById("stud-emp");
const branchSelector = document.getElementById("branch");
const yearSelectorDiv = document.getElementById("year-selector-div");
const yearSelector = document.getElementById("year");
const fieldsList = document.getElementById("fields-list");
const searchBox = document.getElementById("search-bar");
const selectAllDiv = document.getElementById("select-all");
const previewButton = document.getElementById("preview-btn");
const selectAllButton = selectAllDiv.querySelector("input");
const selectPersonBranchText = document.getElementById("select-text");

let selectedPersonType = "";
let selectedBranch = "";
let selectedYear = "";

branchSelector.addEventListener("change", (event) => {
  selectedBranch = event.target.value;
  if (
    selectedBranch === "none" ||
    selectedPersonType === "none" ||
    selectedPersonType === "" ||
    selectedBranch === ""
  ) {
    selectAllDiv.classList.add("invisible");
    selectPersonBranchText.classList.remove("invisible");
    fieldsList.innerHTML = "";
    fieldsList.classList.add("invisible");
    return;
  }
  fieldsList.innerHTML = "";

  displayFields(selectedPersonType, selectedBranch, selectedYear);
});

personTypeSelector.addEventListener("change", (event) => {
  selectedPersonType = event.target.value;
  if (selectedPersonType === "student") {
    yearSelectorDiv.classList.remove("invisible");
    selectedYear = "year1";
  } else {
    yearSelectorDiv.classList.add("invisible");
    selectedYear = "";
  }
  if (
    selectedBranch === "none" ||
    selectedPersonType === "none" ||
    selectedPersonType === "" ||
    selectedBranch === ""
  ) {
    selectAllDiv.classList.add("invisible");
    selectPersonBranchText.classList.remove("invisible");
    fieldsList.innerHTML = "";
    fieldsList.classList.add("invisible");
    return;
  }
  fieldsList.innerHTML = "";

  displayFields(selectedPersonType, selectedBranch, selectedYear);
});

async function fetchFields(selectedPersonType, selectedBranch, selectedYear) {
  if (!selectedYear && selectedPersonType === "student") {
    return;
  }
  if (!selectedYear) {
    return fetch(`/${selectedBranch}-${selectedPersonType}-data`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const fields = data[`${selectedBranch}-fields`];
        return fields;
      });
  } else {
    return fetch(
      `/${selectedBranch}-${selectedYear}-${selectedPersonType}-data`,
      {
        method: "GET",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const fields = data[`${selectedBranch}-${selectedYear}-fields`];
        return fields;
      });
  }
}

function displayFields(selectedPersonType, selectedBranch, selectedYear) {
  fetchFields(selectedPersonType, selectedBranch, selectedYear).then(
    (fields) => {
      selectPersonBranchText.classList.add("invisible");
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
    }
  );
  selectAllDiv.classList.remove("invisible");
}

yearSelector.addEventListener("change", (event) => {
  selectedYear = event.target.value;
  fieldsList.innerHTML = "";
  displayFields(selectedPersonType, selectedBranch, selectedYear);
});

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
    body: JSON.stringify({
      selectedFields,
      selectedBranch,
      selectedPersonType,
      selectedYear,
    }),
  })
    .then((data) => {
      return data.blob();
    })
    .then((blob) => {
      const objectURL = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.style.display = "none";
      downloadAnchor.download = "output.csv";
      downloadAnchor.href = objectURL;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
    });
});
