import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Sparkles, 
  Wand2, 
  MapPin, 
  Calendar, 
  Clock, 
  Check, 
  Car, 
  Baby, 
  Briefcase,
  Loader2,
  BrainCircuit
} from "lucide-react";

import CitySelect from "../components/CitySelect"; // Предполагаем, что компонент там же
// Типы (в реальном проекте лучше импортировать из types.ts)
import type { TripRead, TripStopRead, Contact } from "../types/Trip";

// --- ВРЕМЕННЫЕ ЗАГЛУШКИ ДЛЯ ТИПОВ (если файла нет под рукой) ---
// Если у вас есть файл types/Trip.ts, удалите этот блок и раскомментируйте импорт выше.
/*
export interface Contact { type: string; value: string; }
export interface TripStopRead { id: number; trip_id: number; city_name: string; arrival_time: string; stop_order: number; }
export interface TripRead { id: number; created_at: string; contacts: Contact[]; car?: string | null; platform_name: string; driver_id: number; has_cargo: boolean; has_child_seat: boolean; is_taxi: boolean; raw_text?: string | null; stops: TripStopRead[]; }
*/

interface TripCreateProps {
  onBack?: () => void;
}

const CITIES_MOCK = [
  "Уфа", "Магнитогорск", "Казань", "Москва", "Белорецк", "Оренбург"
];

