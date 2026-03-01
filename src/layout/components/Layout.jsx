import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Beef,
  Calendar,
  ClipboardList,
  Menu,
  Bell,
  Search,
  Building2,
} from "lucide-react";
import { useAuthStore } from "@shared/store/authStore";

export function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const { user, selectedFarm } = useAuthStore();

  const displayName = user?.name || user?.fullName || "Nikol Velasquez";
  const userInitial = displayName[0]?.toUpperCase() || "N";
  const userRole = user?.role || "Operador";

  const menuItems = [
    { title: "Dashboard", icon: LayoutGrid, active: false },
    { title: "Animales", icon: Beef, active: false },
    { title: "Salud", icon: Calendar, active: false },
    { title: "Alimentación", icon: ClipboardList, active: true },
  ];

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Sidebar Mockup */}
      <motion.aside
        initial={{ width: isOpen ? 256 : 80 }}
        animate={{ width: isOpen ? 256 : 80 }}
        className="fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-50 flex flex-col shadow-sm"
      >
        <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-50 bg-white">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white flex-shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="font-bold text-gray-800 text-sm whitespace-nowrap leading-tight">
                  BioTech Farm
                </span>
                <span className="text-[10px] text-gray-500 whitespace-nowrap leading-tight font-bold uppercase tracking-wider">
                  Standalone
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.title}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                item.active
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 font-medium"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <span className="text-sm whitespace-nowrap">{item.title}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Wrapper */}
      <div
        className="flex-1 transition-all duration-300 ease-in-out flex flex-col"
        style={{ marginLeft: isOpen ? "256px" : "80px" }}
      >
        <header className="h-16 shrink-0 items-center gap-2 border-b bg-white px-4 flex justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Menu className="w-5 h-5 mr-1 lg:hidden text-gray-400" />
            <span className="font-medium text-foreground truncate max-w-[100px] sm:max-w-none">
              BioTech Farm
            </span>
            <span className="text-gray-300">/</span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[10px] sm:text-xs font-bold truncate">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {selectedFarm?.name || "GRANJA ACTIVA"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </div>

            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer group">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm group-hover:scale-105 transition-transform">
                {userInitial}
              </div>
              <div className="flex flex-col items-start leading-none min-w-0">
                <span className="text-sm font-bold text-gray-800 group-hover:text-green-700 transition-colors truncate max-w-[80px] sm:max-w-[150px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 truncate">
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content matching Shell strukture */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-screen md:min-h-min flex-1 rounded-xl bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
