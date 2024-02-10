import { database } from './firebase';

// Exemplo de uso do Realtime Database
const writeToRealtimeDatabase = (path, data) => {
    try {
        database.ref(path).set(data);
        console.log('Dados escritos no Realtime Database com sucesso!');
    } catch (error) {
        console.error('Erro ao escrever dados no Realtime Database:', error.message);
    }
};
// Exporta as funções para uso em outros componentes
export { writeToRealtimeDatabase };
