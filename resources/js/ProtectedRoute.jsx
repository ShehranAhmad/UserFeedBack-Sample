import React, { useEffect, useState } from 'react';
import {  useNavigate  } from 'react-router-dom';
import api from './axios';


const ProtectedRoute = ({ component: Component, isLogin }) => {
    const navigateTo = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('/login');


    useEffect(() => {
        const isLoggedin = isLogin;
        const isAuthTokenValid = async () => {
            try {
                const response = await api.get('user');
                 if(response.status && isLoggedin){
                     setRedirectUrl('/');
                 }
                else if (response.status ) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (error) {
                if(!isLoggedin){
                    console.log('Error checking auth token:', error.data.message);
                    setAuthenticated(false);
                } else {
                    setAuthenticated(true);
                }


            } finally {
                setLoading(false);
            }
        };

        isAuthTokenValid();
    }, []);

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    return authenticated ? <Component/> : window.location.href = redirectUrl;

};

export default ProtectedRoute;


