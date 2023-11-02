const Client = require("ssh2").Client;

class SSHService {
  constructor() {
    this.conn = new Client();
  }

  connectToServer(config) {
    return new Promise((resolve, reject) => {
      this.conn.on("ready", () => {
        console.log("Connected to the remote server via SSH");
        resolve();
      });

      this.conn.on("error", (err) => {
        reject(err);
      });

      this.conn.connect(config);
    });
  }

  executeCommand(command) {
    return new Promise((resolve, reject) => {
      this.conn.exec(command, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        let result = "";
        stream.on("data", (data) => {
          result += data.toString();
        });

        stream.on("end", () => {
          resolve(result);
        });

        stream.on("close", (code) => {
          if (code !== 0) {
            reject(`Command exited with code ${code}`);
          }
        });
      });
    });
  }

  closeConnection() {
    this.conn.end();
  }

  async fetchData(environment, daysAgo) {
    const serverConfig = this.getServerConfig(environment);
    const dayNumber = this.getDayNumberOfYear() - daysAgo;
    const command = `peldsp status_trans yday_inf ${dayNumber} yday_sup ${dayNumber}`;

    try {
      await this.connectToServer(serverConfig);
      const commandOutput = await this.executeCommand(command);
      return this.parseCommandOutput(commandOutput);
    } catch (err) {
      throw err;
    } finally {
      this.closeConnection();
    }
  }

  getDayNumberOfYear() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    return Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
  }

  getServerConfig(environment) {
    // Define your server configurations here
    const uatConfig = {
      host: "uat-server-ip",
      port: 22,
      username: "your_uat_username",
      password: "your_uat_password",
    };

    const prodConfig = {
      host: "prod-server-ip",
      port: 22,
      username: "your_prod_username",
      password: "your_prod_password",
    };

    return environment === "X" ? uatConfig : prodConfig;
  }

  parseCommandOutput(output) {
    const lines = output.split("\n").slice(1); // Remove header line
    const transfers = [];

    for (const line of lines) {
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
      transfers.push({
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
      });
    }

    return transfers;
  }
}

module.exports = SSHService;
