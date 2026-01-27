import { syncAllPhotos, projects } from '../helpers/companyCam.js'
import { getMember, readEntries, createEntry, updateEntry, deleteEntry } from '@mango'

const projectIds = Object.values(projects).map((p) => p.id)

export default {
	hooks: {
		post: async (req, res) => {
			try {
				const { event_type, payload } = req.body
				const photo = payload?.photo

				if (!photo || !photo.project_id) {
					return { success: true, message: 'No photo or project_id in payload' }
				}

				if (!projectIds.includes(photo.project_id)) {
					return { success: true, message: 'Project not tracked' }
				}

				const document = {
					photoId: photo.id,
					projectId: photo.project_id,
					status: photo.status,
					uris: photo.uris?.map((u) => ({ type: u.type, uri: u.uri, url: u.url })) || [],
					hash: photo.hash,
					description: photo.description,
					capturedAt: photo.captured_at ? new Date(photo.captured_at * 1000) : null,
					createdAt: photo.created_at ? new Date(photo.created_at * 1000) : null,
					updatedAt: photo.updated_at ? new Date(photo.updated_at * 1000) : null,
				}

				const existing = await readEntries({
					collection: 'photos',
					search: { photoId: photo.id },
					limit: 1,
				})

				if (event_type === 'photo.deleted') {
					if (existing && existing.length > 0) {
						await deleteEntry({
							collection: 'photos',
							search: { photoId: photo.id },
						})
						res.status(204)
						return
					}
					res.status(404)
					return { success: false, message: 'Photo not found' }
				}

				if (event_type === 'photo.created' || event_type === 'photo.updated') {
					if (existing && existing.length > 0) {
						await updateEntry({
							collection: 'photos',
							search: { photoId: photo.id },
							document,
						})
						res.status(200)
						return { success: true, action: 'updated' }
					} else {
						await createEntry({
							collection: 'photos',
							document,
						})
						res.status(201)
						return { success: true, action: 'created' }
					}
				}
				res.status(400)
				return
			} catch (error) {
				console.error('CompanyCam webhook error:', error)
				res.status(500)
				return { success: false, error: error.message }
			}
		},
	},
	'sync-photos': {
		async get(req, res) {
			const member = await getMember(req)
			if (!member || !member.roles.includes('admin')) {
				res.status(403)
				return { error: 'Unauthorized' }
			}
			const results = await syncAllPhotos()
			return results
		},
	},
}
