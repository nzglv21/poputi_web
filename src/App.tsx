import React, { useState, useEffect, useRef } from 'react';
import { Search, PlusCircle } from 'lucide-react';
import SearchPage from './pages/SearchPage';
import TripCreate from './pages/CreateTrip';
import './App.css';

const App: React.FC = () => {
  const [view, setView] = useState<'search' | 'create'>('search');
  
  // Состояние видимости нижнего меню
  const [isNavVisible, setIsNavVisible] = useState(true);
  
  // Рефы для отслеживания скролла
  const mainRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return;
      
      const currentScrollY = mainRef.current.scrollTop;
      const scrollDiff = currentScrollY - lastScrollY.current;

      // Логика:
      // 1. Если скроллим ВНИЗ (> 10px) -> скрываем меню
      // 2. Если скроллим ВВЕРХ (< -5px) -> показываем меню
      // 3. Если мы в самом верху (< 50px) -> всегда показываем
      
      if (currentScrollY < 50) {
        setIsNavVisible(true);
      } else if (scrollDiff > 10) {
        setIsNavVisible(false);
      } else if (scrollDiff < -5) {
        setIsNavVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    const element = mainRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-0 sm:p-4 font-sans text-gray-900">
      
      {/* КОНТЕЙНЕР ПРИЛОЖЕНИЯ */}
      <div className="w-full max-w-md bg-gray-50 h-[100dvh] sm:h-[850px] sm:rounded-[45px] shadow-2xl overflow-hidden relative flex flex-col ring-8 ring-black">
        
        {/* ==========================================
            ОСНОВНОЙ КОНТЕНТ
           ========================================== */}
        <main 
          ref={mainRef}
          className="flex-1 overflow-y-auto bg-gray-50 relative no-scrollbar scroll-smooth"
          style={{ 
            WebkitOverflowScrolling: "touch",
            paddingTop: "20px", // Небольшой отступ сверху, чтобы не прилипало к краю экрана
            paddingBottom: "100px" // Отступ снизу, чтобы контент не перекрывался меню
          }}
        >
          {/* Декоративный фон (синее пятно сверху) */}
          
          <div className="relative z-10 px-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {view === 'search' ? (
              <SearchPage />
            ) : (
              <TripCreate />
            )}
          </div>
        </main>

        {/* ==========================================
            НИЖНЯЯ НАВИГАЦИЯ (Плавающая)
           ========================================== */}
        <div 
          className={`absolute bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] 
          ${isNavVisible ? 'translate-y-0' : 'translate-y-32'}`}
        >
           <nav className="pointer-events-auto flex items-center p-1.5 bg-black/80 backdrop-blur-xl rounded-[28px] border border-white/10 shadow-2xl shadow-black/20 ring-1 ring-white/5">
             
             {/* Кнопка ПОИСК */}
             <button 
               onClick={() => setView('search')}
               className={`relative flex items-center justify-center h-12 rounded-[22px] transition-all duration-300 ease-out ${
                 view === 'search' 
                   ? 'bg-white text-black px-6 shadow-lg shadow-white/10' 
                   : 'text-gray-400 hover:text-white px-4 hover:bg-white/10'
               }`}
             >
               <Search className={`w-5 h-5 transition-transform duration-300 ${view === 'search' ? 'scale-100' : 'scale-90'}`} strokeWidth={view === 'search' ? 2.5 : 2} />
               
               {view === 'search' && (
                 <span className="ml-2 text-xs font-bold uppercase tracking-wide whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                   Поиск
                 </span>
               )}
             </button>

             {/* Разделитель */}
             <div className="w-px h-5 bg-white/10 mx-1"></div>

             {/* Кнопка СОЗДАТЬ */}
             <button 
               onClick={() => setView('create')}
               className={`relative flex items-center justify-center h-12 rounded-[22px] transition-all duration-300 ease-out ${
                 view === 'create' 
                   ? 'bg-blue-600 text-white px-6 shadow-lg shadow-blue-500/40' 
                   : 'text-gray-400 hover:text-white px-4 hover:bg-white/10'
               }`}
             >
               <PlusCircle className={`w-5 h-5 transition-transform duration-300 ${view === 'create' ? 'scale-100' : 'scale-90'}`} strokeWidth={view === 'create' ? 2.5 : 2} />
               
               {view === 'create' && (
                 <span className="ml-2 text-xs font-bold uppercase tracking-wide whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-right-2 duration-300">
                   Создать
                 </span>
               )}
             </button>

           </nav>
        </div>

      </div>
    </div>
  );
};

export default App;