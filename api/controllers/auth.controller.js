const { User, Role } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'elegance-spiritueux-secret-key';
const JWT_EXPIRES = '7d';

exports.register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
        }

        if (password.length < 4) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 4 caractères' });
        }

        const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            return res.status(409).json({ error: 'Un compte avec cet email existe déjà' });
        }

        const user = await User.create({
            fullname: fullname.trim(),
            email: email.toLowerCase().trim(),
            password,
            role_id: 1
        });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        res.status(201).json({
            message: 'Compte créé avec succès',
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Veuillez saisir votre email et mot de passe' });
        }

        const user = await User.findOne({
            where: { email: email.toLowerCase() },
            include: [{ model: Role, attributes: ['name'] }]
        });

        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const validPassword = await user.validPassword(password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        res.json({
            message: 'Connexion réussie',
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.Role?.name
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};

exports.me = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ['id', 'fullname', 'email', 'created_at'],
            include: [{ model: Role, attributes: ['name'] }]
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.json({
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.Role?.name
            }
        });
    } catch (error) {
        console.error('Me error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
