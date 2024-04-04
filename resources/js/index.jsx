import React, {Component} from 'react';
import {createRoot} from "react-dom/client";
import Router from './route.jsx';
import './../css/app.css';

export default class Index extends Component {
    render() {
        return (
            <Router />
        );
    }
}

if(document.getElementById('root')){
    createRoot(document.getElementById('root')).render(<Index />)
}

