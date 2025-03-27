# **JournalBackend - Personal Journaling App API**  
**A secure, scalable backend for a journaling application with analytics and AI-powered insights.**  

---

## **📌 Table of Contents**  
1. [Features](#-features)  
2. [Tech Stack](#-tech-stack)  
3. [Setup & Installation](#-setup--installation)  
4. [Environment Variables](#-environment-variables)  
5. [API Documentation](#-api-documentation)  
6. [Testing](#-testing)  
7. [Deployment](#-deployment)  
8. [System Design](#-system-design)  
9. [License](#-license)  

---

## **✨ Features**  
✅ **User Authentication**  
- JWT-based signup/login with password hashing.  
- Role-based access control (admin/user).  

✅ **Journal Entry Management**  
- CRUD operations for entries with validation (title, content length, categories).  
- Optimistic updates support.  

✅ **Analytics & Summaries**  TODO
- Entry frequency heatmaps.  
- Category distribution charts.  
- Optional AI sentiment analysis (via `natural` NLP).  

✅ **Security**  
- Rate limiting, input sanitization, and SQL injection prevention.  TODO

  
---

## **🛠 Tech Stack**  
| **Category**       | **Choices**                          |  
|--------------------|--------------------------------------|  
| **Backend**        | Node.js, Express, TypeScript         |  
| **Database**       | PostgreSQL (with TypeORM)            |  
| **Auth**           | JWT, bcrypt                          |  
| **Cache**          | Redis (for analytics)                |  
| **AI**             | `natural` (sentiment analysis)       |  
| **Testing**        | Jest, Supertest                      |  
| **Docs**           | Swagger (OpenAPI 3.0)                |  

---

## **⚙ Setup & Installation**  

### **Prerequisites**  
- Node.js ≥18.x  
- PostgreSQL ≥14  
- Redis (optional, for caching)  
- Git  

### **Steps**  
1. **Clone the repo**  
   ```bash
   git clone https://github.com/didasmbalanya/journal-backend.git
   cd journal-backend
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file (see .env.sample).  

4. **Database setup**  
   Create both a test and dev db. pass both values to the respective env files

5. **RunServer**  
   ```bash
   npm run start:dev  # Development (hot-reload)
   ```

---

## **🔑 Environment Variables**  
Add these to `.env`:  
```ini
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=journal_app

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

```

---

## **📚 API Documentation**  
Interactive docs via Swagger:  
- After running the server, visit `http://localhost:3000/api-docs`.  

**Key Endpoints**:  
| **Endpoint**              | **Method** | **Description**                |  
|---------------------------|------------|--------------------------------|  
| `/auth/signup`            | POST       | Register a new user.           |  
| `/auth/login`             | POST       | Log in and get JWT.            |  
| `/journals`               | GET        | List all journal journals.     |  
| `/journals`               | POST       | Create a new entry.            |  
| `/journals:id`            | GET        | Get a single jpurnal.          |  
| `/journals:id`            | DELETE     | Delete a single journal entry. |  

**Example Request (Create Entry)**:  
```bash
curl -X POST 'http://localhost:3000/journals' \
  -H 'Authorization: Bearer YOUR_JWT' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "My Day",
    "content": "Today I built a journal app with sentiment analysis...",
    "categories": "personal"
  }'
```

---

## **🧪 Testing**  
**Run tests**:  
```bash
npm run test:e2e      # integration tests
npm run test:cov  # Test coverage
```

**Test Structure**:  
- `tests/`: API endpoint intergration tests (Supertest).  


**Key Decisions**:  
1. **JWT over Sessions**: Stateless scalability.  
2. **Redis Caching**: Reduces database load for summaries.  
3. **AI Offloading**: Sentiment analysis runs async to avoid blocking CRUD ops.  

---

## **📜 License**  
MIT © [Didas Mbalanya](https://github.com/didasmbalanya).  

---

**🔗 Links**:  
- [API Docs (Swagger)](http://localhost:3000/api)  
- [System Design Doc (SDD.md)](./SDD.md)  
- [Frontend Repo](https://github.com/didasmbalanya/journal-frontend)  

**Need Help?**  
Open an issue or contact [@didasmbalanya](https://github.com/didasmbalanya).