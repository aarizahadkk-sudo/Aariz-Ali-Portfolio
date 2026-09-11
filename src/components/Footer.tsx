import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  isAdmin: boolean;
  onTriggerAdminAuth: () => void;
  onOpenAdminPanel: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isAdmin,
  onTriggerAdminAuth,
  onOpenAdminPanel,
}) => {
  return (
    <motion.footer
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="relative bg-[#0b0f19] border-t border-white/10 py-8 mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Extreme bottom-left subtle padlock icon with bouncy pop-in and hover */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <motion.button
              whileHover={{ scale: 1.25, rotate: 12 }}
              whileTap={{ scale: 0.85 }}
              onClick={isAdmin ? onOpenAdminPanel : onTriggerAdminAuth}
              title={isAdmin ? 'Admin Console (Unlocked)' : 'Administrative Access'}
              aria-label="Administrative Access"
              className="p-2 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-colors duration-200 cursor-pointer"
            >
              {isAdmin ? (
                <Unlock className="w-4 h-4 text-amber-400" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </motion.button>

            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Aariz Ahad. Built with ASP.NET Core &amp; EF Core principles.
            </p>
          </div>

          {/* Nav quick links with spring pop */}
          <div className="flex items-center gap-6 text-xs text-slate-400">
            {['about', 'projects', 'architecture', 'contact'].map((section) => (
              <motion.a
                key={section}
                href={`#${section}`}
                whileHover={{ scale: 1.12, color: '#fbbf24' }}
                whileTap={{ scale: 0.94 }}
                className="capitalize hover:text-amber-400 transition-colors"
              >
                {section}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
