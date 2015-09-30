'use strict'

import Molecule from './molecule'

function getPathParts (path) {
  return path === '/' ? []
    : path.replace(/\/+/g, '/').replace(/^\//, '').split('/')
}

export default class MoleculeRegistry {
  constructor ({ molecules = [] } = {}) {
    this.molecules = molecules
  }

  use (moleculeData, { path } = {}) {
    let molecule = new Molecule(moleculeData)
    path = path || molecule.name

    if (this.get(path)) {
      throw new Error(`Molecule already registered at path '${path}'`)
    }

    console.log(`Registered module '${molecule.name}' at '${path}'`)

    if (molecule.register) { molecule.register() }

    this.molecules.push({ molecule, path })
  }

  findMatchingRoute (path) {
    if (typeof path !== 'string') {
      throw new Error('path must be a string.')
    }
    let pathParts = getPathParts(path)

    for (let reg of this.molecules) {
      let regPathParts = getPathParts(reg.path)
      let matchingNamespace = pathParts.length >= regPathParts.length &&
        regPathParts.every((part, i) => pathParts[i] === part)
      if (matchingNamespace) {
        let scopedPath = '/' + pathParts.slice(regPathParts.length).join('/')
        let route = reg.molecule.router.match(scopedPath)
        if (route) { return route }
      }
    }

    return undefined
  }

  discard (path) {
    let existingReg = this.get(path)
    if (existingReg) {
      if (existingReg.molecule.unregister) { existingReg.molecule.unregister() }
      this.molecules.splice(this.molecules.indexOf(existingReg), 1)
    } else {
      throw new Error(`No molecule registered at path '${path}'`)
    }
  }

  get (path) {
    return this.molecules.find(reg => reg.path === path)
  }
}
