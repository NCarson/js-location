(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (factory());
}(this, (function () { 'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Location = exports.QueryEnumParam = exports.QueryParam = undefined;

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    var _urijs = require('urijs');

    var _urijs2 = _interopRequireDefault(_urijs);

    var _routeParser = require('route-parser');

    var _routeParser2 = _interopRequireDefault(_routeParser);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

    var QueryParam = exports.QueryParam = function () {
        function QueryParam(match_func, validate_func, display) {
            _classCallCheck(this, QueryParam);

            this.match_func = match_func;
            this.validate_func = validate_func;
            this.display = display;
        }

        _createClass(QueryParam, [{
            key: 'match',
            value: function match(value) {
                return this.match_func && this.match_func(value);
            }
        }, {
            key: 'validate',
            value: function validate(value) {
                if (!this.validate_func) return true;else return this.validate_func(value);
            }
        }]);

        return QueryParam;
    }();

    var QueryEnumParam = exports.QueryEnumParam = function (_QueryParam) {
        _inherits(QueryEnumParam, _QueryParam);

        function QueryEnumParam(key, match_func, validate_func, display) {
            _classCallCheck(this, QueryEnumParam);

            var _this = _possibleConstructorReturn(this, (QueryEnumParam.__proto__ || Object.getPrototypeOf(QueryEnumParam)).call(this, match_func, validate_func, display));

            _this.key = key;
            return _this;
        }

        return QueryEnumParam;
    }(QueryParam);

    /*****************************************************************************
     *  location
    /****************************************************************************/

    var Location = exports.Location = function () {
        _createClass(Location, null, [{
            key: 'href',
            value: function href(obj) {
                return Location.route && (0, _routeParser2.default)(Location.route).reverse(obj);
            }
        }]);

        function Location(href) {
            _classCallCheck(this, Location);

            this._api = [];
            var uri = new _urijs2.default(href).normalize();
            var search = uri.search(true);
            var match = this.constructor.route && (0, _routeParser2.default)(this.constructor.route).match(uri.toString());
            var new_search = this._setParams(search);
            this._setParams(match);
            this._uri = uri.search(new_search).normalize();
        }

        _createClass(Location, [{
            key: 'hrefFromSearch',
            value: function hrefFromSearch(search) {

                var old_search = this._uri.search(true);
                Object.assign(old_search, search);
                var href = this._uri.clone().search(old_search).normalize().toString();
                return href;
            }
        }, {
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
                                _this2._api.push(pp.match(val));
                            }
                        });
                    } else {
                        // else
                        if (!p.validate(val)) // if it does not pass validation
                            return;
                        new_search[key] = val;
                        _this2._api.push(p.match(val));
                    }
                });
                return new_search;
            }
        }, {
            key: 'equal',
            value: function equal(other) {
                return this._uri.toString() === other._uri.toString();
            }
        }, {
            key: 'api',
            value: function api() {
                return this._api;
            }
        }, {
            key: 'url',
            value: function url() {
                return this._uri.toString();
            }
        }, {
            key: 'pathname',
            value: function pathname() {
                return this._uri.pathname();
            }
        }, {
            key: 'search',
            value: function search() {
                return this._uri.search(true);
            }
        }]);

        return Location;
    }();

    Location.route = null;
    Location.params = [];

})));
