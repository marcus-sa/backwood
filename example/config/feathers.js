'use strict'

const Env = use('Env')

module.exports = {
  port: Env.get('PORT', 3030),
  express: {
    port: 3031
  }
}
