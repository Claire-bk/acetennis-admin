import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export const Create = () => {
    let btnClassName = 'm-4 ml-4 p-2 border-none rounded-md bg-color-dark-pink text-white w-40  ';
    const today = new Date();
    const [resMessage, setMessage] = useState("");
    const [selectedDate, setSelectedDate] = useState();
    const [upcomingMsg, setUpcomingMessage] = useState("");
    const [upcomingDate, setUpcomingDate] = useState("");
    const [calendarValue, setCalendar] = useState();
    const [eventId, setEventId] = useState();
    const navigate = useNavigate();
    const url = `https://acetennis.herokuapp.com/event?month=&year=&date=`;
    const [btnText, setBtnText] = useState();

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }

        fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        })
        .then(res => {
            if(res.status == 200) {
                return res.json()
            } else {
                throw new Error(res.json());
            }
        }   )
        .then(res => {
            // check if upcoming event is already passed
            const eventDate = new Date(res.date);
            const year = eventDate.getFullYear();
            const month = eventDate.getMonth() + 1;
            const date = eventDate.getDate();
            const fullDate = `${year}-${month}-${date}`;

            // if upcoming event is already passed
            if(today - eventDate > 0) {
                // set new upcoming event
                setUpcomingMessage("");
                setUpcomingDate("");
                setEventId(-1);
                setBtnText("Create");
                setCalendar(new Date());
            } else {
                setUpcomingDate(fullDate);
                setCalendar(new Date(fullDate));
                setEventId(res.id);
                setUpcomingMessage(`Upcoming event is on ${fullDate}`);
                localStorage.setItem('UpcomingMatch', `${fullDate}`);
                setBtnText("Delete");
            }
        })
        .catch(error => {
            // console.log(error);
            // console.log("Get events request failed");
        });
    }, [upcomingMsg]);

    // Make 2 digit of number to compare selectedDate
    function adjustDate(event) {
        const year = event.getFullYear();
        const month = event.getMonth() + 1;
        const monthStr = month < 10 ? `0${month}` : month;
        const date = event.getDate();
        const dateStr = date < 10 ? `0${date}` : date;
        let newDate = `${year}-${monthStr}-${dateStr}`;

        return newDate
    }

    function handleDay(event) {
        if(today - event > 0) {
            setMessage("You can't choose the past date.");
            return;
        }

        setMessage("");
        const newDate = adjustDate(event);
        setSelectedDate(newDate);
    }

    function deleteEvent() {
        const token = localStorage.getItem('TOKEN');
        fetch(`https://acetennis.herokuapp.com/event/${eventId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setMessage("Upcoming event deleted");
            setUpcomingDate("");
            setCalendar(new Date());
            setEventId(-1);
            setBtnText("Create");
        })
        .catch(error => {
            console.error("admin crete error: " + error);
        })
    }

    function createEvent() {
	const token = localStorage.getItem('TOKEN');
        fetch(`https://acetennis.herokuapp.com/event`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': "application/json",
            },
            body: JSON.stringify({"date":selectedDate})
        })
        .then(response => {
            setMessage("Upcoming event created");
            setUpcomingDate(selectedDate);
            setCalendar(new Date(selectedDate));
            setBtnText("Delete");
            setUpcomingMessage(`Upcoming event is on ${selectedDate}`);
        })
        .catch(error => {
            console.error("Client error: " + error);
        })
    }

    function handleCreate(){
        if(upcomingDate !== "") {
            // Delete
            deleteEvent();
        } else {
            setMessage('Loading...');
            createEvent();
        }
    }

    return (
        <div className='flex flex-col items-center'>
            <h1 className='m-5 text-4xl text-color-mint text-center'>Create upcoming event</h1>
            <h2 className='m-5 text-xl text-slate-500 text-center'>{upcomingMsg}</h2>
            <Calendar className="m-auto mt-1.5" value={calendarValue} onClickDay={handleDay} />
            <button className={btnClassName} onClick={handleCreate}>{btnText}</button>
            <span className='block m-2 text-center text-2xl text-red-500'>{resMessage}</span>
        </div>
    );
};

export default Create;