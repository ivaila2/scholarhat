import { useState } from 'react';

export default function ScholarshipList({ initialScholarships }) {
  const [sortBy, setSortBy] = useState('default');

  // Set today's date for logic comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper function to figure out the status of a scholarship
  const getStatus = (scholarship) => {
    const openDate = new Date(scholarship.open_date + 'T00:00:00');
    const deadlineDate = new Date(scholarship.deadline + 'T00:00:00');

    if (today < openDate) return 'future';
    if (today > deadlineDate) return 'closed';
    return 'active';
  };

  // NEW: Helper function to calculate the exact days remaining
  const getTimerText = (targetDateStr, isFuture) => {
    const targetDate = new Date(targetDateStr + 'T00:00:00');
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (isFuture) {
      if (diffDays === 1) return "Opens tomorrow";
      return `Opens in ${diffDays} days`;
    } else {
      if (diffDays === 0) return "Ends today!";
      if (diffDays === 1) return "Ends tomorrow!";
      return `${diffDays} days left`;
    }
  };

  // Sort the data
  let sortedScholarships = [...initialScholarships];
  if (sortBy !== 'default') {
    sortedScholarships.sort((a, b) => {
      if (sortBy === 'closest_due') return new Date(a.deadline) - new Date(b.deadline);
      
      const amountA = parseInt(a.amount.replace(/[\$,]/g, ''));
      const amountB = parseInt(b.amount.replace(/[\$,]/g, ''));
      
      if (sortBy === 'highest_pay') return amountB - amountA; 
      if (sortBy === 'lowest_pay') return amountA - amountB; 
      return 0;
    });
  }

  // Split the data into our three columns
  const activeScholarships = sortedScholarships.filter(s => getStatus(s) === 'active');
  const futureScholarships = sortedScholarships.filter(s => getStatus(s) === 'future');
  const closedScholarships = sortedScholarships.filter(s => getStatus(s) === 'closed');

  // A reusable card component to keep the code clean
  const ScholarshipCard = ({ scholarship, status }) => {
    return (
      <div className={`p-5 bg-white rounded-xl border mb-4 flex flex-col ${status === 'closed' ? 'border-slate-200 opacity-60' : 'border-slate-200 hover:shadow-md transition-shadow'}`}>
        <div className="mb-4">
          <h2 className={`text-xl font-claude font-semibold leading-tight mb-2 ${status === 'closed' ? 'text-slate-500' : 'text-slate-800'}`}>
            {scholarship.title}
          </h2>
          <p className="text-sm text-slate-600 line-clamp-2">{scholarship.audience}</p>
        </div>
        
        <div className="pt-4 border-t border-slate-100 flex justify-between items-end mb-4">
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Amount</p>
            <p className={`text-xl font-bold ${status === 'closed' ? 'text-slate-400' : 'text-green-600'}`}>
              {scholarship.amount}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
              {status === 'future' ? 'Opens' : 'Deadline'}
            </p>
            <p className={`text-sm font-medium ${status === 'closed' ? 'text-slate-500' : status === 'future' ? 'text-blue-500' : 'text-red-500'}`}>
              {status === 'future' ? scholarship.open_date : scholarship.deadline}
            </p>
            
            {/* NEW: The Countdown Timer Badge */}
            {status === 'active' && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md mt-1.5 shadow-sm">
                ⏳ {getTimerText(scholarship.deadline, false)}
              </span>
            )}
            {status === 'future' && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md mt-1.5 shadow-sm">
                ⏳ {getTimerText(scholarship.open_date, true)}
              </span>
            )}
          </div>
        </div>

        {status === 'closed' ? (
          <button disabled className="w-full bg-slate-100 text-slate-400 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed">
            Closed
          </button>
        ) : status === 'future' ? (
          <button disabled className="w-full bg-blue-50 text-blue-400 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed">
            Opening Soon
          </button>
        ) : (
          <a href={scholarship.url} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-md transition-colors">
            Apply Now
          </a>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Sorting Dropdown */}
      <div className="mb-8 flex justify-end items-center gap-3">
        <label htmlFor="sort" className="text-slate-600 font-medium">Sort by:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-slate-300 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
        >
          <option value="default">Default</option>
          <option value="closest_due">Closest Due Date</option>
          <option value="highest_pay">Highest Pay</option>
          <option value="lowest_pay">Lowest Pay</option>
        </select>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Column 1: Active */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h3 className="text-xl font-bold text-slate-800">Active ({activeScholarships.length})</h3>
          </div>
          {activeScholarships.map(s => <ScholarshipCard key={s.id} scholarship={s} status="active" />)}
        </div>

        {/* Column 2: Future */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h3 className="text-xl font-bold text-slate-800">Opening Soon ({futureScholarships.length})</h3>
          </div>
          {futureScholarships.map(s => <ScholarshipCard key={s.id} scholarship={s} status="future" />)}
        </div>

        {/* Column 3: Closed */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            <h3 className="text-xl font-bold text-slate-800">Closed ({closedScholarships.length})</h3>
          </div>
          {closedScholarships.map(s => <ScholarshipCard key={s.id} scholarship={s} status="closed" />)}
        </div>

      </div>
    </div>
  );
}