import React, { useState, useMemo, useRef, useEffect } from "react";
import { X, MapPin } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
  className?: string; // Добавили возможность прокидывать стили снаружи
}

const CitySelect: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  options,
  className = ""
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Фильтрация городов
  const filtered = useMemo(() => {
    if (!value) return options; // Если пусто, показываем популярные/все
    return options.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase())
    );
  }, [value, options]);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: string) => {
    onChange(city);
    setOpen(false);
  };

  const clearInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className={`
            w-full bg-transparent border-none p-0 
            text-base font-bold text-gray-900 
            placeholder:text-gray-300 placeholder:font-medium
            focus:ring-0 outline-none
            truncate pr-6
            ${className}
          `}
        />
        
        {/* Кнопка очистки (появляется, если есть текст) */}
        {value && (
          <button
            onClick={clearInput}
            className="absolute right-0 p-1 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full transition-colors"
          >
            <X size={12} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Выпадающий список */}
      {open && filtered.length > 0 && (
        <div className="absolute left-0 top-full mt-3 w-[calc(100%+20px)] -ml-[10px] bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-64 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="py-2">
            {filtered.map((city, index) => (
              <div
                key={city}
                onClick={() => handleSelect(city)}
                className={`
                  px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors
                  ${index !== filtered.length - 1 ? "border-b border-gray-50" : ""}
                  hover:bg-gray-50 active:bg-blue-50
                `}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                   <MapPin size={14} />
                </div>
                <span className="font-bold text-gray-700 text-sm">{city}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelect;