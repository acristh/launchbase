const db = require('../../config/db');
const date = require('../../utils/date');

module.exports = {
    all(callback) {
        db.query(`
            SELECT * 
            FROM members
            ORDER BY name ASC`, (err, result) => {
            if (err) throw `Database Error! ${err}`

            callback(result.rows);
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO members (
                name,
                avatar_url,
                gender,
                email,
                birth,
                blood,
                weight,
                height,
                instructor_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;

        const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.email,
            date.getDate(data.birth).iso,
            date.blood,
            data.weight,
            data.height,
            data.instructor
        ];

        db.query(query, values, (err, result) => {
            if (err) throw `Database Error! ${err}`

            callback(result.rows[0]);
        });
    },
    find(id, callback) {
        db.query(`
            SELECT members.*, instructors.name AS instructor_name 
            FROM members 
            LEFT JOIN instructors ON (members.instructor_id = instructors.id)
            WHERE members.id = ${id}`, (err, result) => {
            if (err) throw `Database Error! ${err}`
            
            callback(result.rows[0]);
        });
    },
    update(data, callback) {
        const query = `
            UPDATE members SET
                avatar_url=($1),
                name=($2),
                birth=($3),
                gender=($4),
                email=($5),
                blood=($6),
                weight=($7),
                height=($8),
                instructor_id=($9)
            WHERE id = $10
        `;

        const values = [
            data.avatar_url,
            data.name,
            date.getDate(data.birth).iso,
            data.gender,
            data.email,
            data.blood,
            data.weight,
            data.height,
            data.instructor,
            data.id
        ];

        db.query(query, values, (err, result) => {
            if (err) throw `Database Error! ${err}`
            
            callback();
        });
    },
    delete(id, callback) {
        db.query(`DELETE FROM members WHERE id = $1`, [id], (err, result) => {
            if (err) throw `Database Error! ${err}`
            
            callback();
        });
    },
    instructorsSelectOptions(callback) {
        db.query(`SELECT name, id FROM instructors`, (err, results) => {
            if (err) throw 'Database Error!'

            callback(results.rows)
        })
    }
}