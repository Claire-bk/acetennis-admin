import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Member from './member';
import { config } from '../../config';

export const Members = () => {
    const [members, setMember] = useState([]);
    const [filter, setFilter] = useState([]);
    const [status, setStatus] = useState("");
    const optionRef = React.createRef();
    const navigate = useNavigate();

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }

        setStatus('Loading...');
        fetch(`https://git.heroku.com/acetennis.git/members?level=${optionRef.current.value}`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        })
        .then(response => response.json())
        .then(response => {
            setMember(response);
            setFilter(response);
            setStatus("");
        })
        .catch(error => {
            console.log("Client error: " + error);
        })
    }, []);

    function handleChange() {
        const level = optionRef.current.value;
        if(level === 'A') {
            setFilter(members);
            return;
        }

        const filterMembers = members.filter(member => member.level == level);
        setFilter(filterMembers);
    }

    function handleEdit(id) {
        console.log(`id ${id}`)
    }

    function handleDelete(id) {
        setStatus('Loading...');
        fetch(`http://localhost:${config.host.port}/members/${id}`, {
            method: "DELETE",
            headers: {
                'content-Type': "application/json" 
            },
        })
        .then(res => {
            const members = members.filter(member => member.id !== id);
            const filterMembers = members.filter(member => member.level == level);
            setStatus("");
        })
        .catch(error => {
            console.log(error);
            console.log("Fail to delete member");
        });
        }

    return (
        <div>
            <label className='mt-2 p-2 text-xl text-slate-500' htmlFor="">Level : </label>
            <select ref={optionRef} defaultValue="A" className='mt-2 p-2 text-xl text-slate-500' onChange={handleChange}>
                <option value="A">All</option>
                <option value="H">High</option>
                <option value="M">Middle</option> 
                <option value="L">Low</option> 
            </select>
            <ul>
                {
                    filter.map((member, index)=> (
                        <Member key={index} id={member.id} username={member.username} name={member.name} level={member.level} 
                            onEdit={handleEdit}
                            onDelete={handleDelete} />
                    ))
                }
            </ul>
            <span>{status}</span>
        </div>
    );
};

export default Members;