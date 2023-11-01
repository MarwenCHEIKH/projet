const transferDetails = [
  {
    id: 17440441,
    serveur: "serveur de test projet 24/7 &quot;",
    environnement: "X",
    outil: "cmon",
    jour: 203,
    state: "E",
  },
  {
    id: 17440430,
    serveur: "serveur batch de recette esb &quot;",
    environnement: "N/A",
    outil: "xcmon",
    jour: 304,
    state: "F",
  },
  {
    id: 17440407,
    serveur: "serveur cognos test ws2003 &quot;",
    environnement: "N/A",
    outil: "xcmon",
    jour: 301,
    state: "C",
  },
  {
    id: 17440416,
    serveur:
      "serveur de qualification et de test des transferts meteo transfert inactif &quot;",
    environnement: "X",
    outil: "xcmon",
    jour: 302,
    state: "E",
  },
  {
    id: 23340664,
    serveur: "knl1622",
    environnement: "S",
    outil: "cft",
    jour: 303,
    state: "S",
  },
  {
    id: 21754312,
    serveur: "knl1248",
    environnement: "X",
    outil: "xcmon",
    jour: 304,
    state: "C",
  },
  {
    id: 21754312,
    serveur: "knl1248",
    environnement: "S",
    outil: "xcmon",
    jour: 304,
    state: "E",
  },
];

function getState(transferDetail) {
  var state = "";
  if (transferDetail.state == "C") {
    state = "KO";
    return state;
  } else if (transferDetail.state !== "E") {
    state = "enCours";
    return state;
  } else {
    state = "OK";
    return state;
  }
}
function getDate(day) {
  // Create a new Date object and set it to the given year
  const date = new Date(2023, 0); // January 1st of the specified year

  // Calculate the date by adding the dayNumber - 1 to the date
  date.setDate(date.getDate() + day - 1);

  return date;
}
function isDateNDaysAgo(date, n) {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() - n); // Subtract 'n' days from the current date

  return (
    date.getDate() === targetDate.getDate() &&
    date.getMonth() === targetDate.getMonth() &&
    date.getFullYear() === targetDate.getFullYear()
  );
}

function renderTable(data) {
  const dataContainer = document.getElementById("data-container");
  dataContainer.innerHTML = ""; // Clear previous data

  data.forEach((item) => {
    const row = document.createElement("tr");

    // Create the cells and populate them with data
    const cell1 = document.createElement("td");

    // Create the checkbox input element
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("value", item.id);
    checkbox.setAttribute("name", "case[]0");
    checkbox.setAttribute("title", "Suppression par lot");

    // Create the Edit link
    const editLink = document.createElement("a");
    editLink.setAttribute(
      "href",
      `tbadm_serveurs.php?pme_sys_fl=0&pme_sys_fm=0&pme_sys_sfn[0]=1&pme_sys_operation=pme_op_Change&pme_sys_rec=${item.id}`
    );
    editLink.setAttribute("title", "Modifier");

    // Create the Edit icon
    const editIcon = document.createElement("i");
    editIcon.setAttribute("class", "fa fa-edit button-edit");
    editIcon.setAttribute("aria-hidden", "true");

    // Append the Edit icon to the Edit link
    editLink.appendChild(editIcon);

    // Create the Copy link, icon, and attributes (similar to Edit)
    const copyLink = document.createElement("a");
    copyLink.setAttribute(
      "href",
      `tbadm_serveurs.php?pme_sys_fl=0&pme_sys_fm=0&pme_sys_sfn[0]=1&pme_sys_operation=pme_op_Copy&pme_sys_rec=${item.id}`
    );
    copyLink.setAttribute("title", "Copier");

    const copyIcon = document.createElement("i");
    copyIcon.setAttribute("class", "fa fa-copy button-copy");
    copyIcon.setAttribute("aria-hidden", "true");

    copyLink.appendChild(copyIcon);

    // Create the Delete link, icon, and attributes (similar to Edit)
    const deleteLink = document.createElement("a");
    deleteLink.setAttribute(
      "href",
      `tbadm_serveurs.php?pme_sys_fl=0&pme_sys_fm=0&pme_sys_sfn[0]=1&pme_sys_operation=pme_op_Delete&pme_sys_rec=${item.id}`
    );
    deleteLink.setAttribute("title", "Supprimer");

    const deleteIcon = document.createElement("i");
    deleteIcon.setAttribute("class", "fa fa-times button-delete");
    deleteIcon.setAttribute("aria-hidden", "true");

    deleteLink.appendChild(deleteIcon);

    // Append the checkbox, Edit link, Copy link, and Delete link to the first cell
    cell1.appendChild(checkbox);
    cell1.appendChild(document.createTextNode(" "));
    cell1.appendChild(editLink);
    cell1.appendChild(document.createTextNode(" "));
    cell1.appendChild(copyLink);
    cell1.appendChild(document.createTextNode(" "));
    cell1.appendChild(deleteLink);

    // Create the data cells and populate them
    const cell2 = document.createElement("td");
    cell2.textContent = item.id;

    const cell3 = document.createElement("td");
    cell3.textContent = item.serveur;

    const cell4 = document.createElement("td");
    cell4.textContent = item.environnement;

    const cell5 = document.createElement("td");
    cell5.textContent = item.outil;

    // Append all cells to the row
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    row.appendChild(cell5);

    // Append the row to the data container
    dataContainer.appendChild(row);
  });
}
// Initial rendering of the table
renderTable(transferDetails);

function dayTransfers(e, d) {
  const filteredData = transferDetails.filter(
    (item) => isDateNDaysAgo(getDate(item.jour), d) && item.environnement === e
  );
  renderTable(filteredData);
  console.log(filteredData);
}

function trOk(e) {
  const filteredData = transferDetails.filter(
    (item) => getState(item) == "OK" && item.environnement == e
  );
  renderTable(filteredData);
}
function trKO(e) {
  const filteredData = transferDetails.filter(
    (item) => getState(item) == "KO" && item.environnement == e
  );
  renderTable(filteredData);
}
function trEnCours(e) {
  const filteredData = transferDetails.filter(
    (item) => getState(item) == "enCours" && item.environnement == e
  );
  renderTable(filteredData);
}

function tr(e) {
  const filteredData = transferDetails.filter(
    (item) => item.environnement == e
  );
  renderTable(filteredData);
}
