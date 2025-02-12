import React from 'react';
import { FaEdit, FaTrash, FaPaperPlane, FaTimes } from 'react-icons/fa'; // Importando os ícones
import Switch from '../switch/switch';
import './eventRow.css'; // Certifique-se de que o caminho está correto

const EventRow = ({ event, onDeleteEvent, onSendEvent, onEditEvent, updateEventField, setUserPrivileges }) => {

    const handleToggle = (field) => {
        const newValue = !event[field];
        updateEventField(event.id, field, newValue);
    };

    const handleClassName = (event) => {
        let className = "";
        if (event.active && event.isValid && event.sended) {
            className = 'sended-event-aprovated';
        } else if (event.active && event.isValid && !event.sended) {
            className = 'inactive-event-aprovated';
        } else if (event.active && !event.isValid) {
            className = 'invalid-event-aprovated';
        } else if (!event.active && event.isValid && event.sended) {
            className = 'sended-event';
        } else if (!event.active && event.isValid && !event.sended) {
            className = 'inactive-event';
        } else if (!event.active && !event.isValid) {
            className = 'invalid-event';
        }
        return className;
    }

    const getSwitches = (event, setUserPrivileges) => {
        const switches = [];

        if ((setUserPrivileges.adm || (setUserPrivileges.aprovation && event.organizer !== setUserPrivileges.email && !event.active)) &&
            !setUserPrivileges.edit) {
            switches.push({
                label: event.active ? 'Aprovado' : 'Em Aprovação',
                status: event.active,
                onToggle: () => handleToggle('active')
            });
        }

        if ((setUserPrivileges.adm || (setUserPrivileges.sended && !event.active)) &&
            !setUserPrivileges.edit) {
            switches.push({
                label: event.sended ? 'Enviado' : 'Pendente',
                status: event.sended,
                onToggle: () => handleToggle('sended')
            });
        }

        if ((setUserPrivileges.adm || (setUserPrivileges.valid && !event.active)) &&
            !setUserPrivileges.edit) {
            switches.push({
                label: event.isValid ? 'Sem Conflitos' : 'Com Conflitos',
                status: event.isValid,
                onToggle: () => handleToggle('isValid')
            });
        }

        return switches;
    };

    const rendererStatus = (event, setUserPrivileges) => {
        var switches = getSwitches(event, setUserPrivileges);

        if (switches.length > 0) {
            return getSwitches(event, setUserPrivileges).map((sw, index) => (
                <Switch key={index} label={sw.label} status={sw.status} onToggle={sw.onToggle} />
            ));
        } else {
            return event.active ? 'Aprovado' : event.sended ? 'Enviado e aguaradndo aprovação' : 'Em análise'
        }
    }

    const getEventActionButtons = (event, user) => {
        const buttons = [];

        // Adiciona o botão de editar se o evento não estiver aprovado ou se o usuário for administrador
        if ((!event.active && !event.sended) && (event.organizer === user.email || setUserPrivileges.adm)) {
            buttons.push(
                <button key="edit" className='button button-edit' onClick={() => onEditEvent(event, true)}>
                    <FaEdit /> Editar
                </button>
            );
        }

        // Adiciona o botão de deletar se o evento não estiver aprovado
        if ((event.active || event.sended) && (event.organizer === user.email || setUserPrivileges.adm)) {
            buttons.push(
                <button key="cancel" className='button button-cancel' onClick={() => handleToggle(event.active ? 'active' : 'sended')}>
                    <FaTimes /> Cancelar
                </button>
            );
        } else if (event.organizer === user.email || setUserPrivileges.adm) {
            buttons.push(
                <button key="delete" className='button button-delete' onClick={() => onDeleteEvent(event.id)}>
                    <FaTrash /> Deletar
                </button>
            );
        }

        // Adiciona o botão de enviar se o evento estiver aprovado e ainda não tiver sido enviado
        if ((!event.active && !event.sended) && (event.organizer === user.email || setUserPrivileges.adm)) {
            buttons.push(
                <button key="send" className='button button-send' onClick={() => onSendEvent(event.id)}>
                    <FaPaperPlane /> Enviar
                </button>
            );
        }

        return buttons;
    };

    return (
        <tr id={event.id} className={handleClassName(event)} style={{ cursor: "pointer" }}>
            <td onClick={() => onEditEvent(event, false)}>
                {event.day}{event.endDay ? ' - ' + event.endDay : ''}
            </td>
            <td onClick={() => onEditEvent(event, false)}>
                {event.startTime} - {event.endTime}
            </td>
            <td onClick={() => onEditEvent(event, false)}>{event.title}</td>
            <td onClick={() => onEditEvent(event, false)}>{event.responsible}</td>
            <td onClick={() => onEditEvent(event, false)}>{event.location}</td>

            {/* Últimas células NÃO CLICÁVEIS */}
            {setUserPrivileges && (
                <td className='printable-content'>
                    {rendererStatus(event, setUserPrivileges)}
                </td>
            )}
            {setUserPrivileges && (
                <td className='printable-content'>
                    {getEventActionButtons(event, setUserPrivileges).map((button, index) => (
                        <span key={index}>{button}</span>
                    ))}
                </td>
            )}
        </tr>

    );

};

export default EventRow;