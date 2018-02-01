'use strict'

const Rest = use('Rest')

exports.globalMiddleware = [
  Rest.express.json()
]

exports.namedMiddleware = {
  test: (req, res, next) => {
    console.log('test')
    next()
  }
}

Rest
  .group(() => {
    Rest.get('/test', 'TestController.get')
  }).middleware('test')
  /*group(() => {
    Rest.get('get', async (req, res) => {
      res.send('lol')
    })
  }).options({
    namespace: 'Lol',
    prefix: 'users',
    //middleware: 'users'
  })*/
