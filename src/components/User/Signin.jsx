import React,{Component} from 'react';
import {connect} from 'react-redux';
import {Formik, Form, Field} from 'formik';

import history from '../../history';
import {createUser, checkAvailableUser, loginUser} from '../../actions';

class Signin extends Component{
    constructor(props){
        super(props);
        this.state = {}
    }  

    checkInput = (values) => {
        this.props.checkAvailableUser(values);
        
        if(!this.props.user.usernameAvailable){
            return false;
        }
        else if(values.password === values.retypePassword){
            return true;
        }
        else{
            return false;
        }
    }

    render(){
        return(
            <div style={{padding:"20px"}}>
            <Formik
            initialValues={{username:'',password:'', retypePassword:""}}
                onSubmit={values => {
                    if(this.checkInput(values)){
                        console.log("Signed in successfully");
                        this.props.createUser({username: values.username, password:values.password});
                        this.props.loginUser(values.username);
                        
                        console.log(this.props.user);
                        history.goBack();
                    }
                    else{
                        console.log("Password not typed in correctly again")
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
                    placeholder="Username/Email"
                    />
                    </div>
                    <div className="ui input">
                    <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    />
                    </div>
                    <div className="ui input">
                        <Field 
                        name="retypePassword"
                        type="password"
                        placeholder="Type password in again"
                        />
                    </div>
                    <button className="ui button" type="submit">Sign in</button>
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
    createUser: createUser,
    checkAvailableUser: checkAvailableUser,
    loginUser: loginUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin)