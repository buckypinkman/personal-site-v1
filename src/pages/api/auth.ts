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
  const { request, locals } = context;
  const clientId = resolveEnv(context, 'GITHUB_CLIENT_ID');

  if (!clientId) {
    const runtime = (locals as any)?.runtime;
    const availableKeys = Object.keys(runtime?.env || {});
    return new Response(
      JSON.stringify(
        {
          error: 'GITHUB_CLIENT_ID_MISSING',
          message:
            'The GITHUB_CLIENT_ID environment variable was not found on this deployment. Please make sure you added GITHUB_CLIENT_ID in Cloudflare Pages Dashboard under Settings > Environment variables, and triggered a redeployment.',
          debug: {
            hasRuntime: !!runtime,
            availableEnvKeys: availableKeys,
          },
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

  const url = new URL(request.url);
  const redirectUri = new URL('/api/callback', url.origin).toString();

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', clientId.trim());
  githubAuthUrl.searchParams.set('scope', 'repo,user');
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);

  return Response.redirect(githubAuthUrl.toString(), 302);
};
