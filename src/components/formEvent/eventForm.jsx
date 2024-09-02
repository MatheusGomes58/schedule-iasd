// EventForm.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
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
        endDay: '',
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

        fetchData();

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

        // Validação dos campos
        if (!formData.day || !formData.month || !formData.startTime || !formData.endTime || !formData.department || !formData.responsible || !formData.location || !formData.description) {
            setFormError('Por favor, preencha todos os campos obrigatórios.');
            setIsValidEvent(false);
            return;
        }

        // Verificar se já existe um evento na mesma data
        const eventsRef = db.collection('events');
        const query = eventsRef.where('day', '==', formData.day);

        const existingEvents = await query.get();

        const isInvalid = existingEvents.docs.some(doc => {
            const event = doc.data();
            const startTimeOverlap = (formData.startTime >= event.startTime && formData.startTime < event.endTime);
            const endTimeOverlap = (formData.endTime > event.startTime && formData.endTime <= event.endTime);
            const eventTimeOverLap = (formData.startTime < event.startTime && formData.endTime > event.endTime);

            return startTimeOverlap || endTimeOverlap || eventTimeOverLap;
        });

        if (isInvalid && !initialData) {
            setFormError('O horário selecionado conflita com outro evento.');
            setIsValidEvent(false);
            return;
        }

        formData.isValid = !isInvalid;
        formData.active = false;
        setFormError('');
        onSave(formData);

        // Resetar o formulário
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
            endDay: '',
        });
    };

    const handleCancel = () => {
        onCancel();
        setFormError('');
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
            endDay: '',
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <form className="event-form" onSubmit={handleSave}>
                    <h2>Adicionar Novo Evento</h2>

                    <div className="form-group">
                        <label htmlFor="day">Dia Inicial<span className="required">*</span></label>
                        <input
                            type="number"
                            id="day"
                            name="day"
                            value={formData.day}
                            onChange={handleChange}
                            required
                            min="1"
                            max="31"
                            placeholder="Ex: 15"
                        />
                    </div>

                    {showEndDate && (
                        <div className="form-group">
                            <label htmlFor="endDay">Dia Final (opcional)</label>
                            <input
                                type="number"
                                id="endDay"
                                name="endDay"
                                value={formData.endDay}
                                onChange={handleChange}
                                min="1"
                                max="31"
                                placeholder="Ex: 16"
                            />
                        </div>
                    )}

                    <button type="button" className="toggle-end-date" onClick={toggleEndDate}>
                        {showEndDate ? 'Remover Dia Final' : 'Adicionar Dia Final'}
                    </button>

                    <div className="form-group">
                        <label htmlFor="month">Mês<span className="required">*</span></label>
                        <input
                            type="month"
                            id="month"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="startTime">Hora de Início<span className="required">*</span></label>
                        <input
                            type="time"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endTime">Hora de Término<span className="required">*</span></label>
                        <input
                            type="time"
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="department">Departamento<span className="required">*</span></label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione um departamento</option>
                            {departments.map(dep => (
                                <option key={dep.id} value={dep.nome}>
                                    {dep.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="responsible">Responsável<span className="required">*</span></label>
                        <input
                            type="text"
                            id="responsible"
                            name="responsible"
                            value={formData.responsible}
                            onChange={handleChange}
                            required
                            placeholder="Nome do responsável"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Local<span className="required">*</span></label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="Local do evento"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descrição<span className="required">*</span></label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Descrição do evento"
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="organizer">Organizador<span className="required">*</span></label>
                        <select
                            id="organizer"
                            name="organizer"
                            value={formData.organizer}
                            onChange={handleChange}
                            disabled={!admAcess}
                            required
                        >
                            <option value="">Selecione um líder</option>
                            {leaders.map(leader => (
                                <option key={leader.id} value={leader.email}>
                                    {leader.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {!isValidEvent && <p className="error-message">{formError}</p>}
                    {formError && isValidEvent && <p className="error-message">{formError}</p>}

                    <div className="form-actions">
                        <button type="submit" className="save-button">Salvar</button>
                        <button type="button" className="cancel-button" onClick={handleCancel}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventForm;
