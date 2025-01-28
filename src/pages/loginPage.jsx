import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/loginPage.css';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from '../components/firebase/auth';
import logo from '../assets/img/logo.png';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  const isButtonDisabled = !username.trim() || !password.trim() || loading;

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(username, password);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      navigate("/schedulepage");
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (!username.trim()) {
        setError('Por favor, insira o seu e-mail.');
        return;
      }
      await sendPasswordResetEmail(username);
      setResetEmailSent(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const closeModal = () => {
    setError(null);
    setResetEmailSent(false);
  };

  return (
    <div className='loginContainer'>
      <div className='loginBox'>
        <div className='boxLogoLogin'>
          <img className='logoLogin' src={logo} alt="Logo" />
        </div>
        <label className='labelLogin'>Username ou E-mail</label>
        <input
          className='inputLogin'
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className='labelLogin'>Insira sua senha</label>
        <input
          className='inputLogin'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='buttonLogin' disabled={isButtonDisabled} onClick={handleLogin}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <button className='forgotPassword' onClick={handlePasswordReset}>
          Esqueceu sua senha?
        </button>
      </div>
      {error && (
        <div className="modal">
          <div className="modalContent">
            <p>{error}</p>
            <button className="closeButton" onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
      {resetEmailSent && (
        <div className="modal">
          <div className="modalContent">
            <p>Um e-mail de recuperação foi enviado para {username}. Verifique sua caixa de entrada.</p>
            <button className="closeButton" onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
