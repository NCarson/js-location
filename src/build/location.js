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

/*****************************************************************************
 *  Params
/****************************************************************************/

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

/*****************************************************************************
 *  location
/****************************************************************************/

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

        /** will add default values to url search if not present */


        /** regex to match paths to. 
         * Should be set in child class.
        */
        value: function _fixme(obj) {
            return Location.route && (0, _routeParser2.default)(Location.route).reverse(obj);
        }
        /** will always be added to matched params */

        /** valid paramaters in search i.e. QueryParams. Should be set in child class.*/

    }]);

    function Location(href) {
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Location);

        this.config = config;
        this.config.debug = config.debug || false;
        this.config.log = config.log || console.log;

        this._matches = [];
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

            // add search
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

        var new_search = this._setParams(search);

        // add matches
        var match = this.constructor.route && (0, _routeParser2.default)(this.constructor.route).match(uri.pathname());
        match && this._setParams(match);

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

            Object.keys(search).forEach(function (key) {
                var p = params[key];
                if (!p) return; // if unrecogonized param

                var val = search[key];
                // if search has same key more than twice take last value
                if (Array.isArray(val)) {
                    val = val.slice(-1)[0];
                }

                if (Array.isArray(p)) {
                    // if param is enum
                    p.forEach(function (pp) {
                        if (val === pp.key) {
                            // if this param matches enum
                            new_search[key] = val;
                            _this2._matches.push(pp.match(val));
                        }
                    });
                } else {
                    // else
                    if (!p.validate(val)) {
                        // if it does not pass validation
                        _this2._valid = false;
                        return;
                    }
                    new_search[key] = val;
                    _this2._matches.push(p.match(val));
                }
            });
            return new_search;
        }

        /** Did all the params pass validation. 
         * returns {bool}
         */

    }, {
        key: 'isValid',
        value: function isValid() {
            return this._valid;
        }

        //TODO get rid of this

    }, {
        key: 'cloneFromSearch',
        value: function cloneFromSearch(search) {
            var old_search = this._uri.search();
            Object.assign(old_search, search);
            var href = this._uri.clone().search(old_search).normalize().toString();
            return this.constructor(href);
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
            return this._uri.pathname() + this._uri.search();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBVSxNQUFWLENBQWlCLElBQWpCLENBQVA7QUFDSDs7Ozs7O0FBMUpRLFEsQ0FLRixLLEdBQVEsSTtBQUxOLFEsQ0FPRixNLEdBQVMsRTtBQVBQLFEsQ0FTRixjLEdBQWlCLEU7QUFUZixRLENBV0YsYSxHQUFnQixFIiwiZmlsZSI6ImxvY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFVSSSBmcm9tICd1cmlqcydcbmltcG9ydCBSb3V0ZSBmcm9tICdyb3V0ZS1wYXJzZXInXG5cbi8vY29uc3QgcHJldHR5ID0gKG9iaikgPT4gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCAyKTsgLy8gc3BhY2luZyBsZXZlbCA9IDJcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiAgUGFyYW1zXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqIFJlcHJlc2VudHMgc29tZSBzb3J0IG9mIEFQSSBwYXJhbSB0aGF0IGlzIGVtYmVkZGVkIGluIGEgVVJMXG4gKiAgQGV4cG9ydHNcbiAqICBAcGFyYW0ge2Z1bmN0aW9ufSBtYXRjaF9mdW5jIC0gYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgdXJsIGFuZCByZXR1cm5zIHRoZSBhcGkgcGFyYW1cbiAqICBAcGFyYW0ge3N0cmluZ30gW2Rpc3BsYXldIC0gcHJldHR5IG5hbWUgb2YgdGhpcyBwYXJhbSB0byBkaXNwbGF5XG4gKiAgQHBhcmFtIHtmdW5jdGlvbn0gW3ZhbGlkYXRlX2Z1bmNdIC0gaXMgdGhlIHZhbHVlIHZhbGlkXG4gKiAgQGV4YW1wbGVcbiAqIGNvbnN0IFBhcmFtU2VhcmNoID0gbmV3IFF1ZXJ5UGFyYW0oXG4gKiAgICAgICh2KSA9PiAoYHdoZXJlIG5hbWUgPSAnJHt2fSdgKSwgXG4gKiAgICAgICdTZWFyY2gnLFxuICogICAgICAodikgPT4gLyhcXEQrKS8udGVzdCh2KSlcbiAqIGNvbnN0IFBhcmFtSUQgPSBuZXcgUXVlcnlQYXJhbSgodikgPT4gKGB3aGVyZSBpZCA9ICR7dn1gKSwgbnVsbCwgbnVsbClcbiovXG5leHBvcnQgY2xhc3MgUXVlcnlQYXJhbSB7XG4gICAgY29uc3RydWN0b3IobWF0Y2hfZnVuYywgZGlzcGxheSwgdmFsaWRhdGVfZnVuYykge1xuICAgICAgICB0aGlzLm1hdGNoX2Z1bmMgPSBtYXRjaF9mdW5jXG4gICAgICAgIHRoaXMudmFsaWRhdGVfZnVuYyA9IHZhbGlkYXRlX2Z1bmNcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gZGlzcGxheVxuICAgIH1cblxuICAgIC8qKiBDYWxsZWQgdG8gc2VlIGlmIHRoZSB1cmwgbWF0Y2hlcyB3aXRoIG1hdGNoX2Z1bmMgXG4gICAgKiAgIGFuZCB0aGVuIHJldHVybnMgdGhlIHZhbHVlIGlmIGl0IGRvZXMuKi9cbiAgICBtYXRjaCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRjaF9mdW5jICYmIHRoaXMubWF0Y2hfZnVuYyh2YWx1ZSlcbiAgICB9XG5cbiAgICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSB2YWx1ZSBpcyB2YWxpZCB3aXRoIHZhbGlkYXRlX2Z1bmMgb3IgdHJ1ZSBpZlxuICAgICAqIHZhbGlkYXRlX2Z1bmMgaXMgbm90IHNldC4gXG4gICAgICovXG4gICAgdmFsaWRhdGUodmFsdWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlX2Z1bmMpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZV9mdW5jKHZhbHVlKVxuICAgIH1cbn1cblxuLyoqIFxuICogQW4gZW51bWVyYXRlZCBRdWVyeVBhcmFtIHRoYXQgY2FuIG9ubHkgaGF2ZSBvbmUgdmFsdWVcbiAqIEBleHRlbmRzIFF1ZXJ5UGFyYW1cbiAqICBAcGFyYW0ge3N0cmluZ30ga2V5IC0gdGhlIGV4YWN0IHZhbHVlIG9mIHRoZSBwYXJhbVxuICogIEBwYXJhbSB7ZnVuY3Rpb259IG1hdGNoX2Z1bmMgLSBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSB1cmwgYW5kIHJldHVybnMgdGhlIGFwaSBwYXJhbVxuICogIEBwYXJhbSB7c3RyaW5nfSBbZGlzcGxheV0gLSBwcmV0dHkgbmFtZSBvZiB0aGlzIHBhcmFtIHRvIGRpc3BsYXlcbiAqICBAZXhhbXBsZVxuICogY29uc3QgUGFyYW1Tb3J0TmFtZSA9IG5ldyBRdWVyeUVudW1QYXJhbShcbiAqICAgICAgJ2FiYycsIFxuICogICAgICAoKSA9PiAoJ29yZGVyIGJ5IG5hbWUnKSxcbiAqICAgICAgJ2J5IE5hbWUnLCApXG5jb25zdCBQYXJhbVNvcnRQb3AgPSBuZXcgUXVlcnlFbnVtUGFyYW0oXG4gICAgICAgICdwb3AnLCBcbiAgICAgICAgKCkgPT4gKCdvcmRlciBieSBjb3VudCBkZXNjJyksIFxuICAgICAgICAnYnkgUG9wdWxhcml0eScpXG4qL1xuZXhwb3J0IGNsYXNzIFF1ZXJ5RW51bVBhcmFtICBleHRlbmRzIFF1ZXJ5UGFyYW0ge1xuICAgIGNvbnN0cnVjdG9yKGtleSwgbWF0Y2hfZnVuYywgZGlzcGxheSkge1xuICAgICAgICBzdXBlcihtYXRjaF9mdW5jLCBkaXNwbGF5KVxuICAgICAgICB0aGlzLmtleSA9IGtleVxuICAgIH1cbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiAgbG9jYXRpb25cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKiogQmFzZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tXG4gKiBAcGFyYW0ge3N0cmluZ30gaHJlZiAtIHRoZSBpbnN0YW5jZSBocmVmIG9mIHRoZSBsb2NhdGlvblxuICogQHBhcmFtIHtvYmplY3R9IFtjb25maWc9e31dIFxuICogQHBhcmFtIHtib29sfSBbY29uZmlnLmRlYnVnPXRydWVdIC0gZXh0cmEgZGVidWcgaW5mb1xuICogQHBhcmFtIHtmdW5jfSBbY29uZmlnLmxvZz1jb25zb2xlLmxvZ10gLSBkZWJ1ZyBsb2dnaW5nIGZ1bmNcbiAqIEBleGFtcGxlXG4gKiBleHBvcnQgY2xhc3MgVGVzdExvY2F0aW9uIGV4dGVuZHMgTG9jYXRpb24ge1xuICogICAgIHN0YXRpYyByb3V0ZSA9ICcvdGVzdC86aWQoXFxcXGQrKS8nOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVzZWxlc3MtZXNjYXBlXG4gKiAgICAgc3RhdGljIHBhcmFtcyA9IHtcbiAqICAgICAgICAgJ28nOiBbXG4gKiAgICAgICAgICAgICBQYXJhbVNvcnROYW1lLFxuICogICAgICAgICAgICAgUGFyYW1Tb3J0UG9wLFxuICogICAgICAgICBdLFxuICogICAgICAgICAncSc6IFBhcmFtU2VhcmNoLFxuICogICAgICAgICAnaWQnOiBQYXJhbUlELFxuICogICAgIH1cbiAqIH1cbiAqL1xuZXhwb3J0IGNsYXNzIExvY2F0aW9uIHtcblxuICAgIC8qKiByZWdleCB0byBtYXRjaCBwYXRocyB0by4gXG4gICAgICogU2hvdWxkIGJlIHNldCBpbiBjaGlsZCBjbGFzcy5cbiAgICAqL1xuICAgIHN0YXRpYyByb3V0ZSA9IG51bGxcbiAgICAvKiogdmFsaWQgcGFyYW1hdGVycyBpbiBzZWFyY2ggaS5lLiBRdWVyeVBhcmFtcy4gU2hvdWxkIGJlIHNldCBpbiBjaGlsZCBjbGFzcy4qL1xuICAgIHN0YXRpYyBwYXJhbXMgPSB7fVxuICAgIC8qKiB3aWxsIGFkZCBkZWZhdWx0IHZhbHVlcyB0byB1cmwgc2VhcmNoIGlmIG5vdCBwcmVzZW50ICovXG4gICAgc3RhdGljIGRlZmF1bHRfcGFyYW1zID0ge31cbiAgICAvKiogd2lsbCBhbHdheXMgYmUgYWRkZWQgdG8gbWF0Y2hlZCBwYXJhbXMgKi9cbiAgICBzdGF0aWMgY29uc3RfcXVlcmllcyA9IFtdXG5cbiAgICAvL0ZJWE1FIGFuZCB3aGF0IGlzIHRoaXMgPz9cbiAgICBzdGF0aWMgX2ZpeG1lKG9iail7XG4gICAgICAgIHJldHVybiBMb2NhdGlvbi5yb3V0ZSAmJiBSb3V0ZShMb2NhdGlvbi5yb3V0ZSkucmV2ZXJzZShvYmopXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoaHJlZiwgY29uZmlnPXt9KSB7XG5cbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWdcbiAgICAgICAgdGhpcy5jb25maWcuZGVidWcgPSBjb25maWcuZGVidWcgfHwgZmFsc2VcbiAgICAgICAgdGhpcy5jb25maWcubG9nID0gY29uZmlnLmxvZyB8fCBjb25zb2xlLmxvZ1xuXG4gICAgICAgIHRoaXMuX21hdGNoZXMgPSBbXVxuICAgICAgICB0aGlzLl92YWxpZCA9IHRydWVcblxuICAgICAgICB2YXIgdXJpID0gbmV3IFVSSShocmVmKS5ub3JtYWxpemUoKVxuICAgICAgICB2YXIgc2VhcmNoID0gdXJpLnNlYXJjaCh0cnVlKVxuXG4gICAgICAgIC8vIGFkZCBkZWZhdWx0IHBhcmFtc1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHRoaXMuY29uc3RydWN0b3IuZGVmYXVsdF9wYXJhbXNcbiAgICAgICAgLy9jb25zdCBwYXJhbXMgPSB0aGlzLmNvbnN0cnVjdG9yLnBhcmFtc1xuICAgICAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGVmYXVsdHMpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNlYXJjaFtrZXldID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICAgIHNlYXJjaFtrZXldID0gdmFsdWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCBzZWFyY2hcbiAgICAgICAgY29uc3QgbmV3X3NlYXJjaCA9IHRoaXMuX3NldFBhcmFtcyhzZWFyY2gpXG5cbiAgICAgICAgLy8gYWRkIG1hdGNoZXNcbiAgICAgICAgdmFyIG1hdGNoID0gdGhpcy5jb25zdHJ1Y3Rvci5yb3V0ZSAmJiBSb3V0ZSh0aGlzLmNvbnN0cnVjdG9yLnJvdXRlKS5tYXRjaCh1cmkucGF0aG5hbWUoKSlcbiAgICAgICAgbWF0Y2ggJiYgdGhpcy5fc2V0UGFyYW1zKG1hdGNoKSBcblxuICAgICAgICAvLyBhZGQgY29uc3RhbnQgbWF0Y2hlc1xuICAgICAgICB0aGlzLl9tYXRjaGVzID0gdGhpcy5fbWF0Y2hlcy5jb25jYXQodGhpcy5jb25zdHJ1Y3Rvci5jb25zdF9xdWVyaWVzKVxuXG4gICAgICAgIHRoaXMuX3VyaSA9IHVyaS5zZWFyY2gobmV3X3NlYXJjaCkubm9ybWFsaXplKClcblxuICAgICAgICB0aGlzLmNvbmZpZy5kZWJ1ZyAmJiB0aGlzLmNvbmZpZy5sb2coXG4gICAgICAgICAgICAnTG9jYXRpb24uY29uc3RydWN0b3I6IHRoaXMuX21hdGNoZXM6JyxcbiAgICAgICAgICAgIC8vcHJldHR5KHRoaXMuX21hdGNoZXMubWFwKHggPT4geC50b1N0cmluZygpKSksXG4gICAgICAgICAgICB0aGlzLl9tYXRjaGVzLFxuICAgICAgICAgICAgJ2hyZWYnLCBocmVmKVxuICAgIH1cblxuICAgIF9zZXRQYXJhbXMoc2VhcmNoKSB7XG5cbiAgICAgICAgY29uc3QgcGFyYW1zID0gdGhpcy5jb25zdHJ1Y3Rvci5wYXJhbXNcbiAgICAgICAgdmFyIG5ld19zZWFyY2ggPSB7fVxuXG4gICAgICAgIE9iamVjdC5rZXlzKHNlYXJjaCkuZm9yRWFjaCgga2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBwYXJhbXNba2V5XVxuICAgICAgICAgICAgaWYgKCFwKSByZXR1cm47IC8vIGlmIHVucmVjb2dvbml6ZWQgcGFyYW1cblxuICAgICAgICAgICAgdmFyIHZhbCA9IHNlYXJjaFtrZXldXG4gICAgICAgICAgICAvLyBpZiBzZWFyY2ggaGFzIHNhbWUga2V5IG1vcmUgdGhhbiB0d2ljZSB0YWtlIGxhc3QgdmFsdWVcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHsgXG4gICAgICAgICAgICAgICAgdmFsID0gdmFsLnNsaWNlKC0xKVswXSBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocCkpIHsgLy8gaWYgcGFyYW0gaXMgZW51bVxuICAgICAgICAgICAgICAgIHAuZm9yRWFjaCggcHAgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsID09PSBwcC5rZXkpIHsgLy8gaWYgdGhpcyBwYXJhbSBtYXRjaGVzIGVudW1cbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld19zZWFyY2hba2V5XSA9IHZhbFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF0Y2hlcy5wdXNoKHBwLm1hdGNoKHZhbCkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gZWxzZVxuICAgICAgICAgICAgICAgIGlmICghcC52YWxpZGF0ZSh2YWwpKSB7IC8vIGlmIGl0IGRvZXMgbm90IHBhc3MgdmFsaWRhdGlvblxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWxpZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmV3X3NlYXJjaFtrZXldID0gdmFsXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0Y2hlcy5wdXNoKHAubWF0Y2godmFsKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIG5ld19zZWFyY2hcbiAgICB9XG5cbiAgICAvKiogRGlkIGFsbCB0aGUgcGFyYW1zIHBhc3MgdmFsaWRhdGlvbi4gXG4gICAgICogcmV0dXJucyB7Ym9vbH1cbiAgICAgKi9cbiAgICBpc1ZhbGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsaWRcbiAgICB9XG5cbiAgICAvL1RPRE8gZ2V0IHJpZCBvZiB0aGlzXG4gICAgY2xvbmVGcm9tU2VhcmNoKHNlYXJjaCkge1xuICAgICAgICB2YXIgb2xkX3NlYXJjaCA9IHRoaXMuX3VyaS5zZWFyY2goKVxuICAgICAgICBPYmplY3QuYXNzaWduKG9sZF9zZWFyY2gsIHNlYXJjaClcbiAgICAgICAgdmFyIGhyZWYgPSB0aGlzLl91cmkuY2xvbmUoKS5zZWFyY2gob2xkX3NlYXJjaCkubm9ybWFsaXplKCkudG9TdHJpbmcoKVxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihocmVmKVxuICAgIH1cblxuICAgIC8qKiBcbiAgICAgKiBSZXR1cm5zIG5ldyBocmVmIGZyb20gc2VhcmNoIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc2VhcmNoIC0gVVJJIHR5cGUgc2VhcmNoIG9iamVjdFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgKi9cbiAgICBocmVmRnJvbVNlYXJjaChzZWFyY2gpIHtcblxuICAgICAgICB2YXIgb2xkX3NlYXJjaCA9IHRoaXMuX3VyaS5zZWFyY2godHJ1ZSlcbiAgICAgICAgT2JqZWN0LmFzc2lnbihvbGRfc2VhcmNoLCBzZWFyY2gpXG4gICAgICAgIHZhciBocmVmID0gdGhpcy5fdXJpLmNsb25lKCkuc2VhcmNoKG9sZF9zZWFyY2gpLm5vcm1hbGl6ZSgpLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIGhyZWZcbiAgICB9XG5cbiAgICAvKiogQ29tcGFyZXMgdGhlIHN0cmluZyByZXByZXNlbmV0YXRpb24gb2YgdGhlIHVyaS5cbiAgICAgKiBAcGFyYW0ge0xvY2F0aW9ufSBvdGhlciAtIHRoZSBvdGhlciBMb2NhdGlvbiBpbnN0YW5jZVxuICAgICAqIEByZXR1cm5zIHtib29sfVxuICAgICovXG4gICAgZXF1YWwob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VyaS50b1N0cmluZygpID09PSBvdGhlci5fdXJpLnRvU3RyaW5nKClcbiAgICB9XG5cbiAgICAvKiogcmV0dXJucyBhcGkgcGFyYW1zXG4gICAgICogQHJldHVybnMge2FycmF5fVxuICAgICovXG4gICAgbWF0Y2hlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hdGNoZXNcbiAgICB9XG5cbiAgICAvKiogQHJldHVybnMge3N0cmluZ30gdGhlIHByb2Nlc3NlZCB1cmwgKi9cbiAgICB1cmwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91cmkudG9TdHJpbmcoKVxuICAgIH1cblxuICAgIC8qKiBSZXR1cm5zIHRoZSBwYXRoIGFuZCBzZWFyY2ggd2l0aG91dCB0aGUgaG9zdFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFVSSS5wYXRoYW5tZSgpICsgVVJJLnNlYXJjaCgpIFxuICAgICovXG4gICAgaHJlZigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VyaS5wYXRobmFtZSgpICsgdGhpcy5fdXJpLnNlYXJjaCgpXG4gICAgfVxuXG4gICAgLyoqIEByZXR1cm5zIHtzdHJpbmd9IFVSSS5wYXRobmFtZSgpICovXG4gICAgcGF0aG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91cmkucGF0aG5hbWUoKVxuICAgIH1cblxuICAgIC8qKiBAcmV0dXJucyB7b2JqZWN0fSBVUkkuc2VhcmNoKHRydWUpICovXG4gICAgc2VhcmNoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXJpLnNlYXJjaCh0cnVlKVxuICAgIH1cbn1cblxuXG5cblxuIl19