// Test the corrected getTodayDateString function
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const today = getTodayDateString();
console.log('Today from corrected getTodayDateString:', today);

// What we should get for July 3, 2025
const expectedToday = '2025-07-03';
console.log('Expected today:', expectedToday);
console.log('Match:', today === expectedToday);

// Test what the attendance record dates look like
const recordDate = new Date('2025-07-03T00:00:00.000Z').toISOString().split('T')[0];
console.log('Record date format:', recordDate);
console.log('Record matches expected:', recordDate === expectedToday);
console.log('Record matches function:', recordDate === today);
