import React, {  useRef, useState } from "react";
import {
  Calendar,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Loader2,
  MapPin,
  Navigation,
  Briefcase,
  Baby,
} from "lucide-react";

import CitySelect from "../components/CitySelect";
import tripAPI from "../api/tripAPI";
import TripCard from "../components/TripCard";
import type { TripRead } from "../types/Trip";
import type TripSearchParams from "../types/SearchForm";
import TripDetails from "../components/TripDetail";

const cities = [
  "Аскарово", "Уфа", "Магнитогорск", "Баймак", "Юлдыбай",
  "Хамит", "Белорецк", "Гай", "Акъяр", "Орск", "Оренбург"
];

const SearchPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [trips, setTrips] = useState<TripRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripRead | null>(null);
  const dateRef = useRef<HTMLInputElement>(null);


  const [search, setSearch] = useState<TripSearchParams>({
    fromCity: "",
    toCity: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (field: keyof TripSearchParams, value: string) => {
    setSearch((prev) => ({ ...prev, [field]: value }));
  };



  const handleSwap = () => {
    setSearch((prev) => ({
      ...prev,
      fromCity: prev.toCity,
      toCity: prev.fromCity,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    tripAPI.searchTrips(search)
      .then(setTrips)
      .finally(() => setLoading(false));
  };

  const formattedDate = new Date(search.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short'
  });

  return (
    <div className="flex flex-col h-full bg-[#F3F4F6]"> {/* Нейтральный фон */}
      
      {/* --- БЛОК ПОИСКА --- */}
      <div className="px-4 pt-2 pb-6">
        <div className="bg-white rounded-[28px] p-2 shadow-xl shadow-black/5 border border-white relative">
          
          {/* Контейнер полей (Светло-серый блок) */}
          <div className="bg-gray-50 rounded-[22px] border border-gray-100 relative focus-within:border-blue-200 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-300">
            
            {/* 1. ОТКУДА */}
            <div className="relative p-4 pb-3">
              <div className="flex items-center gap-3">
                {/* Иконка - теперь нейтральная */}
                <div className="text-gray-400 flex-shrink-0">
                  <MapPin size={20} strokeWidth={2} />
                </div>
                {/* Инпут */}
                <div className="flex-1 min-w-0 pr-12">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Откуда</label>
                  <CitySelect
                    value={search.fromCity}
                    onChange={(val) => handleChange("fromCity", val)}
                    placeholder="Город отправления"
                    options={cities}
                    className="bg-transparent text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Разделительная линия */}
            <div className="mx-14 h-px bg-gray-200"></div>

            {/* 2. КНОПКА SWAP (Плавающая справа, строгая) */}
            <button
              onClick={handleSwap}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-sm border border-gray-200 text-gray-500 flex items-center justify-center hover:text-blue-600 hover:border-blue-200 transition-colors"
            >
              <ArrowUpDown size={18} strokeWidth={2} />
            </button>

            {/* 3. КУДА */}
            <div className="relative p-4 pt-3">
              <div className="flex items-center gap-3">
                {/* Иконка */}
                <div className="text-gray-400 flex-shrink-0">
                  <Navigation size={20} strokeWidth={2} />
                </div>
                {/* Инпут */}
                <div className="flex-1 min-w-0 pr-12"> 
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Куда</label>
                  <CitySelect
                    value={search.toCity}
                    onChange={(val) => handleChange("toCity", val)}
                    placeholder="Город прибытия"
                    options={cities}
                    className="bg-transparent text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- ДАТА и ФИЛЬТРЫ --- */}
          <div className="flex items-center gap-2 mt-2">
            
            {/* Поле даты */}
                <div
                onClick={() => dateRef.current?.showPicker()}
                className="relative flex-1 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors border border-gray-100 overflow-hidden group cursor-pointer"
                >
            <input
            ref={dateRef}
            type="date"
            value={search.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="hidden"
            />

              <div className="flex items-center gap-3 px-4 py-4">
                <Calendar size={18} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Дата</span>
                  <span className="text-sm font-bold text-gray-900 mt-1 capitalize">{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Кнопка открытия фильтров */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-[60px] w-[60px] flex items-center justify-center rounded-2xl border transition-all duration-200 ${
                showFilters 
                  ? "bg-gray-900 text-white border-gray-900" 
                  : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>

          {/* Выпадающие фильтры */}
          {showFilters && (
            <div className="flex gap-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
               <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 active:bg-blue-50 active:text-blue-600 active:border-blue-200 transition-colors">
                  <Briefcase size={14} /> Багаж
               </button>
               <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 active:bg-blue-50 active:text-blue-600 active:border-blue-200 transition-colors">
                  <Baby size={14} /> Кресло
               </button>
            </div>
          )}

          {/* --- ГЛАВНАЯ КНОПКА (Единственный яркий акцент) --- */}
          <div className="mt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                ${loading 
                  ? "bg-blue-300 cursor-not-allowed text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Поиск...
                </>
              ) : (
                "Найти поездку"
              )}
            </button>
          </div>
        
        </div>
      </div>

      {/* --- РЕЗУЛЬТАТЫ --- */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Заголовок списка */}
        <div className="flex items-center gap-2 mb-4 px-2 opacity-50">
            {/* Небольшая цветная точка для статуса */}
            <div className={`h-1.5 w-1.5 rounded-full ${trips.length > 0 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              {loading ? "Загрузка..." : trips.length > 0 ? `Найдено: ${trips.length}` : "Список"}
            </span>
        </div>

        {loading ? (
          <div className="space-y-3">
             {[1,2,3].map(i => (
               <div key={i} className="h-32 bg-white rounded-3xl animate-pulse shadow-sm" />
             ))}
          </div>
        ) : trips.length > 0 ? (
          <div className="space-y-3 pb-safe">
            {trips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onClick={() => setSelectedTrip(trip)} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 opacity-40 text-center px-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Search size={28} strokeWidth={2} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Поездки не найдены</p>
          </div>
        )}
      </div>

      {/* Модалка */}
      {selectedTrip && (
        <TripDetails
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </div>
  );
};

export default SearchPage;

