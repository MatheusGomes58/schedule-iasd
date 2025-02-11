import React, { useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import "./calendarGrid.css"

const Calendar = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="scheduleGrid">
      <div className="monthBanner">
        <h2>{format(currentDate, "MMMM yyyy", { locale: ptBR }).charAt(0).toUpperCase() + format(currentDate, "MMMM yyyy", { locale: ptBR }).slice(1)}</h2>
      </div>
      <div className="calendar">
        <div className="scheduleHead">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="days-grid">
          {days.map((day) => (
            <div key={day} className={`day ${!isSameMonth(day, currentDate) ? "disabled" : ""}`}>
              <span>{format(day, "d")}

              </span>
            </div>
          ))}
        </div>

        {/* Botões de navegação flutuantes */}
        <div className="nav-buttons">
          <button onClick={handlePrevMonth}>{"<"}</button>
          <button onClick={handleNextMonth}>{">"}</button>
        </div>
      </div>
    </div>

  );
};

export default Calendar;
/*{events
              .filter((event) => isSameDay(new Date(event.date), day))
              .map((event, index) => (
                <div key={index} className="event">{event.title}</div>
              ))}*/