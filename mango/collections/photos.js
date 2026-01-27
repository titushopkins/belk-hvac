export default {
	permissions: {
		public: ['read'],
	},
	singular: 'photo',
	fields: {
		photoId: String,
		projectId: String,
		status: String,
		uris: {
			fields: {
				type: String,
				uri: String,
				url: String,
			},
		},
		hash: String,
		description: String,
		capturedAt: Date,
		createdAt: Date,
		updatedAt: Date,
	},
}
