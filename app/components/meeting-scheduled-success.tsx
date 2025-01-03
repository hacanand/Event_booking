import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface MeetingScheduledSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  time: string;
}

export function MeetingScheduledSuccess({
  isOpen,
  onClose,
  date,
  time,
}: MeetingScheduledSuccessProps) {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-gradient-to-br from-[#00FF8C] to-[#14144B] p-8 rounded-lg shadow-lg text-center max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <CalendarCheck className="w-24 h-24 text-white mx-auto mb-4" />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold text-white">
                Meeting Scheduled!
              </h2>
              <div className="text-white/90 space-y-2">
                <p className="text-xl">Your meeting has been scheduled for:</p>
                <p className="text-2xl font-semibold">
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-2xl font-semibold">at {time}</p>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/75 text-sm mt-4"
              >
                Redirecting to dashboard...
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
