const Log = require('../models/log.model');

exports.createLog = async (req, res) => {
    try {
        const { actionType, additionalData } = req.body;
        const newLog = new Log({
            actionType,
            userId: req.user._id,
            role: req.user.role,
            additionalData,
        });
        await newLog.save();
        res.status(201).send("Log created.");
    } catch (error) {
        res.status(500).send("Error creating log.");
    }
};

exports.fetchLogs = async (req, res) => {
    try {
        const { actionType, startDate, endDate, page = 1, limit = 10 } = req.query;
        const query = { isDeleted: false };

        if (req.user.role !== "admin") query.userId = req.user._id;
        if (actionType) query.actionType = actionType;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const logs = await Log.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).send("Error registering user.");
    }
};

exports.softDeleteLog = async (req, res) => {
    try {
        if (req.user.role !== "admin") return res.status(403).send("Access denied.");
        await Log.findByIdAndUpdate({ _id: req.params.id }, { isDeleted: true });
        res.send("Log soft-deleted.");
    } catch (error) {
        res.status(500).send("Error registering user.");
    }
};


exports.addAdditionalData = async (req, res) => {
    try {
        const { userId } = req.params;
        const { additionalData } = req.body;

        if (!additionalData || typeof additionalData !== 'object') {
            return res.status(400).send("Invalid additional data format.");
        }

        const updatedLog = await Log.findByIdAndUpdate(
            userId,
            { $set: { additionalData: { ...additionalData } } },
            { new: true }
        );

        if (!updatedLog) {
            return res.status(404).send("Log entry not found.");
        }

        // const newLog = new Log({
        //     actionType: 'Action',
        //     userId: req.user._id,
        //     role: req.user.role,
        //     additionalData: additionalData,
        // });

        // await newLog.save();

        res.json(updatedLog);
    } catch (error) {
        res.status(500).send("Error adding additional data.");
    }
};

exports.deleteAdditionalData = async (req, res) => {
    try {
        const { userId, key } = req.params;

        const updatedLog = await Log.findByIdAndUpdate(
            userId,
            { $unset: { [`additionalData.${key}`]: "" } },
            { new: true }
        );

        if (!updatedLog) {
            return res.status(404).send("Log entry not found.");
        }

        // const newLog = new Log({
        //     actionType: 'Action',
        //     userId: req.user._id,
        //     role: req.user.role,
        //     additionalData: getAdditionalData(req),
        // });

        // await newLog.save();

        res.json(updatedLog);
    } catch (error) {
        res.status(500).send("Error deleting additional data.");
    }
};