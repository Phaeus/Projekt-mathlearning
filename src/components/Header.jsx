import React,{Component} from 'react';
import {connect} from 'react-redux';

import history from '../history';
import './Header.css';

class Header extends Component {
    constructor(props){
        super(props);
        this.state={
            username:null,
        }
    }

    render(){
        return(
                <div className="ui secondary pointing menu">
                    <div className="left menu">
                       <h1 className="item">Halla</h1>
                    </div>
                    <div className="right menu">
                            {
                            this.props.user.loginSuccess ? (
                                <div className="item">
                                    <button className="ui basic button" onClick={() => history.push(`/user/${this.props.user.user.username}`)}>
                                        <i className="icon user"></i>
                                        {this.props.user.user.username}
                                        </button>
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
    
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)