import React, { useEffect, useState } from 'react';
import EventRow from './eventRow';
import './eventTable.css';

// Função para converter o formato "YYYY-MM" para "Mês de YYYY"
const formatMonthYear = (yearMonthKey) => {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const [year, month] = yearMonthKey.split('-');
    return `${months[parseInt(month, 10) - 1]} de ${year}`;
};

const EventTable = ({ events, userPrivileges, onDeleteEvent, onSendEvent, onEditEvent, updateEventField, setUserPrivileges }) => {
    const [currentYear, setCurrentYear] = useState(null);

    const handleUpdateEventField = (eventId, field, value) => {
        updateEventField(eventId, field, value);
    };

    useEffect(() => {
        const handleScroll = () => {
            const yearHeaders = document.querySelectorAll('.yearHeader');
            let newYear = null;

            yearHeaders.forEach(header => {
                const rect = header.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
                    newYear = header.dataset.year;
                }
            });

            if (newYear !== currentYear) {
                setCurrentYear(newYear);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentYear]);

    return (
        <div>
            {Object.keys(events).map(year => (
                <div key={year} id={year}>
                    {Object.keys(events[year].months).map(monthKey => (
                        <div key={monthKey} id={monthKey}>
                            <div className='monthBanner'>
                                <h2>{formatMonthYear(monthKey)}</h2>
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
                                    {events[year].months[monthKey].map(event => (
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
            ))}
        </div>
    );
};

export default EventTable;
