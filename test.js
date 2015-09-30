var server = require('./lib/index').createServer()

server.use(require('./test-module'), {
  root: true
})
server.use(require('./test-module-scoped'))

server.hostname = 'localhost'
server.httpPorts = [8080]
server.httpsPorts = []

server.listen()
