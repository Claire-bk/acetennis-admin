import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const spanClassName = 'p-2 text-color-dark-pink hover:text-violet-700 hover:cursor-pointer';
const listClassName = 'p-2  text-slate-500 hover:cursor-pointer';

export const Results = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState();

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }

        fetch(`https://acetennis.herokuapp.com/event?date=all`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        })
        .then(response => response.json())
        .then(response => {
            const results = response.map(match => {
                return {
                    ...match,
                    date:getFormatDate(new Date(match.date))
                    }
                });
            setMatches(results);
        })
        .catch(error => {
            // console.log(error);
        })
    }, []);

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

    function handleView(event) {
        const match = matches.filter(match => match.id == event.target.dataset.id);
        navigate("/result_view", { state: match[0] });
    }

    function handleEdit(event) {
        const match = matches.filter(match => match.id == event.target.dataset.id);
        navigate("/result_edit", { state: match[0] });
    }

    function handleDelete(event) {
        const match = matches.filter(match => match.id == event.target.dataset.id);
        navigate("/result_delete", { state: match[0] });
    }

    return (
        <>
            <ul className='m-2'>
                {
                    matches && matches.map((match, index) => {
                        return <div className='flex border m-2 justify-between items-center' key={index}>
                                    <span className={listClassName} data-date={match.date} data-id={match.id} onClick={handleView}>{match.date}</span>
                                    <span className={listClassName} data-date={match.date} data-id={match.id} onClick={handleView}>Court {match.courtNum}</span>
                                    <div className='p-2'>
                                        <span className={spanClassName} data-date={match.date} data-id={match.id} onClick={handleEdit}>Edit</span>
                                        <span className={spanClassName} data-date={match.date} data-id={match.id} onClick={handleDelete}>Delete</span>
                                    </div>
                                </div>
                    })
                    // resultComp
                }
            </ul>
        </>
    );
};

export default Results;