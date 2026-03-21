import { useState, useRef } from 'react';
import { CATEGORY_ICONS } from '../lib/icons.js';
import { SvgIcon, today } from '../lib/utils.jsx';

// Map research categories to icon keys
const RESEARCH_ICON_MAP = {
  'Health Research':   'Health',
  'STEM Research':     'STEM',
  'STEM Mentorship':   'STEM',
  'STEAM Enrichment':  'Arts',
  'Engineering':       'Engineering',
  'Environmental':     'Environmental',
  'Arts/Humanities':   'Arts',
};

const CATEGORY_COLORS = {
  'Health Research': '#f472b6',
  'STEM Research':   '#60a5fa',
  'Engineering':     '#fb923c',
  'Environmental':   '#34d399',
  'Arts/Humanities': '#a78bfa',
};

function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || '#22d3a5';
}

function getStatus(p) {
  if (!p.deadline || p.deadline === 'TBA' || p.deadline === 'Ongoing') return 'tba';
  const deadline = new Date(p.deadline + 'T00:00:00');
  if (today > deadline) return 'closed';
  return 'active';
}

function isWithin30Days(deadlineStr) {
  if (!deadlineStr || deadlineStr === 'TBA' || deadlineStr === 'Ongoing') return false;
  const deadline = new Date(deadlineStr + 'T00:00:00');
  const diff = (deadline - today) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 30;
}

function formatDeadline(str) {
  if (!str || str === 'TBA' || str === 'Ongoing') return str;
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ProgramCard({ program, animClass, delay }) {
  const status        = getStatus(program);
  const isClosed      = status === 'closed';

  const statusLabel = isClosed ? 'Closed' : status === 'tba' ? 'TBA' : 'Open';

  const statusBadgeClass = isClosed
    ? 'bg-gray-100 text-gray-400 border border-gray-200 dark:bg-white/5 dark:text-white/30 dark:border-white/[0.08]'
    : status === 'tba'
    ? 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-white/5 dark:text-white/35 dark:border-white/[0.08]'
    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20';

  const paidBadgeClass = program.paid
    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20'
    : 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-white/5 dark:text-white/35 dark:border-white/[0.08]';

  const deadlineUrgent = !isClosed && status !== 'tba' && isWithin30Days(program.deadline);
  const deadlineColor = isClosed
    ? 'text-gray-300 dark:text-white/20'
    : status === 'tba'
    ? 'text-gray-400 dark:text-white/35'
    : deadlineUrgent
    ? ''
    : 'text-gray-500 dark:text-white/40';

  return (
    <div
      className={`${animClass} card ${isClosed ? '' : 'card-interactive'} p-5`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 320,
        opacity: isClosed ? 0.45 : undefined,
        animationDelay: `${delay}ms`,
        borderTop: `2px solid ${getCategoryColor(program.category)}`,
      }}
    >
      {/* TOP SECTION — everything except the button */}
      <div>
        {/* Category badge */}
        <div className="flex items-start mb-3">
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-200 dark:bg-white/[0.07] dark:text-white/50 dark:border-white/10">
            <SvgIcon svg={CATEGORY_ICONS[RESEARCH_ICON_MAP[program.category]]} size={22} />
            {program.category}
          </span>
        </div>

        {/* Name + provider + meta + description + stipend */}
        <h2 className={`font-syne font-bold text-base leading-snug mb-1 ${isClosed ? 'text-gray-400 dark:text-white/25' : 'text-gray-900 dark:text-white'}`}>
          {program.name}
        </h2>
        <p className="text-xs mb-2 text-gray-400 dark:text-white/30">{program.provider}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          <span className="text-xs text-gray-400 dark:text-white/40">📅 {program.duration}</span>
          <span className="text-xs text-gray-400 dark:text-white/40">🎓 {program.grades}</span>
          <span className="text-xs text-gray-400 dark:text-white/40">📍 {program.location}</span>
        </div>
        <p className="text-sm line-clamp-2 mb-2 text-gray-500 dark:text-white/45">
          {program.description}
        </p>
        {program.paid && program.stipend && (
          <p className="mb-2" style={{ color: '#22d3a5', fontSize: 20, fontWeight: 800 }}>{program.stipend}</p>
        )}

        {/* Eligibility + deadline */}
        <div className="pt-4 grid grid-cols-2 gap-2 border-t border-gray-100 dark:border-white/[0.06]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1 text-gray-400 dark:text-white/30">
              Eligibility
            </p>
            <p className="text-xs leading-snug text-gray-500 dark:text-white/40">
              {program.eligibility}
            </p>
          </div>
          <div className="text-right flex flex-col items-end overflow-hidden">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1 text-gray-400 dark:text-white/30">
              Deadline
            </p>
            <p
              className={`text-sm font-medium ${deadlineColor}`}
              style={deadlineUrgent ? { color: '#f87171' } : undefined}
            >
              {program.deadline === 'Ongoing' ? 'Ongoing' : formatDeadline(program.deadline)}
            </p>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION — button only */}
      <div style={{ paddingTop: 16 }}>
        {isClosed ? (
          <button disabled className="w-full py-2.5 rounded-[10px] text-sm font-semibold cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-white/20">
            Closed
          </button>
        ) : (
          <a href={program.url} target="_blank" rel="noopener noreferrer"
            className="block w-full text-center py-2.5 px-4 rounded-[10px] text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: '#22d3a5', color: '#0a0a0f' }}>
            Learn More
          </a>
        )}
      </div>
    </div>
  );
}

