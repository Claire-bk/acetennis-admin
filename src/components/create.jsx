import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { config } from '../../config';

export const Create = () => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const [date, setDate] = useState(dateString);
    const [resMessage, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }
    }, []);

    function handleDay(event) {
        const year = event.getFullYear();
        const month = event.getMonth() + 1;
        const date = event.getDate();
        const newDate = `${year}-${month}-${date}`;
        
        setDate(newDate);
        setMessage("");
    }

    function handleClick() {
        setMessage('Loading...');
        fetch(`http://localhost:${config.host.port}/event`, {
            method: "POST",
            headers: {
                'Access-Control-Allow-Origin': 'content-type',
                'Content-Type': "application/json"
            },
            body: JSON.stringify({"date":date})
        })
        .then(response => {
            const status = response.status;

            if(status === 201) {
                navigate("/dashboard", { replace: true });
                setMessage('Created');
            } else {
                setMessage('Already created');
            }            
        })
        .catch(error => {
            console.error("Client error: " + error);
        })
    }

    return (
        <>
            <Calendar className="m-auto mt-1.5" onClickDay={handleDay} />
            <div className='text-center mt-3'>
                <span className='mt-4 p-4 text-2xl text-slate-500'>Create a match game on </span>
                <span className='mt-4 p-4 text-2xl text-slate-500'>{date.toString()}</span>
                <button className='ml-2 p-2 border-none rounded-md bg-color-dark-pink text-white' onClick={handleClick}>Create</button>
            </div>
            <span className='block text-center text-2xl text-red-500'>{resMessage}</span>
        </>
    );
};

export default Create;