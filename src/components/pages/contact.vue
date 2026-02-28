<template>
	<div class="flex flex-col w-full justify-center bg-gray-900">
		<!-- HERO -->
		<div class="relative w-full h-screen max-h-[60vh] bg-[url('/images/belk-11.png')] bg-cover bg-center">
			<div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
			<div class="relative z-10 flex flex-col w-full h-full items-center justify-center text-center">
				<h2 class="text-white text-2xl sm:text-[32px] font-semibold font-lobster italic">Contact Belk Heating & Cooling</h2>
				<div class="text-white text-5xl sm:text-6xl font-semibold pt-4">We'd love to help you.</div>
			</div>
		</div>

		<!-- BODY -->
		<div class="inset-0 bg-no-repeat bg-contain flex w-full justify-center pb-12">
			<div class="max-w-5xl lg:max-w-8xl w-full justify-center px-6 sm:px-8 lg:px-20">
				<div class="flex flex-col md:flex-row w-full justify-center items-center sm:items-start md:justify-between gap-10 xl:gap-20">
					<!-- CONTACT INFO -->
					<div class="flex flex-col md:flex-row w-full md:w-2/5 justify-center py-12">
						<div class="flex flex-col w-full space-y-10">
							<div class="text-start font-bold text-3xl text-belk-light-gray leading-[3rem] font-lobster">
								We look forward to hearing from you!
							</div>

							<div class="flex w-full justify-start overflow-hidden sm:overflow-auto">
								<img class="w-full flex min-w-[60vh]" src="/images/gray-line-flames.svg" />
							</div>

							<div class="flex flex-col space-y-6">
								<div class="space-y-8">
									<a href="sms:7372513394" class="flex m-auto items-center gap-x-4">
										<img class="w-16" src="/images/justin-teal-phone.svg" />
										<div class="flex flex-col">
											<div class="text-start font-semibold text-2xl pb-2 text-white tracking-wide">Call or Text Us</div>
											<div class="text-white/50">(737) 251-3394</div>
										</div>
									</a>

									<a href="mailto:belkheatingandcooling@gmail.com" class="flex m-auto items-center gap-x-4">
										<img class="w-16" src="/images/justin-teal-email.svg" />
										<div class="flex flex-col">
											<div class="text-start font-semibold text-2xl pb-2 text-white tracking-wide">Send us an email</div>
											<div class="text-white/50">belkheatingandcooling@gmail.com</div>
										</div>
									</a>

									<a href="/service-areas" target="_blank" rel="noopener noreferrer" class="flex m-auto items-center gap-x-4">
										<img class="w-16" src="/images/justin-teal-map.svg" />
										<div class="flex flex-col">
											<div class="text-start font-semibold text-2xl pb-2 text-white tracking-wide">Service Areas</div>
											<div class="text-white/50">Servicing Burnet County & Surrounding Areas</div>
										</div>
									</a>
								</div>
							</div>
						</div>
					</div>

					<!-- FORM -->
					<div class="w-full md:w-3/5 lg:max-w-xl bg-gray-800 rounded-2xl p-4 sm:p-6 md:shadow-xl md:shadow-white/20 md:-translate-y-16">
						<div class="flex flex-col w-full justify-start space-y-4">
							<div class="text-start font-semibold text-2xl text-white tracking-wide">Contact Us</div>
							<div class="text-sm leading-6 text-white/80">
								Complete this form and we will get back with you as soon as possible.<br />
								If you would like to request a free estimate, please select that option below and include your job location.
							</div>
						</div>

						<div class="pt-8">
							<div class="flex w-fit space-x-4 text-sm font-bold text-white/70 bg-white/10 py-1 sm:py-2 px-2 sm:px-4 rounded-xl">
								<button
									@click="store.activeTab = 'quote'"
									class="px-5 py-3 rounded-xl transition-all text-xs sm:text-sm"
									:class="store.activeTab === 'quote' ? 'bg-gray-900 font-semibold text-belk-teal shadow' : 'bg-transparent'"
								>
									Request a Free Quote
								</button>

								<button
									@click="store.activeTab = 'message'"
									class="px-5 py-3 rounded-xl transition-all text-xs sm:text-sm"
									:class="store.activeTab === 'message' ? 'bg-gray-900 font-semibold text-belk-teal shadow' : 'bg-transparent'"
								>
									Send a Message
								</button>
							</div>

							<!-- Form Area -->
							<div class="relative h-auto rounded-xl py-6" id="contact-section">
								<div class="w-full">
									<form @submit.prevent="sendRequest" class="space-y-4">
										<div class="flex flex-col gap-y-1">
											<div class="input-title">Name</div>
											<input v-model="name" type="text" class="placeholder:text-sm placeholder:text-white/40 input-css" />
										</div>

										<div class="flex flex-col gap-y-1">
											<div class="input-title">Phone</div>
											<input :value="phone" @input="formatPhone" type="tel" class="placeholder:text-sm placeholder:text-white/40 input-css" />
										</div>

										<div class="flex flex-col gap-y-1">
											<div class="input-title">Email</div>
											<input v-model="email" type="email" class="placeholder:text-sm placeholder:text-white/40 input-css" />
										</div>

										<!-- Animated Job Location (only for Quote tab) -->
										<transition
											enter-active-class="transition-all duration-300 ease-in-out overflow-hidden"
											enter-from-class="max-h-0 opacity-0 -translate-y-1"
											enter-to-class="max-h-32 opacity-100 translate-y-0"
											leave-active-class="transition-all duration-200 ease-in-out overflow-hidden"
											leave-from-class="max-h-32 opacity-100 translate-y-0"
											leave-to-class="max-h-0 opacity-0 -translate-y-1"
										>
											<div v-if="store.activeTab === 'quote'" class="flex flex-col gap-y-1">
												<div class="input-title">Job Location</div>
												<input
													ref="addressInput"
													v-model="address"
													type="text"
													placeholder="Start typing an address..."
													class="placeholder:text-sm placeholder:text-white/40 input-css"
												/>
											</div>
										</transition>

										<div class="flex flex-col gap-y-1">
											<div class="input-title">Message</div>
											<textarea v-model="quote" rows="8" class="placeholder:text-sm placeholder:text-white/40 input-css" />
										</div>

										<!-- Submit button (matches warranty page) -->
										<button
											type="submit"
											class="mt-2 w-full rounded-xl px-4 py-3 font-extrabold text-white shadow-lg"
											:class="canSubmitContact ? 'bg-gradient-to-r from-belk-teal via-cyan-400 to-belk-teal' : 'bg-gray-700 cursor-not-allowed opacity-70'"
											:disabled="!canSubmitContact || isSubmitting"
										>
											<span v-if="!isSubmitting">{{ store.activeTab === 'quote' ? 'Get Your Quote' : 'Send Message' }}</span>

											<span v-else class="flex items-center justify-center gap-x-2">
												<svg class="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
													<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
													<path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
												</svg>
												<span>Submitting...</span>
											</span>
										</button>
									</form>
								</div>
							</div>
							<!-- /Form Area -->
						</div>
					</div>
					<!-- /FORM -->
				</div>
			</div>
		</div>

		<!-- MODAL: SUCCESS (matches warranty styling/message) -->
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
					Thanks — we received your request. <span class="font-semibold">A Belk Heating &amp; Cooling</span> team member will reach out shortly.
				</p>

				<p class="mt-2 text-gray-300">
					If you do not see the email in your inbox be sure to check your spam/junk folder.
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
	</div>
