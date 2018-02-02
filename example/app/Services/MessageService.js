'use strict'

const Service = use('Service')

class MessageService extends Service {

  hooks() {
    return {
      before: {
        create(ctx) {
          ctx.data.updatedAt = new Date()
        }
      }
    }

  }

  async get(id, params) {
    console.log(id, params) // gets logged, but request results in 404?
    return { id, params }
  }

}

module.exports = MessageService
