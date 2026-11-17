/**
 * Local PostgreSQL for development without installing Postgres.
 * Starts an embedded Postgres (PGlite) on 127.0.0.1:5433, data kept in ./.pglite
 *
 *   npm run db:local
 *   DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/postgres
 */
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

async function main() {
  const db = await PGlite.create("./.pglite");
  const server = new PGLiteSocketServer({ db, port: 5433, host: "127.0.0.1", maxConnections: 20 });
  await server.start();
  console.log("Local Postgres (PGlite) listening on 127.0.0.1:5433");
  const stop = async () => {
    await server.stop();
    await db.close();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

main();
