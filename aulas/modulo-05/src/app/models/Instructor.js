const db = require('../../config/db');
const date = require('../../utils/date');

module.exports = {
    all(callback) {
        db.query(`
            SELECT instructors.*, count(members.name) AS total_students 
            FROM instructors 
            LEFT JOIN members ON (members.instructor_id = instructors.id)
            GROUP BY instructors.id
            ORDER BY name ASC`, (err, result) => {
            if (err) throw `Database Error! ${err}`

            callback(result.rows);
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO instructors (
                name,
                avatar_url,
                gender,
                services,
                birth,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;

        const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.services,
            date.getDate(data.birth).iso,
            date.getDate(Date.now()).iso
        ];

        db.query(query, values, (err, result) => {
            if (err) throw `Database Error! ${err}`

            callback(result.rows[0]);
        });
    },
    find(id, callback) {
        db.query(`SELECT * FROM instructors WHERE id = ${id}`, (err, result) => {
            if (err) throw `Database Error! ${err}`
            
            callback(result.rows[0]);
        });
    },
    findBy(filter, callback) {
        db.query(`
            SELECT instructors.*, count(members.name) AS total_students 
            FROM instructors 
            LEFT JOIN members ON (members.instructor_id = instructors.id)
            WHERE instructors.name ILIKE '%${filter}%'
            OR instructors.services ILIKE '%${filter}%'
            GROUP BY instructors.id
            ORDER BY name ASC`, (err, result) => {
            if (err) throw `Database Error! ${err}`

            callback(result.rows);
        })
    },
    update(data, callback) {
        const query = `
            UPDATE instructors SET
                avatar_url=($1),
                name=($2),
                birth=($3),
                gender=($4),
                services=($5)
            WHERE id = $6
        `;

        const values = [
            data.avatar_url,
            data.name,
            date.getDate(data.birth).iso,
            data.gender,
            data.services,
            data.id
        ];

        db.query(query, values, (err, result) => {
            if (err) throw `Database Error! ${err}`
            
            callback();
        });
    },
    delete(id, callback) {
        db.query(`DELETE FROM instructors WHERE id = $1`, [id], (err, result) => {
            if (err) throw `Database Error! ${err}`
            
            callback();
        });
    },
    paginate(params) {
        const { filter, limit, offset, callback} = params;

        let query = `
            SELECT instructors.*, count(members) AS total_students
            FROM instructors
            LEFT JOIN members ON (instructors.id = members.instructor_id)
            `;

        if (filter) {
            query = `${query}
                WHERE instructors.name ILIKE '%${filter}%'
                OR instructors.services ILIKE '%${filter}%'`
        }

        query = `${query}
            GROUP BY instructors.id
            LIMIT $1 OFFSET $2`

        db.query(query, [limit, offset], (err, result) => {
            if (err) throw `Database Error! ${err}`
            
            callback(result.rows); 
        })
    }
}