
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Store students in an array
let students = [];
let nextId = 1;

// Validate student data
function validateStudent(name, course, age) {
    return (
        typeof name === "string" &&
        name.trim() !== "" &&
        typeof course === "string" &&
        course.trim() !== "" &&
        typeof age === "number" &&
        Number.isFinite(age) &&
        age > 0
    );
}

// 1. POST - Add a new student
app.post("/api/students", (req, res) => {

    const { name, course, age } = req.body;

    // Missing or invalid data
    if (!validateStudent(name, course, age)) {
        return res.status(400).json({
            message: "Please provide valid name, course and age"
        });
    }

    // Check duplicate name
    const exists = students.find(
        s => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            message: "Student name already exists"
        });
    }

    // Create student
    const newStudent = {
        id: nextId++,
        name: name.trim(),
        course: course.trim(),
        age: age
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});


// 2. GET - Get all students
app.get("/api/students", (req, res) => {

    const course = req.query.course;

    // Filter by course
    if (course) {
        const filtered = students.filter(
            s => s.course.toLowerCase() === course.toLowerCase()
        );

        return res.status(200).json(filtered);
    }

    res.status(200).json(students);
});


// 3. GET - Get student by ID
app.get("/api/students/:id", (req, res) => {

    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!Number.isInteger(id) || id <= 0 || !student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});


// 4. PUT - Update student by ID
app.put("/api/students/:id", (req, res) => {

    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!Number.isInteger(id) || id <= 0 || !student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, course, age } = req.body;

    // Validate updated data
    if (!validateStudent(name, course, age)) {
        return res.status(400).json({
            message: "Please provide valid name, course and age"
        });
    }

    // Check duplicate name
    const exists = students.find(
        s => s.id !== id &&
        s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            message: "Student name already exists"
        });
    }

    // Update student
    student.name = name.trim();
    student.course = course.trim();
    student.age = age;

    res.status(200).json({
        message: "Student updated successfully",
        student: student
    });
});


// 5. DELETE - Delete student by ID
app.delete("/api/students/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (!Number.isInteger(id) || id <= 0 || index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const deletedStudent = students.splice(index, 1)[0];

    res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
