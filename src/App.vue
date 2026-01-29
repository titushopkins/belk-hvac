<template>
    <div :class="{'dark':false}">
        <div class="relative from-white to-slate-50 bg-gradient-to-b dark:from-black dark:to-gray-700 dark:selection:bg-gray-300 dark:text-gray-300 w-full min-h-screen">


              <div v-if="!plumbingAvailable" class="relative isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-belk-dark-blue via-50% via-belk-dark-gray to-belk-dark-blue px-6 py-2.5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 sm:px-3.5 sm:before:flex-1">
                <div aria-hidden="true" class="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl">
                  <div style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)" class="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-40"></div>
                </div>
                <div aria-hidden="true" class="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl">
                  <div style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)" class="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-40"></div>
                </div>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p class="text-sm/6 text-gray-100">
                    <strong class="font-semibold font-lobster text-gray-300">Belk HVAC & PLumbing LLC</strong><svg viewBox="0 0 2 2" aria-hidden="true" class="mx-2 inline size-0.5 fill-current"><circle r="1" cx="1" cy="1" /></svg>
                    <span class="font-bold bg-gradient-to-r from-belk-teal via-cyan-400 to-belk-teal bg-clip-text text-transparent">
                      Plumbing Services
                    </span>
                    Coming to Belk Heating & Cooling
                    <span class="font-bold bg-gradient-to-r from-belk-teal via-cyan-400 to-belk-teal bg-clip-text text-transparent">
                      February 2026
                    </span>
                  </p>
                  <!-- <a href="#" class="flex-none rounded-full bg-white/10 px-3.5 py-1 text-sm font-semibold text-white shadow-xs inset-ring-white/20 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Register now <span aria-hidden="true">&rarr;</span></a> -->
                </div>
                <div class="flex flex-1 justify-end">
                  <button @click="plumbingAvailable = true" type="button" class="-m-3 p-3 focus-visible:-outline-offset-4">
                    <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5 text-gray-100">
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                </div>
              </div>

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
            navHidden: false,
            plumbingAvailable: false,
        }
    }
}
</script>
