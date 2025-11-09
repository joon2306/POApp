import React, { useState, useRef, useEffect, ChangeEvent } from 'react';

export type DatePicker = {
    value: string;
    onChange:(date: string) => void;
    error: boolean;
    errorMessage: string;
    label: string;

}

const DatePicker = ({ value, onChange, error, errorMessage, label }: DatePicker) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const pickerRef = useRef(null);

  const selectedDate = value ? new Date(value) : null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    if (!date) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onChange(newDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    dayNames.forEach((name) => {
      days.push(
        <div key={`day-${name}`} className="text-center text-xs font-semibold text-gray-500 py-2">
          {name}
        </div>
      );
    });

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const today = isToday(day);
      const selected = isSelected(day);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            p-2.5 text-sm font-medium rounded-lg transition-all
            ${selected 
              ? 'bg-blue-500 text-white font-semibold' 
              : today 
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div ref={pickerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full p-2 text-[15px] rounded-lg bg-white cursor-pointer
          flex justify-between items-center transition-all outline-none
          border ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {value ? formatDate(selectedDate) : label}
        </span>
        <svg
          className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="#6b7280"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {error && (
        <p className="text-red-500 text-xs mt-1.5 ml-1">
          {errorMessage}
        </p>
      )}

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 min-w-[320px]">
          <div className="flex justify-between items-center mb-4 px-1">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="bg-transparent border-none text-2xl cursor-pointer text-gray-500 p-1 rounded-md hover:bg-gray-100 transition-all w-8 h-8 flex items-center justify-center"
            >
              ‹
            </button>
            <span className="text-[15px] font-semibold text-gray-800">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="bg-transparent border-none text-2xl cursor-pointer text-gray-500 p-1 rounded-md hover:bg-gray-100 transition-all w-8 h-8 flex items-center justify-center"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
};


export default DatePicker;