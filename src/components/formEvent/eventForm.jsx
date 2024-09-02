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
        newDepartment: '',
        responsible: '',
        location: '',
        description: '',
        organizer: '',
        isValid: '',
        active: '',
        endDay: '',
    });
    const [departament, setDepartament] = useState('');
    const [leaders, setLeaders] = useState([]);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
            newDepartment: '',
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
            newDepartment: '',
            responsible: '',
            location: '',
            description: '',
            organizer: '',
            isValid: '',
            active: '',
            endDay: '',
        });
    };

    const handleCancelAddDepartament = () => {
        setShowModal(false);
        setDepartament('Selecione um departamento');
    }

    const handleAddDepartment = async (e) => {
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
                departments = updatedDepartments; // Atualiza a lista de departamentos no componente
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
                            value={departament? departament : formData.department}
                            onChange={(e) => {
                                handleChange(e);
                                if (e.target.value === 'Outro') {
                                    setShowModal(true);
                                }else{
                                    setDepartament(e.target.value);
                                }
                            }}
                            required
                        >
                            <option value="">Selecione um departamento</option>
                            {departments.map(dep => (
                                <option key={dep.id} value={dep.nome}>
                                    {dep.nome}
                                </option>
                            ))}
                            <option value="Outro">Outro</option>
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
                        <label htmlFor="location">Localização<span className="required">*</span></label>
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
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="organizer">Organizador<span className="required">*</span></label>
                        <input
                            type="text"
                            id="organizer"
                            name="organizer"
                            value={formData.organizer}
                            onChange={handleChange}
                            required
                            placeholder="Email do organizador"
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">Salvar</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                    </div>

                    {formError && <div className="form-error">{formError}</div>}
                </form>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Adicionar Novo Departamento</h2>
                            <form onSubmit={handleAddDepartment}>
                                <div className="form-group">
                                    <label htmlFor="newDepartment">Nome do Novo Departamento<span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="newDepartment"
                                        name="newDepartment"
                                        value={formData.newDepartment}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nome do departamento"
                                    />
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">Adicionar</button>
                                    <button type="button" className="btn btn-secondary" onClick={handleCancelAddDepartament}>Fechar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventForm;
