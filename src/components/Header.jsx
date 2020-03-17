import React,{Component} from 'react';
import {connect} from 'react-redux';

import history from '../history';
import './Header.css';
import {logoutUser} from '../actions'

class Header extends Component {
    constructor(props){
        super(props);
        this.state={
            username:null,
        }
    }

    render(){
        return(
                <div className="ui top attached menu" id="menu-bar">
                    <div className="left menu" style={{cursor: "pointer"}} onClick={() => {history.push(`/`)}}>
                       <h1 className="link item">Mathlearning</h1>
                    </div>
                    <div className="right menu">
                    <div className="ui simple right floating link icon item" onClick={() => history.push(`/help`)}>
                            <i className="large question icon"></i>
                        </div>
                            {
                            this.props.user.loginSuccess && this.props.user.user !== null? (
                                <div role="listbox" className=" ui item simple dropdown" onClick={() => history.push(`/user/${this.props.user.user.username}`)}>
                                    <div>
                                        <i className="user icon"></i>
                                        {this.props.user.user.username}
                                        </div>
                                        <div className="menu transition">
                                        <div className="item" onClick={() => {this.props.logoutUser()}}>
                                            Log out
                                        </div>
                                        </div>
                                </div>
                            ):(
                                <div className="item">
                                    <div className="ui buttons">
                                        <button className="ui button" onClick={() => history.push(`/signin`)}>Sign in</button>
                                        <div className="or"></div>
                                        <button className="ui button" onClick={() => history.push(`/login`)}>Log in</button>
                                    </div>
                                </div>
                            )
                            }
                        </div>
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
    logoutUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)