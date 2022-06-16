
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const formClassName = "container border border-color-light-grey mx-auto p-4 pt-8 grid md:grid-cols-3 gap-4";
const inputClassName = "border border-color-grey text-color-grey rounded-md p-1 mr-8 col-span-2";
const lableClassName = "text-color-grey text-right pr-4";
const errorClassName = "md:col-span-3 text-color-dark-pink text-right";
const buttonClassName = "rounded-md p-3 mr-8 col-span-2 md:col-start-2 bg-color-mint text-white";

export const LoginForm = () => {
    const [status, setStatus] = useState("");
    const {register, handleSubmit, formState: {errors}} = useForm();
    const navigate = useNavigate();

    // useEffect(() => {
    //     const isLogin = sessionStorage.getItem('isLogin');
    //     if(isLogin == 'true') {
    //         navigate("/dashboard", { replace: true });
    //         return;
    //     }
    // }, [])

    const onSubmit = (formData) => {
        setStatus("Loading...");
        
        fetch(`https://acetennis.herokuapp.com/auth/login`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(response => {
            if(response.role === 'admin') {
                setStatus("Login success!")
                // save jwt token
                localStorage.setItem('TOKEN', response.token);
                sessionStorage.setItem('isLogin', 'true');
                sessionStorage.setItem('username', response.username);
                navigate("/dashboard", { replace: true });
            } else {
                setStatus("Only Admin can access!")
            }

        })
        .catch(error => {
            setStatus("Client error: " + error);
        })
    };


    return (
        <>
        <h1 className="p-4 m-4 text-color-mint text-5xl text-center">Log In</h1>
        <form className={formClassName} onSubmit={handleSubmit(onSubmit)}>
            <label className={lableClassName}>Username :</label>
            <input className={inputClassName} {...register("username", {required: true, pattern:/^[a-zA-Z]*$/})} />
            <span className={errorClassName}>{errors.username && "Inavalid  username"}</span>
            <label className={lableClassName}>Password :</label>
            <input type="password" className={inputClassName} {...register("password", {required: true})} />
            <span className={errorClassName}>{errors.password && "Inavalid password"}</span>
            <input type="hidden" value="admin" {...register('role')}/>
            <input className={buttonClassName} type="submit" />
            <span className="text-color-dark-pink md:col-start-2 col-span-2 text-center mr-8">{status}</span>
        </form>
        </>
        );
}

export default LoginForm;