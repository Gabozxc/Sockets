const { Socket } = require("net"),
  readline = require("readline").createInterface({
    input: process.stdin,
    ouput: process.stdout,
  }),
  socket = new Socket(),
  END = "end",
  error = (message) => {
    console.error(message);
    process.exit(1);
  };

const connect = (host, port) => {
  socket.connect({ host, port });
  socket.setEncoding("utf-8");

  socket.on("connect", () => {
    console.log("im in, conectado, what is your name");

      readline.question("Choose your username: ", username => {

            socket.write(username)
            console.log(`type any message, type ${END} to finish`)

      })

    readline.on("line", (message) => {
      socket.write(message);

      if (message == END) {
        console.log("conection closed");
        socket.end();
      }
    });

    socket.on("data", (data) => {
      console.log(data);
    });
  });

  socket.on("error", (err) => error(err.message));

  socket.on("close", () => process.exit(0));
};

const main = () => {
  if (process.argv.length != 4) {
    error(`Usage: node ${__filename} need a port`);
  }

  let [, , host, port] = process.argv;

  if (isNaN(port)) {
    error("invalid port is not a number");
  }

  port = Number(port);

  connect(host, port);
};

if (require.main === module) {
  main();
}
