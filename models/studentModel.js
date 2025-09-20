const { model, Schema } = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../utils/passwordHelper');
const validGender = ['male', 'female', 'other'];
const validBranch = ['cse', 'ece', 'me', 'ce', 'ee', 'other'];

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9 ]+$/.test(v);
            },
            message: 'Invalid name! Only alphanumeric characters and spaces are allowed.'
        }
    },
    email: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid.');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1 })) {
                throw new Error('Password must contain minimum 8 characters long with at least 1 uppercase, 1 lowercase and 1 symbol.');
            }
        }
    },
    phone_number: {
        type: String,
        required: true,
        minLength: [10, 'Phone number must be exactly 10 digits.'],
        maxLength: [10, 'Phone number must be exactly 10 digits.'],
        match: [/^\d{10}$/, 'Phone number must be numeric and exactly 10 digits.'],
    },
    gender: {
        type: String,
        enum: validGender,
        required: true,
        enum: {
            values: validGender,
            message: `Gender must be one of: ${validGender.join(', ')}`
        }
    },
    enrollment_number: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        match: [/^ENR2025[A-Z0-9]{4}$/, 'Invalid enrollment number!'] // Enrollment number must start with "ENR2025" followed by 4 alphanumeric upper case characters
    },
    branch: {
        type: String,
        enum: validBranch,
        required: true,
        enum: {
            values: validBranch,
            message: `Branch must be one of: ${validBranch.join(', ')}`
        }
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
        validate: {
            validator: Number.isInteger,
            message: 'Semester must be an integer between 1 and 12'
        }
    },
    address: {
        type: String,
        trim: true,
        maxLength: 255,
    },
    profile_image: {
        type: String,
        validate: {
            validator: function (value) {
                if (!value) return true;
                return /\.(jpg|jpeg|png|gif|webp)$/i.test(value);
            },
            message: 'Invalid profile image format. Only JPG, JPEG, PNG, WEBP and GIF are allowed.'
        }
    },
    tokens: {
        type: Array,
        default: []
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

studentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await hashPassword(this.password);
    next();
});

studentSchema.pre('findByIdAndUpdate', async function(next) {
    const update = this.getUpdate();
    if (update.password) {
        update.password = await hashPassword(update.password);
    }
    next();
});

studentSchema.statics.generateToken = async function(studentData) {
    try {
        let token = jwt.sign({_id: studentData._id}, process.env.JWT_SECRET);
        studentData.tokens.push({token: token});
        await this.findByIdAndUpdate(studentData._id, {tokens: studentData.tokens});
        return {studentData, token}
    } catch (error) {
        throw new Error(error.message)
    }
}

const studentModel = model('students', studentSchema);

module.exports = studentModel;