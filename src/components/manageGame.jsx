import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Game } from './game';

export const ManageGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const playerInfo = location.state;
    const [courtInfo, setCourtInfo] = useState([{courtNum:1, level:'A'}]);
    const [errorStatus, setError] = useState("");
    const [players, setPlayers] = useState(playerInfo.list);
    const [upcomingDate, setUpcomingDate] = useState(playerInfo.date);
    const [selectedPlayers, setSeletedPlayers] = useState([{playerA1: '', playerA2: '', playerB1: '', playerB2: ''}]);

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }
    }, []);

    function handleLevel(court, level) {
        const index = court -1;
        const newCourt = {...courtInfo};
        newCourt[index].level = level;
        setCourtInfo(newCourt);
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
        setError("");

        // num start from 1 -
        const index = court - 1;
        const newList = {...selectedList};
        const newSelectedList = [...selectedPlayers];

        newSelectedList[index] = newList;

        setSeletedPlayers(newSelectedList);
    }

    function postMatchInfo() {
        selectedPlayers.forEach((item, index) => {
            setError('Loading...');
            const token = localStorage.getItem('TOKEN');
            fetch(`https://acetennis.herokuapp.com/matches`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({...item, courtNum:index+1, date:upcomingDate})
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
            setError('Player should be selected!');
        }
    }

    function handleAddCourt() {
        let len = courtInfo.length;

        if(len >= 10) {
            return;
        }

        len = len + 1;

        let newCourt = [...courtInfo, {courtNum:len, level:'A'}];
        setCourtInfo(newCourt);

        const players = [...selectedPlayers, {playerA1: '', playerA2: '', playerB1: '', playerB2: ''}];
        setSeletedPlayers(players);
    }

    function handleDeleteCourt() {
        const len = courtInfo.length;
        console.log(selectedPlayers)

        if(len <= 1) {
            return;
        }

        const newPlayers = [...players];
        const courtIndex = len - 1;
        // delete seleted player by last court number
        selectedPlayers.length > 0 && newPlayers.forEach(player => {
            if(player.id == selectedPlayers[courtIndex].playerA1) {
                player.status = "";
            } else if(player.id == selectedPlayers[courtIndex].playerA2) {
                player.status = "";
            } else if(player.id == selectedPlayers[courtIndex].playerB1) {
                player.status = "";
            } else if(player.id == selectedPlayers[courtIndex].playerB2) {
                player.status = "";
            }
        })

        setPlayers(newPlayers);
        // console.log(selectedPlayers)
        let newCourt = [...courtInfo];
        newCourt.pop();
        setCourtInfo(newCourt);

        let newPlayer = [...selectedPlayers];
        // console.log(newPlayer);
        newPlayer.pop();
        // console.log(newPlayer);
        setSeletedPlayers(newPlayer);
    }

    return (
        <div className='flex flex-col justify-center mt-2'>
            <div className='text-center'>
                <button className='ml-4 p-2 border-none rounded-md bg-color-dark-pink text-white text-center' onClick={handleAddCourt}>Add Court</button>
                <button className='ml-4 p-2 border-none rounded-md bg-color-dark-pink text-white text-center' onClick={handleDeleteCourt}>Delete Court</button>
                <button className='ml-4 p-2 border-none rounded-md bg-color-dark-pink text-white text-center' onClick={handleSave}>Save</button>
            </div>
            <div className='flex justify-center  flex-wrap '>
                {
                        courtInfo && courtInfo.map((item, index) => <Game key={index} court={item.courtNum} level={item.level}  players={players} 
                        onLevelChange={handleLevel}
                        onPlayerSelected={handlePlayer} />)
                }
            </div>
            <span className="text-color-dark-pink md:col-start-2 col-span-2 text-center mr-8">{errorStatus}</span>
        </div>
    );
};

export default ManageGame;