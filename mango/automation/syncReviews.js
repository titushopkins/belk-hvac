import axios from 'axios'
import { readEntries, createEntry, updateEntry, sendEmail } from '@mango'
import settings from '@settings'

const GOOGLE_PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place/details/json'

async function fetchGoogleReviews() {
	const response = await axios.get(GOOGLE_PLACES_API_BASE, {
		params: {
			place_id: settings.jayLottPlaceId,
			fields: 'reviews,rating,user_ratings_total',
			key: settings.googlePlacesKey,
		},
	})
	return response.data
}

export async function syncReviews() {
	const results = { fetched: 0, created: 0, updated: 0 }

	try {
		const data = await fetchGoogleReviews()

		if (data.status !== 'OK' || !data.result?.reviews) {
			console.log('No reviews found or API error:', data.status)
			return results
		}

		const reviews = data.result.reviews
		results.fetched = reviews.length

		// Update reviewsMeta with overall rating and total count
		const existingMeta = await readEntries({
			collection: 'reviewsMeta',
			limit: 1,
		})

		const metaDocument = {
			rating: data.result.rating,
			userRatingsTotal: data.result.user_ratings_total,
		}

		if (existingMeta && existingMeta.length > 0) {
			await updateEntry({
				collection: 'reviewsMeta',
				search: { id: existingMeta[0].id },
				document: metaDocument,
			})
		} else {
			await createEntry({
				collection: 'reviewsMeta',
				document: metaDocument,
			})
		}

		for (const review of reviews) {
			const authorUrl = review.author_url

			const document = {
				authorName: review.author_name,
				authorUrl: review.author_url,
				language: review.language,
				originalLanguage: review.original_language,
				profilePhotoUrl: review.profile_photo_url,
				rating: review.rating,
				relativeTimeDescription: review.relative_time_description,
				text: review.text,
				time: new Date(review.time * 1000),
				translated: review.translated,
				source: 'google',
			}

			const existing = await readEntries({
				collection: 'reviews',
				search: { authorUrl },
				limit: 1,
			})

			if (existing && existing.length > 0) {
				await updateEntry({
					collection: 'reviews',
					search: { id: existing[0].id },
					document,
				})
				results.updated++
			} else {
				await createEntry({
					collection: 'reviews',
					document,
				})
				results.created++
			}
		}

		console.log(`Reviews sync complete: ${results.fetched} fetched, ${results.created} new, ${results.updated} updated`)
	} catch (err) {
		console.error('Error syncing reviews:', err.message)
		await sendEmail({
			to: 'nathan@hppth.com',
			from: 'admin@hppth.com',
			subject: 'Jay Lott Reviews Sync Error',
			body: `Reviews sync error: ${err.message || err}`,
		})
	}

	return results
}
