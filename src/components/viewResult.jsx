import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result } from './result';

export const ViewResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [resMessage, setMessage] = useState();
    const matchDate = location.state;

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }

        fetch(`https://git.heroku.com/acetennis.git/matches?date=${matchDate}`, {
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
                    scoreA:match.scoreA == null ? 0 : match.scoreA,
                    scoreB:match.scoreB == null ? 0 : match.scoreB
                }});
            setMatches(results);
            if(results.length == 0) {
                setMessage("No match created");
            }else {
                setMessage("");
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [])

    return (
        <div className='sm:flex justify-center'>
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
            <span className='mt-4 text-2xl text-red-500'>{resMessage}</span>
        </div>
    );
};

export default ViewResult;