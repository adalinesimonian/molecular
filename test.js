var server = require('./lib/index').createServer()

server.use(require('./test-module'), {
  path: '/'
})
server.use(require('./test-module-scoped'))
server.use(require('./test-module-scoped'), {
  path: 'some-carbene'
})
server.use(require('./test-module-scoped'), {
  path: '/x/y/z'
})

server.hostname = 'localhost'
server.httpPorts = [8080]
server.httpsPorts = []

server.listen()
