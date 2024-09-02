import { db } from './firebase'; // Certifique-se de que 'db' está sendo exportado corretamente no arquivo firebase

// Adiciona um documento a uma coleção
const addDocumentTodb = async (collectionName, data) => {
    try {
        await db.collection(collectionName).add(data);
        console.log('Documento adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar documento:', error.message);
    }
};

// Consulta documentos em uma coleção
const getDocumentsFromdb = async (collectionName) => {
    try {
        const snapshot = await db.collection(collectionName).get();
        const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return documents;
    } catch (error) {
        console.error('Erro ao obter documentos:', error.message);
        return [];
    }
};

// Atualiza um documento existente
const updateDocumentIndb = async (collectionName, docId, newData) => {
    try {
        await db.collection(collectionName).doc(docId).update(newData);
        console.log('Documento atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar documento:', error.message);
    }
};

// Exclui um documento existente
const deleteDocumentFromdb = async (collectionName, docId) => {
    try {
        await db.collection(collectionName).doc(docId).delete();
        console.log('Documento excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir documento:', error.message);
    }
};

export { 
    addDocumentTodb,
    getDocumentsFromdb,
    updateDocumentIndb,
    deleteDocumentFromdb
};
