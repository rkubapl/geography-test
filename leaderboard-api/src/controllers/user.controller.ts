import User, {IUser} from "../models/User";
// @ts-ignore
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

function generateAccessToken(id, expiresIn) {
    return jwt.sign({id}, process.env.TOKEN_SECRET, { expiresIn });
}

const EXPIRES_IN = 60*60*24*60;
export default class UserController {

    public async register(req, res, next) {
        try {
            const {nickname, password} = req.body;

            if(!nickname || nickname.length < 4 || nickname.length > 20 || hasWhiteSpace(nickname)) {
                return res.status(400).json({success: false, message: "Nickname must be from 4 to 20 characters long and can't contain space"});
            }

            if(!password || password.length < 8 || password.length > 20) {
                return res.status(400).json({success: false, message: "Password must be from 8 to 20 characters long"});
            }

            const user : IUser = await User.findOne({
                nickname
            })

            if(user) {
                return res.status(400).json({success: false, message: "User with that nickname exists!"});
            }

            const u = await User.create({
                nickname,
                password: bcrypt.hashSync(req.body.password, 10)
            })

            const token = generateAccessToken(u._id.toString(), EXPIRES_IN)

            await res.status(200).json({success: true, data: token, message: "Registered!", user: u.toJSON()});
        } catch (e) {
            next(e);
        }
    }

    public async login(req, res, next) {
        try {
            const user : IUser = await User.findOne({
                nickname: req.body.nickname
            })

            if(!user) {
                return res.status(401).json({success: false, message: 'Wrong username or password!'});
            }

            const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

            if(!isPasswordValid) {
                return res.status(401).json({success: false, message: 'Wrong username or password!'});
            }

            const token = generateAccessToken(user._id.toString(), EXPIRES_IN)

            await res.status(200).json({ success: true, data: token, user: user.toJSON() });
        } catch (e) {
            next(e)
        }
    }

    public async info(req, res, next) {
        try {
            const user : IUser = await User.findOne({
                _id: req.user.id
            })

            if(!user) {
                await res.status(401).json({success: false, message: "User doesn't exist"});
                return;
            }

            await res.status( 200 ).json({ success: true, data: user.toJSON()});
        } catch (e) {
            next( e );
        }
    }
}

function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
}