</template>

<script>
import { googlePlacesKey } from '@settings'

export default {
	inject: ['store'],
	data() {
		return {
			name: '',
			email: '',
			quote: '',
			phone: '',
			address: '',

			isSubmitting: false,
			isSuccessOpen: false,
		}
	},
	computed: {
		canSubmitContact() {
			const nameOk = this.name.trim().length >= 2

			const phoneDigits = (this.phone || '').replace(/\D/g, '')
			const phoneOk = phoneDigits.length >= 10

			const emailTrim = (this.email || '').trim()
			const emailOk = emailTrim === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)

			const msgOk = this.quote.trim().length >= 2

			// Require at least phone OR valid email
			const phoneOrEmailOk = phoneOk || (emailTrim !== '' && emailOk)

			// If quote tab, require address
			const addressOk = this.store.activeTab !== 'quote' || this.address.trim().length >= 4

			return nameOk && phoneOrEmailOk && emailOk && msgOk && addressOk
		},
	},
	mounted() {
		this.store.activeTab = this.store.activeTab || 'quote'
		this.loadGoogleMaps()
	},
	methods: {
		formatPhone(e) {
			let digits = e.target.value.replace(/\D/g, '').slice(0, 10)
			let formatted = ''
			if (digits.length > 0) formatted = '(' + digits.slice(0, 3)
			if (digits.length >= 3) formatted += ') '
			if (digits.length > 3) formatted += digits.slice(3, 6)
			if (digits.length >= 6) formatted += '-'
			if (digits.length > 6) formatted += digits.slice(6, 10)
			this.phone = formatted
		},

		loadGoogleMaps() {
			if (window.google?.maps?.places) {
				this.initAutocomplete()
				return
			}
			const script = document.createElement('script')
			script.src = `https://maps.googleapis.com/maps/api/js?key=${googlePlacesKey}&libraries=places`
			script.async = true
			script.onload = () => this.initAutocomplete()
			document.head.appendChild(script)
		},

		initAutocomplete() {
			this.$nextTick(() => {
				if (!this.$refs.addressInput) return
				const autocomplete = new window.google.maps.places.Autocomplete(this.$refs.addressInput, {
					types: ['address'],
					componentRestrictions: { country: 'us' },
				})
				autocomplete.addListener('place_changed', () => {
					const place = autocomplete.getPlace()
					this.address = place.formatted_address || place.name
				})
			})
		},

		closeSuccess() {
			this.isSuccessOpen = false
		},

		async sendRequest() {
			if (!this.canSubmitContact || this.isSubmitting) return

			this.isSubmitting = true

			const payload = {
				name: this.name.trim(),
				email: (this.email || '').trim(),
				quote: this.quote.trim(), // IMPORTANT: Worker detects contact form by "quote"
				phone: (this.phone || '').replace(/\D/g, ''),
				...(this.store.activeTab === 'quote' ? { address: this.address.trim() } : {}),
			}

			try {
				const res = await fetch('https://belk-warranty-leads.titushopkins1of16.workers.dev', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				})

				if (!res.ok) {
					const txt = await res.text().catch(() => '')
					throw new Error(txt || 'Request failed')
				}

				this.isSuccessOpen = true

				// reset form
				this.name = ''
				this.email = ''
				this.quote = ''
				this.phone = ''
				this.address = ''
			} catch (err) {
				console.error(err)
				alert('Something went wrong. Please try again or call (737) 251-3394.')
			} finally {
				this.isSubmitting = false
			}
		},
	},
}
</script>

<style scoped lang="postcss">
.hero-overlay {
	@apply absolute inset-0 bg-black/50;
}

.input-title {
	@apply text-sm font-semibold text-white;
}

.input-css {
	@apply w-full bg-gray-900/60 text-white px-4 py-3 rounded-lg border border-white/10;
	@apply focus:outline-none focus:ring-2 focus:ring-belk-teal focus:border-belk-teal;
}
</style>

<style lang="postcss">
.pac-container {
	@apply bg-gray-900 rounded-lg shadow-lg border border-white/10 mt-1 font-sans;
}

.pac-item {
	@apply px-4 py-3 cursor-pointer border-b border-white/10 text-sm text-white/80;
}

.pac-item:hover,
.pac-item-selected {
	@apply bg-white/10;
}

.pac-icon {
	@apply hidden;
}

.pac-item-query {
	@apply text-white font-semibold;
}

.pac-matched {
	@apply text-belk-teal font-semibold;
}

.pac-container::after {
	@apply hidden;
}
</style>
