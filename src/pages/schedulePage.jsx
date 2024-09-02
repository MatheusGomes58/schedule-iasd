import React, { useState, useEffect } from 'react';
import Switch from '../components/switch/switch';
import SearchBar from '../components/searchBar/searchBar';
import { addMonths, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { db, db2 } from '../components/firebase/firebase';
import {
  addDocumentTodb,
  updateDocumentIndb,
  deleteDocumentFromdb
} from '../components/firebase/firestore';
import EventForm from '../components/formEvent/eventForm';
import '../assets/css/schedulePage.css';

const SchedulePage = () => {
  const [events, setEvents] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState(null);
  const [admPrivileges, setAdmPrivileges] = useState(null);
  const [validPrivileges, setValidPrivileges] = useState(null);
  const [sendedPrivileges, setSendedPrivileges] = useState(null);
  const [aprovationPrivileges, setAprovationPrivileges] = useState(null);
  const [editPrivileges, setEditPrivileges] = useState(null);
  const [printing, setPrinting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);


  useEffect(() => {

    const fetchData = async () => {
      try {
        const departamentoSnapshot = await db2.collection('departamento').get();
        const departmentData = departamentoSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDepartments(departmentData);
      } catch (e) {
        console.error('erro : ' + e)
      }
    }

    const getUserPrivileges = async () => {
      try {
        const userEmail = localStorage.getItem('currentEmail');
        const userPrivilegesRef = await db.collection('usePrivileges').where('email', '==', userEmail).get();

        if (!userPrivilegesRef.empty) {
          const userPrivilegesData = userPrivilegesRef.docs[0].data();
          setUserPrivileges(userPrivilegesData.acess);
          setAdmPrivileges(userPrivilegesData.adm);
          setValidPrivileges(userPrivilegesData.valid);
          setSendedPrivileges(userPrivilegesData.sended);
          setAprovationPrivileges(userPrivilegesData.aprovation);
          setEditPrivileges(userPrivilegesData.edit);
        } else {
          const newUserPrivilegesData = {
            email: userEmail,
            acess: false,
            adm: false,
            valid: false,
            sended: false,
            aprovation: false,
          };

          await db.collection('usePrivileges').add(newUserPrivilegesData);
          setUserPrivileges(false);
          setAdmPrivileges(false);
          setValidPrivileges(false);
          setSendedPrivileges(false);
          setAprovationPrivileges(false);
        }
      } catch (error) {
        console.error('Erro ao buscar ou cadastrar privilégios do usuário:', error);
      }
    };


    const getEventsFromFirestore = () => {
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

          const dayNumber = Number(eventData.day);

          if (eventData.startTime && typeof eventData.startTime === 'string') {
            const hourMatch = eventData.startTime.match(/^(\d{1,2}):(\d{2})$/);

            if (hourMatch) {
              const [, hours, minutes] = hourMatch;
              const timeInMinutes = parseInt(hours) * 60 + parseInt(minutes);

              if (!isNaN(dayNumber)) {
                eventData.day = dayNumber;
                eventData.timeInMinutes = timeInMinutes;
                eventsData[eventData.month].push(eventData);
              } else {
                console.error(`Invalid 'day' value for event with id ${eventData.id}`);
              }
            } else {
              console.error(`Invalid 'hour' format for event with id ${eventData.id}`);
            }
          } else {
            console.error(`Missing or invalid 'hour' value for event with id ${eventData.id}`);
          }
        });

        const sortedMonths = Object.keys(eventsData).sort();

        sortedMonths.forEach(month => {
          eventsData[month].sort((a, b) => {
            const aDay = !isNaN(a.day) ? a.day : Number(a.day) || 0;
            const bDay = !isNaN(b.day) ? b.day : Number(b.day) || 0;

            if (aDay !== bDay) {
              return aDay - bDay;
            } else {
              return a.timeInMinutes - b.timeInMinutes;
            }
          });
        });

        const orderedEventsData = {};
        sortedMonths.forEach(month => {
          orderedEventsData[month] = eventsData[month];
        });

        const filteredData = filterEvents(orderedEventsData, searchTerm);
        setEvents(filteredData);
      });
    };

    fetchData();

    const unsubscribeDepartamento = db2.collection('departamento').onSnapshot(snapshot => {
      const departmentData = snapshot.docs.map(doc => {
        const data = doc.data();
        if (data.nome !== 'Todos' && Object.keys(data.nome).length > 0) {
          return {
            id: doc.id,
            ...data
          };
        }
        return null;
      });

      setDepartments(departmentData.filter(department => department !== null));
    });


    getUserPrivileges();
    const unsubscribe = getEventsFromFirestore();

    return () => {
      unsubscribeDepartamento();
      unsubscribe();
    };
  }, [searchTerm]);


  const filterEvents = (eventsData, term) => {
    const filteredData = {};
    const upperCaseTerm = term.toUpperCase();

    Object.keys(eventsData).forEach(month => {
      var formattedMonth = format(addMonths(new Date(`${month}-01`), 1), 'MMMM yyyy', { locale: ptBR });
      formattedMonth = formattedMonth.toString().toUpperCase();


      const filteredMonthEvents = eventsData[month].filter(event =>
      (
        formattedMonth.includes(upperCaseTerm) ||
        event.day.toString().includes(upperCaseTerm) ||
        event.startTime.toUpperCase().includes(upperCaseTerm) ||
        event.department.toUpperCase().includes(upperCaseTerm) ||
        event.responsible.toUpperCase().includes(upperCaseTerm) ||
        event.description.toUpperCase().includes(upperCaseTerm) ||
        event.location.toUpperCase().includes(upperCaseTerm)
      )
      );

      if (filteredMonthEvents.length > 0) {
        filteredData[month] = filteredMonthEvents;
      }

    });

    return filteredData;
  };



  const handleAddEvent = async (newEventData) => {
    await addDocumentTodb('events', newEventData);
    setShowForm(false);
    setEditing(false);
  };

  const handleUpdateEvent = async (eventId, newData) => {
    if (!newData.active) {
      newData.active = false;
    }

    await updateDocumentIndb('events', eventId, newData);
    setShowForm(false);
    setSelectedEvent(null);
    setEditing(false);
  };

  const handleDeleteEvent = async (eventId) => {
    await deleteDocumentFromdb('events', eventId);
  };

  const handleEditEvent = (event) => {
    setEditing(true);
    setSelectedEvent(event);
    setShowForm(true);
  };


  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedEvent(null);
    setEditing(false);
  };

  const handleCancel = () => {
    setSearchBarVisible(!searchBarVisible)
  }

  const handleSearch = (term) => {
    console.log('Search Term:', term);
    setSearchTerm(term);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handlePrint = () => {
    setPrinting(true);
    window.print();
    setPrinting(false);
  };


  const updateActive = async (id, newStatus) => {
    await handleUpdateEvent(id, { active: newStatus });
  };

  const updateValidad = async (id, newStatus) => {
    await handleUpdateEvent(id, { isValid: newStatus });
  };

  const updateSended = async (id, newStatus) => {
    await handleUpdateEvent(id, { sended: newStatus });
  };

  return (
    <div>
      {Object.keys(events).map(month => (
        <div key={month}>
          <div className='monthBanner'>
            <h2>{format(addMonths(new Date(`${month}-01`), 1), 'MMMM yyyy', { locale: ptBR }).toUpperCase()}</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Dia</th>
                <th>Horário</th>
                <th>Departamento</th>
                <th>Responsável</th>
                <th>Descrição</th>
                <th>Local</th>
                <th className='printable-content'>Status do evento</th>
                {!editPrivileges && <th className='printable-content'>Ações</th>}

              </tr>
            </thead>
            <tbody>
              {events[month].map(event => (
                (userPrivileges || event.organizer === localStorage.getItem('currentEmail') || event.sended || editPrivileges) &&
                <tr
                  key={event.id}
                  className={`
                    ${event.active ? '' : (!event.isValid ? 'invalid-event' : !event.sended ? 'inactive-event' : 'sended-event')}
                  `}
                >
                  <td className='limited-column'>{event.day} {event.endDay ? ' á ' + event.endDay : ''}</td>
                  <td className='limited-column'>{event.startTime} á {event.endTime}</td>
                  <td className='limited-column'>{event.department}</td>
                  <td className='limited-column'>{event.responsible}</td>
                  <td className='limited-column'>{event.description}</td>
                  <td className='limited-column'>{event.location}</td>
                  {(admPrivileges || validPrivileges || sendedPrivileges || aprovationPrivileges) && !editPrivileges &&
                    (<td className='printable-content'>
                      {(admPrivileges || aprovationPrivileges) && (
                        <Switch label={event.active ? 'Aprovado' : 'Em Aprovação'} status={event.active} onToggle={(id, newStatus) => updateActive(id, newStatus)} id={event.id} />
                      )}
                      {(admPrivileges || (validPrivileges && !event.active)) && (
                        <Switch label={event.isValid ? 'Sem Conflitos' : 'Com Conflitos'} status={event.isValid} onToggle={(id, newStatus) => updateValidad(id, newStatus)} id={event.id} />
                      )}
                      {(admPrivileges || (sendedPrivileges && !event.active)) && (
                        <Switch label={event.sended ? 'Enviado' : 'Pendente'} status={event.sended} onToggle={(id, newStatus) => updateSended(id, newStatus)} id={event.id} />
                      )}
                    </td>
                    )}
                  {(!admPrivileges && !validPrivileges && !sendedPrivileges && !aprovationPrivileges) &&
                    (<td className='printable-content'>
                      {event.active ? 'Aprovado pela comissão' : event.sended ? 'Enviado e aguaradndo aprovação' : 'Em análise pelo departamento'}
                    </td>
                    )}
                  {!editPrivileges && <td className='printable-content'>
                    {!event.sended && (
                      <button
                        className='button-icon'
                        onClick={() => handleEditEvent(event)}
                        disabled={!userPrivileges && event.organizer !== localStorage.getItem('currentEmail')}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                    <button
                      className='button-icon'
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={!admPrivileges && event.organizer !== localStorage.getItem('currentEmail')}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                    {!event.sended && (
                      <button
                        className='button-icon'
                        onClick={() => updateSended(event.id, !event.sended)}
                        disabled={!userPrivileges && event.organizer !== localStorage.getItem('currentEmail')}
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    )}
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      ))}
      <div className='addFunctions printable-content'>
        {searchBarVisible && <SearchBar onSearch={setSearchTerm} suggestions={departments} onCancel={handleCancel} />}
        {showForm && (
          <EventForm
            key={selectedEvent ? selectedEvent.id : 'newEvent'} // Add this key prop
            onSave={editing ? (data) => handleUpdateEvent(selectedEvent.id, data) : handleAddEvent}
            onCancel={handleCancelForm}
            admAcess={admPrivileges}
            departments={departments}
            initialData={selectedEvent}
          />
        )}
      </div>
      {!printing && (
        <div className='addEvent printable-content'>
          <button className='btnCircle' onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
          <button className='btnCircle' onClick={handlePrint}>
            <i className="fas fa-print"></i>
          </button>
          <button className='btnCircle' onClick={() => setSearchBarVisible(!searchBarVisible)}>
            <i className="fas fa-search"></i>
          </button>
          {!editPrivileges && (
            <button className='btnCircle' onClick={() => setShowForm(!showForm)}>
              <i className="fas fa-plus"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SchedulePage;