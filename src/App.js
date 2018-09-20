
import { h, render, Component } from 'preact'; /** @jsx h */
import Router from 'universal-router'

import {Location, QueryEnumParam, QueryParam} from './Location'

const ParamSortName = new QueryEnumParam('abc', () => ('order by name'), null, 'by Name', )
const ParamSortPop = new QueryEnumParam('pop', () => ('order by count desc'), null, 'by Popularity')
const ParamSearch = new QueryParam((v) => (`where name = '${v}'`), (v) => /(\D+)/.test(v), 'Search')
const ParamID = new QueryParam((v) => (`where id = ${v}`), null, null)

export class TestLocation extends Location {
    static route = '/test/:id(\\d+)/'; // eslint-disable-line no-useless-escape
    static params = {
        'o': [
            ParamSortName,
            ParamSortPop,
        ],
        'q': ParamSearch,
        'id': ParamID,
    }
}

const LocationTest = (props) => {
    /*
    console.log(props)
    console.log(props.location.path())
    console.log(props.location.url())
    console.log(props.location.api())
    */
    return(
    <div>
        <h1>Location</h1>
    </div>
)}

const routes = [
    { path: TestLocation.route, action: (ctx) => { return (new TestLocation(ctx.href)); }},
]

const router = new Router(routes);

function renderRoute(location) {
    router.resolve({pathname: location.pathname, href: location.href}).then( (location) => {
        return render(
            <div>
                {LocationTest({location: location})}
            </div>
        , document.getElementById('app'))
    });
}

renderRoute(window.location);
