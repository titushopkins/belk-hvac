<template>
	<div class="w-full max-w-8xl mx-auto overflow-x-clip" @click="showMenu = false">
		<!-- Backdrop for mobile menu -->
		<div :class="showMenu ? 'fixed w-full h-full inset-0 bg-black/30 z-10 opacity-100' : 'opacity-0'" class="transition-all duration-300 ease-in-out" />

		<!-- Slide-out Menu -->
		<div class="select-none sm:translate-y-9 w-full justify-center sm:max-w-[352px] min-h-[735px] transition-all transform-gpu duration-500 bg-gray-900 rounded-b-2xl sm:rounded-2xl shadow-lg shadow-belk-light-brown sm:shadow-black absolute right-0 z-[60]" :class="showMenu ? 'sm:-translate-x-12' : 'opacity-0 -translate-y-full sm:translate-x-full'" @click.stop>
			<button class="absolute top-0 right-0 cursor-pointer m-4" @click="showMenu = false">
				<img src="/images/jay-lott-iron-cross.svg" alt="" />
			</button>

			<div class="flex flex-col text-xl text-gray-300">
				<a href="/" class="cursor-pointer p-6">
					<img class="w-24" src="/images/belk-official-full-logo.svg" alt="" />
				</a>

				<!-- Main links in slide-out -->
				<div class="flex flex-col text-start w-full justify-start px-6 min-h-0">
	<div class="flex flex-col w-full justify-center h-auto min-h-0">
		<!-- Background Top Line -->
		<div class="inset-0 bg-no-repeat bg-contain flex w-full justify-center min-h-0">
			<div class="w-full justify-center min-h-0">
				<!-- Contact + Services Section -->
				<div class="flex flex-col lg:flex-row w-full justify-between lg:gap-10 xl:gap-20 min-h-0">
					<!-- Tabs & Form/Calendar -->
					<div class="w-full lg:max-w-xl overflow-x-auto h-auto  min-h-0">
						<div class="min-h-0">
							<!-- Toggle Button -->
							<div class="flex w-fit text-sm font-bold text-hp-gray-600">
								<button @click="slide" class="transition-colors text-2xl relative inline-flex font-lobster font-semibold">
									<div
										class="flex w-full items-center text-start justify-start gap-x-2"
										:class="!open ? '' : 'border-belk-teal flex-row-reverse uppercase text-sm font-sans border-b-2'"
									>
										<div>Services</div>

										<img
											src="/images/chevron-left.svg"
											class="w-3 h-3 transition-transform duration-300"
											:class="!open ? '-rotate-180' : ''"
											alt=""
										/>
									</div>
								</button>
							</div>

							<!-- Sliding Panels (accordion-style, transitions in AND out) -->
							<div
								id="contact-section"
								class="relative transition-all duration-700"
								:class="
									open
										? 'h-full max-h-[38vh] overflow-y-scroll pt-3 mt-2 opacity-100 border-t-2 border-belk-light-gray overscroll-contain py-4'
										: 'max-h-0 overflow-hidden py-0 mt-0 opacity-0'
								"
							>
								<!-- content-section id needs to scroll the content inside but sometimes the box on the outside changes size but this needs to always scroll to the bottom and show everyting inside of it. -->
								<div class="w-full space-y-3">
									<div
										v-for="service in services"
										:key="service.title"
										@click="showMenu = false"
										class="w-full"
									>
										<a :href="service.link" class="flex space-x-4">
											<img
												class="min-w-[64px] min-h-[72px] max-w-[64px] max-h-[72px] rounded-lg translate-y-1"
												:src="service.img"
												alt=""
											/>
											<div class="flex flex-col text-start space-y-1">
												<div class="text-gray-300 text-2xl font-lobster font-semibold">
													{{ service.title }}
												</div>
												<div class="text-xs">
													{{ service.description }}
												</div>
											</div>
										</a>
									</div>
								</div>
							</div>
							<!-- End Sliding Panels -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


				<div :class="open ? 'hidden' : 'space-y-6'">
					<div class="flex flex-col space-y-2 pt-2 px-6" @click="showMenu = false">
						<router-link v-for="link in computedLinks" :key="link.name" :to="link.path" class="hover:opacity-70 duration-300 ease-in-out italic font-lobster font-semibold tracking-wide text-2xl text-gray-300 transition-colors" exact-active-class="text-belk-teal">
							{{ link.name }}
						</router-link>
					</div>

					<div class="flex w-full justify-center border-t-2 border-belk-light-gray rounded-full" />

					<div class="flex flex-col space-y-4 font-thin text-sm text-start" @click="showMenu = false">
						<router-link
							to="/warranty"
							class="font-semibold pl-6 border-l-4 border-transparent hover:border-l-belk-gray/50 hover:opacity-70 transition-colors duration-150 ease-in-out"
							exact-active-class="
                border-l-belk-teal
                text-belk-teal
                hover:opacity-100
              "
						>
							Warranty
						</router-link>
						<router-link
							to="/about"
							class="font-semibold pl-6 border-l-4 border-transparent hover:border-l-belk-gray/50 hover:opacity-70 transition-colors duration-150 ease-in-out"
							exact-active-class="
                border-l-belk-teal
                text-belk-teal
                hover:opacity-100
              "
						>
							About
						</router-link>
						<router-link
							to="/contact"
							class="font-semibold pl-6 border-l-4 border-transparent hover:border-l-belk-gray/50 hover:opacity-70 transition-colors duration-150 ease-in-out"
							exact-active-class="
                border-l-belk-teal
                text-belk-teal
                hover:opacity-100
              "
						>
							Contact
						</router-link>
					</div>
				</div>
			</div>

			<div class="px-4 h-auto items-end bottom-0 absolute w-full bg-gray-900 rounded-b-2xl">
				<div class="flex flex-col w-full bottom-0 h-auto items-end bg-gradient-to-b from-belk-light-gray to-transparent rounded-xl space-y-6 px-5 py-3">
					<div class="flex flex-col w-full justify-start space-y-3 p-2">
						<p class="text-start text-sm font-bold uppercase" style="letter-spacing: 1.4px">Get In Touch</p>

						<a href="tel:7372513394" class="text-sm flex items-center gap-2 hover:underline">
							<img class="w-4 h-4" src="/images/jay-lott-call.svg" alt="" />
							(737) 251-3394
						</a>

						<a href="mailto:belkheatingandcooling@gmail.com" class="text-sm flex items-center gap-2 hover:underline">
							<img class="w-4 h-4" src="/images/jay-lott-email-icon.svg" alt="" />
							belkheatingandcooling@gmail.com
						</a>

						<a href="/service-areas" rel="noopener noreferrer" class="text-sm flex items-center gap-2 hover:underline">
							<img class="w-4 h-4" src="/images/jay-lott-map-icon.svg" alt="" />
							Servicing Burnet County and Surrounding Areas
						</a>
					</div>

					<roofing-button variant="primary" text="Request a Free Quote" href="/contact" class="w-full p-4 border-b border-t-0 border-belk-light-gray text-base" />
				</div>
			</div>
		</div>

		<!-- NEW NAV (replaces old header bar) -->
		<div class="flex w-full justify-center">
			<nav @scroll="handleScroll" v-show="!hidden" :class="showMenu ? 'opacity-70' : 'opacity-100'" class="flex w-full px-6 sm:px-12 py-6 items-center gap-2 text-white z-50 absolute">
				<!-- Logo -->
				<router-link class="w-60 shrink-0 flex items-center" to="/">
					<img src="/images/belk-official-full-logo.svg" alt="Jay Lott Roofing Inc." class="w-full h-auto" />
				</router-link>

				<!-- Spacer -->
				<div class="flex-1"></div>

				<!-- Nav Container (white pill) -->
				<div class="bg-gray-900 rounded-full shadow-roofing flex items-center px-1 sm:pl-2 h-[48px] relative">
					<!-- Nav Links (desktop) -->
					<div class="hidden lg:flex items-center gap-3 px-6 text-sm">
						<button @click.stop="serviceImage = !serviceImage" class="relative inline-flex text-gray-300 items-center justify-center h-12 font-semibold hover:opacity-70 transition-opacity before:content-[''] before:absolute before:bottom-1 before:left-0 before:right-0 before:h-1 before:bg-belk-gray before:rounded-full before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300 before:origin-center after:content-[''] after:absolute after:bottom-1 after:left-0 after:right-0 after:h-1 after:bg-belk-teal after:rounded-full after:transition-transform after:duration-300 after:origin-center" :class="serviceImage ? 'after:scale-x-100' : 'after:scale-x-0'">
							Services
							<svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
								<path d="M7 10l5 5 5-5z" />
							</svg>
						</button>

						<template v-for="link in computedLinks" :key="link.name">
							<router-link
								:to="link.path"
								exact-active-class="
                  after:content-['']
                  after:absolute
                  after:bottom-1
                  after:left-0
                  after:right-0
                  after:h-1
                  after:bg-belk-teal
                  after:rounded-full
                  after:scale-x-100
                "
								class="relative inline-flex items-center justify-center h-12 font-semibold text-gray-300 transition-opacity before:content-[''] before:absolute before:bottom-1 before:left-0 before:right-0 before:h-1 before:bg-belk-gray before:rounded-full before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300 before:origin-center after:transition-transform after:duration-300 after:origin-center after:scale-x-0"
							>
								{{ link.name }}
							</router-link>
						</template>
					</div>

					<!-- Action Buttons + Hamburger -->
					<div class="flex items-center py-1 sm:gap-x-1 auto">
						<roofing-button variant="secondary" text="(737) 251-3394" href="tel:7372513394" class="hidden sm:inline-flex text-sm" />
						<roofing-button variant="primary" text="Free Quote" href="/contact" class="px-2.5 py-2 sm:px-4 sm:py-2 border-b border-t-0 border-belk-light-gray text-sm" />
						<button class="h-10 px-4 rounded-full hover:bg-gray-100 transition-colors text-gray-300 flex items-center justify-center" @click.stop="showMenu = !showMenu">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>

					<!-- Backdrop (for services dropdown) -->
					<div v-show="serviceImage" class="fixed inset-0 z-40" @click="serviceImage = false" />

					<!-- Services dropdown (absolute, takes NO space) -->
					<div class="absolute top-full left-0 pt-3 z-50" @click.stop>
						<transition @click="(serviceImage, (showMenu = false))" enter-active-class="transition-all duration-700 ease-in-out transform-gpu" enter-from-class="opacity-0 -translate-y-full scale-95" enter-to-class="opacity-100 translate-y-0 scale-100" leave-active-class="transition-all duration-700 ease-in-out transform-gpu" leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 -translate-y-full scale-95">
							<div v-if="serviceImage" class="select-none w-full sm:max-w-[352px] bg-gray-900 sm:rounded-xl shadow-lg shadow-belk-light-brown sm:shadow-black h-auto z-[60] origin-top will-change-transform" @click.stop>
								<div class="w-full lg:max-w-xl overflow-x-auto h-auto rounded-2xl">
									<div class="flex flex-col relative py-8 px-6">
										<div class="w-full h-full space-y-3">
											<div class="w-full h-full" v-for="service in services" :key="service.title">
												<a :href="service.link" class="flex space-x-4">
													<img class="min-w-[64px] min-h-[80px] max-w-[64px] max-h-[80px] rounded-lg translate-y-1" :src="service.img" alt="" />
													<div class="flex flex-col text-start space-y-1">
														<div class="text-gray-300 text-2xl font-lobster font-semibold">
															{{ service.title }}
														</div>
														<div class="text-xs text-gray-300">
															{{ service.description }}
														</div>
													</div>
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</transition>
					</div>
				</div>
			</nav>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import ServicesDropdown from './pages/services-dropdown.vue'
