export async function onRequest(context) {
  const clientId = context.env.GITHUB_CLIENT_ID;
  const redirectUri = new URL('/api/callback', context.request.url).toString();

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', clientId);
  githubAuthUrl.searchParams.set('scope', 'repo,user');
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);

  return Response.redirect(githubAuthUrl.toString(), 302);
}
