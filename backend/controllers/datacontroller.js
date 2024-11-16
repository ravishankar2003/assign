import Data from "../models/Data.js";
import User from "../models/User.js";
import { errorHandler } from "../utils/error.js";

const createdata = async (req, res, next) => {
    try {
        if(!req.user.isadmin)
        {
            return next(errorHandler(403, 'User is not admin'));
        }

        const {country , content} = req.body;
        if (!country || country === '' || !content || content === '') {
            return next(errorHandler(400, 'All fields are required'));
        }
        const data = new Data({
            country,
            content,
        }); 
        await data.save();
        res.status(201).json(data);
        
    } catch (error) {
        next(error);
    }
}

const updatedata = async (req, res, next) => {
    try {
        if(!req.user.isadmin)
        {
            return next(errorHandler(403, 'User is not admin'));
        }
        const { id } = req.params;
        const { content } = req.body;
        if (!content || content === '') {
            return next(errorHandler(400, 'empty content'));
        }
        const data = await Data.findByIdAndUpdate(id, { content : content });
        res.status(200).json(data);

    } catch (error) {
        next(error);
    }
}

const deletedata = async (req, res, next) => {
    try {
        if(!req.user.isadmin)
        {
            return next(errorHandler(403, 'User is not admin'));
        }

        const { id } = req.params;
        await Data.findByIdAndDelete(id);
        res.status(200).json({ message: "Data deleted" });

    } catch (error) {
        next(error);
    }

}

export { createdata, updatedata, deletedata };

        