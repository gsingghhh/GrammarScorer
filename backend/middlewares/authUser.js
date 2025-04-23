import jwt from 'jsonwebtoken'
import USER from '../models/userSchema.js'

export const authUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await USER.findOne({_id: decoded.id}).select('-password')
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized access'})
    }
}