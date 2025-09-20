const { check, validationResult } = require('express-validator');
const validGender = ['male', 'female', 'other'];
const validBranch = ['cse', 'ece', 'me', 'ce', 'ee', 'other'];
const validImage = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

const studentRegisterValidate = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .matches(/^[a-zA-Z0-9 ]+$/)
        .withMessage('Only alphanumeric characters and spaces are allowed')
        .bail(),
    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email is required!')
        .isEmail()
        .withMessage('Invalid email address')
        .bail(),
    check('password')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Password is required!')
        .bail()
        .isLength({ min: 8 })
        .withMessage('Minimum 8 characters required')
        .bail()
        .withMessage('Password must contain minimum 8 characters long with at least 1 uppercase, 1 lowercase and 1 symbol')
        .bail(),
    check('phone_number')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Phone number is required!')
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be exactly 10 digits')
        .isNumeric()
        .withMessage('Phone number must be numeric')
        .bail(),
    check('gender')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Gender is required!')
        .isString()
        .withMessage('Invalid gender')
        .isIn(validGender)
        .customSanitizer(value => typeof value === 'string'? value.toLowerCase() : value)
        .withMessage(`Gender must be one of: ${validGender.join(', ')}`)
        .bail(),
    check('enrollment_number')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Enrollment number is required!')
        .isAlphanumeric()
        .withMessage('Enrollment number must be alphanumeric')
        .bail(),
    check('semester')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Semester is required!')
        .isInt({min : 1, max: 12})
        .withMessage('Semester must be an integer between 1 to 12')
        .bail(),
    check('branch')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Branch is required!')
        .isString()
        .withMessage('Invalid branch name')
        .customSanitizer(value => typeof value === 'string'? value.toLowerCase() : value)
        .isIn(validBranch)
        .withMessage(`Branch must be one of: ${validBranch.join(', ')}`)
        .bail(),
    check('address')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Address cannot exceed 255 characters')
        .bail(),
    check('profile_image').custom((value, { req }) => {
        if (req.file && !validImage.includes(req.file.mimetype)) {
            throw new Error('Invalid profile image format. Only JPG, JPEG, PNG, WEBP and GIF are allowed.');
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];

const studentLoginValidate = [
    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email')
        .bail(),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    }
];

const studentUpdateValidate = [
    check('name')
        .optional()
        .trim()
        .matches(/^[a-zA-Z0-9 ]+$/)
        .withMessage('Only alphanumeric characters and spaces are allowed')
        .bail(),
    check('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Invalid email address')
        .bail(),
    check('password')
        .optional()
        .trim()
        .escape()
        .bail()
        .isLength({ min: 8 })
        .withMessage('Minimum 8 characters required')
        .bail()
        .withMessage('Password must contain minimum 8 characters long with at least 1 uppercase, 1 lowercase and 1 symbol')
        .bail(),
    check('phone_number')
        .optional()
        .trim()
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be exactly 10 digits')
        .isNumeric()
        .withMessage('Phone number must be numeric')
        .bail(),
    check('gender')
        .optional()
        .trim()
        .isString()
        .withMessage('Invalid gender')
        .isIn(validGender)
        .customSanitizer(value => typeof value === 'string'? value.toLowerCase() : value)
        .withMessage(`Gender must be one of: ${validGender.join(', ')}`)
        .bail(),
    check('enrollment_number')
        .optional()
        .trim()
        .isAlphanumeric()
        .withMessage('Enrollment number must be alphanumeric')
        .bail(),
    check('semester')
        .optional()
        .trim()
        .isInt({min : 1, max: 12})
        .withMessage('Semester must be an integer between 1 to 12')
        .bail(),
    check('branch')
        .optional()
        .trim()
        .isString()
        .withMessage('Invalid branch name')
        .customSanitizer(value => typeof value === 'string'? value.toLowerCase() : value)
        .isIn(validBranch)
        .withMessage(`Branch must be one of: ${validBranch.join(', ')}`)
        .bail(),
    check('address')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Address cannot exceed 255 characters')
        .bail(),
    check('profile_image').custom((value, { req }) => {
        if (req.file && !validImage.includes(req.file.mimetype)) {
            throw new Error('Invalid profile image format. Only JPG, JPEG, PNG, WEBP and GIF are allowed.');
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];

module.exports = {
    studentRegisterValidate,
    studentLoginValidate,
    studentUpdateValidate
};