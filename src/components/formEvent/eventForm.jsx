// EventForm.js
import React, { useState, useEffect } from 'react';
import { db, db2 } from '../firebase/firebase';
import './form.css';

const EventForm = ({ onSave, onCancel, admAcess, userPrivileges, initialData, departments }) => {
    const [formError, setFormError] = useState('');
    const [isValidEvent, setIsValidEvent] = useState(true);
    const [formData, setFormData] = useState({
        day: '',
        month: '',
        startTime: '',
        endTime: '',
        department: '',
        responsible: '',
        location: '',
        description: '',
        organizer: '',
        isValid: '',
        active: '',
        endDay: '', // Adicionando campo para o dia final
    });
    const [leaders, setLeaders] = useState([]);
    const [showEndDate, setShowEndDate] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (initialData) {
                    setFormData(initialData);
                }

                const leadersSnapshot = await db.collection('usePrivileges').get();
                const leadersData = leadersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLeaders(leadersData);

                const currentEmail = localStorage.getItem('currentEmail');
                setFormData(prevFormData => ({
                    ...prevFormData,
                    organizer: currentEmail || prevFormData.organizer,
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the fetchData function

        const unsubscribeLeaders = db.collection('usePrivileges').onSnapshot(snapshot => {
            const leadersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLeaders(leadersData);
        });

        return () => {
            unsubscribeLeaders();
        };
    }, [initialData]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const toggleEndDate = () => {
        setShowEndDate(!showEndDate);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Validar campos
        if (!formData.day || !formData.month || !formData.startTime || !formData.endTime || !formData.department || !formData.responsible || !formData.location || !formData.description) {
            setFormError('Por favor, preencha todos os campos.');
            setIsValidEvent(false);
            return;
        }

        // Verificar se já existe um evento na mesma data
        const eventsRef = db.collection('events');
        const query = eventsRef
            .where('day', '==', formData.day);

        const existingEvents = await query.get();

        const isInvalid = existingEvents.docs.some(doc => {
            const event = doc.data();
            const startTimeOverlap = (formData.startTime >= event.startTime && formData.startTime < event.endTime);
            const endTimeOverlap = (formData.endTime >= event.startTime && formData.endTime <= event.endTime);
            const eventTimeOverLap = (formData.startTime < event.startTime && formData.endTime > event.endTime);

            return startTimeOverlap || endTimeOverlap || eventTimeOverLap;
        });

        if (isInvalid && !initialData) {
            formData.isValid = false;
        } else if(!initialData) {
            formData.isValid = true;
        }

        formData.active = false;
        setFormError('');
        onSave(formData);

        setFormData({
            day: '',
            month: '',
            startTime: '',
            endTime: '',
            department: '',
            responsible: '',
            location: '',
            description: '',
            organizer: '',
            isValid: '',
            active: '',
            endDay: '', // Limpar o dia final ao salvar
        });
    };

    const handleCancel = () => {
        onCancel();
        setFormData({
            day: '',
            month: '',
            startTime: '',
            endTime: '',
            department: '',
            responsible: '',
            location: '',
            description: '',
            organizer: '',
            isValid: '',
            active: '',
            endDay: '', // Limpar o dia final ao cancelar
        });
    };

    return (
        <div className='formBackground'>
            <form className='boxForm' onSubmit={handleSave}>
                <h2>Adicionar Novo Evento</h2>

                <label>
                    Dia Inicial:
                    <input type="number" name="day" value={formData.day} onChange={handleChange} />
                </label>

                {showEndDate && (
                    <label>
                        Dia Final (opcional):
                        <input type="number" name="endDay" value={formData.endDay} onChange={handleChange} />
                    </label>
                )}

                <button type="button" onClick={toggleEndDate}>
                    {showEndDate ? 'Ocultar Dia Final' : 'Adicionar Dia Final'}
                </button>

                <label>
                    Mês:
                    <input type="month" name="month" value={formData.month} onChange={handleChange} />
                </label>

                <label>
                    Hora de Início:
                    <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
                </label>

                <label>
                    Hora de Término:
                    <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
                </label>

                <label>
                    Departamento:
                    <select name="department" value={formData.department} onChange={handleChange}>
                        <option value="">Selecione um departamento</option>
                        {departments.map(dep => (
                            <option value={dep.nome}>
                                {dep.nome}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Responsável:
                    <input type="text" name="responsible" value={formData.responsible} onChange={handleChange} />
                </label>

                <label>
                    Local:
                    <input type="text" name="location" value={formData.location} onChange={handleChange} />
                </label>

                <label>
                    Descrição:
                    <input type="text" name="description" value={formData.description} onChange={handleChange} />
                </label>


                <label>
                    Organizador:
                    <select name="organizer" value={formData.organizer} onChange={handleChange} disabled={!admAcess}>
                        <option value="">Selecione um Lider</option>
                        {leaders.map(dep => (
                            <option value={dep.email}>
                                {dep.email}
                            </option>
                        ))}
                    </select>
                </label>

                {!isValidEvent && <p className="invalid-event-message">Este evento é inválido.</p>}

                <button type="submit">Adicionar Evento</button>
                <button type="button" onClick={handleCancel}>Cancelar</button>
            </form>
        </div>
    );
};

export default EventForm;
