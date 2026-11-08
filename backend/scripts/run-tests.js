require('dotenv').config({ quiet: true });

const { spawnSync } = require('node:child_process');
const mysql = require('mysql2/promise');
const path = require('node:path');

const TEST_DATABASE_NAME = 'focusmind_test';

async function ensureTestDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${TEST_DATABASE_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await connection.end();
  }
}

async function main() {
  await ensureTestDatabase();
  const result = spawnSync(
    process.execPath,
    ['--test', '--test-concurrency=1'],
    {
      cwd: path.resolve(__dirname, '..'),
      env: {
        ...process.env,
        NODE_ENV: 'test',
        DB_NAME: TEST_DATABASE_NAME,
      },
      stdio: 'inherit',
    },
  );

  if (result.error) throw result.error;
  process.exitCode = result.status === null ? 1 : result.status;
}

main().catch((error) => {
  console.error(`Backend tests failed: ${error.message}`);
  process.exitCode = 1;
});
