'use strict'

const { Ioc } = require('@adonisjs/fold')

module.exports = class Service {

    constructor(Ioc) {
      this._ioc = Ioc
    }

    setup(app) {
        this.app = app

        console.log('setup')

        //const dependencies = (this.dependencies || []).map(dependency => this._ioc.use(dependency))

        //this.boot(dependencies)
    }

}
