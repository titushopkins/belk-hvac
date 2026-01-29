<template>
	<div class="w-full max-w-8xl mx-auto overflow-x-clip">
		<!-- Backdrop for mobile menu -->
		<div
			:class="serviceImage ? 'fixed w-full h-full inset-0 bg-black/30 z-50 opacity-100' : 'opacity-0'"
			class="transition-all duration-300 ease-in-out"
		/>
		<div
			class="select-none  w-full justify-center sm:max-w-[352px] transition-all transform-gpu duration-700 bg-gray-900 sm:rounded-xl shadow-lg shadow-belk-light-brown sm:shadow-black h-[440px] relative z-[60]"
			:class="serviceImage ? '' : 'opacity-0 -translate-y-full'"
			@click.stop
		>
	      <div class="w-full lg:max-w-xl overflow-x-auto h-auto rounded-2xl">
	        <div class="flex flex-col relative overflow-notHidden transition-all duration-700 py-8 px-6">
              <div class="w-full h-full space-y-3">
                <div class="w-full h-full" v-for="service in services" :key="service">
                  <div class="flex space-x-4">
                    <img class="w-[64px] h-[80px] rounded-lg translate-y-1" :src="service.img" />
                    <div class="flex flex-col text-start space-y-1">
                      <div class="text-gray-300 text-2xl font-lobster font-semibold">{{ service.title }}</div>
                      <div class="text-xs text-gray-300">{{ service.description }}</div>
                    </div>
                  </div>
	            </div>
              </div>
            </div>
		  </div>
		</div>

		<!-- NEW NAV (replaces old header bar) -->
         <div class="">
		  <nav
			@scroll="dropDown"
			v-show="!notHidden"
            :class="serviceImage ? 'opacity-70' : 'opacity-100'"
			class=""
		>

			<!-- Nav Container (white pill) -->
			<div class="bg-red-500 shadow-roofing px-1 sm:pl-2">
			  <div class="flex py-1 gap-x-1">
			    <button
			    	class="h-10 px-4 rounded-full hover:bg-gray-100 transition-colors text-gray-300"
			    	@click.stop="serviceImage = !serviceImage"
			    >
			    	Services
			    </button>
			  </div>
			</div>
		  </nav>
        </div>
	</div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import RoofingButton from '../roofing-button.vue';

 export default {
	components: { RoofingButton, },
	props: { notHidden: { type: Boolean, default: false } },
	inject: ['store', 'darkMode'],
	data() {
		return {
            serviceImage: false,
			showLoginModal: false,
			links: [
				{ name: `Gallery`, path: `/gallery` },
				{ name: `Financing`, path: `/financin` },
			],
            services: [
                { img: '/images/metal-roof.png',
                  title: 'Metal Roofs',
                  description: 'Explore this durable roofing option and learn about the numerous benefits of a metal roof.'
                },
                { img: '/images/shingle-roof.png',
                  title: 'Shingle Roofs',
                  description: 'Discover our high-quality shingle and component options in a diverse range of styles and colors.'
                },
                { img: '/images/construction.png',
                  title: 'Construction',
                  description: 'We offer other construction services like flooring, fencing, siding, gutters, and more.'
                },
                { img: '/images/roof-repair.png',
                  title: 'Roof Repair',
                  description: 'Not ready to replace your whole roof? We can extend the life of your existing roof by repairing it.'
                }
            ],
			sending: false,
			name: '',
			email: '',
			phone: '',
			message: '',
			open: false, // false = collapsed (Services), true = expanded (Book Appointment)
		}
	},
	methods: {
		slide() {
			this.open = !this.open
		},
		sendRequest() {
			// your submit logic here
		},
	},
    computed: {
		computedLinks() {
			return this.links
		},
    }
 }
</script>
