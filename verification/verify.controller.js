exports.verify = async (req, res) => {
    const { chip_id } = req.body;

    if (!chip_id) {
        return res.status(400).json({ error: "chip_id does not exist"});
    }

    const result = await verifyService.verify(chip_id);
    res.json(result);
}
