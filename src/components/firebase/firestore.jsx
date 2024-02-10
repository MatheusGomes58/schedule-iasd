import { db } from './firebase';

// Adiciona um documento a uma coleção
const addDocumentTodb = async (collection, data) => {
    try {
        await db.collection(collection).add(data);
        console.log('Documento adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar documento:', error.message);
    }
};

// Consulta documentos em uma coleção
const getDocumentsFromdb = async (collection) => {
    try {
        const snapshot = await db.collection(collection).get();
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
const updateDocumentIndb = async (collection, docId, newData) => {
    try {
        await db.collection(collection).doc(docId).update(newData);
        console.log('Documento atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar documento:', error.message);
    }
};

// Exclui um documento existente
const deleteDocumentFromdb = async (collection, docId) => {
    try {
        await db.collection(collection).doc(docId).delete();
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
