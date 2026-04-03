import { FeedingEventsList } from "./features/feeding-events/components/FeedingEventsList";
import { Layout } from "./layout/components/Layout";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans text-gray-900">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FeedingEventsList />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}

export default App;
