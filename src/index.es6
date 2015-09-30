'use strict'

import http from 'http'
import MoleculeRegistry from './molecule-registry'
import WebRequest from './request'
import WebResponse from './response'

export default class Server extends MoleculeRegistry {
  static createServer () {
    return new Server()
  }

  listen () {
    let server = http.createServer((rawReq, rawRes) => {
      let req = new WebRequest(rawReq)
      let res = new WebResponse(rawRes)
      let route = this.getRoute(rawReq.url)
      let handlers = route ? route.getHandlers(req.method) : []
      if (handlers.length) {
        console.log(`${req.method} ${rawReq.url}`)
        handlers[0]({ req, res })
      } else {
        console.log(`${req.method} ${rawReq.url} 404`)
        res.statusCode = 404
        res.send('Not found')
      }
    }).on('error', err =>
      console.log(err)
    )
    for (let port of this.httpPorts) {
      server.listen(port)
      console.log(`[HTTP] Listening on port ${port}...`)
    }
  }
}
