(function () {

  var React = require('react'),
    Router = require('react-router'),
    AppRoutes = require('./app-routes.jsx');
  window.React = React;
  Router
    .create({
      routes: AppRoutes,
      scrollBehavior: Router.ScrollToTopBehavior
    })
    .run(function (Handler) {
      React.render(<Handler/>, document.body);
    });

})();
