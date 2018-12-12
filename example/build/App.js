'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _universalRouter = require('universal-router');

var _universalRouter2 = _interopRequireDefault(_universalRouter);

var _location = require('./location.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pretty = function pretty(obj) {
    return JSON.stringify(obj, null, 2);
}; // spacing level = 2

var ParamSortName = new _location.QueryEnumParam('abc', function () {
    return 'order by name';
}, 'by Name');
var ParamSortPop = new _location.QueryEnumParam('pop', function () {
    return 'order by count desc';
}, 'by Popularity');
var ParamSearch = new _location.QueryParam(function (v) {
    return 'and name = \'' + v + '\'';
}, 'Search', function (v) {
    return (/(\D+)/.test(v)
    );
});
var ParamID = new _location.QueryParam(function (v) {
    return 'and id = ' + v;
}, null);

var Testing = function Testing(props) {
    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            'h1',
            null,
            'Location'
        ),
        _react2.default.createElement(
            'ul',
            null,
            _react2.default.createElement(
                'li',
                null,
                'href=',
                props.location.href()
            ),
            _react2.default.createElement(
                'li',
                null,
                'search=',
                pretty(props.location.search())
            ),
            _react2.default.createElement(
                'li',
                null,
                'api=',
                props.location.api()
            )
        )
    );
};

var NotFound = function NotFound(props) {
    return _react2.default.createElement(
        'div',
        null,
        ' ',
        _react2.default.createElement(
            'h1',
            null,
            'The page was not found'
        )
    );
};

var MyLocation = function (_Location) {
    _inherits(MyLocation, _Location);

    function MyLocation(href, View) {
        _classCallCheck(this, MyLocation);

        var _this = _possibleConstructorReturn(this, (MyLocation.__proto__ || Object.getPrototypeOf(MyLocation)).call(this, href));

        _this.View = View;
        return _this;
    }

    _createClass(MyLocation, [{
        key: 'api',
        value: function api() {
            return "select * from table test where 1=1 " + this.matches().join(" ");
        }
    }]);

    return MyLocation;
}(_location.Location);

var TestLocation = function (_MyLocation) {
    _inherits(TestLocation, _MyLocation);

    function TestLocation() {
        _classCallCheck(this, TestLocation);

        return _possibleConstructorReturn(this, (TestLocation.__proto__ || Object.getPrototypeOf(TestLocation)).apply(this, arguments));
    }

    return TestLocation;
}(MyLocation);

TestLocation.route = '/test/:id(\\d+)/';
TestLocation.params = {
    'q': ParamSearch,
    'id': ParamID,
    'o': [ParamSortName, ParamSortPop]
};

var NotFoundLocation = function (_MyLocation2) {
    _inherits(NotFoundLocation, _MyLocation2);

    function NotFoundLocation() {
        _classCallCheck(this, NotFoundLocation);

        return _possibleConstructorReturn(this, (NotFoundLocation.__proto__ || Object.getPrototypeOf(NotFoundLocation)).apply(this, arguments));
    }

    return NotFoundLocation;
}(MyLocation);

NotFoundLocation.route = '(.*)';

var Route = function Route(Location, View) {
    _classCallCheck(this, Route);

    this.Location = Location;
    this.View = View;
};

var routes = [new Route(TestLocation, Testing), new Route(NotFoundLocation, NotFound)];

var router = new _universalRouter2.default(routes.map(function (route) {
    return {
        path: route.Location.route,
        action: function action(ctx) {
            return new route.Location(ctx.href, route.View);
        }
    };
}));

function renderRoute(window_location) {
    router.resolve({ pathname: window_location.pathname, href: window_location.href }).then(function (my_location) {
        _reactDom2.default.render(_react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(my_location.View, {
                location: my_location
            })
        ), document.getElementById('app'));
    });
}

