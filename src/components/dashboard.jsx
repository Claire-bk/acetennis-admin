import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from './card';

export const Dashboard = () => {
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }
    }, []);

    function handleClick(name) {
        const navName = `/${name.toLowerCase()}`;
        const isLogin = sessionStorage.getItem('isLogin');
        const username = sessionStorage.getItem('username');
        isLogin && (username==="admin") 
            ? navigate(navName, { replace: true }) : navigate('/', { replace: true })
    }

    fetch("https://git.heroku.com/acetennis.git/auth/count", {
            method: "GET",
            headers: {
                'content-type': "application/json"
            },
        })
        .then(response => response.json())
        .then(response => {
            setStatus(response.count);
        })
        .catch(error => {
            console.log(error);
        })

    return (
        <>
            <Card name="Members" number={status} icon="fa-user" onClick={handleClick}/>
            <Card name="Results" number="" icon="fa-square-poll-vertical" onClick={handleClick}/>
            <Card name="Manage" number="" icon="fa-gear" onClick={handleClick}/>
            <Card name="Create" number="" icon="fa-circle-plus" onClick={handleClick}/>
        </>
    );
};

export default Dashboard;