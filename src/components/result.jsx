import React from 'react';

export const Result = (props) => {
   
    return (
        <div className='flex flex-col border m-2 p-2'>
            <span className='text-center text-sky-900 bg-sky-100 p-2'>Court {props.courtNum}</span>
            <div className='flex justify-center items-center'>
                <div className='flex flex-col text-stone-600 p-2'>
                    <span>{props.playerA1}</span>
                    <span>{props.playerA2}</span>
                </div> 
                    <span className='text-amber-600 p-3'>{`${props.scoreA} : ${props.scoreB}`}</span>
                <div className='flex flex-col text-stone-600 p-2'>
                    <span>{props.playerB1}</span>
                    <span>{props.playerB2}</span>
                </div>
            </div>
        </div>
    );
};

export default Result;