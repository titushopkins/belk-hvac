<template>
	<div class="flex w-full justify-center items-center p-6 pt-0">
		<div class="w-full max-w-6xl xl:max-w-8xl space-y-6">
			<!-- Top controls -->
			<div class="flex flex-col md:flex-row space-y-4 md:space-y-0 w-full justify-between my-6">
				<!-- Sort By -->
				<div class="flex w-full text-lg font-semibold text-roofing-dark-gray mr-4 m-auto whitespace-nowrap">Gallery Categories</div>

				<!-- Mobile Filters Button -->
				<div id="filters-button" class="flex w-full max-w-xs lg:hidden">
					<button class="group flex-row w-full m-auto items-center justify-center text-center text-sm font-semibold text-roofing-dark-gray hover:text-white border-4 border-roofing-teal px-4 py-3 rounded-lg hover:bg-roofing-teal duration-100" @click="showFilters = true" type="button">
						<div class="inline-flex items-center m-auto gap-x-3 mt-1.5">
							<svg class="w-5 font-bold fill-roofing-dark-gray group-hover:fill-white rotate-90" viewBox="0 0 1024 1024">
								<path d="M640 288a64 64 0 1 1 0.032-128.032A64 64 0 0 1 640 288z m123.456-96c-14.304-55.04-64-96-123.456-96s-109.152 40.96-123.456 96H128v64h388.544c14.304 55.04 64 96 123.456 96s109.152-40.96 123.456-96H896V192h-132.544zM640 864a64 64 0 1 1 0.032-128.032A64 64 0 0 1 640 864m0-192c-59.456 0-109.152 40.96-123.456 96H128v64h388.544c14.304 55.04 64 96 123.456 96s109.152-40.96 123.456-96H896v-64h-132.544c-14.304-55.04-64-96-123.456-96M384 576a64 64 0 1 1 0.032-128.032A64 64 0 0 1 384 576m0-192c-59.456 0-109.152 40.96-123.456 96H128v64h132.544c14.304 55.04 64 96 123.456 96s109.152-40.96 123.456-96H896v-64H507.456c-14.304-55.04-64-96-123.456-96" />
							</svg>
							<span>Filters</span>
						</div>
					</button>
				</div>
			</div>

			<!-- Mobile overlay + slide-in panel -->
			<div class="h-screen fixed top-0 left-0 z-50 select-none w-full bg-roofing-dark-gray/60 backdrop-blur-sm transform transition-transform duration-300 -translate-y-6" :class="showFilters ? 'translate-x-0' : '-translate-x-full'" @click="showFilters = false">
				<div class="flex w-full justify-start h-full">
					<div class="w-full max-w-[360px] bg-white xs:rounded-r-xl flex flex-col rounded-r-lg" @click.stop>
						<!-- Header -->
						<div class="flex w-full p-6 bg-roofing-gray items-center sticky top-0">
							<button class="text-white flex w-full justify-start text-start text-base" @click="showFilters = false" type="button">Back</button>

							<div class="flex w-full justify-end">
								<button @click="showFilters = false" class="group w-4 h-4 justify-around flex text-xl py-4 rounded-full" type="button">
									<div class="m-auto items-center flex w-full justify-center">
										<div class="rotate-45 absolute bg-white py-px rounded px-2"></div>
										<div class="-rotate-45 bg-white py-px rounded px-2"></div>
									</div>
								</button>
							</div>
						</div>

						<!-- Filters content -->
						<div class="flex-1 overflow-y-auto overflow-x-hidden p-4">
							<AddedFilters @category-change="onCategoryChange" />
						</div>
					</div>
				</div>
			</div>

			<!-- Desktop + results layout -->
			<div class="flex w-full gap-6 lg:-translate-y-6">
				<!-- Desktop filters -->
				<div class="hidden lg:block w-full max-w-[280px]">
					<AddedFilters @category-change="onCategoryChange" />
				</div>

				<!-- Results -->
				<div class="w-full max-w-[1040px] min-h-[600px]">
					<div :class="{ 'opacity-50 pointer-events-none': loading }">
						<SearchFilters :photos="photos" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import AddedFilters from './added-filters.vue'
import SearchFilters from './search-filters.vue'

export default {
	inject: ['store'],
	components: { AddedFilters, SearchFilters },
	data() {
		return {
			showFilters: false,
			photos: [],
			loading: true,
			selectedCategory: 'all',
		}
	},
	async mounted() {
		await this.fetchPhotos()
	},
	methods: {
		async fetchPhotos() {
			try {
				this.loading = true
				const response = await axios.get(`${this.store.api}/endpoints/gallery-photos`, {
					params: { category: this.selectedCategory },
				})
				this.photos = response.data
			} catch (err) {
				console.error('Failed to fetch photos:', err)
			} finally {
				this.loading = false
			}
		},
		async onCategoryChange(category) {
			this.selectedCategory = category
			await this.fetchPhotos()
		},
	},
}
</script>
