import cluster from "cluster";
import { cpus } from "os";

export function forkCluster(numProcesses) {
  if (!cluster.isPrimary) return false;

  if (!numProcesses) numProcesses = cpus().length;

  for (let i = 0; i < numProcesses; i++) cluster.fork();

  cluster.on("exit", () => {
    cluster.fork();
  });

  return true;
}
