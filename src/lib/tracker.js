// Get all saved scholarship IDs
export function getSaved() {
  return JSON.parse(localStorage.getItem('scholarab_saved') || '[]');
}

// Toggle saved state — returns new saved array
export function toggleSaved(id) {
  const saved = getSaved();
  const idx = saved.indexOf(id);
  if (idx > -1) saved.splice(idx, 1);
  else saved.push(id);
  localStorage.setItem('scholarab_saved', JSON.stringify(saved));
  return saved;
}
