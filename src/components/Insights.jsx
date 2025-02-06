import React from "react";
import PropTypes from "prop-types";
import { Users, TrendingUp, AlertCircle } from "lucide-react";

const InsightCard = ({ title, value, icon: Icon, iconColor, bgColor }) => (
  <div
    className={`${bgColor} min-w-[280px] sm:min-w-0 p-5 sm:p-6 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm hover:shadow-xl hover:border-slate-600/50 transition-all duration-300 relative overflow-hidden`}
  >
    {/* Background Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent" />

    {/* Decorative Elements */}
    <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />
    <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-2xl" />

    {/* Main Content */}
    <div className="relative flex items-center gap-4 sm:gap-0 sm:justify-between">
      <div className="flex sm:block items-center gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-slate-400 text-xs sm:text-sm font-medium order-2 sm:order-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 text-transparent bg-clip-text order-1 sm:order-2 tracking-tight">
            {value}
          </h3>
        </div>
      </div>

      {/* Icon Container with Glow Effect */}
      <div
        className={`relative group ${iconColor} bg-opacity-10 rounded-xl p-2.5 sm:p-3 backdrop-blur-sm 
          before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-0 
          hover:before:opacity-100 before:transition-opacity`}
      >
        <div
          className={`absolute inset-0 ${iconColor} opacity-20 blur-lg rounded-xl group-hover:opacity-30 transition-opacity`}
        />
        <Icon
          className={`h-7 w-7 sm:h-8 sm:w-8 ${iconColor} relative z-10 transition-transform group-hover:scale-110`}
        />
      </div>
    </div>

    {/* Bottom Progress Indicator */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
  </div>
);

const Insights = ({ totalEntries, todayEntries }) => {
  const completionRate = Math.round((totalEntries / (totalEntries + 1)) * 100);

  const cards = [
    {
      title: "Total Applications",
      value: totalEntries.toLocaleString(),
      icon: Users,
      iconColor: "text-blue-400",
      bgColor:
        "bg-gradient-to-br from-blue-500/10 via-slate-800/50 to-slate-800/50",
    },
    {
      title: "Today's Applications",
      value: todayEntries.toLocaleString(),
      icon: TrendingUp,
      iconColor: "text-teal-400",
      bgColor:
        "bg-gradient-to-br from-teal-500/10 via-slate-800/50 to-slate-800/50",
    },
    {
      title: "Processing Rate",
      value: `${completionRate}%`,
      icon: AlertCircle,
      iconColor: "text-sky-400",
      bgColor:
        "bg-gradient-to-br from-sky-500/10 via-slate-800/50 to-slate-800/50",
    },
  ];

  return (
    <div className="relative -mx-3 sm:mx-0">
      {/* Fade edges on mobile */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 to-transparent sm:hidden z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent sm:hidden z-10" />

      {/* Scrollable container */}
      <div className="overflow-x-auto pb-4 sm:pb-0 hide-scrollbar">
        <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 px-3 sm:px-0">
          {cards.map((card, index) => (
            <InsightCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              iconColor={card.iconColor}
              bgColor={card.bgColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

InsightCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  iconColor: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
};

Insights.propTypes = {
  totalEntries: PropTypes.number.isRequired,
  todayEntries: PropTypes.number.isRequired,
};

export default Insights;
