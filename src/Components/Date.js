import React from 'react';
import './Date.css';

const DateComponent = () => {
  const getFormattedDayAndDate = () => {
    const today = new Date(); // Aucune récursion
    const day = today.toLocaleDateString("fr-FR", { weekday: "long" });
    const date = today.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return { day, date };
  };

  const { day, date } = getFormattedDayAndDate(); // Appel unique
  return (
    <div className="Date">
      {day}, {date}
    </div>
  );
}
export default DateComponent;
