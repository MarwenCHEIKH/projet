const Client = require("ssh2").Client;
const conn = new Client();

function getDayNumberOfYear() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const dayNumber =
    Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
  return dayNumber;
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

const serverConfigs = {
  uat: {
    host: "uat-server-ip",
    port: 22,
    username: "your_uat_username",
    password: "your_uat_password",
  },
  prod: {
    host: "prod-server-ip",
    port: 22,
    username: "your_prod_username",
    password: "your_prod_password",
  },
};

function dayTransfers(environment, daysAgo) {
  const selectedConfig = serverConfigs[environment];
  const dayNumber = getDayNumberOfYear() - daysAgo;
  const transfers = [];
  conn
    .on("ready", function () {
      console.log("Connected to the remote server via SSH");

      // You can execute commands here
      conn.exec(
        `peldsp status_trans yday_inf ${dayNumber} yday_sup ${dayNumber}`,
        function (err, stream) {
          if (err) throw err;
          stream
            .on("data", function (data) {
              console.log(data);
              const lines = data.split("\n");

              for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                  const [
                    number,
                    site,
                    type,
                    d,
                    day,
                    protoId,
                    appli,
                    state,
                    file,
                    r,
                    kBytes,
                    sc,
                    u,
                  ] = line.split(/\s+/);

                  const transfer = {
                    Number: number,
                    Site: site,
                    Type: type,
                    D: d,
                    Day: day,
                    Proto_Id: protoId,
                    Appli: appli,
                    State: state,
                    File: file,
                    R: r,
                    KBytes: kBytes,
                    Sc: sc,
                    U: u,
                  };

                  transfers.push(transfer);
                }
              }
            })
            .on("exit", function (code) {
              console.log("Exit code: " + code);
              conn.end();
              renderTable(transfers);
            });
        }
      );
    })
    .connect(selectedConfig);
}
