import axios from 'axios'
import { readEntries, createEntry, updateEntry } from '@mango'
import settings from '@settings'

const API_BASE = 'https://api.companycam.com/v2'

export const projects = {
	metal: {
		name: '#Metal Roofs',
		category: 'Metal Roofing',
		id: '97144060',
	},
	shingle: {
		name: '#Shingle Roofs',
		category: 'Shingle Roofing',
		id: '97144263',
	},
	repairs: {
		name: '#Roof Repairs',
		category: 'Roof Repairs',
		id: '97144529',
	},
	flat: {
		name: '#Flat Roofs & Coating',
		category: 'Flat Roofing',
		id: '97144592',
	},
	renovation: {
		name: '#Home Renovation',
		category: 'Home Renovation',
		id: '97144761',
	},
	construction: {
		name: '#Construction Projects',
		category: 'Construction',
		id: '97144730',
	},
}

async function fetchFromCompanyCam(endpoint, params = {}) {
	const response = await axios.get(`${API_BASE}${endpoint}`, {
		params,
		headers: {
			Authorization: `Bearer ${settings.companyCamToken}`,
			'Content-Type': 'application/json',
		},
	})
	return response.data
}

export async function listProjects(params = {}) {
	return fetchFromCompanyCam('/projects', params)
}

export async function listProjectPhotos(projectId, params = {}) {
	return fetchFromCompanyCam(`/projects/${projectId}/photos`, params)
}

export async function listPhotos(params = {}) {
	return fetchFromCompanyCam('/photos', params)
}

export async function getPhoto(photoId) {
	return fetchFromCompanyCam(`/photos/${photoId}`)
}

async function syncPhotosFromProject(projectId) {
	const results = { created: 0, updated: 0, errors: [] }
	let page = 1
	let hasMore = true

	while (hasMore) {
		try {
			const photos = await listProjectPhotos(projectId, { page, per_page: 100 })

			if (!photos || photos.length === 0) {
				hasMore = false
				break
			}

			for (const photo of photos) {
				try {
					const existing = await readEntries({
						collection: 'photos',
						search: { photoId: photo.id },
						limit: 1,
					})

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

					if (existing && existing.length > 0) {
						await updateEntry({
							collection: 'photos',
							search: { photoId: photo.id },
							document,
						})
						results.updated++
					} else {
						await createEntry({
							collection: 'photos',
							document,
						})
						results.created++
					}
				} catch (err) {
					results.errors.push({ photoId: photo.id, error: err.message })
				}
			}

			page++
			if (photos.length < 100) {
				hasMore = false
			}
		} catch (err) {
			results.errors.push({ page, error: err.message })
			hasMore = false
		}
	}

	return results
}

export async function syncAllPhotos() {
	const results = { total: { created: 0, updated: 0, errors: [] }, byProject: {} }

	for (const [key, project] of Object.entries(projects)) {
		if (!project.id) {
			results.byProject[key] = { skipped: true, reason: 'No project ID configured' }
			continue
		}

		const projectResults = await syncPhotosFromProject(project.id)
		results.byProject[key] = projectResults
		results.total.created += projectResults.created
		results.total.updated += projectResults.updated
		results.total.errors.push(...projectResults.errors)
	}

	return results
}
