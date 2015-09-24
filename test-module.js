function homeHandler (ctx) {
  ctx.res.send('Hello world!')
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
    }
  ]
}
