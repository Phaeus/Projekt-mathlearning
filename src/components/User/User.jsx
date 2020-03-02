import React,{Component} from 'react';
import {connect} from 'react-redux';

import {getUser, getUserlist, logoutUser} from '../../actions';
import history from '../../history';

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
        if(this.props.user.user === null){
            return <div>Loading...</div>
        }
        else{
        return(
            <div>
                {console.log(this.props.user)}
                createdCollection:
                {this.props.user.user.createdCollection}
                {this.state.username}
                <button className="ui button" onClick={() => {this.props.logoutUser(); history.goBack()}}>Logout</button>
            </div>
        )
        }
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = {
    getUser:getUser,
    getUserlist: getUserlist,
    logoutUser
};
export default connect(mapStateToProps, mapDispatchToProps)(User)