<template>
	<div class="rounded-2xl bg-gradient-to-b from-black/10 to-transparent px-6 py-5 text-left text-white space-y-4">
		<!-- Platform + stars -->

		<div class="bg-belk-light-gray/10 rounded-xl p-[2px] w-fit flex items-center self-start">
			<!-- Platform Icon -->
			<div class="bg-black/10 rounded-full px-[6px] py-[2px] flex items-center">
				<img :src="platformIcon" alt="" class="w-4 h-4" />
			</div>
			<!-- Stars -->
			<div class="flex items-center gap-1 px-[6px] py-[3px]">
				<img v-for="i in 5" :key="i" src="/images/icon-star.svg" alt="" class="w-3 h-3" />
			</div>
		</div>

		<!-- Review text -->
		<p class="text-sm leading-relaxed text-white/80 line-clamp-10">"{{ review }}"</p>
		<button v-if="review && review.length > 400" @click="showFullReview = true" class="text-xs text-white/60 hover:text-white underline underline-offset-2">See All</button>

		<!-- Full Review Modal -->
		<div v-if="showFullReview" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showFullReview = false">
			<div class="bg-gray-900 rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
				<div class="flex justify-between items-start mb-4">
					<h3 class="text-lg font-semibold text-gray-900">{{ author }}</h3>
					<button @click="showFullReview = false" class="text-gray-300 hover:text-gray-600 text-xl">&times;</button>
				</div>
				<div class="flex items-center gap-1 mb-4">
					<img v-for="i in 5" :key="i" src="/images/icon-star.svg" alt="" class="w-4 h-4" />
				</div>
				<p class="text-gray-700 leading-relaxed">"{{ review }}"</p>
			</div>
		</div>

		<!-- Author -->
		<div class="mt-4 text-base font-semibold font-lobster text-white capitalize">
			{{ author }}
		</div>
	</div>
</template>

<script>
export default {
	name: 'ReviewCard',
	props: {
		platformIcon: String,
		review: String,
		author: String,
	},
	data() {
		return {
			showFullReview: false,
		}
	},
}
</script>
