let cookie = require('cookie-cutter');
let React = require('react');
let Router = require('react-router');
let RouteHandler = Router.RouteHandler;

let mui = require('material-ui');

let Colors = mui.Styles.Colors;
let ThemeManager = new mui.Styles.ThemeManager();

let Appbar = require('../pages/components/appbar.jsx');
let {AppCanvas, IconButton, FlatButton } = mui;

class Master extends React.Component {

    constructor() {
        super();
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        }
    }

    componentWillMount() {
        ThemeManager.setComponentThemes({
          raisedButton: {
            secondaryColor: Colors.blue700,
          },
          checkbox: {
            checkedColor: Colors.blue700,
          },
          textField: {
            focusColor: Colors.blue700,
          },
          tabs: {
            backgroundColor: Colors.blue700,
          },
        });
        ThemeManager.setPalette({
            primary1Color: Colors.blue700,
            primary2Color: Colors.blue700,
            primary3Color: Colors.blue700
        });
    }
    goToUser() {
        window.location.href='#/main/my-pack';
        if(cookie.get('role').toLowerCase() == 'lp' || cookie.get('role').toLowerCase() == 'tutor'){
          window.location.href='#/teacher/select-teacher';
        }else{
          window.location.href='#/main/my-pack';
        }
    }
    render() {
        let title = 'Flip Chinese';
        return (
            <div style={{WebkitFontSmoothing: 'antialiased',minHeight: 768}}>
                <Appbar 
                    title="Flip Chinese"
                    username={cookie.get('username')}
                    nav={[
                        {route: '#/fast', title: 'Fast'},
                        {route: '#/main/packs', title: 'Focus'},
                        {route: 'http://www.flipchinese.com/intro.html', title: 'Intro'}
                    ]}
                    isLogin={cookie.get('user_id') && cookie.get('auth_token')}
                />  

                <RouteHandler />

                    <footer className="footer middle-xs center-xs">
                        <img src="images/logo_white.png" className="logo" />
                        <p>E-mail: AskUs@flipchinese.com</p>
                        <p>2015 Flip Chinese. Contact  Jobs  FAQ  Privacy  Terms</p>
                        <p>Shanghai Qifei Education Technology Co. Ltd.</p>
                    </footer>

            </div >
        );
    }

}

Master.contextTypes = {
    router: React.PropTypes.func
};

Master.childContextTypes = {
    muiTheme: React.PropTypes.object
};

module.exports = Master;
