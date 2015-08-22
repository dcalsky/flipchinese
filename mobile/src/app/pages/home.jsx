
let React = require('react');
let Router = require('react-router');

let Home = React.createClass({
	mixins: [Router.Navigation],
    componentWillMount() {
        this.detectBrowser();
    },
    detectBrowser(){  
        let sUserAgent = navigator.userAgent.toLowerCase();  
        let isIpad = sUserAgent.match(/ipad/i) == 'ipad';    
        let isIphone = sUserAgent.match(/iphone/i) == 'iphone';  
        let isMac = sUserAgent.match(/macintosh/i) == "macintosh";
        let isAndroid = sUserAgent.match(/android/i) == 'android'; 
        if(!isIphone && !isAndroid){
            window.location.href = 'http://www.flipchinese.com/';
            return false;
        }else{
            return true;
        }
    },
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
                        <p>Learn Practical Chinese for Living in China</p>
                    </div>
                    <button className="button-flat" onClick={()=>{this._turnTo('login')}}>LOG IN</button>
                </section>
                <section className="home-footer middle-xs">
                    <ul className="genre-list row around-xs">
                        <li className="col-xs-6 center-xs" onClick={()=>{this._turnTo('fast')}}>
                            <h4>China Life</h4>
                            <img src="./images/fast.jpg" />
                            <p>These dialogues, phrases and hints help you solve daily issues in China.</p>
                        </li>
                        <li className="col-xs-6 center-xs" onClick={()=>{this._turnTo('focus')}}>
                            <h4>Learn Chinese</h4>
                            <img src="./images/focus.jpg" />
                            <p>Choose the Chinese skill set you need, and learn it with multimedia content.</p>
                        </li>
                    </ul>
                </section>
            </div>

        );
    }
});

module.exports = Home;