import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  getYear,
  getMonth
} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import "./calendarGrid.css";
import EventRow from '../eventTable/eventRow';

const Calendar = ({ events, onDeleteEvent, onSendEvent, onEditEvent, updateEventField, setUserPrivileges }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dayView, setDayView] = useState({});

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const currentYear = getYear(currentDate);
  const currentMonth = getMonth(currentDate) + 1;
  const monthKey = `${currentYear}-${currentMonth.toString().padStart(2, "0")}`;

  useEffect(() => {
    const filteredEvents = events[currentYear]?.months?.[monthKey]?.filter((event) =>
      isSameDay(
        new Date(new Date(event.month + "-" + event.day).setDate(new Date(event.month + "-" + event.day).getDate() + 1)),
        dayView
      )
    ) || [];
    setSelectedEvents(filteredEvents);
  }, [events, dayView]); // Atualiza sempre que `events` ou `dayView` mudar


  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDayClick = (day) => {
    const eventList =
      events[currentYear]?.months?.[monthKey]?.filter((event) =>
        isSameDay(
          new Date(new Date(event.month + "-" + event.day).setDate(new Date(event.month + "-" + event.day).getDate() + 1)),
          day
        )
      ) || [];

    if (eventList.length > 0) {
      setSelectedEvents(eventList);
      setModalOpen(true);
      setDayView(day);
    }
  };

  return (
    <div>
      <div className="monthBanner">
        <h2>
          {format(currentDate, "MMMM yyyy", { locale: ptBR })
            .charAt(0)
            .toUpperCase() +
            format(currentDate, "MMMM yyyy", { locale: ptBR }).slice(1)}
        </h2>
      </div>
      <div className="scheduleGrid">
        <div className="calendar">
          <div className="days-grid">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
            {days.map((day) => {
              const dayEvents =
                events[currentYear]?.months?.[monthKey]?.filter((event) =>
                  isSameDay(
                    new Date(new Date(event.month + "-" + event.day).setDate(new Date(event.month + "-" + event.day).getDate() + 1)),
                    day
                  )
                ) || [];

              return (
                <div
                  key={day}
                  className={`day ${!isSameMonth(day, currentDate) ? "disabled" : ""}`}
                  onClick={() => handleDayClick(day)}
                  style={{ cursor: dayEvents.length > 0 ? "pointer" : "default" }}
                >
                  <span>{format(day, "d")}</span>
                  {dayEvents.length > 0 &&
                    dayEvents.map((event, index) => (
                      <div key={index} className="event">{event.title}</div>
                    ))}
                </div>
              );
            })}
          </div>

          {/* Botões de navegação flutuantes */}
          <div className="nav-buttons">
            <button onClick={handlePrevMonth}>{"<"}</button>
            <button onClick={handleNextMonth}>{">"}</button>
          </div>
        </div>
      </div>

      {/* Modal para exibir eventos do dia */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              {`${format(dayView, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`}
            </div>
            <div className="modal-body">
              {selectedEvents.map((event, index) => (
                <EventRow
                  key={event.id}
                  event={event}
                  onDeleteEvent={onDeleteEvent}
                  onSendEvent={onSendEvent}
                  onEditEvent={onEditEvent}
                  updateEventField={updateEventField}
                  setUserPrivileges={setUserPrivileges}
                />
              ))}
            </div>
            <div className="modal-footer">
              <button className="modal-close" onClick={() => setModalOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
