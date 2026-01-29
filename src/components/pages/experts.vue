<template>
	<section class="relative w-full bg-belk-light-gray overflow-hidden px-6 sm:px-10 lg:px-24 py-20 md:py-32">
		<!-- Background Decorative Icon -->
		<div class="absolute -top-20 sm:-top-28 right-0 w-44 h-44 sm:w-96 sm:h-96 lg:w-[32rem] lg:h-[32rem] object-contain opacity-10 pointer-events-none select-none">
			<img src="/images/icon-large-hammar.svg" alt="" class="w-full h-full object-contain" />
		</div>

		<div class="relative max-w-7xl mx-auto">
			<!-- Title -->
			<div class="flex items-start justify-between gap-4">
				<h2 class="font-lobster italic font-semibold text-2xl sm:text-4xl leading-tight max-w-xs sm:max-w-none text-belk-dark-gray">
					Experts in Heating, Cooling & Indoor Comfort.
				</h2>

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
						<div class="mt-4 space-y-2 ">
							<h3 class="text-base font-bold text-belk-dark-gray">
								{{ service.title }}
							</h3>

							<p class="text-xs sm:text-sm text-belk-dark-gray/80 leading-5 sm:leading-6">
								{{ service.description }}
							</p>

							<span class="inline-flex items-center justify-center rounded-full bg-belk-dark-gray px-4 py-2 text-xs font-semibold text-belk-light-gray hover:bg-belk-red hover:text-white transition">
								Learn More
							</span>
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
					title: 'AC Installation & Replacement',
					description: 'Stay cool with energy-efficient air conditioning systems professionally installed for long-term performance.',
					image: '/images/nick-side.png',
					href: '/roof-repairs',
				},
				{
					title: 'Heating System Services',
					description: 'From furnace repairs to full heating system replacements, we keep your home warm and safe all winter.',
					image: '/images/belk-3.png',
					href: '/roof-repairs',
				},
				{
					title: 'HVAC Repairs & Maintenance',
					description: 'Fast repairs, seasonal tune-ups, and preventative maintenance to keep your HVAC system running smoothly.',
					image: '/images/belk-7.png',
					href: '/roof-repairs',
				},
			],
		}
	},
}
</script>
