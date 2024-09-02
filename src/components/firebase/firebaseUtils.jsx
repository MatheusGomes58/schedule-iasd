import { db, auth } from './firebase';
import { doc, updateDoc, collection, getDocs, addDoc, query, where } from 'firebase/firestore'; // Atualize conforme sua configuração
import { signOut } from 'firebase/auth';

export const logoutFromFirebase = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    }
};

export const getDepartmentsFromFirestore = async (setDepartments) => {
    try {
        const departmentsCollection = collection(db, 'departamento'); // Substitua 'departments' pelo nome da sua coleção
        const departmentsSnapshot = await getDocs(departmentsCollection);
        const departmentsList = departmentsSnapshot.docs.map(doc => doc.data());
        setDepartments(departmentsList);
    } catch (error) {
        console.error("Error fetching departments: ", error);
    }
};

export const getUserPrivileges = async (setUserPrivileges) => {
    try {
        const user = auth.currentUser;

        if (user) {
            const userEmail = user.email;
            const userPrivilegesQuery = query(
                collection(db, 'usePrivileges'), // Use 'usePrivileges' como nome da coleção
                where('email', '==', userEmail)
            );
            const userPrivilegesSnapshot = await getDocs(userPrivilegesQuery);

            if (!userPrivilegesSnapshot.empty) {
                const userPrivilegesData = userPrivilegesSnapshot.docs[0].data();
                setUserPrivileges(userPrivilegesData);
            } else {
                const newUserPrivilegesData = {
                    email: userEmail,
                    acess: false,
                    adm: false,
                    valid: false,
                    sended: false,
                    aprovation: false,
                };
                await addDoc(collection(db, 'usePrivileges'), newUserPrivilegesData);
                setUserPrivileges(newUserPrivilegesData);
            }
        } else {
            console.error('Nenhum usuário autenticado encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar ou cadastrar privilégios do usuário:', error);
    }
};


export const getEventsFromFirestore = (setEvents) => {
    return db.collection('events').onSnapshot(snapshot => {
        const eventsData = {};
        snapshot.docs.forEach(doc => {
            const eventData = {
                id: doc.id,
                ...doc.data()
            };
            if (!eventsData[eventData.month]) {
                eventsData[eventData.month] = [];
            }
            eventsData[eventData.month].push(eventData);
        });
        setEvents(eventsData);
    });
};

export const addDocumentTodb = async (collection, data) => {
    try {
        await db.collection(collection).add(data);
    } catch (error) {
        console.error('Erro ao adicionar documento:', error);
    }
};

export const updateDocumentIndb = async (collection, id, data) => {
    try {
        await db.collection(collection).doc(id).update(data);
    } catch (error) {
        console.error('Erro ao atualizar documento:', error);
    }
};

export const deleteDocumentFromdb = async (collection, id) => {
    try {
        await db.collection(collection).doc(id).delete();
    } catch (error) {
        console.error('Erro ao deletar documento:', error);
    }
};

export const updateEventField = async (eventId, field, value) => {
    const eventDoc = doc(db, 'events', eventId);
    try {
        await updateDoc(eventDoc, {
            [field]: value,
        });
        console.log(`${field} atualizado com sucesso para ${value}`);
    } catch (error) {
        console.error('Erro ao atualizar o evento:', error);
    }
};