const TripCreateAI: React.FC<TripCreateProps> = ({ onBack }) => {
  const [rawText, setRawText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [parsedTrip, setParsedTrip] = useState<TripRead | null>(null);

  // Сообщения для кнопки во время загрузки
  const loadingMessages = [
    "Считываем контекст...",
    "Ищем гео-точки...",
    "Определяем время...",
    "Формируем маршрут..."
  ];

  // Эффект смены текста на кнопке
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAnalyzing) {
      setLoadingStage(0);
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev + 1) % loadingMessages.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // --- ИМИТАЦИЯ ИИ (MOCK) ---
  const handleAnalyze = () => {
    if (!rawText.trim()) return;

    setIsAnalyzing(true);
    setParsedTrip(null);

    // Имитируем задержку сети 3 секунды
    setTimeout(() => {
      // Генерируем фейковый ответ
      const mockResponse: TripRead = {
        id: Math.random(),
        created_at: new Date().toISOString(),
        contacts: [{ type: "phone", value: "+7 999 123-45-67" }],
        platform_name: "ai_generated",
        driver_id: 1,
        has_cargo: rawText.toLowerCase().includes("багаж") || rawText.toLowerCase().includes("сумк"),
        has_child_seat: rawText.toLowerCase().includes("кресло") || rawText.toLowerCase().includes("ребен"),
        is_taxi: false,
        raw_text: rawText,
        stops: [
          {
            id: 1,
            trip_id: 1,
            city_name: "Уфа", // В реальности ИИ вытащит это из текста
            arrival_time: new Date().toISOString(), // Дата выезда
            stop_order: 0
          },
          {
            id: 2,
            trip_id: 1,
            city_name: "Магнитогорск", // В реальности ИИ вытащит это из текста
            arrival_time: "", // Для финиша время часто не указывают
            stop_order: 1
          }
        ]
      };

      setParsedTrip(mockResponse);
      setIsAnalyzing(false);
    }, 3200);
  };

  // Обработчики изменений полей
  const updateStopCity = (index: number, city: string) => {
    if (!parsedTrip) return;
    const newStops = [...parsedTrip.stops];
    if (newStops[index]) {
      newStops[index] = { ...newStops[index], city_name: city };
      setParsedTrip({ ...parsedTrip, stops: newStops });
    }
  };

  const updateOption = (field: keyof TripRead, value: boolean) => {
    if (!parsedTrip) return;
    setParsedTrip({ ...parsedTrip, [field]: value });
  };

  const updateDate = (dateStr: string) => {
     if (!parsedTrip) return;
     const newStops = [...parsedTrip.stops];
     // Обновляем время только у первого стопа (время выезда)
     if(newStops[0]) {
         // Сохраняем текущее время (часы/минуты), меняем только дату, 
         // или просто заменяем ISO строку, зависит от реализации DatePicker. 
         // Для простоты заменим целиком:
         newStops[0].arrival_time = dateStr; 
         setParsedTrip({ ...parsedTrip, stops: newStops });
     }
  };

  // Форматирование даты для инпута (YYYY-MM-DDTHH:mm)
  const getInputValue = () => {
      if(!parsedTrip?.stops[0]?.arrival_time) return "";
      // Обрезаем секунды и Z для datetime-local
      return parsedTrip.stops[0].arrival_time.slice(0, 16);
  }


  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] relative overflow-y-auto">
      
      {/* Шапка */}
      <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
            </button>
        )}
        <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600" />
            AI Создание поездки
        </h1>
      </div>

      <div className="p-4 space-y-6 pb-24">
        
        {/* --- БЛОК 1: ВВОД ТЕКСТА --- */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 relative group focus-within:ring-4 focus-within:ring-blue-50 transition-all">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            Опишите поездку своими словами
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            disabled={isAnalyzing}
            placeholder="Например: Еду завтра из Уфы в Магнитогорск в 15:00. Возьму посылки. Есть детское кресло."
            className="w-full h-32 p-3 bg-gray-50 rounded-2xl border-none resize-none text-gray-800 placeholder:text-gray-300 focus:ring-0 text-base leading-relaxed"
          />
          
          {/* Кнопка "Магия" */}
          <div className="mt-3">
             <button
               onClick={handleAnalyze}
               disabled={isAnalyzing || !rawText.trim()}
               className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden
                 ${isAnalyzing 
                   ? "bg-gray-900 text-white cursor-wait" 
                   : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98]"}
                 ${!rawText.trim() && !isAnalyzing ? "opacity-50 cursor-not-allowed" : "opacity-100"}
               `}
             >
                {isAnalyzing ? (
                    <>
                        <Loader2 className="animate-spin" size={18} />
                        <span className="animate-pulse w-40 text-left">
                            {loadingMessages[loadingStage]}
                        </span>
                    </>
                ) : (
                    <>
                        <Wand2 size={18} />
                        Распознать поездку
                    </>
                )}
             </button>
          </div>
        </div>

        {/* --- БЛОК 2: РЕЗУЛЬТАТ (ПОЯВЛЯЕТСЯ ПОСЛЕ АНАЛИЗА) --- */}
        {parsedTrip && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                
                {/* Бейдж успеха */}
                <div className="flex items-center gap-2 justify-center text-green-600 bg-green-50 py-2 rounded-xl border border-green-100">
                    <BrainCircuit size={16} />
                    <span className="text-xs font-bold uppercase">Данные успешно извлечены</span>
                </div>

                {/* Карточка редактирования */}
                <div className="bg-white rounded-[32px] p-1 shadow-xl shadow-blue-900/5 border border-white">
                    <div className="bg-slate-50 rounded-[28px] border border-slate-100 p-4 space-y-4">
                        
                        {/* Маршрут */}
                        <div className="space-y-3">
                            {/* Откуда */}
                            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                    <MapPin size={16} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Откуда</label>
                                    <CitySelect 
                                        options={CITIES_MOCK} 
                                        value={parsedTrip.stops[0]?.city_name || ""}
                                        onChange={(val) => updateStopCity(0, val)}
                                        placeholder="Город отправления"
                                        className="bg-transparent p-0 h-auto border-none focus:ring-0 text-sm font-bold text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Стрелка вниз */}
                            <div className="flex justify-center -my-1 relative z-10">
                                <div className="bg-slate-50 p-1 rounded-full">
                                    <div className="w-6 h-6 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center">
                                        <ArrowLeft size={12} className="-rotate-90" />
                                    </div>
                                </div>
                            </div>

                            {/* Куда */}
                            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                    <MapPin size={16} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Куда</label>
                                    <CitySelect 
                                        options={CITIES_MOCK} 
                                        value={parsedTrip.stops[parsedTrip.stops.length - 1]?.city_name || ""}
                                        onChange={(val) => updateStopCity(parsedTrip.stops.length - 1, val)}
                                        placeholder="Город прибытия"
                                        className="bg-transparent p-0 h-auto border-none focus:ring-0 text-sm font-bold text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Дата и Время */}
                        <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                                <Clock size={16} />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Время выезда</label>
                                <input 
                                    type="datetime-local"
                                    value={getInputValue()}
                                    onChange={(e) => updateDate(e.target.value)}
                                    className="w-full bg-transparent p-0 border-none text-sm font-bold text-gray-900 focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* Опции (Тогглы) */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                             <button 
                                onClick={() => updateOption('has_cargo', !parsedTrip.has_cargo)}
                                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${parsedTrip.has_cargo ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-100"}`}
                             >
                                <Briefcase size={16} />
                                <span className="text-xs font-bold">Багаж</span>
                                {parsedTrip.has_cargo && <Check size={12} />}
                             </button>

                             <button 
                                onClick={() => updateOption('has_child_seat', !parsedTrip.has_child_seat)}
                                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${parsedTrip.has_child_seat ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-100"}`}
                             >
                                <Baby size={16} />
                                <span className="text-xs font-bold">Кресло</span>
                                {parsedTrip.has_child_seat && <Check size={12} />}
                             </button>
                        </div>

                    </div>
                </div>

                {/* Кнопка Опубликовать */}
                <button className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <Car size={20} />
                    Опубликовать поездку
                </button>

                <p className="text-center text-xs text-gray-400 px-4">
                    Проверьте данные перед публикацией. ИИ может ошибаться.
                </p>
            </div>
        )}

      </div>
    </div>
  );
};

export default TripCreateAI;