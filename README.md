
# 🏢 Human Resource Management System (HRMS) – UPDESCO

A centralized, web-based Human Resource Management System built for government organizations to digitize and streamline HR operations such as **attendance, leave management, performance tracking**, and **administrative oversight** using **face recognition** and **real-time dashboards**.

> 🚀 Developed by Ujjwal Shah, Ishita Gupta, and Aarsh S Lal  
> 📍 2nd & 3rd Floor, UPTRON Building, Gomti Nagar, Lucknow, Uttar Pradesh 226010

---

## 📌 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [👥 Target Users](#-target-users)
- [📦 Features](#-features)
- [🧠 Technical Architecture](#-technical-architecture)
- [🖥️ System Requirements](#-system-requirements)
- [📊 System Design Diagrams](#-system-design-diagrams)
- [🛡️ Security & Compliance](#️-security--compliance)
- [🌐 Tech Stack](#-tech-stack)
- [🧪 How to Run Locally](#-how-to-run-locally)
- [🔒 Access Control](#-access-control)
- [📈 Future Enhancements](#-future-enhancements)
- [📃 License](#-license)

---

## 🎯 Project Overview

The HRMS aims to modernize HR operations in public-sector organizations by providing:

- Real-time **face recognition-based attendance**
- Seamless **leave application and approval workflows**
- Task management and **performance monitoring**
- Role-based dashboards for **employees**, **admins**, and **directors**
- Comprehensive data reporting through **interactive graphs and summaries**

The platform promotes **automation, transparency, and data-driven decision-making** while reducing manual workloads.

---

## 👥 Target Users

| User Role       | Key Responsibilities                                                                 |
|------------------|---------------------------------------------------------------------------------------|
| **Employee**      | Mark attendance via face recognition, apply leaves, manage to-do list, view reports |
| **Admin**         | Approve leaves, monitor attendance, edit records, generate reports                  |
| **Managing Director (MD)** | View-only access to consolidated dashboards and summaries                        |

---

## 📦 Features

- 🔐 **Face Recognition Attendance** (via webcam)
- 📝 **Leave Request & Approval Workflow**
- 📅 **Calendar Integration** (personal + organizational)
- 📈 **Performance Analytics** with graphs & calendar views
- 🧾 **Auto-generated Reports** (exportable in PDF/CSV)
- 🎯 **Task/To-do Tracker** synced with admin dashboard
- 🔄 **Live Dashboards** for Admin and MD
- 🧑‍🤝‍🧑 **Role-Based Access Control**

---

## 🧠 Technical Architecture

### 👨‍💻 Backend
- REST APIs for user operations, attendance, leaves, and reporting
- Face recognition using **OpenCV**
- Authentication using **JWT / OAuth2.0**
- Admin logs for auditing

### 🖼️ Frontend
- Built with **React.js** and **Bootstrap**
- Dynamic dashboards for employees, admins, and MD
- Face recognition UI for attendance capture

### 💾 Database
- **MySQL** relational database
- Tables: `Employees`, `Attendance`, `Leaves`, `Tasks`, `Admin Logs`

---

## 🖥️ System Requirements

### Functional
- Secure face recognition-based attendance marking (≤ 5 sec)
- Admin dashboards with real-time updates
- Leave tracking with approval workflow

### Non-Functional
- Support for 150+ concurrent users
- Load dashboards within 5 seconds
- Encrypted data storage and secure APIs
- Scalability for multiple departments and organizations

---

## 📊 System Design Diagrams

- **Use Case Diagrams** for all roles
- **0-Level Data Flow Diagram**
- **Class Diagram**
- **Activity Diagram**

> _Refer to the `docs/diagrams/` folder for all UML diagrams._

---

## 🛡️ Security & Compliance

- 🔒 Role-Based Access Control (RBAC)
- 🧠 Encrypted storage of passwords and face data
- 🧑‍💻 Audit logs for admin activity
- 🧼 Protection from SQL Injection & XSS
- 📜 Compliance with Indian government data privacy regulations

---

## 🌐 Tech Stack

| Layer           | Technology                                  |
|----------------|---------------------------------------------|
| Frontend        | React.js, HTML5, CSS3, Bootstrap            |
| Backend         | Node.js / Python Flask                      |
| Face Recognition| OpenCV (local processing)                   |
| Database        | MySQL with ORM integration                  |
| Authentication  | JWT / OAuth 2.0                             |
| APIs            | RESTful architecture                        |
| Protocols       | HTTP, HTTPS                                 |

---

## 🧪 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/your-org/hrms-updesco.git
cd hrms-updesco

# Setup Backend
cd backend
pip install -r requirements.txt
python app.py

# Setup Frontend
cd ../frontend
npm install
npm start
```

Make sure MySQL is installed and a `.env` file is configured with database credentials.

---

## 🔒 Access Control

| Feature             | Employee | Admin | Managing Director |
|---------------------|----------|-------|-------------------|
| Mark Attendance     | ✅       | ❌    | ❌                |
| View Tasks          | ✅       | ✅    | ✅                |
| Approve Leaves      | ❌       | ✅    | ❌                |
| Edit Records        | ❌       | ✅    | ❌                |
| View Analytics      | ✅       | ✅    | ✅                |
| Export Reports      | ❌       | ✅    | ❌                |

---

## 📈 Future Enhancements

- 📱 **Mobile App** for remote attendance
- 📊 **Advanced HR Analytics Dashboard**
- 📲 Integration with **biometric hardware**
- 🌐 **Multi-language support** for regional usage
- 🗃️ Cloud-native deployment using Docker/Kubernetes

---

## 📃 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.
