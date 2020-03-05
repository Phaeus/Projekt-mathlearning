import React,{Component} from 'react';
import {connect} from 'react-redux';
import {Formik, Form, Field} from 'formik';

import history from '../../history';
import {checkUser, loginUser} from '../../actions';

class Login extends Component{
    constructor(props){
        super(props);
        this.state ={}
    }  

    checkUser(values){
        this.props.checkUser(values.username, values.password);
        return this.props.user.loginSuccess;
    }

    render(){
        return(
            <div style={{padding:"20px"}}>
            <Formik
            initialValues={{username:'',password:''}}
                onSubmit={values => {
                    if(this.checkUser(values)){
                        console.log("Logged in successfully.");
                        this.props.loginUser(values.username);
                        console.log(this.props.user)
                        history.goBack();
                    }
                    else{
                        console.log("try again")
                    }
                }}
            >
                {({values, errors, touched, isValidating}) => (
                    <Form>
                        <div className="ui input">
                    <Field
                    autoFocus
                    name="username"
                    type="username"
                    placeholder="Username"
                    />
                    </div>
                    <div className="ui input">
                    <Field
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                    </div>
                    <button className="ui button" type="submit">Log in</button>
                </Form>
                )}
            </Formik>
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
    checkUser: checkUser,
    loginUser: loginUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)