'use strict'

const _ = require('lodash')
const BaseModel = require('./Model')
const pascalCase = require('pascal-case')
const Sequelize = require('sequelize')

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
                pool: connection.pool,
                storage: connection.storage
            }
        )

        this._models = {}
        this._services = {}
    }

    _start() {
        const { models } = require(this._helpers.appRoot('start/app.js'))

        Object.keys(models).forEach(modelName => {
            this._ioc.singleton(`Models/${modelName}`, (ioc) => {
                const model = this._ioc.use(models[modelName])

                if (model.prototype instanceof BaseModel === false) {
                  throw new Error(`${model.name} model must extend base model class`)
                }

                const options = _.mergeWith(model.options, {
                  hooks: typeof model.hooks === 'object'
                    ? model.hooks
                    : {}
                })

                const sequelizeModel = this.sequelize.define(
                    model.tableName,
                    model.attributes(Sequelize),
                    options
                )

                if (typeof model.hooks === 'function') {
                  model.hooks.bind(sequelizeModel)()
                }

                //_.unset(model, ['attributes', 'hooks', 'name'])

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

                if (typeof model.createService === 'undefined' || model.createService || model.serviceName) {
                  const service = require('feathers-sequelize')
                  const serviceName = model.serviceName || model.tableName

                  this._rest.app.use(serviceName, service({
                      Model: sequelizeModel,
                      events: model.events,
                      id: model.id || 'id',
                      raw: model.raw,
                      paginate: model.paginate
                  })).hooks(model.serviceHooks || {})

                  this._ioc.singleton(`Services/${pascalCase(serviceName)}`, () => {
                    return this._rest.app.service(serviceName)
                  })
                }

                return sequelizeModel
            })
        })
    }

}
