'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Location = exports.QueryEnumParam = exports.QueryParam = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

var _routeParser = require('route-parser');

var _routeParser2 = _interopRequireDefault(_routeParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var QueryParam = exports.QueryParam = function () {
    function QueryParam(match_func, display, validate_func) {
        _classCallCheck(this, QueryParam);

        this.match_func = match_func;
        this.validate_func = validate_func;
        this.display = display;
    }

    /** Called to see if the url matches with match_func 
    *   and then returns the value if it does.*/


    _createClass(QueryParam, [{
        key: 'match',
        value: function match(value) {
            return this.match_func && this.match_func(value);
        }

        /** Returns true if the value is valid with validate_func or true if
         * validate_func is not set. 
         */

    }, {
        key: 'validate',
        value: function validate(value) {
            if (!this.validate_func) return true;else return this.validate_func(value);
        }
    }]);

    return QueryParam;
}();

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


var QueryEnumParam = exports.QueryEnumParam = function (_QueryParam) {
    _inherits(QueryEnumParam, _QueryParam);

    function QueryEnumParam(key, match_func, display) {
        _classCallCheck(this, QueryEnumParam);

        var _this = _possibleConstructorReturn(this, (QueryEnumParam.__proto__ || Object.getPrototypeOf(QueryEnumParam)).call(this, match_func, display));

        _this.key = key;
        return _this;
    }

    return QueryEnumParam;
}(QueryParam);

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


var Location = exports.Location = function () {
    _createClass(Location, null, [{
        key: '_fixme',


        //FIXME and what is this ??

        /** (object) will add default values to url search if not present */


        /** (string) @see route-parser {@link https://github.com/rcs/route-parser}
        * Should be set in derived class.*/
        value: function _fixme(obj) {
            return Location.route && (0, _routeParser2.default)(Location.route).reverse(obj);
        }
        /** (array) will always be added to matched params */

        /** (object) valid paramaters in search i.e. QueryParams. Should be set in child class.*/

    }]);

    function Location(href) {
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Location);

        this.config = config;
        this.config.debug = config.debug || false;
        this.config.log = config.log || console.log;

        this._matches = [];
        this._matched_params = {};
        this._valid = true;

        var uri = new _urijs2.default(href).normalize();
        var search = uri.search(true);

        // add default params
        var defaults = this.constructor.default_params;
        //const params = this.constructor.params
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.entries(defaults)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _step$value = _slicedToArray(_step.value, 2),
                    key = _step$value[0],
                    value = _step$value[1];

                if (typeof search[key] == 'undefined') search[key] = value;
            }

            // add matches
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var match = this.constructor.route && (0, _routeParser2.default)(this.constructor.route).match(uri.pathname());
        match && this._setParams(match);

        // add search
        var new_search = this._setParams(search);

        // add constant matches
        this._matches = this._matches.concat(this.constructor.const_queries);

        this._uri = uri.search(new_search).normalize();

        this.config.debug && this.config.log('Location.constructor: this._matches:',
        //pretty(this._matches.map(x => x.toString())),
        this._matches, 'href', href);
    }

    _createClass(Location, [{
        key: '_setParams',
        value: function _setParams(search) {
            var _this2 = this;

            var params = this.constructor.params;
            var new_search = {};

            for (var key in search) {
                var p = params[key];
                if (!p) return; // if unrecogonized param

                var val = search[key];
                // if search has same key more than twice take last value
                if (Array.isArray(val)) {
                    val = val.slice(-1)[0];
                }

                if (Array.isArray(p)) {
                    // if param is enum its an array
                    p.forEach(function (pp) {
                        if (val === pp.key) {
                            // if this param matches enum
                            new_search[key] = val;
                            _this2._matches.push(pp.match(val));
                            _this2._matched_params[key] = pp;
                        }
                    });
                } else {
                    // else its scalar
                    if (!p.validate(val)) {
                        // if it does not pass validation
                        this._valid = false;
                        return;
                    }
                    new_search[key] = val;
                    this._matches.push(p.match(val));
                    this._matched_params[key] = p;
                }
            }
            return new_search;
        }

        /** Did all the params pass validation. 
         * @param {string} key - key for this.params
         * returns {QueryParam}
         */

    }, {
        key: 'getMatchedParam',
        value: function getMatchedParam(key) {
            return this._matched_params[key];
        }

        /** Did all the params pass validation. 
         * returns {bool}
         */

    }, {
        key: 'isValid',
        value: function isValid() {
            return this._valid;
        }

        /** 
         * Returns new href from search object.
         * @param {object} search - URI type search object
         * @returns {string}
        */

    }, {
        key: 'hrefFromSearch',
        value: function hrefFromSearch(search) {

            var old_search = this._uri.search(true);
            Object.assign(old_search, search);
            var href = this._uri.clone().search(old_search).normalize().toString();
            return href;
        }

        /** Compares the string represenetation of the uri.
         * @param {Location} other - the other Location instance
         * @returns {bool}
        */

    }, {
        key: 'equal',
        value: function equal(other) {
            return this._uri.toString() === other._uri.toString();
        }

        /** returns api params
         * @returns {array}
        */

    }, {
        key: 'matches',
        value: function matches() {
            return this._matches;
        }

        /** @returns {string} the processed url */

    }, {
        key: 'url',
        value: function url() {
            return this._uri.toString();
        }

        /** Returns the path and search without the host
         * @returns {string} URI.pathanme() + URI.search() 
        */

    }, {
        key: 'href',
        value: function href() {
            return this._uri.pathname() + this._uri.search() + this._uri.hash();
        }

        /** @returns {string} URI.pathname() */

    }, {
        key: 'pathname',
        value: function pathname() {
            return this._uri.pathname();
        }

        /** @returns {object} URI.search(true) */

    }, {
        key: 'search',
        value: function search() {
            return this._uri.search(true);
        }
    }]);

    return Location;
}();

Location.route = null;
Location.params = {};
Location.default_params = {};
Location.const_queries = [];
