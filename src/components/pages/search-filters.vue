<template>
	<div class="w-full lg:-translate-y-32">
		<div class="w-full rounded-xl">
			<div class="space-y-4 sm:space-y-6">
				<div v-for="(row, rowIndex) in groupedRows" :key="rowIndex" class="grid gap-6" :class="row.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'">
					<div v-for="(item, itemIndex) in row" :key="`${rowIndex}-${itemIndex}`" class="overflow-hidden rounded-lg">
						<!-- IMAGE TILE -->
						<img v-if="item.type !== 'content'" :src="item.src" alt="" class="relative rounded-lg bg-center bg-no-repeat bg-cover" :class="item.class" />

						<!-- CONTENT TILE (ONLY ONCE, NEXT TO 7TH IMAGE) -->
						<div v-else class="w-full h-full max-h-[350px] sm:max-w-[494px] sm:max-h-[494px] rounded-lg bg-roofing-light-gray border border-roofing-light-gray/40 shadow-sm flex">
							<div class="flex w-full gap-2 pt-4">
								<div class="pl-4 space-y-4">
									<h3 class="text-3xl font-semibold text-black">Want this roof on your house?</h3>
									<p class="text-sm text-roofing-dark-gray">Contact us now to make arrangements for roofing services!</p>
									<a href="/contact" class="text-xs text-white bg-roofing-red rounded-full px-4 py-2"> Request a Free Quote </a>
									<div class="flex w-full justify-start items-start flex w-full h-auto md:items-end bottom-0 gap-4 pt-2">
										<div class="flex flex-col gap-[1px]">
											<img src="/images/stars.svg" class="w-[85px]" />
											<p class="text-xs">5 stars on Google</p>
										</div>
										<div class="flex flex-col gap-[2px]">
											<p class="text-sm font-semibold">2,000+</p>
											<p class="text-xs">Satisfied customers</p>
										</div>
									</div>
								</div>

								<div class="flex w-full justify-end items-end bottom-0">
									<img src="/images/justin-Illustration.svg" alt="" class="w-auto h-full max-h-80 sm:max-h-[400px] rounded-tl-[80px]" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="hasMoreImages" class="mb-1 mt-12 flex justify-center items-end">
			<button @click="loadMore" class="px-3 py-2 rounded-md bg-roofing-light-gray text-roofing-dark-gray/80 text-sm font-semibold">Load More</button>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		photos: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			displayLimit: 10,
		}
	},
	watch: {
		photos() {
			this.displayLimit = 10
		},
	},
	computed: {
		hasMoreImages() {
			return this.displayLimit < this.photos.length
		},
		images() {
			const sizeClasses = ['w-full h-full max-h-[350px] sm:max-w-[1040px] sm:max-h-[584.48px]', 'w-full h-full max-h-[350px] sm:max-w-[494px] sm:max-h-[494px]', 'w-full h-full max-h-[350px] sm:max-w-[494px] sm:max-h-[494px]', 'w-full h-full max-h-[350px] sm:max-w-[1040px] sm:max-h-[584.48px]', 'w-full h-full max-h-[350px] sm:max-w-[494px] sm:max-h-[494px]', 'w-full h-full max-h-[350px] sm:max-w-[494px] sm:max-h-[494px]', 'w-full h-full max-h-[350px] sm:max-w-[494px] sm:max-h-[494px]', 'w-full h-full max-h-[350px] sm:max-w-[1040px] sm:max-h-[584.48px]', 'w-full h-full max-h-[350px] sm:max-w-[494px] sm:max-h-[494px]', 'w-full h-full max-h-[350px] sm:max-w-[494px] sm:max-h-[494px]']
			return this.photos.slice(0, this.displayLimit).map((photo, index) => ({
				src: photo.url,
				class: sizeClasses[index % sizeClasses.length],
			}))
		},
		groupedRows() {
			const rows = []
			const specialIndex = 6
			const contentTile = { type: 'content' }

			let i = 0
			let takeOne = true

			while (i < this.images.length) {
				if (i === specialIndex) {
					rows.push([this.images[i], contentTile])
					i += 1
					takeOne = true
					continue
				}

				const count = takeOne ? 1 : 2
				rows.push(this.images.slice(i, i + count))
				i += count
				takeOne = !takeOne
			}

			return rows
		},
	},
	methods: {
		loadMore() {
			this.displayLimit += 10
		},
	},
}
</script>
