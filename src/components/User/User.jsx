import React,{Component} from 'react';
import {connect} from 'react-redux';

import {getUser, getUserlist} from '../../actions';
//import history from '../../history';

class User extends Component{
    constructor(props){
        super(props);
        this.state ={
            username:null
        }
    }
    async componentDidMount() {
        if (this.props.user.userlist === null) {
          await this.props.getUserlist();
        }
    
        const { username } = this.props.match.params;
        this.setState({username});
        await this.props.getUser(username);
      }

    render(){
        return(
            <div>
                {console.log(this.props.user)}
                {this.props.user.user.createdCollection}
                {this.state.username}
                Halllo
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = {
    getUser:getUser,
    getUserlist: getUserlist
};
export default connect(mapStateToProps, mapDispatchToProps)(User)