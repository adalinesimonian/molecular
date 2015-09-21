var server = require('./lib/index').createServer()

server.use(require('./test-module'), {
  root: true
})

server.hostname = 'localhost'
server.httpPorts = [8080]
server.httpsPorts = []

server.listen()
