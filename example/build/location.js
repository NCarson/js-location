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
                        this._valid = false;
                        return;
                    }
                    new_search[key] = val;
                    this._matches.push(p.match(val));
                }
            }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xvY2F0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7O0FBRUE7Ozs7QUFJQTs7Ozs7Ozs7Ozs7O0lBWWEsVSxXQUFBLFU7QUFDVCx3QkFBWSxVQUFaLEVBQXdCLE9BQXhCLEVBQWlDLGFBQWpDLEVBQWdEO0FBQUE7O0FBQzVDLGFBQUssVUFBTCxHQUFrQixVQUFsQjtBQUNBLGFBQUssYUFBTCxHQUFxQixhQUFyQjtBQUNBLGFBQUssT0FBTCxHQUFlLE9BQWY7QUFDSDs7QUFFRDs7Ozs7OzhCQUVNLEssRUFBTztBQUNULG1CQUFPLEtBQUssVUFBTCxJQUFtQixLQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsQ0FBMUI7QUFDSDs7QUFFRDs7Ozs7O2lDQUdTLEssRUFBTztBQUNaLGdCQUFJLENBQUMsS0FBSyxhQUFWLEVBQ0ksT0FBTyxJQUFQLENBREosS0FHSSxPQUFPLEtBQUssYUFBTCxDQUFtQixLQUFuQixDQUFQO0FBQ1A7Ozs7OztBQUdMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQmEsYyxXQUFBLGM7OztBQUNULDRCQUFZLEdBQVosRUFBaUIsVUFBakIsRUFBNkIsT0FBN0IsRUFBc0M7QUFBQTs7QUFBQSxvSUFDNUIsVUFENEIsRUFDaEIsT0FEZ0I7O0FBRWxDLGNBQUssR0FBTCxHQUFXLEdBQVg7QUFGa0M7QUFHckM7OztFQUpnQyxVOztBQU9yQzs7OztBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCYSxRLFdBQUEsUTs7Ozs7QUFhVDs7QUFMQTs7O0FBTkE7OzsrQkFZYyxHLEVBQUk7QUFDZCxtQkFBTyxTQUFTLEtBQVQsSUFBa0IsMkJBQU0sU0FBUyxLQUFmLEVBQXNCLE9BQXRCLENBQThCLEdBQTlCLENBQXpCO0FBQ0g7QUFORDs7QUFKQTs7OztBQVlBLHNCQUFZLElBQVosRUFBNkI7QUFBQSxZQUFYLE1BQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFFekIsYUFBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLGFBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsT0FBTyxLQUFQLElBQWdCLEtBQXBDO0FBQ0EsYUFBSyxNQUFMLENBQVksR0FBWixHQUFrQixPQUFPLEdBQVAsSUFBYyxRQUFRLEdBQXhDOztBQUVBLGFBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLGFBQUssTUFBTCxHQUFjLElBQWQ7O0FBRUEsWUFBSSxNQUFNLElBQUksZUFBSixDQUFRLElBQVIsRUFBYyxTQUFkLEVBQVY7QUFDQSxZQUFJLFNBQVMsSUFBSSxNQUFKLENBQVcsSUFBWCxDQUFiOztBQUVBO0FBQ0EsWUFBTSxXQUFXLEtBQUssV0FBTCxDQUFpQixjQUFsQztBQUNBO0FBZHlCO0FBQUE7QUFBQTs7QUFBQTtBQWV6QixpQ0FBeUIsT0FBTyxPQUFQLENBQWUsUUFBZixDQUF6Qiw4SEFBbUQ7QUFBQTtBQUFBLG9CQUF6QyxHQUF5QztBQUFBLG9CQUFwQyxLQUFvQzs7QUFDL0Msb0JBQUksT0FBTyxPQUFPLEdBQVAsQ0FBUCxJQUFzQixXQUExQixFQUNJLE9BQU8sR0FBUCxJQUFjLEtBQWQ7QUFDUDs7QUFFRDtBQXBCeUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFxQnpCLFlBQUksUUFBUSxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsSUFBMEIsMkJBQU0sS0FBSyxXQUFMLENBQWlCLEtBQXZCLEVBQThCLEtBQTlCLENBQW9DLElBQUksUUFBSixFQUFwQyxDQUF0QztBQUNBLGlCQUFTLEtBQUssVUFBTCxDQUFnQixLQUFoQixDQUFUOztBQUVBO0FBQ0EsWUFBTSxhQUFhLEtBQUssVUFBTCxDQUFnQixNQUFoQixDQUFuQjs7QUFFQTtBQUNBLGFBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLEtBQUssV0FBTCxDQUFpQixhQUF0QyxDQUFoQjs7QUFFQSxhQUFLLElBQUwsR0FBWSxJQUFJLE1BQUosQ0FBVyxVQUFYLEVBQXVCLFNBQXZCLEVBQVo7O0FBRUEsYUFBSyxNQUFMLENBQVksS0FBWixJQUFxQixLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQ2pCLHNDQURpQjtBQUVqQjtBQUNBLGFBQUssUUFIWSxFQUlqQixNQUppQixFQUlULElBSlMsQ0FBckI7QUFLSDs7OzttQ0FFVSxNLEVBQVE7QUFBQTs7QUFFZixnQkFBTSxTQUFTLEtBQUssV0FBTCxDQUFpQixNQUFoQztBQUNBLGdCQUFJLGFBQWEsRUFBakI7O0FBRUEsaUJBQUssSUFBSSxHQUFULElBQWdCLE1BQWhCLEVBQXdCO0FBQ3BCLG9CQUFNLElBQUksT0FBTyxHQUFQLENBQVY7QUFDQSxvQkFBSSxDQUFDLENBQUwsRUFBUSxPQUZZLENBRUo7O0FBRWhCLG9CQUFJLE1BQU0sT0FBTyxHQUFQLENBQVY7QUFDQTtBQUNBLG9CQUFJLE1BQU0sT0FBTixDQUFjLEdBQWQsQ0FBSixFQUF3QjtBQUNwQiwwQkFBTSxJQUFJLEtBQUosQ0FBVSxDQUFDLENBQVgsRUFBYyxDQUFkLENBQU47QUFDSDs7QUFFRCxvQkFBSSxNQUFNLE9BQU4sQ0FBYyxDQUFkLENBQUosRUFBc0I7QUFBRTtBQUNwQixzQkFBRSxPQUFGLENBQVcsY0FBTTtBQUNiLDRCQUFJLFFBQVEsR0FBRyxHQUFmLEVBQW9CO0FBQUU7QUFDbEIsdUNBQVcsR0FBWCxJQUFrQixHQUFsQjtBQUNBLG1DQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLEdBQUcsS0FBSCxDQUFTLEdBQVQsQ0FBbkI7QUFDSDtBQUNKLHFCQUxEO0FBTUgsaUJBUEQsTUFPTztBQUFFO0FBQ0wsd0JBQUksQ0FBQyxFQUFFLFFBQUYsQ0FBVyxHQUFYLENBQUwsRUFBc0I7QUFBRTtBQUNwQiw2QkFBSyxNQUFMLEdBQWMsS0FBZDtBQUNBO0FBQ0g7QUFDRCwrQkFBVyxHQUFYLElBQWtCLEdBQWxCO0FBQ0EseUJBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsRUFBRSxLQUFGLENBQVEsR0FBUixDQUFuQjtBQUNIO0FBQ0o7QUFDRCxtQkFBTyxVQUFQO0FBQ0g7O0FBRUQ7Ozs7OztrQ0FHVTtBQUNOLG1CQUFPLEtBQUssTUFBWjtBQUNIOztBQUVEOzs7O3dDQUNnQixNLEVBQVE7QUFDcEIsZ0JBQUksYUFBYSxLQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWpCO0FBQ0EsbUJBQU8sTUFBUCxDQUFjLFVBQWQsRUFBMEIsTUFBMUI7QUFDQSxnQkFBSSxPQUFPLEtBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsTUFBbEIsQ0FBeUIsVUFBekIsRUFBcUMsU0FBckMsR0FBaUQsUUFBakQsRUFBWDtBQUNBLG1CQUFPLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7O3VDQUtlLE0sRUFBUTs7QUFFbkIsZ0JBQUksYUFBYSxLQUFLLElBQUwsQ0FBVSxNQUFWLENBQWlCLElBQWpCLENBQWpCO0FBQ0EsbUJBQU8sTUFBUCxDQUFjLFVBQWQsRUFBMEIsTUFBMUI7QUFDQSxnQkFBSSxPQUFPLEtBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsTUFBbEIsQ0FBeUIsVUFBekIsRUFBcUMsU0FBckMsR0FBaUQsUUFBakQsRUFBWDtBQUNBLG1CQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs4QkFJTSxLLEVBQU87QUFDVCxtQkFBTyxLQUFLLElBQUwsQ0FBVSxRQUFWLE9BQXlCLE1BQU0sSUFBTixDQUFXLFFBQVgsRUFBaEM7QUFDSDs7QUFFRDs7Ozs7O2tDQUdVO0FBQ04sbUJBQU8sS0FBSyxRQUFaO0FBQ0g7O0FBRUQ7Ozs7OEJBQ007QUFDRixtQkFBTyxLQUFLLElBQUwsQ0FBVSxRQUFWLEVBQVA7QUFDSDs7QUFFRDs7Ozs7OytCQUdPO0FBQ0gsbUJBQU8sS0FBSyxJQUFMLENBQVUsUUFBVixLQUF1QixLQUFLLElBQUwsQ0FBVSxNQUFWLEVBQTlCO0FBQ0g7O0FBRUQ7Ozs7bUNBQ1c7QUFDUCxtQkFBTyxLQUFLLElBQUwsQ0FBVSxRQUFWLEVBQVA7QUFDSDs7QUFFRDs7OztpQ0FDUztBQUNMLG1CQUFPLEtBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsSUFBakIsQ0FBUDtBQUNIOzs7Ozs7QUExSlEsUSxDQUtGLEssR0FBUSxJO0FBTE4sUSxDQU9GLE0sR0FBUyxFO0FBUFAsUSxDQVNGLGMsR0FBaUIsRTtBQVRmLFEsQ0FXRixhLEdBQWdCLEUiLCJmaWxlIjoibG9jYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVVJJIGZyb20gJ3VyaWpzJ1xuaW1wb3J0IFJvdXRlIGZyb20gJ3JvdXRlLXBhcnNlcidcblxuLy9jb25zdCBwcmV0dHkgPSAob2JqKSA9PiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDIpOyAvLyBzcGFjaW5nIGxldmVsID0gMlxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqICBQYXJhbXNcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKiogUmVwcmVzZW50cyBzb21lIHNvcnQgb2YgQVBJIHBhcmFtIHRoYXQgaXMgZW1iZWRkZWQgaW4gYSBVUkxcbiAqICBAZXhwb3J0c1xuICogIEBwYXJhbSB7ZnVuY3Rpb259IG1hdGNoX2Z1bmMgLSBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSB1cmwgYW5kIHJldHVybnMgdGhlIGFwaSBwYXJhbVxuICogIEBwYXJhbSB7c3RyaW5nfSBbZGlzcGxheV0gLSBwcmV0dHkgbmFtZSBvZiB0aGlzIHBhcmFtIHRvIGRpc3BsYXlcbiAqICBAcGFyYW0ge2Z1bmN0aW9ufSBbdmFsaWRhdGVfZnVuY10gLSBpcyB0aGUgdmFsdWUgdmFsaWRcbiAqICBAZXhhbXBsZVxuICogY29uc3QgUGFyYW1TZWFyY2ggPSBuZXcgUXVlcnlQYXJhbShcbiAqICAgICAgKHYpID0+IChgd2hlcmUgbmFtZSA9ICcke3Z9J2ApLCBcbiAqICAgICAgJ1NlYXJjaCcsXG4gKiAgICAgICh2KSA9PiAvKFxcRCspLy50ZXN0KHYpKVxuICogY29uc3QgUGFyYW1JRCA9IG5ldyBRdWVyeVBhcmFtKCh2KSA9PiAoYHdoZXJlIGlkID0gJHt2fWApLCBudWxsLCBudWxsKVxuKi9cbmV4cG9ydCBjbGFzcyBRdWVyeVBhcmFtIHtcbiAgICBjb25zdHJ1Y3RvcihtYXRjaF9mdW5jLCBkaXNwbGF5LCB2YWxpZGF0ZV9mdW5jKSB7XG4gICAgICAgIHRoaXMubWF0Y2hfZnVuYyA9IG1hdGNoX2Z1bmNcbiAgICAgICAgdGhpcy52YWxpZGF0ZV9mdW5jID0gdmFsaWRhdGVfZnVuY1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSBkaXNwbGF5XG4gICAgfVxuXG4gICAgLyoqIENhbGxlZCB0byBzZWUgaWYgdGhlIHVybCBtYXRjaGVzIHdpdGggbWF0Y2hfZnVuYyBcbiAgICAqICAgYW5kIHRoZW4gcmV0dXJucyB0aGUgdmFsdWUgaWYgaXQgZG9lcy4qL1xuICAgIG1hdGNoKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hdGNoX2Z1bmMgJiYgdGhpcy5tYXRjaF9mdW5jKHZhbHVlKVxuICAgIH1cblxuICAgIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlIGlzIHZhbGlkIHdpdGggdmFsaWRhdGVfZnVuYyBvciB0cnVlIGlmXG4gICAgICogdmFsaWRhdGVfZnVuYyBpcyBub3Qgc2V0LiBcbiAgICAgKi9cbiAgICB2YWxpZGF0ZSh2YWx1ZSkge1xuICAgICAgICBpZiAoIXRoaXMudmFsaWRhdGVfZnVuYylcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlX2Z1bmModmFsdWUpXG4gICAgfVxufVxuXG4vKiogXG4gKiBBbiBlbnVtZXJhdGVkIFF1ZXJ5UGFyYW0gdGhhdCBjYW4gb25seSBoYXZlIG9uZSB2YWx1ZVxuICogQGV4dGVuZHMgUXVlcnlQYXJhbVxuICogIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSB0aGUgZXhhY3QgdmFsdWUgb2YgdGhlIHBhcmFtXG4gKiAgQHBhcmFtIHtmdW5jdGlvbn0gbWF0Y2hfZnVuYyAtIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHVybCBhbmQgcmV0dXJucyB0aGUgYXBpIHBhcmFtXG4gKiAgQHBhcmFtIHtzdHJpbmd9IFtkaXNwbGF5XSAtIHByZXR0eSBuYW1lIG9mIHRoaXMgcGFyYW0gdG8gZGlzcGxheVxuICogIEBleGFtcGxlXG4gKiBjb25zdCBQYXJhbVNvcnROYW1lID0gbmV3IFF1ZXJ5RW51bVBhcmFtKFxuICogICAgICAnYWJjJywgXG4gKiAgICAgICgpID0+ICgnb3JkZXIgYnkgbmFtZScpLFxuICogICAgICAnYnkgTmFtZScsIClcbmNvbnN0IFBhcmFtU29ydFBvcCA9IG5ldyBRdWVyeUVudW1QYXJhbShcbiAgICAgICAgJ3BvcCcsIFxuICAgICAgICAoKSA9PiAoJ29yZGVyIGJ5IGNvdW50IGRlc2MnKSwgXG4gICAgICAgICdieSBQb3B1bGFyaXR5JylcbiovXG5leHBvcnQgY2xhc3MgUXVlcnlFbnVtUGFyYW0gIGV4dGVuZHMgUXVlcnlQYXJhbSB7XG4gICAgY29uc3RydWN0b3Ioa2V5LCBtYXRjaF9mdW5jLCBkaXNwbGF5KSB7XG4gICAgICAgIHN1cGVyKG1hdGNoX2Z1bmMsIGRpc3BsYXkpXG4gICAgICAgIHRoaXMua2V5ID0ga2V5XG4gICAgfVxufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqICBsb2NhdGlvblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKiBCYXNlIG9iamVjdCB0byBpbmhlcml0IGZyb21cbiAqIEBwYXJhbSB7c3RyaW5nfSBocmVmIC0gdGhlIGluc3RhbmNlIGhyZWYgb2YgdGhlIGxvY2F0aW9uXG4gKiBAcGFyYW0ge29iamVjdH0gW2NvbmZpZz17fV0gXG4gKiBAcGFyYW0ge2Jvb2x9IFtjb25maWcuZGVidWc9dHJ1ZV0gLSBleHRyYSBkZWJ1ZyBpbmZvXG4gKiBAcGFyYW0ge2Z1bmN9IFtjb25maWcubG9nPWNvbnNvbGUubG9nXSAtIGRlYnVnIGxvZ2dpbmcgZnVuY1xuICogQGV4YW1wbGVcbiAqIGV4cG9ydCBjbGFzcyBUZXN0TG9jYXRpb24gZXh0ZW5kcyBMb2NhdGlvbiB7XG4gKiAgICAgc3RhdGljIHJvdXRlID0gJy90ZXN0LzppZChcXFxcZCspLyc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdXNlbGVzcy1lc2NhcGVcbiAqICAgICBzdGF0aWMgcGFyYW1zID0ge1xuICogICAgICAgICAnbyc6IFtcbiAqICAgICAgICAgICAgIFBhcmFtU29ydE5hbWUsXG4gKiAgICAgICAgICAgICBQYXJhbVNvcnRQb3AsXG4gKiAgICAgICAgIF0sXG4gKiAgICAgICAgICdxJzogUGFyYW1TZWFyY2gsXG4gKiAgICAgICAgICdpZCc6IFBhcmFtSUQsXG4gKiAgICAgfVxuICogfVxuICovXG5leHBvcnQgY2xhc3MgTG9jYXRpb24ge1xuXG4gICAgLyoqIHJlZ2V4IHRvIG1hdGNoIHBhdGhzIHRvLiBcbiAgICAgKiBTaG91bGQgYmUgc2V0IGluIGNoaWxkIGNsYXNzLlxuICAgICovXG4gICAgc3RhdGljIHJvdXRlID0gbnVsbFxuICAgIC8qKiB2YWxpZCBwYXJhbWF0ZXJzIGluIHNlYXJjaCBpLmUuIFF1ZXJ5UGFyYW1zLiBTaG91bGQgYmUgc2V0IGluIGNoaWxkIGNsYXNzLiovXG4gICAgc3RhdGljIHBhcmFtcyA9IHt9XG4gICAgLyoqIHdpbGwgYWRkIGRlZmF1bHQgdmFsdWVzIHRvIHVybCBzZWFyY2ggaWYgbm90IHByZXNlbnQgKi9cbiAgICBzdGF0aWMgZGVmYXVsdF9wYXJhbXMgPSB7fVxuICAgIC8qKiB3aWxsIGFsd2F5cyBiZSBhZGRlZCB0byBtYXRjaGVkIHBhcmFtcyAqL1xuICAgIHN0YXRpYyBjb25zdF9xdWVyaWVzID0gW11cblxuICAgIC8vRklYTUUgYW5kIHdoYXQgaXMgdGhpcyA/P1xuICAgIHN0YXRpYyBfZml4bWUob2JqKXtcbiAgICAgICAgcmV0dXJuIExvY2F0aW9uLnJvdXRlICYmIFJvdXRlKExvY2F0aW9uLnJvdXRlKS5yZXZlcnNlKG9iailcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihocmVmLCBjb25maWc9e30pIHtcblxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZ1xuICAgICAgICB0aGlzLmNvbmZpZy5kZWJ1ZyA9IGNvbmZpZy5kZWJ1ZyB8fCBmYWxzZVxuICAgICAgICB0aGlzLmNvbmZpZy5sb2cgPSBjb25maWcubG9nIHx8IGNvbnNvbGUubG9nXG5cbiAgICAgICAgdGhpcy5fbWF0Y2hlcyA9IFtdXG4gICAgICAgIHRoaXMuX3ZhbGlkID0gdHJ1ZVxuXG4gICAgICAgIHZhciB1cmkgPSBuZXcgVVJJKGhyZWYpLm5vcm1hbGl6ZSgpXG4gICAgICAgIHZhciBzZWFyY2ggPSB1cmkuc2VhcmNoKHRydWUpXG5cbiAgICAgICAgLy8gYWRkIGRlZmF1bHQgcGFyYW1zXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0gdGhpcy5jb25zdHJ1Y3Rvci5kZWZhdWx0X3BhcmFtc1xuICAgICAgICAvL2NvbnN0IHBhcmFtcyA9IHRoaXMuY29uc3RydWN0b3IucGFyYW1zXG4gICAgICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkZWZhdWx0cykpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VhcmNoW2tleV0gPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgICAgc2VhcmNoW2tleV0gPSB2YWx1ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIG1hdGNoZXNcbiAgICAgICAgdmFyIG1hdGNoID0gdGhpcy5jb25zdHJ1Y3Rvci5yb3V0ZSAmJiBSb3V0ZSh0aGlzLmNvbnN0cnVjdG9yLnJvdXRlKS5tYXRjaCh1cmkucGF0aG5hbWUoKSlcbiAgICAgICAgbWF0Y2ggJiYgdGhpcy5fc2V0UGFyYW1zKG1hdGNoKSBcblxuICAgICAgICAvLyBhZGQgc2VhcmNoXG4gICAgICAgIGNvbnN0IG5ld19zZWFyY2ggPSB0aGlzLl9zZXRQYXJhbXMoc2VhcmNoKVxuXG4gICAgICAgIC8vIGFkZCBjb25zdGFudCBtYXRjaGVzXG4gICAgICAgIHRoaXMuX21hdGNoZXMgPSB0aGlzLl9tYXRjaGVzLmNvbmNhdCh0aGlzLmNvbnN0cnVjdG9yLmNvbnN0X3F1ZXJpZXMpXG5cbiAgICAgICAgdGhpcy5fdXJpID0gdXJpLnNlYXJjaChuZXdfc2VhcmNoKS5ub3JtYWxpemUoKVxuXG4gICAgICAgIHRoaXMuY29uZmlnLmRlYnVnICYmIHRoaXMuY29uZmlnLmxvZyhcbiAgICAgICAgICAgICdMb2NhdGlvbi5jb25zdHJ1Y3RvcjogdGhpcy5fbWF0Y2hlczonLFxuICAgICAgICAgICAgLy9wcmV0dHkodGhpcy5fbWF0Y2hlcy5tYXAoeCA9PiB4LnRvU3RyaW5nKCkpKSxcbiAgICAgICAgICAgIHRoaXMuX21hdGNoZXMsXG4gICAgICAgICAgICAnaHJlZicsIGhyZWYpXG4gICAgfVxuXG4gICAgX3NldFBhcmFtcyhzZWFyY2gpIHtcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLmNvbnN0cnVjdG9yLnBhcmFtc1xuICAgICAgICB2YXIgbmV3X3NlYXJjaCA9IHt9XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNlYXJjaCkge1xuICAgICAgICAgICAgY29uc3QgcCA9IHBhcmFtc1trZXldXG4gICAgICAgICAgICBpZiAoIXApIHJldHVybjsgLy8gaWYgdW5yZWNvZ29uaXplZCBwYXJhbVxuXG4gICAgICAgICAgICB2YXIgdmFsID0gc2VhcmNoW2tleV1cbiAgICAgICAgICAgIC8vIGlmIHNlYXJjaCBoYXMgc2FtZSBrZXkgbW9yZSB0aGFuIHR3aWNlIHRha2UgbGFzdCB2YWx1ZVxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkgeyBcbiAgICAgICAgICAgICAgICB2YWwgPSB2YWwuc2xpY2UoLTEpWzBdIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwKSkgeyAvLyBpZiBwYXJhbSBpcyBlbnVtXG4gICAgICAgICAgICAgICAgcC5mb3JFYWNoKCBwcCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IHBwLmtleSkgeyAvLyBpZiB0aGlzIHBhcmFtIG1hdGNoZXMgZW51bVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3X3NlYXJjaFtrZXldID0gdmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXRjaGVzLnB1c2gocHAubWF0Y2godmFsKSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBlbHNlXG4gICAgICAgICAgICAgICAgaWYgKCFwLnZhbGlkYXRlKHZhbCkpIHsgLy8gaWYgaXQgZG9lcyBub3QgcGFzcyB2YWxpZGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBuZXdfc2VhcmNoW2tleV0gPSB2YWxcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRjaGVzLnB1c2gocC5tYXRjaCh2YWwpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdfc2VhcmNoXG4gICAgfVxuXG4gICAgLyoqIERpZCBhbGwgdGhlIHBhcmFtcyBwYXNzIHZhbGlkYXRpb24uIFxuICAgICAqIHJldHVybnMge2Jvb2x9XG4gICAgICovXG4gICAgaXNWYWxpZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbGlkXG4gICAgfVxuXG4gICAgLy9UT0RPIGdldCByaWQgb2YgdGhpc1xuICAgIGNsb25lRnJvbVNlYXJjaChzZWFyY2gpIHtcbiAgICAgICAgdmFyIG9sZF9zZWFyY2ggPSB0aGlzLl91cmkuc2VhcmNoKClcbiAgICAgICAgT2JqZWN0LmFzc2lnbihvbGRfc2VhcmNoLCBzZWFyY2gpXG4gICAgICAgIHZhciBocmVmID0gdGhpcy5fdXJpLmNsb25lKCkuc2VhcmNoKG9sZF9zZWFyY2gpLm5vcm1hbGl6ZSgpLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IoaHJlZilcbiAgICB9XG5cbiAgICAvKiogXG4gICAgICogUmV0dXJucyBuZXcgaHJlZiBmcm9tIHNlYXJjaCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHNlYXJjaCAtIFVSSSB0eXBlIHNlYXJjaCBvYmplY3RcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICovXG4gICAgaHJlZkZyb21TZWFyY2goc2VhcmNoKSB7XG5cbiAgICAgICAgdmFyIG9sZF9zZWFyY2ggPSB0aGlzLl91cmkuc2VhcmNoKHRydWUpXG4gICAgICAgIE9iamVjdC5hc3NpZ24ob2xkX3NlYXJjaCwgc2VhcmNoKVxuICAgICAgICB2YXIgaHJlZiA9IHRoaXMuX3VyaS5jbG9uZSgpLnNlYXJjaChvbGRfc2VhcmNoKS5ub3JtYWxpemUoKS50b1N0cmluZygpXG4gICAgICAgIHJldHVybiBocmVmXG4gICAgfVxuXG4gICAgLyoqIENvbXBhcmVzIHRoZSBzdHJpbmcgcmVwcmVzZW5ldGF0aW9uIG9mIHRoZSB1cmkuXG4gICAgICogQHBhcmFtIHtMb2NhdGlvbn0gb3RoZXIgLSB0aGUgb3RoZXIgTG9jYXRpb24gaW5zdGFuY2VcbiAgICAgKiBAcmV0dXJucyB7Ym9vbH1cbiAgICAqL1xuICAgIGVxdWFsKG90aGVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91cmkudG9TdHJpbmcoKSA9PT0gb3RoZXIuX3VyaS50b1N0cmluZygpXG4gICAgfVxuXG4gICAgLyoqIHJldHVybnMgYXBpIHBhcmFtc1xuICAgICAqIEByZXR1cm5zIHthcnJheX1cbiAgICAqL1xuICAgIG1hdGNoZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRjaGVzXG4gICAgfVxuXG4gICAgLyoqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBwcm9jZXNzZWQgdXJsICovXG4gICAgdXJsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXJpLnRvU3RyaW5nKClcbiAgICB9XG5cbiAgICAvKiogUmV0dXJucyB0aGUgcGF0aCBhbmQgc2VhcmNoIHdpdGhvdXQgdGhlIGhvc3RcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBVUkkucGF0aGFubWUoKSArIFVSSS5zZWFyY2goKSBcbiAgICAqL1xuICAgIGhyZWYoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91cmkucGF0aG5hbWUoKSArIHRoaXMuX3VyaS5zZWFyY2goKVxuICAgIH1cblxuICAgIC8qKiBAcmV0dXJucyB7c3RyaW5nfSBVUkkucGF0aG5hbWUoKSAqL1xuICAgIHBhdGhuYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXJpLnBhdGhuYW1lKClcbiAgICB9XG5cbiAgICAvKiogQHJldHVybnMge29iamVjdH0gVVJJLnNlYXJjaCh0cnVlKSAqL1xuICAgIHNlYXJjaCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VyaS5zZWFyY2godHJ1ZSlcbiAgICB9XG59XG5cblxuXG5cbiJdfQ==