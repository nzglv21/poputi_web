import React, { useState } from 'react';
import { Search, PlusCircle } from 'lucide-react';
import SearchPage from './pages/SearchPage';
import TripCreate from './pages/CreateTrip';
import './App.css';

const App: React.FC = () => {
  const [view, setView] = useState<'search' | 'create'>('search');

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-0 sm:p-4 font-sans text-gray-900">
      
      {/* КОНТЕЙНЕР ПРИЛОЖЕНИЯ */}
      <div className="w-full max-w-md bg-gray-50 h-[100dvh] sm:h-[850px] sm:rounded-[45px] shadow-2xl overflow-hidden relative flex flex-col ring-8 ring-black">
        
        {/* ==========================================
            ВЕРХНЯЯ НАВИГАЦИЯ (Переключатель)
           ========================================== */}
        <header className="px-6 pt-8 pb-4 bg-gray-50 z-20 shrink-0">
          <div className="relative flex bg-gray-200/80 p-1.5 rounded-2xl ring-1 ring-black/5">
            
            {/* Анимированный фон активной вкладки (опционально для красоты, 
                но здесь реализовано через условные классы кнопок для простоты) */}
            
            {/* Кнопка ПОИСК */}
            <button
              onClick={() => setView('search')}
              className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                view === 'search'
                  ? 'bg-white text-black shadow-md shadow-black/5 ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Search className={`w-4 h-4 mr-2 ${view === 'search' ? 'stroke-2' : 'stroke-[1.5]'}`} />
              Найти
            </button>

            {/* Кнопка СОЗДАТЬ */}
            <button
              onClick={() => setView('create')}
              className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                view === 'create'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PlusCircle className={`w-4 h-4 mr-2 ${view === 'create' ? 'stroke-2' : 'stroke-[1.5]'}`} />
              Создать
            </button>
          </div>
        </header>

        {/* ==========================================
            ОСНОВНОЙ КОНТЕНТ
           ========================================== */}
        <main 
          className="flex-1 overflow-y-auto bg-gray-50 relative no-scrollbar scroll-smooth"
          style={{ 
            WebkitOverflowScrolling: "touch",
            paddingBottom: "40px" // Уменьшили отступ снизу, так как меню там больше нет
          }}
        >
          <div className="relative z-10 px-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {view === 'search' ? (
              <SearchPage />
            ) : (
              <TripCreate />
            )}
          </div>
        </main>

      </div>
    </div>
  );
};

export default App;