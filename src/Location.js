import URI from 'urijs'
import Route from 'route-parser'

//const pretty = (obj) => JSON.stringify(obj, null, 2); // spacing level = 2

/*****************************************************************************
 *  Params
/****************************************************************************/

export class QueryParam {
    constructor(match_func, display, validate_func) {
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
    constructor(key, match_func, display) {
        super(match_func, display)
        this.key = key
    }
}

/*****************************************************************************
 *  location
/****************************************************************************/

export class Location {

    // regex to match paths to
    static route = null
    // valid paramaters in search i.e. QueryParams
    static params = {}
    // will add default values to url search if not present
    static default_params = {}
    // will always be added to matched params
    static const_queries = []

    static (obj){
        return Location.route && Route(Location.route).reverse(obj)
    }

    constructor(href, config) {

        this.config = config
        this.config.debug = config.debug || false
        this.config.console = config.console || console

        this._matches = []
        this._valid = true

        var uri = new URI(href).normalize()
        var search = uri.search(true)

        // add default params
        const defaults = this.constructor.default_params
        //const params = this.constructor.params
        for (let [key, value] of Object.entries(defaults)) {
            if (typeof search[key] == 'undefined')
                search[key] = value
        }

        // add search
        const new_search = this._setParams(search)

        // add matches
        var match = this.constructor.route && Route(this.constructor.route).match(uri.pathname())
        match && this._setParams(match) 

        // add constant matches
        this._matches = this._matches.concat(this.constructor.const_queries)

        this._uri = uri.search(new_search).normalize()

        this.config.debug && this.config.console.log(
            'Location.constructor: this._matches:',
            //pretty(this._matches.map(x => x.toString())),
            this._matches,
            'href', href)
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
                        this._matches.push(pp.match(val))
                    }
                })
            } else { // else
                if (!p.validate(val)) { // if it does not pass validation
                    this._valid = false
                    return 
                }
                new_search[key] = val
                this._matches.push(p.match(val))
            }
        })
        return new_search
    }

    // did all the params pass validation
    isValid() {
        return this._valid
    }

    //clone
    cloneFromSearch(search) {
        var old_search = this._uri.search()
        Object.assign(old_search, search)
        var href = this._uri.clone().search(old_search).normalize().toString()
        return this.constructor(href)
    }

    // returns cloned url with search added
    hrefFromSearch(search) {

        var old_search = this._uri.search(true)
        Object.assign(old_search, search)
        var href = this._uri.clone().search(old_search).normalize().toString()
        return href
    }

    equal(other) {
        return this._uri.toString() === other._uri.toString()
    }

    // api search params
    matches() {
        return this._matches
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




