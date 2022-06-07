import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";


const formClassName = "container border border-color-light-grey mx-auto p-4 pt-8 grid md:grid-cols-3 gap-4";
const inputClassName = "border border-color-grey text-color-grey rounded-md p-1 mr-8 col-span-2";
const labelClassName = "text-color-grey text-right pr-4";
const errorClassName = "col-span-3 text-color-dark-pink text-right";
const buttonClassName = "rounded-md p-3 mr-8 col-span-2 col-start-2 bg-color-dark-pink text-white";

export const MemberEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState("");
    const [memberInfo, setMemberInfo] = useState(location.state[0]);
    const {register, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }
    });

    const onSubmit = (formData) => {
        setStatus("Loading...");
        const token = localStorage.getItem('TOKEN');
        fetch(`https://acetennis.herokuapp.com/members`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(res => {
            if(res.status == 200) {
                setStatus("");
                navigate('/members', { replace: true });
            }
        })
        .catch(error => {
            setStatus(error);
            console.log("Fail to update member info");
        });
    };
    
    return (
        <>
        <h1 className='text-4xl text-color-mint text-center p-4'>Edit Member</h1>
        <form className={formClassName} onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" value={memberInfo.id} {...register('id')} />
            <label className={labelClassName}>Fullname :</label>
            <input className={inputClassName} defaultValue={memberInfo.name} {...register("name", {required: true, maxLength: 20, pattern:/^[a-zA-Z ]*$/})} />
            <span className={errorClassName}>{errors.name && "Inavalid name"}</span>
            <label className={labelClassName}>Email :</label>
            <input type="email" className={inputClassName} defaultValue={memberInfo.email} {...register("email", {required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i})} />
            <span className={errorClassName}>{errors.email && "Inavalid email"}</span>
            <label className={labelClassName}>Level :</label>
            <select defaultValue={memberInfo.level} {...register("level", {required: true})}>
                <option value="H">High</option>
                <option value="M">Middle</option>
                <option value="L">Low</option>
            </select>
            <input className={buttonClassName} type="submit" />
            <span className="text-color-dark-pink md:col-start-2 col-span-2 text-center mr-8">{status}</span>
        </form>
        </>
    );
};

export default MemberEdit;