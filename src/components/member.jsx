import React from 'react';

const liClassName = "sm:flex border boder-black rounded-lg m-2 p-2 text-slate-500";
const spanClassName = "flex-none w-32 p-2";
const buttonClassName = "flex-none w-20 p-2";

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
        <li className={liClassName}>
            <span className={spanClassName}>{props.username}</span>
            <span className={spanClassName}>{props.name}</span>
            <span className={spanClassName}>{props.level}</span>
            {/* <button id={props.id} className={buttonClassName} onClick={handleEdit}>Edit</button> */}
            {/* <button id={props.id} className={buttonClassName} onClick={handleDelete}>Delete</button> */}
        </li>
    );
};

export default Member;