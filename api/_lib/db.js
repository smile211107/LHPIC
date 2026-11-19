import pg from 'pg';
import { DEFAULT_EVENTS, DEFAULT_ALBUMS, DEFAULT_MESSAGES } from './defaults.js';

const { Pool } = pg;

let pool;
let initializedPromise = null;

function getConnectionString() {
  const direct =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING;
  if (direct) return direct;

  // Hỗ trợ trường hợp Vercel Neon/Supabase tạo biến có prefix (vd: LHPIC_DATABASE_URL)
  for (const [key, val] of Object.entries(process.env)) {
    if (val && /(_DATABASE_URL|_POSTGRES_URL)$/i.test(key)) {
      return val;
    }
  }
  return '';
}

export function getPool() {
  if (!pool) {
    const connectionString = getConnectionString();
    if (!connectionString) {
      throw new Error(
        'Thiếu biến môi trường DATABASE_URL hoặc POSTGRES_URL. Hãy kết nối PostgreSQL (Neon/Supabase) trong Vercel Settings.'
      );
    }

    const isLocal =
      connectionString.includes('localhost') ||
      connectionString.includes('127.0.0.1') ||
      connectionString.includes('sslmode=disable');

    pool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

export function extractDriveFolderId(url) {
  if (!url) return '';
  const match = String(url).match(/[-\w]{25,}/);
  return match ? match[0] : String(url).trim();
}

async function createTables(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Sinh hoạt chuyên đề',
      status TEXT NOT NULL DEFAULT 'upcoming',
      date TEXT NOT NULL,
      time TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      instructor TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      cover_image TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      doc_link TEXT NOT NULL DEFAULT '',
      contest_link TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS albums (
      id TEXT PRIMARY KEY,
      session_name TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL DEFAULT '',
      cover_image TEXT NOT NULL DEFAULT '',
      drive_link TEXT NOT NULL,
      drive_folder_id TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      school TEXT NOT NULL DEFAULT '',
      grade TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function seedDefaultData(client, { clearFirst = false } = {}) {
  if (clearFirst) {
    await client.query('DELETE FROM events');
    await client.query('DELETE FROM albums');
    await client.query('DELETE FROM messages');
  }

  for (const evt of DEFAULT_EVENTS) {
    await client.query(
      `INSERT INTO events (
        id, title, category, status, date, time, location, instructor,
        summary, cover_image, content, doc_link, contest_link, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (id) DO NOTHING`,
      [
        evt.id,
        evt.title,
        evt.category,
        evt.status,
        evt.date,
        evt.time,
        evt.location,
        evt.instructor,
        evt.summary,
        evt.coverImage,
        evt.content,
        evt.docLink,
        evt.contestLink,
        evt.createdAt,
      ]
    );
  }

  for (const alb of DEFAULT_ALBUMS) {
    await client.query(
      `INSERT INTO albums (
        id, session_name, title, date, cover_image, drive_link, drive_folder_id, description, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (id) DO NOTHING`,
      [
        alb.id,
        alb.sessionName,
        alb.title,
        alb.date,
        alb.coverImage,
        alb.driveLink,
        alb.driveFolderId || extractDriveFolderId(alb.driveLink),
        alb.description,
        alb.createdAt,
      ]
    );
  }

  for (const msg of DEFAULT_MESSAGES) {
    await client.query(
      `INSERT INTO messages (
        id, name, phone, school, grade, message, status, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (id) DO NOTHING`,
      [
        msg.id,
        msg.name,
        msg.phone,
        msg.school,
        msg.grade,
        msg.message,
        msg.status,
        msg.createdAt,
      ]
    );
  }

  await client.query(
    `INSERT INTO app_meta (key, value) VALUES ('seeded', 'true')
     ON CONFLICT (key) DO UPDATE SET value = 'true'`
  );
}

export async function ensureDbReady() {
  if (!initializedPromise) {
    initializedPromise = (async () => {
      const db = getPool();
      const client = await db.connect();
      try {
        await createTables(client);
        const meta = await client.query(`SELECT value FROM app_meta WHERE key = 'seeded'`);
        if (meta.rowCount === 0) {
          await seedDefaultData(client, { clearFirst: false });
        }
      } finally {
        client.release();
      }
    })().catch((err) => {
      initializedPromise = null;
      throw err;
    });
  }
  return initializedPromise;
}

export function mapEventRow(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    status: row.status,
    date: row.date,
    time: row.time,
    location: row.location,
    instructor: row.instructor,
    summary: row.summary,
    coverImage: row.cover_image,
    content: row.content,
    docLink: row.doc_link,
    contestLink: row.contest_link,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
  };
}

export function mapAlbumRow(row) {
  return {
    id: row.id,
    sessionName: row.session_name,
    title: row.title,
    date: row.date,
    coverImage: row.cover_image,
    driveLink: row.drive_link,
    driveFolderId: row.drive_folder_id || extractDriveFolderId(row.drive_link),
    description: row.description,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : '',
  };
}

export function mapMessageRow(row) {
  let formattedDate = '';
  if (row.created_at) {
    const d = new Date(row.created_at);
    // Format YYYY-MM-DD HH:mm (UTC+7 for Vietnam)
    const vnTime = new Date(d.getTime() + 7 * 60 * 60 * 1000);
    formattedDate = vnTime.toISOString().replace('T', ' ').substring(0, 16);
  }
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    school: row.school,
    grade: row.grade,
    message: row.message,
    status: row.status,
    createdAt: formattedDate,
  };
}

export async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    return JSON.parse(req.body);
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? JSON.parse(raw) : {};
}
