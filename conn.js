const Client = require("ssh2").Client;
const conn = new Client();

const transfers = [];

const uatServerConfig = {
  host: "uat-server-ip",
  port: 22, // Standard SSH port
  username: "your_uat_username",
  password: "your_uat_password",
};

const prodServerConfig = {
  host: "prod-server-ip",
  port: 22, // Standard SSH port
  username: "your_prod_username",
  password: "your_prod_password",
};
const chosenEnvironment = "uat";
const selectedConfig =
  chosenEnvironment === "uat" ? uatServerConfig : prodServerConfig;
conn
  .on("ready", function () {
    console.log("Connected to the remote server via SSH");

    // You can execute commands here
    conn.exec("peldsp status_trans", function (err, stream) {
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

          console.log(transfers);
        })
        .on("exit", function (code) {
          console.log("Exit code: " + code);
          conn.end();
        });
    });
  })
  .connect(selectedConfig);

conn.on("error", function (err) {
  console.error("Error:", err);
});

conn.on("close", function () {
  console.log("SSH connection closed");
});
