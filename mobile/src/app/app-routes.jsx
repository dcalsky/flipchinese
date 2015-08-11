let React = require('react');
let Router = require('react-router');
let Route = Router.Route;
let Routes = Router.Routes;
let Redirect = Router.Redirect;
let DefaultRoute = Router.DefaultRoute;

let Home = require('./pages/home.jsx');
let Fast = require('./pages/fast.jsx');
let Packs = require('./pages/packs.jsx');
let Account = require('./pages/account.jsx');
let Login = require('./pages/login.jsx');
let Material = require('./pages/material.jsx');
let PackInside = require('./pages/pack-inside.jsx');

let Layout = require('./components/layout.jsx');

let AppRoutes = (
    <Route path="/" handler={Layout}>
	    <Route name="home" handler={Home} />
	    <Route name="fast" handler={Fast} />
	    <Route name="focus" handler={Packs} />
	    <Route name="account" handler={Account} />
	    <Route name="login" handler={Login} />
	    <Route name="material/:id" handler={Material} />
	    <Route name="pack-inside/:id" handler={PackInside} />	    	    
	    <DefaultRoute  handler={Home}/>
    </Route>
);

module.exports = AppRoutes;
