import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

const formClassName = "container border border-color-light-grey mx-auto p-4 pt-8 grid md:grid-cols-3 gap-4";
const inputClassName = "border border-color-grey text-color-grey rounded-md p-1 mr-8 col-span-2";
const labelClassName = "text-color-grey text-right pr-4";
const errorClassName = "col-span-3 text-color-dark-pink text-right";
const buttonClassName = "rounded-md p-3 mr-8 col-span-2 col-start-2 bg-color-dark-pink text-white";

export const ResultEdit = () => {
    const location = useLocation();
    const matchInfo = location.state;
    const navigate = useNavigate();
    const [match, setMatch] = useState(matchInfo);
    const [status, setStatus] = useState();
    const {register, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }
    }, [])

    const onSubmit = (formData) => {
        const token = localStorage.getItem('TOKEN');
        fetch(`https://acetennis.herokuapp.com/matches/${match.id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(res => {
            navigate('/results', { replace: true });
        })
        .catch(error => {
            // console.log(error);
            // console.log("Fail to delete member");
        });
    };

    return (
        <>
        <h1 className='text-4xl text-color-mint text-center p-4'>Edit Result</h1>
        <form className={formClassName} onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" value={match.id} {...register('id')} />
            <input type="hidden" value={match.eventId} {...register('eventId')} />
            <input type="hidden" value={match.courtNum} {...register('courtNum')} />
            <input type="hidden" value={match.date} {...register('date')} />
            <label className={labelClassName}>Player A1 :</label>
            <input className={inputClassName} defaultValue={match.playerA1} {...register("playerA1", {required: true, maxLength: 30, pattern:/^[a-zA-Z ]*$/})} />
            <span className={errorClassName}>{errors.playerA1 && "Inavalid name"}</span>
            <label className={labelClassName}>Player A2 :</label>
            <input className={inputClassName} defaultValue={match.playerA2} {...register("playerA2", {maxLength: 30, pattern:/^[a-zA-Z ]*$/})} />
            <span className={errorClassName}>{errors.playerA2 && "Inavalid name"}</span>
            <label className={labelClassName}>Player B1 :</label>
            <input className={inputClassName} defaultValue={match.playerB1} {...register("playerB1", {required: true, maxLength: 30, pattern:/^[a-zA-Z ]*$/})} />
            <span className={errorClassName}>{errors.playerB1 && "Inavalid name"}</span>
            <label className={labelClassName}>Player B2 :</label>
            <input className={inputClassName} defaultValue={match.playerB2} {...register("playerB2", {maxLength: 30, pattern:/^[a-zA-Z ]*$/})} />
            <span className={errorClassName}>{errors.playerB2 && "Inavalid name"}</span>
            <label className={labelClassName}>Score A :</label>
            <input className={inputClassName} defaultValue={match.scoreA == null ? 0 : match.scoreA} {...register("scoreA", 
                {required: true, valueAsNumber:true, validate: {
                    positive: v => v >= 0,
                    lessThan30: v => v < 30,
                }})} />
            <span className={errorClassName}>{errors.scoreA && "Inavalid score"}</span>
            <label className={labelClassName}>Score B :</label>
            <input className={inputClassName} defaultValue={match.scoreB == null ? 0 : match.scoreB} {...register("scoreB", {required: true, valueAsNumber:true, validate: {
                    positive: v => v >= 0,
                    lessThan30: v => v < 30,
                }})} />
            <span className={errorClassName}>{errors.scoreB && "Inavalid score"}</span>
            <input className={buttonClassName} type="submit" />
            <span className="text-color-dark-pink md:col-start-2 col-span-2 text-center mr-8">{status}</span>
        </form>
        </>
    );
};

export default ResultEdit;