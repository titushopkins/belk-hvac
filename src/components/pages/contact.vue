<template>
	<div class="flex flex-col w-full justify-center">
		<div class="relative w-full h-screen max-h-[60vh] bg-[url('/images/frame-2-large.png')] bg-cover bg-center">
			<div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
			<div class="relative z-10 flex flex-col w-full h-full items-center justify-center text-center">
				<h2 class="text-white text-2xl sm:text-[32px] font-semibold font-lobster italic">Contact Jay Lott</h2>

				<div class="text-white text-5xl sm:text-6xl font-semibold pt-4">We'd love to help you.</div>
			</div>
		</div>

		<!-- Background Top Line -->
		<div class="inset-0 bg-no-repeat bg-contain flex w-full justify-center pb-12">
			<div class="max-w-5xl lg:max-w-8xl w-full justify-center px-6 sm:px-8 lg:px-20">
				<!-- Contact + Services Section -->
				<div class="flex flex-col md:flex-row w-full justify-center items-center sm:items-start md:justify-between gap-10 xl:gap-20">
					<!-- Contact Info -->
					<div class="flex flex-col md:flex-row w-full md:w-2/5 justify-center py-12">
						<div class="flex flex-col w-full space-y-10">
							<div class="text-start font-bold text-3xl text-hp-gray-800 leading-[3rem] font-lobster">We look forward to hearing from you!</div>

							<div class="flex w-full justify-start overflow-hidden sm:overflow-auto">
								<img class="w-full flex min-w-[60vh]" src="/images/gray-line-flames.svg" />
							</div>

							<div class="flex flex-col text-hp-gray-900 space-y-6">
								<div class="space-y-8">
									<a href="sms:7372513394" class="flex m-auto items-center gap-x-4">
										<img class="w-16" src="/images/justin-teal-phone.svg" />
										<div class="flex flex-col">
											<div class="text-start font-semibold text-2xl pb-2 text-white tracking-wide">Call or Text Us</div>
											<div>(737) 251-3394</div>
										</div>
									</a>

									<a href="mailto:jaylottroofing@gmail.com" class="flex m-auto items-center gap-x-4">
										<img class="w-16" src="/images/justin-teal-email.svg" />
										<div class="flex flex-col">
											<div class="text-start font-semibold text-2xl pb-2 text-white tracking-wide">Send us an email</div>
											<div>jaylottroofing@gmail.com</div>
										</div>
									</a>

									<a href="https://maps.google.com/?q=720+S+Wheeler+St,+Suite+5,+Jasper,+TX+75951" target="_blank" rel="noopener noreferrer" class="flex m-auto items-center gap-x-4">
										<img class="w-16" src="/images/justin-teal-map.svg" />
										<div class="flex flex-col">
											<div class="text-start font-semibold text-2xl pb-2 text-white tracking-wide">Visit Us</div>
											<div>720 S Wheeler St, Suite 5, Jasper, TX 75951</div>
										</div>
									</a>
								</div>
							</div>
						</div>
					</div>

					<!-- Tabs & Form/Calendar -->
					<div class="w-full md:w-3/5 lg:max-w-xl bg-gray-900 rounded-2xl p-2 sm:p-6 shadow-xl shadow md:-translate-y-16">
						<div class="flex flex-col w-full justify-start space-y-4">
							<div class="text-start font-semibold text-2xl text-white tracking-wide">Contact Us</div>
							<div class="text-sm leading-6">
								Complete this form and we will get back with you as soon as possible.<br />
								If you would like to request a free estimate, please select that option below and include your job location.
							</div>
						</div>

						<div class="pt-8">
							<div class="flex w-fit space-x-4 text-sm font-bold text-hp-gray-600 bg-stone-300/40 py-1 sm:py-2 px-2 sm:px-4 rounded-xl">
								<button @click="store.activeTab = 'quote'" class="px-5 py-3 rounded-xl transition-all text-xs sm:text-sm" :class="store.activeTab === 'quote' ? 'bg-gray-900 font-semibold text-belk-teal shadow' : 'bg-transparent'">Request a Free Quote</button>

								<button @click="store.activeTab = 'message'" class="px-5 py-3 rounded-xl transition-all text-xs sm:text-sm" :class="store.activeTab === 'message' ? 'bg-gray-900 font-semibold text-belk-teal shadow' : 'bg-transparent'">Send a Message</button>
							</div>

							<!-- Form Area -->
							<div class="relative h-auto rounded-xl py-6" id="contact-section">
								<div class="w-full">
									<form @submit.prevent="sendRequest" class="space-y-4 px-2">
										<div class="flex flex-col gap-y-1">
											<div class="input-title">Name</div>
											<input v-model="name" type="text" class="placeholder:text-sm placeholder:text-hp-gray-500 input-css" />
										</div>

										<div class="flex flex-col gap-y-1">
											<div class="input-title">Phone</div>
											<input :value="phone" @input="formatPhone" type="tel" class="placeholder:text-sm placeholder:text-hp-gray-500 input-css" />
										</div>

										<div class="flex flex-col gap-y-1">
											<div class="input-title">Email</div>
											<input v-model="email" type="email" class="placeholder:text-sm placeholder:text-hp-gray-500 input-css" />
										</div>

										<!-- Animated Job Location (only for Quote tab) -->
										<transition enter-active-class="transition-all duration-300 ease-in-out overflow-hidden" enter-from-class="max-h-0 opacity-0 -translate-y-1" enter-to-class="max-h-32 opacity-100 translate-y-0" leave-active-class="transition-all duration-200 ease-in-out overflow-hidden" leave-from-class="max-h-32 opacity-100 translate-y-0" leave-to-class="max-h-0 opacity-0 -translate-y-1">
											<div v-if="store.activeTab === 'quote'" class="flex flex-col gap-y-1">
												<div class="input-title">Job Location</div>
												<input ref="addressInput" v-model="address" type="text" placeholder="Start typing an address..." class="placeholder:text-sm placeholder:text-hp-gray-500 input-css" />
											</div>
										</transition>

										<div class="flex flex-col gap-y-1">
											<div class="input-title">
												{{ store.activeTab === 'quote' ? 'Message' : 'Message' }}
											</div>
											<textarea v-model="quote" rows="8" class="placeholder:text-sm placeholder:text-hp-gray-500 input-css" />
										</div>

										<button :disabled="sending" type="submit" class="px-5 py-3 bg-roofing-red text-white text-base font-semibold rounded-full shadow hover:bg-hp-gray-500 border-2 border-hp-gray-800 disabled:opacity-60 disabled:cursor-not-allowed">
											{{ store.activeTab === 'quote' ? 'Get Your Quote' : 'Send Message' }}
										</button>
									</form>
								</div>
							</div>
							<!-- /Form Area -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
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
			sending: false,
		}
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
		isValidEmail(email) {
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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
		async sendRequest() {
			if (!this.name.trim()) return Swal.fire({ icon: 'warning', title: 'Please enter your name' })
			const hasValidPhone = this.phone && this.phone.replace(/\D/g, '').length >= 10
			const hasValidEmail = this.email && this.isValidEmail(this.email)
			if (!hasValidPhone && !hasValidEmail) return Swal.fire({ icon: 'warning', title: 'Please enter a valid phone number or email' })
			if (!this.quote.trim()) return Swal.fire({ icon: 'warning', title: 'Please enter a message' })

			this.sending = true

			const data = {
				name: this.name,
				email: this.email,
				quote: this.quote,
				phone: this.phone.replace(/\D/g, ''),
				...(this.store.activeTab === 'quote' ? { address: this.address } : {}),
			}

			try {
				const response = await axios.post(`${this.store.api}/endpoints/contact`, data)

				if (response.data.success) {
					Swal.fire({
						icon: 'success',
						title: 'Request sent successfully',
						text: "We'll be in touch soon! 😊",
					})

					this.name = ''
					this.email = ''
					this.quote = ''
					this.phone = ''
					this.address = ''
				} else {
					Swal.fire({
						icon: 'error',
						title: 'Request failed!',
						text: 'Something went wrong sending your request. Please try again.',
					})
				}
			} catch (err) {
				Swal.fire({
					icon: 'error',
					title: 'Request failed!',
					text: 'Something went wrong sending your request. Please try again.',
				})
				console.error(err)
			}

			this.sending = false
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
	@apply w-full bg-belk-light-gray px-4 py-3 rounded-lg focus:outline focus:outline-[2px] focus:outline-belk-teal;
}
</style>

<style lang="postcss">
.pac-container {
	@apply bg-gray-900 rounded-lg shadow-lg border border-gray-200 mt-1 font-sans;
}

.pac-item {
	@apply px-4 py-3 cursor-pointer border-b border-gray-100 text-sm;
}

.pac-item:hover,
.pac-item-selected {
	@apply bg-belk-light-gray;
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
