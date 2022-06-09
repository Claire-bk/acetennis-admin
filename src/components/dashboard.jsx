import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from './card';

export const Dashboard = () => {
    const [status, setStatus] = useState("");
    const [isView, setView] = useState(false);
    const [matchDate, setMatchDate] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }

        const token = localStorage.getItem('TOKEN');

    fetch(`https://acetennis.herokuapp.com/auth/count`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => response.json())
        .then(response => {
            setStatus(response.count);
            getMatchInfo();
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    function getMatchInfo() {
        fetch(`https://acetennis.herokuapp.com/event?month=&year=&date=`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        })
        .then(res => res.json())
        .then(res => {
            const today = new Date();
            const eventDate = new Date(res.date);
            const fullDate = getFormatDate(eventDate);
            
            setMatchDate(fullDate);

            if(today - eventDate <= 0) {
                fetch(`https://acetennis.herokuapp.com/matches?date=${fullDate}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json"
                    },
                })
                .then(response => response.json())
                .then(response => {
                    if(response.length > 0) {
                        setView(true);
                    }
                })
                .catch(error => {
                    setView(false);
                    console.log(error);
                });
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    function getFormatDate (date) {
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        let year = date.getFullYear();
        if (month.length < 2) {
          month = '0' + month;
        }
        if (day.length < 2) {
          day = '0' + day;
        }
        return [year, month, day].join('-');
    }

    function handleClick(name) {
        const navName = `/${name.toLowerCase()}`;
        const isLogin = sessionStorage.getItem('isLogin');
        const username = sessionStorage.getItem('username');

        isLogin && (username==="admin") 
            ? navigate(navName, { replace: true }) : navigate('/', { replace: true })
    }

    function handleManage() {
        const isLogin = sessionStorage.getItem('isLogin');
        const username = sessionStorage.getItem('username');

        if(!isLogin || username != 'admin') {
            navigate('/', {replace: true});
            return;
        }

        if(isView) {
            navigate('/manage_view', {state:matchDate});
        } else {
            navigate('/manage');
        }
    }

    return (
        <>
            <Card name="Members" number={status} icon="fa-user" onClick={handleClick}/>
            <Card name="Results" number="" icon="fa-square-poll-vertical" onClick={handleClick}/>
            <Card name="Manage" number="" icon="fa-gear" onClick={handleManage}/>
            <Card name="Create" number="" icon="fa-circle-plus" onClick={handleClick}/>
        </>
    );
};

export default Dashboard;