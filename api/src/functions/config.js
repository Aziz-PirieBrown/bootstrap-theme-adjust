const { app } = require('@azure/functions');

app.http('config', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'config',
  handler: async (request, context) => {
    const owner = 'Aziz-PirieBrown';
    const repo = 'bootstrap-theme-adjust';
    const publicDomain = 'https://yellow-sea-0466b3200.6.azurestaticapps.net/go.html';

    let config = {};
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/config.json`, {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (response.ok) {
        const payload = await response.json();
        const content = Buffer.from(payload.content || '', 'base64').toString('utf8');
        config = content ? JSON.parse(content) : {};
      }
    } catch (error) {
      context.log('config proxy load failed:', error.message);
    }

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      },
      jsonBody: {
        owner,
        repo,
        publicDomain,
        config
      }
    };
  }
});
