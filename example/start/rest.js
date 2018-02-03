'use strict'

console.log('start/app')

const Rest = use('Rest')

exports.globalMiddleware = [
  Rest.express.json(),
  Rest.express.urlencoded({ extended: true  }),

]

exports.namedMiddleware = {
  test: (req, res, next) => {
    console.log('test')
    next()
  }
}

//Rest
  //.group(() => {
    Rest.get('test', 'TestController.get')
    Rest.service('message', 'MessageService')// .dependencies(['Model/User'])
  //}).middleware('test')
