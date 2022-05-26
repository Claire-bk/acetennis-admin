import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { config } from '../../config';

export const Manage = () => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const [data, setData] = useState({date: dateString, courtNum: 1});
    const [resMessage, setMessage] = useState("");
    const inputRef = React.createRef();
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
        const newData = {...data, date: newDate};
        setData(newData);
        setMessage("");
    }

    function handleEnter() {
        setMessage("");
        const newData = {...data, courtNum: inputRef.current.value};
        setData(newData);
    }

    function handleClick(){
        if(!inputRef.current.value) {
            setMessage('Enter court number');
            return;
        }

        setMessage('Loading...');

        fetch(`https://git.heroku.com/acetennis.git/event`, {
            method: "POST",
            headers: {
                'Access-Control-Allow-Origin': 'content-type',
                'Content-Type': "application/json"
            },
            body: JSON.stringify({"date":data.date})
        })
        .then(response => {
            setMessage("");
            navigate("/manage_game", { state: data }); 
        })
        .catch(error => {
            console.error("Client error: " + error);
        })
    }

    return (
        <>
            <Calendar className="m-auto mt-1.5" onClickDay={handleDay} />
            <div className='text-center mt-3'>
                <span className='mt-2 p-4 text-xl text-slate-500'>{data.date}</span>
                <div className='p-4'>
                    <label className='mt-2 p-4 text-xl text-slate-500' htmlFor="">How many courts?  </label>
                    <input className='border p-2 w-12' type="number" ref={inputRef} onClick={handleEnter} />
                </div>
                <button className='ml-4 p-2 border-none rounded-md bg-color-dark-pink text-white' onClick={handleClick}>Create</button>
            </div>
            <span className='block text-center text-2xl text-red-500'>{resMessage}</span>
        </>
    );
};

export default Manage;