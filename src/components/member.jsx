import React from 'react';

const divClassName = "flex justify-between border boder-black rounded-lg m-2 p-2 text-slate-500";
const spanClassName = "w-50 p-2";
const buttonClassName = "w-20 p-2 text-color-dark-pink";

export const Member = (props) => {
    function handleEdit() {
        //    edit level
        props.onEdit(props.id);
    }

    function handleDelete() {
        // delete member
        props.onDelete(props.id);
    }

    return (
        <div className={divClassName}>
            <div className=''>
                <span className={spanClassName}>{props.username}</span>
                <span className={spanClassName}>{props.name}</span>
                <span className={spanClassName}>{props.level}</span>
            </div>
            <div>
                <button id={props.id} className={buttonClassName} onClick={handleEdit}>Edit</button>
                <button id={props.id} className={buttonClassName} onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

export default Member;