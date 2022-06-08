import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const listClassName = 'p-3 text-slate-500 border m-2 p-2';
const ulClassName = 'mt-2';

export const Manage = () => {
    const today = new Date();
    // const dateString = today.toISOString().split('T')[0];
    const [players, setPlayers] = useState([]);
    const [playersH, setPlayersHigh] = useState([]);
    const [playersM, setPlayersMiddle] = useState([]);
    const [playersL, setPlayersLow] = useState([]);
    const [upcomingDate, setUpcomingDate] = useState("");
    const [upcomingId, setUpcomingId] = useState();
    const [resMessage, setMessage] = useState("");
    const navigate = useNavigate();
    const url = `https://acetennis.herokuapp.com/event?month=&year=&date=`;
    let infoClassName = 'p-4';

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }

        setMessage("Loading...");

        // fetch event date
        fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        })
        .then(res => res.json())
        .then(res => {
            const eventDate = new Date(res.date);
            const fullDate = getFormatDate(eventDate);

            if(today - eventDate > 0) {
                // match game is not created.
                navigate("/create", { replace: true });
                return;
            }

            fetch(`https://acetennis.herokuapp.com/matches?date=${fullDate}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json"
                },
            })
            .then(response => response.json())
            .then(response => {
                if(response.length > 0) {
                    navigate("/manage_view", { replace: true });
                    return;
                }
            })
            .catch(error => {
                console.log(error)
            })
            // fetch player list
            setUpcomingDate(fullDate);
            setUpcomingId(res.id);
            
            const token = localStorage.getItem('TOKEN');
            fetch(`https://acetennis.herokuapp.com/players/${fullDate}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => response.json())
            .then(response => {
                const playerList = [...response];

                if(playerList.length == 0) {
                    setMessage("No player joined");
                    infoClassName = infoClassName + ' hidden';
                    return;
                }

                setMessage("");

                // playerList &&  playerList.forEach(player=>player.status="")
                const playerH = playerList.filter(player => player.level == 'H');
                setPlayersHigh(playerH);
                const playerM = playerList.filter(player => player.level == 'M');
                setPlayersMiddle(playerM);
                const playerL = playerList.filter(player => player.level == 'L');
                setPlayersLow(playerL);
                
                // playerH.forEach(player => console.log(player.name))
                setPlayers(playerList);
                setMessage("");
            })
            .catch(error => {
                console.log("Client error: " + error);
            })       
        })
        .catch(error => {
            console.log(error);
            console.log("Get events request failed");
        });

    }, [infoClassName]);

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

    function handleClick(){
        if(players.length == 0) {
            setMessage('No player joined');
            return;
        }

        setMessage("");
        navigate("/manage_game", { state: {list:players, date:upcomingDate, id:upcomingId }}); 
    }

    return (
        <>
            <div className='text-center mt-3'>
                <h1 className='text-4xl text-color-mint mb-2'>Upcoming Match Game</h1>
                <span className='mt-2 p-4 text-xl text-slate-500'>{upcomingDate}</span>
                <div className={infoClassName}>
                    <div className='flex flex-row justify-center'>
                        <div className={listClassName}>
                            <span className='text-center text-sky-900 bg-sky-100 p-2'>Level : High</span>
                            <ul className={ulClassName}>
                                {
                                    playersH.map((player, index) => <li key={index}>{player.name}</li>)
                                }
                            </ul>
                        </div>
                        <div className={listClassName}>
                            <span className='text-center text-sky-900 bg-sky-100 p-2'>Level : Middle</span>
                            <ul className={ulClassName}>
                                {
                                    playersM.map((player, index) => <li key={index}>{player.name}</li>)
                                }
                            </ul>
                        </div>
                        <div className={listClassName}>
                            <span className='text-center text-sky-900 bg-sky-100 p-2'>Level : Low</span>
                            <ul className={ulClassName}>
                                {
                                    playersL.map((player, index) => <li key={index}>{player.name}</li>)
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <button className='ml-4 p-2 border-none rounded-md bg-color-dark-pink text-white' onClick={handleClick}>Create</button>
            </div>
            <span className='block text-center mt-2 text-2xl text-red-500'>{resMessage}</span>
        </>
    );
};

export default Manage;