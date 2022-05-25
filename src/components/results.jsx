import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useFormState } from 'react-hook-form';
import { config } from '../../config';
import { Result } from './result';

export const Results = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);//{courtNum:1, playerA1:"", playerA2:"", playerB1:"", playerB2:"", scoreA:"", scoreB:""});

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

        fetch(`http://localhost:8081/matches?date=${newDate}`, {
            method: "GET",
            headers: {
                'content-type': "application/json"
            },
        })
        .then(response => response.json())
        .then(response => {
            const results = response.map(match => {
                return {
                    courtNum:match.courtNum,
                    playerA1:match.playerA1,
                    playerA2:match.playerA2,
                    playerB1:match.playerB1,
                    playerB2:match.playerB2,
                    scoreA:match.scoreA,
                    scoreB:match.scoreB
                }});
            setMatches(results);
        })
        .catch(error => {
            console.log(error);
        })
   }

    return (
        <>
            <Calendar className="m-auto mt-1.5 mb-3" onClickDay={handleDay} />
            <div className='md:flex justify-center'>
                {
                    matches && matches.map((match, index) => <Result 
                        key={index}
                        courtNum={match.courtNum}
                        playerA1={match.playerA1}
                        playerA2={match.playerA2}
                        playerB1={match.playerB1}
                        playerB2={match.playerB2}
                        scoreA={match.scoreA}
                        scoreB={match.scoreB} />)
                    // resultComp
                }
            </div>
        </>
    );
};

export default Results;