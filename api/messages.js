import { ensureDbReady, getPool, mapMessageRow, parseJsonBody } from './_lib/db.js';
import { requireAdmin } from './_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    await ensureDbReady();
    const db = getPool();

    // Chỉ Admin mới được xem danh sách tin nhắn (bảo vệ SĐT phụ huynh & học sinh)
    if (req.method === 'GET') {
      if (!requireAdmin(req, res)) return;

      const result = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
      return res.status(200).json({ messages: result.rows.map(mapMessageRow) });
    }

    // Công khai: học sinh & phụ huynh gửi tin nhắn từ trang Liên Hệ
    if (req.method === 'POST') {
      const body = await parseJsonBody(req);
      const name = String(body.name || '').trim().slice(0, 120);
      const phone = String(body.phone || '').trim().slice(0, 30);
      const school = String(body.school || 'Chưa ghi rõ trường').trim().slice(0, 150);
      const grade = String(body.grade || 'Học sinh').trim().slice(0, 60);
      const message = String(body.message || '').trim().slice(0, 2000);

      if (!name || !phone || !message) {
        return res.status(400).json({ error: 'Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Nội dung tin nhắn.' });
      }

      const id = 'msg-' + Date.now();
      const result = await db.query(
        `INSERT INTO messages (id, name, phone, school, grade, message, status)
         VALUES ($1,$2,$3,$4,$5,$6,'new')
         RETURNING *`,
        [id, name, phone, school, grade, message]
      );

      return res.status(201).json({ message: mapMessageRow(result.rows[0]) });
    }

    // Chỉ Admin: đánh dấu đã đọc
    if (req.method === 'PATCH') {
      if (!requireAdmin(req, res)) return;

      const body = await parseJsonBody(req);
      const id = String(req.query?.id || body.id || '').trim();
      const status = body.status === 'new' ? 'new' : 'read';

      if (!id) {
        return res.status(400).json({ error: 'Thiếu mã tin nhắn (id).' });
      }

      const result = await db.query(
        `UPDATE messages SET status = $2 WHERE id = $1 RETURNING *`,
        [id, status]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Không tìm thấy tin nhắn.' });
      }

      return res.status(200).json({ message: mapMessageRow(result.rows[0]) });
    }

    // Chỉ Admin: xóa tin nhắn
    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;

      const id = String(req.query?.id || '').trim();
      if (!id) {
        return res.status(400).json({ error: 'Thiếu mã tin nhắn (id).' });
      }

      await db.query('DELETE FROM messages WHERE id = $1', [id]);
      return res.status(200).json({ deleted: true, id });
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/messages]', err);
    return res.status(500).json({ error: err.message || 'Lỗi máy chủ khi xử lý tin nhắn.' });
  }
}
