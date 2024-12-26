export const useAuth = async () => {
    const url = await $fetch('/api/auth/login')

    window.location.href = url.toString()

}