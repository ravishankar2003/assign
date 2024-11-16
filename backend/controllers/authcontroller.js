import User from "../models/User.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

const signup = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password || username === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return next(errorHandler(400, 'User already exists'));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
        });

        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, isadmin: user.isadmin },
            process.env.JWT_SECRET,
        );

        // Exclude password from response
        const { password: pass, ...rest } = user._doc;

        // Return response
        return res.status(201).json({ ...rest ,
            "token": token
        });

    } catch (error) {
        next(error);
    }
};

const signin = async (req, res, next) => {
    const { username, password } = req.body || {};

    if (!username || !password || username === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        const userin = await User.findOne({ username });
        if (!userin) {
            return next(errorHandler(404, 'Invalid credentials'));
        }

        const validPassword = bcryptjs.compareSync(password, userin.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid credentials'));
        }

        const token = jwt.sign(
            { id: userin._id, isadmin: userin.isadmin },
            process.env.JWT_SECRET,
        );

        // Exclude password from response
        const { password: pass, ...rest } = userin._doc;

        // Return response
        return res.status(200).json({ ...rest,
            "token": token
         });

    } catch (error) {
        next(error);
    }
};

export { signup, signin };
