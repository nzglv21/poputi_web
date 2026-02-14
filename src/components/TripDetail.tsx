import React, { useEffect, useMemo, useState } from "react";
import type { TripRead } from "../types/Trip";
import {
  X,
  Phone,
  Send,
  MessageCircle, // Для WhatsApp
  MessageSquare,
  Car,
  Package,
  Baby,
  MapPin,
  Calendar,
  ChevronRight,
  Copy
} from "lucide-react";

interface TripDetailsProps {
  trip: TripRead;
  onClose: () => void;
  onToggleFull?: (tripId: number) => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({
  trip,
  onClose,
  onToggleFull,
}) => {
  const sortedStops = useMemo(
    () => [...trip.stops].sort((a, b) => a.stop_order - b.stop_order),
    [trip.stops]
  );
  
  const firstStop = sortedStops[0];
  const lastStop = sortedStops[sortedStops.length - 1];
  const contacts = trip.contacts || [];

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Форматирование
  const formatTripDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = date.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "Сегодня";
    if (diffDays === 1) return "Завтра";

    return new Intl.DateTimeFormat("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "long",
    }).format(date);
  };

  const formatTime = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";

  // Действия
  const handleAction = (type: string, value: string) => {
    if (type === 'phone') window.location.href = `tel:${value}`;
    if (type === 'telegram') window.open(`https://t.me/${value.replace("@", "")}`, "_blank");
    if (type === 'whatsapp') window.open(`https://wa.me/${value.replace(/[^0-9]/g, "")}`, "_blank");
  };

  const copyToClipboard = (text: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Затемнение фона */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Модальное окно */}
      <div
        className="bg-gray-50 w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] flex flex-col relative animate-in slide-in-from-bottom duration-300 shadow-2xl overflow-hidden"
      >
        
        {/* Кнопка закрытия */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="p-2 bg-white/80 rounded-full text-gray-500 hover:bg-white shadow-sm transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Скроллируемая область */}
        <div className="overflow-y-auto flex-1 pb-safe" style={{ WebkitOverflowScrolling: "touch" }}>
          
          {/* 1. Блок ВРЕМЯ И ДАТА (Акцент) */}
          <div className="bg-white p-6 pt-10 rounded-b-[32px] shadow-sm border-b border-gray-100 text-center relative z-10">
             <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2">
                 <Calendar className="w-3.5 h-3.5" />
                 {formatTripDate(firstStop?.arrival_time)}
             </div>
             <div className="text-[3.5rem] font-black leading-none text-gray-900 tracking-tighter">
                 {formatTime(firstStop?.arrival_time)}
             </div>
             <div className="text-gray-400 text-xs font-medium mt-1">Время отправления</div>
          </div>

          <div className="p-5 space-y-6">
            
            {/* 2. Блок КОНТАКТЫ (Новый дизайн: Список) */}
            {contacts.length > 0 && (
              <section>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-2">
                  Связь с водителем ({contacts.length})
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
                  {contacts.map((contact, idx) => {
                    const isPhone = contact.type === 'phone';
                    const isTg = contact.type === 'telegram';
                    const isWa = contact.type === 'whatsapp';
                    
                    return (
                      <div 
                        key={idx} 
                        onClick={() => handleAction(contact.type, contact.value)}
                        className="group flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {/* Иконка типа связи */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                            ${isPhone ? 'bg-green-100 text-green-600' : 
                              isTg ? 'bg-blue-100 text-blue-500' : 
                              isWa ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}
                          >
                            {isPhone && <Phone className="w-5 h-5 fill-current" />}
                            {isTg && <Send className="w-5 h-5 ml-0.5" />}
                            {isWa && <MessageCircle className="w-5 h-5" />}
                          </div>
                          
                          {/* Данные */}
                          <div>
                            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                              {isPhone ? 'Телефон' : isTg ? 'Telegram' : isWa ? 'WhatsApp' : 'Контакт'}
                            </div>
                            <div className="text-base font-bold text-gray-900 leading-none">
                              {contact.value}
                            </div>
                          </div>
                        </div>

                        {/* Кнопки действий (Шеврон или Копировать) */}
                        <div className="flex items-center gap-3">
                           <button 
                             onClick={(e) => copyToClipboard(contact.value, idx, e)}
                             className="p-2 text-gray-300 hover:text-blue-500 active:scale-90 transition-transform"
                           >
                             {copiedIndex === idx ? (
                               <span className="text-[10px] font-bold text-green-500">Скопировано</span>
                             ) : (
                               <Copy className="w-4 h-4" />
                             )}
                           </button>
                           <ChevronRight className="w-5 h-5 text-gray-300" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 3. Блок МАРШРУТ */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="relative pl-2 py-1">
                {/* Линия */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                
                {sortedStops.map((stop, idx) => {
                   const isFirst = idx === 0;
                   const isLast = idx === sortedStops.length - 1;
                   
                   return (
                    <div key={stop.id} className="relative flex gap-4 mb-5 last:mb-0">
                      <div className={`w-4 h-4 rounded-full border-[3px] flex-shrink-0 z-10 bg-white mt-1 
                        ${isFirst ? 'border-blue-500' : 
                          isLast ? 'border-gray-900' : 'border-gray-300'}`}
                      ></div>
                      
                      <div className="flex-1 -mt-0.5">
                        <div className={`text-base font-bold ${isFirst ? 'text-blue-600' : 'text-gray-900'}`}>
                          {stop.city_name}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. Блок ДЕТАЛИ И КОММЕНТАРИЙ */}
            <div className="grid grid-cols-1 gap-3">
               {/* Авто */}
               {trip.car && (
                 <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg text-gray-500">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Автомобиль</div>
                      <div className="text-sm font-bold text-gray-800">{trip.car}</div>
                    </div>
                 </div>
               )}

               {/* Опции */}
               {(trip.has_child_seat || trip.has_cargo) && (
                 <div className="flex gap-2">
                    {trip.has_child_seat && (
                      <div className="flex-1 bg-orange-50 px-3 py-2 rounded-xl border border-orange-100 flex items-center justify-center gap-2 text-orange-700 font-bold text-xs">
                         <Baby className="w-4 h-4" /> Детское кресло
                      </div>
                    )}
                    {trip.has_cargo && (
                      <div className="flex-1 bg-green-50 px-3 py-2 rounded-xl border border-green-100 flex items-center justify-center gap-2 text-green-700 font-bold text-xs">
                         <Package className="w-4 h-4" /> Возьму груз
                      </div>
                    )}
                 </div>
               )}

               {/* Комментарий */}
               {trip.raw_text && (
                 <div className="mt-2 bg-gray-100/50 p-4 rounded-xl">
                   <div className="flex items-center gap-2 mb-2 text-gray-400">
                     <MessageSquare className="w-3 h-3" />
                     <span className="text-[10px] font-bold uppercase">Комментарий</span>
                   </div>
                   <p className="text-sm text-gray-600 italic leading-snug">
                     "{trip.raw_text}"
                   </p>
                 </div>
               )}
            </div>

            {/* Нижний отступ для удобства скролла */}
            <div className="h-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;