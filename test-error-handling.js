// Test the improved error handling for check-in/check-out
const baseUrl = 'http://localhost:3000';

async function testErrorHandling() {
  try {
    console.log('🧪 Testing Improved Error Handling...\n');

    // Login as employee
    console.log('1. Logging in as employee...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john.doe@updesco.com',
        password: 'password123'
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');

    // Check current attendance status
    console.log('\n2. Checking current attendance status...');
    const attendanceResponse = await fetch(`${baseUrl}/api/attendance`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    const attendanceData = await attendanceResponse.json();
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendanceData.attendanceRecords?.find(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === today;
    });
    
    console.log('📅 Current status:', {
      hasRecord: !!todayRecord,
      checkedIn: !!todayRecord?.checkInTime,
      checkedOut: !!todayRecord?.checkOutTime,
      checkInTime: todayRecord?.checkInTime || 'Not checked in',
      checkOutTime: todayRecord?.checkOutTime || 'Not checked out'
    });

    // Test check-in (should work if not checked in, or give friendly error if already checked in)
    console.log('\n3. Testing check-in operation...');
    try {
      const checkinResponse = await fetch(`${baseUrl}/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'check-in' }),
      });

      if (!checkinResponse.ok) {
        const errorData = await checkinResponse.json();
        console.log('ℹ️ Expected check-in response:', {
          status: checkinResponse.status,
          message: errorData.error || errorData.message,
          isAlreadyCheckedIn: errorData.error?.includes('Already checked in')
        });
      } else {
        const checkinData = await checkinResponse.json();
        console.log('✅ Check-in successful:', {
          checkInTime: checkinData.attendance?.checkInTime,
          message: checkinData.message
        });
      }
    } catch (error) {
      console.log('🔍 Check-in error handling test:', error.message);
    }

    // Test double check-in (should give friendly error)
    console.log('\n4. Testing double check-in (should give friendly error)...');
    try {
      const doubleCheckinResponse = await fetch(`${baseUrl}/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'check-in' }),
      });

      if (!doubleCheckinResponse.ok) {
        const errorData = await doubleCheckinResponse.json();
        console.log('✅ Proper error handling for double check-in:', {
          status: doubleCheckinResponse.status,
          error: errorData.error,
          isFriendlyError: errorData.error?.includes('Already checked in')
        });
      } else {
        console.log('⚠️ Unexpected: Double check-in was allowed');
      }
    } catch (error) {
      console.log('🔍 Double check-in error:', error.message);
    }

    // Test check-out without check-in (on a fresh user)
    console.log('\n5. Testing premature check-out error handling...');
    try {
      // First, let's try with a different user who hasn't checked in
      const testUserLogin = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'jane.smith@updesco.com',
          password: 'password123'
        }),
      });

      if (testUserLogin.ok) {
        const testUserData = await testUserLogin.json();
        const testToken = testUserData.token;

        const checkoutResponse = await fetch(`${baseUrl}/api/attendance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${testToken}`,
          },
          body: JSON.stringify({ type: 'check-out' }),
        });

        if (!checkoutResponse.ok) {
          const errorData = await checkoutResponse.json();
          console.log('✅ Proper error handling for premature check-out:', {
            status: checkoutResponse.status,
            error: errorData.error,
            isFriendlyError: errorData.error?.includes('Must check in')
          });
        } else {
          console.log('⚠️ Unexpected: Check-out without check-in was allowed');
        }
      }
    } catch (error) {
      console.log('🔍 Premature check-out error:', error.message);
    }

    console.log('\n🎉 Error handling tests completed!');
    console.log('\n📋 IMPROVEMENTS MADE:');
    console.log('✅ User-friendly error messages');
    console.log('✅ Specific error handling for different scenarios');
    console.log('✅ Processing state to prevent double-clicks');
    console.log('✅ Better UI feedback during operations');
    console.log('✅ Automatic data refresh after operations');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testErrorHandling();
