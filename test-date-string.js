// Test the current getTodayDateString function
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getTodayDateString() {
  const now = new Date();
  return formatDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
}

const today = getTodayDateString();
console.log('Today from getTodayDateString:', today);

// What we should get for July 3, 2025
const expectedToday = '2025-07-03';
console.log('Expected today:', expectedToday);
console.log('Match:', today === expectedToday);

// Test what the attendance record dates look like
const recordDate = new Date('2025-07-03T00:00:00.000Z').toISOString().split('T')[0];
console.log('Record date format:', recordDate);
console.log('Record matches expected:', recordDate === expectedToday);
console.log('Record matches function:', recordDate === today);
