import { oidc_clientId, oidc_clientSecret, oidc_issuer, oidc_redirect_uri } from "~/server/const";
import * as client from 'openid-client'

export default defineEventHandler(async (event) => {
    let config = await client.discovery(oidc_issuer, oidc_clientId, oidc_clientSecret)
    let code_challenge_method = "S256";

    let code_verifier = client.randomPKCECodeVerifier();
    let code_challenge = await client.calculatePKCECodeChallenge(code_verifier);
    let state!: string;

    let parameters: Record<string, string> = {
      redirect_uri: oidc_redirect_uri,
      scope: "api:read",
      code_challenge,
      code_challenge_method,
    };

    if (!config.serverMetadata().supportsPKCE()) {
      state = client.randomState();
      parameters.state = state;
    }

    let redirectTo = client.buildAuthorizationUrl(config, parameters);

    console.log(redirectTo.href)

    return redirectTo.href
});
