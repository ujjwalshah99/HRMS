import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create MD
  const mdUser = await prisma.user.create({
    data: {
      email: 'md@updesco.com',
      password: hashedPassword,
      name: 'Michael Director',
      role: 'MD',
    },
  });

  const md = await prisma.mD.create({
    data: {
      userId: mdUser.id,
      mdId: 'MD001',
    },
  });

  // Create Managers
  const manager1User = await prisma.user.create({
    data: {
      email: 'sarah.manager@updesco.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      role: 'MANAGER',
    },
  });

  const manager1 = await prisma.manager.create({
    data: {
      userId: manager1User.id,
      managerId: 'MGR001',
      department: 'Engineering',
    },
  });

  const manager2User = await prisma.user.create({
    data: {
      email: 'mike.manager@updesco.com',
      password: hashedPassword,
      name: 'Mike Wilson',
      role: 'MANAGER',
    },
  });

  const manager2 = await prisma.manager.create({
    data: {
      userId: manager2User.id,
      managerId: 'MGR002',
      department: 'Marketing',
    },
  });

  // Create Employees
  const employees = [
    {
      email: 'john.doe@updesco.com',
      name: 'John Doe',
      department: 'Engineering',
      position: 'Software Developer',
      managerId: manager1.id,
    },
    {
      email: 'jane.smith@updesco.com',
      name: 'Jane Smith',
      department: 'Engineering',
      position: 'Frontend Developer',
      managerId: manager1.id,
    },
    {
      email: 'bob.johnson@updesco.com',
      name: 'Bob Johnson',
      department: 'Engineering',
      position: 'Backend Developer',
      managerId: manager1.id,
    },
    {
      email: 'alice.brown@updesco.com',
      name: 'Alice Brown',
      department: 'Marketing',
      position: 'Marketing Specialist',
      managerId: manager2.id,
    },
    {
      email: 'david.wilson@updesco.com',
      name: 'David Wilson',
      department: 'Marketing',
      position: 'Content Creator',
      managerId: manager2.id,
    },
  ];

  const createdEmployees: any[] = [];
  for (const emp of employees) {
    const user = await prisma.user.create({
      data: {
        email: emp.email,
        password: hashedPassword,
        name: emp.name,
        role: 'EMPLOYEE',
      },
    });

    const employee = await prisma.employee.create({
      data: {
        userId: user.id,
        employeeId: `EMP${String(createdEmployees.length + 1).padStart(3, '0')}`,
        department: emp.department,
        position: emp.position,
        joinDate: new Date(),
        managerId: emp.managerId,
      },
    });

    createdEmployees.push(employee);
  }

  // Create some sample attendance records
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    for (const employee of createdEmployees) {
      const checkInTime = new Date(date);
      checkInTime.setHours(9, Math.floor(Math.random() * 30), 0, 0);
      
      const checkOutTime = new Date(checkInTime);
      checkOutTime.setHours(17, Math.floor(Math.random() * 60), 0, 0);
      
      const workingHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
      
      let status = 'PRESENT';
      if (checkInTime.getHours() > 10 || (checkInTime.getHours() === 10 && checkInTime.getMinutes() > 30)) {
        status = 'LATE';
      } else if (workingHours < 8) {
        status = 'HALF_DAY';
      }

      await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          date: new Date(date.setHours(0, 0, 0, 0)),
          checkInTime,
          checkOutTime,
          status: status as any,
          workingHours,
        },
      });
    }
  }

  // Create sample tasks
  const taskTitles = [
    'Implement user authentication',
    'Design dashboard UI',
    'Write API documentation',
    'Conduct code review',
    'Update database schema',
    'Create marketing campaign',
    'Analyze user feedback',
    'Optimize application performance',
  ];

  for (let i = 0; i < taskTitles.length; i++) {
    const employee = createdEmployees[i % createdEmployees.length];
    
    await prisma.task.create({
      data: {
        title: taskTitles[i],
        description: `Description for ${taskTitles[i]}`,
        priority: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] as any,
        status: ['PENDING', 'IN_PROGRESS', 'COMPLETED'][Math.floor(Math.random() * 3)] as any,
        assignedToId: employee.id,
        createdById: employee.id,
        managerId: employee.managerId,
        isUserAdded: Math.random() > 0.5,
        dueDate: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Create sample leave requests
  for (const employee of createdEmployees.slice(0, 3)) {
    await prisma.leaveRequest.create({
      data: {
        employeeId: employee.id,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        type: ['SICK', 'VACATION', 'PERSONAL'][Math.floor(Math.random() * 3)] as any,
        reason: 'Sample leave request',
        status: ['PENDING', 'APPROVED', 'REJECTED'][Math.floor(Math.random() * 3)] as any,
      },
    });
  }

  // Create sample meetings
  const meetingTime = new Date();
  meetingTime.setHours(14, 0, 0, 0);
  
  const meeting = await prisma.meeting.create({
    data: {
      title: 'Team Standup',
      description: 'Daily team standup meeting',
      startTime: meetingTime,
      endTime: new Date(meetingTime.getTime() + 60 * 60 * 1000),
      location: 'Conference Room A',
      type: 'TEAM',
      status: 'SCHEDULED',
      createdById: manager1.id,
    },
  });

  // Add participants to meeting
  for (const employee of createdEmployees.slice(0, 3)) {
    await prisma.meetingParticipant.create({
      data: {
        meetingId: meeting.id,
        employeeId: employee.id,
        status: 'INVITED',
      },
    });
  }

  // Create sample holidays
  const holidays = [
    { name: 'New Year\'s Day', date: new Date('2024-01-01') },
    { name: 'Independence Day', date: new Date('2024-08-15') },
    { name: 'Gandhi Jayanti', date: new Date('2024-10-02') },
    { name: 'Christmas', date: new Date('2024-12-25') },
  ];

  for (const holiday of holidays) {
    await prisma.holiday.create({
      data: {
        name: holiday.name,
        date: holiday.date,
        description: `Public holiday: ${holiday.name}`,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('📧 Login credentials:');
  console.log('MD: md@updesco.com / password123');
  console.log('Manager: sarah.manager@updesco.com / password123');
  console.log('Manager: mike.manager@updesco.com / password123');
  console.log('Employee: john.doe@updesco.com / password123');
  console.log('Employee: jane.smith@updesco.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
