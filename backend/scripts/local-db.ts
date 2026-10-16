import { localPostgres } from './local-postgres.js';
if (process.env.NODE_ENV==='production') throw new Error('Local database is development only');
const db=await localPostgres();
await db.migrationPool.end();
console.log(`Local PostgreSQL ready on 127.0.0.1:${db.port}; database ${db.database}. Migrations applied. Use backend/.env.example local URLs.`);
async function stop(){await db.pg.stop();process.exit(0);}
process.once('SIGINT',()=>void stop());process.once('SIGTERM',()=>void stop());
// Keep the supervisor alive; PostgreSQL is stopped by the signal handlers.
setInterval(()=>{},60000);
