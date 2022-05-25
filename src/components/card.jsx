import React from 'react';

const Card = (props) => {
    const { name, number, icon } = props;
   const cardClass = 'card md:flex flex-row container border boder-black rounded-lg p-4 m-8 hover:cursor-pointer';
   const cardNumber = 'pl-2 font-sans text-blue-400 text-4xl';
   const cardName = 'pl-2 font-sans text-slate-400 text-base';
   const iconClass = 'basis-1/3 pt-3 text-slate-500 text-4xl fa-solid ' + icon;

   function handleClick() {
       props.onClick(name);
   }

    return (
        <>
        <div className={cardClass} onClick={handleClick}>
            <div className="basis-2/3">
                <div className={cardNumber}>{number}</div>
                <div className={cardName}>{name}</div>
            </div>
            <i className={iconClass}></i>
        </div>
        </>
       );
};

export default Card;