import RoofingButton from './roofing-button.vue'

export default {
	components: { RoofingButton, ServicesDropdown },
	props: {
		notHidden: { type: Boolean, default: false },
		hidden: { type: Boolean, default: false },
	},
	inject: ['store', 'darkMode'],
	data() {
		return {
			serviceImage: false,
			showMenu: false,
			showLoginModal: false,
			links: [
				{ name: 'Gallery', path: '/gallery' },
				{ name: 'Financing', path: '/financing' },
			],
            services: [
              {
                img: '/images/metal-roof.png',
                link: '/metal-roofing',
                title: 'Metal Roofing',
                description: 'We install metal roofing systems including R-Panel, standing seam, and concealed fastener options for homes and buildings.',
              },
              {
                img: '/images/shingle-roof.png',
                link: '/shingle-roofing',
                title: 'Shingle Roofing',
                description: 'We install architectural and specialty shingles with premium materials and warranty options for residential roofing.',
              },
              {
                img: '/images/roof-repair.png',
                link: '/roof-repairs',
                title: 'Roof Repairs',
                description: 'We provide roof repairs and emergency tarping services for residential and commercial roofing systems.',
              },
              {
                img: '/images/flat-roof-jay-lott.jpg',
                link: '/flat-roof-repairs',
                title: 'Flat Roof Systems',
                description: 'We install TPO flat roofing systems and roof coatings with extended warranty options available.',
              },
              {
                img: '/images/construction.png',
                link: '/home-renovation',
                title: 'Home Renovation',
                description: 'We offer interior renovation services including painting, bathroom remodels, and kitchen improvements.',
              },
              {
                img: '/images/construction-projects.png',
                link: '/construction-projects',
                title: 'Construction Projects',
                description: 'We build metal buildings, carports, fences, decks, and siding for residential and commercial projects.',
              },
            ],
			sending: false,
			name: '',
			email: '',
			phone: '',
			message: '',
			open: false, // false = collapsed (Services), true = expanded (Book Appointment)
		}
	},
	computed: {
		computedLinks() {
			return this.links
		},
	},
	methods: {
		closeMenus() {
			this.serviceImage = false
			this.showMenu = false
		},
		slide() {
			this.open = !this.open
		},
		sendRequest() {
			// your submit logic here
		},
	},
}
</script>
