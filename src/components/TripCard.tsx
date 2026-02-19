import React from 'react';
import { ChevronRight, Package, Baby, Car, MapPin } from 'lucide-react';
import type { TripRead } from '../types/Trip';

interface TripCardProps {
  trip: TripRead;
  searchFromCity?: string;
  searchToCity?: string;
  onClick: (trip: TripRead) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, searchFromCity, searchToCity, onClick }) => {
  // 1. Сортируем все остановки
  const sortedStops = [...trip.stops].sort((a, b) => a.stop_order - b.stop_order);
  
  // 2. Определяем главные точки для отображения (Откуда/Куда для пользователя)
  // Если пользователь ничего не искал, берем старт и финиш водителя
  const findMatchingStop = (cityName?: string) => {
    if (!cityName) return null;
    return sortedStops.find(s =>
      s.city_name.toLowerCase().includes(cityName.toLowerCase())
    );
  };

  const firstStop = sortedStops[0]; // Реальный старт водителя
  const lastStop = sortedStops[sortedStops.length - 1]; // Реальный финиш водителя

  const userFromStop = findMatchingStop(searchFromCity) || firstStop;
  const userToStop = findMatchingStop(searchToCity) || lastStop;

  // 3. Получаем список ТОЛЬКО промежуточных городов (исключая старт и финиш водителя)
  const intermediateStops = sortedStops.slice(1, -1);

  // Логика подсветки: совпадает ли город с поиском пользователя
  const isMatch = (cityName: string) => {
    const searchFrom = searchFromCity?.toLowerCase();
    const searchTo = searchToCity?.toLowerCase();
    const current = cityName.toLowerCase();
    return (searchFrom && current.includes(searchFrom)) || (searchTo && current.includes(searchTo));
  };

  // Форматирование
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const today = new Date();
    const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
    return isToday ? 'Сегодня' : d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div 
      onClick={() => onClick(trip)}
      className="group bg-white rounded-3xl p-4 sm:p-5 mb-3 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
    >
      {/* Декоративная полоска */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-500 transition-colors"></div>

      {/* TAXI Badge */}
      {trip.is_taxi && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm z-20">
          TAXI
        </div>
      )}

      {/* ОСНОВНАЯ ИНФОРМАЦИЯ */}
      <div className="flex gap-3 sm:gap-6">
        
        {/* Время */}
        <div className="flex flex-col items-center justify-start min-w-[60px] sm:min-w-[70px] pt-1">
          <div className="text-3xl font-black text-gray-900 leading-none tracking-tight">
            {formatTime(userFromStop?.arrival_time)}
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-gray-500 mt-1 uppercase text-center">
            {formatDate(userFromStop?.arrival_time)}
          </div>
        </div>

        {/* Маршрут (Точка А -> Точка Б) */}
        <div className="flex-1 flex flex-col justify-center relative pl-2">
          <div className="absolute left-[9px] top-[14px] bottom-[26px] w-0.5 bg-gray-200"></div>

          {/* Откуда */}
          <div className="flex items-start gap-3 mb-3 relative z-10">
            <div className={`mt-1.5 w-3.5 h-3.5 rounded-full border-[3px] shadow-sm flex-shrink-0 bg-white ${isMatch(userFromStop.city_name) ? 'border-blue-500' : 'border-gray-300'}`}></div>
            <div className="leading-tight">
              <div className="text-base sm:text-lg font-bold text-gray-900">
                {firstStop.city_name}
              </div>
            </div>
          </div>

          {/* Куда */}
          <div className="flex items-center gap-3 relative z-10">
            <div className={`w-3.5 h-3.5 rounded-full border-[3px] shadow-sm flex-shrink-0 ${isMatch(userToStop.city_name) ? 'border-blue-500 bg-blue-500' : 'border-gray-800 bg-gray-800'}`}></div>
            <div className="leading-tight">
               <div className="text-base sm:text-lg font-bold text-gray-900">
                {lastStop.city_name}
              </div>
            </div>
          </div>
        </div>

        {/* Стрелка */}
        <div className="hidden sm:flex items-center justify-center pl-2">
          <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-blue-600 group-hover:text-white text-gray-400 flex items-center justify-center transition-all">
            <ChevronRight size={24} />
          </div>
        </div>
      </div>

      {/* --- СПИСОК ПРОМЕЖУТОЧНЫХ ГОРОДОВ --- */}
      {intermediateStops.length > 0 && (
        <div className="mt-4 mb-1 pl-[10px] sm:pl-[90px]"> {/* Отступ слева, чтобы выровнять с линией маршрута или текстом */}
          <div className="flex items-center gap-1.5 mb-2">
             <MapPin size={12} className="text-gray-400" />
             <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Маршрут через:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {intermediateStops.map((stop) => {
              const highlighted = isMatch(stop.city_name);
              return (
                <div 
                  key={stop.id}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors
                    ${highlighted 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' // Активный стиль
                      : 'bg-gray-50 text-gray-500 border-gray-100' // Обычный стиль
                    }
                  `}
                >
                  {stop.city_name}
                  {/* Опционально: можно показать время заезда в этот город */}
                  {/* <span className="opacity-60 font-normal ml-1">
                    {formatTime(stop.arrival_time)}
                  </span> */}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ФУТЕР: Детали поездки */}
      {(trip.car || trip.has_cargo || trip.has_child_seat) && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {trip.car ? (
            <div className="flex items-center gap-2 max-w-[70%]">
              <Car className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="text-xs text-gray-700 font-semibold truncate">
                {trip.car}
              </div>
            </div>
          ) : <div></div>}

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

      {trip.raw_text && (
        <div className="mt-2 text-[10px] text-gray-400 truncate pl-1">
          {trip.raw_text}
        </div>
      )}
    </div>
  );
};

export default TripCard;