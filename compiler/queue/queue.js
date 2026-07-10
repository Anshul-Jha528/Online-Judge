import { Queue } from "bullmq";
import { connection } from "./connection.js";

export const compilerQueue = new Queue("compiler", {
    connection,
});