<template>
	<div class="w-full tracking-wide pl-2 pr-6 space-y-4">
		<div class="lg:hidden text-lg font-semibold text-white m-auto whitespace-nowrap">Gallery Categories</div>

		<!-- Gallery Categories -->
		<div class="-translate-y-2">
			<div v-for="category in galleryCategories" :key="category.key">
				<button
					type="button"
					@click="selectCategory(category.key)"
					:class="selectedGalleryCategory === category.key ? 'border-b border-belk-teal' : 'border-b border-belk-light-gray/60'"
					class="w-full flex items-center justify-between py-3 text-left"
				>
					<!-- Name -->
					<span
						class="text-sm"
						:class="selectedGalleryCategory === category.key ? 'text-belk-teal font-semibold' : 'text-gray-300/70 font-medium hover:text-gray-300'"
					>
						{{ category.label }}
					</span>

					<!-- Count pill -->
					<span
						class="min-w-[52px] text-center text-xs font-semibold rounded-full px-3 py-1"
						:class="selectedGalleryCategory === category.key ? 'bg-belk-teal text-white' : 'bg-belk-light-gray/60 text-gray-300/70'"
					>
						{{ category.count }}
					</span>
				</button>
			</div>
		</div>

		<!-- Sticky footer -->
		<div class="flex w-full bottom-0 z-20">
			<div class="bg-gray-900 py-8 px-6 w-full rounded-t-xl">
				<button
					type="button"
					@click="resetFilters"
					:disabled="!isFilterActive"
					class="flex items-center justify-center text-sm py-3 uppercase tracking-widest px-4 w-full rounded-md transition duration-300"
					:class="isFilterActive ? 'bg-roofing-red hover:bg-belk-teal/50 text-white cursor-pointer' : 'bg-transparent opacity-50 text-belk-gray cursor-not-allowed border border-belk-gray'"
				>
					Reset Filters
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	inject: ['store'],
	emits: ['category-change'],
	data() {
		return {
			selectedGalleryCategory: 'all',
			galleryCategories: [],
		}
	},
	computed: {
		isFilterActive() {
			return this.selectedGalleryCategory !== 'all'
		},
	},
	async mounted() {
		await this.fetchCategories()
	},
	methods: {
		async fetchCategories() {
			try {
				const response = await axios.get(`${this.store.api}/endpoints/gallery-categories`)

				// ✅ EDIT: handle either an array response or an object like { data: [...] }
				this.galleryCategories = Array.isArray(response.data) ? response.data : (response.data?.data || [])

				// optional debug (remove later)
				console.log('gallery-categories response:', response.data)
			} catch (err) {
				console.error('Failed to fetch categories:', err)
			}
		},
		selectCategory(key) {
			this.selectedGalleryCategory = key
			this.$emit('category-change', key)
		},
		resetFilters() {
			if (!this.isFilterActive) return
			this.selectedGalleryCategory = 'all'
			this.$emit('category-change', 'all')
		},
	},
}
</script>
