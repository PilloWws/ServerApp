const Log = require('../models/logModel')

const handleGetCurrentLog = async (req, res) => {
    try {
        // Lấy thông tin log có timestamps mới nhất (currentLog)
        const currentLog = await Log.findOne({})
        console.log(currentLog)

        // Lấy thông tin log ngay trước currentLog (prevLog)

        // Trả về kết quả
        res.status(200).json({ success: true, currentLog });
    } catch (error) {
        console.error('Error getting current log:', error);
        throw error; // Nếu có lỗi, bạn có thể xử lý hoặc lan truyền lỗi ra ngoài để báo cáo.
    }
}
const handleSetCurrentLog = async (req, res) => {
    try {
        const { current, objectId } = req.body;
        console.log(current, objectId)
        const existingLog = await Log.findOne({});
        if (existingLog) {
            existingLog.prevLog = existingLog.currentLog;
            existingLog.currentLog = current;
            existingLog.objectId = objectId;

            // Lưu lại bản ghi đã cập nhật
            const updatedLog = await existingLog.save();
            res.status(200).json({ success: true, updatedLog });
        } else {
            const newLog = new Log({
                prevLog: false,
                currentLog: current,
                objectId: objectId
            });

            // Lưu mới vào cơ sở dữ liệu
            const savedLog = await newLog.save();
            res.status(200).json({ success: true, savedLog });

        }

    } catch (error) {
        console.log("error in handleSetCurrentlog", error)
        throw error
    }
}
const handleToggleCurrentLog = async (req, res) => {
    try {
        const existingLog = await Log.findOne({});
        if (existingLog) {
            existingLog.currentLog = !existingLog.currentLog;
            existingLog.save();
            return res.status(200).json({ success: true, message: "toggle current log successfully" });
        }

    } catch (error) {
        console.log("error in handleSetCurrentlog", error)
        throw error
    }
}
module.exports = {
    handleGetCurrentLog: handleGetCurrentLog,
    handleSetCurrentLog: handleSetCurrentLog,
    handleToggleCurrentLog: handleToggleCurrentLog

}