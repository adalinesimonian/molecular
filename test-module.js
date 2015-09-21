function homeHandler (ctx) {
  ctx.res.send('Hello world!')
}

module.exports = {
  name: 'core',
  routes: {
    home: '/'
  },
  register: appContext => {
    appContext.router.all('home', homeHandler)
  }
}
