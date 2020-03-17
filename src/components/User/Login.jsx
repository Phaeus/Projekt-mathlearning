import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './Login.css'

import history from '../../history';
import { checkUser, loginUser } from '../../actions';
import Header from '../Header';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    checkUser(values) {
        this.props.checkUser(values.username, values.password);
        return this.props.user.loginSuccess;
    }

    async loginUser(username) {
         await this.props.loginUser(username);
    }

    render() {
        return (
            <div>
                <Header />
            <div style={{ padding: "20px" }}>
                
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={Yup.object().shape({
                        username: Yup.string()
                            .required('Username is required'),
                        password: Yup.string()
                            .required('Password is required'),
                    })
                    }
                    onSubmit={values => {
                        if (this.checkUser(values)) {
                            this.loginUser(values.username)
                            history.goBack();
                        }
                        else {
                            return (<div>He</div>)
                        }
                    }}
                >
                    {({ values, errors, touched, isValidating, isSubmitting }) => (
                        <Form >
                            <div style={{textAlign:"center", paddingTop:"200px"}}>
                                <div className="ui input">
                                    <Field
                                        autoFocus
                                        name="username"
                                        type="username"
                                        placeholder="Username"
                                    />
                                    </div>
                                    <div>
                                    {errors.username && touched.username ? (
                                        <div className="error-message">{errors.username}</div>
                                    ) : null}
                                    </div>
                                
                                <div>
                                    <div className="ui input" id="pwField">
                                        <Field
                                        className="field"
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                        />
                                        </div>
                                        <div>
                                        {errors.password && touched.password ? (
                                            <div className="error-message">{errors.password}</div>
                                        ) : null}
                                        </div>
                                    
                                </div>
                                <div>
                                    <div>
                                        <button className="ui button" type="submit">Log in</button>
                                    </div>
                                </div>
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
    checkUser: checkUser,
    loginUser: loginUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)