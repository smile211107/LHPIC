import {
  verifyCredentials,
  setSessionCookie,
  clearSessionCookie,
  getSessionUser,
} from './_lib/auth.js';
import { parseJsonBody } from './_lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const session = getSessionUser(req);
      if (!session) {
        return res.status(200).json({ authenticated: false, user: null });
      }
      return res.status(200).json({ authenticated: true, user: session.user });
    }

    if (req.method === 'POST') {
      const body = await parseJsonBody(req);
      const username = String(body.username || '').trim();
      const password = String(body.password || '').trim();

      if (!username || !password) {
        return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' });
      }

      if (!verifyCredentials(username, password)) {
        return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
      }

      setSessionCookie(res, username);
      return res.status(200).json({ authenticated: true, user: username });
    }

    if (req.method === 'DELETE') {
      clearSessionCookie(res);
      return res.status(200).json({ authenticated: false });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/auth]', err);
    return res.status(500).json({ error: err.message || 'Lỗi xác thực hệ thống.' });
  }
}
