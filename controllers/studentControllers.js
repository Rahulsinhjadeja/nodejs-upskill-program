const studentServices = require('../services/studentServices');
const { getImageUrl } = require('../utils/imageHelper');

exports.addStudent = async (req, res) => {
    try {
        const studentData = req.body;
        if (req.file) {
            studentData.profile_image = req.file.filename;
        }
        const student = await studentServices.createStudent(studentData);
        const response = student.toObject();
        delete response.password;
        if (response.profile_image) {
            response.profile_image_url = getImageUrl(req, response.profile_image);
        }
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginStudent = async (req, res) => {
    try {
        console.log(req.body);
        
        const { email, password } = req.body;
        const student = await studentServices.loginStudent(email, password);
        if (!student) return res.status(401).json({ message: 'Invalid email or password' });

        const { studentData, token } = student;
        const response = studentData.toObject();
        delete response.password;
        delete response.tokens;
        if (response.profile_image) {
            response.profile_image_url = getImageUrl(req, response.profile_image);
        }
        res.status(200).json({ 
            message: 'Login successful', 
            student: response, 
            token 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStudent = async (req, res) => {
    try {
        const student = await studentServices.getStudentById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        const response = student.toObject();
        delete response.password;
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStudentsList = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const result = await studentServices.getAllStudents({ page, limit, search });
        if (!result.students || result.students.length === 0) {
            return res.status(404).json({ error: 'No students found' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStudentData = async (req, res) => {
    try {
        const updateData = req.body;
        if (req.file) {
            updateData.profile_image = req.file.filename;
        }

        const student = await studentServices.updateStudent(req.params.id, updateData);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        const response = student.toObject();
        if (response.profile_image) {
            response.profile_image_url = getImageUrl(req, response.profile_image);
        }
        delete response.password;
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStudentData = async (req, res) => {
    try {
        const student = await studentServices.deleteStudent(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.status(200).json({message: "Student deleted successfully."});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};