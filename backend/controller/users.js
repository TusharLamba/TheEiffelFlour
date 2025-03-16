const { User, getUserName } = require('../models/Users');
const jwt = require('jsonwebtoken');
const { logEvents } = require('../middleware/logHandler');
const { validatePassword, genPassword } = require('../utils/passwordUtils');

const handleSignUp = async (req, res, next) => {
    const { username, password, email, role } = req.body;
    try {
        const { salt, hash } = genPassword(password);

        const user = new User({ username, password: hash, salt, email, role });
        await user.createUser();

        res.status(201).json({ status: 201, message: 'User Created' });
        // res.redirect('/user/login');
       
    } catch (err) {
        const errToThrow = new Error();
        switch (err?.code) {
            case "23505":
                errToThrow.message = 'User/Email already exists';
                errToThrow.statusCode = 403;
                break;
            default:
                errToThrow.statusCode = 500;
                errToThrow.message = err.message;
        }
        next(errToThrow);
    }
}

const IsUsernameAvailable = async (req, res) => {
    const { name } = req.params;

    const user = await getUserName(name);
    if (!user || !user[0]) {
        return res.status(200).json({ status: 200, message: "Username is available" });
    } else {
        return res.status(403).json({ status: 403, message: "Username is already taken" });
    }
}


const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: 400,
            message: "Username or Password not present"
        });
    }
    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(403).json({ status: 403, message: "User Not Found" });
        } else {
            // user found, now match password
            if (!user.password) {
                return res.status(403).json({ message: 'Password not found' });
            }

            // change this with validatePassword from passwordUtils.js
            const isValid = validatePassword(password, user.salt, user.password);
            
            await logEvents(`user:${username}\tpass:${password}\tsaved hash:${user.password}\tmatch:${isValid}`, "userLogs.txt");
            if (!isValid) {
                return res.status(403).json({ status: 403, message: "Password didn't match" });
            }
            // password matched, now sign token & send that in cookie
            const token = jwt.sign({ user: username, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                maxAge: 1000 * 60 * 60,
            });

            res.status(200).json({ status: 200, message: 'Login Successful' });
        }
    } catch (err) {
        throw new Error(err.message);
    }
}



module.exports = { handleSignUp, IsUsernameAvailable, handleLogin }