<template>
  <div :class="{ dark: false }">
    <div
      class="relative from-white to-slate-50 bg-gradient-to-b dark:from-black dark:to-gray-700 dark:selection:bg-gray-300 dark:text-gray-300 w-full min-h-screen"
    >
      <!-- BANNER 1: PLUMBING (kept in file, but hidden for now) -->
      <div
        v-if="bannerStage === 'plumbing'"
        class="hidden relative z-[9999] isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-belk-dark-blue via-50% via-belk-dark-gray to-belk-dark-blue px-6 py-2.5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 sm:px-3.5 sm:before:flex-1"
      >
        <div aria-hidden="true" class="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl">
          <div
            style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
            class="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-40"
          ></div>
        </div>
        <div aria-hidden="true" class="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl">
          <div
            style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
            class="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-40"
          ></div>
        </div>

        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p class="text-sm/6 text-gray-100">
            <strong class="font-semibold font-lobster text-gray-300">Belk HVAC & PLumbing LLC</strong>
            <svg viewBox="0 0 2 2" aria-hidden="true" class="mx-2 inline size-0.5 fill-current"><circle r="1" cx="1" cy="1" /></svg>
            <span class="font-bold bg-gradient-to-r from-belk-teal via-cyan-400 to-belk-teal bg-clip-text text-transparent">
              Plumbing Services
            </span>
            Coming to Belk Heating & Cooling
            <span class="font-bold bg-gradient-to-r from-belk-teal via-cyan-400 to-belk-teal bg-clip-text text-transparent">
              March 2026
            </span>
          </p>
        </div>

        <div class="flex flex-1 items-center justify-end relative z-[10000] pointer-events-none">
          <button
            type="button"
            class="p-3 pointer-events-auto"
            @click.stop="closePlumbingBanner"
            @touchend.stop.prevent="closePlumbingBanner"
            aria-label="Close plumbing banner"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5 text-gray-100">
              <path
                d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 0 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- BANNER 2: WARRANTY (shows first for now; locked for 5s) -->
      <div
        v-if="bannerStage === 'warranty'"
        class="relative z-[9999] isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-belk-dark-blue via-50% via-belk-dark-gray to-belk-dark-blue px-6 py-2.5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 sm:px-3.5 sm:before:flex-1"
      >
        <div aria-hidden="true" class="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl">
          <div
            style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
            class="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-40"
          ></div>
        </div>
        <div aria-hidden="true" class="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl">
          <div
            style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
            class="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-40"
          ></div>
        </div>

        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p class="text-sm/6 text-gray-100">
            <strong class="font-semibold font-lobster text-gray-300">Belk Heating & Cooling</strong>
            <svg viewBox="0 0 2 2" aria-hidden="true" class="mx-2 inline size-0.5 fill-current"><circle r="1" cx="1" cy="1" /></svg>
            <span class="font-bold bg-gradient-to-r from-belk-teal via-cyan-400 to-belk-teal bg-clip-text text-transparent">
              Need Warranty?
            </span>
            Now Offering 10 YR - Parts, Labor, and Refrigeration Warranty!
          </p>

         <RouterLink
           to="/warranty"
           @click="forceCloseWarranty"
           class="font-bold bg-gradient-to-r from-belk-teal via-cyan-400 to-belk-teal text-white rounded-xl px-3 py-2"
         >
           View Now
         </RouterLink>
        </div>

        <div class="flex flex-1 items-center justify-end relative z-[10000] pointer-events-none">
          <button
            @click.stop="closeWarrantyBanner"
            @touchend.stop.prevent="closeWarrantyBanner"
            :disabled="!canCloseWarranty"
            type="button"
            class="p-3 pointer-events-auto focus-visible:-outline-offset-4"
            :class="!canCloseWarranty ? 'cursor-not-allowed' : ''"
            aria-label="Close warranty banner"
          >
            <span v-if="!canCloseWarranty" class="inline-flex size-5 items-center justify-center text-sm font-extrabold text-gray-100">
              {{ warrantyCloseCountdown }}
            </span>

            <svg
              v-else
              viewBox="0 0 20 20"
              fill="currentColor"
              data-slot="icon"
              aria-hidden="true"
              class="size-5 text-gray-100"
            >
              <path
                d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 0 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <RoofingNavigation />

      <RouterView v-slot="{ Component, route }" @navHidden="navHidden = $event">
        <Suspense :timeout="200">
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
import RoofingFooter from './components/roofing-footer.vue'
import RoofingNavigation from './components/roofing-navigation.vue'

export default {
  components: { login, RoofingNavigation, RoofingFooter },
  inject: ['store', 'darkMode'],
  data() {
    return {
      navHidden: false,

      // For now: start on warranty so it shows immediately
      bannerStage: 'warranty', // 'plumbing' -> 'warranty' -> null

      // warranty close lock (5s)
      canCloseWarranty: false,
      warrantyCloseCountdown: 5,
      _warrantyInterval: null,
    }
  },
  mounted() {
    // Start the 5 second lock immediately since warranty is the first banner for now
    this.startWarrantyCloseLock()
  },
  beforeUnmount() {
    if (this._warrantyInterval) clearInterval(this._warrantyInterval)
  },
  methods: {
    forceCloseWarranty() {
      // Clear countdown immediately
      if (this._warrantyInterval) {
        clearInterval(this._warrantyInterval)
        this._warrantyInterval = null
      }

      this.bannerStage = null
    },
    // Plumbing close kept (even though plumbing is hidden for now)
    closePlumbingBanner() {
      this.showWarrantyBanner()
    },

    showWarrantyBanner() {
      this.canCloseWarranty = false
      this.bannerStage = 'warranty'
      this.startWarrantyCloseLock()
    },

    startWarrantyCloseLock() {
      this.canCloseWarranty = false
      this.warrantyCloseCountdown = 5

      if (this._warrantyInterval) clearInterval(this._warrantyInterval)

      this._warrantyInterval = setInterval(() => {
        this.warrantyCloseCountdown -= 1

        if (this.warrantyCloseCountdown <= 0) {
          this.canCloseWarranty = true
          clearInterval(this._warrantyInterval)
          this._warrantyInterval = null
        }
      }, 1000)
    },

    closeWarrantyBanner() {
      if (!this.canCloseWarranty) return
      this.bannerStage = null
    },
  },
}
</script>
