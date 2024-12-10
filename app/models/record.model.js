module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
      },
      score: {
        type: Number,
        required: true,
      },
      time_spent: {
        type: Number,
      },
      total_question: {
        type: Number
      },
      correct_answer: {
        type: Number
      },
      wrong_answer: {
        type: Number
      }
    },
    { timestamps: true }
  );

  const Record = mongoose.model("records", schema);
  return Record;
};
