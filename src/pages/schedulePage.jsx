import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventTable from '../components/eventTable/eventTable';
import EventForm from '../components/formEvent/eventForm';
import ConfirmationModal from '../components/confirmationModal/confirmationModal';
import SearchBar from '../components/searchBar/searchBar';
import '../assets/css/schedulePage.css';
import {
  getUserPrivileges,
  getEventsFromFirestore,
  addDocumentTodb,
  updateDocumentIndb,
  deleteDocumentFromdb,
  updateEventField,
  logoutFromFirebase,
  getDepartmentsFromFirestore
} from '../components/firebase/firebaseUtils';
import { FaPlus, FaSearch, FaPrint, FaSignOutAlt } from 'react-icons/fa';

const SchedulePage = () => {
  const [events, setEvents] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState(null);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [eventToConfirm, setEventToConfirm] = useState(null);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUserPrivileges(setUserPrivileges);
    const unsubscribe = getEventsFromFirestore(setEvents);
    getDepartmentsFromFirestore(setDepartments); // Chama a função para buscar departamentos
    return () => unsubscribe();
  }, []);

  const handleConfirm = async () => {
    if (confirmationAction && eventToConfirm) {
      await confirmationAction(eventToConfirm);
    }
    setConfirmationModalVisible(false);
  };

  const handleCancel = () => {
    setConfirmationModalVisible(false);
    setEventToConfirm(null);
    setConfirmationAction(null);
  };

  const handleDeleteEvent = (eventId) => {
    setConfirmationAction(() => () => deleteDocumentFromdb('events', eventId));
    setConfirmationMessage('Tem certeza que deseja deletar este evento?');
    setEventToConfirm(eventId);
    setConfirmationModalVisible(true);
  };

  const handleSendEvent = (eventId) => {
    setConfirmationAction(() => () => updateDocumentIndb('events', eventId, { sended: true }));
    setConfirmationMessage('Tem certeza que deseja enviar este evento?');
    setEventToConfirm(eventId);
    setConfirmationModalVisible(true);
  };

  const handleAddEvent = async (newEventData) => {
    await addDocumentTodb('events', newEventData);
    setShowForm(false);
    setEditing(false);
  };

  const handleUpdateEventField = (eventId, field, value) => {
    setConfirmationAction(() => () => updateEventField(eventId, field, value));
    setConfirmationMessage('Tem certeza que deseja' + (value? ' aprovar ' : ' rejeitar ') + 'este evento?');
    setEventToConfirm(eventId);
    setConfirmationModalVisible(true);
  };

  const handleUpdateEvent = async (eventId, newData) => {
    await updateDocumentIndb('events', eventId, newData);
    setShowForm(false);
    setSelectedEvent(null);
    setEditing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = async () => {
    await logoutFromFirebase();
    navigate('/');
  };

  return (
    <div className="schedule-page">
      <div className="menu printable-content">
        <button className="menu-button" onClick={() => setShowForm(true)}>
          <FaPlus /> Add Event
        </button>
        <button className="menu-button" onClick={() => setSearchBarVisible(!searchBarVisible)}>
          <FaSearch /> Search
        </button>
        <button className="menu-button" onClick={handlePrint}>
          <FaPrint /> Print
        </button>
        <button className="menu-button" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <EventTable
        events={events}
        userPrivileges={userPrivileges}
        onDeleteEvent={handleDeleteEvent}
        onSendEvent={handleSendEvent}
        onEditEvent={(event) => {
          setEditing(true);
          setSelectedEvent(event);
          setShowForm(true);
        }}
        updateEventField={handleUpdateEventField}
        setUserPrivileges={userPrivileges}
      />

      {confirmationModalVisible && (
        <ConfirmationModal
          message={confirmationMessage}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          status={confirmationAction ? 'success' : 'danger'}
        />
      )}
      {searchBarVisible && <SearchBar onSearch={(term) => setSearchTerm(term)} onCancel={() => setSearchBarVisible(false)} />}
      {showForm && (
        <div className='addFunctions printable-content'>
          <EventForm
            key={selectedEvent ? selectedEvent.id : 'newEvent'}
            onSave={editing ? (data) => handleUpdateEvent(selectedEvent.id, data) : handleAddEvent}
            onCancel={() => {
              setShowForm(false);
              setSelectedEvent(null);
              setEditing(false);
            }}
            departments={departments}
            initialData={selectedEvent}
          />
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
