import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { app } from './firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth(app);

        // Observa mudanças no estado de autenticação
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user); // Atualiza o estado com o usuário autenticado
        });

        return () => unsubscribe(); // Cleanup ao desmontar o componente
    }, []);

    const handleLogin = async (email, password) => {
        const auth = getAuth(app);

        try {
            // Define persistência como 'local' para manter o login
            await setPersistence(auth, browserLocalPersistence);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return <>{children({ user, handleLogin })}</>;
}

export default AuthProvider;
