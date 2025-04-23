import USER from "../models/userSchema.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    const {fullName, email, password} = req.body

    if (!fullName || !email || !password){
        return res.status(400).json({message: 'All fields are required'})
    }

    try {
        const existingUser = await USER.findOne({email})
        if(existingUser){
            return res.status(400).json({message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await USER.create({
            fullName,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d'
        })

        return res.status(201).json({
            _id: user._id,                                                                         
            fullName,
            email,
            token
        })
    } catch (error) {
        return res.status(500).json({message: 'Error registering User'})
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({message: 'All fields are required'})
    }

    try {
        const userExists = await USER.findOne({email})
        if (!userExists){
            return res.status(400).json({message: 'Email or password is invalid'})
        }
        const correctPassword = await bcrypt.compare(password, userExists.password) 
        if(!correctPassword){
            return res.status(400).json({message: 'Email or password is invalid'})
        }
        const token = jwt.sign({id: userExists._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d'
        })

        return res.status(200).json({
            _id: userExists._id,
            fullName: userExists.fullName,
            email,
            token
        })
    } catch (error) {
        return res.status(500).json({message: 'Could not login. Try again later'})
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const user = req.user
        return res.status(200).json({user})
    } catch (error) {
        return res.status(500).json({message: 'Could not get the profile route'})
    }
}