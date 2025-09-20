const fs = require('fs');
const path = require('path');
const studentModel = require('../models/studentModel');
const { comparePassword } = require('../utils/passwordHelper');

exports.createStudent = async (studentData) => {
    const newStudent = new studentModel(studentData);
    return await newStudent.save();
};

exports.loginStudent = async (email, password) => {
    const student = await studentModel.findOne({ email });
    if (!student) return null;

    const isMatch = await comparePassword(password, student.password);
    if (!isMatch) return null;

    const { studentData, token } = await studentModel.generateToken(student);
    return { studentData, token };
};

exports.getStudentById = async (id) => {
    return await studentModel.findById(id);
};

exports.getAllStudents = async (options = {}) => {
    const { page = 1, limit = 10, search = '' } = options;
    let query = {};
    if (search) {
        query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        };
    }

    const skip = (page - 1) * limit;
    const students = await studentModel.find(query)
        .select('-password -tokens')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ created_at: -1 });

    const total = await studentModel.countDocuments(query);

    return {
        students,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

exports.updateStudent = async (id, updateData) => {
    let oldImagePath = null;
    const existingStudent = await studentModel.findById(id);
    if (!existingStudent) return null;
    if (updateData.profile_image && existingStudent.profile_image) {
        oldImagePath = path.join('public/images', existingStudent.profile_image);
    }

    const updatedStudent = await studentModel.findByIdAndUpdate(id, updateData, { new: true });
    if (updatedStudent && oldImagePath && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
    }

    return updatedStudent;
};

exports.deleteStudent = async (id) => {
    return await studentModel.findByIdAndDelete(id);
};