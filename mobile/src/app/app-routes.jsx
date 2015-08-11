let React = require('react');
let Router = require('react-router');
let Route = Router.Route;
let Routes = Router.Routes;
let Redirect = Router.Redirect;
let DefaultRoute = Router.DefaultRoute;

let Home = require('./pages/home.jsx');
let Fast = require('./pages/fast.jsx');
let Layout = require('./components/layout.jsx');

let AppRoutes = (
    <Route  path="/" handler={Layout}>
      <Route name="home" handler={Home} />
      <Route name="fast" handler={Fast} />
      <DefaultRoute  handler={Home}/>
    </Route>
);

module.exports = AppRoutes;
