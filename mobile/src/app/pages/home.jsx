
let React = require('react');
let Router = require('react-router');

let Home = React.createClass({
	mixins: [Router.Navigation],
	_turnTo(route){
		this.transitionTo('/main/' + route);
	},
    render() {
        return (
            <div className="home">
                <section className="home-header center-xs middle-xs">
                    <img src="./images/logo_white.png" />
                    <div className="home-header-infoBox">
                        <h3>Flip Chinese</h3>
                        <p>Learn What You Need!</p>
                    </div>
                    <button className="button-flat" onClick={()=>{this._turnTo('login')}}>LOG IN</button>
                </section>
                <section className="home-footer middle-xs">
                    <ul className="genre-list row around-xs">
                        <li className="col-xs-6 center-xs" onClick={()=>{this._turnTo('fast')}}>
                            <h4>FAST</h4>
                            <img src="./images/fast.jpg" />
                            <p>Quickly solve your problems in China</p>
                        </li>
                        <li className="col-xs-6 center-xs" onClick={()=>{this._turnTo('focus')}}>
                            <h4>FOCUS</h4>
                            <img src="./images/focus.jpg" />
                            <p>Choose and learn language packs</p>
                        </li>
                    </ul>
                </section>
            </div>

        );
    }
});

module.exports = Home;