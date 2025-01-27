import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from './auth';
import { app } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserPrivileges } from './firebaseUtils';

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userPrivileges, setUserPrivileges] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(app.auth(), async (user) => {
            setUser(user);
            if (user) {
                getUserPrivileges(setUserPrivileges);
            }
        });
    
        return () => unsubscribe();
    }, []);

    const handleLogin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <>
            {children({ user, handleLogin, userPrivileges })}
        </>
    );
}

export default AuthProvider;
