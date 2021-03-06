import URI from 'urijs'
import Route from 'route-parser'

//const pretty = (obj) => JSON.stringify(obj, null, 2); // spacing level = 2

/** Represents some sort of API param that is embedded in a URL
 *  @exports
 *  @param {function} match_func - a function that takes a url and returns the api param
 *  @param {string} [display] - pretty name of this param to display
 *  @param {function} [validate_func] - is the value valid
 *  @example
 * const ParamSearch = new QueryParam(
 *      (v) => (`where name = '${v}'`), 
 *      'Search',
 *      (v) => /(\D+)/.test(v))
 * const ParamID = new QueryParam((v) => (`where id = ${v}`), null, null)
*/
export class QueryParam {
    constructor(match_func, display, validate_func) {
        this.match_func = match_func
        this.validate_func = validate_func
        this.display = display
    }

    /** Called to see if the url matches with match_func 
    *   and then returns the value if it does.*/
    match(value) {
        return this.match_func && this.match_func(value)
    }

    /** Returns true if the value is valid with validate_func or true if
     * validate_func is not set. 
     */
    validate(value) {
        if (!this.validate_func)
            return true
        else
            return this.validate_func(value)
    }
}

/** 
 * An enumerated QueryParam that can only have one value
 * @extends QueryParam
 *  @param {string} key - the exact value of the param
 *  @param {function} match_func - a function that takes a url and returns the api param
 *  @param {string} [display] - pretty name of this param to display
 *  @example
 * const ParamSortName = new QueryEnumParam(
 *      'abc', 
 *      () => ('order by name'),
 *      'by Name', )
const ParamSortPop = new QueryEnumParam(
        'pop', 
        () => ('order by count desc'), 
        'by Popularity')
*/
export class QueryEnumParam  extends QueryParam {
    constructor(key, match_func, display) {
        super(match_func, display)
        this.key = key
    }
}

/** Base object to inherit from
 * @param {string} href - the instance href of the location
 * @param {object} [config={}] 
 * @param {bool} [config.debug=true] - extra debug info
 * @param {func} [config.log=console.log] - debug logging func
 * @example
 * export class TestLocation extends Location {
 *     static route = '/test/:id(\\d+)/'; // eslint-disable-line no-useless-escape
 *     static params = {
 *         'o': [
 *             ParamSortName,
 *             ParamSortPop,
 *         ],
 *         'q': ParamSearch,
 *         'id': ParamID,
 *     }
 * }
 */
export class Location {

    /** (string) @see route-parser {@link https://github.com/rcs/route-parser}
    * Should be set in derived class.*/
    static route = null
    /** (object) valid paramaters in search i.e. QueryParams. Should be set in child class.*/
    static params = {}
    /** (object) will add default values to url search if not present */
    static default_params = {}
    /** (array) will always be added to matched params */
    static const_queries = []

    //FIXME and what is this ??
    static _fixme(obj){
        return Location.route && Route(Location.route).reverse(obj)
    }

    constructor(href, config={}) {

        this.config = config
        this.config.debug = config.debug || false
        this.config.log = config.log || console.log

        this._matches = []
        this._matched_params = {}
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

        // add matches
        var match = this.constructor.route && Route(this.constructor.route).match(uri.pathname())
        match && this._setParams(match) 

        // add search
        const new_search = this._setParams(search)

        // add constant matches
        this._matches = this._matches.concat(this.constructor.const_queries)

        this._uri = uri.search(new_search).normalize()

        this.config.debug && this.config.log(
            'Location.constructor: this._matches:',
            //pretty(this._matches.map(x => x.toString())),
            this._matches,
            'href', href)
    }

    _setParams(search) {

        const params = this.constructor.params
        var new_search = {}

        for (var key in search) {
            const p = params[key]
            if (!p) return; // if unrecognized param

            var val = search[key]
            // if search has same key more than twice take last value
            if (Array.isArray(val)) { 
                val = val.slice(-1)[0] 
            }

            if (Array.isArray(p)) { // if param is enum its an array
                p.forEach( pp => {
                    if (val === pp.key) { // if this param matches enum
                        new_search[key] = val
                        this._matches.push(pp.match(val))
                        this._matched_params[key] = pp
                    }
                })
            } else { // else its scalar
                if (!p.validate(val)) { // if it does not pass validation
                    this._valid = false
                    return 
                }
                new_search[key] = val
                this._matches.push(p.match(val))
                this._matched_params[key] = p
            }
        }
        return new_search
    }

    /** gets matched param by key. Useful for finding matched QueryEnumParam.
     * @param {string} key - key for this.constructor.params
     * returns {QueryParam}
     */
    getMatchedParam(key) {
        return this._matched_params[key]
    }

    /** Did all the params pass validation. 
     * returns {bool}
     */
    isValid() {
        return this._valid
    }

    /** 
     * Returns new href from search object.
     * @param {object} search - URI type search object
     * @returns {string}
    */
    //TODO change name to UrlFromSearch
    hrefFromSearch(search) {

        var old_search = this._uri.search(true)
        Object.assign(old_search, search)
        var href = this._uri.clone().search(old_search).normalize().toString()
        return href
    }

    /** Compares the string representation of the uri.
     * @param {Location} other - the other Location instance
     * @returns {bool}
    */
    equal(other) {
        return this._uri.toString() === other._uri.toString()
    }

    /** returns api params
     * @returns {array}
    */
    matches() {
        return this._matches
    }

    /** @returns {string} the processed url */
    url() {
        return this._uri.toString()
    }

    /** Returns the path and search without the host
     * @returns {string} URI.pathname() + URI.search() 
    */
    href() {
        return this._uri.pathname() + this._uri.search() + this._uri.hash()
    }

    /** @returns {string} URI.pathname() */
    pathname() {
        return this._uri.pathname()
    }

    /** @returns {object} URI.search(true) */
    search() {
        return this._uri.search(true)
    }
}




