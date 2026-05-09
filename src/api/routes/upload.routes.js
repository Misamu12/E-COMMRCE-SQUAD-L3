const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');
const path = require('path');

// Configuration de Multer pour stocker les fichiers dans le dossier uploads/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});

const upload = multer({ storage });

// Route POST /api/upload
// Le champ de fichier dans le formulaire doit s'appeler "file"
router.post('/', upload.single('file'), uploadController.handleUpload);

module.exports = router;
