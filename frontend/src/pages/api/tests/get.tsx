import clientPromise from "../../../../lib/mongodb";
import {useRouter} from "next/router";
import {NextApiRequest} from "next";

export default async (req: NextApiRequest, res) => {
    try {
        const {testId} = req.query;

        const client = await clientPromise;
        const db = client.db("geography-api");

        const result = await db
            .collection("tests")
            .findOne({id: testId});

        res.json({success: true, result});
    } catch (e) {
        res.json({success: false, message: e.message});
    }
};