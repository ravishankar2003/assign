import User from "../models/User.js";
import Data from "../models/Data.js";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';


const updatecountry = async (req, res,next) => {
    try {
        const { country } = req.body;
        if (!country || country === '') {
            return next(errorHandler(400, 'Country is required'));
        }
        await User.findByIdAndUpdate(req.user.id, { country : country });
        res.status(200).json({ message: "Country updated" });
        
    } catch (error) {
        next(error);
    }
}

const getuser = async (req, res,next) => {
    try {
        const user = await User.findById(req.user.id)
        const token = jwt.sign(
            { id: user._id, isadmin: user.isadmin },
            process.env.JWT_SECRET,
        );

        // Exclude password from response
        const { password: pass, ...rest } = user._doc;

        // Return response
        return res.status(200).json({ 
            ...rest,
            "token": token
         });
    }
    catch (error) {
        next(error);
    }

}

const getdata = async (req, res,next) => {
    try {
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        const data = await Data.find({country: user.country});
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }

}



export  {updatecountry, getuser, getdata};


