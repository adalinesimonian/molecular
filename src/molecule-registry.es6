'use strict'

import Molecule from './molecule'

function findMatchingRoute (molecules, path, rootOnly) {
  let route
  let pathParts = path.replace(/\/+/g, '/').replace(/^\//, '').split('/')

  if (rootOnly || path === '/' || path === '') {
    let rootPath = '/' + pathParts.join('/')
    for (let reg of molecules.filter(reg => reg.root)) {
      let route = reg.molecule.router.match(rootPath)
      if (route) { return route }
    }
    return undefined
  } else {
    route = findMatchingRoute(molecules, path, true)
    if (route) { return route }

    let moleculeNamespace = pathParts[0]
    let reg = molecules.find(reg => reg.molecule.name === moleculeNamespace)
    if (reg) {
      let scopedPath = '/' + pathParts.slice(1).join('/')
      return reg.molecule.router.match(scopedPath)
    } else {
      return undefined
    }
  }
}

export default class MoleculeRegistry {
  constructor ({ molecules = [] } = {}) {
    this.molecules = molecules
  }

  use (moleculeData, { root = false } = {}) {
    let molecule = new Molecule(moleculeData)

    if (this.get(molecule.name)) {
      throw new Error(`Molecule already registered with name '${molecule.name}'`)
    }

    console.log(`Registered module '${molecule.name}'`)
    root && console.log(`Registered as root module`)

    if (molecule.register) { molecule.register() }

    this.molecules.push({ molecule, root })
  }

  findMatchingRoute (path) {
    if (typeof path !== 'string') {
      throw new Error('path must be a string.')
    }
    return findMatchingRoute(this.molecules, path)
  }

  discard (name) {
    let existingReg = this.get(name)
    if (existingReg) {
      if (existingReg.molecule.unregister) { existingReg.molecule.unregister() }
      this.molecules.splice(this.molecules.indexOf(existingReg), 1)
    } else {
      throw new Error(`No molecule registered with name '${name}'`)
    }
  }

  get (name) {
    return this.molecules.find(reg => reg.molecule.name === name)
  }
}
