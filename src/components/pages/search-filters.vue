<template>
	<div class="w-full lg:-translate-y-32">
		<div class="w-full rounded-xl">
			<div class="space-y-4 sm:space-y-6">
				<div
					v-for="(row, rowIndex) in groupedRows"
					:key="rowIndex"
					class="grid gap-6"
					:class="row.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'"
				>
					<div
						v-for="(item, itemIndex) in row"
						:key="`${rowIndex}-${itemIndex}`"
						class="overflow-hidden rounded-lg"
					>
						<!-- IMAGE TILE -->
						<img
							v-if="item.type !== 'content'"
							:src="item.src"
							alt=""
							class="relative rounded-lg bg-center bg-no-repeat bg-cover"
							:class="item.class"
						/>

						<!-- CONTENT TILE (ONLY ONCE, NEXT TO 7TH IMAGE) -->
						<div
                          v-else
                          class="w-full h-full max-h-[350px] sm:max-w-[494px] sm:max-h-[494px] rounded-lg bg-gray-800 border border-belk-light-gray/40 shadow-sm flex"
                        >
                          <div class="flex w-full gap-2 pt-4">
                            <div class="pl-4 space-y-4">
                              <h3 class="text-3xl font-semibold text-gray-300">Need better <span class="font-lobster font-bold">comfort</span> in your home?</h3>
                              <p class="text-sm text-white pb-4">
                                Contact us now to schedule professional heating & cooling service!
                              </p>
                              <a href="/contact" class="text-xs text-white bg-belk-red rounded-full px-4 py-2">
                                Request Service
                              </a>

                              <div class="flex w-full justify-start items-start flex w-full h-auto md:items-end bottom-0 gap-4 pt-2">
                                <div class="flex flex-col gap-[1px] text-belk-light-gray/80">
                                  <img src="/images/stars.svg" class="w-[85px]" />
                                  <p class="text-xs">5 stars on Google</p>
                                </div>
                                <div class="flex flex-col gap-[2px] text-belk-light-gray/80">
                                  <p class="text-sm font-semibold">2,000+</p>
                                  <p class="text-xs">Satisfied customers</p>
                                </div>
                              </div>
                            </div>

                            <div class="flex w-full justify-end items-end bottom-0">
                              <img
                                src="/images/belk-cartoon.svg"
                                alt=""
                                class="w-auto h-full max-h-80 sm:max-h-[400px] rounded-tl-[80px]"
                              />
                            </div>
                          </div>
                        </div>
						<!-- END CONTENT TILE -->
					</div>
				</div>
			</div>
		</div>

		<!-- LOAD MORE / SHOW LESS -->
		<div v-if="showToggleButton" class="mb-1 mt-12 flex justify-center items-end">
			<button @click="toggleImages" class="px-3 py-2 rounded-md bg-belk-red text-white text-sm font-semibold">
				{{ expanded ? 'Show Less' : 'Load More' }}
			</button>
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
			initialLimit: 10,
			displayLimit: 10,
			expanded: false,
		}
	},
	watch: {
		photos() {
			this.displayLimit = this.initialLimit
			this.expanded = false
		},
	},
	computed: {
		// show the button only if there are more than 14 images total
		showToggleButton() {
			return this.photos.length > this.initialLimit
		},

		// list of image srcs (no classes here)
		images() {
			return this.photos.slice(0, this.displayLimit).map((photo) => ({
				src:
					photo.url ||
					photo.src ||
					photo.image ||
					photo.imageUrl ||
					photo.photoUrl ||
					photo.path ||
					photo.file?.url ||
					'',
			}))
		},

		// Keep your exact rhythm forever + assign BIG/SMALL correctly
		groupedRows() {
			const BIG =
				'object-center object-cover w-full h-full max-h-[350px] sm:max-w-[1040px] sm:max-h-[584.48px]'
			const SMALL =
				'object-center object-cover w-full h-full max-h-[350px] sm:max-w-[494px] sm:max-h-[494px]'

			const rows = []
			const specialIndex = 6
			const contentTile = { type: 'content' }

			let i = 0
			let takeOne = true

			while (i < this.images.length) {
				// Special row: image + content (image should be SMALL)
				if (i === specialIndex) {
					rows.push([{ ...this.images[i], class: SMALL }, contentTile])
					i += 1
					takeOne = true
					continue
				}

				const count = takeOne ? 1 : 2

				if (count === 1) {
					rows.push([{ ...this.images[i], class: BIG }])
					i += 1
				} else {
					const pair = this.images.slice(i, i + 2).map((img) => ({
						...img,
						class: SMALL,
					}))
					rows.push(pair)
					i += 2
				}

				takeOne = !takeOne
			}

			return rows
		},
	},
	methods: {
		toggleImages() {
			if (this.expanded) {
				// show less
				this.displayLimit = this.initialLimit
				this.expanded = false
			} else {
				// load all
				this.displayLimit = this.photos.length
				this.expanded = true
			}
		},
	},
}
</script>
