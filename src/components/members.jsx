import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Member from './member';


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
        const token = localStorage.getItem('TOKEN');
        fetch(`https://acetennis.herokuapp.com/members?level=${optionRef.current.value}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then(response => {
            let members = response.filter(member => member.role !== 'admin')
            setMember(members);
            setFilter(members);
            setStatus("");
        })
        .catch(error => {
            // console.log("Client error: " + error);
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
        // console.log(`id ${id}`)
        const selectedMember = members.filter(member => member.id === id);
        navigate("/member_edit", { state:selectedMember });
    }

    function handleDelete(id) {
        const selectedMember = members.filter(member => member.id === id);
        navigate("/member_delete", { state:selectedMember });
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