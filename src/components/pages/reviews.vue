<template>
	<section class="relative w-full overflow-hidden bg-roofing-teal py-20 md:py-32">
		<!-- Big background quote (top-right) -->
		<div class="pointer-events-none absolute -top-8 right-0 opacity-10 select-none">
			<img src="/images/icon-quote-large.svg" alt="" class="w-44 h-44 sm:w-96 sm:h-96 lg:w-[32rem] lg:h-[32rem] object-contain opacity-40" />
		</div>

		<!-- Header -->
		<div class="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center gap-2">
			<img src="/images/icon-quote.svg" alt="" class="w-10 h-10 sm:w-12 sm:h-12 mb-1 opacity-90" />

			<h2 class="font-lobster font-semibold italic text-2xl sm:text-4xl leading-tight text-white">What our customers are saying.</h2>

			<div class="flex items-center gap-3 text-xs sm:text-sm text-white/90">
				<span>{{ reviewMeta?.rating || 5 }} stars on Google</span>
				<span class="w-1 h-1 rounded-full bg-gray-900/30"></span>
				<a href="https://www.google.com/search?q=jay+lott+roofing#lrd=0x86399f82a9736a65:0x691feea0c74b27,1" target="_blank" class="underline underline-offset-4 hover:no-underline">See More on Google</a>
				<!-- <span class="w-1 h-1 rounded-full bg-gray-900/30"></span>
				<button @click="showReviewForm = true" class="underline underline-offset-4 hover:no-underline">Leave a Review</button> -->
			</div>

			<!-- Review Form Modal -->
			<div v-if="showReviewForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showReviewForm = false">
				<div class="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
					<h3 class="text-xl font-semibold text-gray-900 mb-4">Leave a Review</h3>
					<form @submit.prevent="submitReview">
						<div class="mb-4">
							<label class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
							<input v-model="newReview.authorName" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-roofing-teal" />
						</div>
						<div class="mb-4">
							<label class="block text-sm font-medium text-gray-700 mb-1">Rating</label>
							<div class="flex gap-1">
								<button v-for="star in 5" :key="star" type="button" @click="newReview.rating = star" class="text-2xl" :class="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'">★</button>
							</div>
						</div>
						<div class="mb-4">
							<label class="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
							<textarea v-model="newReview.text" required rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-roofing-teal"></textarea>
						</div>
						<div class="flex gap-3 justify-end">
							<button type="button" @click="showReviewForm = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
							<button type="submit" :disabled="submitting" class="px-4 py-2 bg-roofing-teal text-white rounded-md hover:bg-roofing-teal/90 disabled:opacity-50">
								{{ submitting ? 'Submitting...' : 'Submit Review' }}
							</button>
						</div>
					</form>
					<p v-if="submitSuccess" class="mt-4 text-green-600 text-sm">Thank you for your review!</p>
					<p v-if="submitError" class="mt-4 text-red-600 text-sm">{{ submitError }}</p>
				</div>
			</div>
		</div>

		<!-- Reviews grid (2 rows, staggered like the screenshot) -->
		<div class="relative z-10 mx-auto mt-14 w-full">
			<div class="space-y-10">
				<!-- Row 1 (4 cards) -->
				<div class="w-full">
					<div class="mx-auto flex w-full flex-nowrap justify-center gap-6 pb-2">
						<div v-for="(r, idx) in reviewsRow1" :key="`reviews-row1-${idx}`" class="shrink-0 w-[300px]">
							<ReviewCard :platform-icon="r.platformIcon" :review="r.review" :author="r.author" />
						</div>
					</div>
				</div>

				<!-- Row 2 (5 cards) -->
				<div class="w-full">
					<div class="mx-auto flex w-full flex-nowrap justify-center gap-6 pb-2">
						<div v-for="(r, idx) in reviewsRow2" :key="`reviews-row2-${idx}`" class="shrink-0 w-[300px]">
							<ReviewCard :platform-icon="r.platformIcon" :review="r.review" :author="r.author" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import ReviewCard from '../review-card.vue'

export default {
	components: {
		ReviewCard,
	},

	data() {
		return {
			reviews: [],
			reviewMeta: null,
			showReviewForm: false,
			submitting: false,
			submitSuccess: false,
			submitError: null,
			newReview: {
				authorName: '',
				rating: 5,
				text: '',
			},
		}
	},

	computed: {
		formattedReviews() {
			return this.reviews.map((r) => ({
				platformIcon: r.source === 'google' ? '/images/icon-google.svg' : '/images/icon-review.svg',
				review: r.text,
				author: r.authorName,
			}))
		},
		reviewsRow1() {
			return this.formattedReviews.slice(0, Math.ceil(this.formattedReviews.length / 2))
		},
		reviewsRow2() {
			return this.formattedReviews.slice(Math.ceil(this.formattedReviews.length / 2))
		},
	},

	methods: {
		async submitReview() {
			this.submitting = true
			this.submitError = null
			this.submitSuccess = false

			try {
				await this.$mango.reviews.save({
					authorName: this.newReview.authorName,
					rating: this.newReview.rating,
					text: this.newReview.text,
					time: new Date(),
					source: 'website',
				})

				this.submitSuccess = true
				this.newReview = { authorName: '', rating: 5, text: '' }

				// Refresh reviews list
				this.reviews = await this.$mango.reviews({ limit: 20, sort: { time: -1 } })

				setTimeout(() => {
					this.showReviewForm = false
					this.submitSuccess = false
				}, 2000)
			} catch (err) {
				this.submitError = 'Failed to submit review. Please try again.'
			} finally {
				this.submitting = false
			}
		},
	},

	async mounted() {
		const [reviews, reviewsMeta] = await Promise.all([this.$mango.reviews({ limit: 20, sort: { time: -1 } }), this.$mango.reviewsMeta({ limit: 1 })])
		this.reviews = reviews
		this.reviewMeta = reviewsMeta?.[0] || null
	},
}
</script>
