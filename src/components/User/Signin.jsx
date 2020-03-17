import React,{Component} from 'react';
import {connect} from 'react-redux';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';

import history from '../../history';
import {createUser, checkAvailableUser, loginUser} from '../../actions';
import Header from '../Header';

class Signin extends Component{
    constructor(props){
        super(props);
        this.state = {
            errors:null
        }
    }  

    checkInput = (values) => {
        this.props.checkAvailableUser(values);
        
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
            <div><Header /> 
            <div style={{textAlign:"center",padding:"200px"}}>
            <Formik
            initialValues={{username:'',password:'', retypePassword:""}}
            validationSchema={Yup.object().shape({
                username: Yup.string()
                    .required('Username is required')
                    .min(4, 'Username must be at least 4 characters')
                    .max(20, 'Username with max 20 characters allowed'),
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
                        this.loginUser(values.username, values.password)
                        history.goBack();
                    }
                    else{
                        //not typed in correctly
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
                    </div>
                    <div>
                    {errors.username && touched.username?(
                        <div className="error-message">{errors.username}</div>
                    ):null}
                    </div>
                    
                    <div className="ui input">
                    <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    />
                    </div>
                    <div>
                    {errors.password && touched.password?(
                        <div className="error-message">{errors.password}</div>
                    ):null}
                    </div>
                    <div className="ui input">
                        <Field 
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        />
                        </div>
                        <div>
                        {errors.confirmPassword && touched.confirmPassword?(
                        <div className="error-message">{errors.confirmPassword}</div>
                    ):null}
                    </div>
                    <div>
                    <button className="ui button" type="submit">Sign in</button>
                    </div>
                </Form>
                )}
            </Formik>
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
    createUser: createUser,
    checkAvailableUser: checkAvailableUser,
    loginUser: loginUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin)