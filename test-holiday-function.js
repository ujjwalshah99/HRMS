// Test the isHoliday function
function isHoliday(date) {
  const dayOfWeek = date.getDay();
  
  // All Sundays are holidays
  if (dayOfWeek === 0) {
    return true;
  }
  
  // Second Saturday of the month is a holiday
  if (dayOfWeek === 6) {
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Count Saturdays in this month to determine if this is the second Saturday
    let saturdayCount = 0;
    for (let day = 1; day <= dayOfMonth; day++) {
      const testDate = new Date(year, month, day);
      if (testDate.getDay() === 6) {
        saturdayCount++;
      }
    }
    
    return saturdayCount === 2;
  }
  
  return false;
}

// Test July 2025
console.log('Testing July 2025:');
for (let day = 1; day <= 31; day++) {
  const date = new Date(2025, 6, day); // July is month 6
  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  const isHol = isHoliday(date);
  
  if (isHol) {
    console.log(`July ${day}, 2025 (${dayName}) - HOLIDAY`);
  }
}
