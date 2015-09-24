'use strict'

import MoleculeRegistry from './molecule-registry'

export default class Server extends MoleculeRegistry {
  static createServer () {
    return new Server()
  }

  listen () {

  }
}
