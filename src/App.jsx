import React, { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Accordion from '@radix-ui/react-accordion';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Progress from '@radix-ui/react-progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ChefHat, 
  ClipboardList, 
  ShoppingCart, 
  ChevronDown, 
  Check, 
  Clock, 
  Flame, 
  User,
  Coffee,
  Info,
  Zap,
  Leaf
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import * as data from './data';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TabButton = ({ value, icon: Icon, label, activeTab }) => (
  <Tabs.Trigger
    value={value}
    className={cn(
      "flex flex-col items-center justify-center py-3 px-1 transition-all duration-300 relative min-w-[80px] md:min-w-[120px]",
      "text-sm font-medium",
      activeTab === value ? "text-black" : "text-gray-500 hover:text-black"
    )}
  >
    <Icon className={cn("w-5 h-5 mb-1", activeTab === value ? "scale-110" : "scale-100")} />
    <span className="hidden md:inline">{label}</span>
    <span className="md:hidden text-[10px] uppercase tracking-wider">{label.split(' ')[0]}</span>
    {activeTab === value && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 rounded-t-full"
      />
    )}
  </Tabs.Trigger>
);

const Card = ({ children, className, title, icon: Icon }) => (
  <div className={cn("glass-card p-6 mb-6", className)}>
    {title && (
      <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
        {Icon && <Icon className="w-5 h-5 text-yellow-600" />}
        <h3 className="font-serif text-xl font-semibold text-gray-800">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-yellow-100 text-yellow-800',
    her: 'bg-emerald-100 text-emerald-800',
    him: 'bg-lime-100 text-lime-800',
    warn: 'bg-red-100 text-red-800',
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('meals');
  const [activeWeek, setActiveWeek] = useState(1);
  const [checkState, setCheckState] = useState(() => {
    const saved = localStorage.getItem('checklist');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('checklist', JSON.stringify(checkState));
  }, [checkState]);

  const toggleCheck = (id) => {
    setCheckState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const progress = Math.round(
    (Object.values(checkState).filter(Boolean).length / data.checklistItems.length) * 100
  );

  return (
    <div className="min-h-screen bg-yellow-50/30">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-yellow-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-200">
              <Flame className="w-6 h-6 text-black" fill="currentColor" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold leading-none tracking-tight">
                100-Day <span className="text-yellow-600">Nutrition</span>
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mt-1">Her & Him · Fresh Indian Food</p>
            </div>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 italic text-sm">
              <User className="w-4 h-4" /> Her: 1650 kcal
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-lime-50 text-lime-700 rounded-full border border-lime-100 italic text-sm">
              <User className="w-4 h-4" /> Him: 1900 kcal
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 pb-32 md:pb-8">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          {/* Navigation - Top on desktop, Bottom on Mobile */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-yellow-100 md:relative md:bg-transparent md:border-none md:mb-8 z-40">
            <Tabs.List className="max-w-xl mx-auto md:max-w-none px-4 flex justify-between md:justify-start md:gap-4 overflow-x-auto no-scrollbar">
              <TabButton value="meals" icon={Calendar} label="Daily Plan" activeTab={activeTab} />
              <TabButton value="prep" icon={ClipboardList} label="Sunday Prep" activeTab={activeTab} />
              <TabButton value="recipes" icon={ChefHat} label="Recipes" activeTab={activeTab} />
              <TabButton value="grocery" icon={ShoppingCart} label="Groceries" activeTab={activeTab} />
            </Tabs.List>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Tabs.Content value="meals" className="space-y-6">
                {/* Weekly Selector */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                  {[1, 2, 3, 4].map(w => (
                    <button
                      key={w}
                      onClick={() => setActiveWeek(w)}
                      className={cn(
                        "flex-1 min-w-[100px] py-3 rounded-2xl font-bold transition-all duration-300",
                        activeWeek === w 
                          ? "bg-yellow-400 text-black shadow-lg shadow-yellow-100 scale-105" 
                          : "bg-white text-gray-400 hover:bg-yellow-50"
                      )}
                    >
                      Week {w}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card title="Focus" icon={Zap} className="md:col-span-2">
                    <p className="text-gray-600 leading-relaxed italic">{data.weeks[activeWeek-1].note}</p>
                  </Card>
                  <Card title="Quick Tip" icon={Info}>
                    <p className="text-sm text-gray-500">Caffeine cutoff: 2:30 PM. No milk/sugar in evening tea.</p>
                  </Card>
                </div>

                {/* Days Display */}
                <div className="space-y-4">
                  {data.weeks[activeWeek-1].days.map((day, idx) => (
                    <Card key={idx} className="p-0 overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className={cn(
                          "md:w-32 flex flex-col items-center justify-center py-4 bg-gray-50 border-r border-gray-100",
                          day[0] === 'Sun' ? 'bg-yellow-400/10' : ''
                        )}>
                          <span className="text-2xl font-black text-gray-300 uppercase leading-none">{day[0]}</span>
                          <Badge variant="default" className="mt-2">{day[1]}</Badge>
                        </div>
                        <div className="flex-1 p-5 grid md:grid-cols-3 gap-6 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-lime-700 font-bold uppercase text-[10px] tracking-widest">
                              <span className="w-1.5 h-1.5 rounded-full bg-lime-500" /> Him: Tiffin
                            </div>
                            <p className="text-gray-700 font-medium leading-relaxed">{day[2]}</p>
                          </div>
                          <div className="space-y-2 bg-emerald-50/30 p-3 rounded-xl">
                            <div className="flex items-center gap-2 text-emerald-700 font-bold uppercase text-[10px] tracking-widest">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Her: Lunch
                            </div>
                            <p className="text-gray-700 font-medium leading-relaxed">{day[3]}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-yellow-700 font-bold uppercase text-[10px] tracking-widest">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Dinner Shared
                            </div>
                            <p className="text-gray-700 font-medium leading-relaxed">{day[4]}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Profiles & Schedules */}
                <div className="grid md:grid-cols-2 gap-8 pt-8">
                  <section>
                    <h2 className="font-serif text-2xl mb-4 px-2 flex items-center gap-2">
                      <Clock className="text-yellow-500" /> Daily Schedule
                    </h2>
                    <div className="space-y-4">
                      <Card className="border-l-4 border-l-lime-500">
                        <h4 className="font-bold text-lime-800 mb-3 flex items-center justify-between">
                          Him - Weekday Routine <Badge variant="him">Work Commute</Badge>
                        </h4>
                        <div className="space-y-3">
                          {data.hisSchedule.map((s, i) => (
                            <div key={i} className="flex gap-3 text-xs border-b border-gray-50 pb-2 last:border-0">
                              <span className="text-gray-400 font-mono w-16 shrink-0">{s[0]}</span>
                              <div>
                                <strong className="text-gray-800 block">{s[1]}</strong>
                                <span className="text-gray-500">{s[2]}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                      <Card className="border-l-4 border-l-emerald-500">
                        <h4 className="font-bold text-emerald-800 mb-3 flex items-center justify-between">
                          Her - Weekday Routine <Badge variant="her">WFH Flexible</Badge>
                        </h4>
                        <div className="space-y-3">
                          {data.herSchedule.map((s, i) => (
                            <div key={i} className="flex gap-3 text-xs border-b border-gray-50 pb-2 last:border-0">
                              <span className="text-gray-400 font-mono w-16 shrink-0">{s[0]}</span>
                              <div>
                                <strong className="text-gray-800 block">{s[1]}</strong>
                                <span className="text-gray-500">{s[2]}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </section>
                  <section>
                    <h2 className="font-serif text-2xl mb-4 px-2 flex items-center gap-2">
                      <User className="text-yellow-500" /> Profiles & Goals
                    </h2>
                    <Card className="p-0 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                            <th className="px-6 py-3">Metric</th>
                            <th className="px-6 py-3 text-emerald-700">Her</th>
                            <th className="px-6 py-3 text-lime-700">Him</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {[
                            ["Goal", "Fat loss + recompo", "Fat loss + waist red."],
                            ["Target kcal", "1550-1650", "1750-1900"],
                            ["Protein", "100-110g", "145-160g"],
                            ["Work", "WFH", "Office dev (Mon-Fri)"],
                            ["Wake up", "7:30 AM", "7:00 AM"],
                            ["Lunch", "Fresh-cooked", "Previous dinner tiffin"],
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-yellow-50/30 transition-colors">
                              <td className="px-6 py-3 font-bold text-gray-400">{row[0]}</td>
                              <td className="px-6 py-3 text-gray-700 font-medium">{row[1]}</td>
                              <td className="px-6 py-3 text-gray-700 font-medium">{row[2]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Card>
                  </section>
                  <section>
                    <h2 className="font-serif text-2xl mb-4 px-2 flex items-center gap-2">
                      <Leaf className="text-emerald-500" /> Health Habits
                    </h2>
                    <div className="space-y-4">
                      <Card title="Things to Avoid" icon={Info} className="border-l-4 border-l-red-500">
                        <div className="space-y-3">
                          {data.avoidList.slice(0, 5).map((h, i) => (
                            <div key={i} className="flex gap-2 text-sm italic py-1 border-b border-gray-50 last:border-0">
                              <span className="text-red-500 font-bold shrink-0">✕</span>
                              <span>{h[1]}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                      <Card title="Leverage Habits" icon={Zap} className="border-l-4 border-l-yellow-400">
                        <div className="space-y-3">
                          {data.doList.slice(0, 5).map((h, i) => (
                            <div key={i} className="flex gap-2 text-sm py-1 border-b border-gray-50 last:border-0">
                              <span className="text-emerald-500 font-bold shrink-0">✓</span>
                              <span>{h[1]}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </section>
                </div>
              </Tabs.Content>

              <Tabs.Content value="prep" className="space-y-6">
                <Card className="bg-yellow-400 text-black">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tight">Sunday Reset</h2>
                      <p className="font-medium opacity-80">90 minutes to a perfect week</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black">{progress}%</div>
                      <p className="text-xs uppercase font-bold tracking-widest opacity-60">Complete</p>
                    </div>
                  </div>
                  <Progress.Root className="h-3 w-full bg-black/10 rounded-full mt-6 overflow-hidden">
                    <Progress.Indicator 
                      className="h-full bg-white transition-all duration-500" 
                      style={{ width: `${progress}%` }} 
                    />
                  </Progress.Root>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card title="Sunday Tasks" icon={ClipboardList}>
                    <div className="space-y-4">
                      {data.checklistItems.map((item, i) => (
                        <label key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-yellow-50/50 cursor-pointer transition-colors border border-transparent hover:border-yellow-100 items-start">
                          <Checkbox.Root
                            checked={checkState[i]}
                            onCheckedChange={() => toggleCheck(i)}
                            className="w-6 h-6 rounded-lg border-2 border-yellow-200 bg-white flex items-center justify-center shrink-0 mt-0.5 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 transition-all"
                          >
                            <Checkbox.Indicator>
                              <Check className="w-4 h-4 text-black stroke-[3px]" />
                            </Checkbox.Indicator>
                          </Checkbox.Root>
                          <div className="flex flex-col">
                            <span className={cn("font-bold text-gray-800", checkState[i] && "line-through text-gray-300 opacity-50")}>
                              {item[0]}
                            </span>
                            {item[1] && <span className="text-xs text-gray-400 mt-1">{item[1]}</span>}
                          </div>
                        </label>
                      ))}
                    </div>
                  </Card>

                  <div className="space-y-6">
                    <Card title="Mid-Week Boost (5 min)" icon={Zap}>
                      <div className="space-y-4">
                        {data.midweek.map((m, i) => (
                          <div key={i} className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                            <div className="flex items-center gap-2 mb-1 text-yellow-600 font-black uppercase text-[10px] tracking-widest">
                               <span className="w-1 h-1 rounded-full bg-yellow-400" /> {m[0]}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed font-medium">{m[1]}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card title="Seed Rotation" icon={Leaf}>
                       <table className="w-full text-sm">
                         <thead>
                           <tr className="text-left text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100">
                             <th className="pb-2">Day</th>
                             <th className="pb-2">Seed</th>
                           </tr>
                         </thead>
                         <tbody>
                           {data.seeds.map((s, i) => (
                             <tr key={i} className="border-b border-gray-50 last:border-0">
                               <td className="py-2.5 font-bold text-gray-400">{s[0]}</td>
                               <td className="py-2.5 text-gray-700 font-medium">{s[1]}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                    </Card>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="recipes" className="space-y-6">
                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                  {data.recipes.map((recipe, i) => (
                    <Card key={i} className="break-inside-avoid p-0 overflow-hidden group">
                      <div className="p-6 bg-yellow-400/5 border-b border-yellow-100">
                        <div className="flex items-center justify-between mb-2">
                           <h3 className="font-serif text-2xl font-bold group-hover:text-yellow-600 transition-colors">{recipe.title}</h3>
                           <Coffee className="text-yellow-300 group-hover:text-yellow-500 transition-colors" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{recipe.meta}</p>
                      </div>
                      <div className="p-6 text-sm">
                        <ul className="space-y-3 mb-6">
                          {recipe.steps.map((step, si) => (
                            <li key={si} className="flex gap-3 text-gray-600 leading-relaxed">
                              <span className="text-yellow-400 font-black shrink-0">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-lime-50 p-3 rounded-xl border border-lime-100">
                             <div className="text-[10px] font-black uppercase tracking-widest text-lime-600 mb-1">Him Portion</div>
                             <p className="text-xs text-lime-800 font-medium leading-relaxed">{recipe.him}</p>
                          </div>
                          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                             <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Her Portion</div>
                             <p className="text-xs text-emerald-800 font-medium leading-relaxed">{recipe.her}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Tabs.Content>

              <Tabs.Content value="grocery" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.grocery.map((section, i) => (
                    <Card key={i} title={section.title} icon={ShoppingCart} className="h-fit">
                      <div className="space-y-3">
                        {section.items.map((item, ii) => (
                          <div key={ii} className="flex flex-col border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                               <span className="font-bold text-gray-800 text-sm">{item[0]}</span>
                               <span className="text-[10px] font-black text-yellow-600 whitespace-nowrap ml-2">{item[1]}</span>
                            </div>
                            <span className="text-[11px] text-gray-400 italic leading-snug">{item[2]}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </Tabs.Content>
            </motion.div>
          </AnimatePresence>
        </Tabs.Root>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-400 text-xs font-bold uppercase tracking-[0.3em] pb-32 md:pb-12">
        <p>Stay Disciplined · Stay Fresh · 100-Day Plan</p>
      </footer>
    </div>
  );
}
