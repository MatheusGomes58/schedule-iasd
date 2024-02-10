import { storage } from './firebase';

// Exemplo de uso do Storage
const uploadFileToStorage = async (file, path) => {
    try {
        await storage.ref(path).put(file);
        console.log('Arquivo enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar arquivo:', error.message);
    }
};
// Exporta as funções para uso em outros componentes
export { uploadFileToStorage };

