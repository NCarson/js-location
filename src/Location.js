import URI from 'urijs'
import Route from 'route-parser'

/*
 *
* Route = require('route-parser');
* var route = new Route('/my/fancy/route/page/:page');
* route.match('/my/fancy/route/page/7') // { page: 7 }
* route.reverse({page: 3}) // -> '/my/fancy/route/page/3'
 */

/*****************************************************************************
 *  Params
/****************************************************************************/

export class QueryParam {
    constructor(match_func, validate_func, display) {
        this.match_func = match_func
        this.validate_func = validate_func
        this.display = display
    }

    match(value) {
        return this.match_func && this.match_func(value)
    }

    validate(value) {
        if (!this.validate_func)
            return true
        else
            return this.validate_func(value)
    }
}

export class QueryEnumParam  extends QueryParam {
    constructor(key, match_func, validate_func, display) {
        super(match_func, validate_func, display)
        this.key = key
    }

}

/*****************************************************************************
 *  location
/****************************************************************************/

export class Location {

    static route = null
    static params = []

    static href(obj){
        return Location.route && Route(Location.route).reverse(obj)
    }

    constructor(href) {

        console.log('href', href)
        this._api = []
        var uri = new URI(href).normalize()
        var search = uri.search(true)
        var match = this.constructor.route && Route(this.constructor.route).match(uri.toString())
        const new_search = this._setParams(search)
        this._setParams(match)
        this._uri = uri.search(new_search).normalize()

        console.log(this.equal(this))
        console.log(this.api())
        console.log(this.url())
        console.log(this.pathname())
        console.log(this.search())
        console.log(this.hrefFromSearch({q:'dog'}))
    }

    hrefFromSearch(search) {

        var old_search = this._uri.search(true)
        Object.assign(old_search, search)
        var href = this._uri.clone().search(old_search).normalize().toString()
        return href
    }

    _setParams(search) {

        const params = this.constructor.params
        var new_search = {}

        Object.keys(search).forEach( key => {
            const p = params[key]
            if (!p) return; // if unrecogonized param

            var val = search[key]
            // if search has same key more than twice take last value
            if (Array.isArray(val)) { 
                val = val.slice(-1)[0] 
            }

            if (Array.isArray(p)) { // if param is enum
                p.forEach( pp => {
                    if (val === pp.key) { // if this param matches enum
                        new_search[key] = val
                        this._api.push(pp.match(val))
                    }
                })
            } else { // else
                if (!p.validate(val)) // if it does not pass validation
                    return 
                new_search[key] = val
                this._api.push(p.match(val))
            }
        })
        return new_search
    }

    equal(other) {
        return this._uri.toString() === other._uri.toString()
    }

    api() {
        return this._api
    }

    url() {
        return this._uri.toString()
    }

    pathname() {
        return this._uri.pathname()
    }

    search() {
        return this._uri.search(true)
    }
}




