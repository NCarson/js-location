import React from 'react'
import ReactDOM from 'react-dom'
import UniversalRouter from 'universal-router'
import {Location, QueryEnumParam, QueryParam} from './location.js'

const pretty = (obj) => JSON.stringify(obj, null, 2); // spacing level = 2

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
    // here is my attempt to write some valid sql.
    // Note that it does not guarantee to put the clauses in the right order
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

class NotFoundLocation extends MyLocation {
    static route = '(.*)'
}

// this binds a location to the view
// you could also set this in your child Location class
// as a static property. But, it will tightly couple your
// code and might cause import problems, as Views would
// have to be defined before Locations.
class Route {
    constructor(Location, View) {
        this.Location = Location
        this.View = View
    }
}

// and now testing has the MyLocation instance injected into it.
const Testing = (props) => {
    return(
        <div>
            <h1>Location</h1>
            <ul>
                <li>href={props.location.href()}</li>
                <li>search={pretty(props.location.search())}</li>
                <li>api={props.location.api()}</li>
            </ul>
        </div>
    )
}

const NotFound = (props) => {
    return (
        <div> <h1>The page was not found</h1></div>
    )
}

const routes = [
    new Route(TestLocation, Testing),
    new Route(NotFoundLocation, NotFound),
]

// set up the universal-router
const router = new UniversalRouter(routes.map(route => {
    return {
        path: route.Location.route, 
        action: (ctx) => {return new route.Location(ctx.href, route.View)},
    }
}))

// Notice that we are not creating fake divs
// which are a good sign that your breaking MVC
// separation of code. Routing does **NOT** belong
// in the view at all!
function renderRoute(window_location) {
    // notice window_location is actual window.location
    router.resolve({pathname: window_location.pathname, href: window_location.href})
        .then( my_location => {
            // we can inject are super-sweet location
            // that understands are api instead of the boring
            // windows.location
            ReactDOM.render(
                <my_location.View location={my_location} />
                , document.getElementById('app')
            )
        })
}
renderRoute(window.location);

// get ws so you can serve this in single app mode
// make && (cd ../docs/app && ws --spa  index.html)
// try out some urls:
// http://localhost:8000/test/1/?o=pop&q=stuff
// notice that bad params are dropped
//
// joy joy
