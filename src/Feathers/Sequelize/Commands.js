'use strict'

const os = require('os')
const path = require('path')
const { Command } = require('@adonisjs/ace')

class CreateModel extends Command {

  static get inject() {
    return ['Adonis/Src/Helpers']
  }

  constructor(Helpers) {
    super()

    this.helpers = Helpers
  }

  static get signature() {
    return `
      model:create
      { modelName: Model class name }
      { --tableName=@value : Database table name }
      { --createService : Create a Feathers Service}`
  }

  static get description() {
    return 'Create a model'
  }

  async handle({ serviceName }, flags) {
    const modelPath = this.helpers.appRoot(`app/Models/${serviceName}.js`)

    try {
      const exists = await this.pathExists(modelPath)

      if (exists) {
        const overwriteModel = await this.confirm('Are you sure you want to overwrite an existing model?')

        if (!overwriteModel) {
          this.warn('Cancelled model creation')
          return process.exit(0)
        }
      }

      this.info(`Creating ${modelName} service..`)

      await this.writeFile(modelPath, [
        `'use strict'`,
        '',
        `const Model = use('Model')`,
        '',
        `class ${modelName} extends Model {`,
        '',
        '   static get tableName() {',
        `     return '${flags.tableName}'`,
        '   }',
        '',
        '}',
        '',
        `module.exports = ${modelName}`
      ].join(os.EOL))

      this.success(`Model ${modelName} has successfully been created!`)

      process.exit(0)
    } catch (err) {
      throw err
    }
  }

}

module.exports = CreateModel
