let React = require('react/addons');

let mui = require('material-ui');
let { DropDownMenu, ClearFix, TextField, SelectField, RaisedButton, Checkbox, Paper, Table, Toggle, FlatButton,
    Avatar, Tabs, Tab, Slider } = mui;

let PDFDownload = React.createClass({
    _track(){
        mixpanel.track("download PDF", {
          'where': "pdf",
        });
    },
    render() {
        if(this.props.pdf) {
            return (
                <div style={{padding:'12px', textAlign: 'center'}}>
                    <p sytle={{fontWeight: '300'}}>
                        <RaisedButton 
                            linkButton={true} 
                            href={this.props.pdf} 
                            secondary={true}
                            label="Download PDF"
                            onClick={this._track}
                        />
                    </p>
                </div>
            );
        } else {
            return null;
        }

    }
});

module.exports = PDFDownload;
