const { app } = require('@azure/functions');

app.http('ping', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'ping',
  handler: async () => {
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      },
      jsonBody: {
        ok: true,
        source: 'swa-managed-api',
        ts: new Date().toISOString()
      }
    };
  }
});
