function homeHandler (ctx) {
  ctx.res.send('Hello world!')
}

function testHandler (ctx) {
  ctx.res.send('Welcome to the test endpoint!')
}

module.exports = {
  name: 'core',
  routes: [
    {
      route: '/',
      handlers: [
        {
          methods: ['get', 'post'],
          handler: homeHandler
        }
      ]
    },
    {
      route: '/test',
      handlers: [
        {
          methods: ['get', 'post'],
          handler: testHandler
        }
      ]
    }
  ]
}
