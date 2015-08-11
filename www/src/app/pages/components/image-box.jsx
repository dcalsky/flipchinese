let React = require('react/addons');

let ImageBox = React.createClass({
    render(){
        if(this.props.image) {
            return (
                <div style={{padding:'12px', textAlign:'center'}}>
                            <img src={this.props.image} width='100%' style={{maxWidth:'400px'}}/>
                </div>
            )
        } else {
            return null;
        }
    }
});

module.exports = ImageBox;