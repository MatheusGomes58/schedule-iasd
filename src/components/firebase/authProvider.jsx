import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from './auth';
import { app } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Subscribing to authentication state changes
        const unsubscribe = onAuthStateChanged(app.auth(), (user) => {
            setUser(user);
            if (user) {
                navigate('/schedulepage');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <>
            {children({ user, handleLogin })}
        </>
    );
}

export default AuthProvider;
