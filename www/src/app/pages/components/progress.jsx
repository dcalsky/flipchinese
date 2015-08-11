let React = require('react/addons');

let mui = require('material-ui');
let { CircularProgress } = mui;

let Progress = React.createClass({
    render(){
        if(this.props.completed == true){
            return null ;
        }else{
            let size = this.props.size ? this.props.size : 3 ;
            return(
                <div style={{textAlign: 'center'}} >
                    <CircularProgress mode="indeterminate" size={size} />
                </div>
            );
        }
    }
});

module.exports = Progress;
