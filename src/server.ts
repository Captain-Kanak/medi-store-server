import app from "./app.js";
import { envConfig } from "./config/envConfig.js";
import { prisma } from "./lib/prisma.js";

const port = envConfig.port || 5000;

async function server() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
}

server();
