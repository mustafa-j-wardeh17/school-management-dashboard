# School Management System Backend

<p>This project is the backend for a <strong>School Management System</strong>, built using <em>Node.js</em>, <em>Prisma ORM</em>, and <em>PostgreSQL</em>. It provides CRUD (Create, Read, Update, Delete) operations for managing data related to admins, students, teachers, parents, classes, grades, subjects, lessons, exams, assignments, and attendance.</p>

## Schema Overview

<p>Below is a visual representation of the database schema:</p>

<img src="./public/schema.png" alt="Database Schema" style="width:100vw; height:60vh;">

<p>This image gives an overview of the relationships between different models in the system.</p>


## Technologies Used

<ul>
  <li><strong>Prisma ORM</strong>: Object-Relational Mapping tool to interact with the PostgreSQL database</li>
  <li><strong>PostgreSQL</strong>: Database used for storing the application data</li>
  <li><strong>Next.js</strong>: Runtime environment for building the backend server</li>
</ul>

## Project Structure

<p>The project structure follows a well-organized pattern:</p>

<ul>
  <li><code>prisma/</code>: Contains the Prisma schema and migration files</li>
  <li><code>src/</code>: Contains the server code and route handling logic</li>
</ul>

## Database Schema

<p>This project uses the following database models:</p>

<ul>
  <li><strong>Admin</strong>: Contains information about system administrators</li>
  <li><strong>Student</strong>: Stores student data including name, contact details, class, and grades</li>
  <li><strong>Teacher</strong>: Stores teacher data, subjects, and assigned classes</li>
  <li><strong>Parent</strong>: Stores parent data and their associated students</li>
  <li><strong>Class</strong>: Manages classes and their assigned teachers and students</li>
  <li><strong>Grade</strong>: Defines grade levels associated with students and classes</li>
  <li><strong>Subject</strong>: Manages the subjects that teachers instruct and the lessons provided</li>
  <li><strong>Lesson</strong>: Organizes the daily schedule of lessons for students and teachers</li>
  <li><strong>Exam</strong>: Stores exam details and their results</li>
  <li><strong>Assignment</strong>: Contains assignment details and due dates</li>
  <li><strong>Attendance</strong>: Tracks student attendance for each lesson</li>
  <li><strong>Event</strong>: Manages school events and announcements</li>
  <li><strong>Announcement</strong>: Stores important announcements for each class</li>
</ul>

## Setup Instructions

<ol>
  <li>Clone the repository:</li>

  <pre><code>git clone https://github.com/mustafa-j-wardeh17/school-management-dashboard.git</code></pre>

  <li>Install the dependencies:</li>

  <pre><code>npm install</code></pre>

  <li>Create a `.env` file and set your PostgreSQL connection URL:</li>

  <pre><code>DATABASE_URL="postgresql://user:password@localhost:5432/dbname"</code></pre>

  <li>Run Prisma migrations to set up the database:</li>

  <pre><code>npx prisma migrate dev</code></pre>

  <li>Start the server:</li>

  <pre><code>npm run dev</code></pre>
</ol>

## Prisma Schema

<p>The project uses the following <code>schema.prisma</code>:</p>

<pre>
<code>
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Admin {
  id       String @id
  username String @unique
}

model Student {
  id          String       @id
  username    String       @unique
  name        String
  surname     String
  email       String?      @unique
  phone       String?      @unique
  address     String
  img         String?
  bloodType   String
  sex         UserSex
  createdAt   DateTime     @default(now())
  parentId    String
  parent      Parent       @relation(fields: [parentId], references: [id])
  classId     Int
  class       Class        @relation(fields: [classId], references: [id])
  gradeId     Int
  grade       Grade        @relation(fields: [gradeId], references: [id])
  attendances Attendance[]
  results     Result[]
  birthday    DateTime
}
</code>
</pre>

<p>For more details, view the full <code>schema.prisma</code> file in the project repository.</p>

## API Endpoints

<p>The project exposes the following API routes for CRUD operations:</p>

<ul>
  <li><code>GET /students</code>: Retrieve a list of all students</li>
  <li><code>POST /students</code>: Create a new student</li>
  <li><code>GET /students/:id</code>: Retrieve a specific student by ID</li>
  <li><code>PUT /students/:id</code>: Update a student's details</li>
  <li><code>DELETE /students/:id</code>: Delete a student by ID</li>
  <li><code>GET /teachers</code>: Retrieve a list of all teachers</li>
  <li>...and more.</li>
</ul>

## Contributing

<p>Contributions are welcome! Please follow these steps to contribute:</p>

<ol>
  <li>Fork the repository</li>
  <li>Create a new branch</li>
  <li>Make your changes</li>
  <li>Submit a pull request</li>
</ol>

## License

<p>This project is licensed under the <strong>MIT License</strong>.</p>
</body>
</html>
