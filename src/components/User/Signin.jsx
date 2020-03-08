import React,{Component} from 'react';
import {connect} from 'react-redux';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';

import history from '../../history';
import {createUser, checkAvailableUser, loginUser} from '../../actions';

class Signin extends Component{
    constructor(props){
        super(props);
        this.state = {
            errors:null
        }
    }  

    checkInput = (values) => {
        this.props.checkAvailableUser(values);
        console.log(this.props.user.usernameAvailable)
        
        if(!this.props.user.usernameAvailable){
            this.setState({errors: "Username not available"})
            return false;
        }
        else{
            return true;
        }
    }

    async loginUser(username,password){
        await this.props.createUser({username: username, password:password});
        await this.props.loginUser(username);
    }
    //https://jasonwatmore.com/post/2019/04/10/react-formik-form-validation-example
    render(){
        return(
            <div style={{padding:"20px"}}>
            <Formik
            initialValues={{username:'',password:'', retypePassword:""}}
            validationSchema={Yup.object().shape({
                username: Yup.string()
                    .required('Username is required')
                    .min(4, 'Username must be at least 4 characters'),
                password: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .required('Password is required'),
                confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required')
            })
            }
                onSubmit={values => {
                    if(this.checkInput(values)){
                        console.log("Signed in successfully");
                        this.loginUser(values.username, values.password)
                        console.log(this.props.user);
                        history.goBack();
                    }
                    else{
                        console.log("Password not typed in correctly again")
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
                    placeholder="Username/Email"
                    />
                    {errors.username && touched.username?(
                        <div>{errors.username}</div>
                    ):null}
                    </div>
                    <div className="ui input">
                    <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    />
                    {errors.password && touched.password?(
                        <div>{errors.password}</div>
                    ):null}
                    </div>
                    <div className="ui input">
                        <Field 
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        />
                        {errors.confirmPassword && touched.confirmPassword?(
                        <div>{errors.confirmPassword}</div>
                    ):null}
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