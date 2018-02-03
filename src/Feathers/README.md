# Backwood Feathers
Backwood Feathers is a [Service Provider](https://adonisjs.com/docs/4.0/service-providers) for [AdonisJS](https://github.com/adonisjs/adonis-framework)
for people that enjoy FeathersJS but can't stand its way of file and coding structuring.

**Full docs will come soon**

## Installation
```bash
npm install --save backwood-feathers backwood-feathers-rest

yarn add --save backwood-feathers backwood-feathers-rest
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
    '@adonisjs/framework/providers/AppProvider',
    '@backwood/backwood'
]
```

### Backwood Feathers
Create a mandatory file called `feathers.js` in the `start` directory.

> start/feathers.js
```js
'use strict'

const Feathers = use('Feathers')

Feathers
  .service('message', 'MessageService')
  .service('products', 'ProductService')
```

> app/Services/MessageService
```js
'use strict'

const Service = use('Service')
const Messages = use('Models/Messages')

class MessageService extends Service {

  /**
   * Assign hooks to a service
   *
   * @method hooks
   * @return {Object}
   */
  static get hooks() {
    return {
      before: {
        get: (ctx) => {
          // Define get hook
        }
      }
    }
  }

  get(id, params) {
    return Messages.findById(id)
  }

}

module.exports = MessageService
```
