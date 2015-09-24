'use strict'

import http from 'http'
import MoleculeRegistry from './molecule-registry'

export default class Server extends MoleculeRegistry {
  static createServer () {
    return new Server()
  }

  listen () {
    let server = http.createServer((req, res) => {
      let route = this.getRoute(req.url)
      let handlers = route ? route.getHandlers(req.method) : []
      if (handlers.length) {
        console.log(`${req.method} ${req.url}`)
        handlers[0]({ req, res: {
          send (data) {
            res.write(data)
            res.end('')
          }
        } })
      } else {
        console.log(`${req.method} ${req.url} 404`)
        res.write('404')
        res.end('')
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
