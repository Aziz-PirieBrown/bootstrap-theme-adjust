const { app } = require('@azure/functions');

const OWNER = 'Aziz-PirieBrown';
const REPO = 'bootstrap-theme-adjust';

const reply = (status, jsonBody) => ({
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  jsonBody
});

const authorized = (request) => {
  const expected = process.env.nneew || '';
  const supplied = request.headers.get('x-admin-key') || '';
  return !!expected && supplied === expected;
};

app.http('githubProxy', {
  methods: ['GET', 'PUT', 'DELETE'],
  authLevel: 'anonymous',
  route: 'github/{*path}',
  handler: async (request, context) => {
    if (!authorized(request)) return reply(401, { error: 'Invalid admin key' });
    const token = process.env.GITHUB_TOKEN || '';
    if (!token) return reply(503, { error: 'GITHUB_TOKEN is not configured' });

    const path = request.params.path || '';
    if (!path || path.includes('..')) return reply(400, { error: 'Invalid path' });
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'nexus-static-web-app'
    };

    try {
      let body;
      if (request.method !== 'GET') {
        body = await request.text();
        headers['Content-Type'] = 'application/json';
      }
      const gh = await fetch(url, { method: request.method, headers, body: body || undefined });
      const text = await gh.text();
      if (gh.status === 401) return reply(502, { error: 'Backend GitHub token invalid' });
      if (gh.status === 403) return reply(403, { error: 'GitHub token has no write permission', github: payload });
      let payload;
      try { payload = text ? JSON.parse(text) : {}; } catch { payload = { message: text }; }
      return reply(gh.status, payload);
    } catch (error) {
      context.log('GitHub proxy failed:', error.message);
      return reply(502, { error: 'GitHub proxy failed' });
    }
  }
});
