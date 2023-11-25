import clientPromise from "../../../../lib/mongodb";

export default async function all(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("geography-api");

        const results = await db
            .collection("tests")
            .find({})
            .project({ name: 1, id: 1, _id: 0, distinguishPoints: 1 })
            .toArray();

        res.json({success: true, results});
    } catch (e) {
        res.json({success: false, message: e.message});
    }
};