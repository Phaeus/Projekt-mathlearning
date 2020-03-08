import React,{Component} from 'react';
import {connect} from 'react-redux';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';

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

    loginUser(username){
        this.props.loginUser(username);
    }

    render(){
        return(
            <div style={{padding:"20px"}}>
            <Formik
            initialValues={{username:'',password:''}}
            validationSchema={Yup.object().shape({
                    username: Yup.string()
                        .required('Username is required'),
                    password: Yup.string()
                        .required('Password is required'),
                })
            }
                onSubmit={values => {
                    if(this.checkUser(values)){
                        console.log("Logged in successfully.");
                        this.loginUser(values.username)
                        console.log(this.props.user)
                        history.goBack();
                    }
                    else{
                        return(<div>He</div>)
                    }
                }}
            >
                {({values, errors, touched, isValidating, isSubmitting}) => (
                    <Form>
                        <div className="ui input">
                    <Field
                    autoFocus
                    name="username"
                    type="username"
                    placeholder="Username"
                    />
                    {errors.username && isSubmitting.username?(
                        <div>{errors.username}</div>
                    ):null}
                    </div>
                    <div className="ui input">
                    <Field
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                    {errors.password && isSubmitting.password?(
                        <div>{errors.password}</div>
                    ):null}
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