var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var Redirect = Router.Redirect;
var DefaultRoute = Router.DefaultRoute;

// Here we define all our material-ui ReactComponents.
var Master = require('./components/master.jsx');

// Flip Chinese Main Route
let Main = require('./pages/main.jsx');
let Public = require('./pages/main/public.jsx');
let Material = require('./pages/main/material.jsx');
let Task = require('./pages/main/task.jsx');
let Packs = require('./pages/main/packs.jsx');
let MainPackPage = require('./pages/main/pack-page.jsx');
let Cart = require('./pages/main/cart.jsx');
let MyPack = require('./pages/main/my-pack.jsx');
let Setting = require('./pages/main/setting.jsx');
let Logout = require('./pages/main/logout.jsx');
let ConnectError = require('./pages/main/connect-error.jsx');


//Flip Chinese Teacher Route
let SelectPage = require('./pages/teacher/select.jsx');
let ResultPage = require('./pages/teacher/result.jsx');
let Task_Teacher = require('./pages/teacher/task.jsx');
let Teacher = require('./pages/teacher/main.jsx');

let SignIn = require('./pages/sign-in.jsx');
let SignUp = require('./pages/sign-up.jsx');
let Fast = require('./pages/fast.jsx');

window.current_user = window.current_user || {}

/** Routes: https://github.com/rackt/react-router/blob/master/docs/api/components/Route.md
  * 
  * Routes are used to declare your view hierarchy.
  *
  * Say you go to http://material-ui.com/#/components/paper
  * The react router will search for a route named 'paper' and will recursively render its 
  * handler and its parent handler like so: Paper > Components > Master
  */

var AppRoutes = (
    <Route  path="/" handler={Master}>

      <Route name="sign-in" handler={SignIn} />
      <Route name="sign-up" handler={SignUp} />
      <Route name="fast" handler={Fast} />

      <Route name="main" handler={Main}>
        <Route name="packs" handler={Packs} />
        <Route name="packs/:id" handler={MainPackPage} />

        <Route name="task" handler={Task} />
        <Route name="task/:id" handler={Task} />


        <Route name="material/:id" handler={Material} />


        <Route name="cart" handler={Cart} />
        
        <Route name="my-pack" handler={MyPack} />
        <Route name="my-history" handler={History} />
        <Route name="setting" handler={Setting} />
        <Route name="logout" handler={Logout} />
        <Route name="connect-error" handler={ConnectError} />
      </Route>

      <Route name="teacher" handler={Teacher}>
        <Route name="select-teacher" handler={SelectPage} />
        <Route name="result-teacher" handler={ResultPage} />
        <Route name="task-teacher/:id" handler={Task_Teacher} />
      </Route>

      <DefaultRoute  handler={Fast}/>
    </Route>
);

module.exports = AppRoutes;
