import {
  ensureDbReady,
  getPool,
  mapAlbumRow,
  extractDriveFolderId,
  parseJsonBody,
} from './_lib/db.js';
import { requireAdmin } from './_lib/auth.js';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    await ensureDbReady();
    const db = getPool();

    if (req.method === 'GET') {
      const result = await db.query('SELECT * FROM albums ORDER BY created_at DESC');
      return res.status(200).json({ albums: result.rows.map(mapAlbumRow) });
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) return;

      const body = await parseJsonBody(req);
      const sessionName = String(body.sessionName || '').trim();
      const title = String(body.title || '').trim();
      const driveLink = String(body.driveLink || '').trim();

      if (!sessionName || !title || !driveLink) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (số buổi, tiêu đề, link Google Drive).' });
      }

      const id = 'alb-' + Date.now();
      const date = String(body.date || '').trim() || new Date().toLocaleDateString('vi-VN');
      const coverImage = String(body.coverImage || '').trim() || DEFAULT_COVER;
      const description = String(body.description || '').trim();
      const driveFolderId = extractDriveFolderId(driveLink);

      const result = await db.query(
        `INSERT INTO albums (
          id, session_name, title, date, cover_image, drive_link, drive_folder_id, description
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *`,
        [id, sessionName, title, date, coverImage, driveLink, driveFolderId, description]
      );

      return res.status(201).json({ album: mapAlbumRow(result.rows[0]) });
    }

    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;

      const body = await parseJsonBody(req);
      const id = String(req.query?.id || body.id || '').trim();
      if (!id) {
        return res.status(400).json({ error: 'Thiếu mã thư mục (id).' });
      }

      const sessionName = String(body.sessionName || '').trim();
      const title = String(body.title || '').trim();
      const driveLink = String(body.driveLink || '').trim();

      if (!sessionName || !title || !driveLink) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (số buổi, tiêu đề, link Google Drive).' });
      }

      const date = String(body.date || '').trim();
      const coverImage = String(body.coverImage || '').trim() || DEFAULT_COVER;
      const description = String(body.description || '').trim();
      const driveFolderId = extractDriveFolderId(driveLink);

      const result = await db.query(
        `UPDATE albums
         SET session_name = $2,
             title = $3,
             date = $4,
             cover_image = $5,
             drive_link = $6,
             drive_folder_id = $7,
             description = $8
         WHERE id = $1
         RETURNING *`,
        [id, sessionName, title, date, coverImage, driveLink, driveFolderId, description]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Không tìm thấy thư mục ảnh để cập nhật.' });
      }

      return res.status(200).json({ album: mapAlbumRow(result.rows[0]) });
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;

      const id = String(req.query?.id || '').trim();
      if (!id) {
        return res.status(400).json({ error: 'Thiếu mã thư mục (id).' });
      }

      await db.query('DELETE FROM albums WHERE id = $1', [id]);
      return res.status(200).json({ deleted: true, id });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/albums]', err);
    return res.status(500).json({ error: err.message || 'Lỗi máy chủ khi xử lý kho ảnh.' });
  }
}
