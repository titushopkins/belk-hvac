export default {
	permissions: {
		public: ['read'],
	},
	singular: 'review',
	fields: {
		authorName: String,
		authorUrl: String,
		language: String,
		originalLanguage: String,
		profilePhotoUrl: String,
		rating: Number,
		relativeTimeDescription: String,
		text: String,
		time: Date,
		translated: Boolean,
		source: String,
	},
}
