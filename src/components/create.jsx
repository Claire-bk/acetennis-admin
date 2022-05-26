import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// import { Calendar } from './calendar';
import { config } from '../../config';

export const Create = () => {
    const today = new Date();
    const currMonth = today.getMonth();
    const currYear = today.getFullYear();
    const dateString = today.toISOString().split('T')[0];
    const [data, setData] = useState({date: dateString, courtNum: 1});
    const [resMessage, setMessage] = useState("");
    const [selectedDate, setSelectedDate] = useState();
    const inputRef = React.createRef();
    const navigate = useNavigate();
    const url = `http://localhost:8081/event?month=${currMonth+1}&year=${currYear}&date=`;//?date=${fullDate};

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }

        fetch(url, {
            method: "GET",
            headers: {
                'content-Type': "application/json"
            },
        })
        .then(res => res.json())
        .then(res => {
            let year = "";
            let month = "";
            let date = "";

            console.log(res)
            const resDate = res.map(res => {
                const mapDate = res.date;
                const onlyDate = mapDate.split('T')[0];
                // year = onlyDate.split('-')[0];
                // month = onlyDate.split('-')[1];
                // date = onlyDate.split('-')[2];
                // console.log(new Date(parseInt(year), parseInt(month)-1, parseInt(date))
                // return onlyDate;
                // return new Date(parseInt(year), parseInt(month)-1, parseInt(date));
                return onlyDate;
            });
            console.log(resDate)
            
            setSelectedDate(resDate);
        })
        .catch(error => {
            console.log(error);
            console.log("Get events request failed");
        });
    }, []);

    // Make 2 digit of number to compare selectedDate
    function adjustEventDate(event) {
        const year = event.getFullYear();
        const month = event.getMonth() + 1;
        const monthStr = month < 10 ? `0${month}` : month;
        const date = event.getDate();
        const dateStr = date < 10 ? `0${date}` : date;
        let newDate = `${year}-${monthStr}-${dateStr}`;

        return newDate
    }

    function handleDay(event) {
        const newDate = adjustEventDate(event);
        const includes = selectedDate.includes(newDate);

        const newData = {...data, date: newDate};
        setData(newData);

        if(includes) {
            setMessage("Already Created");
        } else {
            setMessage("");
        }
    }

    function handleEnter() {
        setMessage("");
        const newData = {...data, courtNum: inputRef.current.value};
        setData(newData);
    }

    function handleCreate(){
        if(!inputRef.current.value) {
            setMessage('Enter court number');
            return;
        }

        const includes = selectedDate.includes(data.date);
        console.log(`data.date ${data.date}`)
        if(includes) {
            setMessage("Already Created");
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
                <button className='ml-4 p-2 border-none rounded-md bg-color-dark-pink text-white' onClick={handleCreate}>Create</button>
            </div>
            <span className='block m-2 text-center text-2xl text-red-500'>{resMessage}</span>
        </>
    );
};

export default Create;