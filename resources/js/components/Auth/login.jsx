import React, { Component } from 'react';
import {Link, useNavigate} from "react-router-dom";
import api from './../../axios'



class LoginUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: {} // to store validation errors
        };
    }


    validateForm = () => {
        const {  email, password } = this.state;
        const errors = {};

        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }
        if (!password.trim()) {
            errors.password = 'Password is required';
        }
        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            [name]: value,
            errors: {
                ...prevState.errors,
                [name]: value.trim() ? '' : prevState.errors[name]
            }
        }));
    };

    handleLogin = () => {
        if (this.validateForm()) {
            const {  email, password } = this.state;
            api.post('login',{  email, password })
                .then(response => {
                    localStorage.setItem("auth_token",response.data);
                    window.location.href = "/feedbacks";
                })
                .catch(error => {
                    if (error.status == 422){
                        let errors = {};
                        if(error.data.message){
                            errors.password = error.data.message;
                        } else {
                            errors = error.data;
                        }
                        this.setState({ errors });
                        return Object.keys(errors).length === 0;
                    }
                });

        }
    };

    render() {
        const { errors } = this.state;
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form>
                        <h3>Login</h3>

                        <div className="mb-3">
                            <label>Email</label>
                            <input type="email" name="email"
                                   className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Email"
                                   value={this.state.email} onChange={this.handleInputChange}/>
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input type="password" name="password"
                                   className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                   placeholder="Password" value={this.state.password}
                                   onChange={this.handleInputChange}/>
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        <div className="d-grid">
                            <button type="button" className="btn btn-primary" onClick={this.handleLogin}>
                                Login
                            </button>
                        </div>
                        <p className="forgot-password text-right">
                            Create New Account <Link to="/register" className="nav-link">sign up?</Link>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

LoginUser.propTypes = {};
export default LoginUser;




