import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result } from './result';

const btnClassName = 'm-4 ml-4 p-2 border-none rounded-md bg-color-dark-pink text-white w-40';

export const ResultView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const matchInfo = location.state;
    const [match, setMatch] = useState(matchInfo);
    const [resMessage, setMessage] = useState();

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }
    }, [])

    function handleEdit() {
        navigate("/result_edit", { state: match });
    }

    function handleDelete() {
        navigate("/result_delete", { state: match });
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <h1 className='text-4xl text-color-mint text-center p-4'>View Result</h1>
            <Result 
                courtNum={match.courtNum}
                playerA1={match.playerA1}
                playerA2={match.playerA2}
                playerB1={match.playerB1}
                playerB2={match.playerB2}
                scoreA={match.scoreA == null ? 0 : match.scoreA}
                scoreB={match.scoreB == null ? 0 : match.scoreB} />
            <div>
                <button className={btnClassName} onClick={handleEdit}>Edit</button>
                <button className={btnClassName} onClick={handleDelete}>Delete</button>
            </div>
            <span className='mt-4 text-2xl text-red-500'>{resMessage}</span>
        </div>
    );
};

export default ResultView;