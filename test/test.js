//import test from 'ava'
import {Location, QueryEnumParam, QueryParam} from '../lib/location.js'

const pretty = (obj) => JSON.stringify(obj, null, 2); // spacing level = 2

// define your params
const ParamSortName = new QueryEnumParam('abc', () => ('order by name'), 'by Name')
const ParamSortPop = new QueryEnumParam('pop', () => ('order by count desc'), 'by Popularity')
const ParamSearch = new QueryParam((v) => (`and name = '${v}'`), 'Search', (v) => /(\D+)/.test(v))
const ParamID = new QueryParam((v) => (`and id = ${v}`), null)

// this represents the api interface
class TestLocation extends Location {
}
TestLocation.route = '/test/:id(\\d+)/'; // eslint-disable-line no-useless-escape
TestLocation.params = {
    'q': ParamSearch,
    'id': ParamID,
    'o': [
        ParamSortName,
        ParamSortPop,
    ],
}

var href = "http://example.com/test/24/?q=stuff&o=abc#hash"
var loc = new TestLocation(href)
var other = new TestLocation(href+"&s=1")
console.log(loc)
console.log(other)

console.log(1, loc.getMatchedParam('o'))
console.log(2, loc.getMatchedParam('q'))
console.log(3, loc.getMatchedParam('id'))
console.log(4, loc.isValid())
console.log(5, loc.hrefFromSearch({q:'new search'}))
console.log(6, loc.equal(other))
console.log(7, loc.matches())
console.log(8, loc.url())
console.log(9, loc.href())
console.log(10, loc.pathname())
console.log(11, loc.search())

    /* TODO
test('basic fetcher get', async t => {
    const result = await logGet(t, fetcher, host + default_q)
    t.truthy(result.status == 200 || result.status == 206)
});

*/
