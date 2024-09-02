import React from 'react';
import EventRow from './eventRow';
import './eventTable.css';

// Função para converter o formato "YYYY-MM" para "Mês de YYYY"
const formatMonthYear = (monthYear) => {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const [year, month] = monthYear.split('-');
    return `${months[parseInt(month, 10) - 1]} de ${year}`;
};

const EventTable = ({ events, userPrivileges, onDeleteEvent, onSendEvent, onEditEvent, updateEventField, setUserPrivileges }) => {

    const handleUpdateEventField = (eventId, field, value) => {
        updateEventField(eventId, field, value);
    };

    return (
        <div>
            {Object.keys(events).map(monthYear => (
                <div key={monthYear}>
                    <div className='monthBanner'>
                        <h2>{formatMonthYear(monthYear)}</h2>
                    </div>
                    <table>
                        <thead>
                            <tr className='tableHead'>
                                <th>Dia</th>
                                <th>Horário</th>
                                <th>Departamento</th>
                                <th>Responsável</th>
                                <th>Descrição</th>
                                <th>Local</th>
                                <th className='printable-content'>Status do evento</th>
                                <th className='printable-content'>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events[monthYear].map(event => (
                                <EventRow
                                    key={event.id}
                                    event={event}
                                    userPrivileges={userPrivileges}
                                    onDeleteEvent={onDeleteEvent}
                                    onSendEvent={onSendEvent}
                                    onEditEvent={onEditEvent}
                                    updateEventField={handleUpdateEventField}
                                    setUserPrivileges={setUserPrivileges}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default EventTable;
