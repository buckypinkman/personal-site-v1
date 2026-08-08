import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any)?.runtime;
  const env = runtime?.env || process.env || {};
  const clientId = env.GITHUB_CLIENT_ID;

  const url = new URL(request.url);
  const redirectUri = new URL('/api/callback', url.origin).toString();

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', clientId || '');
  githubAuthUrl.searchParams.set('scope', 'repo,user');
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);

  return Response.redirect(githubAuthUrl.toString(), 302);
};
