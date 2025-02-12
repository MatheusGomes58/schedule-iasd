import React, { useState, useEffect } from 'react';
import './form.css';

const EventForm = ({ onSave, editing, onCancel, userPrivileges, initialData, departments, events, addDepartment }) => {
    const [formError, setFormError] = useState('');
    const [isValidEvent, setIsValidEvent] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
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
    const [showEndDate, setShowEndDate] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }

        const currentEmail = localStorage.getItem('currentEmail');
        setFormData(prevFormData => ({
            ...prevFormData,
            organizer: currentEmail || prevFormData.organizer,
        }));
    }, [initialData, userPrivileges]);

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

        // Obter o ano e o mês
        const year = new Date().getFullYear(); // Ajuste se necessário
        const monthKey = `${year}-${formData.month.padStart(2, '0')}`; // Formato "YYYY-MM"

        // Verificar se events e events.months existem
        const eventsForMonth = (events && events.months && events.months[monthKey]) ? events.months[monthKey] : [];

        // Verificar sobreposição de eventos
        const isInvalid = eventsForMonth.some(event => {
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
            title: '',
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
        setDepartament('');
    };

    const handleCancel = () => {
        onCancel();
        setFormError('');
        setFormData({
            title: '',
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
        setDepartament('');
    };

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        const newDepartment = formData.newDepartment.trim();

        if (!newDepartment) {
            return;
        }

        try {
            await addDepartment(e, formData, setDepartament, departments, setFormData, setShowModal);
        } catch (error) {
            console.error('Erro ao adicionar departamento:', error);
        }
    };

    const handleCancelAddDepartament = () => {
        setShowModal(false);
        setDepartament('');
        setFormData(prevFormData => ({
            ...prevFormData,
            newDepartment: ''
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <form className="event-form" onSubmit={handleSave}>
                    <input
                        className="titleInput"
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Insira o Titulo do Evento"
                        disabled={!editing}
                    />
                    <div className='form-group-row'>
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
                                disabled={!editing}
                            />
                        </div>

                        {showEndDate && (
                            <div className="form-group">
                                <label htmlFor="endDay">Dia Final</label>
                                <input
                                    type="number"
                                    id="endDay"
                                    name="endDay"
                                    value={formData.endDay}
                                    onChange={handleChange}
                                    min="1"
                                    max="31"
                                    placeholder="Ex: 16"
                                    disabled={!editing}
                                />
                            </div>
                        )}


                        <div className="form-group">
                            <label htmlFor="month">Mês<span className="required">*</span></label>
                            <input
                                type="month"
                                id="month"
                                name="month"
                                value={formData.month}
                                onChange={handleChange}
                                disabled={!editing}
                                required
                            />
                        </div>
                    </div>
                    <button type="button" className="toggle-end-date" onClick={toggleEndDate}>
                        {showEndDate ? 'Remover Dia Final' : 'Adicionar Dia Final'}
                    </button>

                    <div className='form-group-row'>
                        <div className="form-group">
                            <label htmlFor="startTime">Hora de Início<span className="required">*</span></label>
                            <input
                                type="time"
                                id="startTime"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                disabled={!editing}
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
                                disabled={!editing}
                                required
                            />
                        </div>
                    </div>


                    <div className='form-group-row'>
                        <div className="form-group">
                            <label htmlFor="department">Departamento<span className="required">*</span></label>
                            <select
                                id="department"
                                name="department"
                                value={departament ? departament : formData.department}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.value === 'Outro') {
                                        setShowModal(true);
                                    } else {
                                        setDepartament(e.target.value);
                                    }
                                }}
                                disabled={!editing}
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
                                disabled={!editing}
                            />
                        </div>
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
                            placeholder="Localização do evento"
                            disabled={!editing}
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
                            disabled={!editing}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="organizer">Organizador</label>
                        <input
                            type="email"
                            id="organizer"
                            name="organizer"
                            value={formData.organizer}
                            onChange={handleChange}
                            placeholder="Email do organizador"
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        {editing && <button className='btn btn-primary' type="submit">Salvar</button>}
                        <button className='btn btn-secondary' type="button" onClick={handleCancel}>Cancelar</button>
                    </div>

                    {formError && <p className="form-error">{formError}</p>}
                </form>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Adicionar Novo Departamento</h2>
                            <form onSubmit={handleAddDepartment}>
                                <div className="form-group">
                                    <label htmlFor="newDepartment">Novo Departamento</label>
                                    <input
                                        type="text"
                                        id="newDepartment"
                                        name="newDepartment"
                                        value={formData.newDepartment}
                                        onChange={(e) => setFormData(prevFormData => ({
                                            ...prevFormData,
                                            newDepartment: e.target.value
                                        }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <button className='btn btn-primary' type="submit">Adicionar</button>
                                    <button className='btn btn-secondary' type="button" onClick={handleCancelAddDepartament}>Cancelar</button>
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
