<template>
  <main class="w-full bg-gray-900">
    <!-- HERO -->
    <div class="relative w-full h-screen max-h-[60vh] bg-[url('/images/belk-6.png')] bg-cover bg-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur" />
      <div class="relative z-10 flex flex-col w-full h-full items-center justify-center text-center px-4">
        <h2 class="text-white text-2xl sm:text-[32px] font-semibold font-lobster italic">
          10 Years Of Protection
        </h2>

        <div class="text-white text-5xl sm:text-6xl font-semibold pt-4">
          Warranty Plans
        </div>

        <p class="mt-4 max-w-3xl text-gray-200 text-base sm:text-lg">
          No-Interest Payment Plans • Choose Labor + Refrigeration or Full Coverage (Parts + Labor + Refrigeration)
        </p>
      </div>
    </div>

    <!-- BODY -->
    <section class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      <!-- IMAGE -->
      <div class="space-y-6">
        <div class="flex w-full justify-center p-6">
          <div class="max-w-sm md:max-w-lg w-full">
            <img
              class="w-full rounded-xl shadow-2xl shadow-white/20"
              src="/images/belk-warranty-image.png"
              alt="Belk Heating & Cooling 10 Year Warranty"
            />
          </div>
        </div>

        <div class="text-center space-y-3">
          <h2 class="text-2xl sm:text-4xl font-extrabold text-white">
            10 Year Warranty Coverage Options
          </h2>
          <p class="text-gray-300 max-w-4xl mx-auto">
            Choose the coverage level that fits your home and budget. Every option below includes
            <span class="font-semibold text-white">NO INTEREST</span> payment plans (6, 18, 24, or 36 months).
          </p>
        </div>
      </div>

      <!-- COVERAGE OPTIONS -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Labor + Refrigeration -->
        <div class="rounded-2xl border border-gray-700 bg-black/20 p-6 sm:p-7 shadow-lg">
          <div class="space-y-2">
            <h3 class="text-xl sm:text-2xl font-extrabold text-white">
              Labor + Refrigeration
            </h3>
            <p class="text-gray-300">
              Protect against the biggest out-of-pocket repair costs with coverage focused on
              <span class="font-semibold text-white">Labor</span> and <span class="font-semibold text-white">Refrigeration</span>.
            </p>
          </div>

          <div class="mt-6 flex items-end justify-between gap-4">
            <div>
              <div class="text-sm text-gray-400">Total Price</div>
              <div class="text-4xl font-extrabold text-white">$2,400</div>
              <div class="text-xs text-gray-400 mt-1">Parts not included</div>
            </div>

            <div class="text-right text-sm text-gray-300">
              <div class="font-semibold text-white">Includes:</div>
              <div>10 Year Coverage</div>
              <div>Labor</div>
              <div>Refrigeration</div>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-gray-700 bg-black/30 p-4">
              <div class="text-sm text-gray-300 font-semibold">6 months</div>
              <div class="text-2xl font-extrabold text-white">${{ formatMoney(2400 / 6) }}/mo</div>
            </div>
            <div class="rounded-xl border border-gray-700 bg-black/30 p-4">
              <div class="text-sm text-gray-300 font-semibold">18 months</div>
              <div class="text-2xl font-extrabold text-white">${{ formatMoney(2400 / 18) }}/mo</div>
            </div>
            <div class="rounded-xl border border-gray-700 bg-black/30 p-4">
              <div class="text-sm text-gray-300 font-semibold">24 months</div>
              <div class="text-2xl font-extrabold text-white">${{ formatMoney(2400 / 24) }}/mo</div>
            </div>
            <div class="rounded-xl border border-gray-700 bg-black/30 p-4">
              <div class="text-sm text-gray-300 font-semibold">36 months</div>
              <div class="text-2xl font-extrabold text-white">${{ formatMoney(2400 / 36) }}/mo</div>
            </div>
          </div>

          <button
            type="button"
            class="mt-7 w-full rounded-xl px-4 py-3 font-extrabold text-white shadow-lg bg-gradient-to-r from-belk-teal via-cyan-400 to-belk-teal"
            @click="openPlanModal('Labor + Refrigeration', 2400)"
          >
            Choose Labor + Refrigeration
          </button>
        </div>

        <!-- Parts + Labor + Refrigeration -->
        <div class="rounded-2xl border border-gray-700 bg-black/20 p-6 sm:p-7 shadow-lg ring-2 ring-belk-teal border-belk-teal/60 relative">
          <div class="absolute -top-3 left-6">
            <span class="inline-flex items-center rounded-full bg-belk-teal px-3 py-1 text-xs font-bold text-black">
              FULL COVERAGE
            </span>
          </div>

          <div class="space-y-2">
            <h3 class="text-xl sm:text-2xl font-extrabold text-white">
              Parts + Labor + Refrigeration
            </h3>
            <p class="text-gray-300">
              The most complete protection. Includes
              <span class="font-semibold text-white">Parts</span>,
              <span class="font-semibold text-white">Labor</span>, and
              <span class="font-semibold text-white">Refrigeration</span>.
            </p>
          </div>

          <div class="mt-6 flex items-end justify-between gap-4">
            <div>
              <div class="text-sm text-gray-400">Total Price</div>
              <div class="text-4xl font-extrabold text-white">$2,700</div>
              <div class="text-xs text-gray-400 mt-1">Includes parts</div>
            </div>

            <div class="text-right text-sm text-gray-300">
              <div class="font-semibold text-white">Includes:</div>
              <div>10 Year Coverage</div>
              <div>Parts</div>
              <div>Labor</div>
              <div>Refrigeration</div>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-gray-700 bg-black/30 p-4">
              <div class="text-sm text-gray-300 font-semibold">6 months</div>
              <div class="text-2xl font-extrabold text-white">${{ formatMoney(2700 / 6) }}/mo</div>
            </div>
            <div class="rounded-xl border border-gray-700 bg-black/30 p-4">
              <div class="text-sm text-gray-300 font-semibold">18 months</div>
              <div class="text-2xl font-extrabold text-white">${{ formatMoney(2700 / 18) }}/mo</div>
            </div>
            <div class="rounded-xl border border-gray-700 bg-black/30 p-4">
              <div class="text-sm text-gray-300 font-semibold">24 months</div>
              <div class="text-2xl font-extrabold text-white">${{ formatMoney(2700 / 24) }}/mo</div>
            </div>
            <div class="rounded-xl border border-gray-700 bg-black/30 p-4">
              <div class="text-sm text-gray-300 font-semibold">36 months</div>
              <div class="text-2xl font-extrabold text-white">${{ formatMoney(2700 / 36) }}/mo</div>
            </div>
          </div>

          <button
            type="button"
            class="mt-7 w-full rounded-xl px-4 py-3 font-extrabold text-white shadow-lg bg-gradient-to-r from-belk-teal via-cyan-400 to-belk-teal"
            @click="openPlanModal('Parts + Labor + Refrigeration', 2700)"
          >
            Choose Full Coverage
          </button>
        </div>
      </div>

      <!-- WHO QUALIFIES -->
      <div class="space-y-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-200">
          Who Qualifies?
        </h2>

        <p class="text-gray-300">
          This warranty can apply to:
        </p>

        <ul class="space-y-3 ml-6">
          <li class="flex gap-3">
            <span class="mt-2 h-2 w-2 rounded-full bg-belk-teal shrink-0"></span>
            <p><span class="font-semibold text-white">Pre-Existing Units Up To 8 Years Old</span></p>
          </li>
          <li class="flex gap-3">
            <span class="mt-2 h-2 w-2 rounded-full bg-belk-teal shrink-0"></span>
            <p><span class="font-semibold text-white">New Units / New Installations</span></p>
          </li>
        </ul>

        <p class="text-gray-300">
          If you’re not sure, submit a request above and we’ll confirm eligibility quickly.
        </p>
      </div>

      <!-- CONTACT CTA -->
      <div class="space-y-6 text-center border-t border-gray-700 pt-12">
        <h2 class="text-2xl sm:text-3xl font-bold text-white">
          Want To Confirm Your Plan?
        </h2>

        <p class="text-gray-300">
          Call now or choose a plan above and we’ll reach out with the next steps.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <a
            href="tel:7372513394"
            class="bg-gradient-to-r from-belk-teal via-cyan-400 to-belk-teal text-white font-bold px-8 py-3 rounded-xl shadow-lg"
          >
            (737) 251-3394
          </a>

          <a
            href="mailto:belkheatingandcooling@gmail.com"
            class="border border-belk-teal text-belk-teal font-bold px-8 py-3 rounded-xl hover:bg-belk-teal/10"
          >
            belkheatingandcooling@gmail.com
          </a>
        </div>
      </div>
    </section>

    <!-- MODAL: LEAD FORM -->
    <div
      v-if="isPlanModalOpen"
      class="fixed inset-0 z-[99999] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 bg-black/70" @click="closePlanModal"></div>

      <div class="relative z-10 w-full max-w-lg rounded-2xl bg-gray-950 border border-gray-700 shadow-2xl">
        <div class="p-6 sm:p-7">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <h3 class="text-xl font-extrabold text-white">Request Details</h3>
              <p class="text-gray-300">
                You selected:
                <span class="font-semibold text-white">{{ selectedCoverage }}</span>
                (<span class="font-semibold text-white">${{ formatMoney(selectedTotal) }}</span> total)
              </p>
              <p class="text-gray-400 text-sm">
                Choose a term: 6, 18, 24, or 36 months (no interest).
              </p>
            </div>

            <button
              type="button"
              class="rounded-lg p-2 text-gray-300 hover:text-white"
              @click="closePlanModal"
              aria-label="Close"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" class="size-6">
                <path
                  d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
                />
              </svg>
            </button>
          </div>

          <div class="mt-6 space-y-4">
            <!-- TERM SELECT -->
            <div>
              <label class="block text-sm font-semibold text-gray-200">Select Term</label>
              <select
                v-model.number="selectedMonths"
                class="mt-2 w-full rounded-xl border border-gray-700 bg-black/30 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-belk-teal"
              >
                <option :value="6">6 months — ${{ formatMoney(selectedTotal / 6) }}/mo</option>
                <option :value="18">18 months — ${{ formatMoney(selectedTotal / 18) }}/mo</option>
                <option :value="24">24 months — ${{ formatMoney(selectedTotal / 24) }}/mo</option>
                <option :value="36">36 months — ${{ formatMoney(selectedTotal / 36) }}/mo</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-200">Name</label>
              <input
                v-model.trim="lead.name"
                type="text"
                class="mt-2 w-full rounded-xl border border-gray-700 bg-black/30 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-belk-teal"
                placeholder="Full name"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-200">Email</label>
              <input
                v-model.trim="lead.email"
                type="email"
                class="mt-2 w-full rounded-xl border border-gray-700 bg-black/30 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-belk-teal"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-200">Phone Number</label>
              <input
                v-model.trim="lead.phone"
                type="tel"
                class="mt-2 w-full rounded-xl border border-gray-700 bg-black/30 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-belk-teal"
                placeholder="(###) ###-####"
              />
              <p class="mt-2 text-xs text-gray-400">
                We’ll only use this to contact you about your selected plan.
              </p>
            </div>

            <button
              type="button"
              class="mt-2 w-full rounded-xl px-4 py-3 font-extrabold text-white shadow-lg"
              :class="canSubmit ? 'bg-gradient-to-r from-belk-teal via-cyan-400 to-belk-teal' : 'bg-gray-700 cursor-not-allowed opacity-70'"
              :disabled="!canSubmit || isSubmitting"
              @click="submitLead"
            >
              <span v-if="!isSubmitting">Submit Request</span>
              <span v-else>Submitting...</span>
            </button>

            <p class="text-xs text-gray-400">
              By submitting, you’re requesting a call/text from Belk Heating &amp; Cooling about the selected plan.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: SUCCESS -->
    <div
      v-if="isSuccessOpen"
      class="fixed inset-0 z-[99999] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 bg-black/70" @click="closeSuccess"></div>

      <div class="relative z-10 w-full max-w-md rounded-2xl bg-gray-950 border border-gray-700 shadow-2xl p-7 text-center">
        <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-belk-teal/20">
          <svg viewBox="0 0 24 24" fill="none" class="size-8">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-belk-teal"
            />
          </svg>
        </div>

        <h3 class="mt-4 text-xl font-extrabold text-white">We’ll be in touch!</h3>
        <p class="mt-2 text-gray-300">
          Thanks — we received your request. A Belk Heating &amp; Cooling team member will reach out shortly to confirm your plan and next steps.
        </p>

        <button
          type="button"
          class="mt-6 w-full rounded-xl px-4 py-3 font-extrabold text-white bg-gradient-to-r from-belk-teal via-cyan-400 to-belk-teal"
          @click="closeSuccess"
        >
          Done
        </button>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      // modal + lead flow
      isPlanModalOpen: false,
      isSuccessOpen: false,
      isSubmitting: false,

      // selected coverage + pricing
      selectedCoverage: '',
      selectedTotal: 0,
      selectedMonths: 24, // default to popular-ish term
      availableMonths: [6, 18, 24, 36],

      // lead info
      lead: {
        name: '',
        email: '',
        phone: '',
      },
    }
  },
  computed: {
    canSubmit() {
      const nameOk = this.lead.name && this.lead.name.length >= 2

      // Phone is REQUIRED
      const phoneDigits = (this.lead.phone || '').replace(/\D/g, '')
      const phoneOk = phoneDigits.length >= 10

      // Email is OPTIONAL (only validated if they typed something)
      const email = (this.lead.email || '').trim()
      const emailOk = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

      const monthsOk = this.availableMonths.includes(this.selectedMonths)
      const coverageOk = !!this.selectedCoverage && !!this.selectedTotal

      return coverageOk && monthsOk && nameOk && phoneOk && emailOk
    },
  },
  methods: {
    formatMoney(n) {
      const num = Number(n || 0)
      return num.toFixed(2).replace(/\.00$/, '')
    },

    openPlanModal(coverageName, total) {
      this.selectedCoverage = coverageName
      this.selectedTotal = total
      this.selectedMonths = 24 // default selection in modal
      this.isPlanModalOpen = true
    },

    closePlanModal() {
      this.isPlanModalOpen = false
    },

    closeSuccess() {
      this.isSuccessOpen = false
    },

    async submitLead() {
      if (!this.canSubmit || this.isSubmitting) return
      this.isSubmitting = true

      try {
        const monthly = this.selectedTotal / this.selectedMonths
        const planLabel = `${this.selectedCoverage} — ${this.selectedMonths} Month Plan ($${this.formatMoney(monthly)}/mo)`

        // IMPORTANT:
        // This endpoint must exist server-side. Your server will send the SMS to 737-251-3394.
        // Browser-only Vue cannot send an SMS directly.
        const res =
        await fetch('https://belk-warranty-leads.titushopkins1of16.workers.dev', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.lead.name,
            phone: this.lead.phone,
            email: (this.lead.email || '').trim() || '',
            plan: planLabel,
            coverage: this.selectedCoverage,
            months: this.selectedMonths,
            total: this.selectedTotal,
            monthly: monthly,
          }),
        })

        if (!res.ok) throw new Error('Failed to submit')

        // success UI
        this.isPlanModalOpen = false
        this.isSuccessOpen = true

        // reset form
        this.lead = { name: '', email: '', phone: '' }
        this.selectedCoverage = ''
        this.selectedTotal = 0
        this.selectedMonths = 24
      } catch (e) {
        alert('Something went wrong. Please try again or call (737) 251-3394.')
      } finally {
        this.isSubmitting = false
      }
    },
  },
}
</script>

<style scoped>
p,
li {
  @apply leading-7;
}
</style>
