module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      googleId: {
        type: String,
        unique: true, 
        sparse: true
      },
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: String,
      picture: String,
    }
  )

  const User = mongoose.model("users", schema);
  return User;
};