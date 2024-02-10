import React, { useState } from 'react';
import '../assets/css/loginPage.css';
import { signInWithEmailAndPassword } from '../components/firebase/auth';
import logo from '../assets/img/logo.png';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isButtonDisabled = !username.trim() || !password.trim() || loading;

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(username, password);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {error && <p className="error-message">{error}</p>}
      <button className='buttonLogin' disabled={isButtonDisabled} onClick={handleLogin}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </div>
  );
}

export default LoginPage;
