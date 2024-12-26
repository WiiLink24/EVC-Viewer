<script setup lang="ts">
// get query params
import { useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth'

const { handleOAuthCallback } = useAuth()



const router = useRouter();
const route = useRoute()
const code = route.query.code;
const state = route.query.state;

onMounted(async () => {
    const callbackUrl = window.location.href
    await handleOAuthCallback(callbackUrl)
    router.push('/')
})



</script>
