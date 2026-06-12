const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
            'INSERT INTO users (name,email,password) VALUES (?,?,?)';

        db.query(
            sql,
            [name, email, hashedPassword],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.status(201).json({
                    message: "Utilisateur créé avec succès"
                });

            }
        );

    } catch (error) {

        res.status(500).json(error);

    }

};


exports.login = (req, res) => {

    const { email, password } = req.body;

    const sql =
        'SELECT * FROM users WHERE email=?';

    db.query(
        sql,
        [email],
        async (err, results) => {

            if (err)
                return res.status(500).json(err);

            if (results.length === 0)
                return res.status(404).json({
                    message: "Utilisateur introuvable"
                });

            const user = results[0];

            const validPassword =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!validPassword)
                return res.status(401).json({
                    message: "Mot de passe incorrect"
                });

            const token =
                jwt.sign(
                    {
                        id: user.id
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1d'
                    }
                );

            res.json({
                token
            });

        }
    );

};