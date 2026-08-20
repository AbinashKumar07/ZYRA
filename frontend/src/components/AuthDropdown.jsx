import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, User, Store, Scissors, Navigation } from "lucide-react";

export default function AuthDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // This automatically closes the dropdown if the user clicks anywhere else on the screen
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roles = [
    { name: "Customer", icon: User, path: "/auth/customer" },
    { name: "Merchant", icon: Store, path: "/auth/merchant" },
    { name: "Tailor", icon: Scissors, path: "/auth/tailor" },
    { name: "Captain", icon: Navigation, path: "/auth/captain" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="z-btn z-btn-ghost flex items-center gap-2 !px-5 !py-2.5 !text-[0.7rem] whitespace-nowrap"
      >
        Sign In / Sign Up
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* The Animated Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 rounded-xl border border-[var(--z-border)] bg-[var(--z-card)] p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.name}
                to={role.path}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[var(--z-text)] transition-all hover:bg-[var(--z-purple)] hover:text-white"
              >
                <Icon size={16} />
                {role.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}