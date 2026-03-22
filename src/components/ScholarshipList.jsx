import { useState, useRef, useEffect } from 'react';
import { getSaved, toggleSaved } from '../lib/tracker.js';
import { CATEGORY_ICONS, REGION_ICONS } from '../lib/icons.js';
import { SvgIcon, today } from '../lib/utils.jsx';

const CATEGORY_ACCENT = {
  Academic:   '#60a5fa',
  Indigenous: '#fb923c',
  Arts:       '#a78bfa',
  Trades:     '#34d399',
  Community:  '#f472b6',
};

const REGION_PILLS = [
  { value: 'Medicine Hat', label: 'Medicine Hat', iconKey: 'Medicine Hat' },
  { value: 'Alberta-wide', label: 'Alberta',  iconKey: 'Alberta-wide' },
  { value: 'National',     label: 'National', iconKey: 'National' },
];

// Maps a pill value to a scholarship region matcher
const PROVINCIAL_REGIONS = new Set(['Alberta', 'Alberta-wide', 'Calgary', 'Edmonton', 'Lethbridge', 'Medicine Hat']);
const REGION_MATCH = {
  'Alberta-wide': s => PROVINCIAL_REGIONS.has(s.region),
  'Medicine Hat': s => s.region === 'Medicine Hat',
  'National':     s => s.region === 'National',
};

function getStatus(s) {
  const open     = new Date(s.open_date + 'T00:00:00');
  const deadline = new Date(s.deadline  + 'T00:00:00');
  if (today < open)     return 'future';
  if (today > deadline) return 'closed';
  return 'active';
}

