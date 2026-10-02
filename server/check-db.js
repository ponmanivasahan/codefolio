import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function run() {
  const user = await prisma.user.findUnique({
    where: { username: "demo1" },
    include: { profile: true }
  });
  console.log(JSON.stringify(user, null, 2));
}
run();