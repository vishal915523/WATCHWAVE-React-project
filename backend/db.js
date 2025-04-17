const mongoose = require("mongoose");

exports.Database = function Database() {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/watchwave", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("DB Connection Successful");
      })
      .catch((err) => {
        console.error("DB Connection Error:", err.message);
      });
}
 