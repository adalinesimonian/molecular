function rootHandler (ctx) {
  ctx.res.send('I\'m a carbene!')
}

function endpointHandler (ctx) {
  ctx.res.send('This is an endpoint!')
}

module.exports = {
  name: 'methylene',
  routes: [
    {
      route: '/',
      handlers: [
        {
          methods: ['get', 'post'],
          handler: rootHandler
        }
      ]
    },
    {
      route: '/endpoint',
      handlers: [
        {
          methods: ['get', 'post'],
          handler: endpointHandler
        }
      ]
    }
  ]
}
