let StyleSheet = require('react-style');
let mui = require('material-ui');
let {Typography,Colors} = mui.Styles;

let MainStyle = StyleSheet.create({
    headline: {
        fontSize: '26px',
        lineHeight: '32px',
        paddingTop: '16px',
        marginBottom: '12px',
        letterSpacing: '0',
        textAlign: 'center',
        color: '#FF3B77',
        fontWeight: 250,
    },
    scriptBlock: {
        fontSize: '15px',
        lineHeight: '24px',
        maxHeight: '560px',
        overflowY: 'auto'
    },
    buttonNormal: {
        margin: '10px 10px 5px 0px'
    },
    flatButtonIcon: {
        height: '100%',
        display: 'inline-block',
        float: 'left',
        paddingLeft: '12px',
        lineHeight: '36px',
        color: Colors.cyan500
    },
    checkboxNormal: {
        margin: '5px 10px 5px 0px'
    },
    textField: {
        marginLeft: "24px",
        minWidth: "160px"
    },
    introBlock: {
        //textAlign: 'center',
        verticalAlign: 'middle',
        width: '100%'
    },
    introText: {
        //textAlign: 'center',
        fontSize: '14px',
        verticalAlign: 'middle',
        fontWeight: '300'
    },
    partHeadline: {
        fontSize: '16px',
        height: '40px',
        lineHeight: '40px',
        margin: '8px 0px',
        letterSpacing: '0',
        textAlign: 'center',
        fontWeight: Typography.fontWeightNormal,
        color: Typography.textDarkBlack
    },
    order: {
        border: 'solid 4px #EEE',
        width: '100%',
        display: 'block',
        margin: '15px 0 15px 0',
        padding: '0 10px 0 10px'
    },
    pack: {
        cursor: 'pointer',
        textAlign: 'center',
        listStyleType: 'none',
        display: 'block',
        margin: '15px 0 15px 0'
    },
    title: {
        fontSize: '18px',
        padding: '10px',
        height: '50px',
        color: '#0084CA',
        textOverflow: 'ellipsis',
        whiteSpace: 'wrap',
        overflow: 'hidden',
    },
    intro: {
        fontSize: 14,
        padding: 10,
        wordBreak: 'break-all',
        height: 50,
        overflow: 'hidden',
        borderBottom: '1px solid #E5E5E5'
    },
    button: {
        margin: '20px 0px 10px 30px'
    },
    buttonIcon: {
        color: Typography.textFullWhite,
        height: '100%',
        display: 'inline-block',
        verticalAlign: 'middle',
        float: 'left',
        paddingLeft: '12px',
        lineHeight: '36px',
    },
    buttonLabel: {
        padding: '0px 16px 0px 8px'
    },
    payingDiv: {
        width: window.innerWidth,
        height: window.innerHeight,
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 20,
        backgroundColor: '#000',
        opacity: 0.5,
    },
});


module.exports = MainStyle;
