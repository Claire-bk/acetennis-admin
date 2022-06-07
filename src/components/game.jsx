import React, { useState, useEffect } from 'react';

export const Game = (props) => {
    const optionClassName = 'p-2 text-sky-700';
    const courtNumber = `Court ${props.court}`;
    const levelRef = React.createRef();
    const playerA1Ref = React.createRef();
    const playerA2Ref = React.createRef();
    const playerB1Ref = React.createRef();
    const playerB2Ref = React.createRef();
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState({playerA1:"", playerA2:"", playerB1:"", playerB2:""});

    useEffect(() => {
        const propsPlayers = [...props.players];
        const filterPlayers = [...props.players];
        setPlayers(propsPlayers);

        if(props.level ==='H'||'M'||'L') {
            filterPlayers.filter(player => player.level === props.level);
        }
    }, [props.players]);

    function handleChange() {
        const level = levelRef.current.value;
        const levelPlayers = (level==='H'||'M'||'L') ? players.filter(player => player.level === level) : players;
        props.onLevelChange(props.court, levelRef.current.value);
    }

    function handlePlayerA1() {
        const userId = playerA1Ref.current.value;
        if(userId !== selectedPlayer.playerA1) {
            const selected = {...selectedPlayer, playerA1: userId};
            setSelectedPlayer(selected);
            props.onPlayerSelected(selectedPlayer.playerA1, userId, props.court, selected);
        }
    }

    function handlePlayerA2() {
        const userId = playerA2Ref.current.value;
        if(userId !== selectedPlayer.playerA2) {
            const selected = {...selectedPlayer, playerA2: userId};
            setSelectedPlayer(selected);
            props.onPlayerSelected(selectedPlayer.playerA2, userId, props.court, selected);
        }
    }

    function handlePlayerB1() {
        const userId = playerB1Ref.current.value;
        if(userId !== selectedPlayer.playerB1) {
            const selected = {...selectedPlayer, playerB1: userId};
            setSelectedPlayer(selected);
            props.onPlayerSelected(selectedPlayer.playerB1, userId, props.court, selected);
        }
    }

    function handlePlayerB2() {
        const userId = playerB2Ref.current.value;
        if(userId !== selectedPlayer.playerB2) {
            const selected = {...selectedPlayer, playerB2: userId};
            setSelectedPlayer(selected);
            props.onPlayerSelected(selectedPlayer.playerB2, userId, props.court, selected);
        }
    }

    return (
        <div className='md:flex flex-col border m-2 p-4 justify-center items-center'>
            <span className='p-2 text-pink-900'>{courtNumber}</span>
            <div>
                <label className='p-2 text-sky-700'>Level</label>
                <select className='p-2' name="" id="level" ref={levelRef} onChange={handleChange}>
                    <option value="A">All</option>
                    <option value="H">High</option>
                    <option value="M">Middle</option>
                    <option value="L">Low</option>
                </select>
            </div>
            <select className='p-2' ref={playerA1Ref} onChange={handlePlayerA1}>
                <option className={optionClassName} value="">Team A: Player1</option>
                {
                    players && 
                    players.map((player, index) => {
                        // check level
                        if(props.level === 'A' || props.level === player.level) {
                            if(player.status != 'selected'){
                                return <option className={optionClassName} key={index} value={player.id}>{player.name}</option>
                            } else if(selectedPlayer.playerA1 == player.id) {
                                return <option className={optionClassName} key={index} value={player.id} selected>{player.name}</option>
                            }
                        }
                    })
                }
            </select>
            <select className='p-2' ref={playerA2Ref} onChange={handlePlayerA2}>
                <option className='p-2 text-sky-700' value="">Team A: Player2</option>
                {
                        players && 
                        players.map((player, index) => {
                            // check level
                            if(props.level === 'A' || props.level === player.level) {
                                if(player.status != 'selected'){
                                    return <option className='p-2 text-sky-700' key={index} value={player.id}>{player.name}</option>
                                } else if(selectedPlayer.playerA2 == player.id) {
                                    return <option className='p-2 text-sky-700' key={index} value={player.id} selected>{player.name}</option>
                                }
                            }
                        })
                }
            </select>
            <select className='p-2' ref={playerB1Ref} onChange={handlePlayerB1}>
                <option className={optionClassName} value="">Team B: Player1</option>
                {
                    players && 
                    players.map((player, index) => {
                        // check level
                        if(props.level === 'A' || props.level === player.level) {
                            if(player.status != 'selected'){
                                return <option className={optionClassName} key={index} value={player.id}>{player.name}</option>
                            } else if(selectedPlayer.playerB1 == player.id) {
                                return <option className={optionClassName} key={index} value={player.id} selected>{player.name}</option>
                            }
                        }
                    })
                }
            </select>
            <select className='p-2' ref={playerB2Ref} onChange={handlePlayerB2}>
                <option className={optionClassName} value="">Team B: Player2</option>
                {
                    players && 
                    players.map((player, index) => {
                        // check level
                        if(props.level === 'A' || props.level === player.level) {
                            if(player.status != 'selected'){
                                return <option className={optionClassName} key={index} value={player.id}>{player.name}</option>
                            } else if(selectedPlayer.playerB2 == player.id) {
                                return <option className={optionClassName} key={index} value={player.id} selected>{player.name}</option>
                            }
                        }
                    })
                }
            </select>
        </div>
    );
};

export default Game;