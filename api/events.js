import { ensureDbReady, getPool, mapEventRow, parseJsonBody } from './_lib/db.js';
import { requireAdmin } from './_lib/auth.js';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop';
const ALLOWED_STATUSES = new Set(['upcoming', 'ongoing', 'completed']);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    await ensureDbReady();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT * FROM events ORDER BY created_at DESC');
      return res.status(200).json({ events: result.rows.map(mapEventRow) });
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) return;

      const body = await parseJsonBody(req);
      const title = String(body.title || '').trim();
      const date = String(body.date || '').trim();
      const summary = String(body.summary || '').trim();

      if (!title || !date || !summary) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (tiêu đề, ngày, mô tả tóm tắt).' });
      }

      const id = 'evt-' + Date.now();
      const status = ALLOWED_STATUSES.has(body.status) ? body.status : 'upcoming';
      const category = String(body.category || 'Sinh hoạt chuyên đề').trim();
      const time = String(body.time || '').trim();
      const location = String(body.location || '').trim();
      const instructor = String(body.instructor || '').trim();
      const coverImage = String(body.coverImage || '').trim() || DEFAULT_COVER;
      const content = String(body.content || '').trim();
      const docLink = String(body.docLink || '').trim();
      const contestLink = String(body.contestLink || '').trim();

      const result = await db.query(
        `INSERT INTO events (
          id, title, category, status, date, time, location, instructor,
          summary, cover_image, content, doc_link, contest_link
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING *`,
        [
          id,
          title,
          category,
          status,
          date,
          time,
          location,
          instructor,
          summary,
          coverImage,
          content,
          docLink,
          contestLink,
        ]
      );

      return res.status(201).json({ event: mapEventRow(result.rows[0]) });
    }

    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;

      const body = await parseJsonBody(req);
      const id = String(req.query?.id || body.id || '').trim();
      if (!id) {
        return res.status(400).json({ error: 'Thiếu mã buổi sinh hoạt (id).' });
      }

      const title = String(body.title || '').trim();
      const date = String(body.date || '').trim();
      const summary = String(body.summary || '').trim();

      if (!title || !date || !summary) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (tiêu đề, ngày, mô tả tóm tắt).' });
      }

      const status = ALLOWED_STATUSES.has(body.status) ? body.status : 'upcoming';
      const category = String(body.category || 'Sinh hoạt chuyên đề').trim();
      const time = String(body.time || '').trim();
      const location = String(body.location || '').trim();
      const instructor = String(body.instructor || '').trim();
      const coverImage = String(body.coverImage || '').trim() || DEFAULT_COVER;
      const content = String(body.content || '').trim();
      const docLink = String(body.docLink || '').trim();
      const contestLink = String(body.contestLink || '').trim();

      const result = await db.query(
        `UPDATE events
         SET title = $2,
             category = $3,
             status = $4,
             date = $5,
             time = $6,
             location = $7,
             instructor = $8,
             summary = $9,
             cover_image = $10,
             content = $11,
             doc_link = $12,
             contest_link = $13
         WHERE id = $1
         RETURNING *`,
        [
          id,
          title,
          category,
          status,
          date,
          time,
          location,
          instructor,
          summary,
          coverImage,
          content,
          docLink,
          contestLink,
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Không tìm thấy buổi sinh hoạt để cập nhật.' });
      }

      return res.status(200).json({ event: mapEventRow(result.rows[0]) });
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;

      const id = String(req.query?.id || '').trim();
      if (!id) {
        return res.status(400).json({ error: 'Thiếu mã buổi sinh hoạt (id).' });
      }

      await db.query('DELETE FROM events WHERE id = $1', [id]);
      return res.status(200).json({ deleted: true, id });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/events]', err);
    return res.status(500).json({ error: err.message || 'Lỗi máy chủ khi xử lý buổi sinh hoạt.' });
  }
}
