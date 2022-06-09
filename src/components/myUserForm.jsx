import { useForm } from "react-hook-form";
import { useState } from "react";

const formClassName = "container border border-color-light-grey mx-auto p-4 pt-8 grid md:grid-cols-3 gap-4";
const inputClassName = "border border-color-grey text-color-grey rounded-md p-1 mr-8 col-span-2";
const lableClassName = "text-color-grey text-right pr-4";
const errorClassName = "md:col-span-3 text-color-dark-pink text-right";
const buttonClassName = "rounded-md p-3 mr-8 col-span-2 md:col-start-2 bg-color-mint text-white";

export const MyUserForm = () => {
    const [status, setStatus] = useState("");
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const watchPassword = watch(["password", "password_confirmation"]);
    const passwordsMatch = watchPassword[0] == watchPassword[1];

    const onSubmit = (formData) => {
        if(!passwordsMatch) return;

        setStatus("Loading...");
        
        fetch(`https://acetennis.herokuapp.com/auth/signup`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(response => {
            if(response.status == 200) {
                setStatus("Saved!")
                // save jwt token
                localStorage.setItem('TOKEN', res.token);
                sessionStorage.setItem('isLogin', 'true');
            } else {
                setStatus("API Error!")
            }
        })
        .catch(error => {
            setStatus("Client error: " + error);
        })

        // console.log(formData);
    };

    return <form className={formClassName} onSubmit={handleSubmit(onSubmit)}>
        <label className={lableClassName}>Full Name :</label>
        <input className={inputClassName} {...register("name", {required: true, maxLength: 20, pattern:/^[a-zA-Z ]*$/})} />
        <span className={errorClassName}>{errors.name && "Inavalid full name"}</span>
        <label className={lableClassName}>Email :</label>
        <input type="email" className={inputClassName} {...register("email", {required: true})} />
        <span className={errorClassName}>{errors.email && "Inavalid email"}</span>
        <label className={lableClassName}>Username :</label>
        <input className={inputClassName} {...register("username", {required: true, pattern:/^[a-zA-Z]*$/})} />
        <span className={errorClassName}>{errors.username && "Inavalid  username"}</span>
        <label className={lableClassName}>Password :</label>
        <input type="password" className={inputClassName} {...register("password", {required: true})} />
        <span className={errorClassName}>{errors.password && "Inavalid password"}</span>
        <label className={lableClassName}>Confirm Password :</label>
        <input type="password" className={inputClassName} {...register("password_confirmation", {required: true})} />
        <span className={errorClassName}>
            {errors.password_confirmation && "Inavalid password"}
            {!passwordsMatch ? "The password must match!" : ""}
            </span>
        <label className={lableClassName}>Level :</label>
        <select className={inputClassName} {...register("level", {required: true})}>
            <option value="H">Hign</option>
            <option value="M">Middle</option> 
            <option value="L">Low</option>
        </select>
        <label className={lableClassName}>Role :</label>
        <select className={inputClassName} {...register("role", {required: true})}>
            <option value="user">User</option>
            <option value="admin">Admin</option> 
        </select>
        <span className={errorClassName}>{errors.role && "Please select role"}</span>
        <input className={buttonClassName} type="submit" />
        <span className="text-color-dark-pink md:col-start-2 col-span-2 text-center mr-8">{status}</span>
    </form>
};