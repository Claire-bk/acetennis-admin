import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const labelClassName = 'text-xl mr-2 p-2 w-32 text-center inline-block text-slate-500';
const spanClassName = 'text-xl p-2 inline-block text-slate-500';
const btnClassName = 'm-4 ml-4 p-2 border-none rounded-md bg-color-dark-pink text-white w-40';

 export const MemberDelete = () => {
    const location = useLocation();
    const navigation = useNavigate()
    const [memberInfo, setMemberInfo] = useState(location.state[0]);

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }
    });

    function handleDelete() {
        const token = localStorage.getItem('TOKEN');
        fetch(`https://acetennis.herokuapp.com/members/${memberInfo.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        })
        .then(res => {
            navigation('/members', { replace: true })
        })
        .catch(error => {
            console.log(error);
            console.log("Fail to delete member");
        });
    }

    return (
        <div className='flex flex-col items-center border m-2'>
            <h1 className='text-4xl mt-2 p-2 text-color-mint'>Delete Member</h1>
            <div>
                <span className={labelClassName}>Username</span>
                <span className={spanClassName}>{memberInfo.username}</span><br />
                <span className={labelClassName}>Fullname</span>
                <span className={spanClassName}>{memberInfo.name}</span><br />
                <span className={labelClassName}>Email</span>
                <span className={spanClassName}>{memberInfo.email}</span><br />
                <span className={labelClassName}>Level</span>
                <span className={spanClassName}>{memberInfo.level}</span><br />
            </div>
            <button className={btnClassName} onClick={handleDelete}>Confirm Delete</button>
        </div>
    );
};

export default MemberDelete;