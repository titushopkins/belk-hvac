import { getMember, sendEmail, readEntries, countEntries } from '@mango'
import { syncReviews } from '../automation/syncReviews.js'
import { projects } from '../helpers/companyCam.js'

export default {
	'gallery-categories': {
		async get(req, res) {
			const categories = [{ key: 'all', label: 'All', count: 0 }]

			for (const [key, project] of Object.entries(projects)) {
				const count = await countEntries({
					collection: 'photos',
					search: { projectId: project.id },
				})
				categories.push({
					key,
					label: project.name.replace('#', ''),
					count,
				})
			}

			categories[0].count = categories.slice(1).reduce((sum, c) => sum + c.count, 0)

			return categories
		},
	},
	'gallery-photos': {
		async get(req, res) {
			const { category } = req.query
			let search = {}

			if (category && category !== 'all' && projects[category]) {
				search = { projectId: projects[category].id }
			}

			const allPhotos = await readEntries({
				collection: 'photos',
				search,
				limit: 500,
			})

			const photos = allPhotos.map((p) => ({
				photoId: p.photoId,
				projectId: p.projectId,
				url: p.uris?.find((u) => u.type === 'original')?.url || p.uris?.[0]?.url || '',
			}))

			if (!category || category === 'all') {
				const projectKeys = Object.keys(projects)
				const grouped = {}
				for (const key of projectKeys) {
					grouped[key] = photos.filter((p) => p.projectId === projects[key].id)
				}

				const mixed = []
				let hasMore = true
				while (hasMore) {
					hasMore = false
					for (const key of projectKeys) {
						if (grouped[key].length > 0) {
							mixed.push(grouped[key].shift())
							hasMore = true
						}
					}
				}
				return mixed
			}

			return photos
		},
	},
	'sync-reviews': {
		async get(req, res) {
			const member = await getMember(req)
			if (!member || !member.roles.includes('admin')) {
				res.status(403)
				return { error: 'Unauthorized' }
			}
			const results = await syncReviews()
			return results
		},
	},
	test: {
		async get(req) {
			return `Mango is online! 🥭`
		},
	},
	contact: {
		admin: {
			async post(req) {
				return `You hit /contact/admin with a post request`
			},
		},
		editor: {
			async get(req) {
				return `You hit /contact/editor with a get request`
			},
		},
		async post(req) {
			const { name, email, phone, quote, address } = req.body
			const formattedPhone = phone ? `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}` : 'Not provided'
			const isQuote = !!address

			const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
<tr>
<td align="center" style="padding: 40px 20px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">

<!-- Header -->
<tr>
<td style="background-color: #1a1a1a; padding: 32px 40px; text-align: center;">
<h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Jay Lott Roofing</h1>
<p style="margin: 8px 0 0; font-size: 14px; color: #a3a3a3;">${isQuote ? 'New Quote Request' : 'New Contact Message'}</p>
</td>
</tr>

<!-- Red accent bar -->
<tr>
<td style="background-color: #b91c1c; height: 4px;"></td>
</tr>

<!-- Content -->
<tr>
<td style="padding: 32px 40px;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
<tr>
<td style="padding-bottom: 24px; border-bottom: 1px solid #e5e5e5;">
<p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #737373;">Name</p>
<p style="margin: 0; font-size: 16px; font-weight: 600; color: #171717;">${name}</p>
</td>
</tr>
<tr>
<td style="padding: 24px 0; border-bottom: 1px solid #e5e5e5;">
<p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #737373;">Email</p>
<p style="margin: 0; font-size: 16px; color: #171717;"><a href="mailto:${email}" style="color: #171717; text-decoration: underline;">${email}</a></p>
</td>
</tr>
<tr>
<td style="padding: 24px 0; border-bottom: 1px solid #e5e5e5;">
<p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #737373;">Phone</p>
<p style="margin: 0; font-size: 16px; color: #171717;"><a href="tel:${phone}" style="color: #171717; text-decoration: underline;">${formattedPhone}</a></p>
</td>
</tr>
${
	isQuote
		? `
<tr>
<td style="padding: 24px 0; border-bottom: 1px solid #e5e5e5;">
<p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #737373;">Job Location</p>
<p style="margin: 0; font-size: 16px; font-weight: 500; color: #171717;">${address}</p>
</td>
</tr>
`
		: ''
}
<tr>
<td style="padding-top: 24px;">
<p style="margin: 0 0 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #737373;">Message</p>
<div style="background-color: #fafafa; border-radius: 6px; padding: 20px; border-left: 3px solid #b91c1c;">
<p style="margin: 0; font-size: 15px; line-height: 1.6; color: #171717; white-space: pre-wrap;">${quote}</p>
</div>
</td>
</tr>
</table>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background-color: #fafafa; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
<p style="margin: 0; font-size: 12px; color: #737373;">Sent from Jay Lott Roofing website</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>
			`

			await sendEmail({
				to: 'office@et-roofing.com',
				from: 'jay_lott_inquiries@hppth.com',
				subject: `${isQuote ? 'Quote Request' : 'Contact Message'} from ${name} - Jay Lott Roofing`,
				body: html,
			})

			return { success: true }
		},
	},
}
