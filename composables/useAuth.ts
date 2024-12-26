import {
  initOAuthConfig,
  handleCallback,
  generateAuthUrl,
  fetchUserInfo,
} from "../utils/auth";

const user = ref(null);
const isAuthenticated = computed(() => !!user.value);

export function useAuth() {
  const login = async () => {
    await initOAuthConfig();
    const { authUrl, codeVerifier, state } = await generateAuthUrl();

    localStorage.setItem("codeVerifier", codeVerifier);
    localStorage.setItem("state", state);
    window.location.href = authUrl;
  };

  const logout = () => {
    user.value = null;
    useCookie("auth_token").value = null;
    navigateTo("/");
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

    $fetch("/api/auth/login", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tokens.access_token}`,
        },
    })

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
