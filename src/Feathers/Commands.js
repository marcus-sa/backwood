'use strict'

const os = require('os')
const path = require('path')
const { Command } = require('@adonisjs/ace')

class CreateService extends Command {

  static get inject() {
    return ['Adonis/Src/Helpers']
  }

  constructor(Helpers) {
    super()

    this.helpers = Helpers
  }

  static get signature() {
    return 'service:create { serviceName: Service class name }'
  }

  static get description() {
    return 'Create a service'
  }

  async handle({ serviceName }, flags) {
    const servicePath = this.helpers.appRoot(`app/Services/${serviceName}.js`)

    try {
      const exists = await this.pathExists(servicePath)

      if (exists) {
        const overwriteService = await this.confirm('Are you sure you want to overwrite an existing service?')

        if (!overwriteService) {
          this.warn('Cancelled service creation')
          return process.exit(0)
        }
      }

      this.info(`Creating ${serviceName} service..`)

      await this.writeFile(servicePath, [
        `'use strict'`,
        '',
        `const Service = use('Service')`,
        '',
        `class ${serviceName} extends Service {`,
        '',
        '   static get hooks() {',
        '     return {}',
        '   }',
        '}',
        '',
        `module.exports = ${serviceName}`
      ].join(os.EOL))

      this.success(`Service ${serviceName} has successfully been created!`)

      process.exit(0)
    } catch (err) {
      throw err
    }
  }

}

module.exports = CreateService
