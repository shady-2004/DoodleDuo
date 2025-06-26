import app from "./app";
import dotenv from "dotenv";
import connect from "./client/client";

dotenv.config({ path: "./config.env" });

const run = async () => {
  await connect();

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
};

run().catch(console.dir);
