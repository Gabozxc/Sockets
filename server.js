const { Server } = require("net"),
  server = new Server(),
  END = "end",
  host = "192.168.0.107",
   //127.0.0.1:8000 -> 'pepito'
  //127.0.0.1:9000 -> 'el enmascarao'
  connections = new Map(),
  sendMessages = (message, origin) => {

      //Mandar a todos menos a origin el message

      for(const socket of connections.keys()){

            if(socket !== origin){
                  socket.write(message)
            }

      }

  },
  error = message => {
      console.error(message)
      process.exit(1)
  };

const listen = (port) => {

  server.on("connection", (socket) => {
        const remoteSocket  = `${socket.remoteAddress}:${socket.remotePort}`

        socket.setEncoding('utf-8')

        socket.on("data", message => {
              if(!connections.has(socket)){
                  console.log(`New user start in the chat, say hellow in prueba sadasdasd`)
                  connections.set(socket, message)
              }
              else if(message == END){

                  connections.delete(socket)
                  socket.end();

              }else {
                  const fullmessage =  `[${connections.get(socket)}]: ${message}`
                  console.log(` ${remoteSocket} -> ${fullmessage}`)
                  sendMessages(fullmessage, socket)
              }
        })

        socket.on('close', () =>  console.log(`Connection with ${remoteSocket} is closed`))
        socket.on('error', err => error(err.message))
  })
  server.listen({port, host }, () => console.log('Server running'))

  server.on('error', err => error(err.message))

};

const main = () => {

      if(process.argv.length < 3){
            error(`Usage: node ${__filename} need a port`);
      }

      let port = process.argv[2]

      if(isNaN(port)){
            error('invalid port is not a number')
      }

      port = Number(port)

      listen(port)
}

if(require.main === module){
      main();
}