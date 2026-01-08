const verifyService = require('./verify.service');


exports.verify = async (req, res) => {
    const { chipId } = req.body;

    if (!chipId) {
        return res.status(400).json({ error: "chipId does not exist"});
    }

    const result = await verifyService.verify(chipId);
    res.json(result);
}
