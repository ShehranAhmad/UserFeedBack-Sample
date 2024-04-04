import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterUser from './components/Auth/register.jsx';
import LoginUser from './components/Auth/login.jsx';
import FeedbackList from './components/Feedback/list.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={<ProtectedRoute component={RegisterUser} isLogin={true} />}  />
                    <Route path="/login" element={<ProtectedRoute component={LoginUser} isLogin={true}  />} />
                    <Route path="/" element={<ProtectedRoute component={FeedbackList} isLogin={false}  />} />
                    <Route path="/feedbacks" element={<ProtectedRoute component={FeedbackList} isLogin={false}  />} />
                </Routes>
            </BrowserRouter>

        );
    }
}

export default Router;
