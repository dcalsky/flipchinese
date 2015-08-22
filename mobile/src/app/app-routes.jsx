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
let Sign = require('./pages/sign.jsx');
let Materials = require('./pages/materials.jsx');
let MyPack = require('./pages/my-pack.jsx');
let PackInside = require('./pages/pack-inside.jsx');
let Task = require('./pages/task.jsx');

let Layout = require('./components/layout.jsx');

let AppRoutes = (
    <Route path="/">
	    <Route name="home" handler={Home} />
	    <Route name="main" handler={Layout}>
		    <Route name="fast" handler={Fast} />
		    <Route name="focus" handler={Packs} />
		    <Route name="account" handler={Account} />
		    <Route name="login" handler={Login} />
		    <Route name="sign" handler={Sign} />
		    <Route name="my-pack" handler={MyPack} />
		    <Route name="material/:id?" handler={Materials} />
		    <Route name="task/:id" handler={Task} />
		    <Route name="pack-inside/:id" handler={PackInside} />	
		</Route>    	    
	    <DefaultRoute  handler={Home}/>
    </Route>
);

module.exports = AppRoutes;
