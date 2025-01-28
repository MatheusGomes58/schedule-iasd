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

const EventTable = ({ events, onDeleteEvent, onSendEvent, onEditEvent, updateEventField, setUserPrivileges, searchTerm }) => {
    const [currentYear, setCurrentYear] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState(events);

    // Atualiza os eventos filtrados com base nos privilégios e na busca
    useEffect(() => {
        if (searchTerm === "") {
            // Se o `searchTerm` estiver vazio, exibe os eventos filtrados apenas pelos privilégios
            let filtered = {};

            Object.keys(events).forEach(year => {
                const months = events[year].months;
                const filteredMonths = {};

                Object.keys(months).forEach(monthKey => {
                    const activeEvents = months[monthKey].filter(event => {
                        return setUserPrivileges !== null || event.active === true;
                    });

                    if (activeEvents.length > 0) {
                        filteredMonths[monthKey] = activeEvents;
                    }
                });

                if (Object.keys(filteredMonths).length > 0) {
                    filtered[year] = { months: filteredMonths };
                }
            });

            setFilteredEvents(filtered);
        } else {
            // Caso contrário, filtra pelos privilégios e pelo termo de busca
            let filtered = {};

            Object.keys(events).forEach(year => {
                const months = events[year].months;
                const filteredMonths = {};

                Object.keys(months).forEach(monthKey => {
                    const activeEvents = months[monthKey].filter(event => {
                        const isActive = setUserPrivileges !== null || event.active === true;

                        // Busca nos atributos do evento usando o searchTerm
                        const matchesSearch = event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.responsible?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.location?.toLowerCase().includes(searchTerm.toLowerCase());

                        return isActive && matchesSearch;
                    });

                    if (activeEvents.length > 0) {
                        filteredMonths[monthKey] = activeEvents;
                    }
                });

                if (Object.keys(filteredMonths).length > 0) {
                    filtered[year] = { months: filteredMonths };
                }
            });

            setFilteredEvents(filtered);
        }
    }, [setUserPrivileges, events, searchTerm]);

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
            {Object.keys(filteredEvents).map(year => (
                <div key={year} id={year}>
                    {Object.keys(filteredEvents[year].months).map(monthKey => (
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
                                        {setUserPrivileges && (
                                            <th className='printable-content'>Status do evento</th>
                                        )} {setUserPrivileges && (
                                            <th className='printable-content'>Ações</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEvents[year].months[monthKey].map(event => (
                                        <EventRow
                                            key={event.id}
                                            event={event}
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
