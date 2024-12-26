export const language_columns: { [key: string]: string[] } = {
  english: ["contentEnglish", "choice1English", "choice2English"],
  french: ["contentFrench", "choice1French", "choice2French"],
  german: ["contentGerman", "choice1German", "choice2German"],
  dutch: ["contentDutch", "choice1Dutch", "choice2Dutch"],
  italian: ["contentItalian", "choice1Italian", "choice2Italian"],
  spanish: ["contentSpanish", "choice1Spanish", "choice2Spanish"],
  portuguese: ["contentPortuguese", "choice1Portuguese", "choice2Portuguese"],
  french_canada: ["contentFrenchCanada", "choice1FrenchCanada", "choice2FrenchCanada",],
};


export let oidc_issuer: URL
export let oidc_clientId: string
export let oidc_clientSecret: string
export let oidc_redirect_uri: string

// Initialize the values when the environment is ready
if (process.env.OIDC_ISSUER) {
    oidc_issuer = new URL(process.env.OIDC_ISSUER!)
    oidc_clientId = process.env.OIDC_CLIENT_ID!
    oidc_clientSecret = process.env.OIDC_CLIENT_SECRET!
    oidc_redirect_uri = process.env.OIDC_REDIRECT_URI!
}