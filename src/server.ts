import { app } from "./app";
import { envConfig } from "./config/envConfig";
import { prisma } from "./lib/prisma";

const port = envConfig.port || 5000;

async function server() {
  await prisma.$connect();
  console.log("Database connected");

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

server();
