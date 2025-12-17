import { useState } from "react";
import { FeedingPlans } from "./features/feeding-plan/components/FeedingPlan";
import { FeedingSchedule } from "./features/feeding-schedule/components/FeedingSchedule";
import { FeedingEventsList } from "./features/feeding-events/components/FeedingEventsList";
import { Layout } from "./layout/components/Layout";
import { motion, AnimatePresence } from "motion/react";
import { LayoutGrid, Calendar, ClipboardList } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("records"); // Default to records as it's the real feature

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans text-gray-900">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Navigation Tabs */}
          <div className="flex justify-center sticky top-4 z-30">
            <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-gray-100 inline-flex gap-2">
              <button
                onClick={() => setActiveTab("records")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === "records"
                    ? "bg-farm-green-600 text-white shadow-md scale-105"
                    : "text-gray-600 hover:bg-gray-50 hover:text-farm-green-600"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Registros
              </button>
              <button
                onClick={() => setActiveTab("plans")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === "plans"
                    ? "bg-farm-green-600 text-white shadow-md scale-105"
                    : "text-gray-600 hover:bg-gray-50 hover:text-farm-green-600"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Planes (Demo)
              </button>
              <button
                onClick={() => setActiveTab("schedule")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === "schedule"
                    ? "bg-farm-green-600 text-white shadow-md scale-105"
                    : "text-gray-600 hover:bg-gray-50 hover:text-farm-green-600"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Horario (Demo)
              </button>
            </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "records" && <FeedingEventsList />}
              {activeTab === "plans" && <FeedingPlans />}
              {activeTab === "schedule" && <FeedingSchedule />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}

export default App;
