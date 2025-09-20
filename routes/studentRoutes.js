const router = require('express').Router();
const auth = require('../middleware/auth');
const { studentRegisterValidate, studentUpdateValidate, studentLoginValidate } = require('../middleware/validate');
const studentControllers = require('../controllers/studentControllers');
const { uploadSingle } = require('../middleware/fileUpload');

router.post('/api/auth/register', uploadSingle, studentRegisterValidate, studentControllers.addStudent);

router.post('/api/auth/login', studentLoginValidate, studentControllers.loginStudent);

router.get('/api/students', auth, studentControllers.getStudentsList);

router.get('/api/students/:id', auth, studentControllers.getStudent);

router.post('/api/students', auth, uploadSingle, studentRegisterValidate, studentControllers.addStudent);

router.put('/api/students/:id', auth, uploadSingle, studentUpdateValidate, studentControllers.updateStudentData);

router.delete('/api/students/:id', auth, studentControllers.deleteStudentData);

module.exports = router;