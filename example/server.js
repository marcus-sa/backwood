'use strict'

const { Ignitor } = require('@adonisjs/ignitor')

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fire()
  .catch(console.error)
