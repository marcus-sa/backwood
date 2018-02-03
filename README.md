# Backwood Feathers
Backwood Feathers is a [Service Provider](https://adonisjs.com/docs/4.0/service-providers) for [AdonisJS](https://github.com/adonisjs/adonis-framework)
for people that enjoy FeathersJS but can't stand its way of file and coding structuring.

**Full docs will come soon**

## Packages
  * [@backwood/backwood](https://github.com/marcus-sa/backwood/tree/master/src/Feathers)
  * [@backwood/rest](https://github.com/marcus-sa/backwood/tree/master/src/Feathers/Rest)
  * [@backwood/sequelize](https://github.com/marcus-sa/backwood/tree/master/src/Feathers/Sequelize)

## Installation
```bash
npm install --save @backwood/backwood @backwood/rest @backwood/sequelize
```

## Usage
Okay, start off by creating a new Adonis Project using the CLI:

```bash
adonis new blog
```

now navigate to the `server.js` file and replace `.fireHttpServer()` with `.fire()` like so:

> server.js
```
'use strict'

const { Ignitor } = require('@adonisjs/ignitor')

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fire() // <--
  .catch(console.error)

```

then it's also recommended to remove most of the providers, as Feathers will be handling everything else
and add the Backwood providers to the application

> start/app.js

```js
const providers = [
    'backwood-feathers',
    'backwood-feathers-rest'
]
```

### Backwood Feathers
```js
'use strict'

const primus = use('@feathersjs/primus')

const Feathers = use('Feathers')

Feathers
  .configure(primus({ transformer: 'websockets' }))
  .service('message', 'MessageService').hooks('MessageHooks')
  .service('products', 'ProductService').hooks('ProductService')
```

### Backwood Feathers REST API
```js
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
```
