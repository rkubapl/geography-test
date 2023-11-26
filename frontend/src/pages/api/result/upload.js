// import clientPromise from "../../../lib/mongodb";
import clientPromise from "../../../../lib/mongodb";
import {getSession} from "@auth0/nextjs-auth0";

export default async function upload(req, res) {
    try {
        const session = await getSession(req, res);

        const client = await clientPromise;
        const db = client.db("geography-api");

        let userId;
        if(session && session.user) {
            userId = session.user.sub

            // const user = await db
            //     .collection("auth0-users")
            //     .find({sub: session.user.sub});
            //
            // res.json(user)
            // if(!user) {
            //     const createUser = await db
            //         .collection("auth0-users")
            //         .insertOne({sub: session.user.sub, nickname: session.user.nickname})
            // }
        }

        const {testId, time, accuracy, points, mode} = req.body;

        if(!testId || !time || !validNum(time) || !accuracy || !validNum(accuracy) || !points || !validInt(points) || !["CLICK", "TYPE"].includes(mode)) {
            res.json({success: false, message: "Invalid data"});
            return
        }


        const results = await db
            .collection("test-results")
            .insertOne({userId, testId, time: parseFloat(time), points: parseInt(points), accuracy: parseFloat(accuracy), mode});

        res.json({success: true, results});


        // res.json({ protected: 'My Secret', id: user.sub });
    } catch (e) {
        res.json({success: false, message: e.message});
    }
};

function validNum(num) {
    return !Number.isNaN(Number(num))
}

function validInt(num) {
    return validNum(num) && num % 1 === 0
}