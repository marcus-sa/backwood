'use strict'

module.exports = class RouteGroup {

  constructor(routes, name = null) {
    this._routes = routes
    this._name = name
  }

  options(options) {
    const { middleware, prefix, namespace, domain } = options

    if (middleware) {
      this.middleware(middleware)
    }

    if (prefix) {
      this.prefix(prefix)
    }

    if (namespace) {
      this.namespace(namespace)
    }

    if (domain) {
      this.domain(domain)
    }

    return this
  }

  middleware(...middleware) {
    this._routes.forEach(route => route.prependMiddleware(...middleware))
    return this
  }

  prefix(prefix) {
    this._routes.forEach(route => route.prefix(prefix))
    return this
  }

  namespace(namespace) {
    this._routes.forEach(route => route.namespace(namespace))
    return this
  }

  domain(domain) {
    this._routes.forEach(route => route.domain(domain))
    return this
  }

}
