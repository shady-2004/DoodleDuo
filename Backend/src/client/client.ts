import mongoose from "mongoose";

async function connect() {
  try {
    if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
      throw new Error("Missing DATABASE or DATABASE_PASSWORD in .env");
    }

    let uri = process.env.DATABASE;

    const clientOptions = {
      serverApi: {
        version: "1" as const,
        strict: true,
        deprecationErrors: true,
      },
    };

    await mongoose.connect(uri, clientOptions);

    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().command({ ping: 1 as const });
    } else {
      throw new Error("Database connection is not established.");
    }

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("DB connection error:", err);
  }
}

export default connect;
