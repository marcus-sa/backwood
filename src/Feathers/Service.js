'use strict'

const { Ioc } = require('@adonisjs/fold')

module.exports = class Service {

    setup(app) {
        this.app = app
    }

}
