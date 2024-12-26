import * as client from "openid-client";

let config: Awaited<ReturnType<typeof client.discovery>>;


export async function initOAuthConfig() {
  const secrets = useRuntimeConfig();
  if (!config) {
    config = await client.discovery(
      new URL(secrets.public.OIDC_ISSUER),
      secrets.public.OIDC_CLIENT_ID,
      secrets.public.OIDC_CLIENT_SECRET
    );
  }
  return config;
}

export async function generateAuthUrl() {
  const secrets = useRuntimeConfig();
  const codeVerifier = client.randomPKCECodeVerifier();
  const state = client.randomState();

  const parameters: Record<string, string> = {
    redirect_uri: secrets.public.OIDC_REDIRECT_URI,
    scope: 'openid email',
    code_challenge: await client.calculatePKCECodeChallenge(codeVerifier),
    code_challenge_method: "S256",
    state,
  };

  const authUrl = client.buildAuthorizationUrl(config, parameters);

  return { authUrl: authUrl.href, codeVerifier, state };
}

export async function handleCallback(
  currentUrl: URL,
  codeVerifier: string,
  expectedState: string
) {
  const tokens = await client.authorizationCodeGrant(config, currentUrl, {
    pkceCodeVerifier: codeVerifier,
    expectedState,
  });

  return tokens;
}

export async function fetchUserInfo(accessToken: string) {
  const userInfoUrl = new URL(config.serverMetadata().userinfo_endpoint);
  const userInfo = await client.fetchProtectedResource(
    config,
    accessToken,
    userInfoUrl,
    "GET"
  );

  return userInfo.json();
}
