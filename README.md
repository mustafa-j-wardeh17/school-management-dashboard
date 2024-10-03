# School Management System 
# Next.js Dashboard Project

This project is a **Next.js** application designed to manage a dashboard with various features including authentication, scheduling, data visualization, and form management. It integrates **Clerk** for authentication, **Prisma ORM** for database operations, and utilizes a variety of libraries to support the frontend and backend functionality.

## Frontend Overview

### Technologies Used

- **Next.js**: A React framework for building server-side rendered web applications.
- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Hook Form**: A library to manage forms in React.
- **React Big Calendar & React Calendar**: Libraries for rendering interactive calendars and scheduling.
- **React Toastify**: Provides notifications to improve the user experience.
- **Recharts**: A charting library for creating data visualizations.
- **Moment.js**: A library for manipulating and formatting dates.
- **Next Cloudinary**: Cloudinary integration for image uploading and manipulation.
  
### Key Features

1. **Authentication**: Handled by **Clerk**, providing sign-in, sign-up, and session management.
2. **Scheduling & Calendars**: Integrated with **React Big Calendar** and **React Calendar** to manage events, tasks, and meetings.
3. **Forms**: Managed using **React Hook Form** with **Zod** for schema validation, ensuring robust form handling.
4. **Notifications**: Implemented via **React Toastify** for user-friendly alerts and updates.
5. **Charts**: Data visualizations using **Recharts**, allowing for customizable charts and reports.

## Backend Overview

### Technologies Used

- **Prisma ORM**: Object-Relational Mapping (ORM) to interact with the PostgreSQL database.
- **PostgreSQL**: A powerful, open-source relational database.
- **Next.js API Routes**: Backend logic is implemented using server actions provided by Next.js.

### Database Schema

The backend uses **Prisma ORM** to manage the database schema. This includes models for **users**, **events**, and other key entities in the dashboard.

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

<li>Before running the application, ensure you create a `.env` file in the root of your project with the following variables:</li>
<pre><code>
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your_cloudinary_api_key"
</code></pre>

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

model Teacher {
  id        String    @id
  username  String    @unique
  name      String
  surname   String
  email     String?   @unique
  phone     String?   @unique
  address   String
  img       String?
  bloodType String
  sex       UserSex
  createdAt DateTime  @default(now())
  subjects  Subject[]
  lessons   Lesson[]
  classes   Class[]
  birthday  DateTime
}

model Parent {
  id        String    @id
  username  String    @unique
  name      String
  surname   String
  email     String?   @unique
  phone     String    @unique
  address   String
  createdAt DateTime  @default(now())
  students  Student[]
}

.
.
.
</code>
</pre>

<p>For more details, view the full <code>schema.prisma</code> file in the project repository.</p>

## API Operations

<p>The project utilizes server actions for the following operations:</p>

<ul>
  <li><strong>Create:</strong> Create a new student, teacher, or class.</li>
  <li><strong>Read:</strong> Fetch student, teacher, and class data directly from the database using Prisma.</li>
  <li><strong>Update:</strong> Update details for students, teachers, and classes.</li>
  <li><strong>Delete:</strong> Remove students, teachers, or classes from the database.</li>
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
