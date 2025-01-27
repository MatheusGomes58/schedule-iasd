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
    var newUserPrivilegesData;
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
                newUserPrivilegesData = {
                    email: userEmail,
                    acess: false,
                    adm: false,
                    valid: false,
                    sended: false,
                    aprovation: false,
                };
                await addDoc(collection(db, 'usePrivileges'), newUserPrivilegesData);
            }
        } else {
            console.log('Nenhum usuário autenticado encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar ou cadastrar privilégios do usuário:', error);
    }

    setUserPrivileges(newUserPrivilegesData)
};

export const getUser = async (user) => {
    try {
        user = auth.currentUser;
    } catch (error) {
        console.error('Nenhum usuário autenticado encontrado.');
        user = false;
    }
};


export const getEventsFromFirestore = (setEvents) => {
    return db.collection('events').onSnapshot(snapshot => {
        const eventsData = {};

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const day = String(data.day).padStart(2, '0'); // Garantir que day seja uma string
            const month = data.month; // Assume que month já está no formato "YYYY-MM"

            // Ajustar o mês (subtrair 1) e criar a data
            const [year, monthNumber] = month.split('-');
            const dateString = `${year}-${monthNumber}-${day}`;
            const date = new Date(Date.parse(dateString));

            // Subtrair 1 do mês para ajustar
            date.setMonth(date.getMonth() - 1);

            const eventData = {
                id: doc.id,
                ...data,
                date
            };

            // Ajustar o formato para year e months
            if (!eventsData[year]) {
                eventsData[year] = {
                    months: {}
                };
            }

            const monthKey = `${year}-${monthNumber}`;
            if (!eventsData[year].months[monthKey]) {
                eventsData[year].months[monthKey] = [];
            }

            eventsData[year].months[monthKey].push(eventData);
        });

        // Ordenar os eventos dentro de cada mês pela data completa
        for (const year in eventsData) {
            for (const monthKey in eventsData[year].months) {
                eventsData[year].months[monthKey].sort((a, b) => a.date - b.date);
            }
        }

        // Transformar o objeto eventsData em um formato final
        const sortedEvents = Object.keys(eventsData).reduce((acc, year) => {
            acc[year] = {
                months: Object.keys(eventsData[year].months).sort().reduce((monthAcc, monthKey) => {
                    monthAcc[monthKey] = eventsData[year].months[monthKey];
                    return monthAcc;
                }, {})
            };
            return acc;
        }, {});

        setEvents(sortedEvents);
    });
};

export const addDepartment = async (e, formData, setDepartament, departments, setFormData, setShowModal) => {
    e.preventDefault();
    if (formData.newDepartment.trim()) {
        try {
            await db.collection('departamento').add({ nome: formData.newDepartment });
            console.log('Novo departamento adicionado');
            // Atualizar lista de departamentos se necessário
            setDepartament(formData.newDepartment);
            const departamentosSnapshot = await db.collection('departamento').get();
            const updatedDepartments = departamentosSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Atualiza a lista de departamentos no componente
            departments = updatedDepartments;
            setFormData(prevFormData => ({
                ...prevFormData,
                newDepartment: ''
            }));
            setShowModal(false); // Fechar modal após adicionar
        } catch (error) {
            console.error('Erro ao adicionar departamento:', error);
        }
    }
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
