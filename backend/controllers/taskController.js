const db = require('../config/db');

exports.getTasks = (req, res) => {

    const sql =
        'SELECT * FROM tasks WHERE user_id=?';

    db.query(
        sql,
        [req.user.id],
        (err, results) => {

            if (err)
                return res.status(500).json(err);

            res.json(results);

        }
    );

};

exports.createTask = (req, res) => {

    const { title, description } = req.body;

    const sql =
        'INSERT INTO tasks(title,description,user_id) VALUES(?,?,?)';

    db.query(
        sql,
        [
            title,
            description,
            req.user.id
        ],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.status(201).json({
                message: "Tâche créée"
            });

        }
    );

};

exports.updateTask = (req, res) => {

    const { title, description, status } = req.body;

    const sql =
        'UPDATE tasks SET title=?,description=?,status=? WHERE id=?';

    db.query(
        sql,
        [
            title,
            description,
            status,
            req.params.id
        ],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Tâche modifiée"
            });

        }
    );

};

exports.deleteTask = (req, res) => {

    const sql =
        'DELETE FROM tasks WHERE id=?';

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Tâche supprimée"
            });

        }
    );

};