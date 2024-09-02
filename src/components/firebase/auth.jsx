import { app } from './firebase';

async function signInWithEmailAndPassword(email, password) {
  try {
    const userCredential = await app.auth().signInWithEmailAndPassword(email, password);

    if (userCredential) {
      window.location.href = "./schedulepage";
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Erro de login:', errorCode, errorMessage);
    throw error;
  }
}

async function sendPasswordResetEmail(email) {
  try {
    await app.auth().sendPasswordResetEmail(email);
    console.log('E-mail de redefinição de senha enviado com sucesso.');
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Erro ao enviar e-mail de redefinição de senha:', errorCode, errorMessage);
    throw error;
  }
}

export { signInWithEmailAndPassword, sendPasswordResetEmail };
