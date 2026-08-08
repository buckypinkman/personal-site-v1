import type { APIRoute } from 'astro';

export const prerender = false;

function resolveEnv(context: any, key: string): string | undefined {
  const locals = context.locals as any;
  return (
    locals?.runtime?.env?.[key] ||
    locals?.env?.[key] ||
    locals?.cloudflare?.env?.[key] ||
    context?.env?.[key] ||
    (typeof process !== 'undefined' ? process.env?.[key] : undefined) ||
    import.meta.env?.[key]
  );
}

export const GET: APIRoute = async (context) => {
  const { request } = context;
  const clientId = resolveEnv(context, 'GITHUB_CLIENT_ID');
  const clientSecret = resolveEnv(context, 'GITHUB_CLIENT_SECRET');

  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code parameter', { status: 400 });
  }

  if (!clientId || !clientSecret) {
    return new Response(
      JSON.stringify(
        {
          error: 'MISSING_OAUTH_CREDENTIALS',
          message:
            'GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is missing from Cloudflare environment variables.',
        },
        null,
        2
      ),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId.trim(),
      client_secret: clientSecret.trim(),
      code: code,
    }),
  });

  const data: any = await tokenResponse.json();

  if (data.error) {
    return new Response(`OAuth Error: ${data.error_description || data.error}`, {
      status: 500,
    });
  }

  const token = data.access_token;
  const provider = 'github';

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating with GitHub...</title>
</head>
<body>
  <script>
    (function() {
      function receiveMessage(e) {
        window.opener.postMessage(
          'authorization:${provider}:success:${JSON.stringify({ token: token, provider: provider })}',
          e.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:${provider}", "*");
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
};
