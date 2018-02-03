'use strict'

const Service = use('Service')

class MessageService extends Service {


  /*static get inject() {
    console.log('inject')
    return ['Model/User']
  }

  constructor(User) {
    super()
    this.user = User
  }*/

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
    console.log(this.config)
    console.log(id, params) // gets logged, but request results in 404?
    return { id, params }
  }

}

module.exports = MessageService
