const path = require('path');

exports.handleUpload = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier reçu' });
    }

    // URL ou chemin du fichier
    const filePath = `/uploads/${req.file.filename}`;

    return res.status(201).json({
        message: 'Fichier uploadé avec succès',
        file: {
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            filename: req.file.filename,
            path: filePath,
        },
    });
};
