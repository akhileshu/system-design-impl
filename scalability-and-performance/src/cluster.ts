import cluster, { Worker } from "cluster";
import os from "os";
import startServer from "./server";

const isClusterMode = process.env.CLUSTER_MODE === "true";

if (!isClusterMode) {
  startServer();
} else {
  const numCPUs = os.cpus().length;

  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker: Worker, code: number, signal: string) => {
      console.log(`Worker ${worker.process.pid} died`);
      // Restart the worker if it dies
      cluster.fork();
    });
  } else {
    // Workers can share any TCP connection
    startServer();
    console.log(`Worker ${process.pid} started`);
  }
}
