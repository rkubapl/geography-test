import Result, {IResult} from "../models/Result";
import User, {IUser} from "../models/User";
import user from "../models/User";

export default class ResultController {
    public async create(req, res, next) {
        try {
            const result = new Result({
                user: req.user ? req.user.id : undefined,
                testId: req.body.testId,
                points: req.body.points,
                time: round(req.body.time, 2),
                accuracy: round(req.body.accuracy, 2),
            })

            await result.save();

            await res.status( 200 ).json({success: true} );
        } catch (e) {
            next(e);
        }
    }

    public async leaderboard(req, res, next) {
        try {
            let resultsParsed = []

            const results = await Result.find({testId: req.query.testId}).sort({ points : -1}).limit(10).exec();

            for (const result of results) {
                let obj = {
                    user: "Anonimowy użytkownik",
                    points: result.points,
                    accuracy: result.accuracy,
                    time: result.time,
                    anonym: true
                };

                if(result.user) {
                    const user : IUser = await User.findOne({
                        _id: result.user
                    })

                    if(user !== undefined) {
                        obj.user = user.nickname
                        obj.anonym = false;
                    } else {
                        obj.user = "Konto nie istnieje!"
                        obj.anonym = false;
                    }
                }

                resultsParsed.push(obj)
            }

            await res.status( 200 ).json({success: true, results: resultsParsed});
        } catch (e) {
            next(e);
        }
    }

    public async getUserResults(req, res, next) {
        try {
            const {nickname} = req.query;

            if(!nickname) {
                return res.status(400).json({success: false, message: "Query \"nickname\" is needed!"});
            }

            const user : IUser = await User.findOne({nickname});

            if(!user) {
                return res.status(400).json({success: false, message: "User doesn't exist!"});
            }

            const results: IResult[] = await Result.find({user: user.id}).exec();

            const records = {};

            results.forEach((result: IResult) => {
                // @ts-ignore
                const now = records[result.testId];

                if(!now || result.points > now.points) { // @ts-ignore
                    records[result.testId] = {points: result.points, accuracy: result.accuracy, time: result.time};
                }
            })

            // resultsParsed = results.map(result => result.toJSON())
            await res.status( 200 ).json({success: true, data: results.slice(-10).reverse().map(result => result.toJSON()), records});
        } catch (e) {
            next(e);
        }
    }
}

function round(num, places) {
    const p = Math.pow(10, places);
    return Math.round(num * p) / p
}