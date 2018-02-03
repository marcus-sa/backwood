'use strict'

const _ = require('lodash')
const BaseModel = require('./Model')
const path = require('path')
const Sequelize = require('sequelize')
const service = require('feathers-sequelize')

module.exports = class FeathersSequelize {

    constructor(Rest, Ioc, Config, Helpers) {
        this._rest = Rest
        this._ioc = Ioc
        this._helpers = Helpers
        const config = Config.get('database')
        const dialect = config.connection
        const { connection } = config[dialect]

        this._modelsPath = 'App/Models'

        this.sequelize = new Sequelize(
            connection.database,
            connection.user,
            connection.password,
            {
                dialect,
                host: connection.host,
                pool: connection.pool || {},
                storage: connection.storage
            }
        )

        console.log(connection)

        this._models = {}
    }

    _start() {
      console.log('Sequelize')
        const { models } = require(path.join(this._helpers.appRoot(), 'start', 'app.js'))

        Object.keys(models).forEach(modelName => {
            this._ioc.singleton(`Feathers/Models/${modelName}`, (ioc) => {
                const model = this._ioc.use(models[modelName])

                if (model.prototype instanceof BaseModel === false) {
                  throw new Error(`${model.name} model must extend base model class`)
                }

                const options = _.mergeWith(model.options, {
                /*  instanceMethods: model.prototype,
                  classMethods: Object.getOwnPropertyNames(model).map(method => {
                    return model[method]
                  }).filter(method => typeof method === 'function')*/
                })

                console.log(options)

                const sequelizeModel = this.sequelize.define(
                    model.tableName,
                    model.attributes(Sequelize),
                    model.options
                )

                Object.getOwnPropertyNames(model).forEach(prop => {
                  if (!sequelizeModel.hasOwnProperty(prop) && typeof model[prop] === 'function') {
                      sequelizeModel[prop] = model[prop].bind(sequelizeModel)
                  }
                })

                Object.getOwnPropertyNames(model.prototype).forEach(prop => {
                    if (!sequelizeModel.prototype.hasOwnProperty(prop) && typeof model.prototype[prop] === 'function') {
                        sequelizeModel.prototype[prop] = model.prototype[prop].bind(sequelizeModel.prototype)
                    }
                })

                this._models[modelName] = sequelizeModel

                this._rest.app.use(model.tableName, service({
                    Model: sequelizeModel,
                    paginate: model.paginate
                }))

                return sequelizeModel
            })

            this._ioc.alias(`Feathers/Models/${modelName}`, modelName)
        })
    }

}
