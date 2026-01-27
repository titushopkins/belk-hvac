<template>
    <div :class="{'dark':false}">
        <div class="relative from-white to-slate-50 bg-gradient-to-b dark:from-black dark:to-gray-700 dark:selection:bg-gray-300 dark:text-gray-300 w-full min-h-screen">

            <RoofingNavigation />

            <RouterView v-slot="{ Component, route }" @navHidden="navHidden = $event">
                <Suspense :timeout="200" >
                    <Component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
                    <template #fallback><spinner /></template>
                </Suspense>
            </RouterView>

            <RoofingFooter />

        </div>
    </div>
</template>

<script>
import login from './components/layout/login.vue'
import RoofingFooter from './components/roofing-footer.vue';
import RoofingNavigation from './components/roofing-navigation.vue';
export default {
  components: { login, RoofingNavigation, RoofingFooter },
    inject: ['store','darkMode'],
    data() {
        return {
            navHidden: false
        }
    }
}
</script>
