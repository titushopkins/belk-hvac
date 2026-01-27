<template>
	<section class="relative w-full bg-white overflow-hidden px-6 sm:px-10 lg:px-24 py-20 md:py-32">
		<!-- Background Decorative Icon -->
		<div class="absolute -top-20 sm:-top-28 right-0 w-44 h-44 sm:w-96 sm:h-96 lg:w-[32rem] lg:h-[32rem] object-contain opacity-10 pointer-events-none select-none">
			<img src="/images/icon-large-hammar.svg" alt="" class="w-full h-full object-contain" />
		</div>

		<div class="relative max-w-7xl mx-auto">
			<!-- Title -->
			<div class="flex items-start justify-between gap-4">
				<h2 class="font-lobster italic font-semibold text-2xl sm:text-4xl leading-tight text-black max-w-xs sm:max-w-none">Experts in Roofing, Home Renovation and Construction.</h2>

				<img src="/images/icon-hammar.svg" alt="" class="w-9 h-9 sm:w-12 sm:h-12 shrink-0 opacity-80 mt-1" />
			</div>

			<!-- Cards -->
			<div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
				<a v-for="service in services" :key="service.title" :href="service.href" class="group block">
					<div class="mx-auto w-full">
						<!-- Image -->
						<div class="rounded-2xl overflow-hidden shadow-lg shadow-black/10">
							<img :src="service.image" :alt="service.title" class="w-full h-48 object-cover" />
						</div>

						<!-- Content -->
						<div class="mt-4 space-y-2">
							<h3 class="text-base font-bold text-black">
								{{ service.title }}
							</h3>

							<p class="text-xs sm:text-sm text-black/70 leading-5 sm:leading-6">
								{{ service.description }}
							</p>

							<span class="inline-flex items-center justify-center rounded-full bg-roofing-light-gray px-4 py-2 text-xs font-semibold text-roofing-gray hover:bg-roofing-red hover:text-white transition"> Learn More </span>
						</div>
					</div>
				</a>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	data() {
		return {
			services: [
				{
					title: 'Metal Roofs',
					description: 'Explore this durable roofing option and learn about the numerous benefits of a metal roof.',
					image: '/images/experts-1.png',
					href: '/metal-roofing',
				},
				{
					title: 'Shingle Roofs',
					description: 'Discover our high-quality shingle and component options in a diverse range of styles and colors.',
					image: '/images/experts-2.png',
					href: '/shingle-roofing',
				},
				{
					title: 'Construction',
					description: 'We offer other construction services like flooring, fencing, siding, gutters, and more.',
					image: '/images/experts-3.png',
					href: '/construction-projects',
				},
			],
		}
	},
}
</script>