export default function ResearchList({ programs }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const hasFiltered = useRef(false);

  const categories = [...new Set(programs.map(p => p.category))].sort();

  const afterCategory = filterCategory === 'all'
    ? programs
    : programs.filter(p => p.category === filterCategory);

  const sorted = [...afterCategory].sort((a, b) => {
    const order = { active: 0, tba: 1, closed: 2 };
    const sa = getStatus(a), sb = getStatus(b);
    if (order[sa] !== order[sb]) return order[sa] - order[sb];
    if (sa === 'active') return new Date(a.deadline) - new Date(b.deadline);
    return 0;
  });

  const isFiltered    = hasFiltered.current;
  const cardAnimClass = isFiltered ? 'card-instant' : 'card-animate';
  const cardDelay     = (i) => isFiltered ? 0 : i * 30;

  return (
    <div>
      {/* Category pills */}
      <div className="chips-row mb-6 flex gap-2 overflow-x-auto" style={{ flexWrap: 'nowrap' }}>
        {['all', ...categories].map(cat => {
          const selected = filterCategory === cat;
          return (
            <button key={cat}
              onClick={() => { hasFiltered.current = true; setFilterCategory(cat); }}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-150 active:scale-95 select-none ${
                selected
                  ? 'text-[#22d3a5]'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 dark:bg-white/[0.03] dark:text-white/45 dark:border-white/10 dark:hover:border-white/20'
              }`}
              style={selected ? { background: 'rgba(34,211,165,0.1)', border: '0.5px solid rgba(34,211,165,0.3)' } : undefined}>
              {cat === 'all' ? 'All' : cat}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      {sorted.length > 0 && (
        <p className="text-sm mb-5 text-gray-400 dark:text-white/25">
          Showing {sorted.length} program{sorted.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Card grid */}
      <div key={filterCategory} className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ alignItems: 'stretch' }}>
        {sorted.map((p, i) => (
          <ProgramCard key={p.id} program={p} animClass={cardAnimClass} delay={cardDelay(i)} />
        ))}
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <p className="text-center py-16 text-gray-400 dark:text-white/25">
          {filterCategory !== 'all' ? 'No programs match your filters.' : 'No programs to show.'}
        </p>
      )}
    </div>
  );
}
