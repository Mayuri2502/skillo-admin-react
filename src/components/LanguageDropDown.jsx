import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
// import i18n from "../i18n";

const languages = [
  {
    code: "en",
    name: "English",
    flag: "https://flagcdn.com/gb.svg",
  },
  {
    code: "fr",
    name: "French",
    flag: "https://flagcdn.com/fr.svg",
  },
];

export default function LanguageSwitch({ className = "", customStyle = "" }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang =
    languages.find((l) => i18n.language?.startsWith(l.code)) || languages[0];

  const changeLanguage = (newLang) => {
    if (newLang === i18n.language) {
      setOpen(false);
      return;
    }

    localStorage.setItem("coudPouss-language", newLang);
    i18n.changeLanguage(newLang);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative flex justify-center items-center text-left select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 cursor-pointer border rounded-[10px]  border-[#285B7A]/30 px-3 py-1 bg-white`}
      >
        <img
          src={currentLang.flag}
          alt={`${currentLang.name} flag`}
          className="w-5 h-5 rounded-full object-cover"
        />

        <span className="text-sm font-medium text-[#285B7A]">
          {currentLang.name}
        </span>
      </button>

      {open && (
        <div
          className={`absolute w-40 bg-white border border-[#285B7A]/30 rounded-xl shadow-xl z-20 animate-fade-in right-0 top-12 ${customStyle}`}
          role="listbox"
        >
          {languages.map((lang) => (
            <div
              key={lang.code}
              role="option"
              aria-selected={i18n.language === lang.code}
              className={`flex items-center gap-3 px-4 py-2 w-full text-left transition-colors duration-150 rounded-lg cursor-pointer ${
                i18n.language === lang.code
                  ? "bg-[#285B7A]/10 text-[#285B7A] font-bold"
                  : "hover:bg-[#285B7A]/5 text-gray-700"
              } focus:outline-none focus:bg-[#285B7A]/20`}
              onClick={() => changeLanguage(lang.code)}
            >
              <img
                src={lang.flag}
                alt={`${lang.name} flag`}
                className="w-5 h-5 rounded-full border border-gray-200"
              />
              <span className="text-base">{lang.name}</span>
              {i18n.language === lang.code && (
                <svg
                  className="w-4 h-4 ml-auto text-[#285B7A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.18s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
