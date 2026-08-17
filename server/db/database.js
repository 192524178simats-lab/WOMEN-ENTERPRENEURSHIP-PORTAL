import initSqlJs from 'sql.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'portal.db');

if (!fs.existsSync(__dirname)) {
  fs.mkdirSync(__dirname, { recursive: true });
}

let dbInstance = null;

const getDb = async () => {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();
  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath);
    dbInstance = new SQL.Database(filebuffer);
  } else {
    dbInstance = new SQL.Database();
  }

  dbInstance.run('PRAGMA foreign_keys = ON;');
  return dbInstance;
};

export const saveDb = () => {
  if (!dbInstance) return;
  const data = dbInstance.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
};

export const query = async (sql, params = []) => {
  const db = await getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const result = [];
  while (stmt.step()) {
    result.push(stmt.getAsObject());
  }
  stmt.free();
  return result;
};

export const get = async (sql, params = []) => {
  const rows = await query(sql, params);
  return rows[0] || null;
};

export const run = async (sql, params = []) => {
  const db = await getDb();
  db.run(sql, params);

  const res = db.exec("SELECT last_insert_rowid() as id, changes() as changes");
  let lastID = 0;
  let changes = 0;
  if (res && res[0] && res[0].values && res[0].values[0]) {
    lastID = res[0].values[0][0];
    changes = res[0].values[0][1];
  }
  saveDb();
  return { id: lastID, changes };
};

export const exec = async (sql) => {
  const db = await getDb();
  db.exec(sql);
  saveDb();
};

export default getDb;
