export async function onRequest(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');
  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    return new Response('Missing code parameter', { status: 400 });
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  });

  const data = await tokenResponse.json();

  if (data.error) {
    return new Response(`OAuth Error: ${data.error_description || data.error}`, { status: 500 });
  }

  const token = data.access_token;
  const provider = 'github';

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating...</title>
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
}
