import postgres from 'postgres';
import { env } from '../src/config/env';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function initDb() {
    const dbUrl = env.DATABASE_URL;
    const urlParts = new URL(dbUrl);
    const dbName = urlParts.pathname.slice(1); // Remove leading slash

    // Connect to default 'postgres' database to manage databases
    const adminUrl = new URL(dbUrl);
    adminUrl.pathname = '/postgres';

    const sql = postgres(adminUrl.toString());

    try {
        console.log(`Checking if database '${dbName}' exists...`);
        const result = await sql`SELECT 1 FROM pg_database WHERE datname = ${dbName}`;

        if (result.length === 0) {
            console.log(`Database '${dbName}' does not exist. Creating...`);
            await sql`CREATE DATABASE ${sql(dbName)}`;
            console.log(`Database '${dbName}' created successfully.`);
        } else {
            console.log(`Database '${dbName}' already exists.`);
        }
    } catch (error) {
        console.error('Error checking/creating database:', error);
        process.exit(1);
    } finally {
        await sql.end();
    }

    console.log('Running schema migrations...');
    try {
        const { stdout, stderr } = await execAsync('bunx drizzle-kit push');
        console.log(stdout);
        if (stderr) console.error(stderr);
        console.log('Schema migrations applied successfully.');
    } catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
    }
}

initDb();
