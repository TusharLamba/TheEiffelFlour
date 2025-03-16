const db = require('../db/index'); 

// Constructor function for a user object
class User {
    constructor({
        username, email, password, salt, role = "User"
    }) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.salt = salt;
        this.role = role;
    }

    createUser = async () => {
        try {
            const { rows } = await db.query(
                ` INSERT INTO "user" (username, password, salt, email, role)
                    VALUES($1,$2,$3,$4)`,
                [this.username, this.password, this.salt, this.email, this.role]
            );
            return rows;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static findByUsername = async (uname) => {
        try {
            const { rows } = await db.query(
                ` SELECT username, password, salt, email, role from "user" WHERE username = $1`,
                [uname]
            );
            if (!rows || !rows[0]) {
                console.log(`No user found with ${uname}`);
                return null;
            }
            return new User(rows[0]);

        } catch(err) {
            throw new Error(err.message);
        }
    }

    updateEmail = async (newEmail) => {
        try {
            const res = await db.query(
                ` UPDATE "user" SET email = $1 WHERE username = $2`,
                [newEmail, this.username]
            );
            if (res.rowCount > 0) {
                console.log(`UPDATE EMAIL -- ${this.username}'s email updated from ${this.email} to ${newEmail}`);
                this.email = newEmail;
                return true;
            } else {
                console.log('UPDATE EMAIL -- No updation');
                return false;
            }
        } catch(err) {
            throw new Error(err.message);
        }
    }

}


const getUserName = async (uname) => {
    try {
        const { rows } = await db.query(`SELECT username FROM "user" WHERE username=$1`, [uname]);
        return rows;
    } catch (err) {
        throw new Error(err.message);
    }
}

const getPassSalt = async (uname) => {
    try {
        const { rows } = await db.query(`SELECT password, salt FROM "user" WHERE username=$1`, [uname]);
        return rows;
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = { User, getUserName };

