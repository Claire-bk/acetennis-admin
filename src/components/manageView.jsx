import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const divClassName = 'ml-2 mr-2 p-2 text-slate-500';
const spanClassName = 'p-2';

export const ManageView = () => {
    const location = useLocation();
    const [matchDate, setMatchDate] = useState(location.state);
    const [matches, setMatches] = useState();

    useEffect(() => {
        fetch(`https://acetennis.herokuapp.com/matches?date=${matchDate}`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        })
        .then(response => response.json())
        .then(response => {
            if(response.length > 0) {
                const matchInfo = [...response];
                setMatches(matchInfo);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    function deleteMatches(matchId) {
        const token = localStorage.getItem('TOKEN');
        fetch(`https://acetennis.herokuapp.com/matches/${matchId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            navigate("/dashboard", { replace: true });

        })
        .catch(error => {
            console.log(error)
        })
    }

    function handleDelete() {
        matches.forEach((match) => deleteMatches(match.id));
    }

    return (
        <> 
            {
                 <div className='flex flex-col justify-center items-center flex-wrap '>
                     <h1 className='text-4xl text-color-mint m-2 p-2'>Match Table</h1>
                     <button className='mb-2 p-2 border-none rounded-md bg-color-dark-pink text-white text-center' onClick={handleDelete}>Delete Matches</button>
                     <div className='flex'>
                    {
                        matches && matches.map((match, index) => {
                            return <div className='flex flex-col border m-2'>
                                <span p-2 className='text-center text-sky-900 bg-sky-100 p-2' key={index}>court {match.courtNum}</span>
                                <div className={divClassName}><span className={spanClassName}>Player A1 :</span><span className={spanClassName}>{match.playerA1}</span></div>
                                <div className={divClassName}><span className={spanClassName}>Player A2 :</span><span className={spanClassName}>{match.playerA2 =='' ? 'Not selected' : match.playerA2}</span></div>
                                <div className={divClassName}><span className={spanClassName}>Player B1 :</span><span className={spanClassName}>{match.playerB1}</span></div>
                                <div className={divClassName}><span className={spanClassName}>Player B2 :</span><span className={spanClassName}>{match.playerB2 =='' ? 'Not selected' : match.playerB2}</span></div>
                                </div>
                        })
                    }
                    </div>
             </div>
            }
        </>
    );
};

export default ManageView;