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
                  instanceMethods: model.prototype,
                  classMethods: model
                })

                const sequelizeModel = this.sequelize.define(
                    model.tableName,
                    model.attributes(Sequelize),
                    options
                )

                Object.keys(model).forEach(prop => {
                    if (['attributes', 'tableName', 'options'].includes(prop) || typeof prop !== 'string') {
                      return null
                    }

                    if (!sequelizeModel.hasOwnProperty(prop)) {
                        sequelizeModel[prop] = model[prop].bind(sequelizeModel)
                    }
                })

                Object.keys(model.prototype).forEach(prop => {
                    if (!sequelizeModel.prototype.hasOwnProperty(prop)) {
                        sequelizeModel.prototype[prop] = model.prototype[prop].bind(sequelizeModel.prototype)
                    }
                })

                this._models[modelName] = sequelizeModel

                this._rest.app.use(model.tableName, service({
                    Model: sequelizeModel
                }))

                return sequelizeModel
            })

            this._ioc.alias(`Feathers/Models/${modelName}`, modelName)
        })
    }

}
