import { clerkClient } from "@clerk/nextjs/server";
import { Day, PrismaClient, UserSex } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to create Clerk users
async function createClerkUser(username: string, role: string) {
  return clerkClient.users.createUser({
    username: username,
    password: 'School123', // Password set to the username
    publicMetadata: { role }, // Clerk role
  });
}
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {

  // //Function to delete all existing users from Clerk
  // const deleteAllClerkUsers = async () => {
  //   try {
  //     // Fetch all users
  //     const userResponse = await clerkClient.users.getUserList();

  //     // Access the actual array of users from the response
  //     const users = userResponse.data;

  //     // Delete each user
  //     for (const user of users) {
  //       await clerkClient.users.deleteUser(user.id);

  //     }
  //     console.log('All Clerk users deleted successfully.');
  //   } catch (err) {
  //     console.error('Error deleting Clerk users:', err);
  //   }
  // };
  // await deleteAllClerkUsers()

  // await delay(3000);

  await createClerkUser(`admin1`, "admin");
  await delay(1000); // Add delay after creating an admin user
  await createClerkUser(`admin2`, "admin");
  await delay(1000); // Add delay after creating another admin user


  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: { level: i },
    });
  }

  // CLASS
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        name: `${i}A`,
        gradeId: i,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // SUBJECT
  const subjectData = [
    { name: "Mathematics" },
    { name: "Science" },
    { name: "English" },
    { name: "History" },
    { name: "Geography" },
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Biology" },
    { name: "Computer Science" },
    { name: "Art" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // TEACHER
  for (let i = 1; i <= 15; i++) {
    const username = `teacher${i}`; // Unique username for each teacher
    if (i === 10) await delay(4000); // Specific delay for teacher creation

    const clerkTeacher = await createClerkUser(username, "teacher");
    await prisma.teacher.create({
      data: {
        id: clerkTeacher.id,
        username: `teacher${i}`,
        name: `TName${i}`,
        surname: `TSurname${i}`,
        email: `teacher${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: (i % 10) + 1 }] },
        classes: { connect: [{ id: (i % 6) + 1 }] },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      },
    });
    await delay(500); // Optional delay after each teacher creation

  }

  // PARENT
  for (let i = 1; i <= 25; i++) {
    const clerkParent = await createClerkUser(`parent${i}`, "parent");
    if (i === 10 || i === 20) await delay(4000); // Specific delays for parent creation


    await prisma.parent.create({
      data: {
        id: clerkParent.id,
        username: `parent${i}`,
        name: `PName ${i}`,
        surname: `PSurname ${i}`,
        email: `parent${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
      },
    });
    await delay(500); // Optional delay after each teacher creation

  }
  // Fetch existing parents from the database
  const parents = await prisma.parent.findMany({
    select: {
      id: true,
      username: true, // Or any other field you may want to use to identify them
    },
  });

  // Convert the fetched parents into a map for easy access
  const parentMap: { [key: string]: string } = {};
  parents.forEach(parent => {
    parentMap[parent.username] = parent.id; // or any other unique identifier
  });
  delay(5000)



  //STUDENT
  for (let i = 1; i <= 50; i++) {
    const clerkStudent = await createClerkUser(`student${i}`, "student");

    if (i === 10 || i === 20 || i === 30 || i === 40) await delay(4000); // Specific delays for student creation

    const student = await prisma.student.create({
      data: {
        id: clerkStudent.id,
        username: `student${i}`,
        name: `SName${i}`,
        surname: `SSurname ${i}`,
        email: `student${i}@example.com`,
        phone: `987-654-321${i}`,
        address: `Address${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: parentMap[`parent${Math.ceil(i / 2)}`], // Assign parent ID based on existing parents
        gradeId: (i % 6) + 1,
        classId: (i % 6) + 1,
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
      },
    });

    await delay(500); // Optional delay after each student creation
  }

  const students = await prisma.student.findMany({
    select: {
      id: true,
      username: true, // Or any other field you may want to use to identify them
    },
  });

  // Convert the fetched students into a map for easy access
  const studentMap: { [key: string]: string } = {};
  students.forEach(student => {
    studentMap[student.username] = student.id; // or any other unique identifier
  });

  // Fetch existing teachers from the database
  const teachers = await prisma.teacher.findMany({
    select: {
      id: true,
      username: true, // Or any other field you may want to use to identify them
    },
  });

  // Convert the fetched teachers into a map for easy access
  const teacherMap: { [key: string]: string } = {};
  teachers.forEach(teacher => {
    teacherMap[teacher.username] = teacher.id; // or any other unique identifier
  });
  await delay(5000); // Delay if needed

  // Create Lessons
  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        name: `Lesson${i}`,
        day: Day[
          Object.keys(Day)[
          Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ],
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
        subjectId: (i % 10) + 1,
        classId: (i % 6) + 1,
        teacherId: teacherMap[`teacher${(i % 15) + 1}`], // Use the actual teacher ID from the map
      },
    });
  }

  // Create Exams
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `Exam ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // Create Assignments
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.create({
      data: {
        title: `Assignment ${i}`,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // Create Results
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 90,
        studentId: studentMap[`student${i}`], // Use the actual student ID from the map
        ...(i <= 5 ? { examId: i + 1 } : { assignmentId: i - 4 }),
      },
    });
  }

  // Create Attendance
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(),
        present: true,
        studentId: studentMap[`student${i}`], // Use the actual student ID from the map
        lessonId: (i % 30) + 1,
      },
    });
  }

  // Create Events
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        classId: (i % 5) + 1,
      },
    });
  }

  // Create Announcements
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(),
        classId: (i % 5) + 1,
      },
    });
  }

  console.log("Seeding completed successfully.");


}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
