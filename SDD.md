# System Design Document (SDD)

## 1. Introduction

### 1.1 Personal Goal
The primary goal of this project is to demonstrate technical leadership, architectural decision-making, and coding expertise by building a personal journaling application.

### 1.2 Application Goals
The application aims to provide users with a platform to journal their daily life events via text. The design will be flexible enough to allow future enhancements, such as adding images and videos.

### 1.3 Key Features
The application will include the following key features:

1. **User Management**
   - Secure JWT-based email/password authentication with proper password handling.
   - OAuth Google authentication for seamless login.
   - Role-based access control (RBAC) with two roles:
     - **Admin**: Can read and delete journals from all users.
     - **Author**: Can create, read, update, and delete (CRUD) their own journals and view AI/ML-enhanced insights.

2. **Journal Entry Management**
   - RESTful API for CRUD operations on journal entries.
   - Efficient query patterns for retrieving and filtering entries using query parameters.

3. **Data Summary**
   - Optimized endpoints for aggregating and summarizing journal data.
   - Performance considerations for summary calculations.

4. **Security**
   - Comprehensive security implementation, including input validation, data sanitization, and rate limiting.

5. **AI/ML-Enhanced Journal Insights (Optional)**
   - Features like sentiment analysis, auto-categorization, and writing prompts will be implemented after the MVP.

---

## 2. Architecture Overview

### 2.1 Architecture Type
The application will use a **monolithic architecture** because the complexity of microservices is unnecessary for the current scope. A monolithic architecture simplifies development and deployment for this project.

### 2.2 Technology Stack
- **Frontend**: React with Next.js for server-side rendering (SSR) and improved performance.
- **Backend**: NestJS with TypeScript and Express for building a robust and scalable API.
- **Database**: PostgreSQL for its relational structure, full-text search capabilities, JSONB support for flexible data storage, and strong performance and security features.

### 2.3 Deployment
The application will not be deployed for this assignment, but the design will consider cloud deployment with autoscaling (e.g., AWS EC2 Auto Scaling Groups) for future scalability.

---

## 3. Data Model Design

### 3.1 Main Entities
The main entities in the application are:
- **Role**: Defines user roles (Admin, Author).
- **User**: Stores user information (username, email, password hash).
- **Journal Entry**: Stores journal entries (title, content, date, category).
- **Category**: Stores categories for journal entries (e.g., Personal, Work, Travel).
- **Tag**: Optional entity for tagging journal entries with multiple labels.

### 3.2 Relationships
- A **User** can have one **Role** (Admin or Author).
- A **User** can create many **Journal Entries**.
- A **Journal Entry** belongs to one **User**.
- An **Admin** can read and delete journals from any **User**.
- A **Tag** can be applied to multiple **Journal Entries**, and a **Journal Entry** can have multiple **Tags**.

### 3.3 Database Choice
PostgreSQL is chosen for its:
- Relational structure for managing users and journals.
- Full-text search capabilities for efficient journal entry searches.
- JSONB support for storing flexible data (e.g., AI/ML-generated insights).
- Strong performance and security features.

---

## 4. Security Measures

### 4.1 Authentication
- **JWT-based authentication**: Secure token-based authentication for user sessions.
- **OAuth Google authentication**: For seamless login using Google accounts.

### 4.2 Input Validation
- Validate all user inputs to prevent SQL injection and XSS attacks.

### 4.3 Rate Limiting
- Implement rate limiting on login endpoints to prevent brute force attacks.

### 4.4 Password Hashing
- Use bcrypt or Argon2 for secure password storage.

### 4.5 HTTPS
- Ensure all communication between the client and server is encrypted using HTTPS.

### 4.6 CORS
- Configure CORS to restrict access to the API from unauthorized domains.

---

## 5. Scalability and Performance

### 5.1 Scaling to 1M+ Users
- Deploy the application to a cloud service with autoscaling features (e.g., AWS EC2 Auto Scaling Groups).
- Use read replicas and partitioning to handle read/write-heavy workloads.

### 5.2 Potential Bottlenecks and Solutions
- **Bottleneck**: High read/write workloads on the database.  
  **Solution**: Implement indexing, caching, and optimized queries.
- **Bottleneck**: API performance under heavy load.  
  **Solution**: Use load balancing and caching mechanisms (e.g., Redis).

### 5.3 Performance Optimization Techniques
- **Caching**: Use Redis for caching frequently accessed data.
- **Load Balancing**: Distribute traffic across multiple servers to ensure high availability.
- **Optimized Queries**: Use efficient query patterns and database indexing.

---

## 6. AI/ML-Enhanced Journal Insights

### 6.1 Features to Implement
After the MVP, the following AI/ML features will be added:
- **Smart Entry Analysis**: Auto-suggest categories based on content and perform sentiment analysis for mood tracking.
- **Writing Enhancement**: Provide context-aware writing prompts and style/grammar suggestions.
- **Insight Generation**: Automatically detect themes, summarize content, and recognize patterns in journal entries.

### 6.2 Integration
- The AI/ML features will be integrated into the backend using Python-based libraries (e.g., TensorFlow, spaCy) and exposed via RESTful endpoints.
- The frontend will consume these endpoints to display insights to the user.

---

## 7. API Design

### 7.1 API Type
- **RESTful API**: Chosen because the relationships between entities are not complex, and REST is sufficient for the required functionality.

### 7.2 Endpoints
- **User Endpoints**:
  - `POST /auth/signup`: User registration.
  - `POST /auth/signin`: User login.
  - `GET /users/insights`: Fetch AI/ML insights for the user.
- **Journal Endpoints**:
  - `POST /journals`: Create a new journal entry.
  - `GET /journals`: Fetch all journal entries (with filtering and searching).
  - `GET /journals/{id}`: Fetch a single journal entry.
  - `PUT /journals/{id}`: Update a journal entry.
  - `DELETE /journals/{id}`: Delete a journal entry.

---

## 8. Testing Strategy

### 8.1 Types of Tests
- **Unit Tests**: Test individual components and functions.
- **Integration Tests**: Test the interaction between different modules.
- **End-to-End (E2E) Tests**: Test the entire application workflow.

### 8.2 Reliability
- Use automated testing with CI/CD pipelines (e.g., GitHub Actions) to ensure code quality and reliability.
- Perform manual testing for edge cases and user experience validation.

---

## 9. Deployment Strategy

### 9.1 Deployment
- The application will not be deployed for this assignment, but the design will consider future deployment to a cloud service (e.g., AWS, GCP).

### 9.2 CI/CD Pipeline
- Use **GitHub Actions** for continuous integration and deployment.
- Automate testing, building, and deployment processes to ensure rapid and reliable updates.
