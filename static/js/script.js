const personTypeSelector = document.getElementById("stud-emp");
const branchSelector = document.getElementById("branch");
const fieldsList = document.getElementById("fields-list");

const selectedPersonType = "";
const selectedBranch = "";

branchSelector.addEventListener("change", (event) => {
  selectedBranch = event.target.value;
  if (
    personValue === "none" ||
    selectedBranch === "none" ||
    selectedPersonType === "" ||
    selectedBranch === ""
  ) {
    return;
    //Optional: Display Message to Select Valid Item
  }
  displayFields(selectedPersonType, selectedBranch);
});

personTypeSelector.addEventListener("change", (event) => {
  const personValue = event.target.value;
  if (
    personValue === "none" ||
    selectedBranch === "none" ||
    selectedPersonType === "" ||
    selectedBranch === ""
  ) {
    return;
    //Optional: Display Message to Select Valid Item
  }

  displayFields(selectedPersonType, selectedBranch);
});
