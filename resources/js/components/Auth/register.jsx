import React, { Component } from 'react';
import {Link, useNavigate} from "react-router-dom";
import api from './../../axios'



class RegisterUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            errors: {} // to store validation errors
        };
    }


    validateForm = () => {
        const { name, email, password } = this.state;
        const errors = {};
        if (!name.trim()) {
            errors.name = 'Name is required';
        }
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }
        if (!password.trim()) {
            errors.password = 'Password is required';
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
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

    handleRegister = () => {
        if (this.validateForm()) {
            const { name, email, password } = this.state;
            api.post('register',{ name, email, password })
                .then(response => {
                    debugger
                    localStorage.setItem("auth_token",response.data);
                    window.location.href = "/feedbacks";
                })
                .catch(error => {
                    if (error.status == 422){
                        let errors = {};
                        errors = error.data;
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
                        <h3>Sign Up</h3>
                        <div className="mb-3">
                            <label>Name</label>
                            <input type="text" name="name"
                                   className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                   placeholder="Full Name"
                                   value={this.state.name} onChange={this.handleInputChange}/>
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
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
                            <button type="button" className="btn btn-primary" onClick={this.handleRegister}>
                                Sign Up
                            </button>
                        </div>
                        <p className="forgot-password text-right">
                            Already registered <Link to="/login" className="nav-link">sign in?</Link>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

RegisterUser.propTypes = {};
export default RegisterUser;


