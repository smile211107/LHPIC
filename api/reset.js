import { ensureDbReady, getPool, seedDefaultData } from './_lib/db.js';
import { requireAdmin } from './_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!requireAdmin(req, res)) return;

    await ensureDbReady();
    const db = getPool();
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      await seedDefaultData(client, { clearFirst: true });
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    return res.status(200).json({ reset: true });
  } catch (err) {
    console.error('[api/reset]', err);
    return res.status(500).json({ error: err.message || 'Lỗi khi khôi phục dữ liệu mẫu.' });
  }
}