renderRoute(window.location);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBNkIsTUFBTSxJQUFuQyxDQUFQO0FBQWdEO0FBRi9ELEtBQVA7QUFJSCxDQUxrQyxDQUFwQixDQUFmOztBQU9BLFNBQVMsV0FBVCxDQUFxQixlQUFyQixFQUFzQztBQUNsQyxXQUFPLE9BQVAsQ0FBZSxFQUFDLFVBQVUsZ0JBQWdCLFFBQTNCLEVBQXFDLE1BQU0sZ0JBQWdCLElBQTNELEVBQWYsRUFDSyxJQURMLENBQ1csdUJBQWU7QUFDbEIsMkJBQVMsTUFBVCxDQUNJO0FBQUE7QUFBQTtBQUNJLDBDQUFDLFdBQUQsQ0FBYSxJQUFiO0FBQ0ksMEJBQVU7QUFEZDtBQURKLFNBREosRUFNTSxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsQ0FOTjtBQVFILEtBVkw7QUFXSDs7QUFFRCxZQUFZLE9BQU8sUUFBbkIiLCJmaWxlIjoiQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcbmltcG9ydCBVbml2ZXJzYWxSb3V0ZXIgZnJvbSAndW5pdmVyc2FsLXJvdXRlcidcbmltcG9ydCB7TG9jYXRpb24sIFF1ZXJ5RW51bVBhcmFtLCBRdWVyeVBhcmFtfSBmcm9tICcuL2xvY2F0aW9uLmpzJ1xuXG5jb25zdCBwcmV0dHkgPSAob2JqKSA9PiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDIpOyAvLyBzcGFjaW5nIGxldmVsID0gMlxuXG5jb25zdCBQYXJhbVNvcnROYW1lID0gbmV3IFF1ZXJ5RW51bVBhcmFtKCdhYmMnLCAoKSA9PiAoJ29yZGVyIGJ5IG5hbWUnKSwgJ2J5IE5hbWUnKVxuY29uc3QgUGFyYW1Tb3J0UG9wID0gbmV3IFF1ZXJ5RW51bVBhcmFtKCdwb3AnLCAoKSA9PiAoJ29yZGVyIGJ5IGNvdW50IGRlc2MnKSwgJ2J5IFBvcHVsYXJpdHknKVxuY29uc3QgUGFyYW1TZWFyY2ggPSBuZXcgUXVlcnlQYXJhbSgodikgPT4gKGBhbmQgbmFtZSA9ICcke3Z9J2ApLCAnU2VhcmNoJywgKHYpID0+IC8oXFxEKykvLnRlc3QodikpXG5jb25zdCBQYXJhbUlEID0gbmV3IFF1ZXJ5UGFyYW0oKHYpID0+IChgYW5kIGlkID0gJHt2fWApLCBudWxsKVxuXG5jb25zdCBUZXN0aW5nID0gKHByb3BzKSA9PiB7XG4gICAgcmV0dXJuKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGgxPkxvY2F0aW9uPC9oMT5cbiAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICA8bGk+aHJlZj17cHJvcHMubG9jYXRpb24uaHJlZigpfTwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPnNlYXJjaD17cHJldHR5KHByb3BzLmxvY2F0aW9uLnNlYXJjaCgpKX08L2xpPlxuICAgICAgICAgICAgICAgIDxsaT5hcGk9e3Byb3BzLmxvY2F0aW9uLmFwaSgpfTwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICApXG59XG5cbmNvbnN0IE5vdEZvdW5kID0gKHByb3BzKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj4gPGgxPlRoZSBwYWdlIHdhcyBub3QgZm91bmQ8L2gxPjwvZGl2PlxuICAgIClcbn1cblxuY2xhc3MgTXlMb2NhdGlvbiBleHRlbmRzIExvY2F0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihocmVmLCBWaWV3KSB7XG4gICAgICAgIHN1cGVyKGhyZWYpXG4gICAgICAgIHRoaXMuVmlldyA9IFZpZXdcbiAgICB9XG5cbiAgICBhcGkoKSB7XG4gICAgICAgIHJldHVybiBcInNlbGVjdCAqIGZyb20gdGFibGUgdGVzdCB3aGVyZSAxPTEgXCIgKyB0aGlzLm1hdGNoZXMoKS5qb2luKFwiIFwiKVxuICAgIH1cbn1cblxuY2xhc3MgVGVzdExvY2F0aW9uIGV4dGVuZHMgTXlMb2NhdGlvbiB7XG4gICAgc3RhdGljIHJvdXRlID0gJy90ZXN0LzppZChcXFxcZCspLyc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdXNlbGVzcy1lc2NhcGVcbiAgICBzdGF0aWMgcGFyYW1zID0ge1xuICAgICAgICAncSc6IFBhcmFtU2VhcmNoLFxuICAgICAgICAnaWQnOiBQYXJhbUlELFxuICAgICAgICAnbyc6IFtcbiAgICAgICAgICAgIFBhcmFtU29ydE5hbWUsXG4gICAgICAgICAgICBQYXJhbVNvcnRQb3AsXG4gICAgICAgIF0sXG4gICAgfVxufVxuXG5jbGFzcyBOb3RGb3VuZExvY2F0aW9uIGV4dGVuZHMgTXlMb2NhdGlvbiB7XG4gICAgc3RhdGljIHJvdXRlID0gJyguKiknXG59XG5cbmNsYXNzIFJvdXRlIHtcbiAgICBjb25zdHJ1Y3RvcihMb2NhdGlvbiwgVmlldykge1xuICAgICAgICB0aGlzLkxvY2F0aW9uID0gTG9jYXRpb25cbiAgICAgICAgdGhpcy5WaWV3ID0gVmlld1xuICAgIH1cbn1cblxuY29uc3Qgcm91dGVzID0gW1xuICAgIG5ldyBSb3V0ZShUZXN0TG9jYXRpb24sIFRlc3RpbmcpLFxuICAgIG5ldyBSb3V0ZShOb3RGb3VuZExvY2F0aW9uLCBOb3RGb3VuZCksXG5dXG5cbmNvbnN0IHJvdXRlciA9IG5ldyBVbml2ZXJzYWxSb3V0ZXIocm91dGVzLm1hcChyb3V0ZSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGF0aDogcm91dGUuTG9jYXRpb24ucm91dGUsIFxuICAgICAgICBhY3Rpb246IChjdHgpID0+IHtyZXR1cm4gbmV3IHJvdXRlLkxvY2F0aW9uKGN0eC5ocmVmLCByb3V0ZS5WaWV3KX0sXG4gICAgfVxufSkpXG5cbmZ1bmN0aW9uIHJlbmRlclJvdXRlKHdpbmRvd19sb2NhdGlvbikge1xuICAgIHJvdXRlci5yZXNvbHZlKHtwYXRobmFtZTogd2luZG93X2xvY2F0aW9uLnBhdGhuYW1lLCBocmVmOiB3aW5kb3dfbG9jYXRpb24uaHJlZn0pXG4gICAgICAgIC50aGVuKCBteV9sb2NhdGlvbiA9PiB7XG4gICAgICAgICAgICBSZWFjdERPTS5yZW5kZXIoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPG15X2xvY2F0aW9uLlZpZXdcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uPXtteV9sb2NhdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKVxuICAgICAgICAgICAgKVxuICAgICAgICB9KVxufVxuXG5yZW5kZXJSb3V0ZSh3aW5kb3cubG9jYXRpb24pO1xuIl19