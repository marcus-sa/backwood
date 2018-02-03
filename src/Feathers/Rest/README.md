# Backwood Feathers REST
Backwood Feathers is a [Service Provider](https://adonisjs.com/docs/4.0/service-providers) for [AdonisJS](https://github.com/adonisjs/adonis-framework)

**Full docs will come soon**

This is a service provider for providing REST to Feathers

## Packages
  * [@backwood/backwood](https://github.com/marcus-sa/backwood/tree/master/src/Feathers)
  * [@backwood/rest](https://github.com/marcus-sa/backwood/tree/master/src/Feathers/Rest)
  * [@backwood/sequelize](https://github.com/marcus-sa/backwood/tree/master/src/Feathers/Sequelize)

## Installation
```bash
npm install --save @backwood/rest
```

## Usage
Add `@backwood/rest` to the app providers in `start/app.js`

### Backwood REST
Create a mandatory file called `rest.js` in the `start` directory.

> start/rest.js
```js
'use strict'

const Rest = use('Rest')

exports.globalMiddleware = [
  Rest.express.json(),
  Rest.express.urlencoded({ extended: false })
]

exports.namedMiddleware = {
  auth: (req, res, next) => {
    return !req.user
      ? next(false)
      : next()
  },
  guest: (req, res, next) => {
    return req.user
      ? next(false)
      : next()
  }
}

Rest
  .service('user', 'UserService')
  .group(() => {
    Rest.get('/login', 'LoginController.get')
  }).options({
    middleware: 'guest',
    prefix: 'guest',
    namespace: 'Guest'
  })
```
