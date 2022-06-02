import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Game } from './game';
import { config } from '../../config';
import { CLIENT_IGNORE_SPACE } from 'mysql/lib/protocol/constants/client';

export const ManageGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;
    const courtArr = [];
    const [errorStatus, setError] = useState("");
    const [courtLevel, setLevel] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSeletedPlayers] = useState([]);

    const level = [];
    for(i=0; i< data.courtNum; i++) {
        courtArr[i] = i + 1;
        level[i] ='A'
    }

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }
        
        setError('Loading...');
        setLevel(level);

        const token = localStorage.getItem('TOKEN');
        fetch(`https://git.heroku.com/acetennis.git/players/${data.date}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then(response => {
            const playerList = [...response];

            playerList &&  playerList.forEach(player=>player.status="")
            
            setPlayers(playerList);
            setError("");
        })
        .catch(error => {
            setError("");
            console.log("Client error: " + error);
        })
    }, []);

    function handleLevel(court, level) {
        const newLevel = [...courtLevel];
        newLevel[court-1] = level;
        setLevel(newLevel);
    }

    function handlePlayer(preId, currId, court, selectedList) {  
        const newPlayers = [...players];
        
        newPlayers.forEach(player => {
            if (player.id == preId) {
                player.status = "";
            }

            if(player.id == currId) {
                player.status = "selected"
            }
        })

        setPlayers(newPlayers);

        // num start from 1 -
        const index = court - 1;
        const newList = {...selectedList};
        const newSelectedList = [...selectedPlayers];

        newSelectedList[index] = newList;

        setSeletedPlayers(newSelectedList);
    }

    function postMatchInfo() {
        // const data = selectedPlayers.map((team, index) => [{...team, courtNum:index+1}]);
        selectedPlayers.forEach((item, index) => {
            // console.log(JSON.stringify(data));
            setError('Loading...');
            const token = localStorage.getItem('TOKEN');
            fetch(`https://git.heroku.com/acetennis.git/matches`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({...item, courtNum:index+1, date:data.date})
                })
                .then(response => response.json())
                .then(response => {
                    setError('');
                })
                .catch(error => {
                    console.log("Client error: " + error);
                })
        })
        navigate('/dashboard', { replace: true })
    }

    function handleSave() {
        // player1 of each team should't be null
        const index = selectedPlayers.findIndex((team) => !team.playerA1 || !team.playerB1);

        if(index == -1) {
            postMatchInfo();
            setError("");
        } else {
            setError('Player1 should be selected!');
        }
    }

    return (
        <div className='sm:flex flex-col justify-center mt-2'>
            <button className='ml-4 p-2 border-none rounded-md bg-color-dark-pink text-white text-center' onClick={handleSave}>Save</button>
            <div className='sm:flex justify-center'>
                {
                        courtArr && courtArr.map((num, index) => <Game key={index} court={num} level={courtLevel[index]}  players={players} 
                        onLevelChange={handleLevel}
                        onPlayerSelected={handlePlayer} />)
                }
            </div>
            <span className="text-color-dark-pink md:col-start-2 col-span-2 text-center mr-8">{errorStatus}</span>
        </div>
    );
};

export default ManageGame;