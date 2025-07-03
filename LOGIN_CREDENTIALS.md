# HRMS Login Credentials

## Sample Login Credentials for Testing

All accounts are pre-seeded in the database. You can use any of these to test the system:

### Employee Accounts
- **Email**: `john.doe@updesco.com` | **Password**: `password123` | **Role**: Employee
- **Email**: `jane.smith@updesco.com` | **Password**: `password123` | **Role**: Employee
- **Email**: `bob.johnson@updesco.com` | **Password**: `password123` | **Role**: Employee
- **Email**: `alice.brown@updesco.com` | **Password**: `password123` | **Role**: Employee
- **Email**: `david.wilson@updesco.com` | **Password**: `password123` | **Role**: Employee
- **Email**: `test@updesco.com` | **Password**: `test123` | **Role**: Employee

### Manager Accounts
- **Email**: `sarah.manager@updesco.com` | **Password**: `password123` | **Role**: Manager
- **Email**: `mike.manager@updesco.com` | **Password**: `password123` | **Role**: Manager
- **Email**: `manager@updesco.com` | **Password**: `manager123` | **Role**: Manager

### MD (Managing Director) Account
- **Email**: `md@updesco.com` | **Password**: `password123` | **Role**: MD

## Quick Test Credentials

For quick testing, use these simplified credentials:

**Employee Login:**
- Email: `john.doe@updesco.com`
- Password: `password123`

**Manager Login:**
- Email: `manager@updesco.com`
- Password: `manager123`

**MD Login:**
- Email: `md@updesco.com`
- Password: `password123`

## How to Login

1. Go to `http://localhost:3001/login`
2. Enter one of the email/password combinations above
3. Click "Sign In"
4. You'll be redirected to the appropriate dashboard based on your role:
   - Employees → `/employee/dashboard`
   - Managers → `/manager/dashboard`
   - MD → `/md/dashboard`

## Note

- All passwords are hashed in the database for security
- The authentication system supports role-based access control
- Sessions persist across page navigation (the authentication persistence issue has been fixed)
