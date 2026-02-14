import React from 'react';
import { ChevronRight, Package, Baby, Car } from 'lucide-react';
import type { TripRead } from '../types/Trip';

interface TripCardProps {
  trip: TripRead;
  searchFromCity?: string;
  searchToCity?: string;
  onClick: (trip: TripRead) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, searchFromCity, searchToCity, onClick }) => {
  const sortedStops = [...trip.stops].sort((a, b) => a.stop_order - b.stop_order);
  const firstStop = sortedStops[0];
  const lastStop = sortedStops[sortedStops.length - 1];

  // Логика поиска точек маршрута
  const findMatchingStop = (cityName?: string) => {
    if (!cityName) return null;
    return sortedStops.find(s =>
      s.city_name.toLowerCase().includes(cityName.toLowerCase())
    );
  };

  const fromStop = findMatchingStop(searchFromCity) || firstStop;
  const toStop = findMatchingStop(searchToCity) || lastStop;

  // Форматирование времени
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '--:--';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  // Форматирование даты
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const today = new Date();
    const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
    
    if (isToday) return 'Сегодня';
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', weekday: 'short' });
  };

  return (
    <div 
      onClick={() => onClick(trip)}
      className="group bg-white rounded-2xl p-4 sm:p-5 mb-3 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
    >
      {/* Декоративная полоска при наведении */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-500 transition-colors"></div>

      {/* TAXI Badge */}
      {trip.is_taxi && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm z-20">
          TAXI
        </div>
      )}

      <div className="flex gap-3 sm:gap-6">
        
        {/* ЛЕВАЯ КОЛОНКА: Время отправления */}
        <div className="flex flex-col items-center justify-start min-w-[60px] sm:min-w-[70px] pt-1">
          <div className="text-3xl font-black text-gray-900 leading-none tracking-tight">
            {formatTime(fromStop?.arrival_time)}
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-gray-500 mt-1 uppercase text-center">
            {formatDate(fromStop?.arrival_time)}
          </div>
        </div>

        {/* ЦЕНТРАЛЬНАЯ КОЛОНКА: Маршрут */}
        <div className="flex-1 flex flex-col justify-center relative pl-2">
            
          {/* Вертикальная линия маршрута */}
          <div className="absolute left-[9px] top-[14px] bottom-[26px] w-0.5 bg-gray-200"></div>

          {/* Точка А (Откуда) */}
          <div className="flex items-start gap-3 mb-3 relative z-10">
            <div className={`mt-1.5 w-3.5 h-3.5 rounded-full border-[3px] shadow-sm flex-shrink-0 bg-white ${searchFromCity ? 'border-blue-500' : 'border-gray-300'}`}></div>
            <div className="leading-tight">
              <div className="text-base sm:text-lg font-bold text-gray-900">
                {fromStop?.city_name}
              </div>
              {/* Бейдж промежуточной посадки */}
              {fromStop?.id !== firstStop?.id && (
                <div className="text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 rounded inline-block mt-0.5">
                  Промежуточная посадка
                </div>
              )}
            </div>
          </div>

          {/* Точка Б (Куда) */}
          <div className="flex items-center gap-3 relative z-10">
            <div className={`w-3.5 h-3.5 rounded-full border-[3px] shadow-sm flex-shrink-0 ${searchToCity ? 'border-blue-500 bg-blue-500' : 'border-gray-800 bg-gray-800'}`}></div>
            <div className="leading-tight">
               <div className="text-base sm:text-lg font-bold text-gray-900">
                {toStop?.city_name}
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: Стрелка (Скрыта на мобильных hidden, видна на sm:flex) */}
        <div className="hidden sm:flex items-center justify-center pl-2">
          <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-blue-600 group-hover:text-white text-gray-400 flex items-center justify-center transition-all">
            <ChevronRight size={24} />
          </div>
        </div>
      </div>

      {/* ФУТЕР: Детали поездки */}
      {(trip.car || trip.has_cargo || trip.has_child_seat) && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          
          {/* Автомобиль */}
          {trip.car ? (
            <div className="flex items-center gap-2 max-w-[70%]">
              <Car className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="text-xs text-gray-700 font-semibold truncate">
                {trip.car}
              </div>
            </div>
          ) : <div></div>}

          {/* Иконки опций */}
          <div className="flex items-center gap-2 ml-auto">
            {trip.has_child_seat && (
              <div className="bg-orange-50 text-orange-600 p-1.5 rounded-md" title="Детское кресло">
                <Baby size={14} />
              </div>
            )}
            {trip.has_cargo && (
              <div className="bg-green-50 text-green-600 p-1.5 rounded-md" title="Можно с грузом">
                <Package size={14} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Текстовый комментарий */}
      {trip.raw_text && (
        <div className="mt-2 text-[10px] text-gray-400 truncate pl-1">
          {trip.raw_text}
        </div>
      )}
    </div>
  );
};

export default TripCard;