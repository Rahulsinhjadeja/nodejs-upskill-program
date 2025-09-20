const multer = require('multer');
const path = require('path');
const validImage = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 9999) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (validImage.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid profile image format. Only JPG, JPEG, PNG, WEBP and GIF are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: fileFilter
});

module.exports = {
    uploadSingle: upload.single('profile_image')
};
