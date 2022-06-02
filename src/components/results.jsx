import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export const Results = () => {
    const spanClassName = 'p-2 text-color-dark-pink hover:text-violet-700 hover:cursor-pointer';
    const listClassName = 'p-2 mr-4 text-slate-500 hover:cursor-pointer';
    const navigate = useNavigate();
    const [matches, setMatches] = useState();

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }

        fetch(`https://git.heroku.com/acetennis.git/event?date=all`, {
            method: "GET",
            headers: {
                'content-type': "application/json"
            },
        })
        .then(response => response.json())
        .then(response => {
            const results = response.map(match => {
                return {
                    id:match.id,
                    date:getFormatDate(new Date(match.date))
                    }
                });
            setMatches(results);
        })
        .catch(error => {
            console.log(error);
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
        navigate("/viewResult", { state: event.target.innerText });
    }

    function handleDelete() {

    }

    return (
        <>
            <ul className='m-2 divide-y divide-blue-200'>
                {
                    matches && matches.map((match, index) => {
                        return <div className='sm:flex m-1' key={index}>
                                <li className={listClassName} value={toString(match.date)} onClick={handleView}>{match.date}</li>
                                {/* <span className={spanClassName} id={match.id} onClick={handleView}>View</span> */}
                                {/* <span className={spanClassName} id={match.id} onClick={handleDelete}>Delete</span> */}
                                </div>
                    })
                    // resultComp
                }
            </ul>
        </>
    );
};

export default Results;