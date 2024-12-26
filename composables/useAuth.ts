import { initOAuthConfig, handleCallback, generateAuthUrl, fetchUserInfo } from "../server/utils/auth";

const user = ref(null);
const isAuthenticated = computed(() => !!user.value);

export function useAuth() {
    const login = async () => {
        await initOAuthConfig();
        const { authUrl, codeVerifier, state } = await generateAuthUrl();

        localStorage.setItem("codeVerifier", codeVerifier);
        localStorage.setItem("state", state);
        window.location.href = authUrl
    };

    const logout = () => {
        user.value = null
        useCookie('auth_token').value = null
        navigateTo('/')
    };

    const handleOAuthCallback = async (callbackUrl: string) => {
      await initOAuthConfig();
      const currentUrl = new URL(callbackUrl);
      const codeVerifier = localStorage.getItem("codeVerifier");
      const state = localStorage.getItem("state");

      if (!codeVerifier || !state) {
        throw new Error("Missing PKCE parameters");
      }

      const tokens = await handleCallback(currentUrl, codeVerifier, state);
      const userInfo = await fetchUserInfo(tokens.access_token);

      console.log(userInfo);

      user.value = userInfo;
      useCookie("auth_token").value = tokens.access_token;

      // Nettoyez le localStorage
      localStorage.removeItem("codeVerifier");
      localStorage.removeItem("state");
    };

    return {
      user,
      isAuthenticated,
      login,
      logout,
      handleOAuthCallback,
    };
}
