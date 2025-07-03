// Simple test script to test the authentication API
const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@updesco.com',
        password: 'test123'
      })
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User role:', data.user.role);
      console.log('Token received:', !!data.token);
    } else {
      console.log('❌ Login failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing login:', error);
  }
};

console.log('Testing login API...');
testLogin();
