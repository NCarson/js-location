# js-location

### keeps api params in sink with urls

Designed to be used with a RESTfull api.

You can use it with universal-router to replace
packages like react-router. See the [example](https://github.com/NCarson/js-location/blob/master/example/App.js).
And then instead of boring `window.location` like locations injected into your props you can get your 
super-sweet api aware locations, and then remove a lot of crufty code out the view.

If you happen to use Postgres I also built 
[js-postgrest](https://github.com/NCarson/js-postgrest) to work with this library.

If you happen to use React I made a HOC router that can be used with this
library [react-withUniversalRouter](https://github.com/NCarson/react-withUniversalRouter).

### Install

npm i js-location

## Docs

- [api](https://ncarson.github.io/js-location/index.html)
- [example](https://github.com/NCarson/js-location/blob/master/example/App.js)
    You can build the example by `cd example && make`

### Basics
```js
// define your params
const ParamSortName = new QueryEnumParam('abc', () => ('order by name'), 'by Name')
const ParamSortPop = new QueryEnumParam('pop', () => ('order by count desc'), 'by Popularity')
const ParamSearch = new QueryParam((v) => (`and name = '${v}'`), 'Search', (v) => /(\D+)/.test(v))
const ParamID = new QueryParam((v) => (`and id = ${v}`), null)

// define your custom location to extend Location
class MyLocation extends Location {
    constructor(href, View) {
        super(href)
        this.View = View
    }
    // XXX this is just an example.  I would not really do things this way.
    // You would would probably want to find some kind of RESTfull API.
    // here is my attempt to write some valid sql.
    // Note that it does not guarantee to put the clauses in the right order
    // and it would be open to **sql injection**.
    api() {
        return "select * from table test where 1=1 " + this.matches().join(" ")
    }
}

// this represents the api interface
class TestLocation extends MyLocation {
    static route = '/test/:id(\\d+)/'; // eslint-disable-line no-useless-escape
    // These represent all the valid params that 
    // could be present in an url.
    static params = {
        'q': ParamSearch,
        'id': ParamID,
        'o': [
            ParamSortName,
            ParamSortPop,
        ],
    }
}

var href = "http://example.com/test/24/?q=stuff&o=abc#hash"
var loc = new TestLocation(href)
var other = new TestLocation(href+"&s=1")

loc.getMatchedParam('o') // ParamSortName
loc.hrefFromSearch({q:'new search'}) // http://example.com/test/24/?q=new+search&o=abc#hash"
loc.equal(other) // false
loc.matches() // ['order by name', "and name = 'stuff'", "and id=24"]
loc.url() // http://example.com/test/24/?q=new+search&o=abc#hash"
loc.href() // /test/24/?q=stuff&o=abc#hash"
loc.pathname() // /test/24/
loc.search() // {q:"stuff", o:"abc"}
```

## Dev

```
git clone https://github.com/NCarson/js-location.git
cd js-location && make
```



