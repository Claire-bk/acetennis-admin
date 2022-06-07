import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export const Matchtable = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLogin = sessionStorage.getItem('isLogin');
        if(isLogin != 'true') {
            navigate("/", { replace: true });
            return;
        }
        
    });

    return (
        <div>
            
        </div>
    );
};

export default Matchtable;