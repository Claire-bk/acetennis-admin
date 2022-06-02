import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { config } from '../../config';

export const Manage = () => {
    const today = new Date();
    // const dateString = today.toISOString().split('T')[0];
    const [players, setPlayers] = useState([]);
    const [playersH, setPlayersHigh] = useState([]);
    const [playersM, setPlayersMiddle] = useState([]);
    const [playersL, setPlayersLow] = useState([]);
    const [upcomingDate, setUpcomingDate] = useState("");
    const [data, setData] = useState({});
    const [resMessage, setMessage] = useState("");
    const inputRef = React.createRef();
    const navigate = useNavigate();
    const url = `https://git.heroku.com/acetennis.git/event?month=&year=&date=`;
    let infoClassName = 'p-4';
    const listClassName = 'p-3 text-slate-500 border m-2 p-2';

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }

        // fetch event date
        fetch(url, {
            method: "GET",
            headers: {
                'content-Type': "application/json"
            },
        })
        .then(res => res.json())
        .then(res => {
            const eventDate = new Date(res.date);
            const year = eventDate.getFullYear();
            const month = eventDate.getMonth() + 1;
            const date = eventDate.getDate();
            const fullDate = `${year}-${month}-${date}`;

            if(today - eventDate > 0) {
                // match game is not created.
                navigate("/create", { replace: true });
                return;
            }
            // fetch player list
            setUpcomingDate(fullDate);
            const updateData = {...data, date:fullDate};
            setData(updateData);
            const token = localStorage.getItem('TOKEN');
            fetch(`https://git.heroku.com/acetennis.git/players/${fullDate}`, {
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
                
                playerH.forEach(player => console.log(player.name))
                setPlayers(playerList);
                // setError("");
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
        if(players.length == 0) {
            setMessage('No player joined');
            return;
        }

        if(!inputRef.current.value) {
            setMessage('Enter court number');
            return;
        }

        setMessage("");
        navigate("/manage_game", { state: data }); 
    }

    return (
        <>
            <div className='text-center mt-3'>
                <h1 className='text-4xl text-color-mint mb-2'>Upcoming Match Game</h1>
                <span className='mt-2 p-4 text-xl text-slate-500'>{upcomingDate}</span>
                <div className={infoClassName}>
                    <div className='sm:flex flex-row justify-center'>
                        <div className={listClassName}>
                            <span className='text-center text-sky-900 bg-sky-100 p-2'>Level : High</span>
                            <ul>
                                {
                                    playersH.map((player, index) => <li key={index}>{player.name}</li>)
                                }
                            </ul>
                        </div>
                        <div className={listClassName}>
                            <span className='text-center text-sky-900 bg-sky-100 p-2'>Level : Middle</span>
                            <ul>
                                {
                                    playersM.map((player, index) => <li key={index}>{player.name}</li>)
                                }
                            </ul>
                        </div>
                        <div className={listClassName}>
                            <span className='text-center text-sky-900 bg-sky-100 p-2'>Level : Low</span>
                            <ul>
                                {
                                    playersL.map((player, index) => <li key={index}>{player.name}</li>)
                                }
                            </ul>
                        </div>
                    </div>
                    <label className='mt-2 p-4 text-xl text-slate-500' htmlFor="">How many courts?  </label>
                    <input className='border p-2 w-12' type="number" ref={inputRef} onClick={handleEnter} min="1" max="9" />
                </div>
                <button className='ml-4 p-2 border-none rounded-md bg-color-dark-pink text-white' onClick={handleClick}>Create</button>
            </div>
            <span className='block text-center mt-2 text-2xl text-red-500'>{resMessage}</span>
        </>
    );
};

export default Manage;