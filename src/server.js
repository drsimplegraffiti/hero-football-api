require("dotenv/config");
const app = require("./app");
const connectDB = require("./DB/db");

connectDB();

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`App listening on port: ${port}`.yellow);
});

console.log(app.get("env"));
