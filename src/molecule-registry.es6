'use strict'

import Router from './router'
import Molecule from './molecule'

export default class MoleculeRegistry extends Router {
  constructor ({ molecules = {} } = {}) {
    super()
    this.molecules = molecules
  }

  use (moleculeData, { root = false } = {}) {
    let molecule = new Molecule(moleculeData)

    if (this.contains(molecule.name)) {
      throw new Error(`Molecule already registered with name '${molecule.name}'`)
    }

    console.log(`Registered module '${molecule.name}'`)
    root && console.log(`Registered as root module`)
    for (let route of molecule.routes) {
      console.log(`Registered route '${route}'`)
    }

    if (molecule.register) { molecule.register() }

    this.molecules[molecule.name] = molecule
  }

  discard (name) {
    if (this.contains(name)) {
      if (this.molecules[name].unregister) { this.molecules[name].unregister() }
      delete this.molecules[name]
    } else {
      throw new Error(`No molecule registered with name '${name}'`)
    }
  }

  contains (name) {
    return this.molecules[name] instanceof Molecule
  }
}
