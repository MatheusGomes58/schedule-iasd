import React, { useState } from "react";
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

const Calendar = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const currentYear = getYear(currentDate);
  const currentMonth = getMonth(currentDate) + 1;
  const monthKey = `${currentYear}-${currentMonth.toString().padStart(2, "0")}`;

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
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
            {days.map((day) => (
              <div
                key={day}
                className={`day ${!isSameMonth(day, currentDate) ? "disabled" : ""}`}
              >
                <span>{format(day, "d")}</span>
                {events[currentYear]?.months?.[monthKey]?.filter((event) =>
                  isSameDay(new Date(new Date(event.month + "-" + event.day).setDate(new Date(event.month + "-" + event.day).getDate() + 1)), day)
                ).map((event, index) => (
                  <div key={index} className="event">{event.title}</div>
                ))}
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
    </div>
  );
};

export default Calendar;
