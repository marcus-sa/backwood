'use strict'

const Service = use('Service')

class MessageService extends Service {

  static get hooks() {
    return {
      before: {
        create(ctx) {
          ctx.data.updatedAt = new Date()
        }
      }
    }

  }

  async get(id, params) {
    return 'kek'
  }

}

module.exports = MessageService