// ── Scholarship card ───────────────────────────────────────────
function ScholarshipCard({ scholarship, animClass, delay, isSaved, onToggleSave, isExpiredSaved }) {
  const status        = getStatus(scholarship);
  const isClosed      = status === 'closed';
  const daysLeft      = status === 'active'
    ? Math.ceil((new Date(scholarship.deadline + 'T00:00:00') - today) / 86400000)
    : null;
  const deadlineSoon  = daysLeft !== null && daysLeft <= 30;
  const accentColor   = CATEGORY_ACCENT[scholarship.category];

  const isUpcoming = status === 'future';
  const showBadge = isExpiredSaved || isUpcoming;
  const statusLabel = isExpiredSaved ? 'Expired' : 'Upcoming';
  const statusBadgeStyle = isExpiredSaved
    ? { background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }
    : { background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' };

  const amountColor = isClosed
    ? 'text-gray-300 dark:text-white/20'
    : 'text-[#22d3a5]';

  return (
    <div
      className={`${animClass} card ${isClosed ? '' : 'card-interactive'} p-5`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: 280,
        opacity: isClosed ? 0.45 : isUpcoming ? 0.75 : undefined,
        animationDelay: `${delay}ms`,
        borderTop: accentColor ? `2px solid ${accentColor}` : undefined,
      }}
    >
      {/* TOP SECTION */}
      <div>
        {/* Category badge + status pill */}
        <div className="flex items-start justify-between gap-2 mb-3">
          {scholarship.category ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-200 dark:bg-white/[0.07] dark:text-white/50 dark:border-white/10">
              <SvgIcon svg={CATEGORY_ICONS[scholarship.category]} size={22} />
              {scholarship.category}
            </span>
          ) : <span />}
          <div className="flex items-center gap-1 flex-shrink-0">
            {showBadge && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap" style={statusBadgeStyle}>
                {statusLabel}
              </span>
            )}
            <button
              onClick={(e) => { e.preventDefault(); onToggleSave(); }}
              className={`transition-colors ${isSaved ? 'text-[#22d3a5]' : 'text-gray-300 hover:text-gray-400 dark:text-white/20 dark:hover:text-white/35'}`}
              aria-label={isSaved ? 'Remove bookmark' : 'Bookmark'}
              style={{ lineHeight: 0 }}
            >
              {isSaved ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Title + audience */}
        <h2 className={`font-syne font-bold text-base leading-snug mb-2 ${isClosed ? 'text-gray-400 dark:text-white/25' : 'text-gray-900 dark:text-white'}`}>
          {scholarship.title}
        </h2>
        <p className="text-sm line-clamp-2 mb-2 text-gray-500 dark:text-white/45">
          {scholarship.audience}
        </p>

        {/* Amount + deadline */}
        <div className="pt-4 grid grid-cols-2 gap-2 border-t border-gray-100 dark:border-white/[0.06]">
          <div>
            <p className={`font-syne ${amountColor}`} style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
              {scholarship.amount}
            </p>
          </div>
          <div className="text-right flex flex-col items-end overflow-hidden">
            <p style={{
              fontSize: 12,
              fontWeight: 700,
              color: isClosed
                ? undefined
                : status === 'future'
                ? undefined
                : deadlineSoon ? '#f87171' : undefined,
            }} className={isClosed ? 'text-gray-300 dark:text-white/20' : status === 'future' ? 'text-blue-500 dark:text-blue-400' : deadlineSoon ? '' : 'text-gray-600 dark:text-white/50'}>
              {status === 'future' ? scholarship.open_date : scholarship.deadline}
            </p>
            {status === 'active' && daysLeft !== null && daysLeft <= 60 && (
              <span style={{
                fontSize: 9,
                marginTop: 2,
                color: daysLeft <= 30 ? '#f87171' : 'rgba(128,128,128,0.45)',
              }}>
                {daysLeft === 0 ? 'Ends today' : daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION — button */}
      <div style={{ paddingTop: 16 }}>
        {isClosed ? (
          <button disabled className="w-full py-2.5 rounded-[10px] text-sm font-semibold cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-white/20">
            Closed
          </button>
        ) : status === 'future' ? (
          <button disabled className="w-full py-2.5 rounded-[10px] text-sm font-semibold cursor-not-allowed bg-blue-50 text-blue-400 dark:bg-blue-500/[0.08] dark:text-blue-400">
            Opening Soon
          </button>
        ) : (
          <a href={scholarship.url} target="_blank" rel="noopener noreferrer"
            className="block w-full text-center py-2.5 px-4 rounded-[10px] text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: '#22d3a5', color: '#0a0a0f' }}>
            Apply Now
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main list ──────────────────────────────────────────────────
export default function ScholarshipList({ initialScholarships }) {
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const [sortBy, setSortBy]               = useState('closest_due');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isBookmarked, setIsBookmarked]   = useState(false);
  const [visibleCount, setVisibleCount]   = useState(16);

  const [savedIds, setSavedIds] = useState(() =>
    typeof localStorage !== 'undefined' ? getSaved() : []
  );

  const hasFiltered = useRef(false);
  const sentinelRef = useRef(null);

  function handleToggleSave(id) {
    const newSaved = toggleSaved(id);
    setSavedIds([...newSaved]);
  }

  function toggleRegion(region) {
    hasFiltered.current = true;
    setVisibleCount(16);
    setSelectedRegion(prev => prev === region ? null : region);
  }

  // ── Filtering pipeline ─────────────────────────────────────
  const afterRegion = selectedRegion === null
    ? initialScholarships
    : initialScholarships.filter(REGION_MATCH[selectedRegion]);

  const afterActive = showOnlyActive
    ? afterRegion.filter(s => getStatus(s) === 'active')
    : afterRegion.filter(s => getStatus(s) !== 'closed');

  const afterSort = [...afterActive].sort((a, b) => {
    if (sortBy === 'closest_due') return new Date(a.deadline) - new Date(b.deadline);
    const amtA = parseInt(a.amount.replace(/[$,]/g, ''));
    const amtB = parseInt(b.amount.replace(/[$,]/g, ''));
    if (sortBy === 'highest_pay') return amtB - amtA;
    return 0;
  });

  // When saved filter is ON, pull all saved scholarships regardless of active status
  const savedSet = new Set(savedIds);
  const scholarships = isBookmarked
    ? initialScholarships.filter(s => savedSet.has(s.id))
    : afterSort;

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visibleCount >= scholarships.length) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisibleCount(v => v + 16); },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, scholarships.length]);

  const isFiltered    = hasFiltered.current;
  const cardAnimClass = isFiltered ? 'card-instant' : 'card-animate';
  const cardDelay     = (i) => isFiltered ? 0 : i * 30;
  const regionKey     = selectedRegion ?? '';

  return (
    <div>
      {/* Region chips */}
      <div className="chips-row mb-6 flex gap-2 overflow-x-auto" style={{ flexWrap: 'nowrap' }}>
        {REGION_PILLS.map(({ value, label, iconKey }) => {
          const selected = selectedRegion === value;
          return (
            <button key={value} onClick={() => toggleRegion(value)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium cursor-pointer transition-all duration-150 active:scale-95 select-none ${
                selected
                  ? 'text-[#22d3a5]'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 dark:bg-white/[0.03] dark:text-white/45 dark:border-white/10 dark:hover:border-white/20'
              }`}
              style={selected ? { background: 'rgba(34,211,165,0.1)', border: '0.5px solid rgba(34,211,165,0.3)' } : undefined}>
              <SvgIcon svg={REGION_ICONS[iconKey]} size={20} color={selected ? '#22d3a5' : 'currentColor'} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Count + controls row */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-400 dark:text-white/25 flex-shrink-0">
          {scholarships.length} scholarship{scholarships.length !== 1 ? 's' : ''}
          <span style={{ margin: '0 5px', opacity: 0.5 }}>·</span>
          <button
            onClick={() => { hasFiltered.current = true; setVisibleCount(16); setShowOnlyActive(v => !v); }}
            style={{ fontSize: 'inherit', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', opacity: 0.7 }}
            className="hover:opacity-100 transition-opacity"
          >
            {showOnlyActive ? 'Show all' : 'Active only'}
          </button>
        </p>
        <div className="chips-row flex items-center gap-1.5 overflow-x-auto" style={{ flexWrap: 'nowrap' }}>
          <button
            onClick={() => { hasFiltered.current = true; setVisibleCount(16); setIsBookmarked(v => !v); }}
            aria-label={isBookmarked ? 'Show all scholarships' : 'Show bookmarked only'}
            className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
            style={isBookmarked
              ? { background: '#22d3a5', color: '#0a0a0f' }
              : { border: '1px solid', borderColor: 'rgba(128,128,128,0.25)', color: 'rgba(128,128,128,0.6)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Saved
          </button>
          {[
            { value: 'closest_due', label: 'Earliest Deadline' },
            { value: 'highest_pay', label: 'Highest Amount' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { hasFiltered.current = true; setVisibleCount(16); setSortBy(value); }}
              className={`sort-pill whitespace-nowrap flex-shrink-0${sortBy === value ? ' active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div key={`${isBookmarked}-${regionKey}-${showOnlyActive}-${sortBy}`}
        className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ alignItems: 'stretch' }}>
        {scholarships.slice(0, visibleCount).map((s, i) => (
          <ScholarshipCard
            key={s.id}
            scholarship={s}
            animClass={cardAnimClass}
            delay={cardDelay(i)}
            isSaved={savedIds.includes(s.id)}
            onToggleSave={() => handleToggleSave(s.id)}
            isExpiredSaved={isBookmarked && getStatus(s) === 'closed'}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      {visibleCount < scholarships.length && (
        <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />
      )}

      {/* Empty state */}
      {scholarships.length === 0 && (
        <p className="text-center py-16 text-gray-400 dark:text-white/25">
          {isBookmarked && savedIds.length === 0
            ? 'Bookmark scholarships to track them here.'
            : selectedRegion !== null
            ? 'No scholarships match your filters.'
            : 'No scholarships to show.'}
        </p>
      )}
    </div>
  );
}
