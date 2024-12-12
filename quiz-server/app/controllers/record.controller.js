const db = require('../models');
const mongoose = require('mongoose')

const Record = db.records

exports.postRecords = async (req, res) => {
  const userId = req.session.user_id || req.user._id
  const { score, time_spent, total_question, correct_answer, wrong_answer } = req.body
  const id = new mongoose.Types.ObjectId(userId);

  const recordData = {
    user_id: id,
    score,
    time_spent,
    total_question,
    correct_answer,
    wrong_answer
  }

  const resultRecord = await Record.create(recordData);

  res.status(201).send({
      message: 'Record has saved successfully',
      record: resultRecord
  });
}

exports.getRecordsByHighestScore = async (req, res) => {
    try {
        // Mengambil semua user
        const records = await Record.find().sort({ score: -1 }).populate({
          path: 'user_id',
          select: 'name picture'
      });

        res.status(200).send({
            message: 'Get All Records Successfully',
            records: records
        });
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).send({
          message: err.message
      });
    }
}
