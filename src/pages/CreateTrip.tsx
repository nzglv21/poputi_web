import React, { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  BrainCircuit, 
  ScanLine, 
  Sparkles, 
  Wand2, 
  MapPin, 
  Calendar, 
  Clock,
  MessageSquareText
} from "lucide-react";

interface TripCreateProps {
  onBack?: () => void;
}

const TripCreate: React.FC<TripCreateProps> = ({ onBack }) => {
  const [step, setStep] = useState(0);

  // Цикл анимации: 0 = Текст, 1 = Сканирование, 2 = Результат
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 2000); // Каждые 2 секунды меняем этап
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] relative overflow-hidden">
      
      {/* --- AMBIENT CYBER BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Пульсирующие нейронные узлы */}
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[60px]"></div>
      </div>

      {/* Контент */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 pb-20">
        
        {/* Иконка мозга с орбитой */}
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-400 blur-xl opacity-30 animate-pulse"></div>
            <div className="relative z-10 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 border border-blue-50">
                <BrainCircuit size={40} className="text-blue-600 animate-pulse" strokeWidth={1.5} />
            </div>
            {/* Вращающаяся орбита */}
            <div className="absolute -inset-3 border border-blue-200/50 rounded-full w-26 h-26 animate-[spin_4s_linear_infinite] border-t-transparent border-l-transparent"></div>
            <div className="absolute -inset-3 border border-purple-200/50 rounded-full w-26 h-26 animate-[spin_4s_linear_infinite_reverse] border-b-transparent border-r-transparent rotate-45"></div>
        </div>

        {/* Заголовки */}
        <h2 className="text-2xl font-black text-center text-gray-900 mb-2">
          Нейросеть учится...
        </h2>
        <p className="text-sm text-center text-gray-500 max-w-xs mb-8 leading-relaxed">
          Скоро вы сможете просто загрузить скриншот или переслать сообщение, а <span className="text-blue-600 font-bold">ИИ сам заполнит</span> детали поездки.
        </p>

        {/* --- ДЕМОНСТРАЦИЯ (САМАЯ СОЛЬ) --- */}
        <div className="w-full max-w-[320px] bg-white rounded-3xl p-4 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden h-40">
          
          {/* Этап 1: Сырой текст (Сообщение) */}
          <div className={`absolute inset-0 flex items-center justify-center p-6 transition-all duration-500 ${step === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="flex items-start gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquareText size={16} className="text-gray-400" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 text-xs text-gray-600 font-medium">
                   "Еду завтра в Уфу в 10 утра, есть 2 места, багаж беру."
                </div>
            </div>
          </div>

          {/* Этап 2: Сканирование (Лазер) */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${step === 1 ? 'opacity-100' : 'opacity-0'}`}>
             <div className="w-full h-full bg-blue-600/5 absolute inset-0"></div>
             <div className="w-full h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] absolute top-0 animate-[scan_1.5s_ease-in-out_infinite]"></div>
             <div className="text-blue-600 font-black text-xs uppercase tracking-widest bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm animate-pulse">
                Анализ данных...
             </div>
          </div>

          {/* Этап 3: Результат (Красивые чипсы) */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 gap-2 transition-all duration-500 ${step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-2 w-full">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100 flex-1 justify-center">
                    <MapPin size={12} /> Уфа
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold border border-purple-100 flex-1 justify-center">
                    <Calendar size={12} /> Завтра
                  </span>
              </div>
              <div className="flex items-center gap-2 w-full">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold border border-green-100 flex-1 justify-center">
                    <Clock size={12} /> 10:00
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold border border-gray-100 flex-1 justify-center">
                    <Sparkles size={12} /> AI Auto
                  </span>
              </div>
          </div>
        </div>

        {/* Статус бар внизу карточки */}
        <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/30">
            <Wand2 size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Разработка алгоритма: 78%</span>
        </div>

      </div>

      {/* Кнопка "Назад" */}
      {onBack && (
        <div className="absolute bottom-8 left-0 w-full px-6 flex justify-center z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-600 rounded-2xl font-bold shadow-xl shadow-gray-200/40 transition-all active:scale-95 border border-gray-100"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            <span>Назад к поиску</span>
          </button>
        </div>
      )}

      {/* CSS для линии сканера */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TripCreate;