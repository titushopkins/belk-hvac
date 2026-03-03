/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../mango/automation/index.js"
/*!***************************************!*\
  !*** ../../mango/automation/index.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _syncReviews_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./syncReviews.js */ "../../mango/automation/syncReviews.js");


let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

Date.prototype.monthDays = function () {
	var d = new Date(this.getFullYear(), this.getMonth() + 1, 0)
	return d.getDate()
}

let startAutomations = function () {
	// let now = new Date()

	// console.log('starting!')

	setInterval(() => {
		// Optional timezone offset for server
		let now = new Date(Date.now() - 1000 * 60 * 60 * 6)

		let day = now.getDay()
		let weekday = days[day]
		let date = now.getDate()
		let month = now.getMonth()

		let hour = now.getHours()
		let minute = now.getMinutes()

		let monthDays = now.monthDays()
		let nthWeekdayOfMonth = Math.ceil(day / 7)
		let daysRemainingInMonth = monthDays - date
		let lastWeekdayOfMonth = daysRemainingInMonth < 7

		// Automations to run (cron)
		// if ((weekday == 'Thursday' || weekday == 'Friday') && hour == 8 && minute == 1) doSomethingCool()

		// Sync Google reviews twice daily at 8am and 8pm
		if ((hour == 8 || hour == 20) && minute == 0) (0,_syncReviews_js__WEBPACK_IMPORTED_MODULE_0__.syncReviews)()
	}, 1000 * 60)
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (startAutomations);


/***/ },

/***/ "../../mango/automation/syncReviews.js"
/*!*********************************************!*\
  !*** ../../mango/automation/syncReviews.js ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   syncReviews: () => (/* binding */ syncReviews)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mango__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mango */ "./src/cms/exports.js");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @settings */ "../../mango/config/settings.json");




const GOOGLE_PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place/details/json'

async function fetchGoogleReviews() {
	const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(GOOGLE_PLACES_API_BASE, {
		params: {
			place_id: _settings__WEBPACK_IMPORTED_MODULE_2__.belkHvacPlaceId,
			fields: 'reviews,rating,user_ratings_total',
			key: _settings__WEBPACK_IMPORTED_MODULE_2__.googlePlacesKey,
		},
	})
	return response.data
}

async function syncReviews() {
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
		const existingMeta = await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.readEntries)({
			collection: 'reviewsMeta',
			limit: 1,
		})

		const metaDocument = {
			rating: data.result.rating,
			userRatingsTotal: data.result.user_ratings_total,
		}

		if (existingMeta && existingMeta.length > 0) {
			await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.updateEntry)({
				collection: 'reviewsMeta',
				search: { id: existingMeta[0].id },
				document: metaDocument,
			})
		} else {
			await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.createEntry)({
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

			const existing = await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.readEntries)({
				collection: 'reviews',
				search: { authorUrl },
				limit: 1,
			})

			if (existing && existing.length > 0) {
				await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.updateEntry)({
					collection: 'reviews',
					search: { id: existing[0].id },
					document,
				})
				results.updated++
			} else {
				await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.createEntry)({
					collection: 'reviews',
					document,
				})
				results.created++
			}
		}

		console.log(`Reviews sync complete: ${results.fetched} fetched, ${results.created} new, ${results.updated} updated`)
	} catch (err) {
		console.error('Error syncing reviews:', err.message)
		await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.sendEmail)({
			to: 'nathan@hppth.com',
			from: 'admin@hppth.com',
			subject: 'Jay Lott Reviews Sync Error',
			body: `Reviews sync error: ${err.message || err}`,
		})
	}

	return results
}


/***/ },

/***/ "../../mango/collections sync recursive .*\\.js$"
/*!*********************************************!*\
  !*** ../../mango/collections/ sync .*\.js$ ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./examples.js": "../../mango/collections/examples.js",
	"./photos.js": "../../mango/collections/photos.js",
	"./reviews.js": "../../mango/collections/reviews.js",
	"./reviewsMeta.js": "../../mango/collections/reviewsMeta.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "../../mango/collections sync recursive .*\\.js$";

/***/ },

/***/ "../../mango/collections/examples.js"
/*!*******************************************!*\
  !*** ../../mango/collections/examples.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @fields */ "./src/cms/1. build/fields/index.js");
/*
    This is an example collection. It will inherit its name
    from the filename for the plural of this collection type
    (examples)

    The singular should be defined on the root of the export
    or it will be declared as `singularExamples` by default.

    There should also be a `fields` attribute on the root
    which contains all of the fields in the collection.
    Custom fields can be imported directly, and default fields
    can be imported from the CMS.
*/


let { Relationship, Image } = _fields__WEBPACK_IMPORTED_MODULE_0__["default"]

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    permissions: {
        public: ['create', 'read', 'update', 'delete'],
    },
    singular: 'example',
    fields: {
        someData: String,
        anotherField: 'Int',
        anArrayOfInts: ['Int'],
        image: Image({ width: 500 }),
        /* Relationships require that you specify the singular form
        of the collection that you're relating to */
        exampleRelationship: Relationship({ collection: 'example' }),
        /* This is an example of a `complexField`, just think of it
        as a nested object structured the same way as a collection
        with the `fields` attribute. */
        someLegitData: {
            fields: {
                coordinates: {
                    x: 'Int',
                    y: 'Int'
                }
            }
        },
        /* There are also some sweet things like computed fields.
        There are some cool caching options for computed fields you
        can lookup in the docs */
        productOfXY: {
            computed: doc => doc.someLegitData?.coordinates?.x * doc.someLegitData?.coordinates?.y
        },
        /* Sometimes you might want to store a different type of data
        than you're taking in. There are some cool field options to help
        with this */
        vimeo: {
            inputType: 'Int',
            fields: {
                id: 'Int',
                url: 'String'
            },
            translateInput: input => ({ id: input, url: `https://vimeo.com/${input}` })
        }
    }
});


/***/ },

/***/ "../../mango/collections/photos.js"
/*!*****************************************!*\
  !*** ../../mango/collections/photos.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
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
});


/***/ },

/***/ "../../mango/collections/reviews.js"
/*!******************************************!*\
  !*** ../../mango/collections/reviews.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
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
});


/***/ },

/***/ "../../mango/collections/reviewsMeta.js"
/*!**********************************************!*\
  !*** ../../mango/collections/reviewsMeta.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	permissions: {
		public: ['read'],
	},
	singular: 'reviewMeta',
	fields: {
		rating: Number,
		userRatingsTotal: Number,
	},
});


/***/ },

/***/ "../../mango/config/globalFields.js"
/*!******************************************!*\
  !*** ../../mango/config/globalFields.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cms_1_build_fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cms/1. build/fields */ "./src/cms/1. build/fields/index.js");

let { PlainText, Select, Timestamp, Relationship } = _cms_1_build_fields__WEBPACK_IMPORTED_MODULE_0__["default"]

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({

    // title: PlainText({ required: true }),
    author: Relationship({ collection: 'member', single: true, computed: (doc, req) => [req?.member?.id] || 0 }),
    editId: { computed: (doc, req) => req?.member?.id || null },
    created: { computed: doc => doc.created || new Date, type: 'Float' },
    updated: { computed: doc => doc.updated ? new Date : doc.created, type: 'Float' },
    slug: { computed: doc => doc?.title?.toLowerCase()?.trim()?.replace(/[^a-zA-Z0-9\s]/g, '')?.replace(/\s/g, '-') },
    startDate: Timestamp(),
    endDate: Timestamp(),

});


/***/ },

/***/ "../../mango/config/settings.json"
/*!****************************************!*\
  !*** ../../mango/config/settings.json ***!
  \****************************************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"port":6446,"frontPort":6445,"siteName":"jay-lott","siteDomain":"jay.hppth.com","mangoDomain":"jay-api.hppth.com","mangoThreads":2,"maxPoolSize":10,"minPoolSize":0,"maxIdleTimeMS":60000,"waitQueueTimeoutMS":5000,"useDevAPI":true,"mongoURI":"mongodb://127.0.0.1:27017","serverIp":"64.225.4.239","database":"jaylott","s3AccessKeyId":null,"s3AccessKeySecret":null,"s3Region":null,"s3Bucket":"jaylott","emailProvider":"resend","resendKey":"re_PNTodFwQ_KLWpFFi9ZYFejsNEuY8NCQMY","mailgunKey":null,"mailgunDomain":null,"googlePlacesKey":"AIzaSyAtDpgHgaew2Qws-MLISX8phDj3VYgRebo","jayLottPlaceId":"ChIJZWpzqYKfOYYRJ0vHoO4faQA","belkHvacPlaceId":"ChIJrXRNC-HnWoYRNoiwMPCgorg","algoliaAppId":null,"algoliaSearchKey":null,"algoliaIndex":null,"corsOrigins":"*","license":"admin","companyCamToken":"BGWufZNVP4gHgYqxgiAx6lgIzDCFl0ZJhvdsMuUH8M0"}');

/***/ },

/***/ "../../mango/config/users.js"
/*!***********************************!*\
  !*** ../../mango/config/users.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cms/1. build/libraries/mongo */ "./src/cms/1. build/libraries/mongo.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	fields: {
		firstName: String,
		lastName: String,
		title: {
			required: false,
			type: String,
		},
	},
	families: {
		contributors: { singular: 'contributor' },
		editors: { singular: 'editor' },
	},
	hooks: {
		async created({ document }) {
			let members = await (0,_cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntries)({ collection: 'members' })
			if (members.length == 1 && members[0].id == document.id) {
				document.roles = ['admin']
				document.authorId = document.id
				document.author = document.id

				await (0,_cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.updateEntry)({
					collection: 'members',
					document: {
						roles: ['admin'],
						author: [document.id],
						authorId: document.id,
					},
					search: { id: document.id },
				})
			}
		},
	},
});


/***/ },

/***/ "../../mango/endpoints sync recursive .*\\.js$"
/*!*******************************************!*\
  !*** ../../mango/endpoints/ sync .*\.js$ ***!
  \*******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./companyCam.js": "../../mango/endpoints/companyCam.js",
	"./index.js": "../../mango/endpoints/index.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "../../mango/endpoints sync recursive .*\\.js$";

/***/ },

/***/ "../../mango/endpoints/companyCam.js"
/*!*******************************************!*\
  !*** ../../mango/endpoints/companyCam.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_companyCam_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/companyCam.js */ "../../mango/helpers/companyCam.js");
/* harmony import */ var _mango__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mango */ "./src/cms/exports.js");



const projectIds = Object.values(_helpers_companyCam_js__WEBPACK_IMPORTED_MODULE_0__.projects).map((p) => p.id)

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
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

				const existing = await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.readEntries)({
					collection: 'photos',
					search: { photoId: photo.id },
					limit: 1,
				})

				if (event_type === 'photo.deleted') {
					if (existing && existing.length > 0) {
						await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.deleteEntry)({
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
						await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.updateEntry)({
							collection: 'photos',
							search: { photoId: photo.id },
							document,
						})
						res.status(200)
						return { success: true, action: 'updated' }
					} else {
						await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.createEntry)({
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
			const member = await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.getMember)(req)
			if (!member || !member.roles.includes('admin')) {
				res.status(403)
				return { error: 'Unauthorized' }
			}
			const results = await (0,_helpers_companyCam_js__WEBPACK_IMPORTED_MODULE_0__.syncAllPhotos)()
			return results
		},
	},
});


/***/ },

/***/ "../../mango/endpoints/index.js"
/*!**************************************!*\
  !*** ../../mango/endpoints/index.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mango__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @mango */ "./src/cms/exports.js");
/* harmony import */ var _automation_syncReviews_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../automation/syncReviews.js */ "../../mango/automation/syncReviews.js");
/* harmony import */ var _helpers_companyCam_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/companyCam.js */ "../../mango/helpers/companyCam.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	'gallery-categories': {
		async get(req, res) {
			const categories = [{ key: 'all', label: 'All', count: 0 }]

			for (const [key, project] of Object.entries(_helpers_companyCam_js__WEBPACK_IMPORTED_MODULE_2__.projects)) {
				const count = await (0,_mango__WEBPACK_IMPORTED_MODULE_0__.countEntries)({
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

			if (category && category !== 'all' && _helpers_companyCam_js__WEBPACK_IMPORTED_MODULE_2__.projects[category]) {
				search = { projectId: _helpers_companyCam_js__WEBPACK_IMPORTED_MODULE_2__.projects[category].id }
			}

			const allPhotos = await (0,_mango__WEBPACK_IMPORTED_MODULE_0__.readEntries)({
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
				const projectKeys = Object.keys(_helpers_companyCam_js__WEBPACK_IMPORTED_MODULE_2__.projects)
				const grouped = {}
				for (const key of projectKeys) {
					grouped[key] = photos.filter((p) => p.projectId === _helpers_companyCam_js__WEBPACK_IMPORTED_MODULE_2__.projects[key].id)
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
			const member = await (0,_mango__WEBPACK_IMPORTED_MODULE_0__.getMember)(req)
			if (!member || !member.roles.includes('admin')) {
				res.status(403)
				return { error: 'Unauthorized' }
			}
			const results = await (0,_automation_syncReviews_js__WEBPACK_IMPORTED_MODULE_1__.syncReviews)()
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
<h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Belk Heating & Cooling</h1>
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
<p style="margin: 0; font-size: 12px; color: #737373;">Sent from Belk Heating & Cooling website</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>
			`

			await (0,_mango__WEBPACK_IMPORTED_MODULE_0__.sendEmail)({
				to: 'belkheatingandcooling@gmail.com',
				from: 'jay_lott_inquiries@hppth.com',
				subject: `${isQuote ? 'Quote Request' : 'Contact Message'} from ${name} - Belk Heating & Cooling`,
				body: html,
			})

			return { success: true }
		},
	},
});


/***/ },

/***/ "../../mango/fields sync recursive .*\\.js$"
/*!****************************************!*\
  !*** ../../mango/fields/ sync .*\.js$ ***!
  \****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./vimeo.js": "../../mango/fields/vimeo.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "../../mango/fields sync recursive .*\\.js$";

/***/ },

/***/ "../../mango/fields/vimeo.js"
/*!***********************************!*\
  !*** ../../mango/fields/vimeo.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

const apiKey = 'YOUR-VIMEO-API-KEY'

const getVideoThumbnail = async function (video) {
    let videoData = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(`https://vimeo.com/api/v2/video/${video.id}.json`)
    return videoData?.data?.[0]?.thumbnail_large
}

// const getDownloadLink = async function(video) {
//     let url = `https://api.vimeo.com/videos/${video.id}?access_token=${apiKey}`
//     let videoData = await axios.get(url)
//     videoData = videoData?.data?.download?.filter(download => download?.quality != 'source')
//     let bestDownload = videoData.reduce((challenger, champ) => challenger.height > champ.height ? challenger : champ, videoData[0])
//     return bestDownload?.link
// }

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    type: 'Vimeo',
    inputType: String,
    fields: {
        id: {},
        url: {},
        thumbnail: {
            computed: getVideoThumbnail,
            expireCache: 60 * 60 * 24 * 30
        },
        // download: {
        //     computed: getDownloadLink,
        //     expireCache: 60*60*24*1
        // },
    },
    translateInput: input => ({
        id: `${input}`,
        url: `https://vimeo.com/${input}`,
    })
});


/***/ },

/***/ "../../mango/helpers/companyCam.js"
/*!*****************************************!*\
  !*** ../../mango/helpers/companyCam.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPhoto: () => (/* binding */ getPhoto),
/* harmony export */   listPhotos: () => (/* binding */ listPhotos),
/* harmony export */   listProjectPhotos: () => (/* binding */ listProjectPhotos),
/* harmony export */   listProjects: () => (/* binding */ listProjects),
/* harmony export */   projects: () => (/* binding */ projects),
/* harmony export */   syncAllPhotos: () => (/* binding */ syncAllPhotos)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mango__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mango */ "./src/cms/exports.js");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @settings */ "../../mango/config/settings.json");




const API_BASE = 'https://api.companycam.com/v2'

const projects = {
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
	const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(`${API_BASE}${endpoint}`, {
		params,
		headers: {
			Authorization: `Bearer ${_settings__WEBPACK_IMPORTED_MODULE_2__.companyCamToken}`,
			'Content-Type': 'application/json',
		},
	})
	return response.data
}

async function listProjects(params = {}) {
	return fetchFromCompanyCam('/projects', params)
}

async function listProjectPhotos(projectId, params = {}) {
	return fetchFromCompanyCam(`/projects/${projectId}/photos`, params)
}

async function listPhotos(params = {}) {
	return fetchFromCompanyCam('/photos', params)
}

async function getPhoto(photoId) {
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
					const existing = await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.readEntries)({
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
						await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.updateEntry)({
							collection: 'photos',
							search: { photoId: photo.id },
							document,
						})
						results.updated++
					} else {
						await (0,_mango__WEBPACK_IMPORTED_MODULE_1__.createEntry)({
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

async function syncAllPhotos() {
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


/***/ },

/***/ "../../mango/hooks sync recursive .*\\.js$"
/*!***************************************!*\
  !*** ../../mango/hooks/ sync .*\.js$ ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./subscribe.js": "../../mango/hooks/subscribe.js",
	"./test.js": "../../mango/hooks/test.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "../../mango/hooks sync recursive .*\\.js$";

/***/ },

/***/ "../../mango/hooks/subscribe.js"
/*!**************************************!*\
  !*** ../../mango/hooks/subscribe.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   subscribe: () => (/* binding */ subscribe)
/* harmony export */ });
const subscribe = ({ io, collection, document, request, individual, originalDocument }) => {
    let method = request.method
    if (collection.subscribe && method != 'read' && individual) {

        const subscription = io.of(collection.name);

        // Send to the id and the author id
        let payload = method == 'delete' ? originalDocument : document
        subscription.to(request.member?.id).emit(`${collection.name}:${method}d`, payload);
        subscription.to((document?.id||originalDocument?.id)).emit(`${collection.name}:${method}d`, payload);

        // Send to each custom room
        for (let room of (collection.subscribe?.rooms||[])) {
            let keys = room.split('.')
            let target = document
            for (let key of keys) target = target[key]
            console.log(document, keys)
            let roomId = target
            console.log('attempting to emit to', collection.name, roomId, `${collection.name}:${method}d`)
            subscription.to(roomId).emit(`${collection.name}:${method}d`, payload);
        }
    }
}




/***/ },

/***/ "../../mango/hooks/test.js"
/*!*********************************!*\
  !*** ../../mango/hooks/test.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exampleHook: () => (/* binding */ exampleHook)
/* harmony export */ });
const exampleHook = () => {
    console.log(`Hey, I'm the result of an example hook running! (You can find me at ${"file:///Users/titushopkins/Downloads/belk-hvac/belk/mango/hooks/test.js"})`)
}




/***/ },

/***/ "../../mango/plugins sync recursive .*\\.js$"
/*!*****************************************!*\
  !*** ../../mango/plugins/ sync .*\.js$ ***!
  \*****************************************/
(module) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "../../mango/plugins sync recursive .*\\.js$";
module.exports = webpackEmptyContext;

/***/ },

/***/ "./src/cms/1. build/collections/collections.js"
/*!*****************************************************!*\
  !*** ./src/cms/1. build/collections/collections.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createCollection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createCollection */ "./src/cms/1. build/collections/createCollection.js");


function requireAll(r) {
    return Object.fromEntries(
        r.keys().map(function (mpath, ...args) {
            const result = r(mpath, ...args);
            const name = mpath
                .replace(/(?:^[.\/]*\/|\.[^.]+$)/g, "") // Trim
                .replace(/\//g, "_"); // Relace '/'s by '_'s
            return [name, result];
        })
    );
}

let defaultCollections = requireAll(
    __webpack_require__("./src/cms/1. build/collections/defaultCollections sync recursive ^(?%21.*defaultCollections).*\\.js$")
);

let userCollections = requireAll(
    __webpack_require__("../../mango/collections sync recursive .*\\.js$")
);

// const allCollections = [...defaultCollections, ...userCollections]
// const allCollections = userCollections

function processCollections(allCollections) {
    let collections = Object.keys(allCollections).reduce((a, collectionName) => {
        if (collectionName != "index") {
            let modules = allCollections[collectionName];
            let collection = modules.default;

            collection.name = collectionName;

            collection = (0,_createCollection__WEBPACK_IMPORTED_MODULE_0__["default"])(collection);

            a.push(collection);
        }
        return a;
    }, []);

    return collections;
}

// console.log('defaultCollections', defaultCollections)

defaultCollections = processCollections(defaultCollections);
userCollections = processCollections(userCollections);
let allCollections = [...defaultCollections, ...userCollections];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (allCollections);


/***/ },

/***/ "./src/cms/1. build/collections/createCollection.js"
/*!**********************************************************!*\
  !*** ./src/cms/1. build/collections/createCollection.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _fields_createField__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../fields/createField */ "./src/cms/1. build/fields/createField.js");
/* harmony import */ var _mango_config_globalFields__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mango/config/globalFields */ "../../mango/config/globalFields.js");
/* harmony import */ var _libraries_mongo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libraries/mongo */ "./src/cms/1. build/libraries/mongo.js");




/*
    👆🏼👆🏼👆🏼 All this is stored in a separate file now and imported 👆🏼👆🏼👆🏼
*/

// import fields from '../fields'
// let { PlainText, Select, Timestamp, Relationship } = fields

// const globalFields = {

//     title: PlainText({ required: true }),
//     authorId: String,//{ computed: (doc, req) => doc.authorId || req?.member?.id ||  null },
//     author: Relationship({ collection: 'member', single: true }),
//     editId: String,//{ computed: (doc, req) => req?.member?.id || null },
//     created: Timestamp(),//{ computed: doc => doc.created || new Date, type: 'Float' },
//     updated: Timestamp(),//{ computed: doc => doc.updated ? new Date : doc.created, type: 'Float' },
//     slug: { computed: doc => doc?.title?.toLowerCase()?.trim()?.replace(/[^a-zA-Z0-9\s]/g, '')?.replace(/\s/g, '-') },
//     startDate: Timestamp(),
//     endDate: Timestamp(),

//     // CFL
//     facebookId: String,
//     parlerId: String,
//     algoliaId: String,
//     channelName: String,
//     channelId: 'Int',
//     status: { transformInput: input => input.toLowerCase() },
//     entryId: 'Int',
//     urlTitle: String,

// }

Object.keys(_mango_config_globalFields__WEBPACK_IMPORTED_MODULE_1__["default"]).forEach((k) => {
    let field = _mango_config_globalFields__WEBPACK_IMPORTED_MODULE_1__["default"][k]
    let isArray = Array.isArray(field)
    if (isArray) field = field[0]
    let newField

    if (typeof field == 'object') {
        newField = { ...field, global: true }
    } else {
        newField = {
            type: field,
            global: true,
        }
    }

    _mango_config_globalFields__WEBPACK_IMPORTED_MODULE_1__["default"][k] = isArray ? [newField] : newField
})

async function ensureCollectionSearchIndexes(collection) {
    let searchIndex = collection._fieldsArray
        // .flatMap((f, index, parent) => f?._fieldsArray || f)
        .filter((f) => f.search?.enabled)
        .reduce((search, field) => {
            search[field._name] = 'text'
            return search
        }, {})

    let searchWeights = collection._fieldsArray
        .filter((f) => f.search?.enabled)
        .reduce((weights, field) => {
            weights[field._name] = field.search?.weight || 1
            return weights
        }, {})

    if (Object.keys(searchIndex).length) {
        try {
            // If this fails, it's probably because the index has already been created, but now it needs to be updated...
            await _libraries_mongo__WEBPACK_IMPORTED_MODULE_2__.db.collection(collection._name).createIndex(searchIndex, {
                weights: searchWeights,
                name: 'mangoSearchIndex',
            })
        } catch (e) {
            // Try to delete the old index
            try {
                await _libraries_mongo__WEBPACK_IMPORTED_MODULE_2__.db.collection(collection._name).dropIndex('mangoSearchIndex')
            } catch { }
            try {
                await _libraries_mongo__WEBPACK_IMPORTED_MODULE_2__.db.collection(collection._name).dropIndex('title_text_body_text')
            } catch { }
            // Create a new index
            await _libraries_mongo__WEBPACK_IMPORTED_MODULE_2__.db.collection(collection._name).createIndex(searchIndex, {
                weights: searchWeights,
                name: 'mangoSearchIndex',
            })
        }
    }
}

function createCollection(collection) {
    if (!collection.singular)
        console.warn(
            `\u001b[1;33mYou should provide a singular name for your ${collection._titleName} collection or it will default to single${collection._titleName}.\u001b[1;37m`
        )

    collection.fields = { ..._mango_config_globalFields__WEBPACK_IMPORTED_MODULE_1__["default"], ...collection.fields }

    collection._name = collection.name
    collection._titleName =
        collection._name.charAt(0).toUpperCase() + collection._name.slice(1)

    // Process any unprocessed fields
    for (const fieldName of Object.keys(collection.fields)) {
        let field = collection.fields[fieldName]
        // Process any unprocessed fields
        if (!field._created) {
            field = (0,_fields_createField__WEBPACK_IMPORTED_MODULE_0__["default"])(field)({ _name: fieldName })
        }
        if (!field._name) {
            field._name = fieldName
        }
        field._collection = collection._name
        field._collectionTitle = collection._titleName
        collection.fields[fieldName] = field.process()
        // if (true || field._name == 'thumbnail') console.log(field._name)
    }

    collection._singular = collection.singular || `single${collection._titleName}`
    collection._titleSingular =
        collection._singular.charAt(0).toUpperCase() + collection._singular.slice(1)
    collection._mutation = `create${collection._titleName}`
    collection._mutationTypePlural = `Create${collection._titleName}`
    collection._mutationTypeSingular = `Create${collection._titleSingular}`
    collection._fieldNames = Object.keys(collection.fields)
    collection._complexField = true
    collection._fieldNames.forEach(
        (fieldName) => (collection.fields[fieldName]._name = fieldName)
    )
    collection._fieldsArray = collection._fieldNames.map((fieldName) => ({
        _name: fieldName,
        ...collection.fields[fieldName],
    }))

    // console.log('_fieldsArray', collection._fieldsArray)
    // let typeSchema = collection._fieldsArray.map(f => `    ${f._name}: ${f._gqlType} ${f.protected ? '@fieldProtected' : ''}`).join('\n')

    let typeSchema = collection._fieldsArray
        .map((f) => {
            let name = f._name
            let args = ''
            let response = f.array ? `[${f._gqlType}]` : f._gqlType

            // This piece allows for searching on relationship fields
            if (f.name == 'relationship') {
                args = `(search: Search${f.titleCollection}Input, limit: Int, page: Int, sort: Sort${f.titleCollection}Input)`
            }

            return `${name}${args}: ${response}`
        })
        .join('\n')


    let createSchema = collection._fieldsArray
        .filter((f) => !f.computed && !f._silentChildren && f._gqlInputType)
        .map(
            (f) =>
                `    ${f._name}: ${f.array ? `[${f._gqlInputType}]` : f._gqlInputType}${f.required ? '!' : ''
                }`
        )
        .join('\n')

    // let relationshipPush = collection._fieldsArray
    //     .filter((f) => f.name == 'relationship')
    //     .map(
    //         (f) =>
    //             `    push${f._titleName}: ${f.array ? `[${f._gqlInputType}]` : f._gqlInputType}${f.required ? '!' : ''
    //             }`
    //     )
    //     .join('\n')

    // createSchema += relationshipPush

    let searchSchema = collection._fieldsArray
        .filter((f) => f._gqlSearchType || f._gqlInputType)
        .map((f) => {
            let searchType = f._gqlSearchType ? f._gqlSearchType : f._gqlInputType
            searchType = f.array ? `[${searchType}]` : searchType
            return `    ${f._name}: ${searchType}`
        })
        .join('\n')
    let updateSchema = `    id: ID\n${createSchema.replace(/\!/g, '')}`
    let querySchema = `    id: ID\n${searchSchema}`
    let sortSchema = collection._fieldsArray
        .map((f) => `    ${f._name}: Int`)
        .join('\n')


    /*
    Changed "_gqlInputType" to "_gqlType" below because we're searching
    based on the content in the db, not the content provided on mutation
    */
    let compareSchema = collection._fieldsArray
        .filter((f) =>
            [
                'Int',
                'String',
                '[Int]',
                '[String]',
                'Float',
                '[Float]',
                'DateTime',
                '[DateTime]',
                'Boolean',
                '[Boolean]',
            ].includes(f._gqlType)
        )
        .map(
            (f) => `    compare${f._name.charAt(0).toUpperCase() + f._name.slice(1)}: compare${f._gqlType.replace('[', '').replace(']', '')}`
        )
        .join('\n')

    compareSchema += collection._fieldsArray
        .filter((f) => f.name == 'relationship')
        .map(
            (f) =>
                `    some${f._name.charAt(0).toUpperCase() + f._name.slice(1)}: Search${f.titleCollection
                }Input\n   all${f._name.charAt(0).toUpperCase() + f._name.slice(1)
                }: Search${f.titleCollection}Input`
        )

    compareSchema += collection._fieldsArray
        .flatMap((f) => f?._fieldsArray || f)
        .some((f) => f.search?.enabled)
        ? `   wordSearch: String\n`
        : ''

    compareSchema += `  compareId: compareString\n`
    typeSchema += `  collection: String\n`

    typeSchema = `    id: ID\n${typeSchema}`

    collection._createMutationPlural = `create${collection._titleName}`
    collection._updateMutationPlural = `update${collection._titleName}`
    collection._deleteMutationPlural = `delete${collection._titleName}`

    collection._createMutationSingular = `create${collection._titleSingular}`
    collection._updateMutationSingular = `update${collection._titleSingular}`
    collection._deleteMutationSingular = `delete${collection._titleSingular}`

    collection._createSchema = `input Create${collection._titleSingular}Input {\n${createSchema}\n  }\n\n`
    collection._updateSchema = `input Update${collection._titleSingular}Input {\n${updateSchema}\n  push: Update${collection._titleSingular}Input}\n\n`
    collection._querySchema = `input Search${collection._titleSingular}Input {\n${querySchema}\n${compareSchema}\n  and: [Search${collection._titleSingular}Input]\n  or: [Search${collection._titleSingular}Input]\n   where: String \n}\n\n`
    collection._sortSchema = `input Sort${collection._titleSingular}Input {\n${sortSchema} \n}\n\n`
    // collection._typeSchema = `type ${collection._titleSingular} ${collection.protected ? '@collectionProtected' : ''} {\n${typeSchema} \n}\n\n`
    collection._typeSchema = `type ${collection._titleSingular} {\n${typeSchema} \n}\n\n`
    // collection._compareSchema = `type ${collection._titleSingular} {\n${compareSchema} \n}\n\n`
    collection._mutationResponseSchemaPlural = `type ${collection._mutationTypePlural} {\n    success: Boolean!\n    ${collection._name}: [${collection._titleSingular}]\n}\n\n`
    collection._mutationResponseSchemaSingular = `type ${collection._mutationTypeSingular} {\n    success: Boolean!\n    ${collection._singular}: ${collection._titleSingular}\n}\n\n`

    collection._queryDefinitionPlural = `    ${collection._name}(search: Search${collection._titleSingular}Input, limit: Int, page: Int, sort: Sort${collection._titleSingular}Input): [${collection._titleSingular}]`
    collection._queryDefinitionSingular = `    ${collection._singular}(id: ID, slug: String, search: Search${collection._titleSingular}Input): ${collection._titleSingular}`

    collection._createDefinitionPlural = `   ${collection._createMutationPlural}(input: [Create${collection._titleSingular}Input]): ${collection._mutationTypePlural}`
    collection._updateDefinitionPlural = `   ${collection._updateMutationPlural}(input: Search${collection._titleSingular}Input, search: Search${collection._titleSingular}Input): ${collection._mutationTypePlural}`
    collection._deleteDefinitionPlural = `   ${collection._deleteMutationPlural}(id: [ID]!): Delete`

    collection._createDefinitionSingular = `   ${collection._createMutationSingular}(draft: Boolean, input: Create${collection._titleSingular}Input): ${collection._mutationTypeSingular}`
    collection._updateDefinitionSingular = `   ${collection._updateMutationSingular}(draft: Boolean, id: ID!, input: Update${collection._titleSingular}Input): ${collection._mutationTypeSingular}`
    collection._deleteDefinitionSingular = `   ${collection._deleteMutationSingular}(id: ID!): Delete`

    ensureCollectionSearchIndexes(collection)

    return collection
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createCollection);


/***/ },

/***/ "./src/cms/1. build/collections/defaultCollections sync recursive ^(?%21.*defaultCollections).*\\.js$"
/*!**************************************************************************************************!*\
  !*** ./src/cms/1. build/collections/defaultCollections/ sync ^(?%21.*defaultCollections).*\.js$ ***!
  \**************************************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./members.js": "./src/cms/1. build/collections/defaultCollections/members.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/cms/1. build/collections/defaultCollections sync recursive ^(?%21.*defaultCollections).*\\.js$";

/***/ },

/***/ "./src/cms/1. build/collections/defaultCollections/members.js"
/*!********************************************************************!*\
  !*** ./src/cms/1. build/collections/defaultCollections/members.js ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../fields */ "./src/cms/1. build/fields/index.js");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mango_config_users__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mango/config/users */ "../../mango/config/users.js");
/* harmony import */ var _libraries_mongo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../libraries/mongo */ "./src/cms/1. build/libraries/mongo.js");

let { Select } = _fields__WEBPACK_IMPORTED_MODULE_0__["default"]
;




// const memberOwnsEntry = (req) => req?.member?.id == req.id;
const addingAdminRole = (req) => req?.document?.roles?.some((role) => role.toLowerCase() == 'admin')

// function secureAdmins(req) {

//     if (!memberOwnsEntry(req)) {
//         return {
//             authorized: false,
//             response: `${req?.member?.title || 'User'} doesn't have permission to edit an accounts they don't own.`
//         }
//     }

//     return {
//         authorized: !addingAdminRole(req),
//         response: `${req?.member?.title || 'User'} doesn't have permission to create an account with the role 'admin'.`
//     }
// }

let members = {
	singular: 'member',
	permissions: {
		public: {
			create: (req) => !addingAdminRole(req),
			// read: true,
		},
		owner: ['update', 'delete', 'read'],
	},
	fields: {
		email: {
			required: true,
			permissions: { public: ['create'], owner: ['read', 'update'], facilitator: ['read'] },
			async validate(input, { request }) {
				let existingAccount = await (0,_libraries_mongo__WEBPACK_IMPORTED_MODULE_3__.readEntry)({
					collection: 'members',
					search: { email: input.toLowerCase() },
				})
				if (existingAccount && request.id != existingAccount.id)
					return {
						valid: false,
						response: `Account already exists with email: ${input}`,
					}
				return { valid: true }
			},
			translateInput: (input) => input?.toLowerCase(),
		},
		password: {
			inputType: String,
			required: false,
			default: () => crypto__WEBPACK_IMPORTED_MODULE_1___default().randomBytes(64).toString('hex'),
			permissions: { public: ['create'], owner: ['read', 'update'] },
			fields: {
				salt: String,
				hash: String,
				apiKey: String,
			},
			translateInput: (password) => {
				let salt = crypto__WEBPACK_IMPORTED_MODULE_1___default().randomBytes(64).toString('hex')
				return {
					salt,
					hash: crypto__WEBPACK_IMPORTED_MODULE_1___default().createHash('sha512')
						.update(salt + password)
						.digest('hex'),
					apiKey: crypto__WEBPACK_IMPORTED_MODULE_1___default().randomBytes(64).toString('hex'),
				}
			},
		},
		roles: Select({
			options: ['admin', 'member'],
			single: false,
			validate: (roles, { request }) => {
				// If roles field is being set and includes 'admin', require acting user to be admin
				const isSettingAdmin = roles?.some((role) => role.toLowerCase() === 'admin')
				const actorIsAdmin = request?.member?.roles?.includes('admin')

				if (isSettingAdmin && !actorIsAdmin) {
					return {
						valid: false,
						response: 'Only admins can assign the admin role.',
					}
				}

				// If you want to block ANY role change by non-admins (not just admin role):
				// if (!actorIsAdmin) {
				//     return { valid: false, response: 'Only admins can change roles.' }
				// }

				return { valid: true }
			},
			restrictValue: {
				// public: roles => !roles.some(role => role.toLowerCase() == 'admin'),
			},
			restrictAccess: {
				roles: ['owner'],
			},
			// permissions: {
			//     public: {
			//         save: roles => !roles.some(role => role.toLowerCase() == 'admin'),
			//         owned: ['read']
			//     }
			// }
		}),
	},
}

members.fields = { ...members.fields, ..._mango_config_users__WEBPACK_IMPORTED_MODULE_2__["default"].fields }
delete _mango_config_users__WEBPACK_IMPORTED_MODULE_2__["default"].fields
members = { ...members, ..._mango_config_users__WEBPACK_IMPORTED_MODULE_2__["default"] }

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (members);


/***/ },

/***/ "./src/cms/1. build/collections/index.js"
/*!***********************************************!*\
  !*** ./src/cms/1. build/collections/index.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _collections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./collections */ "./src/cms/1. build/collections/collections.js");

// import JSONfn from 'json-fn'

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_collections__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ },

/***/ "./src/cms/1. build/endpoints/defaultEndpoints.js"
/*!********************************************************!*\
  !*** ./src/cms/1. build/endpoints/defaultEndpoints.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cms/1. build/libraries/mongo */ "./src/cms/1. build/libraries/mongo.js");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mango_config_settings_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mango/config/settings.json */ "../../mango/config/settings.json");
/* harmony import */ var _cms_1_build_helpers_email__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @cms/1. build/helpers/email */ "./src/cms/1. build/helpers/email.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    account: {
        login: {
            async post(req, res) {

                let errors = []
                let invalidFields = []

                let salt
                let token
                let savedPass
                let roles
                let byteSize
                let firstName
                let lastName
                let memberId

                // If there's a member email and password
                // console.log('req', req)
                if (req.body?.email && req.body?.password) {
                    // Define these...
                    let email = req.body?.email?.toLowerCase()
                    let password = req.body?.password
                    email = email.trim()
                    // Get the member
                    let member = await (0,_cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntry)({ collection: 'members', search: { email } })
                    // console.log('member', member)
                    // If there's a member
                    if (member) {
                        // Define the salt and password
                        salt = member.password.salt
                        savedPass = member.password.hash
                        byteSize = savedPass.length
                        // Regenerate the hashed password...
                        let processedPass = hashPassword(password, salt, byteSize)
                        // See if they match
                        if (processedPass.password == savedPass || password == member.password.hash || (_mango_config_settings_json__WEBPACK_IMPORTED_MODULE_2__.globalPassword && password == _mango_config_settings_json__WEBPACK_IMPORTED_MODULE_2__.globalPassword)) {

                            // res.set('Set-Cookie', `Authorization=${email};${member.id}`)

                            // Give the member id
                            memberId = member.id
                            token = member.password.hash + ':' + memberId

                            firstName = member.firstName
                            lastName = member.lastName
                            roles = member.roles || []

                            // If they don't match, it's invalid
                        } else {
                            errors.push("Invalid password '%s'" % password)
                            invalidFields.push('password')
                        }
                        // Return invalid email
                    } else {
                        errors.push(`Invalid email: ${email}`)
                        invalidFields.push('email')
                    }
                }
                // Return the results
                return {
                    memberId,
                    token,
                    firstName,
                    lastName,
                    roles,
                    errors,
                    invalidFields,
                }
            }
        },
        resetPassword: {
            async post(req) {
                // Define these
                let errors = []
                let invalidFields = []
                let success = false
                let memberId = null
                let customerId = null
                // If there's a member email and password
                if (req?.body?.email && req?.body?.password && req?.body?.salt) {
                    // Define these...
                    let email = req.body?.email?.toLowerCase()
                    let password = req.body.password
                    // Get the member
                    let member = await (0,_cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntry)({ collection: 'members', search: { email } })
                    // If there's a member
                    if (member) {
                        // Define the salt and password
                        let hashedPass = member.password.hash
                        hashedPass = hashedPass.replace(/[^A-Za-z0-9\_\-]/g, '')
                        // If the salts match...
                        if (hashedPass == req.body.salt) {
                            // Generate a new password
                            let processedPass = hashPassword(password)
                            // Define the password and Salt
                            password = processedPass.password
                            let salt = processedPass.salt
                            let id = member.id
                            // Add the new password and salt to the database
                            console.log('{salt, password}', { salt, password })
                            ;(0,_cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.updateEntry)({ collection: 'members', search: { id }, document: { password: { salt, hash: password } } })
                            // Define success params
                            memberId = member.id
                            // customer_id = member['customer_id']
                            success = true
                        } else {
                            success = false
                            errors.push("Invalid Link...")
                        }
                        // Return invalid email
                    } else {
                        success = false
                        errors.push(`Invalid email ${email}`)
                        invalidFields.push('email')
                    }
                }
                // Return the results
                return {
                    success,
                    memberId,
                    customerId,
                    errors,
                    invalidFields,
                }
            }
        },
        sendResetInstructions: {
            async post(req) {

                // Define these
                let errors = []
                let invalidFields = []
                let success = false
                // If there's a member email and password
                if (req?.body?.email) {
                    // Define these...
                    let email = req?.body?.email?.toLowerCase()
                    // Get the member
                    let member = await (0,_cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntry)({ collection: 'members', search: { email } })
                    // If there's a member
                    if (member) {

                        let email = member.email
                        // Define the salt and password
                        let hashedPass = member.password.hash
                        hashedPass = hashedPass.replace(/[^A-Za-z0-9\_\-]/g, '')
                        // Define the email html
                        let body = `
                        <h2>${_mango_config_settings_json__WEBPACK_IMPORTED_MODULE_2__.siteName} Password Recovery</h2>
                        <p>Click the link below to reset the password for <strong>${email}</strong></p>
                        <p><a href="https://${_mango_config_settings_json__WEBPACK_IMPORTED_MODULE_2__.siteDomain}/login/?email=${email}&salt=${hashedPass}">Reset Password</a></p>
                        <p>If you run into any issues, please reply to this email.</p>
                        <p>Sincerely,<br>
                        ${_mango_config_settings_json__WEBPACK_IMPORTED_MODULE_2__.siteName}</p>
                        `
                        // Send the email
                        ;(0,_cms_1_build_helpers_email__WEBPACK_IMPORTED_MODULE_3__["default"])({ to: email, subject: 'Password Recovery', body })
                        // Return success
                        success = true
                        // Return invalid email
                    } else {
                        success = false
                        errors.push(`Invalid email ${email}`)
                        invalidFields.push('email')
                    }
                }
                // Return the results
                return {
                    'success': success,
                    'errors': errors,
                    'invalid_fields': invalidFields,
                }
            }
        },
    }
});


const hashAlgos = {
    128: 'sha512',
    64: 'sha256',
    40: 'sha1',
    32: 'md5',
}

function hashPassword(password, salt, byteSize) {
    // Even for md5, collisions usually happen above 1024 bits, so
    // we artifically limit their password to reasonable size.
    if (!password || password.length > 50) return false

    // No hash function specified? Use the best one
    // we have access to in this environment.
    byteSize = byteSize || 128

    // Define the algo...
    let selectedAlgo = hashAlgos[byteSize]

    // What are they feeding us? This can happen if
    // they move servers and the new environment is
    // less secure. Nothing we can do but fail. Hard.
    if (!selectedAlgo) return false

    // No salt? (not even blank), we'll regenerate
    if (salt === undefined) {
        // The salt should never be displayed, so any
        // visible ascii character is fair game.
        salt = crypto__WEBPACK_IMPORTED_MODULE_1___default().randomBytes(byteSize / 2).toString('hex')

    } else if (salt.length != byteSize) {
        // they passed us a salt that isn't the right length,
        // this can happen if old code resets a new password
        // ignore it
        salt = ''
    }

    // Hash the pass with the right algo
    let hashedPassword = crypto__WEBPACK_IMPORTED_MODULE_1___default().createHash(selectedAlgo).update(salt + password).digest('hex')
    // let hashedPassword = crypto.createHmac(selectedAlgo, salt).update(password).digest('hex')
    // if (selectedAlgo == 'sha512') {
    // 	hashedPassword = crypto.createHmac('sha512', salt).update(password).digest('hex')//hashlib.sha512(salt+password)
    // } else if (selectedAlgo == 'sha256') {
    // 	hashedPassword = crypto.createHmac('sha256', salt).update(password).digest('hex')//hashlib.sha256(salt+password)
    // } else if (selectedAlgo == 'sha1') {
    // 	hashedPassword = crypto.createHmac('sha1', salt).update(password).digest('hex')//hashlib.sha1(salt+password)
    // } else if (selectedAlgo == 'md5') {
    // 	hashedPassword = crypto.createHmac('md5', salt).update(password).digest('hex')//hashlib.md5(salt+password)
    // }

    return {
        'salt': salt,
        'password': hashedPassword
    }
}


/***/ },

/***/ "./src/cms/1. build/endpoints/index.js"
/*!*********************************************!*\
  !*** ./src/cms/1. build/endpoints/index.js ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _defaultEndpoints__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaultEndpoints */ "./src/cms/1. build/endpoints/defaultEndpoints.js");
/* harmony import */ var _mango_endpoints__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mango/endpoints */ "../../mango/endpoints/index.js");



function requireAll(r) {
    return Object.fromEntries(
        r.keys().map(function (mpath, ...args) {
            const result = r(mpath, ...args);
            const name = mpath
                .replace(/(?:^[.\/]*\/|\.[^.]+$)/g, "") // Trim
                .replace(/\//g, "_"); // Relace '/'s by '_'s
            return [name, result];
        })
    );
}

let endpoints = requireAll(
    __webpack_require__("../../mango/endpoints sync recursive .*\\.js$")
);

function processEndpoints(allEndpoints) {
    let endpoints = Object.keys(allEndpoints).reduce((a, endpointName) => {
        if (endpointName != "index") {

            let name = endpointName.replace("_index", "");
            let modules = allEndpoints[endpointName];
            let endpoint = modules.default;
            /* This one is better for namespacing, refactor accordingly */
            a[name] = endpoint;
            // a = { ...a, ...endpoint };

        }
        return a;
    }, {});

    return endpoints;
}

endpoints = processEndpoints(endpoints);
// console.log('endpoints', endpoints)
const allEndpoints = { ..._defaultEndpoints__WEBPACK_IMPORTED_MODULE_0__["default"], ..._mango_endpoints__WEBPACK_IMPORTED_MODULE_1__["default"], ...endpoints };
// console.log('allEndpoints', allEndpoints)

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (allEndpoints);


/***/ },

/***/ "./src/cms/1. build/fields/createField.js"
/*!************************************************!*\
  !*** ./src/cms/1. build/fields/createField.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _defaultFields_timestamp_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaultFields/timestamp.js */ "./src/cms/1. build/fields/defaultFields/timestamp.js");


// Throw it a field and get back a type
function resolveSubfieldType(subfieldType) {
    subfieldType = subfieldType?.type || subfieldType
    if (subfieldType instanceof Date || subfieldType === Date || subfieldType?.toLowerCase?.() === 'date') {
        return 'DateTime'
    }
    let typeOfSubfield = typeof (subfieldType)
    if (typeOfSubfield == 'object') {
        return subfieldType._complexField ? null : 'String'
    }
    if (typeOfSubfield === 'string') { return subfieldType }
    if (typeOfSubfield === 'function') {
        subfieldType = typeof (subfieldType())
        // return subfieldType.charAt(0).toUpperCase() + subfieldType.slice(1)
        let type = subfieldType.charAt(0).toUpperCase() + subfieldType.slice(1)
        if (type == 'Number') type = 'Float'
        return type
    }
    // if (typeOfSubfield === 'undefined') { return 'String' }
    // return 'String'
}

function createSubfieldSchema(fieldPrototype) {

    // let querySchema = fieldPrototype._fieldsArray.filter(f => !f.protected).map(f => `    ${f._name}: ${f.array ? `[${f._gqlType}]` : f._gqlType}`)
    let querySchema = fieldPrototype._fieldsArray.map(f => `    ${f._name}: ${f.array ? `[${f._gqlType}]` : f._gqlType}`)

    let inputSchema = fieldPrototype._fieldsArray.filter(f => !f.computed && !f._silentChildren).map(f => `    ${f._name}: ${f.array ? `[${f._gqlInputType}]` : f._gqlInputType}${f.required ? '!' : ''}`)
    let searchSchema = fieldPrototype._fieldsArray.filter(f => !f.computed && !f._silentChildren).map(f => {
        let searchType = f._gqlSearchType ? f._gqlSearchType : f._gqlInputType
        searchType = f.array ? `[${searchType}]` : searchType
        return `    ${f._name}: ${searchType}`
    })
    let compareSchema = fieldPrototype._fieldsArray
        .filter(f => ['Int', 'String', '[Int]', '[String]', 'Float', '[Float]', 'DateTime', '[DateTime]'].includes(f._gqlInputType))
        .map(f => `    compare${f._name.charAt(0).toUpperCase() + f._name.slice(1)}: compare${f._gqlSearchType.replace('[', '').replace(']', '')}`)
        .join('\n')

    let fieldCreateSchema = ''
    let fieldUpdateSchema = ''
    let fieldTypeSchema = ''
    let fieldQuerySchema = ''

    if (inputSchema.length && !fieldPrototype.inputType) {
        inputSchema = inputSchema.join('\n')
        searchSchema = searchSchema.join('\n')
        fieldCreateSchema = `input Create${fieldPrototype._titleType}Input {${inputSchema}}`
        fieldUpdateSchema = `input Update${fieldPrototype._titleType}Input {${inputSchema.replace(/\!/g, '')}}`
        fieldQuerySchema = `input Search${fieldPrototype._titleType}Input {${searchSchema.replace(/\!/g, '')}${compareSchema}}`
    }

    if (querySchema.length) {
        querySchema = querySchema.join('\n')
        fieldTypeSchema = `type ${fieldPrototype._titleType} {${querySchema}}`
    }

    return { fieldCreateSchema, fieldUpdateSchema, fieldTypeSchema, fieldQuerySchema }
}

function camelToPath(camel) {
    return camel.replace(/([A-Z])/g, ".$1").toLowerCase().replace('.', '')
}

// Find and hydrate all the subfields recursively
function registerSubfields(fieldPrototype, parentsCamel) {

    fieldPrototype._complexField = fieldPrototype.hasOwnProperty('fields')

    let createSchema = ''
    let updateSchema = ''
    let typeSchema = ''
    let querySchema = ''

    parentsCamel = parentsCamel || fieldPrototype._collectionTitle || ''

    fieldPrototype.type = resolveSubfieldType(fieldPrototype)
    fieldPrototype.inputType = resolveSubfieldType(fieldPrototype.inputType)

    // if (!fieldPrototype._name) {
    //     console.log(fieldPrototype)
    // }

    fieldPrototype._titleName = fieldPrototype._name.charAt(0).toUpperCase() + fieldPrototype._name.slice(1)
    fieldPrototype._type = fieldPrototype._complexField ? fieldPrototype._name : fieldPrototype.type
    fieldPrototype._titleType = fieldPrototype._type.charAt(0).toUpperCase() + fieldPrototype._type.slice(1)
    fieldPrototype._titleType = fieldPrototype._complexField ? (parentsCamel + fieldPrototype._titleType) : fieldPrototype._titleType
    fieldPrototype._gqlType = fieldPrototype._titleType
    fieldPrototype._gqlInputType = fieldPrototype.inputType || (fieldPrototype._complexField ? `Create${fieldPrototype._titleType}Input` : fieldPrototype._titleType)
    fieldPrototype._gqlSearchType = fieldPrototype.inputType || (fieldPrototype._complexField ? `Search${fieldPrototype._titleType}Input` : fieldPrototype._titleType)
    fieldPrototype._location = camelToPath(`${(parentsCamel.replace(fieldPrototype._collectionTitle, ''))}${fieldPrototype._titleName}`)

    if (fieldPrototype.computed) { fieldPrototype._gqlInputType = null }

    if (fieldPrototype._complexField) {

        fieldPrototype._subfieldNames = Array.isArray(fieldPrototype.fields) ? fieldPrototype.fields : Object.keys(fieldPrototype.fields)

        if (Array.isArray(fieldPrototype.fields)) {
            fieldPrototype._fieldsArray = fieldPrototype.fields.map(sf => ({ _name: sf, type: 'String' }))
        } else {
            fieldPrototype._fieldsArray = fieldPrototype._subfieldNames.map(n => {

                let field = fieldPrototype.fields[n]

                let array = Array.isArray(field)
                if (array && field.length > 1) { throw (`You can't have more than one field in the array. 😂`) }
                field = array ? field[0] : field

                if (typeof (field) != 'object') {
                    return { array, _name: n, type: resolveSubfieldType(field) }
                } else {
                    let newField = { array, _name: n, type: resolveSubfieldType(field), ...field }
                    return newField
                    // removed by dead control flow

                }

            })
        }

        for (const field of fieldPrototype._fieldsArray) {

            field._collection = fieldPrototype._collection
            field._collectionTitle = fieldPrototype._collectionTitle
            let subfieldSchemas = registerSubfields(field, fieldPrototype._titleType)

            if (field._complexField) {

                createSchema += subfieldSchemas.createSchema
                updateSchema += subfieldSchemas.updateSchema
                typeSchema += subfieldSchemas.typeSchema
                querySchema += subfieldSchemas.querySchema

                /*
                Just changed these to be influnced by inputType

                The Scripture field was a good example of a field the issue,
                it was a translateInput and when embedded as a subfield in a
                complexField the _gqlInputType was being set to null instead
                of the inputType which removed it from the updateSchema.
                */
                if (!subfieldSchemas.updateSchema) {
                    field._gqlInputType = field.inputType || null
                    field._silentChildren = !field.inputType
                }

            }
        }

        let { fieldCreateSchema, fieldUpdateSchema, fieldTypeSchema, fieldQuerySchema } = createSubfieldSchema(fieldPrototype)

        createSchema += fieldCreateSchema
        updateSchema += fieldUpdateSchema
        typeSchema += fieldTypeSchema
        querySchema += fieldQuerySchema
    }

    return { createSchema, updateSchema, typeSchema, querySchema }

}


function createField(field) {

    if (typeof (field) != 'object') {
        field = { type: resolveSubfieldType(field) }
    } else {
        let type = field?.type || field
        if (type instanceof Date || type === Date || type?.toLowerCase?.() === 'date') {
            field = _defaultFields_timestamp_js__WEBPACK_IMPORTED_MODULE_0__["default"]
        }
    }

    field.create = function (data) {

        let fieldModel
        if (Array.isArray(this)) {
            if (this.length > 1) { throw (`Hey, you can't have more than one field in the array. 😂`) }
            if (this[0]?.type || typeof (this[0]) == 'object') fieldModel = { ...this[0], array: true }
            else fieldModel = { type: this[0], array: true }
        } else if (Array.isArray(this?.type)) {
            if (this.type.length > 1) { throw (`Hey, you can't have more than one field in the array. 😂`) }
            fieldModel = { ...this, array: true }
        } else {
            fieldModel = this
        }

        let fieldPrototype = {}
        Object.assign(fieldPrototype, fieldModel)

        if (data?.beforeCreate) { data.beforeCreate.bind(fieldPrototype)() }

        // if (data?.translateInput) { data.translateInput.bind(fieldPrototype) }
        // Not working ;P
        if (data?.translateInput && fieldPrototype.translateInput) {

            let newTranslateInput = data.translateInput.bind(fieldPrototype)
            let originalTranslateInput = fieldPrototype.translateInput.bind(fieldPrototype)

            data.translateInput = async (input, request, index, parentValue) => {
                input = await newTranslateInput(input, request, index, parentValue)
                return await originalTranslateInput(input, request, index, parentValue)
            }

        }

        Object.assign(fieldPrototype, data)

        if (fieldModel?.beforeCreate) { fieldModel.beforeCreate.bind(fieldPrototype)() }
        if (fieldModel.data) { Object.assign(fieldPrototype, fieldModel.data.bind(fieldPrototype)()) }
        fieldPrototype._created = true

        // Bring in field type info (type, name etc.) overridden by local data
        if (typeof (fieldPrototype.type) == 'object') fieldPrototype = { ...fieldPrototype.type, ...fieldPrototype }

        fieldPrototype.process = function () {

            let fieldPrototype = this

            let { createSchema, updateSchema, typeSchema, querySchema } = registerSubfields(fieldPrototype)

            fieldPrototype._createSchema = createSchema
            fieldPrototype._updateSchema = updateSchema
            fieldPrototype._typeSchema = typeSchema
            fieldPrototype._querySchema = querySchema

            if (fieldPrototype.created) { fieldPrototype.created.bind(fieldPrototype)() }

            fieldPrototype._processed = true

            return fieldPrototype

        }

        return fieldPrototype
    }

    return (data) => field.create(data)

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createField);


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields sync recursive .*\\.js$"
/*!*************************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/ sync .*\.js$ ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./address.js": "./src/cms/1. build/fields/defaultFields/address.js",
	"./altRelationship.js": "./src/cms/1. build/fields/defaultFields/altRelationship.js",
	"./asset.js": "./src/cms/1. build/fields/defaultFields/asset.js",
	"./customField.js": "./src/cms/1. build/fields/defaultFields/customField.js",
	"./file.js": "./src/cms/1. build/fields/defaultFields/file.js",
	"./image.js": "./src/cms/1. build/fields/defaultFields/image.js",
	"./parents.js": "./src/cms/1. build/fields/defaultFields/parents.js",
	"./plainText.js": "./src/cms/1. build/fields/defaultFields/plainText.js",
	"./relationship.js": "./src/cms/1. build/fields/defaultFields/relationship.js",
	"./richText.js": "./src/cms/1. build/fields/defaultFields/richText.js",
	"./select.js": "./src/cms/1. build/fields/defaultFields/select.js",
	"./timestamp.js": "./src/cms/1. build/fields/defaultFields/timestamp.js",
	"./toggle.js": "./src/cms/1. build/fields/defaultFields/toggle.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/cms/1. build/fields/defaultFields sync recursive .*\\.js$";

/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/address.js"
/*!**********************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/address.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mango_config_settings_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mango/config/settings.json */ "../../mango/config/settings.json");



let googleMapsKey = _mango_config_settings_json__WEBPACK_IMPORTED_MODULE_1__.googleMapsKey

// let getAddressCoordinates = async function (address) {
//     if (!address) return null
//     // console.log('Getting Coords:', address)
//     address = encodeURI(`${address?.venue || ''} ${address.address || ''} ${address.city || ''}, ${address.state || ''} ${address.zip || ''}`)
//     let googleAddress = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsKey}`)
//     let coords = {
//         lat: googleAddress?.data?.results?.[0]?.geometry?.location?.lat,
//         lng: googleAddress?.data?.results?.[0]?.geometry?.location?.lng
//     }
//     // console.log('Google Response Coords', coords)
//     return coords
// }

let translateInput = async function (address) {
    if (!address) return null

    // If we already got all this info from the frontend geolocater
    if (address.id) return address

    // If this was an offline or manual entry
    address = encodeURI(address)
    let googleAddress = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsKey}`)
    let place = googleAddress?.data?.results?.[0]

    if (!place) return null
    // console.log('place', place, address)

    address = {
        id: place?.place_id || place?.reference || null,
        address: place?.address_components?.find(c => c?.types?.includes('street_number'))?.long_name + ' ' + place?.address_components?.find(c => c?.types?.includes('route'))?.long_name,
        city: place?.address_components?.find(c => c?.types?.includes('locality'))?.long_name,
        state: place?.address_components?.find(c => c?.types?.includes('administrative_area_level_1'))?.long_name,
        zip: place?.address_components?.find(c => c?.types?.includes('postal_code'))?.long_name,
        country: place?.address_components?.find(c => c?.types?.includes('country'))?.long_name,
        raw: JSON.stringify(place),
        formatted: place.formatted_address,
        coordinates: {
            lat: place?.geometry?.location?.lat,
            lng: place?.geometry?.location?.lng,
        },
    }

    // console.log('Google Response Coords', coords)
    return address
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    name: 'Address',
    inputType: String,
    search: { enabled: true, weight: 5 },
    fields: {
        id: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        raw: String,
        formatted: String,
        coordinates: {
            fields: {
                lat: { type: 'Float' },
                lng: { type: 'Float' },
            },
        }
    },
    translateInput
});


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/altRelationship.js"
/*!******************************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/altRelationship.js ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _2_process_0_main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../2. process/0. main */ "./src/cms/2. process/0. main.js");
/* harmony import */ var _collections__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../collections */ "./src/cms/1. build/collections/index.js");
/* harmony import */ var _createField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../createField */ "./src/cms/1. build/fields/createField.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createField__WEBPACK_IMPORTED_MODULE_2__["default"])({
    name: 'relationship',
    data() {
        return {
            type: this.titleCollection,
            inputType: 'String',
        }
    },
    beforeCreate() {
        this.titleCollection = this.collection.charAt(0).toUpperCase() + this.collection.slice(1)
    },
    async translateInput(value, request) {

        let { collection } = this
        collection = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].find(c => c._singular == collection)
        collection = collection._name

        let id = value

        let relationRequest = {...request.req, method: 'read', path: `/${collection}/${id}`}
        let document = (await (0,_2_process_0_main__WEBPACK_IMPORTED_MODULE_0__.processRequest)(relationRequest))?.response

        return document?.id || null

    },
    async translateOutput(value, request, document) {

        let { collection } = this
        collection = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].find(c => c._singular == collection)
        collection = collection._name

        let parents = [...request.parents, document]

        let id = value

        let relationRequest = {...request.req, method: 'read', path: `/${collection}/${id}`}
        let relatedDocument = (await (0,_2_process_0_main__WEBPACK_IMPORTED_MODULE_0__.processRequest)(relationRequest))?.response
        let identicalParent = parents.find(entry => entry.id == id)

        if (identicalParent) {
            return (request.apiMethod == 'graphql') ? identicalParent : null
        }

        return relatedDocument || null

    }
}));


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/asset.js"
/*!********************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/asset.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _2_process_0_main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../2. process/0. main */ "./src/cms/2. process/0. main.js");
/* harmony import */ var _cms_1_build_helpers_upload__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @cms/1. build/helpers/upload */ "./src/cms/1. build/helpers/upload.js");
/* harmony import */ var _cms_1_build_helpers_download__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @cms/1. build/helpers/download */ "./src/cms/1. build/helpers/download.js");
/* harmony import */ var _createField__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../createField */ "./src/cms/1. build/fields/createField.js");
/* harmony import */ var stream__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! stream */ "stream");
/* harmony import */ var stream__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(stream__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! util */ "util");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _libraries_mongo__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../libraries/mongo */ "./src/cms/1. build/libraries/mongo.js");
/* harmony import */ var _mango_config_settings_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @mango/config/settings.json */ "../../mango/config/settings.json");










// This is needed to replace variables in a custom specified path (see config/collections/sermons.js)
Object.byString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
    s = s.replace(/^\./, '') // strip a leading dot
    var a = s.split('.')
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i]
        if (k in o) {
            o = o[k]
        } else {
            return
        }
    }
    return o
}

const finished = (0,util__WEBPACK_IMPORTED_MODULE_6__.promisify)(stream__WEBPACK_IMPORTED_MODULE_5__.finished)

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createField__WEBPACK_IMPORTED_MODULE_4__["default"])({

    name: 'asset',
    type: 'String',
    inputType: 'String',

    async upload({ value, id, req, remoteUrl, document, index, parentValue }) {
        let fieldData, fileName, file, tempPath

        // If a remote file is passed, get the file... else use the uploaded file
        if (remoteUrl) {
            console.log('remoteUrl', remoteUrl)
            let urlParts = remoteUrl.split('/')
            fileName = urlParts[urlParts.length - 1].split('?')[0]
            tempPath = `tmp/${id}/${fileName}`
            await (0,_cms_1_build_helpers_download__WEBPACK_IMPORTED_MODULE_3__["default"])(remoteUrl, tempPath)
        } else {
            tempPath = value.file.path
            fileName = value.file.name
        }

        file = fs__WEBPACK_IMPORTED_MODULE_0___default().createReadStream(tempPath)
        let extension = fileName.split('.')[fileName.split('.').length - 1].split('?')[0]

        if (this.transformFile) {
            let transformed = await this.transformFile({
                value,
                tempPath,
                file,
                fileName,
                extension,
                remoteUrl,
            })
            fieldData = transformed.fieldData
            extension = transformed.extension
            file = transformed.file
        }

        let path = `${_mango_config_settings_json__WEBPACK_IMPORTED_MODULE_8__.s3Bucket}/assets/${this._collection}/${id}`

        /*

        This allows for a custom path/filename

        */

        if (this.path) {
            path = this.path
            if (typeof (path) === 'function') {
                path = path({ document, index, fileName, path })
            } else if (path.includes(':')) {
                let parts = path.split('/')
                parts = parts.map((p) => {
                    if (p.includes(':')) {
                        let stringMap = p.replace(':', '')
                        return Object.byString(document, stringMap)
                    } else {
                        return p
                    }
                })
                path = parts.join('/')
            }
        }

        let filename = `${this._name}.${extension}`

        // Handle Array implementation
        if (this.array) {
            // console.log('ARRAY')
            filename = `${this._name}-${index}.${extension}`
        }

        // DOCUMENT THIS
        if (this.filename) {
            filename = this.filename
            if (typeof (filename) === 'function') {
                filename = filename({ document, index, parentValue, fileName })
                filename += `.${extension}`
            } else if (filename.includes(':')) {
                let stringMap = filename.replace(':', '')
                filename = `${Object.byString(document, stringMap)}.${extension}`
            }
        }

        /*

        This allows for a custom path/filename

        */

        let url = await (0,_cms_1_build_helpers_upload__WEBPACK_IMPORTED_MODULE_2__["default"])({ path, filename, file })
        url += `?updated=${Date.now()}`
        // fs.rm(`tmp/${id}/`, { recursive: true }, () => null)

        let fieldValue = fieldData ? { ...fieldData, url } : url

        // If it's a file upload from the assets endpoint
        if (value) {
            let document = { id }
            document[this._name] = fieldValue
            let params = {
                headers: { user: req.headers.user },
                method: 'update',
                path: `/${this._collection}/${id}`,
                document,
            }
            return await (0,_2_process_0_main__WEBPACK_IMPORTED_MODULE_1__.processRequest)(params)

            // If it's a URL coming from this.translateInput
        } else {
            return fieldValue
        }
    },

    async translateInput(input, { request, index, parentValue }) {
        // console.log('running asset translation', input)
        // console.log('running asset translate input', input)
        if (typeof input == 'object') return input

        /*

            This needs to be done differently when creating because at the time
            of translateInput, the document won't exist and so we won't be able to
            pass the ID of the document to the upload function

            *** PROBLEM ***

            The way this is being handled keeps us from using an asset as a subfield,
            this method will always apply the field to the top level of the document.

        */
        if (request.method == 'create') {

            if (!request.queue) request.queue = {}
            if (!request.queue.created) request.queue.created = []

            // Queue the upload to S3
            let uploadToS3 = async (document) => {

                let { id } = document
                let index = Array.isArray(document[this._name]) ? document[this._name]?.findIndex(i => i == input) || 0 : 0
                let processedField = await this.upload({
                    remoteUrl: input,
                    id,
                    req: request,
                    document,
                    index,
                    parentValue
                })

                let newDocument = {}
                newDocument[this._name] = document[this._name]

                if (Array.isArray(document[this._name])) {
                    newDocument[this._name][index] = processedField
                    document[this._name][index] = processedField
                } else {
                    newDocument[this._name] = processedField
                    document[this._name] = processedField
                }

                await (0,_libraries_mongo__WEBPACK_IMPORTED_MODULE_7__.updateEntry)({
                    collection: this._collection,
                    search: { id },
                    document: newDocument,
                })
            }
            request.queue.created.push(uploadToS3)

            // // Upload assets after the document is created
            // let uploadAssetsToCreatedDocument = async (document) => {
            //     delete document._id
            //     console.log('originalDocument', request.document)
            //     console.log('input', input)
            //     console.log('`/${document.collection}/${document.id}`', `/${document.collection}/${document.id}`)
            //     console.log('request.member?.id ', request.member?.id)
            //     let params = {
            //         headers: { user: request.member?.id },
            //         method: 'update',
            //         path: `/${document.collection}/${document.id}`,
            //         document: { ...input },
            //     }
            //     // return await processRequest(params)
            // }
            // request.queue.created.push(uploadAssetsToCreatedDocument)

            return input
        }

        let { originalDocument, id } = request
        // Check to see if the URL passed is the same as the stored URL
        if (input == originalDocument?.[this._name] || input == null) return input

        let processedField = await this.upload({
            remoteUrl: input,
            id,
            req: request,
            document: originalDocument,
            index,
            parentValue
        })

        return processedField
    },
}));


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/customField.js"
/*!**************************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/customField.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({

    type: 'String',

});


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/file.js"
/*!*******************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/file.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _cms_1_build_fields_createField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @cms/1. build/fields/createField */ "./src/cms/1. build/fields/createField.js");
/* harmony import */ var _cms_1_build_fields_defaultFields_asset__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @cms/1. build/fields/defaultFields/asset */ "./src/cms/1. build/fields/defaultFields/asset.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_cms_1_build_fields_createField__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_cms_1_build_fields_defaultFields_asset__WEBPACK_IMPORTED_MODULE_2__["default"])({
    type: 'File',
    name: 'file',

    fields: {
        filename: { type: 'String' },
        size: { type: 'Int' },
        mimetype: { type: 'String' },
        extension: { type: 'String' },
        url: {},
    },

    async transformFile({ value, file, extension, tempPath, remoteUrl }) {
        const stats = await fs__WEBPACK_IMPORTED_MODULE_0___default().promises.stat(tempPath)
        const mimetype = value?.file?.mimetype || 'application/octet-stream'
        let filename = value?.file?.name || tempPath.split('/').pop()
        filename = filename.split('-----')[0] + '.' + extension

        return {
            file: await fs__WEBPACK_IMPORTED_MODULE_0___default().promises.readFile(tempPath),
            extension,
            fieldData: {
                filename,
                size: stats.size,
                mimetype,
                extension
            }
        }
    },
})));


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/image.js"
/*!********************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/image.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var sharp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sharp */ "sharp");
/* harmony import */ var sharp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sharp__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _cms_1_build_fields_createField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @cms/1. build/fields/createField */ "./src/cms/1. build/fields/createField.js");
/* harmony import */ var _cms_1_build_fields_defaultFields_asset__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @cms/1. build/fields/defaultFields/asset */ "./src/cms/1. build/fields/defaultFields/asset.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_cms_1_build_fields_createField__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_cms_1_build_fields_defaultFields_asset__WEBPACK_IMPORTED_MODULE_2__["default"])({

    type: 'Image',
    name: 'image',

    fields: {
        width: { type: 'Int' },
        height: { type: 'Int' },
        url: {},
    },

    async transformFile({ value, file, extension, tempPath, remoteUrl }) {

        if (extension == 'png') {
            let newFile = await sharp__WEBPACK_IMPORTED_MODULE_0___default()(tempPath)
                .withMetadata()    // This ensures that metadata (including EXIF orientation) is kept
                .rotate()          // This applies the EXIF orientation
                .resize(
                    this.width,
                    this.height,
                    { withoutEnlargement: true }
                )
                .png({
                    quality: this.quality || 80,
                    optimiseCoding: true,
                    optimiseScans: true
                })
                .toBuffer({ resolveWithObject: true })

            // let {width, height} = await newFile.metadata()
            let { width, height } = newFile.info
            extension = 'png'

            return {
                file: newFile.data,
                extension,
                fieldData: {
                    width,
                    height
                }
            }

        } else {
            let newFile = await sharp__WEBPACK_IMPORTED_MODULE_0___default()(tempPath)
                .withMetadata()    // This ensures that metadata (including EXIF orientation) is kept
                .rotate()          // This applies the EXIF orientation
                .resize(
                    this.width,
                    this.height,
                    { withoutEnlargement: true }
                )
                .jpeg({
                    quality: this.quality || 80,
                    optimiseCoding: true,
                    optimiseScans: true
                })
                .toBuffer({ resolveWithObject: true })

            // let {width, height} = await newFile.metadata()
            let { width, height } = newFile.info
            extension = 'jpg'

            return {
                file: newFile.data,
                extension,
                fieldData: {
                    width,
                    height
                }
            }
        }

    },

})));


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/parents.js"
/*!**********************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/parents.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../1. build/libraries/mongo */ "./src/cms/1. build/libraries/mongo.js");
/* harmony import */ var _collections__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../collections */ "./src/cms/1. build/collections/index.js");
/* harmony import */ var _createField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../createField */ "./src/cms/1. build/fields/createField.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createField__WEBPACK_IMPORTED_MODULE_2__["default"])({
    // name: 'relationship',
    data() {
        return {
            type: `[${this.titleCollection}]`,
            inputType: 'String',
        }
    },
    beforeCreate() {
        this.titleCollection = this.collection.charAt(0).toUpperCase() + this.collection.slice(1)
    },
    expireCache: 0,
    async computed(document, request) {

        // console.log(`Getting Parent`)

        if (request.fetchingParent) return null
        if (request.relatedDepth) return null

        let parents = request.parents
        parents.push(document)

        let { collection } = this
        collection = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].find(c => c._singular == collection)
        collection = collection._name

        console.log(`Getting ${this.collection} Parent`, parents.map(p => p.title))
        await new Promise(resolve => setTimeout(resolve, 1000));

        let { id } = document
        // let search = {}
        // search[this.field] = { $in: [id] }

        // let search = { where: `this.${this.field} && this.${this.field}.length && this.${this.field}.includes("${id}")` }

        // console.log('search', search)

        // let relationRequest = { ...request.req, parents, fields: ['title', 'id'], method: 'read', path: `/${collection}`, body: { search }, fetchingParent: { field: this.field, collection } }
        // let relatedDocuments = (await processRequest(relationRequest))?.response

        let search = { collection, search: {}, fields: ['title', 'id'] }
        search.search[this.field] = id
        console.log('p search', search)
        let relatedDocuments = await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntries)(search)
        relatedDocuments = relatedDocuments.map(d => d.id)

        console.log('relatedDocuments', relatedDocuments)

        return this.single ? relatedDocuments?.[0] : relatedDocuments

    },
}));


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/plainText.js"
/*!************************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/plainText.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({

    type: 'String',

});


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/relationship.js"
/*!***************************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/relationship.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _2_process_0_main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../2. process/0. main */ "./src/cms/2. process/0. main.js");
/* harmony import */ var _collections__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../collections */ "./src/cms/1. build/collections/index.js");
/* harmony import */ var _createField__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../createField */ "./src/cms/1. build/fields/createField.js");




const { ForbiddenError, ValidationError } = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");

// import RelationshipVue from './Relationship.vue'

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_createField__WEBPACK_IMPORTED_MODULE_3__["default"])({
    name: 'relationship',
    default: [],
    data() {
        return {
            // titleCollection: this.collection.charAt(0).toUpperCase() + this.collection.slice(1),
            type: this.single ? this.titleCollection : `[${this.titleCollection}]`,
            inputType: this.single ? 'String' : '[String]',
            limit: this.single ? 1 : this.limit
        }
    },
    beforeCreate() {
        this.titleCollection = this.collection.charAt(0).toUpperCase() + this.collection.slice(1)
    },
    async translateInput(value, { request }) {

        // console.log('value', value)

        if (!value) return []

        let { collection } = this
        collection = _collections__WEBPACK_IMPORTED_MODULE_2__["default"].find(c => c._singular == collection)

        let ids = []

        if (this.single) {

            if (typeof (value) == 'string') { ids = [value] }
            else if (Array.isArray(value) && value[0]?.id) { ids = [value[0].id] }
            else if (Array.isArray(value)) { ids = [value[0]] }
            else if (typeof (value) == 'object' && value.id) { ids = [value.id] }
            else { console.error(`${this.type} should be an Array or String.`) }

        } else {

            if (typeof (value) == 'string') { ids = [value] }
            if (Array.isArray(value)) { ids = value }
            // if (typeof (value) == 'object') { ids = [(await processRequest({ method: 'create', path: `/${collection._name}`, body: value })).response.id] }

        }

        let validIds = []
        let invalidIds = ids

        let relationRequest = { method: 'read', path: `/${collection._name}`, body: { limit: 9999, search: { id: { $in: ids } } }, fields: ['id'], member: request.member }

        let response = await (0,_2_process_0_main__WEBPACK_IMPORTED_MODULE_1__.processRequest)(relationRequest)
        let documents = response?.response
        if (Array.isArray(documents) && documents.length) {
            validIds = ids.filter(id => documents.map(d => String(d.id)).includes(id))
            invalidIds = ids.filter(id => documents.map(d => !String(d.id)).includes(id))
        }
        // console.log('documents', documents)

        let warnings = []
        warnings.push(`Field ${this.type} for entry in ${collection._name} contained the following invalid IDs: ${invalidIds}`)

        // if (collection._name == 'members') {
        //     console.log(validIds, invalidIds, documents, response, relationRequest.body.search)
        // }

        return validIds || []
    },
    async translateOutput(value, { request, document }) {


        if (request.fetchingParent) return value
        if (!Array.isArray(value)) return []
        let ids = value

        // console.log('relationship.js', this.collection, request.apiMethod, ids)

        /*
            GraphQL child queries are handled in apollo.js
        */
        if (request.apiMethod == 'graphql') return ids

        let { collection, _name: fieldName } = this
        // console.log('relationship.js', collection, fieldName)
        collection = _collections__WEBPACK_IMPORTED_MODULE_2__["default"].find(c => c._singular == collection)

        /*
            REST DEPTH CHECK
        */
        request.relatedDepth = request?.relatedDepth || 1
        let depth = request.relatedDepth
        let depthLimit = request?.depthLimit > -1 ? request?.depthLimit : collection?.depthLimit || 1 // false

        // console.log('depthLimit', depthLimit, collection?.depthLimit, depth, request?.depthLimit, `/${collection._name}`)

        if (depthLimit !== false && depthLimit < depth) return this.single ? { id: ids[0] } : ids.map(id => ({ id }))

        let parents = request.parents
        parents.push(document.id)

        let fetchedRelationships = request.fetchedRelationships
        fetchedRelationships.push(document)

        // console.log(`Getting ${this.collection} Relationships`, parents.map(p => p.title))
        // await new Promise(resolve => setTimeout(resolve, 1000));

        // console.log('ids', ids)

        /*
            // Uncomment to enable circular death
            let cachedEntries = ids.filter(id => fetchedRelationships.some(p => p.id == id)).map(id => fetchedRelationships.find(p => p.id == id))
            cachedEntries = JSON.parse(JSON.stringify(cachedEntries))
            let circularIds = ids.filter(id => parents.includes(id))
            ids = ids.filter(id => !cachedEntries.some(e => e.id == id) && !circularIds.includes(id))
        */

        // Failing to delete the fields from a rest request resulted in no results for related documents in the query below
        let fields = request.relationshipFields?.[fieldName] || []
        if (!fields.length) fields = undefined


        let relationRequest = {
            ...request.req,
            fields,
            member: request.member || null,
            headers: request.req?.headers,
            query: null,
            page: 0,
            limit: 9999,
            document: null,
            parents: [...parents],
            fetchedRelationships,
            relatedDepth: depth + 1,
            method: 'read',
            path: `/${collection._name}`,
            body: {
                limit: 9999,
                page: 0,
                depthLimit,
                search: {
                    id: { $in: ids }
                }
            }
        }
        // if (relationRequest.path == '/people') {
        //     console.log('relationRequest', relationRequest.headers, relationRequest.body.search)
        // }

        let children = (
            await (0,_2_process_0_main__WEBPACK_IMPORTED_MODULE_1__.processRequest)(relationRequest)
                .catch(e => {
                    console.log('getting children', collection._name, ids, document.id)
                    console.error(e.stack);
                    throw new ForbiddenError(`${e} which is referenced as a relation in the ${this._name} field.`.replace('.', ''))
                })
        ).response

        // console.log('children', children)

        // Sort children according to their related order
        if (Array.isArray(children) && children.length) {
            children = children.sort((a, b) => ids.findIndex(i => i == a.id) > ids.findIndex(i => i == b.id) ? 1 : -1)
            // request.parents =
        }

        let documentsToReturn = children
        // let documentsToReturn = [...circularIds, ...cachedEntries, ...children]

        return this.single ? documentsToReturn[0] : documentsToReturn
    }
}));


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/richText.js"
/*!***********************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/richText.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({

    type: 'String',
    name: 'richText'

});


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/select.js"
/*!*********************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/select.js ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    props: ['single', 'options'],
    type: 'String',
    name: 'select',
    single: true,
    data() {
        return {
            type: this.single ? this.type : `[${this.type}]`,
            caseSensitive: this.caseSensitive ?? false,
        }
    },
    validate(input) {
        input = Array.isArray(input) ? input : [input]
        input = this.caseSensitive ? input : input.map(i => i.toLowerCase())

        // let optionKeys = Array.isArray(this.options) ? this.options : Object.keys(this.options)
        let optionValues = Array.isArray(this.options) ? this.options : Object.values(this.options)
        if (typeof (optionValues?.[0]) === 'object') optionValues = optionValues.map(o => o.value)
        optionValues = this.caseSensitive ? optionValues : optionValues.map(o => o.toLowerCase())

        let valid = input.every(v => optionValues.includes(v))
        let invalidOptions = input.filter(v => !optionValues.includes(v))

        let response = invalidOptions.length > 1 ? `"${invalidOptions}" are not valid options.` : `"${invalidOptions}" is not a valid option.`
        return { valid, response }
    },
    translateInput(input) {
        input = Array.isArray(input) ? input : [input]
        input = this.caseSensitive ? input : input.map(i => i.toLowerCase())
        return this.single ? input[0] : input
    }
});


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/timestamp.js"
/*!************************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/timestamp.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    type: 'DateTime',
    validate: input => {
        let valid = input && new Date(input) != 'Invalid Date'
        let response = input ? `new Date(input) returns Invalid Date. (input: ${input})` : 'input cannot be null'
        return { valid, response }
    },
    translateInput: input => new Date(input)
});


/***/ },

/***/ "./src/cms/1. build/fields/defaultFields/toggle.js"
/*!*********************************************************!*\
  !*** ./src/cms/1. build/fields/defaultFields/toggle.js ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    type: Boolean,
});


/***/ },

/***/ "./src/cms/1. build/fields/index.js"
/*!******************************************!*\
  !*** ./src/cms/1. build/fields/index.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createField__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createField */ "./src/cms/1. build/fields/createField.js");


function requireAll(r) {
    return Object.fromEntries(
        r.keys().map(function (mpath, ...args) {
            const result = r(mpath, ...args);
            const name = mpath
                .replace(/(?:^[.\/]*\/|\.[^.]+$)/g, "") // Trim
                .replace(/\//g, "_"); // Relace '/'s by '_'s
            return [name, result];
        })
    );
}

let defaultFields = requireAll(
    __webpack_require__("./src/cms/1. build/fields/defaultFields sync recursive .*\\.js$")
);

let userFields = requireAll(
    __webpack_require__("../../mango/fields sync recursive .*\\.js$")
);

function processFields(allFields) {
    let fields = Object.keys(allFields).reduce((a, fieldName) => {
        if (fieldName != "index") {
            let modules = allFields[fieldName];
            let titleName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            titleName = titleName.replace("_index", "");
            let field = modules.default;

            // If this field has alreay been registered... (createField)
            if (typeof modules.default === "function") {
                a[titleName] = field;
            } else {
                // console.log('{...field, _type: fieldName}', {...field, _type: fieldName})
                // if (!field.type) {field.type = titleName}
                a[titleName] = (0,_createField__WEBPACK_IMPORTED_MODULE_0__["default"])(field);
            }
        }
        return a;
    }, {});

    return fields;
}

function generateDefaultFields() {
    return processFields(defaultFields);
}

function generateUserFields() {
    return processFields(userFields);
}

defaultFields = processFields(defaultFields);
userFields = processFields(userFields);
const allFields = { ...defaultFields, ...userFields };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (allFields);


/***/ },

/***/ "./src/cms/1. build/graphql/apollo.js"
/*!********************************************!*\
  !*** ./src/cms/1. build/graphql/apollo.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _2_process_0_main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../2. process/0. main */ "./src/cms/2. process/0. main.js");
/* harmony import */ var _collections__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../collections */ "./src/cms/1. build/collections/index.js");
/* harmony import */ var graphql_fields__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! graphql-fields */ "graphql-fields");
/* harmony import */ var graphql_fields__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(graphql_fields__WEBPACK_IMPORTED_MODULE_2__);
const { gql, PubSub, withFilter } = __webpack_require__(/*! apollo-server */ "apollo-server");



const { GraphQLScalarType, Kind } = __webpack_require__(/*! graphql */ "graphql");

const {
    parseResolveInfo,
    simplify
} = __webpack_require__(/*! graphql-parse-resolve-info */ "graphql-parse-resolve-info");

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
    },
    parseValue(value) {
        return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
        }
        return null; // Invalid hard-coded value (not an integer)
    },
});

// import { PubSub } from 'apollo-server';
// const pubsub = new PubSub();

function generateGql() {

    // console.log('_test', collections.find(c => c.singular == 'test'))
    const allFields = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].reduce((acc, collection) => {
        for (const fieldModel of collection._fieldsArray) {
            if (!acc.some(accField => accField._titleType == fieldModel._titleType)) {
                acc.push(fieldModel)
            }
        }
        return acc
    }, [])

    // Start the type string
    let typeDefString = `
    scalar DateTime

    directive @collectionProtected on OBJECT
    directive @fieldProtected on FIELD_DEFINITION

    type Delete {
        deleted: Int
    }

    ${_collections__WEBPACK_IMPORTED_MODULE_1__["default"].filter(c => c.subscribe).length ? `
    type Subscription {
        ${_collections__WEBPACK_IMPORTED_MODULE_1__["default"].filter(c => c.subscribe).map(c => {
        let eventName = `${c._singular}Change`
        return `
            ${eventName}(id: ID): ${c._titleSingular}
            `
    }).join('\n\n')}
    }
    ` : ''}


    input compareInt {
        notEqualTo: Int
        greaterThan: Int
        lessThan: Int
        in: [Int]
        notIn: [Int]
        not: Int
        exists: Boolean
        includesAll: [Int]
        eachIn: [Int]
        and: [compareInt]
        or: [compareInt]
        length: Int
    }

    input compareFloat {
        notEqualTo: Float
        greaterThan: Float
        lessThan: Float
        in: [Float]
        notIn: [Float]
        not: Float
        exists: Boolean
        includesAll: [Float]
        eachIn: [Float]
        and: [compareFloat]
        or: [compareFloat]
        length: Float
    }

    input compareDateTime {
        notEqualTo: DateTime
        greaterThan: DateTime
        lessThan: DateTime
        in: [DateTime]
        notIn: [DateTime]
        not: DateTime
        exists: Boolean
        includesAll: [DateTime]
        eachIn: [DateTime]
        and: [compareDateTime]
        or: [compareDateTime]
        length: DateTime
    }

    input compareString {
        notEqualTo: String
        greaterThan: String
        lessThan: String
        in: [String]
        notIn: [String]
        not: String
        exists: Boolean
        hasValue: Boolean
        includesAll: [String]
        eachIn: [String]
        and: [compareString]
        or: [compareString]
        length: Int
    }

    input compareStringArray {
        length: Int
        exists: Boolean
        someIn: [String]
        noneIn: [String]
        includesAll: [String]
        eachIn: [String]
    }

    input compareIntArray {
        length: Int
        exists: Boolean
        someIn: [String]
        noneIn: [String]
        includesAll: [String]
        eachIn: [String]
    }

    input compareFloatArray {
        length: Float
        exists: Boolean
        someIn: [String]
        noneIn: [String]
        includesAll: [String]
        eachIn: [String]
    }

    input compareBoolean {
        notEqualTo: Boolean
        not: Boolean
        exists: Boolean
        hasValue: Boolean
    }


    `

    // Define the data models
    _collections__WEBPACK_IMPORTED_MODULE_1__["default"].forEach(collection => {

        typeDefString += collection._typeSchema
        typeDefString += collection._createSchema
        typeDefString += collection._updateSchema
        typeDefString += collection._querySchema
        typeDefString += collection._sortSchema
        typeDefString += collection._mutationResponseSchemaPlural
        typeDefString += collection._mutationResponseSchemaSingular

    })
    typeDefString += '\n\n'

    // Define them for fields
    allFields.forEach(field => {
        typeDefString += field._typeSchema
        typeDefString += field._createSchema
        typeDefString += field._updateSchema
        typeDefString += field._querySchema
    })
    typeDefString += '\n\n'

    // Define the query types
    typeDefString += `type Query {\n`
    typeDefString += _collections__WEBPACK_IMPORTED_MODULE_1__["default"].map(collection => `
        ${collection._queryDefinitionPlural}
        ${collection._queryDefinitionSingular}
    `).join('\n')
    typeDefString += `}\n\n`

    // Define the mutation types
    typeDefString += `type Mutation {\n`
    typeDefString += _collections__WEBPACK_IMPORTED_MODULE_1__["default"].map(collection => `
        ${collection._createDefinitionPlural}
        ${collection._updateDefinitionPlural}
        ${collection._deleteDefinitionPlural}
        ${collection._createDefinitionSingular}
        ${collection._updateDefinitionSingular}
        ${collection._deleteDefinitionSingular}
    `).join('')
    typeDefString += `}\n\n`

    // console.log('typeDefString', typeDefString)

    // Construct a schema, using GraphQL schema language
    const typeDefs = gql`${typeDefString}`;

    // Resolver for all queries
    let globalQueryResolver = async function (parent, args, req, info) {

        // console.dir(gql`${req.body.query}`, { depth: null })
        const topLevelFields = Object.keys(graphql_fields__WEBPACK_IMPORTED_MODULE_2___default()(info))

        // const parsedResolveInfoFragment = parseResolveInfo(info);
        // let fields = parsedResolveInfoFragment.fieldsByTypeName
        // topLevelFields = topLevelFields || Object.keys(fields[Object.keys(fields)[0]])
        // console.log('topLevelFields', topLevelFields)

        // console.log('fields', fields)

        // Temp fix for computed issue
        if (topLevelFields.includes('bodyMin')) { topLevelFields.push('body') }
        if (topLevelFields.includes('descriptionMin')) { topLevelFields.push('description') }
        if (topLevelFields.includes('trendingScore')) { topLevelFields.push('hits') }

        // Get the collection info from the query
        let collection = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].find(c => [c._name, c._singular].includes(info.fieldName))
        let single = info.fieldName == collection._singular ? true : false

        // Create the request and get the documents
        // let member = req.member || await getMember(req)
        let request = { ...req, headers: req.headers, method: 'read', path: `/${collection._name}`, body: { ...args }, fields: topLevelFields }
        let documents = (await (0,_2_process_0_main__WEBPACK_IMPORTED_MODULE_0__.processRequest)(request)).response
        // console.log('documents', documents)

        // Sort for relationships
        if (args.limit == 9999 && !args.sort && args.search?.compareId?.in?.length) {
            let ids = args.search.compareId.in
            documents = documents.sort((a, b) => ids.findIndex(i => i == a.id) > ids.findIndex(i => i == b.id) ? 1 : -1)
        }

        return single ? documents[0] : documents

    }

    // Resolver for mutations
    let globalMutationResolver = async function (parent, args, req, info) {

        let mutationType = info.fieldName.substring(0, 6)
        let collectionTitleName = info.fieldName.substring(6)
        let collectionResponseName = collectionTitleName.charAt(0).toLowerCase() + collectionTitleName.slice(1)

        let mutationMap = {
            create: 'create',
            update: 'update',
            delete: 'delete'
        }

        let method = mutationMap[mutationType]
        let collection = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].find(c => [c._titleSingular, c._titleName].includes(collectionTitleName))
        let single = collectionTitleName == collection._titleSingular ? true : false

        let id = args?.id || args?.input?.id
        let draft = args?.draft
        let documents = Array.isArray(args.input) ? args.input : [args.input]

        let path = id ? `/${collection._name}/${id}` : `/${collection._name}`

        /*

            This bit below here needs to be fixed
            it's running processRequest for each
            document passed (if we're creating
            multiple), and then joining them in an
            array for the response, or passing back
            the first of the array if it's a single

        */

        let response = {}
        let results = []
        for (const body of documents) {
            let request = { ...req, headers: req.headers, method, path, body, draft }
            let result = (await (0,_2_process_0_main__WEBPACK_IMPORTED_MODULE_0__.processRequest)(request))
            results.push(result)
        }

        if (method == 'delete') {
            response.deleted = results.reduce((acc, result) => acc += result.deleted, 0)
            response.success = results.every(result => result.deleted == 1)
        } else {
            response.success = results.every(result => result.success)
        }

        // console.dir(results[0].response, {depth: null})

        response[collectionResponseName] = single ? results[0].response : results.map(result => result.response)

        // if (collection.subscribe) {
        //     let handler = {}
        //     handler[`${collection._singular}Change`] = response[collectionResponseName]
        //     pubsub.publish(collection._titleSingular, handler);
        // }

        return response
    }

    // build query resolvers from collections
    let queryResolversPlural = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].reduce((acc, { _name }) => { acc[_name] = globalQueryResolver; return acc }, {})
    let queryResolversSingular = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].reduce((acc, { _singular }) => { acc[_singular] = globalQueryResolver; return acc }, {})

    // build mutation resolvers from collections
    let createResolvers = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].reduce((acc, { _mutation }) => { acc[_mutation] = globalMutationResolver; return acc }, {})
    let updateResolvers = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].reduce((acc, { _titleName }) => { acc[`update${_titleName}`] = globalMutationResolver; return acc }, {})
    let deleteResolvers = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].reduce((acc, { _titleName }) => { acc[`delete${_titleName}`] = globalMutationResolver; return acc }, {})
    let createResolversSingular = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].reduce((acc, { _titleSingular }) => { acc[`create${_titleSingular}`] = globalMutationResolver; return acc }, {})
    let updateResolversSingular = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].reduce((acc, { _titleSingular }) => { acc[`update${_titleSingular}`] = globalMutationResolver; return acc }, {})
    let deleteResolversSingular = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].reduce((acc, { _titleSingular }) => { acc[`delete${_titleSingular}`] = globalMutationResolver; return acc }, {})

    // GraphQL Relationship Resolver
    let generateGqlRelationshipResolver = (f) => (p, a, r, i) => {

        if (!p[f._name]?.length) return null
        a.search = a.search || {}

        if (f.single) {
            i.fieldName = f.collection
            a.search.id = p[f._name][0]
        } else {
            i.fieldName = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].find(c => c._singular == f.collection)._name
            a.search.compareId = { in: p[f._name] }
        }

        a.limit = a.limit || 9999
        return globalQueryResolver(p, a, r, i)

    }

    let containsRelationship = function (field) {
        if (field?._fieldsArray?.length) return field._fieldsArray.some(f => containsRelationship(f))
        return field.name == 'relationship'
    }

    let relationshipReducer = (a, f) => {
        a[f._name] = generateGqlRelationshipResolver(f)
        return a
    }

    let complexRelationshipReducer = (a, f) => {
        if (containsRelationship(f) && f._fieldsArray?.length) f._fieldsArray.filter(f => containsRelationship(f)).reduce(complexRelationshipReducer, a)
        let complexName = f._titleType.includes('[') ? f._titleType.replace('[', '').replace(']', '') : f._titleType
        if (f.name != 'relationship') { a[complexName] = f._fieldsArray.filter(f => f.name == 'relationship').reduce(relationshipReducer, {}) }
        return a
    }

    // Relationship Resolvers
    let relationshipResolvers = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].reduce((acc, c) => {

        let relationships = c._fieldsArray.filter(f => f.name == 'relationship').reduce(relationshipReducer, {})
        acc[c._titleSingular] = relationships
        return acc

    }, {})

    // Complex Relationship Resolvers
    let complexResolvers = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].reduce((acc, c) => {

        let complex = c._fieldsArray.filter(f => containsRelationship(f)).reduce(complexRelationshipReducer, {})
        return { ...acc, ...complex }

    }, {})

    // console.log('relationshipResolvers', relationshipResolvers)
    // console.log('complexResolvers', complexResolvers)

    let queryResolvers = { ...queryResolversPlural, ...queryResolversSingular }
    let mutationResolvers = {
        ...createResolvers,
        ...updateResolvers,
        ...deleteResolvers,
        ...createResolversSingular,
        ...updateResolversSingular,
        ...deleteResolversSingular
    }


    let subscriptionResolvers = _collections__WEBPACK_IMPORTED_MODULE_1__["default"].filter(c => c.subscribe).reduce((acc, c) => {

        let eventName = `${c._singular}Change`
        // console.log('eventName', eventName)
        let subscription = {}
        subscription[eventName] = {
            subscribe: withFilter(
                () => _2_process_0_main__WEBPACK_IMPORTED_MODULE_0__.pubsub.asyncIterator(eventName),
                (payload, variables) => {
                    console.log('Payload:', payload);
                    console.log('Variables:', variables);

                    // If no variables are provided, listen to the whole collection
                    if (!variables || Object.keys(variables).length === 0) {
                        return true;
                    }

                    // Check if all variables match with the corresponding payload fields
                    return Object.keys(variables).every(key => {
                        return payload[eventName][key] == variables[key];
                    });
                }
            )
        }



        return { ...acc, ...subscription }

    }, {})

    // console.log('subscriptionResolvers', subscriptionResolvers)


    const resolvers = {
        DateTime: dateScalar,

        Query: queryResolvers,
        ...relationshipResolvers,
        ...complexResolvers,

        Mutation: mutationResolvers,

        // Subscription: subscriptionResolvers,
    };

    if (_collections__WEBPACK_IMPORTED_MODULE_1__["default"].filter(c => c.subscribe).length) resolvers.Subscription = subscriptionResolvers

    // console.log('resolvers', resolvers)

    return { typeDefs, resolvers }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (generateGql);


/***/ },

/***/ "./src/cms/1. build/helpers/download.js"
/*!**********************************************!*\
  !*** ./src/cms/1. build/helpers/download.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var stream__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! stream */ "stream");
/* harmony import */ var stream__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(stream__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! util */ "util");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_3__);




const finished = (0,util__WEBPACK_IMPORTED_MODULE_3__.promisify)(stream__WEBPACK_IMPORTED_MODULE_2__.finished)

async function downloadFile(fileUrl, outputLocationPath) {
    let targetFolder = outputLocationPath.split('/')
    targetFolder = targetFolder.slice(0, targetFolder.length - 1).join('/')
    // let testFolder = (`${__dirname}/../../../../../testing`)
    // if (!fs.existsSync(testFolder)) fs.mkdirSync(testFolder)
    if (!fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync('tmp')) fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync('tmp')
    if (!fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(targetFolder)) fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(targetFolder)
    const writer = fs__WEBPACK_IMPORTED_MODULE_0___default().createWriteStream(outputLocationPath)
    return axios__WEBPACK_IMPORTED_MODULE_1___default()({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(async (response) => {
        response.data.pipe(writer)
        return await finished(writer) //this is a Promise
    })
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (downloadFile);


/***/ },

/***/ "./src/cms/1. build/helpers/email.js"
/*!*******************************************!*\
  !*** ./src/cms/1. build/helpers/email.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   sendBulkEmail: () => (/* binding */ sendBulkEmail)
/* harmony export */ });
let settings = __webpack_require__(/*! @mango/config/settings.json */ "../../mango/config/settings.json")

const API_KEY = settings?.emailProvider == 'mailgun' ? settings.mailgunKey : settings.resendKey
const DOMAIN = settings?.mailgunDomain || settings?.emailDomain

const formData = __webpack_require__(/*! form-data */ "form-data")
const Mailgun = __webpack_require__(/*! mailgun.js */ "mailgun.js")
const { Resend } = __webpack_require__(/*! resend */ "resend")

const _mailgun = async function ({ to, from, body, html, subject, replyTo, tag, cc, bcc, attachment }) {
	html = html || body
	if (!API_KEY) return console.error('Mailgun not configured')

	const mailgun = new Mailgun(formData)
	const client = mailgun.client({ username: 'api', key: API_KEY })

	let data = {
		from: from || settings.emailFrom,
		to,
		subject,
		html: html,
		'o:dkim': 'yes',
	}

	if (replyTo) data['h:Reply-To'] = replyTo
	if (tag) data['o:tag'] = tag
	if (bcc) data.bcc = bcc
	if (cc) data.cc = cc
	if (attachment) data.attachment = attachment

	// return await mailgun.messages().send(data)
	return await client.messages.create(DOMAIN, data)
}

const _resend = async function ({ to, from, body, html, subject, replyTo, tag, cc, bcc, attachment, headers, text }) {
	html = html || body
	if (!API_KEY) return console.error('Resend not configured')

	const resend = new Resend(API_KEY)

	// Parse email addresses - Resend expects simple string format
	const parseEmail = (email) => {
		if (!email) return undefined
		// If email contains name <email@domain.com> format, extract just the email
		const emailMatch = email.match(/<([^>]+)>/)
		return emailMatch ? emailMatch[1] : email
	}

	// Parse email with name - Resend can accept "Name <email@domain.com>" format directly
	const parseEmailWithName = (email, fallback) => {
		if (!email && !fallback) return undefined
		const emailToUse = email || fallback
		return emailToUse
	}

	const toEmails = Array.isArray(to) ? to : [to]
	const emailPayload = {
		from: parseEmailWithName(from, settings.emailFrom),
		to: toEmails.map((email) => parseEmailWithName(email)),
		subject: subject,
		text: text,
		html: html,
	}

	if (replyTo) emailPayload.replyTo = [parseEmailWithName(replyTo)]
	if (tag) {
		// Resend requires tags to have both name and value properties
		const tags = Array.isArray(tag) ? tag : [tag]
		emailPayload.tags = tags.map((t, index) => ({
			name: typeof t === 'string' ? `tag_${index}` : t.name || `tag_${index}`,
			value:
				typeof t === 'string'
					? t
							.toLowerCase()
							?.trim()
							?.replace(/[^a-zA-Z0-9\s]/g, '')
							?.replace(/\s/g, '-')
					: t.value
							.toLowerCase()
							?.trim()
							?.replace(/[^a-zA-Z0-9\s]/g, '')
							?.replace(/\s/g, '-') || '',
		}))
	}
	if (headers) emailPayload.headers = headers

	if (cc) {
		const ccEmails = Array.isArray(cc) ? cc : [cc]
		emailPayload.cc = ccEmails.map((email) => parseEmailWithName(email))
	}

	if (bcc) {
		const bccEmails = Array.isArray(bcc) ? bcc : [bcc]
		emailPayload.bcc = bccEmails.map((email) => parseEmailWithName(email))
	}

	if (attachment) {
		const attachments = Array.isArray(attachment) ? attachment : [attachment]
		emailPayload.attachments = attachments.map((file) => ({
			filename: file.filename,
			content: file.data || file, // Resend expects base64 encoded content
		}))
	}

	let response = await resend.emails.send(emailPayload)
	return response?.data || response
}

const sendEmail = settings.emailProvider == 'mailgun' ? _mailgun : _resend

const sendBulkEmail = async function (emails) {
	// emails = Array.isArray(emails) ? emails : [emails]
	if (!settings?.resendKey) return console.error('Resend not configured, please add "resendKey" to settings.json')

	const resend = new Resend(settings.resendKey)

	const parseEmailWithName = (email, fallback) => {
		if (!email && !fallback) return undefined
		const emailToUse = email || fallback
		return emailToUse
	}

	// Transform array of email objects to Resend batch format
	const batchPayload = emails.map((email) => {
		let { to, from, body, html, subject, replyTo, tag, cc, bcc, headers, text } = email

		html = html || body

		const toEmails = Array.isArray(to) ? to : [to]
		const emailPayload = {
			from: parseEmailWithName(from, settings.emailFrom),
			to: toEmails.map((email) => parseEmailWithName(email)),
			subject: subject,
			html: html,
			text: text,
		}

		if (replyTo) emailPayload.replyTo = [parseEmailWithName(replyTo)]
		if (tag) {
			// Resend requires tags to have both name and value properties
			const tags = Array.isArray(tag) ? tag : [tag]
			emailPayload.tags = tags.map((t, index) => ({
				name: typeof t === 'string' ? `tag_${index}` : t.name || `tag_${index}`,
				value:
					typeof t === 'string'
						? t
								.toLowerCase()
								?.trim()
								?.replace(/[^a-zA-Z0-9\s]/g, '')
								?.replace(/\s/g, '-')
						: t.value
								.toLowerCase()
								?.trim()
								?.replace(/[^a-zA-Z0-9\s]/g, '')
								?.replace(/\s/g, '-') || '',
			}))
		}
		if (headers) emailPayload.headers = headers

		if (cc) {
			const ccEmails = Array.isArray(cc) ? cc : [cc]
			emailPayload.cc = ccEmails.map((email) => parseEmailWithName(email))
		}

		if (bcc) {
			const bccEmails = Array.isArray(bcc) ? bcc : [bcc]
			emailPayload.bcc = bccEmails.map((email) => parseEmailWithName(email))
		}

		// Note: attachments are not supported in Resend batch API

		return emailPayload
	})

	return await resend.batch.send(batchPayload)
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sendEmail);


/***/ },

/***/ "./src/cms/1. build/helpers/upload.js"
/*!********************************************!*\
  !*** ./src/cms/1. build/helpers/upload.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mango_config_settings_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @mango/config/settings.json */ "../../mango/config/settings.json");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aws-sdk/client-s3 */ "@aws-sdk/client-s3");
/* harmony import */ var _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var mime_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mime-types */ "mime-types");
/* harmony import */ var mime_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(mime_types__WEBPACK_IMPORTED_MODULE_3__);





const upload = async function ({ path, filename, file }) {

    if (_mango_config_settings_json__WEBPACK_IMPORTED_MODULE_0__.s3AccessKeyId) {

        // Split the path
        const pathSegments = path.split('/');
        const bucketName = pathSegments[0]; // The first segment is the bucket name
        const objectKey = pathSegments.slice(1).join('/') + '/' + filename; // The rest is the object key
        const contentType = mime_types__WEBPACK_IMPORTED_MODULE_3___default().lookup(filename) || 'application/octet-stream';

        // Create an S3Client instance
        const s3Client = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_2__.S3Client({
            region: _mango_config_settings_json__WEBPACK_IMPORTED_MODULE_0__.s3Region,
            credentials: {
                accessKeyId: _mango_config_settings_json__WEBPACK_IMPORTED_MODULE_0__.s3AccessKeyId,
                secretAccessKey: _mango_config_settings_json__WEBPACK_IMPORTED_MODULE_0__.s3AccessKeySecret,
            }
        });

        const uploadParams = {
            Bucket: bucketName,
            Key: objectKey,
            Body: file,
            ContentType: contentType,
        };

        try {
            const response = await s3Client.send(new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_2__.PutObjectCommand(uploadParams));
            // Construct the location manually.
            const location = `https://${bucketName}.s3.${_mango_config_settings_json__WEBPACK_IMPORTED_MODULE_0__.s3Region}.amazonaws.com/${objectKey}`;
            return location;
        } catch (error) {
            console.error("Error uploading to S3:", error);
            throw error;
        }

    } else {
        // Strip the bucket name from the local path
        let localPath = path.split('/');
        localPath.splice(0, 1);
        localPath = localPath.join('/');

        let location = `${localPath}/${filename}`;

        // Make sure all the folders exist
        localPath.split('/').reduce((a, p) => {
            if (!fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(a)) fs__WEBPACK_IMPORTED_MODULE_1___default().mkdirSync(a);
            a = a + '/' + p;
            return a;
        });
        if (!fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(localPath)) fs__WEBPACK_IMPORTED_MODULE_1___default().mkdirSync(localPath);

        // Write the file and return the URL
        fs__WEBPACK_IMPORTED_MODULE_1___default().writeFileSync(location, file);
        return `https://${_mango_config_settings_json__WEBPACK_IMPORTED_MODULE_0__.domain}/${location}`;
    }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (upload);


/***/ },

/***/ "./src/cms/1. build/libraries/express.js"
/*!***********************************************!*\
  !*** ./src/cms/1. build/libraries/express.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   startExpress: () => (/* binding */ startExpress)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cors */ "cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _collections__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../collections */ "./src/cms/1. build/collections/index.js");
/* harmony import */ var _collections_createCollection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../collections/createCollection */ "./src/cms/1. build/collections/createCollection.js");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _graphql_apollo__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../graphql/apollo */ "./src/cms/1. build/graphql/apollo.js");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! socket.io */ "socket.io");
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(socket_io__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var cluster__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! cluster */ "cluster");
/* harmony import */ var cluster__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(cluster__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var socket_io_redis__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! socket.io-redis */ "socket.io-redis");
/* harmony import */ var socket_io_redis__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(socket_io_redis__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! os */ "os");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_12__);
const settings = __webpack_require__(/*! @mango/config/settings.json */ "../../mango/config/settings.json");
const multipart = __webpack_require__(/*! connect-multiparty */ "connect-multiparty");

















const totalCPUs = os__WEBPACK_IMPORTED_MODULE_12___default().cpus().length;
const workers = Math.max(
  1,
  Math.min(
    Number(settings.mangoThreads || 1), // default 1
    totalCPUs
  )
);



const {
    ForbiddenError,
    SchemaDirectiveVisitor,
} = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
const { defaultFieldResolver } = __webpack_require__(/*! graphql */ "graphql");

class isLoggedinDirective extends SchemaDirectiveVisitor {
    visitObject(obj) {
        const fields = obj.getFields();
        Object.keys(fields).forEach((fieldName) => {
            const field = fields[fieldName];
            const originalResolve = field.resolve || defaultFieldResolver;
            field.resolve = async function (...args) {
                const context = args[2];
                const user = context.user || "";
                if (!user) {
                    throw new ForbiddenError("Not Authorized");
                }
                const data = await originalResolve.apply(this, args);
                return data;
            };
        });
    }

    visitFieldDefinition(field) {
        const originalResolve = field.resolve || defaultFieldResolver;
        field.resolve = async function (...args) {
            // console.log('field', field)
            const context = args[2];
            const user = context.user || "";
            if (!user) {
                throw new ForbiddenError("Not Authorized");
            }
            const data = await originalResolve.apply(this, args);
            return data;
        };
    }
}

const resolveControllers = async function (controllers, app, path, io) {
    path = path || "";

    for (const key in controllers) {
        if (typeof controllers[key] != "function") {
            let newPath = path + key + "/";
            await resolveControllers(controllers[key], app, newPath);
        } else {
            let methods = key == '*' ? ['get', 'post', 'put', 'delete'] : [key]
            let resolver = controllers[key];
            // console.log('method', method)
            // console.log('path', path)
            for (let method of methods) {
                app[method](`/${settings.endpointSegment || 'endpoints'}/${path}`, multipart(), async (req, res, io) => {
                    try {
                        let response = await resolver(req, res, io);
                        res.send(response);
                    } catch (e) {
                        console.log("e", e);
                        res.send({
                            success: false,
                            message: e,
                        });
                    }
                });
            }
        }
    }
};

const startExpress = async function (main, controllers) {

    // console.log('controllers', controllers)

    // Make sure all the collections are built
    // collections.forEach(async c => await createCollection(c))
    for (const collection of _collections__WEBPACK_IMPORTED_MODULE_3__["default"]) {
        await (0,_collections_createCollection__WEBPACK_IMPORTED_MODULE_4__["default"])(collection);
    }

    let { typeDefs, resolvers } = (0,_graphql_apollo__WEBPACK_IMPORTED_MODULE_6__["default"])();

    const app = express__WEBPACK_IMPORTED_MODULE_0___default()();

    // Configure CORS based on settings
    const corsOrigins = settings.corsOrigins || "*";
    const corsOptions = corsOrigins === "*"
        ? {}
        : { origin: corsOrigins };

    app.use(cors__WEBPACK_IMPORTED_MODULE_1___default()(corsOptions));
    app.use(body_parser__WEBPACK_IMPORTED_MODULE_2___default().json({ limit: "500mb" }));
    app.use(express__WEBPACK_IMPORTED_MODULE_0___default().json({ limit: '500mb' }));
    app.use(body_parser__WEBPACK_IMPORTED_MODULE_2___default().urlencoded({ limit: "500mb", extended: true, parameterLimit: 1000000 }));
    // app.use(bodyParser.urlencoded({ extended: true }));
    const port = settings.port;

    // GraphQL Stuff
    const apolloServer = new apollo_server_express__WEBPACK_IMPORTED_MODULE_7__.ApolloServer({
        typeDefs,
        resolvers,
        schemaDirectives: {
            collectionProtected: isLoggedinDirective,
            fieldProtected: isLoggedinDirective,
            isLoggedin: isLoggedinDirective,
        },
        context: ({ req }) => {
            return req;
        },
        // formatResponse: (response, context) => {
        //     if (!response.data.__schema) {
        //         console.log('response.data.total', response.data.total)
        //         response.extensions = { total: 12 }
        //         return response
        //     }
        // }
    });
    apolloServer.applyMiddleware({ app });

    // Subscription endpoint
    const server = (0,http__WEBPACK_IMPORTED_MODULE_8__.createServer)(app);
    // Set up Socket.IO with CORS support
    const socketCorsOrigin = corsOrigins === "*" ? true : corsOrigins;
    const io = new socket_io__WEBPACK_IMPORTED_MODULE_9__.Server(server, {
        cors: {
            origin: socketCorsOrigin,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.adapter(socket_io_redis__WEBPACK_IMPORTED_MODULE_11___default()({ host: settings?.redisHost || 'localhost', port: settings?.redisPort || 6379 }));

    for (let c of _collections__WEBPACK_IMPORTED_MODULE_3__["default"].filter(c => c.subscribe)) {

        const namespace = io.of(`/${c.name}`);
        namespace.on('connection', (socket) => {

            console.log(`User connected: ${socket.id}`);

            // Handle subscription to a thread (joining a room)
            socket.on('subscribeToThread', (roomId) => {
                socket.join(roomId);  // roomId is the room name
                console.log(`User ${socket.id} subscribed to thread: ${roomId}`);
            });

            // Handle unsubscribing from a thread (leaving a room)
            socket.on('unsubscribeFromThread', (roomId) => {
                socket.leave(roomId);
                console.log(`User ${socket.id} unsubscribed from thread: ${roomId}`);
            });

            // Handle a new message being sent to a thread
            socket.on('newMessage', ({ roomId, message }) => {
                // Save the message in the "messages" collection in MongoDB (example)
                // Example: const newMessage = await Messages.create({ roomId, author, content });

                // Emit the message to all users in the thread (room)
                io.to(roomId).emit('message', message);
                console.log(`Message sent to thread ${roomId}: ${message.content}`);
            });

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
            });

        });

    }

    // server.listen(port);

    // apolloServer.installSubscriptionHandlers(ws);
    // ws.listen(port);

    if ((cluster__WEBPACK_IMPORTED_MODULE_10___default().isMaster) || (cluster__WEBPACK_IMPORTED_MODULE_10___default().isPrimary)) {

        // console.log(`Number of CPUs is ${totalCPUs}`);
        // console.log(`Master ${process.pid} is running`);
        process.env.isMaster = true

        // // Create the server in the master process
        // server.listen(port, 'localhost', () => {
        //     console.log(`Master server listening on port ${port}`);
        // });

        // Fork workers.
        for (let i = 0; i < workers; i++) {
            cluster__WEBPACK_IMPORTED_MODULE_10___default().fork();
        }

        const restartBudget = new Map(); // pid -> { count, last }

        function backoff(ms) { return new Promise(r => setTimeout(r, ms)); }

        cluster__WEBPACK_IMPORTED_MODULE_10___default().on("exit", async (worker, code) => {
            const now = Date.now();
            const rec = restartBudget.get(worker.id) || { count: 0, last: now };
            const elapsed = now - rec.last;

            // reset budget if stable for a minute
            rec.count = elapsed > 60_000 ? 0 : rec.count + 1;
            rec.last = now;
            restartBudget.set(worker.id, rec);

            // exponential-ish backoff: 0.5s, 1s, 2s, ... capping at 10s
            const delay = Math.min(10_000, 500 * 2 ** rec.count);
            await backoff(delay);

            cluster__WEBPACK_IMPORTED_MODULE_10___default().fork();
        });


        // Uncomment if you want infinite process death ;)
        // ws.listen(port);
        console.log(`\n\n\n✨ Listening at http://localhost:${port}\n`)
    } else {
        // console.log(`Worker ${process.pid} started`);
        server.listen(port, '0.0.0.0');

        // app.use((req, res, next) => {
        //     console.log(`Worker ${process.pid} handling ${req.method} ${req.url}`);
        //     next();
        // });
    }

    // Add Custom controllers/endpoints
    await resolveControllers(controllers, app, null, io);

    // // Custom controllers
    // let controllersMethods = Object.keys(controllers)
    // for (const method of controllersMethods) {
    //     let resolvers = Object.keys(controllers[method])
    //     for (const resolverName of resolvers) {
    //         let resolver = controllers[method][resolverName]
    //         console.log('method', method)
    //         app[method](`/controllers/${resolverName}`, async (req, res) => { res.send(await resolver(req)) })
    //     }
    // }

    // Asset Upload endpoints
    for (const collection of _collections__WEBPACK_IMPORTED_MODULE_3__["default"]) {
        for (const field of collection._fieldsArray) {
            if (field.name == "asset") {
                app.post(
                    `/assets/${collection.name}/*/${field._name}`,
                    multipart(),
                    async (req, res) => {
                        if (field.upload) {
                            let id = req.path.split("/")[3];
                            let response = await field.upload({
                                value: req.files,
                                collection: collection.name,
                                field: field._name,
                                id,
                                req,
                            });
                            res.send(response);
                        }
                    }
                );
            }
        }
    }

    // START: Temp File Hold

    let multer = __webpack_require__(/*! multer */ "multer");

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            let tmpFolder = (`${__dirname}/tmp`)
            if (!fs__WEBPACK_IMPORTED_MODULE_5___default().existsSync(tmpFolder)) fs__WEBPACK_IMPORTED_MODULE_5___default().mkdirSync(tmpFolder)
            cb(null, tmpFolder);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(
                null,
                file.originalname.split(".")[0]?.trim()?.replace(/[^a-zA-Z0-9\s]/g, '')?.replace(/\s/g, '-') +
                "-----" +
                uniqueSuffix +
                "." +
                file.originalname.split(".")[file.originalname.split(".").length - 1]
            );
        },
    });

    let upload = multer({ storage });

    app.post("/upload", upload.any(), function (req, res, next) {
        res.send({ paths: req.files.map((f) => f.path.split('/build')[1]) });
    });

    app.get("/tmp/*", async (req, res) => {
        res.sendFile(__dirname + req.path);
    });

    app.get("/assets/*", async (req, res) => {
        res.sendFile(__dirname + req.path);
    });

    // END: Temp File Hold

    let respond = async (req, res) => {
        let response = await main(req, io);
        let success = 200;
        if (req.method == 'POST') success = 201;
        if (req.method == 'DELETE') success = 204;
        let status = response?.authorized === false ? 401 : success;
        status = response?.valid === false ? 400 : status;
        status = response?.success === false ? 500 : status;
        res.status(status).send(response);
    }

    app.get("/*", respond);
    app.post("/*", respond);
    app.put("/*", respond);
    app.delete("/*", respond);

    // app.listen(port, () => {
    //     console.log(`Example app listening at http://localhost:${port}`)
    // })

    return app;
};




/***/ },

/***/ "./src/cms/1. build/libraries/mongo.js"
/*!*********************************************!*\
  !*** ./src/cms/1. build/libraries/mongo.js ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   countEntries: () => (/* binding */ countEntries),
/* harmony export */   createEntry: () => (/* binding */ createEntry),
/* harmony export */   db: () => (/* binding */ db),
/* harmony export */   deleteEntries: () => (/* binding */ deleteEntries),
/* harmony export */   deleteEntry: () => (/* binding */ deleteEntry),
/* harmony export */   readEntries: () => (/* binding */ readEntries),
/* harmony export */   readEntry: () => (/* binding */ readEntry),
/* harmony export */   updateEntries: () => (/* binding */ updateEntries),
/* harmony export */   updateEntry: () => (/* binding */ updateEntry),
/* harmony export */   upsertEntry: () => (/* binding */ upsertEntry)
/* harmony export */ });
/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ "mongodb");
/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);
const settings = __webpack_require__(/*! @mango/config/settings.json */ "../../mango/config/settings.json")
;

const client = new mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient(settings.mongoURI, {
	maxPoolSize: settings.maxPoolSize || 100, // was 100
	minPoolSize: settings.minPoolSize || 0, // don't pin idle connections
	maxIdleTimeMS: settings.maxIdleTimeMS || 60_000, // close truly idle sockets
	waitQueueTimeoutMS: settings.waitQueueTimeoutMS || 5_000, // fail fast if pool exhausted
})
client.connect()
const db = client.db(settings.database)

function formatSearch(search) {
	// console.log('search', search)

	if (search?.id) {
		search._id = search.id

		if (Array.isArray(search.id)) search._id = search.id.map((id) => new mongodb__WEBPACK_IMPORTED_MODULE_0__.ObjectId(id))

		if (search?.id?.$in) {
			search._id = {}
			search._id.$in = search.id.$in.map((id) => new mongodb__WEBPACK_IMPORTED_MODULE_0__.ObjectId(id))
		}

		if (search?.$or?.some((p) => p.id)) {
			for (let s of search.$or) {
				if (s.id) s._id = new mongodb__WEBPACK_IMPORTED_MODULE_0__.ObjectId(s.id)
				delete s.id
			}
		}

		if (search?.id?.$nin) {
			search._id = {}
			search._id.$nin = search.id.$nin.map((id) => new mongodb__WEBPACK_IMPORTED_MODULE_0__.ObjectId(id))
		}

		// console.log('search', search)

		if (typeof search.id === 'string' && search.id.length === 24) {
			search._id = new mongodb__WEBPACK_IMPORTED_MODULE_0__.ObjectId(search.id)
		}

		delete search.id
	}

	// console.log('search', search)
	// console.dir(search, { depth: null })

	return search
}

async function createEntry({ collection, entry, document } = {}) {
	// console.log('entry', entry)
	document = document || entry
	return await db.collection(collection).insertOne(document)
}

async function readEntry({ collection, search, fields = [] } = {}) {
	search = formatSearch(search)

	let projection = fields.reduce((a, k) => {
		a[k] = 1
		a[`__${k}CacheDate`] = 1
		return a
	}, {})

	if (!collection) {
		return { error: 'Please specify a collection.' }
	}
	let result = await db.collection(collection).findOne(search, { projection })
	// if (collection == 'resources') console.log('result', result?.title, result?._id)
	if (result) {
		result.collection = collection
		result.id = String(result._id)
		result._id = result.id
	}
	return result
}

async function countEntries({ collection, search } = {}) {
	search = formatSearch(search)
	return await db.collection(collection).countDocuments(search)
}

async function readEntries({ collection, search = {}, limit = 10, page = 0, sort, fields = [], aggregation = null } = {}) {
	if (aggregation) {
		const results = await db.collection(collection).aggregate(aggregation).toArray()
		return results.map((r) => ({
			...r,
			collection,
			id: String(r._id),
			_id: String(r._id),
		}))
	}

	search = formatSearch(search)

	if (!search.$text && !sort) {
		sort = { created: -1 }
	}

	// console.log('search', search)
	// if (search.$and) {
	//     console.log('search')
	//     console.dir(search, { depth: null })
	// }

	let projection = fields.reduce((a, k) => {
		a[k] = 1
		a[`__${k}CacheDate`] = 1
		return a
	}, {})
	// console.log('projection', projection)

	if (search.$text) {
		sort = { score: { $meta: 'textScore' } }
		projection.score = { $meta: 'textScore' }
	}

	// if (fields?.length) console.log('projection', projection)

	if (page < 1) {
		page = 1
	} else {
		page = page + 1
	}

	// console.log('page', page, collection)
	// console.log('sort', sort)

	const results = await db
		.collection(collection)
		.find(search)
		.project(projection)
		.sort(sort)
		.skip(page * limit - limit)
		.limit(limit)
		.allowDiskUse()

	// console.log('results', await results.toArray())

	return (await results.toArray()).map((r) => ({
		...r,
		collection,
		id: String(r._id),
		_id: String(r._id),
	}))
}

async function updateEntry({ collection, search, document } = {}) {
	search = formatSearch(search)

	// console.log('search', search)
	// console.trace()

	delete document._id
	delete document.id

	let operation = { $set: document }
	if (Object.keys(document || {}).includes('$set')) {
		operation.$set = document.$set
		delete document.$set
	}
	if (Object.keys(document || {}).includes('$push')) {
		operation.$push = document.$push
		delete document.$push
	}
	if (Object.keys(document || {}).includes('$pull')) {
		operation.$pull = document.$pull
		delete document.$pull
	}
	if (Object.keys(document || {}).includes('$addToSet')) {
		operation.$addToSet = document.$addToSet
		delete document.$addToSet
	}
	if (Object.keys(document || {}).includes('$inc')) {
		operation.$inc = document.$inc
		delete document.$inc
	}
	if (!Object.keys(operation.$set).length) {
		delete operation.$set
	}

	const result = await db.collection(collection).updateOne(search, operation)
	return { matched: result.matchedCount, modified: result.modifiedCount }
}

async function upsertEntry({ collection, search, updatedEntry } = {}) {
	search = formatSearch(search)

	delete updatedEntry._id
	delete updatedEntry.id

	// console.log('upserting', collection, search, updatedEntry)

	const result = await db.collection(collection).updateOne(search, { $set: updatedEntry }, { upsert: true })
	return {
		matched: result.matchedCount,
		modified: result.modifiedCount,
		inserted: result.upsertedCount,
	}
}

async function updateEntries({ collection, search, document } = {}) {
	search = formatSearch(search)
	const results = await db.collection(collection).updateMany(search, { $set: document })
	return { matched: results.modifiedCount, modified: results.modifiedCount }
}

async function deleteEntry({ collection, search } = {}) {
	search = formatSearch(search)

	const result = await db.collection(collection).deleteOne(search)
	return { deleted: result.deletedCount }
}

async function deleteEntries({ collection, search } = {}) {
	search = formatSearch(search)

	search = search || { title: 'Your Mamma' }
	const results = await db.collection(collection).deleteMany(search)
	return { deleted: results.deletedCount }
}




/***/ },

/***/ "./src/cms/1. build/plugins/index.js"
/*!*******************************************!*\
  !*** ./src/cms/1. build/plugins/index.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function requireAll(r) {
    return Object.fromEntries(
        r.keys().map(function (mpath, ...args) {
            const result = r(mpath, ...args);
            const name = mpath
                .replace(/(?:^[.\/]*\/|\.[^.]+$)/g, "") // Trim
                .replace(/\//g, "_"); // Relace '/'s by '_'s
            return [name, result];
        })
    );
}

// let defaultPlugins = requireAll(
//     require.context(
//         // Any kind of variables cannot be used here
//         "./defaultPlugins/", // (Webpack based) path
//         true, // Use subdirectories
//         /.*\.js$/ // File name pattern
//     )
// );

let plugins = requireAll(
    __webpack_require__("../../mango/plugins sync recursive .*\\.js$")
);

function processPlugins(allPlugins) {

    let plugins = Object.keys(allPlugins).reduce((a, pluginName) => {

        // If it's a subfolder, skip it
        // if (pluginName.split('_').length > 2) return a
        // console.log('pluginName', pluginName)

        let modules = allPlugins[pluginName];
        let objectType = pluginName.split('_')[1];
        let objectName = pluginName.split('_')[2];
        let titleName = pluginName.charAt(0).toUpperCase() + pluginName.slice(1);
        titleName = titleName.split('_')[0];
        let existingPlugin = a.find(p => p.name == titleName);
        let plugin = objectType == 'index' ? { ...modules.default } : existingPlugin || {};
        plugin.name = titleName;
        plugin[objectType] = plugin[objectType] || {}
        if (objectName == 'index') {
            plugin[objectType] = { ...plugin[objectType], ...modules.default };
        } else {
            plugin[objectType][objectName] = modules.default;
        }
        if (!existingPlugin) a.push(plugin);


        return a;
    }, []);

    // console.log('plugins', plugins)

    return plugins;
}

// function generateDefaultPlugins() {
//     return processPlugins(defaultPlugins);
// }

function generatePlugins() {
    return processPlugins(plugins);
}

// defaultPlugins = processPlugins(defaultPlugins);
plugins = processPlugins(plugins);
// console.log('plugins', plugins)
// const allPlugins = { ...defaultPlugins, ...plugins };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugins);


/***/ },

/***/ "./src/cms/2. process/0. main.js"
/*!***************************************!*\
  !*** ./src/cms/2. process/0. main.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processRequest: () => (/* binding */ processRequest),
/* harmony export */   pubsub: () => (/* binding */ pubsub)
/* harmony export */ });
/* harmony import */ var _1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../1. build/libraries/mongo */ "./src/cms/1. build/libraries/mongo.js");
/* harmony import */ var _1_formatRequest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./1. formatRequest */ "./src/cms/2. process/1. formatRequest.js");
/* harmony import */ var _2_authorize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./2. authorize */ "./src/cms/2. process/2. authorize.js");
/* harmony import */ var _3_validate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./3. validate */ "./src/cms/2. process/3. validate.js");
/* harmony import */ var _4_preProcess__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./4. preProcess */ "./src/cms/2. process/4. preProcess.js");
/* harmony import */ var _5_query__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./5. query */ "./src/cms/2. process/5. query.js");
/* harmony import */ var _6_postProcess__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./6. postProcess */ "./src/cms/2. process/6. postProcess.js");
/* harmony import */ var _7_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./7. hooks */ "./src/cms/2. process/7. hooks.js");
/* harmony import */ var _1_build_collections__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../1. build/collections */ "./src/cms/1. build/collections/index.js");











const { ForbiddenError, ValidationError } = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
const { PubSub } = __webpack_require__(/*! apollo-server */ "apollo-server");
const pubsub = new PubSub();

function isCyclic(obj) {
    var keys = [];
    var stack = [];
    var stackSet = new Set();
    var detected = false;

    function detect(obj, key) {
        if (obj && typeof obj != 'object') { return; }

        if (stackSet.has(obj)) { // it's cyclic! Print the object and its locations.
            var oldindex = stack.indexOf(obj);
            var l1 = keys.join('.') + '.' + key;
            var l2 = keys.slice(0, oldindex + 1).join('.');
            console.log('CIRCULAR: ' + l1 + ' = ' + l2 + ' = ' + obj);
            console.log(obj);
            detected = true;
            return;
        }

        keys.push(key);
        stack.push(obj);
        stackSet.add(obj);
        for (var k in obj) { //dive on the object's children
            if (Object.prototype.hasOwnProperty.call(obj, k)) { detect(obj[k], k); }
        }

        keys.pop();
        stack.pop();
        stackSet.delete(obj);
        return;
    }

    detect(obj, 'obj');
    return detected;
}

let processRequest = async function (req, io) {

    // console.log('processRequest.caller', processRequest.caller)

    // console.log('req.method', req.method)
    // console.log('req.path', req.path)
    // console.dir(req.body, { depth: null })
    // console.log('req.query', req.query)

    // Create the response object
    let callResponse = {
        valid: null,
        authorized: null,
        response: null,
        warnings: null,
    }

    // console.log('req.body', req)

    // Format the request data (more readable)
    // console.log('format')
    let request = await (0,_1_formatRequest__WEBPACK_IMPORTED_MODULE_1__.formatRequest)(req)
    // console.log('request.method', request.method)

    // BCR Hot Fix!!
    // if (request.collection == 'opportunities' && request?.fields?.includes('ownerInfo.firstName') && request?.limit == 10) {
    //     console.log('supressing for hot fix')
    //     return
    // }


    // Get the old document if it's an update or delete (for hooks)
    let getOD = ['update', 'delete'].includes(request.method) && !!(request.id || request?.search?.id)
    let originalDocument = getOD ? (await processRequest({ ...req, path: `/${request.collection}/${request.id || request?.search?.id}`, method: 'read', body: null, depthLimit: 0, member: request.member }))?.response : null
    request.originalDocument = originalDocument

    // Authorization
    // console.log('authorization')
    const authorization = await (0,_2_authorize__WEBPACK_IMPORTED_MODULE_2__.authorize)(request, req).catch(console.error)
    if (!authorization.authorized) {
        callResponse.authorized = false;
        callResponse.response = authorization.response;
        console.log('auth error', callResponse.response)

        // Only do this if it's a GQL response
        if (request.apiMethod == 'graphql') {
            throw new ForbiddenError(`Not Authorized: ${callResponse.response}`);
        }

        return callResponse
    } else {
        callResponse.authorized = true
    }

    // Validation
    // console.log('validation')
    const validation = await (0,_3_validate__WEBPACK_IMPORTED_MODULE_3__.validate)(request).catch(console.error)
    if (!validation.valid) {
        callResponse.valid = false;
        callResponse.response = validation.response ?? '';
        if (validation.fieldErrors) {
            callResponse.fieldErrors = validation.fieldErrors;
        }
        if (validation.response && !validation.response?.includes('favicon.ico')) {
            console.log('Validation Error:', validation.response)
        }

        // Only do this if it's a GQL response
        if (request.apiMethod == 'graphql') {
            throw new ValidationError(`Not Valid: ${callResponse.response}`);
        }

        return callResponse
    } else {
        callResponse.valid = true
    }

    // preProcess (only runs on mutation)
    // console.log('preProcess')
    request.document = await (0,_4_preProcess__WEBPACK_IMPORTED_MODULE_4__.preProcess)(request)

    if (request.draft) {
        let response = await (0,_6_postProcess__WEBPACK_IMPORTED_MODULE_6__.postProcess)(request.document, request, req)
        return { success: true, response }
    }

    // Run the query
    // console.log('performQuery')
    let queryResult = await (0,_5_query__WEBPACK_IMPORTED_MODULE_5__.performQuery)(request).catch(console.error)
    let rawDocument = queryResult?.content ? { ...queryResult.content } : {}

    // If we're deleting something, we're done.
    if (request.method == 'delete') {
        callResponse = { ...callResponse, deleted: queryResult.deleted }
    } else {

        if (Array.isArray(queryResult.content)) {
            if (queryResult.count) callResponse.count = queryResult.count
            request.parents = [...request.parents, ...queryResult.content.map(e => e.id)]
        } else if (queryResult.content?.id) {
            request.parents = [...request.parents, ...queryResult.content.id]
        }

        // postProcess
        // console.log('postProcess')
        queryResult = await (0,_6_postProcess__WEBPACK_IMPORTED_MODULE_6__.postProcess)(queryResult.content, request, req)//.catch(console.error)
        callResponse.response = queryResult
        callResponse.success = true

    }

    // Run the hooks
    // console.log('runHooks')
    // console.log('queryResult', queryResult)
    if (request.method == 'read') originalDocument = queryResult
    await (0,_7_hooks__WEBPACK_IMPORTED_MODULE_7__.runHooks)({ req, request, document: queryResult, rawDocument, originalDocument, io })

    callResponse.warnings = request?.warnings
    return callResponse

}




/***/ },

/***/ "./src/cms/2. process/1. formatRequest.js"
/*!************************************************!*\
  !*** ./src/cms/2. process/1. formatRequest.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatRequest: () => (/* binding */ formatRequest),
/* harmony export */   getMember: () => (/* binding */ getMember)
/* harmony export */ });
/* harmony import */ var _1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../1. build/libraries/mongo */ "./src/cms/1. build/libraries/mongo.js");
/* harmony import */ var _1_build_collections__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../1. build/collections */ "./src/cms/1. build/collections/index.js");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dayjs */ "dayjs");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_3__);






async function getMember(req) {

    if (req.member) return req.member
    let member
    try {

        // Watch out because the AWS Lambda functions authorize through {req?.headers?.user == id}
        let hash = req?.headers?.authorization.split(':')[0]
        let id = req?.headers?.authorization.split(':')[1]
        member = await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntry)({ collection: 'members', search: { "password.hash": hash, id, status: { $nin: ['closed', 'disabled'] } } })
        // console.log('member', member)

    } catch (e) {
        // console.log('e', e)
    }

    member = member || {}
    member.roles = member?.roles || []
    member = member ? { ...member, roles: [...member.roles, 'public'] } : { roles: ['public'] }
    req.member = member

    return member
}

async function findId(collection, givenId) {

    // If it's a mongodb id
    const objectIdPattern = /^[a-fA-F0-9]{24}$/;
    if (objectIdPattern.test(givenId)) return givenId

    let entry

    // CFL Resolver
    if (!isNaN(givenId)) {
        if (Number(givenId)) {
            entry = await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntry)({ collection, search: { entryId: Number(givenId) }, fields: ["id"] })
        }
        // Slug Resolver
    } else {
        entry = await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntry)({ collection, search: { slug: givenId }, fields: ["id"] })
    }

    return entry?.id || givenId

}


/*
    ADD TO HEADERS:

    {
        "authorization": "Y25laWZlcnRAbmNmaWMub3JnO3RobmdzNE0z"
    }

    btoa('username;password')

*/

// function hashPassword(password, salt, byteSize) {

//     const hashAlgos = {
//         128: 'sha512',
//         64: 'sha256',
//         40: 'sha1',
//         32: 'md5',
//     }

//     let selectedAlgo = hashAlgos[byteSize]
// 	if (!selectedAlgo) return false

//     let hashedPassword = crypto.createHash(selectedAlgo).update(salt+password).digest('hex')

// 	return hashedPassword
// }

// async function getMember(req) {
//     try {

//         if (req?.headers?.authorization) {

//             let basicAuth = Buffer.from(req.headers.authorization, 'base64').toString()
//             let email = basicAuth.split(';')[0]
//             let password = basicAuth.split(';').slice(1).join(';')
//             let member = await readEntry({collection: 'members', search: { email }})

//             let correctPass = hashPassword(password, member.password.salt, member.password.hash.length) == member.password.hash
//             return correctPass ? member : null

//         } else if (req?.headers?.apikey) {

//             let member = await readEntry({collection: 'members', search: { "password.apiKey": req.headers.apikey }})
//             return member || null

//         } else {
//             return null
//         }

//     } catch {
//         return null
//     }
// }

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

let mongoOperatorTranslations = {
    equals: '$eq',
    notEqualTo: '$ne',
    greaterThan: '$gt',
    lessThan: '$lt',
    in: '$in',
    notIn: '$nin',
    not: '$ne',
    exists: '$exists',
    hasValue: '',
    and: '$and',
    or: '$or',
    wordSearch: '$text',

    includesAll: '$all',
    eachIn: '{$not: {$elemMatch: {$nin: placeholder}}}',
    someIn: '$in',
    noneIn: '$nin',
    // length: '$size',

    push: '$push',
    addToSet: '$addToSet',
}

async function formatComparisons(search, collection) {

    if (search?.where) {
        search['$where'] = search.where
        delete search.where
    }

    if (search?.and) {
        search['$and'] = await Promise.all(search.and.map(async and => await formatComparisons(and, collection)))
        delete search.and
    }

    if (search?.or) {
        search['$or'] = await Promise.all(search.or.map(async or => await formatComparisons(or, collection)))
        delete search.or
    }

    if (search?.wordSearch) {
        let wordSearch = search?.wordSearch
        // fuzzy = new RegExp(escapeRegex(fuzzy), 'gi');
        // search.title = fuzzy
        search['$text'] = { $search: wordSearch }
        delete search.wordSearch
    }

    // Format all the [all, some] search params
    if (search && Object.keys(search)) {
        for (const param of Object.keys(search)) {
            let paramSplit = param.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(' ')
            let prefix = paramSplit[0]

            if (['all', 'some'].includes(prefix)) {

                let compareType = prefix
                let fieldName = paramSplit.slice(1).join('')
                fieldName = fieldName.charAt(0).toLowerCase() + fieldName.slice(1)

                const collectionModel = _1_build_collections__WEBPACK_IMPORTED_MODULE_1__["default"].find(c => c.name == collection)

                let relatedCollectionName = _1_build_collections__WEBPACK_IMPORTED_MODULE_1__["default"].find(c => collectionModel.fields[fieldName].collection == c._singular).name

                let searchParams = await formatComparisons(search[param], relatedCollectionName)
                let params = { collection: relatedCollectionName, search: searchParams }
                let matchedEntries = (await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntries)(params)).map(entry => entry.id)

                let addToSearch = compareType == 'all' ? { $not: { $elemMatch: { $nin: matchedEntries } }, $exists: true } : { $in: matchedEntries }

                if (typeof (search[fieldName]) == 'object' && !Array.isArray(search[fieldName])) {
                    search[fieldName] = { ...search[fieldName], ...addToSearch }
                } else if (search[fieldName]) {
                    search[fieldName] = { $eq: search[fieldName], ...addToSearch }
                } else {
                    search[fieldName] = addToSearch
                }

                delete search[param]
            }
        }
    }

    // Format all the compare{fieldName} search params
    if (search && Object.keys(search)) {
        for (const param of Object.keys(search)) {

            if (param.includes('compare')) {

                let fieldName = param.replace('compare', '')
                let graphQlSearch = search[param]
                fieldName = fieldName.charAt(0).toLowerCase() + fieldName.slice(1)
                search[fieldName] = search[fieldName] || {}

                for (const param of Object.keys(graphQlSearch)) {

                    if (['and', 'or'].includes(param)) {

                        search[fieldName][param] = await Promise.all(graphQlSearch[param].map(async and => await formatComparisons(and, collection)))

                    }

                    if (param in mongoOperatorTranslations) {

                        let searchValue = await formatComparisons(graphQlSearch[param], collection)
                        let mongoOperator = mongoOperatorTranslations[param]
                        delete search[fieldName][param]

                        if (param == 'eachIn') {
                            search[fieldName] = { $not: { $elemMatch: { $nin: searchValue } } }
                        } else if (param == 'hasValue') {
                            if (searchValue) {
                                search[fieldName] = { $ne: null }
                            } else {
                                search[fieldName] = { $eq: null }
                            }
                        } else {
                            search[fieldName][mongoOperator] = searchValue
                        }

                    }
                }

                delete search[param]

            } else if (param in mongoOperatorTranslations) {

                let searchValue = await formatComparisons(search[param], collection)
                let mongoOperator = mongoOperatorTranslations[param]
                delete search[param]

                if (param == 'eachIn') {
                    search = { $not: { $elemMatch: { $nin: searchValue } } }
                } else {
                    search[mongoOperator] = searchValue
                }

            }

            // TODO: FIX THIS

            // Maybe if it's a relationship don't apply this?
            // else if (... && NOT RELATIONSHIP) .arguments..

            else if (
                typeof (search[param]) == 'object' &&
                !['id', '$text', '$or'].includes(param) &&
                /*
                This line allows me to do searches like {someMessages: {id: "123"}}
                COULD break other searches we depend on? Haven't tested :!
                Seems like it still works? {address: {city: "Ridgecrest"}} works. :thumbs
                */
                !`${JSON.stringify(search[param])}`.includes('$')
            ) {
                // console.log('param', param)
                // console.log('search[param]', `${JSON.stringify(search[param])}`)
                await reduceComplexFieldSearch(search[param], search, param, collection)
                delete search[param]
            }
        }
    }

    return search
}

let reduceComplexFieldSearch = async function (searchObject, mainSearch, originalKey, collection) {
    // console.log('searchObject', searchObject)
    for (const key in searchObject) {

        let value = searchObject[key]

        if (Object.keys(mongoOperatorTranslations).includes(key)) {
            let mongoOperator = mongoOperatorTranslations[key]
            value = await formatComparisons(value, collection)
            mainSearch[`${originalKey}`] = {}
            mainSearch[`${originalKey}`][mongoOperator] = value
        } else if (key.includes('compare')) {
            let fieldName = key.replace('compare', '')
            fieldName = fieldName.charAt(0).toLowerCase() + fieldName.slice(1)
            value = await formatComparisons(value, collection)
            mainSearch[`${originalKey}.${fieldName}`] = value
        } else if (typeof (value) == 'object') {
            // console.log('value', value)
            await reduceComplexFieldSearch(value, mainSearch, `${originalKey}.${key}`)
        } else {
            mainSearch[`${originalKey}.${key}`] = value
        }

    }
}

let formatDocument = async function (document, collection) {
    for (const key in document) {

        let value = document[key]

        if (Object.keys(mongoOperatorTranslations).includes(key)) {

            let mongoOperator = mongoOperatorTranslations[key]
            document[mongoOperator] = value

            if (mongoOperator == '$push' || mongoOperator == '$addToSet') {

                for (let pushKey of Object.keys(document[mongoOperator])) {
                    let pushValue = document[mongoOperator][pushKey]
                    if (Array.isArray(pushValue)) document[mongoOperator][pushKey] = { $each: pushValue }
                }

            }

            delete document[key]

        } else if (typeof (value) == 'object') {
            await formatDocument(value, collection)
        }

    }
}

let formatRequest = async function (req) {

    let methodMap = {
        POST: 'create',
        GET: 'read',
        PUT: 'update',
        DELETE: 'delete',
        YEET: 'delete'
    }

    let draft = req.draft || !!req?.headers?.draft || false
    // if (draft) delete req.body.draft

    // Format request data
    let parents = req.parents || []
    let fetchedRelationships = req.fetchedRelationships || []
    let method = methodMap[req.method] || req.method
    let search, limit, relatedDepth, page, sort, searchModifier
    let depthLimit = req.depthLimit !== undefined ? req.depthLimit : undefined
    let verbose = false
    let fields = req.fields
    let relationshipFields = {}
    let collection = req.path.split('/')[1]
    let apiMethod = req.originalUrl == '/graphql' || req.originalUrl == '/graphql/' ? 'graphql' : 'rest'
    let document = req.document || ((method == 'create' || method == 'update') ? req.body : null)
    let id = req.path.split('/')[2] ? req.path.split('/')[2] : null

    let member = await getMember(req)
    let collectionModel = _1_build_collections__WEBPACK_IMPORTED_MODULE_1__["default"].find(c => c.name == collection)

    /*
        START CRAZY PSUEDO SECTION NONSENSE
    */

    // if we have a path following the model /:collection/:id/:field
    if (req.path.split('/')[3]) {

        let parentCollection = collection
        let parentId = id
        let fieldName = req.path.split('/')[3]

        if (collectionModel) {
            let targetCollection = _1_build_collections__WEBPACK_IMPORTED_MODULE_1__["default"].find(c => collectionModel.fields[fieldName].collection == c._singular).name

            let relatedIds = (await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntry)({ collection: parentCollection, search: { id: parentId }, fields: [fieldName] }))?.[fieldName] || null

            collection = targetCollection
            id = null

            if (relatedIds) searchModifier = { compareId: { in: relatedIds } }
        }
    }


    /*
        END CRAZY PSUEDO SECTION NONSENSE
    */


    // BCR HOTFIX
    if (method == 'create' && collection == 'opportunities') {
        if (document["ownerInfo.bestDate"] || document["ownerInfo.bestTime"]) {
            document.ownerInfo = document.ownerInfo || {}
            document.ownerInfo.bestDate = document["ownerInfo.bestDate"]
            document.ownerInfo.bestTime = document["ownerInfo.bestTime"]
            delete document["ownerInfo.bestDate"]
            delete document["ownerInfo.bestTime"]
        }
    }


    // console.log('depthLimit', depthLimit)

    if (document?.depthLimit !== undefined) {
        // console.log('document', document)
        depthLimit = document.depthLimit
        delete document.depthLimit
        // console.log('document', document)
    }

    // Do this for my dumb CFL site - Just lets you use the old entry_id or a slug as id
    id = await findId(collection, id)

    if (collectionModel?.formatRequest) {
        let request = await collectionModel.formatRequest({ id, method, req, collection, document, member })
        id = request?.id || id
        method = request?.method || method
        document = request?.document || document
    }

    // console.log('req.headers', req.headers)

    // This allows us to update a doc using a post request (<form> only supporst post and get methods)
    if (method == 'create' && id) method = 'update'

    let fetchingParent = req.fetchingParent || null

    if (req.query?.fields) {
        try {
            fields = JSON.parse(req.query.fields)
        } catch (e) {
            fields = req.query?.fields
        }
    }

    if (method == 'read') {

        // let queryStringExists = req.query && Object.keys(req.query).length > 0

        limit = Number(req.query?.limit) || Number(req.body?.limit) || undefined
        depthLimit = (Number(req.query?.depthLimit || req.body?.depthLimit))
        depthLimit = depthLimit > -1 ? depthLimit : undefined
        relatedDepth = Number(req.relatedDepth) || undefined
        page = Number(req.query?.page) || Number(req.body?.page) || undefined
        sort = req.query?.sort || req.body?.sort || undefined
        verbose = req.query?.verbose || req.body?.verbose || undefined

        if (req.query?.search) {
            try {
                search = JSON.parse(req.query.search)
            } catch (e) {
                search = req.query?.search
            }
            delete req.query.search
        } else {
            search = { ...req.query, ...req.body?.search }
        }

        search = { ...search, ...searchModifier }

        if (req.query?.sort) {
            try {
                sort = JSON.parse(req.query.sort)
            } catch (e) {
                sort = req.query?.sort
            }
        }

        function isISODateString(value) {
            // Check if it's a string and matches a basic ISO format pattern before using dayjs
            // ISO 8601 format typically has dashes, colons, or 'T' separators
            // Require full year-month-day format to consider it a date
            const isoFormatRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}(:\d{2}){0,2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;
            return typeof value === 'string' &&
                isoFormatRegex.test(value) &&
                dayjs__WEBPACK_IMPORTED_MODULE_3___default()(value, (dayjs__WEBPACK_IMPORTED_MODULE_3___default().ISO_8601), true).isValid();
        }


        function convertDates(obj) {
            for (let key in obj) {
                if (isISODateString(obj[key])) {
                    obj[key] = new Date(obj[key]);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    convertDates(obj[key]);
                }
            }
        }

        convertDates(search)

        delete search.limit
        delete search.depthLimit
        delete search.page
        delete search.sort
        delete search.fields
        delete search.verbose

        if (req?.body?.id) search.id = req?.body?.id

        if (search.entryId?.$in) { search.entryId.$in = search.entryId.$in.map(e => Number(e)) }
        else if (search.entryId) { search.entryId = Number(search.entryId) }

        // Relationship fields
        if (fields && fields?.some?.(f => f.includes('.'))) {
            let possibleRelations = [...new Set(fields.filter(f => f.includes('.')).map(f => f.split('.')[0]))]
            for (let p of possibleRelations) {
                let fieldIsRelationship = !!collectionModel.fields[p]?.collection
                if (fieldIsRelationship) {
                    relationshipFields[p] = fields.filter(f => f.startsWith(`${p}.`)).map(f => f.slice(p.length + 1))
                    fields = fields.filter(f => !f.startsWith(`${p}.`))
                    if (!fields.includes(p)) fields.push(p)
                }
            }
            // console.log('fields', fields, 'relationshipFields', relationshipFields)
        }

        search = await formatComparisons(search, collection)

    } else if (method == 'create' || method == 'update') {

        await formatDocument(document, collection)

    }

    return {
        method,
        collection,
        id,
        document,
        search,
        limit,
        depthLimit,
        relatedDepth,
        sort,
        page,
        apiMethod,
        member,
        parents,
        fetchedRelationships,
        req,
        fetchingParent,
        fields,
        relationshipFields,
        draft,
        verbose
    }
}




/***/ },

/***/ "./src/cms/2. process/2. authorize.js"
/*!********************************************!*\
  !*** ./src/cms/2. process/2. authorize.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   authorize: () => (/* binding */ authorize)
/* harmony export */ });
/* harmony import */ var _1_build_collections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../1. build/collections */ "./src/cms/1. build/collections/index.js");


let personalCheck = function (fieldModel) {
    if (!fieldModel._complexField && fieldModel.personal) return true
    if (fieldModel._fieldsArray) {
        fieldModel._fieldsArray.every(f => {
            return personalCheck(f)
        })
    }
}

let authorize = async function (request) {

    // return { authorized: true }

    let { member, document } = request

    // Admins
    if (member.roles.includes("admin")) return { authorized: true }

    // Add the owner role if the authorId of the referenced document is the member's id
    // console.log('member', member)
    // console.log('request', request)
    if (member?.id && (
        request?.originalDocument?.author?.id == member.id ||
        request?.originalDocument?.author?.includes?.(member.id) ||
        request?.originalDocument?.author?.some?.(a => a?.id == member?.id) ||
        request?.search?.id == member.id || // Graphql
        request?.id == member.id
    )) {
        member.roles.push('owner')
    }

    // console.log(member.roles)

    let defaultPermissions = {
        admin: ['create', 'read', 'update', 'delete'],
        owner: ['read', 'update', 'delete'],
        public: ['read'],
    }

    let collection = _1_build_collections__WEBPACK_IMPORTED_MODULE_0__["default"].find(c => request.collection == c._name)
    let collectionPermissions = collection?.permissions || {}

    // // Update Personal Fields
    // if (document && member.id) {
    //     let onlyPersonal = Object.keys(document).every(f => {
    //         let fieldModel = collection?.fields[f]
    //         if (!fieldModel) return
    //         return personalCheck(fieldModel)
    //     })
    //     // Only fields trying to be written are personal...
    //     if (onlyPersonal) return { authorized: true }
    // }

    if (typeof (collectionPermissions) == 'function') return await collectionPermissions(request)

    // Permissions array shorthand
    collectionPermissions = Array.isArray(collectionPermissions) ? { public: collectionPermissions } : collectionPermissions

    let permissions = { ...defaultPermissions, ...collectionPermissions }

    // Permissions object of roles with array of methods
    let authorized = member.roles.some(role => Array.isArray(permissions?.[role]) && permissions?.[role]?.includes(request.method))
    if (authorized) return { authorized }

    // Permissions object of roles with object of method functions
    let response = ''
    // console.log('request', request)
    for (let role of member.roles) {
        if (permissions?.[role]?.[request.method] === true) authorized = true
        if (typeof (permissions?.[role]?.[request.method]) == 'function') {
            let resolver = permissions?.[role]?.[request.method]
            let result = await resolver(request)
            if (result === true || result?.authorized === true) authorized = true
            if (result?.response) response = result?.response
        }
    }
    if (authorized) return { authorized }

    /* If the owner has permission to read and we're NOT requesting a specific
    document, but rather searching a collection, add authorId to the search
    so we only get back documents from the person who's making the request */

    // console.log('stepping up', member?.id, !request?.originalDocument?.id, request.method == 'read', (permissions?.['owner']?.includes('read') || permissions?.['owner']?.['read']))
    if (member?.id && !request?.originalDocument?.id && request.method == 'read' && (permissions?.['owner']?.includes('read') || permissions?.['owner']?.['read'])) {
        // if (request.collection == 'members') {
        //     console.log('should be good')
        //     console.dir(request.search, {depth: null})
        // }
        request.search.$or = [{author: member.id}, {id: member.id}]
        return { authorized: true }
    }

    response = response || `${member?.title || 'User'} does not have permission to ${request.method} documents in the ${request.collection} collection.`
    return { authorized, response }

}


/***/ },

/***/ "./src/cms/2. process/3. validate.js"
/*!*******************************************!*\
  !*** ./src/cms/2. process/3. validate.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterValidation: () => (/* binding */ afterValidation),
/* harmony export */   validate: () => (/* binding */ validate)
/* harmony export */ });
/* harmony import */ var _1_build_collections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../1. build/collections */ "./src/cms/1. build/collections/index.js");


async function checkRequiredFields(collectionModel, document, method) {
	if (!collectionModel.fields) return

	const fieldErrors = {}

	for (const f of Object.keys(collectionModel.fields)) {
		let fieldModel = collectionModel.fields[f]
		let fieldValue = document?.[f]

		if (fieldModel.required && !fieldValue && method == 'create') {
			const fieldLabel = fieldModel.label || f
			fieldErrors[f] = {
				error: 'empty',
				message: `${fieldLabel} is required and cannot be empty`
			}
		}

		if (fieldModel?._complexField) {
			let required = checkRequiredFields(fieldModel, fieldValue, method)
			if (required.valid === false) return required
		}
		// Set field defaults
	}

	if (Object.keys(fieldErrors).length) {
		const missingFieldNames = Object.keys(fieldErrors).join(', ')
		return { valid: false, response: `Missing required field(s): ${missingFieldNames}`, fieldErrors }
	}
}

async function checkUndefinedFields(collectionModel, document) {
	if (!collectionModel.fields || !document) return

	const fieldErrors = {}
	let documentFields = Object.keys(document)

	for (const f of documentFields) {
		if (f == 'id' || f == '$push' || f == 'authorId') continue

		let fieldValue = document?.[f]
		let fieldModel = collectionModel?.fields?.[f] || collectionModel?.fields?.[f?.split('.')?.[0]]

		if (!fieldModel || fieldModel.computed) {
			fieldErrors[f] = {
				error: 'nonexistent',
				message: `${f} is not a valid field`
			}
			continue
		}

		if (fieldModel?.array && Array.isArray(fieldValue) && fieldModel?._gqlInputType.includes('Create')) {
			let arrayValid = await Promise.all(fieldValue.map(async (v) => await checkUndefinedFields(fieldModel, v)))
			let invalidInstance = arrayValid.find((response) => response?.valid === false)
			if (invalidInstance) fieldErrors[f] = invalidInstance.response
		} else if (fieldModel?._complexField) {
			let extra = checkUndefinedFields(fieldModel, fieldValue)
			if (extra?.valid === false) fieldErrors[f] = extra.response
		}
	}

	if (Object.keys(fieldErrors).length) {
		const errorFieldNames = Object.keys(fieldErrors).join(', ')
		return { valid: false, response: `Nonexistant field(s): ${errorFieldNames}`, fieldErrors }
	}
}

async function ensurePrimitiveTypes(value, document, fieldModel, inArray, i) {
	// console.log('array', fieldModel?.array, 'complex', fieldModel?._complexField, Array.isArray(value), value)
	if (fieldModel?.array) {
		if (Array.isArray(value)) {
			// console.log(fieldModel._name, value)
			let arrayValid = await Promise.all(value.map(async (v, i) => ensurePrimitiveTypes(v, document, fieldModel, true, i)))
			let invalidInstance = arrayValid.find((response) => response?.valid === false)
			return invalidInstance || { valid: true, response: '' }
		} else if (inArray) {
			return typeValidation(value, document, fieldModel, inArray, i)
		}
	}

	if (fieldModel?._complexField) {
		for (const subfieldModel of fieldModel._fieldsArray) {
			if (value[subfieldModel._name] != null) {
				let subfieldValue = value[subfieldModel._name]
				return ensurePrimitiveTypes(subfieldValue, value, subfieldModel)
			}
		}
	}

	if (value !== undefined) {
		return typeValidation(value, document, fieldModel)
	}
}

function typeValidation(value, document, fieldModel, inArray, i) {
	let fieldName = fieldModel._name
	let fieldPath = fieldModel._location
	// console.log('tv', fieldModel, value)
	// Ensure primitave type matches
	if (value) {
		if (fieldModel.array && !inArray) {
			return { valid: false, response: `(${fieldPath}) Expected array, got ${typeof value}` }
		}

		if (fieldModel._gqlInputType == 'String') {
			if (typeof value !== 'string') {
				return { valid: false, response: `(${fieldPath}) Expected string, got ${typeof value}` }
			}
		}
		if (fieldModel._gqlInputType == 'Int') {
			if (isNaN(value) || typeof value == 'boolean') return { valid: false, response: `(${fieldPath}) Expected number, got ${typeof value}` }
			if (typeof value !== 'number') {
				if (i != undefined) document[fieldName][i] = Number(value)
				else document[fieldName] = Number(value)
			}
		}
		if (fieldModel._gqlInputType == 'Float') {
			if (isNaN(value) || typeof value == 'boolean') return { valid: false, response: `(${fieldPath}) Expected number, got ${typeof value}` }
			if (typeof value !== 'number') {
				if (i != undefined) document[fieldName][i] = Number(value)
				else document[fieldName] = Number(value)
			}
		}
		if (fieldModel._gqlInputType == 'Boolean') {
			if (typeof value !== 'boolean') return { valid: false, response: `(${fieldPath}) Expected boolean, got ${typeof value}` }
		}
		if (fieldModel._gqlInputType == 'ID') {
			if (typeof value !== 'string') return { valid: false, response: `(${fieldPath}) Expected string, got ${typeof value}` }
		}
		if (fieldModel._gqlInputType.startsWith('Create')) {
			if (typeof value !== 'object') return { valid: false, response: `(${fieldPath}) Expected object, got ${typeof value}` }
		}
	}
}

async function fieldValidation(fieldValue, fieldModel, request, document, field) {
	if (fieldModel?.array && Array.isArray(fieldValue)) {
		let arrayValid = await Promise.all(fieldValue.map(async (v) => await fieldValidation(v, fieldModel, request, document)))
		let invalidInstance = arrayValid.find((response) => response?.valid === false)
		return invalidInstance || { valid: true, response: '' }
	}

	if (fieldModel?._complexField) {
		for (const subfieldModel of fieldModel._fieldsArray) {
			// if ((f != 'id' && !fieldModel) || fieldModel.computed) { return {valid: false, response: `Invalid field: ${f}`}}

			if (subfieldModel.validate && fieldValue[subfieldModel._name] != null) {
				let subfieldValue = fieldValue[subfieldModel._name]
				let { valid, response } = await fieldValidation(subfieldValue, subfieldModel, request, document)
				if (!valid) return { valid, response }
			}

			// for (const subfield of )
		}
	}

	if (fieldValue !== undefined) {
		if (fieldModel?.validate) {
			let data = fieldValue
			let { valid, response } = await fieldModel.validate(data, { fieldModel, request, document })
			const fieldLabel = fieldModel.label || fieldModel._name
			const errorResponse = {
				error: 'invalid',
				message: response || `${fieldLabel} is invalid`
			}
			return valid ? { valid: true, response: '' } : { valid, response: errorResponse }
		}
	}
}

let validate = async function (request) {
	let { collection, document, method } = request

	let collectionModel = _1_build_collections__WEBPACK_IMPORTED_MODULE_0__["default"].find((c) => c.name == collection)
	if (!collectionModel) {
		return { valid: false, response: `Invalid collection: ${collection}` }
	}

	if (document) {
		const fieldErrors = {}

		// Make sure all required fields are there (doesn't check subfields yet - todo)
		let required = await checkRequiredFields(collectionModel, document, method)
		if (required?.fieldErrors) {
			Object.assign(fieldErrors, required.fieldErrors)
		}

		// This doesn't check subfields (todo)
		let extra = await checkUndefinedFields(collectionModel, document)
		if (extra?.fieldErrors) {
			Object.assign(fieldErrors, extra.fieldErrors)
		}

		// Field validation
		let documentFields = Object.keys(document)
		for (const f of documentFields) {
			if (f == 'id') continue
			let fieldValue = document[f]
			let fieldModel = collectionModel?.fields[f]

			if (fieldValue) {
				// let typeResponse = await ensurePrimitiveTypes(fieldValue, document, fieldModel)
				// if (typeResponse?.valid === false) return typeResponse

				let response = await fieldValidation(fieldValue, fieldModel, request, document, f)
				if (response?.valid === false) fieldErrors[f] = response.response
			}
		}

		if (Object.keys(fieldErrors).length) {
			const errorMessages = []
			const requiredFields = []
			const nonexistantFields = []
			const invalidFields = []

			for (const [field, error] of Object.entries(fieldErrors)) {
				if (error.error === 'empty') {
					requiredFields.push(field)
				} else if (error.error === 'nonexistent') {
					nonexistantFields.push(field)
				} else if (error.error === 'invalid') {
					invalidFields.push(`${field} (${error.message})`)
				}
			}

			if (requiredFields.length) {
				errorMessages.push(`Missing required field(s): ${requiredFields.join(', ')}`)
			}
			if (nonexistantFields.length) {
				errorMessages.push(`Nonexistent field(s): ${nonexistantFields.join(', ')}`)
			}
			if (invalidFields.length) {
				errorMessages.push(`Invalid field(s): ${invalidFields.join('; ')}`)
			}

			const response = errorMessages.join('. ')
			return { valid: false, response, fieldErrors }
		}
	}

	return { valid: true }
}

let afterValidation = async function (request) {}




/***/ },

/***/ "./src/cms/2. process/4. preProcess.js"
/*!*********************************************!*\
  !*** ./src/cms/2. process/4. preProcess.js ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   preProcess: () => (/* binding */ preProcess)
/* harmony export */ });
/* harmony import */ var _1_build_collections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../1. build/collections */ "./src/cms/1. build/collections/index.js");
/* harmony import */ var _1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../1. build/libraries/mongo */ "./src/cms/1. build/libraries/mongo.js");



let translateFields = async function (fieldValue, fieldModel, request, index, parentValue) {

    if (fieldValue === undefined) return

    if (fieldModel.array && Array.isArray(fieldValue)) {
        return await Promise.all(fieldValue.map(async (v, i) => await translateFields(v, fieldModel, request, i, fieldValue || request.document)))
    }

    if (fieldModel._complexField) {
        for (const subfieldModel of fieldModel._fieldsArray) {

            let subfieldValue = fieldValue?.[subfieldModel._name]
            let fieldExistsInInputDocument = !!subfieldValue

            // console.log(subfieldModel._name, fieldExistsInInputDocument, subfieldValue)

            if (fieldExistsInInputDocument) {
                fieldValue[subfieldModel._name] = await translateFields(subfieldValue, subfieldModel, request, index, fieldValue || request.document)
            }
        }
    }

    if (fieldValue !== null && fieldModel?.translateInput) {
        return await fieldModel.translateInput(fieldValue, { request, index, parentValue, fieldModel })
    }

    return fieldValue

}

let preProcess = async function (request) {
    let { document, collection } = request
    // Run the setters for each field
    if (document) {

        let collectionModel = _1_build_collections__WEBPACK_IMPORTED_MODULE_0__["default"].find(c => c.name == collection)

        // Set field defaults
        if (request.method == 'create') {
            for (const f of collectionModel._fieldsArray) {
                if ((document[f._name] === null || document[f._name] === undefined) && f?.default != undefined && f?.default != null) {
                    if (typeof (f.default) == 'function') {
                        let doc = request.originalDocument || { ...document }
                        document[f._name] = f.default(doc, request)
                    } else {
                        document[f._name] = f.default
                    }
                }
            }
        }

        let documentFields = Object.keys(document)

        // Run Translations

        /*
        Switching to "of collectionModel._fieldsArray" so that we can
        set the audio field to the translated result of video field data
        and still have it processed. :)
        */
        for (const f of collectionModel._fieldsArray) {
            let value = document[f._name]
            let fieldModel = collectionModel?.fields[f._name]
            if (!fieldModel || value === undefined) { continue }
            document[f._name] = await translateFields(value, fieldModel, request, 0, document)
        }

    }

    return document

}




/***/ },

/***/ "./src/cms/2. process/5. query.js"
/*!****************************************!*\
  !*** ./src/cms/2. process/5. query.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   performQuery: () => (/* binding */ performQuery)
/* harmony export */ });
/* harmony import */ var _1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../1. build/libraries/mongo */ "./src/cms/1. build/libraries/mongo.js");


const performQuery = async function ({ method, collection, id, document, search, limit, sort, page, fields, verbose }) {

    try {

        if (method == 'read') {

            if (id) {
                let entry = await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntry)({ collection, search: { id }, fields })
                return { success: true, content: entry }
            } else {
                let count = verbose ? await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.countEntries)({ collection, search }) : undefined
                let entries = await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntries)({ collection, search, limit, sort, page, fields })
                return { success: true, content: entries, count }
            }

        } else if (method == 'create') {

            let newEntryId = (await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.createEntry)({ collection, entry: document })).insertedId
            let newEntry = await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntry)({ collection, search: { id: newEntryId }, fields })
            return { success: true, content: newEntry }

        } else if (method == 'update') {

            if (id) {
                let updatedResponse = await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.updateEntry)({ collection, search: { id }, document }).catch(console.error)
                let updatedEntry = await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.readEntry)({ collection, search: { id }, fields })
                return { success: true, content: updatedEntry }
            } else {
                return { success: false, content: 'No ID specified for update request.' }
            }

        } else if (method == 'delete') {

            let deletedCount = (await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_0__.deleteEntry)({ collection, search: { id } })).deleted
            return { success: true, deleted: deletedCount }
        }

    } catch (e) {
        console.error(e);
    }

}




/***/ },

/***/ "./src/cms/2. process/6. postProcess.js"
/*!**********************************************!*\
  !*** ./src/cms/2. process/6. postProcess.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   postProcess: () => (/* binding */ postProcess)
/* harmony export */ });
/* harmony import */ var _1_build_collections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../1. build/collections */ "./src/cms/1. build/collections/index.js");
/* harmony import */ var _1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../1. build/libraries/mongo */ "./src/cms/1. build/libraries/mongo.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);




const computeFields = async function (request, document, originalValue, field, parent, ptDocument, ptOriginalValue, ptParent, fieldPath = '') {
	let isChild = !!parent
	if (!isChild) for (let key in ptDocument) if (key != field._name) delete ptDocument[key]
	parent = parent || document
	ptParent = ptParent || ptDocument

	if (field.array && Array.isArray(originalValue)) {
		return await Promise.all(originalValue.map(async (v, i) => await computeFields(request, document, v, field, parent, ptDocument, ptOriginalValue?.[i], ptParent, fieldPath)))
	}

	if (field.computed) {
		let providedData = parent
		let shouldNeverCache = field.expireCache === true || field.expireCache === 0

		if (field.provide) {
			const missingFields = field.provide.some((provideField) => !parent.hasOwnProperty(provideField))
			if (missingFields) {
				providedData = await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.readEntry)({ collection: document.collection, search: { id: document.id }, fields: field.provide })
			}
		}

		const resolver = typeof field.computed === 'function' ? field.computed.bind(field) : field.computed?.resolver?.bind(field)
		let newValue

		if (shouldNeverCache) {
			newValue = await resolver(providedData, request, document)
			// Save the value so we can still query for this entry by the value (ie ihh customUrl)
			const fullFieldPath = fieldPath ? `${fieldPath}.${field._name}` : field._name
			let data = { [fullFieldPath]: newValue }
			if (newValue !== undefined) await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.updateEntry)({ collection: document.collection, search: { id: document.id }, document: data })
		} else {
			const cacheValue = parent[field._name]
			const fieldCacheName = `__${field._name}CacheDate`
			const lastCached = parent[fieldCacheName] || 0
			const cacheAge = new Date() - lastCached
			const cashExpirationDefined = field.expireCache != undefined
			const neverBeenCached = (cashExpirationDefined && !cacheAge) || ['create', 'update'].includes(request.method) || cacheValue === undefined
			const cacheExpired = (cashExpirationDefined && cacheAge > field.expireCache * 1000) || neverBeenCached

			if (cacheExpired) {
				newValue = await resolver(providedData, request, document)
				// ptParent[field._name] = newValue;

				if (!request.draft) {
					const fullFieldPath = fieldPath ? `${fieldPath}.${field._name}` : field._name
					let data = { [fullFieldPath]: newValue }
					if (field.expireCache !== undefined) data[fieldCacheName] = new Date()
					// console.log('data', data)
					try {
						if (newValue !== undefined) await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.updateEntry)({ collection: document.collection, search: { id: document.id }, document: data })
					} catch (e) {
						console.log('Computed Caching Error:', e)
					}
				}
			} else {
				newValue = cacheValue
			}
		}

		return newValue
	}

	if (field._complexField && typeof originalValue === 'object') {
		const newContainer = { ...originalValue }

		for (const subfield of field._fieldsArray) {
			const subfieldValue = originalValue?.[subfield._name] ?? null
			const newFieldPath = fieldPath ? `${fieldPath}.${field._name}` : field._name

			if (originalValue || subfield.computed) {
				newContainer[subfield._name] = await computeFields(request, document, subfieldValue, subfield, originalValue, ptDocument, ptOriginalValue?.[subfield._name], ptParent, newFieldPath)
			}
		}

		return newContainer
	}

	return originalValue
}

// const buildNestedUpdate = (parent, fieldPath, value) => {
//     const pathSegments = fieldPath.split('.');
//     let current = parent;

//     for (let i = 0; i < pathSegments.length - 1; i++) {
//         const segment = pathSegments[i];

//         // If the segment doesn't exist in the parent, create it
//         if (!current[segment] || typeof current[segment] !== 'object') {
//             current[segment] = {};
//         }

//         // Move to the next level in the object
//         current = current[segment];
//     }

//     // Set the value at the final segment
//     current[pathSegments[pathSegments.length - 1]] = value;

//     return current;
// };

let translateFields = async function (fieldValue, fieldModel, request, document, after) {
	// This means it won't work with translateAfter subfields, but it's a hotfix...
	if (after && !fieldModel.translateAfter) return fieldValue

	if (fieldModel.array && Array.isArray(fieldValue)) {
		return await Promise.all(fieldValue.map(async (v) => await translateFields(v, fieldModel, request, document, after)))
	}

	if (fieldModel._complexField) {
		for (const subfieldModel of fieldModel._fieldsArray) {
			let subfieldValue = fieldValue?.[subfieldModel._name]
			let fieldExistsInInputDocument = !!subfieldValue

			if (fieldExistsInInputDocument) {
				if (subfieldModel.array) {
					let newVal = []
					// console.log('subfieldValue', subfieldValue, fieldModel._name, document.id, after)
					for (const val of subfieldValue) {
						let translated = await translateFields(val, subfieldModel, request, document, after)
						newVal.push(translated)
					}
					fieldValue[subfieldModel._name] = newVal
				} else {
					fieldValue[subfieldModel._name] = await translateFields(subfieldValue, subfieldModel, request, document, after)
				}
				// fieldValue[subfieldModel._name] = await translateFields(subfieldValue, subfieldModel, request, document)
			}
		}
	}

	if (fieldModel?.translateOutput) {
		// return await fieldModel.translateOutput(fieldValue, { request, document })
		if (after && fieldModel.translateAfter) return await fieldModel.translateOutput(fieldValue, { request, document })
		if (!after && !fieldModel?.translateAfter) return await fieldModel.translateOutput(fieldValue, { request, document })
	}

	return fieldValue
}

let protectFields = async function (req, request, fieldValue, fieldModel) {
	if (fieldModel.array && Array.isArray(fieldValue)) {
		let protectedResult = await Promise.all(fieldValue.map(async (v) => await protectFields(req, request, v, fieldModel)))
	}

	if (fieldModel._complexField) {
		for (const subfieldModel of fieldModel._fieldsArray) {
			let subfieldValue = fieldValue?.[subfieldModel._name]
			let fieldExistsInInputDocument = subfieldValue != null

			if (fieldExistsInInputDocument) {
				let { authorized, value } = await protectFields(req, request, subfieldValue, subfieldModel)
				if (!authorized) {
					delete fieldValue[subfieldModel._name]
				}
			}
		}
	}

	if (fieldModel.permissions) {
		let member = request.member

		if (member.roles.includes('admin')) return { value: fieldValue, authorized: true }

		let defaultPermissions = {
			admin: ['create', 'read', 'update', 'delete'],
			owner: ['read', 'update', 'delete'],
			public: ['read'],
		}

		let permissions = fieldModel?.permissions || defaultPermissions
		permissions = Array.isArray(permissions) ? { public: permissions } : permissions

		if (typeof permissions == 'function') return await permissions(request)

		let authorized = member.roles.some((role) => Array.isArray(permissions?.[role]) && permissions?.[role]?.includes(request.method))
		if (authorized) return { value: fieldValue, authorized }

		for (let role of member.roles) {
			if (permissions?.[role]?.[request.method] === true) authorized = true
			if (typeof permissions?.[role]?.[request.method] == 'function') {
				let resolver = permissions?.[role]?.[request.method]
				let result = await resolver(request)
				if (result === true || result?.authorized === true) authorized = true
			}
		}

		return { value: authorized ? fieldValue : null, authorized }

		// if (typeof(fieldModel?.protected) === 'function') {
		//     authorized = fieldModel?.protected({request, req})
		//     authorized = typeof(authorized) === 'object' ? authorized.authorized : authorized
		// }
	}

	return { value: fieldValue, authorized: true }
}

let savePersonalFields = async function (value, field, request, parent, collection, id) {
	if (field.array && Array.isArray(value)) {
		return await Promise.all(value.map(async (v, i) => await savePersonalFields(v, field, request, parent, collection, id)))
	}

	if (field._complexField) {
		for (const subfieldModel of field._fieldsArray) {
			let subfieldValue = value?.[subfieldModel._name]
			let fieldExistsInInputDocument = !!subfieldValue

			// console.log(subfieldModel._name, fieldExistsInInputDocument, subfieldValue)

			if (fieldExistsInInputDocument) {
				value[subfieldModel._name] = await savePersonalFields(subfieldValue, subfieldModel, request, value, collection, id)
			}
		}
	}

	if (field.personal) {
		// console.log('PERSONAL: value', value)

		let microCollection = `__${collection}_personal_${field._name}`
		// Save the field to the micro-collection
		await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.upsertEntry)({
			collection: microCollection,
			search: { authorId: request.member.id, documentId: id },
			updatedEntry: { authorId: request.member.id, documentId: id, value },
		})
	}
}

let getPersonalFields = async function (fieldModel, fieldValue, request, collection, id, document, parent) {
	if (fieldModel.array && Array.isArray(fieldValue)) {
		await Promise.all(fieldValue.map(async (v) => await getPersonalFields(fieldModel, v, request, collection, id, parent)))
	}

	if (fieldModel._complexField) {
		for (const subfieldModel of fieldModel._fieldsArray) {
			let subfieldValue = fieldValue?.[subfieldModel._name]
			let fieldExistsInInputDocument = subfieldValue != null

			if (fieldExistsInInputDocument) {
				await getPersonalFields(subfieldModel, subfieldValue, request, collection, id, fieldValue)
			}
		}
	}

	if (fieldModel.personal) {
		// console.log('getting', fieldModel._name)

		let microCollection = `__${collection}_personal_${fieldModel._name}`

		let value = await (0,_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.readEntry)({
			collection: microCollection,
			search: { authorId: request.member.id, documentId: id },
		})

		// console.log('value', value)
		// console.log('parent', parent)

		parent[fieldModel._name] = value?.value
	}
}

let postProcess = async function (document, request, req) {
	if (!document) {
		return
	}
	let multiple = Array.isArray(document)
	let documents = multiple ? document : [document]

	for (const document of documents) {
		let collection = document.collection
		let id = document.id

		let originalDocument = (0,lodash__WEBPACK_IMPORTED_MODULE_2__.cloneDeep)(document)

		let collectionModel = _1_build_collections__WEBPACK_IMPORTED_MODULE_0__["default"].find((c) => c.name == request.collection)

		// console.log('before', document)

		// Run Translations
		for (const f of Object.keys(document)) {
			let value = document[f]
			let fieldModel = collectionModel?.fields[f]
			if (!fieldModel || value === undefined) {
				continue
			}
			document[f] = await translateFields(value, fieldModel, request, document, false)
		}

		// Run Computations
		for (const field of collectionModel._fieldsArray) {
			let originalValue = document[field._name]
			let ptOriginalValue = originalDocument[field._name]
			if ((originalValue != undefined || field.computed) && (!request.fields || request.fields?.includes(field._name))) {
				document[field._name] = await computeFields(request, document, originalValue, field, null, originalDocument, ptOriginalValue, null)
			} else if (!request?.fields?.length) {
				// Do this so it always returns top level fields even if they don't exist for a consistent data model
				document[field._name] = null
			}
		}

		// Run Translations After (for computed relationships etc...)
		for (const f of Object.keys(document)) {
			let value = document[f]
			let fieldModel = collectionModel?.fields[f]
			if (!fieldModel || value === undefined) {
				continue
			}
			document[f] = await translateFields(value, fieldModel, request, document, true)
		}

		// Personal fields
		if (request.member?.id) {
			if (request.method === 'create' || request.method === 'update') {
				let documentFields = Object.keys(request.document)

				// Save Personal Fields
				for (const f of documentFields) {
					let value = request.document[f]
					let fieldModel = collectionModel?.fields[f]
					if (!fieldModel) {
						continue
					}
					await savePersonalFields(value, fieldModel, request, request.document, collection, id)
				}
			}

			// Get Personal Fields
			for (const fieldModel of collectionModel._fieldsArray) {
				let value = document[fieldModel._name]
				await getPersonalFields(fieldModel, value, request, collection, id, document, document)
			}
		}

		// console.log('after', document)
		// console.dir(document, {depth: null})

		// Run Protection
		for (const f of Object.keys(document)) {
			let fieldValue = document[f]
			let fieldModel = collectionModel?.fields[f]
			if (!fieldModel) {
				continue
			}

			let { authorized, value } = await protectFields(req, request, fieldValue, fieldModel)

			if (!authorized) {
				delete document[f]
			} else {
				document[f] = value
			}
		}

		// Get rid of this, it's huge and unncessary... just don't remove it from readEntry because we need it in the hooks.
		delete document.hits
	}

	return multiple ? documents : documents[0]
}




/***/ },

/***/ "./src/cms/2. process/7. hooks.js"
/*!****************************************!*\
  !*** ./src/cms/2. process/7. hooks.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runHooks: () => (/* binding */ runHooks)
/* harmony export */ });
/* harmony import */ var _1_build_collections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../1. build/collections */ "./src/cms/1. build/collections/index.js");
function requireAll(r) {
    return Object.fromEntries(
        r.keys().map(function (mpath, ...args) {
            const result = r(mpath, ...args);
            const name = mpath
                .replace(/(?:^[.\/]*\/|\.[^.]+$)/g, "") // Trim
                .replace(/\//g, "_"); // Relace '/'s by '_'s
            return [name, result];
        })
    );
}
const allModules = requireAll(
    __webpack_require__("../../mango/hooks sync recursive .*\\.js$")
);

let allHooks = Object.keys(allModules).reduce((a, k) => {
    if (k != "index") {
        let hooks = allModules[k];
        hooks = Object.keys(hooks).map((k) => hooks[k]);
        if (hooks) {
            return [...a, ...hooks];
        }
    }
    return a;
}, []);

// export function runHooks() {
//     allHooks.forEach(hook => hook())
// }



const hookTypes = {
    create: "created",
    read: "read",
    update: "updated",
    delete: "deleted",
};

async function runHooks(e) {

    let {
        req,
        request,
        document,
        rawDocument,
        originalDocument,
        io
    } = e;

    e.oldDocument = originalDocument
    e[document?.collection] = document
    e[`original${document?.collection}`] = originalDocument
    e[`old${document?.collection}`] = originalDocument
    e[`raw${document?.collection}`] = rawDocument

    let documents = Array.isArray(document) ? document : [document]
    let individual = !Array.isArray(document)

    let collectionName = documents?.[0]?.collection || originalDocument?.collection;
    let collectionModel = _1_build_collections__WEBPACK_IMPORTED_MODULE_0__["default"].find((c) => c.name == collectionName);

    let hookType = hookTypes[request.method];

    if (hookType == 'read' && !individual) {
        if (collectionModel?.hooks?.list) {
            await collectionModel.hooks.list({ ...e, documents, individual, io });
        }
    }

    for (let document of documents) {

        if (collectionModel?.hooks?.[hookType]) {
            await collectionModel.hooks[hookType]({ ...e, document, individual, io });
        }

        if (request.queue?.[hookType]) {
            for (let hook of request.queue?.[hookType]) {
                await hook(document, request)
            }
        }

        for (const hook of allHooks) {
            hook({ ...e, document, hookType, individual, collection: collectionModel, io });
        }
        // allHooks.forEach(hook => hook({ hookType, req, request, document, originalDocument }))
    }

}




/***/ },

/***/ "./src/cms/exports.js"
/*!****************************!*\
  !*** ./src/cms/exports.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   collections: () => (/* reexport safe */ _cms_1_build_collections__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   countEntries: () => (/* reexport safe */ _cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.countEntries),
/* harmony export */   createCollection: () => (/* reexport safe */ _cms_1_build_collections_createCollection__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   createEntry: () => (/* reexport safe */ _cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.createEntry),
/* harmony export */   createField: () => (/* reexport safe */ _cms_1_build_fields_createField__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   deleteEntries: () => (/* reexport safe */ _cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.deleteEntries),
/* harmony export */   deleteEntry: () => (/* reexport safe */ _cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.deleteEntry),
/* harmony export */   downloadFile: () => (/* reexport safe */ _cms_1_build_helpers_download__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   fields: () => (/* reexport safe */ _cms_1_build_fields__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   getMember: () => (/* reexport safe */ _cms_2_process_1_formatRequest__WEBPACK_IMPORTED_MODULE_2__.getMember),
/* harmony export */   plugins: () => (/* reexport safe */ _cms_1_build_plugins__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   processRequest: () => (/* reexport safe */ _cms_2_process_0_main__WEBPACK_IMPORTED_MODULE_7__.processRequest),
/* harmony export */   readEntries: () => (/* reexport safe */ _cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.readEntries),
/* harmony export */   readEntry: () => (/* reexport safe */ _cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.readEntry),
/* harmony export */   sendBulkEmail: () => (/* reexport safe */ _cms_1_build_helpers_email__WEBPACK_IMPORTED_MODULE_6__.sendBulkEmail),
/* harmony export */   sendEmail: () => (/* reexport safe */ _cms_1_build_helpers_email__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   settings: () => (/* reexport default export from named module */ _config_config_settings_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   updateEntries: () => (/* reexport safe */ _cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.updateEntries),
/* harmony export */   updateEntry: () => (/* reexport safe */ _cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.updateEntry),
/* harmony export */   upload: () => (/* reexport safe */ _cms_1_build_helpers_upload__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   upsertEntry: () => (/* reexport safe */ _cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.upsertEntry)
/* harmony export */ });
/* harmony import */ var _config_config_settings_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @config/config/settings.json */ "../../mango/config/settings.json");
/* harmony import */ var _cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @cms/1. build/libraries/mongo */ "./src/cms/1. build/libraries/mongo.js");
/* harmony import */ var _cms_2_process_1_formatRequest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @cms/2. process/1. formatRequest */ "./src/cms/2. process/1. formatRequest.js");
/* harmony import */ var _cms_1_build_collections__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @cms/1. build/collections */ "./src/cms/1. build/collections/index.js");
/* harmony import */ var _cms_1_build_fields__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @cms/1. build/fields */ "./src/cms/1. build/fields/index.js");
/* harmony import */ var _cms_1_build_plugins__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @cms/1. build/plugins */ "./src/cms/1. build/plugins/index.js");
/* harmony import */ var _cms_1_build_helpers_email__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @cms/1. build/helpers/email */ "./src/cms/1. build/helpers/email.js");
/* harmony import */ var _cms_2_process_0_main__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @cms/2. process/0. main */ "./src/cms/2. process/0. main.js");
/* harmony import */ var _cms_1_build_helpers_upload__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @cms/1. build/helpers/upload */ "./src/cms/1. build/helpers/upload.js");
/* harmony import */ var _cms_1_build_helpers_download__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @cms/1. build/helpers/download */ "./src/cms/1. build/helpers/download.js");
/* harmony import */ var _cms_1_build_fields_createField__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @cms/1. build/fields/createField */ "./src/cms/1. build/fields/createField.js");
/* harmony import */ var _cms_1_build_collections_createCollection__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @cms/1. build/collections/createCollection */ "./src/cms/1. build/collections/createCollection.js");















// console.log('collections', collections.map(c => c.name))

// let api = `http://localhost:${settings.port}`
let init = () => {
    const Mango = _cms_1_build_collections__WEBPACK_IMPORTED_MODULE_3__["default"].reduce((a, c) => {

        let runQuery = async ({ limit, page, search, fields, id, sort, depthLimit, authorized, member } = {}) => {

            let fullQuery


            const params = { limit, page, search, fields, sort, depthLimit }

            depthLimit = 2

            if (params.search != undefined) params.search = JSON.stringify(params.search)
            if (params.fields != undefined) params.fields = JSON.stringify(params.fields)
            if (params.sort != undefined) params.sort = JSON.stringify(params.sort)

            const query = Object.keys(params)
                .filter(key => params[key] != undefined)
                ?.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                ?.join('&') || ''
            // console.log(query)

            let path = `/${c.name}/${id || ''}`
            // console.log(fullQuery)

            if (!member && authorized) member = await (0,_cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.readEntry)({collection: 'members', search: {roles: 'admin'}})
            let authorization = `${member?.password?.hash}:${member?.id}`

            return new Promise((resolve, reject) => {
                ;(0,_cms_2_process_0_main__WEBPACK_IMPORTED_MODULE_7__.processRequest)({path, query: params, headers: { authorization }, method: 'read'})
                    .then(response => resolve(response?.response))
                    .catch(e => reject(e))
            })

        }

        let runGraphql = async (query, {authorized, member} = {}) => {

            if (!member && authorized) member = await (0,_cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.readEntry)({collection: 'members', search: {roles: 'admin'}})
            let authorization = `${member?.password?.hash}:${member?.id}`

            query = query.includes('mutation') ? { query } : { query: `query { ${query} }` }
            return new Promise((resolve, reject) => {
                ;(0,_cms_2_process_0_main__WEBPACK_IMPORTED_MODULE_7__.processRequest)({path: `/graphql`, method: 'post', body: query, headers: { authorization }})
                    .then(response => resolve(response?.data))
                    .catch(e => reject(e))
            })

        }


        let save = async (data, {authorized, member} = {}) => {
            // console.log('authorized', authorized)
            if (!member && authorized) member = await (0,_cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.readEntry)({collection: 'members', search: {roles: 'admin'}})
            let authorization = `${member?.password?.hash}:${member?.id}`

            data = JSON.parse(JSON.stringify(data))
            let { id } = data
            let method = id ? 'update' : 'create'

            // // Remove _id and computed fields
            delete data.collection
            delete data._id
            delete data.id

            for (let field of c._fieldsArray) {
                if (field.computed) delete data[field._name]
                if (field.name == 'relationship' && data[field._name]) data[field._name] = Array.isArray(data[field._name]) ? data[field._name].map(r => r.id) : data[field._name]?.id ? data[field._name].id : data[field._name]
            }
            for (let name in data) {
                if (name.includes('__')) delete data[name]
            }

            let payload = { ...data }

            // console.log('payload', payload)

            return new Promise((resolve, reject) => {
                ;(0,_cms_2_process_0_main__WEBPACK_IMPORTED_MODULE_7__.processRequest)({path: `/${c.name}/${id || ''}`, method, body: payload, headers: { authorization } })
                    .then(response => resolve(response?.response))
                    .catch(e => reject(e))
            })
        }

        let deleteEntry = async (data, {authorized, member} = {}) => {
            let id = data.id || data

            if (!member && authorized) member = await (0,_cms_1_build_libraries_mongo__WEBPACK_IMPORTED_MODULE_1__.readEntry)({collection: 'members', search: {roles: 'admin'}})
            let authorization = `${member?.password?.hash}:${member?.id}`

            return new Promise((resolve, reject) => {
                ;(0,_cms_2_process_0_main__WEBPACK_IMPORTED_MODULE_7__.processRequest)({path: `/${c.name}/${id || ''}`, method: 'delete', headers: { authorization } })
                    .then(response => resolve(response?.response))
                    .catch(e => reject(e))
            })
        }

        a[c.name] = runQuery
        a[c.name]['save'] = save
        a[c.name]['delete'] = deleteEntry
        a[c.singular] = (id, query) => runQuery({ id, ...query })

        a.graphql = runGraphql

        return a

    }, {})

    Mango.collections = _cms_1_build_collections__WEBPACK_IMPORTED_MODULE_3__["default"]

    return Mango
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (init);


/***/ },

/***/ "./src/cms/index.js"
/*!**************************!*\
  !*** ./src/cms/index.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _1_build_libraries_express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./1. build/libraries/express */ "./src/cms/1. build/libraries/express.js");
/* harmony import */ var _2_process_0_main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./2. process/0. main */ "./src/cms/2. process/0. main.js");
/* harmony import */ var _tests__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tests */ "./src/cms/tests/index.js");
/* harmony import */ var _1_build_fields__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./1. build/fields */ "./src/cms/1. build/fields/index.js");
/* harmony import */ var _1_build_plugins__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./1. build/plugins */ "./src/cms/1. build/plugins/index.js");
/* harmony import */ var _1_build_collections__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./1. build/collections */ "./src/cms/1. build/collections/index.js");
/* harmony import */ var _1_build_fields_createField__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./1. build/fields/createField */ "./src/cms/1. build/fields/createField.js");
/* harmony import */ var _1_build_collections_createCollection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./1. build/collections/createCollection */ "./src/cms/1. build/collections/createCollection.js");
/* harmony import */ var _1_build_helpers_email__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./1. build/helpers/email */ "./src/cms/1. build/helpers/email.js");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _mango_automation__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @mango/automation */ "../../mango/automation/index.js");
/* harmony import */ var _mango_config_settings_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @mango/config/settings.json */ "../../mango/config/settings.json");
/* harmony import */ var cluster__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! cluster */ "cluster");
/* harmony import */ var cluster__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(cluster__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _1_build_endpoints__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./1. build/endpoints */ "./src/cms/1. build/endpoints/index.js");
// Main file to process the api request
















// console.log('endpoints', endpoints)


// function resolveType(subfieldType) {
//     if (!subfieldType) { return 'String' }
//     return typeof(subfieldType) === 'string' ? subfieldType : typeof(subfieldType())
// }

function parseEndpointStructure(obj, path = '', result = {}) {
    // HTTP methods to check for
    const httpMethods = ['get', 'post', 'put', 'delete', 'patch']

    // Check if this level has any HTTP methods
    const methods = httpMethods.filter(method => typeof obj[method] === 'function')

    if (methods.length > 0) {
        // This is an endpoint - store the available methods
        result[path || '/'] = methods
    }

    // Recursively process nested routes
    for (const key in obj) {
        if (httpMethods.includes(key) || typeof obj[key] !== 'object' || obj[key] === null) {
            // Skip HTTP methods and non-objects
            continue
        }

        // Build the nested path
        const nestedPath = path ? `${path}/${key}` : key
        parseEndpointStructure(obj[key], nestedPath, result)
    }

    return result
}

function registerSubfields(fields) {
    return fields.map((f) => {
        let validator = null

        // Serialize validator if it's client-safe
        if (f.validate && typeof f.validate === 'function') {
            if (f.validate.serverOnly === true) return
            const fnString = f.validate.toString()
            const params = fnString.match(/\(([^)]*)\)/)?.[1]?.split(',').map(p => p.trim()) || []

            // Check if explicitly marked as client-safe
            const explicitlyClientSafe = f.validate.serverOnly === false

            // Auto-detect if it's client-safe (simple validator without server dependencies)
            const hasServerContext = fnString.includes('request') || fnString.includes('document') || fnString.includes('fieldModel')
            const hasServerImports = fnString.includes('require(') || fnString.includes('import ')
            const isSimpleValidator = params.length === 1 || (params.length > 1 && !hasServerContext)

            const isClientSafe = explicitlyClientSafe || (isSimpleValidator && !hasServerImports)

            if (isClientSafe) {
                validator = fnString
            }
        }

        return {
            name: f._name,
            array: f.array,
            displayName: f.displayName,
            placeholder: f.placeholder,
            search: f.search,
            filter: f.filter,
            description: f.description,
            single: f.single,
            relationship: f.name == 'relationship' ? _1_build_collections__WEBPACK_IMPORTED_MODULE_5__["default"]?.find(c => c._singular == f.collection)?._name : false,
            instanceOf: f?.name || null,
            options: f?.caseSensitive ? f?.options : f?.options?.map(o => o.toLowerCase()) || null,
            caseSensitive: f?.caseSensitive,
            humanName: f._name.replace(/([A-Z])/g, ' $1'),
            type: f._gqlType,
            inputType: f._gqlInputType,
            computed: !!f.computed,
            complex: f._complexField,
            translate: !!f.translateInput,
            required: !!f.required,
            customField: f._complexField && !f.translateInput,
            example: f.inputExample,
            global: f.global || false,
            fields: f._fieldsArray ? registerSubfields(f._fieldsArray) : null,
            validator,
        }
    })
}

async function start() {

    await (0,_1_build_libraries_express__WEBPACK_IMPORTED_MODULE_0__.startExpress)(main, _1_build_endpoints__WEBPACK_IMPORTED_MODULE_13__["default"])

    if ((cluster__WEBPACK_IMPORTED_MODULE_12___default().isMaster) || (cluster__WEBPACK_IMPORTED_MODULE_12___default().isPrimary)) {
        (0,_mango_automation__WEBPACK_IMPORTED_MODULE_10__["default"])()
    }

    let collectionsJSON = _1_build_collections__WEBPACK_IMPORTED_MODULE_5__["default"].map((c) => ({
        name: c._name,
        ssrModel: c.ssrModel || null,
        titleName: c._titleName,
        singular: c._singular,
        titleSingular: c._titleSingular,
        humanName: c._titleName.replace(/([A-Z])/g, ' $1'),
        humanSingular: c._titleSingular.replace(/([A-Z])/g, ' $1'),
        library: c.libraryName,
        type: c._type,
        fields: c._fieldsArray ? registerSubfields(c._fieldsArray) : null,
        adminIndex: c.adminIndex,
        algolia: c.algolia,
    }))

    /*If you enable this, pm2 with --watch will infinitely restart :) */
    let collectionsTarget = `${process.env.CONFIG_ROOT}/config/.collections.json`
    fs__WEBPACK_IMPORTED_MODULE_9___default().writeFile(
        collectionsTarget,
        JSON.stringify(collectionsJSON),
        {},
        () => { }
    )

    // Generate endpoints JSON
    const endpointsStructure = parseEndpointStructure(_1_build_endpoints__WEBPACK_IMPORTED_MODULE_13__["default"])
    let endpointsTarget = `${process.env.CONFIG_ROOT}/config/.endpoints.json`
    fs__WEBPACK_IMPORTED_MODULE_9___default().writeFile(
        endpointsTarget,
        JSON.stringify(endpointsStructure, null, 2),
        {},
        () => { }
    )
}

async function main(req, io) {
    return await (0,_2_process_0_main__WEBPACK_IMPORTED_MODULE_1__.processRequest)(req, io).catch(console.error)
}

function test() {
    return (0,_tests__WEBPACK_IMPORTED_MODULE_2__.tests)(main).catch(console.error)
}

function use(library) {

    // let collections = []
    // let endpoints = []
    // let fields = []

    // console.log('library', library)

    if (library?.collections?.length) {
        library.collections.forEach((c) =>
            _1_build_collections__WEBPACK_IMPORTED_MODULE_5__["default"].push({ ...c, libraryName: library.name })
        )
    } else if (library?.collections) {
        for (let collectionName in library.collections) {
            let collection = library.collections[collectionName]
            _1_build_collections__WEBPACK_IMPORTED_MODULE_5__["default"].push({ ...collection, libraryName: library.name, name: collectionName })
        }
    }

    // if (library?.fields) {
    //     fields = [...fields, ...library.fields]
    // }

    if (library?.endpoints) {
        for (let endpointName in library.endpoints) {
            _1_build_endpoints__WEBPACK_IMPORTED_MODULE_13__["default"][endpointName] = library.endpoints[endpointName]
        }
    }

    // console.log('library?.endpoints', library?.endpoints)

    /*
    Make fields and endpoints a class so they have setters?
    */

    // if (library?.fields) fields = [...fields, ...library.fields]
    // if (library?.endpoints) endpoints = { ...endpoints, ...library.endpoints }
    if (library.install) library.install({ collections: _1_build_collections__WEBPACK_IMPORTED_MODULE_5__["default"], fields: _1_build_fields__WEBPACK_IMPORTED_MODULE_3__["default"], endpoints: _1_build_endpoints__WEBPACK_IMPORTED_MODULE_13__["default"] })
}

// console.log('plugins', plugins)
for (let plugin of _1_build_plugins__WEBPACK_IMPORTED_MODULE_4__["default"]) {
    use(plugin)
}

// console.log('endpoints', endpoints)

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    start,
    test,
    use,
    collections: _1_build_collections__WEBPACK_IMPORTED_MODULE_5__["default"],
    fields: _1_build_fields__WEBPACK_IMPORTED_MODULE_3__["default"],
    createField: _1_build_fields_createField__WEBPACK_IMPORTED_MODULE_6__["default"],
    createCollection: _1_build_collections_createCollection__WEBPACK_IMPORTED_MODULE_7__["default"],
    processRequest: _2_process_0_main__WEBPACK_IMPORTED_MODULE_1__.processRequest,
    sendEmail: _1_build_helpers_email__WEBPACK_IMPORTED_MODULE_8__["default"],
});


/***/ },

/***/ "./src/cms/tests/index.js"
/*!********************************!*\
  !*** ./src/cms/tests/index.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tests: () => (/* binding */ tests)
/* harmony export */ });
/* harmony import */ var _cms_1_build_graphql_apollo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../cms/1. build/graphql/apollo */ "./src/cms/1. build/graphql/apollo.js");

let { resolvers } = (0,_cms_1_build_graphql_apollo__WEBPACK_IMPORTED_MODULE_0__["default"])()

async function createMember(main) {
    let memberData = {
        "title": "Test Member",
        "roles": ["member"]
    }
    let newMember = await main({method: 'POST', body: memberData, path: '/members'})
    // console.log('newMember', newMember)
    return newMember.response.id
}

function createTestData({ passValidation, memberId }) {

    let data = {
        translateInput: "uppercase",
        translateOutput: "LOWERCASE",
        relationship: [memberId],
        protected: "protected",
        validation: passValidation ? 'PASS' : 'FAIL',
        intArray: [1,2,3],
    }

    let testData = {
        "title": "Test Collection",
        ...data,
        complexArray: [{
            ...data,
            complexArray: [{
                ...data
            }]
        }]
    }

    return testData

}

async function createTestEntry(main, { passValidation, memberId }) {
    let data = createTestData({ passValidation, memberId })
    return await main({method: 'POST', body: data, path: '/_tests'})
}

function testLevels({data, memberId, level}) {
    console.log('level:', level)
    if (Array.isArray(data?.intArray)) { console.log('✅  Normal Array') } else { console.log('❌ Normal Array')}
    if (data?.translateInput === 'UPPERCASE'+level) { console.log('✅  translateInput') } else { console.log('❌ translateInput')}
    if (data?.translateOutput === 'lowercase'+level) { console.log('✅  translateOutput') } else { console.log('❌ translateOutput')}
    if (data?.computedNeverCache === 10+level) { console.log('✅  computedNeverCache') } else { console.log('❌ computedNeverCache')}
    if (data?.computedExpireCache === 10+level) { console.log('✅  computedExpireCache') } else { console.log('❌ computedExpireCache')}
    if (data?.computedCache === 10+level) { console.log('✅  computedCache') } else { console.log('❌ computedCache')}
    if (data?.relationship[0].id === memberId) { console.log('✅  relationship') } else { console.log('❌ relationship')}
    if (data?.protected === undefined) { console.log('✅  protected') } else { console.log(`❌ protected: ${data?.protected}`)}
    console.log('')
}


function updateTestData({ passValidation, memberIds }) {

    let data = {
        translateInput: "upper-updated",
        translateOutput: "LOWER-UPDATED",
        relationship: memberIds,
        protected: "protected",
        validation: passValidation ? 'PASS' : 'FAIL',
        intArray: [3,2,1],
    }

    let testData = {
        "title": "Updated Test Collection",
        ...data,
        complexArray: [{
            ...data,
            complexArray: [{
                ...data
            }]
        }]
    }

    return testData

}

async function updateTestEntry(main, { passValidation, memberIds, entryId }) {
    let data = updateTestData({ passValidation, memberIds })
    // console.dir(data, {depth: null})
    return await main({method: 'PUT', body: data, path: `/_tests/${entryId}`})
}

function testUpdateLevels({data, memberIds, level}) {
    console.log('Update level:', level)
    if (Array.isArray(data?.intArray)) { console.log('✅  Normal Array') } else { console.log('❌ Normal Array')}
    if (data?.translateInput === 'UPPER-UPDATED'+level) { console.log('✅  translateInput') } else { console.log('❌ translateInput')}
    if (data?.translateOutput === 'lower-updated'+level) { console.log('✅  translateOutput') } else { console.log('❌ translateOutput')}
    if (data?.computedNeverCache === 14+level) { console.log('✅  computedNeverCache') } else { console.log('❌ computedNeverCache')}
    if (data?.computedExpireCache === 14+level) { console.log('✅  computedExpireCache') } else { console.log('❌ computedExpireCache')}
    if (data?.computedCache === 14+level) { console.log('✅  computedCache') } else { console.log('❌ computedCache')}
    if (data?.relationship.every(r => memberIds.includes(r.id))) { console.log('✅  relationship') } else { console.log('❌ relationship')}
    if (data?.protected === undefined) { console.log('✅  protected') } else { console.log(`❌ protected: ${data?.protected}`)}
    console.log('')
}


async function tests(main){

    try {


        // Create
            // Imported Collection
            // Folder Collection
            // Collection
                // Hooks
                // Permissions
                // Fields
                    // Array
                    // Assets
                    // Validation
                    // Permissions
                    // TranslateInput
                    // TranslateOutput
                    // Computed (cache)
                    // Computed (no cache)
                    // Subfields
                        // Array
                        // Assets
                        // Validation
                        // Permissions
                        // Relationship
                        // TranslateInput
                        // TranslateOutput
                        // Computed (cache)
                        // Computed (no cache)

        let memberId = await createMember(main)
        let memberId2 = await createMember(main)
        let memberIds = [memberId, memberId2]

        console.log('memberId', memberId)

        let shouldBeInvalid = await createTestEntry(main, {passValidation: false, memberId})
        if (shouldBeInvalid.valid === false && shouldBeInvalid.response == '(validation) not pass') { console.log('✅  Validation') } else { console.log(`❌ Validation`)}

        let shouldBeValid = (await createTestEntry(main, {passValidation: true, memberId})).response
        // console.dir(shouldBeValid, {depth: null})
        if (shouldBeValid?.id) { console.log('✅  Create') } else { console.log('❌ Create')}
        if (Array.isArray(shouldBeValid?.complexArray)) { console.log('✅  Complex Array') } else { console.log('❌ Complex Array')}

        console.log('')
        testLevels({data: shouldBeValid, memberId, level: 1})
        testLevels({data: shouldBeValid.complexArray[0], memberId, level: 2})
        testLevels({data: shouldBeValid.complexArray[0].complexArray[0], memberId, level: 3})

        shouldBeInvalid = await updateTestEntry(main, {passValidation: false, memberIds, entryId: shouldBeValid.id})
        if (shouldBeInvalid.valid === false && shouldBeInvalid.response == '(validation) not pass') { console.log('✅  Update Validation') } else { console.log(`❌ Update Validation`)}

        shouldBeValid = (await updateTestEntry(main, {passValidation: true, memberIds, entryId: shouldBeValid.id})).response
        // console.log('Updated shouldBeValid', shouldBeValid)
        if (shouldBeValid?.id) { console.log('✅  Update') } else { console.log('❌ Update')}
        if (Array.isArray(shouldBeValid?.complexArray)) { console.log('✅  Update Complex Array') } else { console.log('❌ Update Complex Array')}


        console.log('')
        testUpdateLevels({data: shouldBeValid, memberIds, level: 1})
        testUpdateLevels({data: shouldBeValid.complexArray[0], memberIds, level: 2})
        testUpdateLevels({data: shouldBeValid.complexArray[0].complexArray[0], memberIds, level: 3})

        await main({headers: {user: memberId}, method: 'DELETE', path: '/members/' + memberId})
        await main({headers: {user: memberId2}, method: 'DELETE', path: '/members/' + memberId2})
        let { deleted } = await main({method: 'DELETE', path: '/_tests/' + shouldBeValid.id})

        if (deleted === 1) { console.log('✅  Delete') } else { console.log('❌ Delete')}


    } catch (e) {
        console.error(e);
    }

}


// tests().catch(console.error);


/***/ },

/***/ "@aws-sdk/client-s3"
/*!*************************************!*\
  !*** external "@aws-sdk/client-s3" ***!
  \*************************************/
(module) {

"use strict";
module.exports = require("@aws-sdk/client-s3");

/***/ },

/***/ "apollo-server"
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
(module) {

"use strict";
module.exports = require("apollo-server");

/***/ },

/***/ "apollo-server-express"
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
(module) {

"use strict";
module.exports = require("apollo-server-express");

/***/ },

/***/ "axios"
/*!************************!*\
  !*** external "axios" ***!
  \************************/
(module) {

"use strict";
module.exports = require("axios");

/***/ },

/***/ "body-parser"
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
(module) {

"use strict";
module.exports = require("body-parser");

/***/ },

/***/ "cluster"
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
(module) {

"use strict";
module.exports = require("cluster");

/***/ },

/***/ "connect-multiparty"
/*!*************************************!*\
  !*** external "connect-multiparty" ***!
  \*************************************/
(module) {

"use strict";
module.exports = require("connect-multiparty");

/***/ },

/***/ "cors"
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
(module) {

"use strict";
module.exports = require("cors");

/***/ },

/***/ "crypto"
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
(module) {

"use strict";
module.exports = require("crypto");

/***/ },

/***/ "dayjs"
/*!************************!*\
  !*** external "dayjs" ***!
  \************************/
(module) {

"use strict";
module.exports = require("dayjs");

/***/ },

/***/ "express"
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
(module) {

"use strict";
module.exports = require("express");

/***/ },

/***/ "form-data"
/*!****************************!*\
  !*** external "form-data" ***!
  \****************************/
(module) {

"use strict";
module.exports = require("form-data");

/***/ },

/***/ "fs"
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
(module) {

"use strict";
module.exports = require("fs");

/***/ },

/***/ "graphql"
/*!**************************!*\
  !*** external "graphql" ***!
  \**************************/
(module) {

"use strict";
module.exports = require("graphql");

/***/ },

/***/ "graphql-fields"
/*!*********************************!*\
  !*** external "graphql-fields" ***!
  \*********************************/
(module) {

"use strict";
module.exports = require("graphql-fields");

/***/ },

/***/ "graphql-parse-resolve-info"
/*!*********************************************!*\
  !*** external "graphql-parse-resolve-info" ***!
  \*********************************************/
(module) {

"use strict";
module.exports = require("graphql-parse-resolve-info");

/***/ },

/***/ "http"
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
(module) {

"use strict";
module.exports = require("http");

/***/ },

/***/ "lodash"
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
(module) {

"use strict";
module.exports = require("lodash");

/***/ },

/***/ "mailgun.js"
/*!*****************************!*\
  !*** external "mailgun.js" ***!
  \*****************************/
(module) {

"use strict";
module.exports = require("mailgun.js");

/***/ },

/***/ "mime-types"
/*!*****************************!*\
  !*** external "mime-types" ***!
  \*****************************/
(module) {

"use strict";
module.exports = require("mime-types");

/***/ },

/***/ "mongodb"
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
(module) {

"use strict";
module.exports = require("mongodb");

/***/ },

/***/ "multer"
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
(module) {

"use strict";
module.exports = require("multer");

/***/ },

/***/ "os"
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
(module) {

"use strict";
module.exports = require("os");

/***/ },

/***/ "resend"
/*!*************************!*\
  !*** external "resend" ***!
  \*************************/
(module) {

"use strict";
module.exports = require("resend");

/***/ },

/***/ "sharp"
/*!************************!*\
  !*** external "sharp" ***!
  \************************/
(module) {

"use strict";
module.exports = require("sharp");

/***/ },

/***/ "socket.io"
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
(module) {

"use strict";
module.exports = require("socket.io");

/***/ },

/***/ "socket.io-redis"
/*!**********************************!*\
  !*** external "socket.io-redis" ***!
  \**********************************/
(module) {

"use strict";
module.exports = require("socket.io-redis");

/***/ },

/***/ "source-map-support/register"
/*!**********************************************!*\
  !*** external "source-map-support/register" ***!
  \**********************************************/
(module) {

"use strict";
module.exports = require("source-map-support/register");

/***/ },

/***/ "stream"
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
(module) {

"use strict";
module.exports = require("stream");

/***/ },

/***/ "util"
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
(module) {

"use strict";
module.exports = require("util");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var source_map_support_register__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! source-map-support/register */ "source-map-support/register");
/* harmony import */ var source_map_support_register__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(source_map_support_register__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mango_config_settings_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mango/config/settings.json */ "../../mango/config/settings.json");
/* harmony import */ var _cms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cms */ "./src/cms/index.js");



// // ------------ SENTRY

// // You can also use CommonJS `require('@sentry/node')` instead of `import`
// import * as Sentry from "@sentry/node";
// import { ProfilingIntegration } from "@sentry/profiling-node";

// Sentry.init({
//     dsn: 'https://db4f16793fd349b9f03e1b8ddb3dd34b@o4506316278595584.ingest.sentry.io/4506322383667200',
//     integrations: [
//         new ProfilingIntegration(),
//     ],
//     // Performance Monitoring
//     tracesSampleRate: 1.0,
//     // Set sampling rate for profiling - this is relative to tracesSampleRate
//     profilesSampleRate: 1.0,
// });

// // ------------ SENTRY

if (_mango_config_settings_json__WEBPACK_IMPORTED_MODULE_1__.timezone) process.env.TZ = _mango_config_settings_json__WEBPACK_IMPORTED_MODULE_1__.timezone;



// import mangoStand from './mango-stand'
// CMS.use(mangoStand)

// let People = CMS.collections.find(c => c._name == 'people')
// People.fields.shirt = CMS.fields.Relationship({collection: 'shirt', single: true})

// console.log('Members', Members)
// console.log(CMS.collections.find(c => c._name = 'shirts'))

delete _cms__WEBPACK_IMPORTED_MODULE_2__["default"].collections.find(c => c._name = 'members').title

_cms__WEBPACK_IMPORTED_MODULE_2__["default"].start()
// CMS.test()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTs7QUFFQTs7QUFFZ0I7QUFDaEI7Ozs7Ozs7Ozs7OztBQ3RMQSwrQzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxrRDs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwrQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSxzQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwyQzs7Ozs7Ozs7Ozs7QUNBQSx1RDs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSx1Qzs7Ozs7Ozs7Ozs7QUNBQSx1Qzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSxzQzs7Ozs7Ozs7Ozs7QUNBQSw0Qzs7Ozs7Ozs7Ozs7QUNBQSx3RDs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOcUM7QUFDYzs7QUFFbkQ7O0FBRUE7QUFDQTtBQUNBLFlBQVksdUJBQXVCOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKOztBQUVBLElBQUksd0RBQVEsNEJBQTRCLHdEQUFROztBQUV6Qjs7QUFFdkI7QUFDQTs7QUFFQTtBQUNBLGtEQUFrRCxrQ0FBa0M7O0FBRXBGO0FBQ0E7O0FBRUEsT0FBTyw0Q0FBRzs7QUFFViw0Q0FBRztBQUNIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4uLy4uL21hbmdvL2F1dG9tYXRpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4uLy4uL21hbmdvL2F1dG9tYXRpb24vc3luY1Jldmlld3MuanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4uLy4uL21hbmdvL2NvbGxlY3Rpb25zLyBzeW5jIC4qXFwuanMkIiwid2VicGFjazovL21hbmdvLWNtcy8uLi8uLi9tYW5nby9jb2xsZWN0aW9ucy9leGFtcGxlcy5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi4vLi4vbWFuZ28vY29sbGVjdGlvbnMvcGhvdG9zLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uLi8uLi9tYW5nby9jb2xsZWN0aW9ucy9yZXZpZXdzLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uLi8uLi9tYW5nby9jb2xsZWN0aW9ucy9yZXZpZXdzTWV0YS5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi4vLi4vbWFuZ28vY29uZmlnL2dsb2JhbEZpZWxkcy5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi4vLi4vbWFuZ28vY29uZmlnL3VzZXJzLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uLi8uLi9tYW5nby9lbmRwb2ludHMvIHN5bmMgLipcXC5qcyQiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4uLy4uL21hbmdvL2VuZHBvaW50cy9jb21wYW55Q2FtLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uLi8uLi9tYW5nby9lbmRwb2ludHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4uLy4uL21hbmdvL2ZpZWxkcy8gc3luYyAuKlxcLmpzJCIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi4vLi4vbWFuZ28vZmllbGRzL3ZpbWVvLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uLi8uLi9tYW5nby9oZWxwZXJzL2NvbXBhbnlDYW0uanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4uLy4uL21hbmdvL2hvb2tzLyBzeW5jIC4qXFwuanMkIiwid2VicGFjazovL21hbmdvLWNtcy8uLi8uLi9tYW5nby9ob29rcy9zdWJzY3JpYmUuanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4uLy4uL21hbmdvL2hvb2tzL3Rlc3QuanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4uLy4uL21hbmdvL3BsdWdpbnMvIHN5bmMgLipcXC5qcyQiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8xLiBidWlsZC9jb2xsZWN0aW9ucy9jb2xsZWN0aW9ucy5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi9zcmMvY21zLzEuIGJ1aWxkL2NvbGxlY3Rpb25zL2NyZWF0ZUNvbGxlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8xLiBidWlsZC9jb2xsZWN0aW9ucy9kZWZhdWx0Q29sbGVjdGlvbnMvIHN5bmMgXigiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8xLiBidWlsZC9jb2xsZWN0aW9ucy9kZWZhdWx0Q29sbGVjdGlvbnMvbWVtYmVycy5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi9zcmMvY21zLzEuIGJ1aWxkL2NvbGxlY3Rpb25zL2luZGV4LmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMS4gYnVpbGQvZW5kcG9pbnRzL2RlZmF1bHRFbmRwb2ludHMuanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8xLiBidWlsZC9lbmRwb2ludHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8xLiBidWlsZC9maWVsZHMvY3JlYXRlRmllbGQuanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8xLiBidWlsZC9maWVsZHMvZGVmYXVsdEZpZWxkcy8gc3luYyAuKlxcLmpzJCIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi9zcmMvY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL2FkZHJlc3MuanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8xLiBidWlsZC9maWVsZHMvZGVmYXVsdEZpZWxkcy9hbHRSZWxhdGlvbnNoaXAuanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8xLiBidWlsZC9maWVsZHMvZGVmYXVsdEZpZWxkcy9hc3NldC5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi9zcmMvY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL2N1c3RvbUZpZWxkLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMS4gYnVpbGQvZmllbGRzL2RlZmF1bHRGaWVsZHMvZmlsZS5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi9zcmMvY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL2ltYWdlLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMS4gYnVpbGQvZmllbGRzL2RlZmF1bHRGaWVsZHMvcGFyZW50cy5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi9zcmMvY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL3BsYWluVGV4dC5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi9zcmMvY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL3JlbGF0aW9uc2hpcC5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi9zcmMvY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL3JpY2hUZXh0LmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMS4gYnVpbGQvZmllbGRzL2RlZmF1bHRGaWVsZHMvc2VsZWN0LmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMS4gYnVpbGQvZmllbGRzL2RlZmF1bHRGaWVsZHMvdGltZXN0YW1wLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMS4gYnVpbGQvZmllbGRzL2RlZmF1bHRGaWVsZHMvdG9nZ2xlLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMS4gYnVpbGQvZmllbGRzL2luZGV4LmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMS4gYnVpbGQvZ3JhcGhxbC9hcG9sbG8uanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8xLiBidWlsZC9oZWxwZXJzL2Rvd25sb2FkLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMS4gYnVpbGQvaGVscGVycy9lbWFpbC5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi9zcmMvY21zLzEuIGJ1aWxkL2hlbHBlcnMvdXBsb2FkLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMS4gYnVpbGQvbGlicmFyaWVzL2V4cHJlc3MuanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8xLiBidWlsZC9saWJyYXJpZXMvbW9uZ28uanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8xLiBidWlsZC9wbHVnaW5zL2luZGV4LmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMi4gcHJvY2Vzcy8wLiBtYWluLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMi4gcHJvY2Vzcy8xLiBmb3JtYXRSZXF1ZXN0LmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMi4gcHJvY2Vzcy8yLiBhdXRob3JpemUuanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8yLiBwcm9jZXNzLzMuIHZhbGlkYXRlLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMi4gcHJvY2Vzcy80LiBwcmVQcm9jZXNzLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvMi4gcHJvY2Vzcy81LiBxdWVyeS5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi9zcmMvY21zLzIuIHByb2Nlc3MvNi4gcG9zdFByb2Nlc3MuanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zLy4vc3JjL2Ntcy8yLiBwcm9jZXNzLzcuIGhvb2tzLmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvZXhwb3J0cy5qcyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi9zcmMvY21zL2luZGV4LmpzIiwid2VicGFjazovL21hbmdvLWNtcy8uL3NyYy9jbXMvdGVzdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwiQGF3cy1zZGsvY2xpZW50LXMzXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwiYXBvbGxvLXNlcnZlclwiIiwid2VicGFjazovL21hbmdvLWNtcy9leHRlcm5hbCBjb21tb25qcyBcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiIiwid2VicGFjazovL21hbmdvLWNtcy9leHRlcm5hbCBjb21tb25qcyBcImF4aW9zXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwiYm9keS1wYXJzZXJcIiIsIndlYnBhY2s6Ly9tYW5nby1jbXMvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImNsdXN0ZXJcIiIsIndlYnBhY2s6Ly9tYW5nby1jbXMvZXh0ZXJuYWwgY29tbW9uanMgXCJjb25uZWN0LW11bHRpcGFydHlcIiIsIndlYnBhY2s6Ly9tYW5nby1jbXMvZXh0ZXJuYWwgY29tbW9uanMgXCJjb3JzXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwiY3J5cHRvXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwiZGF5anNcIiIsIndlYnBhY2s6Ly9tYW5nby1jbXMvZXh0ZXJuYWwgY29tbW9uanMgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwiZm9ybS1kYXRhXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJmc1wiIiwid2VicGFjazovL21hbmdvLWNtcy9leHRlcm5hbCBjb21tb25qcyBcImdyYXBocWxcIiIsIndlYnBhY2s6Ly9tYW5nby1jbXMvZXh0ZXJuYWwgY29tbW9uanMgXCJncmFwaHFsLWZpZWxkc1wiIiwid2VicGFjazovL21hbmdvLWNtcy9leHRlcm5hbCBjb21tb25qcyBcImdyYXBocWwtcGFyc2UtcmVzb2x2ZS1pbmZvXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwibG9kYXNoXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwibWFpbGd1bi5qc1wiIiwid2VicGFjazovL21hbmdvLWNtcy9leHRlcm5hbCBjb21tb25qcyBcIm1pbWUtdHlwZXNcIiIsIndlYnBhY2s6Ly9tYW5nby1jbXMvZXh0ZXJuYWwgY29tbW9uanMgXCJtb25nb2RiXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwibXVsdGVyXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJvc1wiIiwid2VicGFjazovL21hbmdvLWNtcy9leHRlcm5hbCBjb21tb25qcyBcInJlc2VuZFwiIiwid2VicGFjazovL21hbmdvLWNtcy9leHRlcm5hbCBjb21tb25qcyBcInNoYXJwXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwic29ja2V0LmlvXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwic29ja2V0LmlvLXJlZGlzXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwic291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwic3RyZWFtXCIiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL2V4dGVybmFsIGNvbW1vbmpzIFwidXRpbFwiIiwid2VicGFjazovL21hbmdvLWNtcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tYW5nby1jbXMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vbWFuZ28tY21zL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tYW5nby1jbXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tYW5nby1jbXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tYW5nby1jbXMvLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzeW5jUmV2aWV3cyB9IGZyb20gJy4vc3luY1Jldmlld3MuanMnXG5cbmxldCBkYXlzID0gWydTdW5kYXknLCAnTW9uZGF5JywgJ1R1ZXNkYXknLCAnV2VkbmVzZGF5JywgJ1RodXJzZGF5JywgJ0ZyaWRheScsICdTYXR1cmRheSddXG5cbkRhdGUucHJvdG90eXBlLm1vbnRoRGF5cyA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIGQgPSBuZXcgRGF0ZSh0aGlzLmdldEZ1bGxZZWFyKCksIHRoaXMuZ2V0TW9udGgoKSArIDEsIDApXG5cdHJldHVybiBkLmdldERhdGUoKVxufVxuXG5sZXQgc3RhcnRBdXRvbWF0aW9ucyA9IGZ1bmN0aW9uICgpIHtcblx0Ly8gbGV0IG5vdyA9IG5ldyBEYXRlKClcblxuXHQvLyBjb25zb2xlLmxvZygnc3RhcnRpbmchJylcblxuXHRzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0Ly8gT3B0aW9uYWwgdGltZXpvbmUgb2Zmc2V0IGZvciBzZXJ2ZXJcblx0XHRsZXQgbm93ID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIDEwMDAgKiA2MCAqIDYwICogNilcblxuXHRcdGxldCBkYXkgPSBub3cuZ2V0RGF5KClcblx0XHRsZXQgd2Vla2RheSA9IGRheXNbZGF5XVxuXHRcdGxldCBkYXRlID0gbm93LmdldERhdGUoKVxuXHRcdGxldCBtb250aCA9IG5vdy5nZXRNb250aCgpXG5cblx0XHRsZXQgaG91ciA9IG5vdy5nZXRIb3VycygpXG5cdFx0bGV0IG1pbnV0ZSA9IG5vdy5nZXRNaW51dGVzKClcblxuXHRcdGxldCBtb250aERheXMgPSBub3cubW9udGhEYXlzKClcblx0XHRsZXQgbnRoV2Vla2RheU9mTW9udGggPSBNYXRoLmNlaWwoZGF5IC8gNylcblx0XHRsZXQgZGF5c1JlbWFpbmluZ0luTW9udGggPSBtb250aERheXMgLSBkYXRlXG5cdFx0bGV0IGxhc3RXZWVrZGF5T2ZNb250aCA9IGRheXNSZW1haW5pbmdJbk1vbnRoIDwgN1xuXG5cdFx0Ly8gQXV0b21hdGlvbnMgdG8gcnVuIChjcm9uKVxuXHRcdC8vIGlmICgod2Vla2RheSA9PSAnVGh1cnNkYXknIHx8IHdlZWtkYXkgPT0gJ0ZyaWRheScpICYmIGhvdXIgPT0gOCAmJiBtaW51dGUgPT0gMSkgZG9Tb21ldGhpbmdDb29sKClcblxuXHRcdC8vIFN5bmMgR29vZ2xlIHJldmlld3MgdHdpY2UgZGFpbHkgYXQgOGFtIGFuZCA4cG1cblx0XHRpZiAoKGhvdXIgPT0gOCB8fCBob3VyID09IDIwKSAmJiBtaW51dGUgPT0gMCkgc3luY1Jldmlld3MoKVxuXHR9LCAxMDAwICogNjApXG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0YXJ0QXV0b21hdGlvbnNcbiIsImltcG9ydCBheGlvcyBmcm9tICdheGlvcydcbmltcG9ydCB7IHJlYWRFbnRyaWVzLCBjcmVhdGVFbnRyeSwgdXBkYXRlRW50cnksIHNlbmRFbWFpbCB9IGZyb20gJ0BtYW5nbydcbmltcG9ydCBzZXR0aW5ncyBmcm9tICdAc2V0dGluZ3MnXG5cbmNvbnN0IEdPT0dMRV9QTEFDRVNfQVBJX0JBU0UgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3BsYWNlL2RldGFpbHMvanNvbidcblxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hHb29nbGVSZXZpZXdzKCkge1xuXHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChHT09HTEVfUExBQ0VTX0FQSV9CQVNFLCB7XG5cdFx0cGFyYW1zOiB7XG5cdFx0XHRwbGFjZV9pZDogc2V0dGluZ3MuYmVsa0h2YWNQbGFjZUlkLFxuXHRcdFx0ZmllbGRzOiAncmV2aWV3cyxyYXRpbmcsdXNlcl9yYXRpbmdzX3RvdGFsJyxcblx0XHRcdGtleTogc2V0dGluZ3MuZ29vZ2xlUGxhY2VzS2V5LFxuXHRcdH0sXG5cdH0pXG5cdHJldHVybiByZXNwb25zZS5kYXRhXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzeW5jUmV2aWV3cygpIHtcblx0Y29uc3QgcmVzdWx0cyA9IHsgZmV0Y2hlZDogMCwgY3JlYXRlZDogMCwgdXBkYXRlZDogMCB9XG5cblx0dHJ5IHtcblx0XHRjb25zdCBkYXRhID0gYXdhaXQgZmV0Y2hHb29nbGVSZXZpZXdzKClcblxuXHRcdGlmIChkYXRhLnN0YXR1cyAhPT0gJ09LJyB8fCAhZGF0YS5yZXN1bHQ/LnJldmlld3MpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdObyByZXZpZXdzIGZvdW5kIG9yIEFQSSBlcnJvcjonLCBkYXRhLnN0YXR1cylcblx0XHRcdHJldHVybiByZXN1bHRzXG5cdFx0fVxuXG5cdFx0Y29uc3QgcmV2aWV3cyA9IGRhdGEucmVzdWx0LnJldmlld3Ncblx0XHRyZXN1bHRzLmZldGNoZWQgPSByZXZpZXdzLmxlbmd0aFxuXG5cdFx0Ly8gVXBkYXRlIHJldmlld3NNZXRhIHdpdGggb3ZlcmFsbCByYXRpbmcgYW5kIHRvdGFsIGNvdW50XG5cdFx0Y29uc3QgZXhpc3RpbmdNZXRhID0gYXdhaXQgcmVhZEVudHJpZXMoe1xuXHRcdFx0Y29sbGVjdGlvbjogJ3Jldmlld3NNZXRhJyxcblx0XHRcdGxpbWl0OiAxLFxuXHRcdH0pXG5cblx0XHRjb25zdCBtZXRhRG9jdW1lbnQgPSB7XG5cdFx0XHRyYXRpbmc6IGRhdGEucmVzdWx0LnJhdGluZyxcblx0XHRcdHVzZXJSYXRpbmdzVG90YWw6IGRhdGEucmVzdWx0LnVzZXJfcmF0aW5nc190b3RhbCxcblx0XHR9XG5cblx0XHRpZiAoZXhpc3RpbmdNZXRhICYmIGV4aXN0aW5nTWV0YS5sZW5ndGggPiAwKSB7XG5cdFx0XHRhd2FpdCB1cGRhdGVFbnRyeSh7XG5cdFx0XHRcdGNvbGxlY3Rpb246ICdyZXZpZXdzTWV0YScsXG5cdFx0XHRcdHNlYXJjaDogeyBpZDogZXhpc3RpbmdNZXRhWzBdLmlkIH0sXG5cdFx0XHRcdGRvY3VtZW50OiBtZXRhRG9jdW1lbnQsXG5cdFx0XHR9KVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRhd2FpdCBjcmVhdGVFbnRyeSh7XG5cdFx0XHRcdGNvbGxlY3Rpb246ICdyZXZpZXdzTWV0YScsXG5cdFx0XHRcdGRvY3VtZW50OiBtZXRhRG9jdW1lbnQsXG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdGZvciAoY29uc3QgcmV2aWV3IG9mIHJldmlld3MpIHtcblx0XHRcdGNvbnN0IGF1dGhvclVybCA9IHJldmlldy5hdXRob3JfdXJsXG5cblx0XHRcdGNvbnN0IGRvY3VtZW50ID0ge1xuXHRcdFx0XHRhdXRob3JOYW1lOiByZXZpZXcuYXV0aG9yX25hbWUsXG5cdFx0XHRcdGF1dGhvclVybDogcmV2aWV3LmF1dGhvcl91cmwsXG5cdFx0XHRcdGxhbmd1YWdlOiByZXZpZXcubGFuZ3VhZ2UsXG5cdFx0XHRcdG9yaWdpbmFsTGFuZ3VhZ2U6IHJldmlldy5vcmlnaW5hbF9sYW5ndWFnZSxcblx0XHRcdFx0cHJvZmlsZVBob3RvVXJsOiByZXZpZXcucHJvZmlsZV9waG90b191cmwsXG5cdFx0XHRcdHJhdGluZzogcmV2aWV3LnJhdGluZyxcblx0XHRcdFx0cmVsYXRpdmVUaW1lRGVzY3JpcHRpb246IHJldmlldy5yZWxhdGl2ZV90aW1lX2Rlc2NyaXB0aW9uLFxuXHRcdFx0XHR0ZXh0OiByZXZpZXcudGV4dCxcblx0XHRcdFx0dGltZTogbmV3IERhdGUocmV2aWV3LnRpbWUgKiAxMDAwKSxcblx0XHRcdFx0dHJhbnNsYXRlZDogcmV2aWV3LnRyYW5zbGF0ZWQsXG5cdFx0XHRcdHNvdXJjZTogJ2dvb2dsZScsXG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgcmVhZEVudHJpZXMoe1xuXHRcdFx0XHRjb2xsZWN0aW9uOiAncmV2aWV3cycsXG5cdFx0XHRcdHNlYXJjaDogeyBhdXRob3JVcmwgfSxcblx0XHRcdFx0bGltaXQ6IDEsXG5cdFx0XHR9KVxuXG5cdFx0XHRpZiAoZXhpc3RpbmcgJiYgZXhpc3RpbmcubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRhd2FpdCB1cGRhdGVFbnRyeSh7XG5cdFx0XHRcdFx0Y29sbGVjdGlvbjogJ3Jldmlld3MnLFxuXHRcdFx0XHRcdHNlYXJjaDogeyBpZDogZXhpc3RpbmdbMF0uaWQgfSxcblx0XHRcdFx0XHRkb2N1bWVudCxcblx0XHRcdFx0fSlcblx0XHRcdFx0cmVzdWx0cy51cGRhdGVkKytcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGF3YWl0IGNyZWF0ZUVudHJ5KHtcblx0XHRcdFx0XHRjb2xsZWN0aW9uOiAncmV2aWV3cycsXG5cdFx0XHRcdFx0ZG9jdW1lbnQsXG5cdFx0XHRcdH0pXG5cdFx0XHRcdHJlc3VsdHMuY3JlYXRlZCsrXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc29sZS5sb2coYFJldmlld3Mgc3luYyBjb21wbGV0ZTogJHtyZXN1bHRzLmZldGNoZWR9IGZldGNoZWQsICR7cmVzdWx0cy5jcmVhdGVkfSBuZXcsICR7cmVzdWx0cy51cGRhdGVkfSB1cGRhdGVkYClcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRXJyb3Igc3luY2luZyByZXZpZXdzOicsIGVyci5tZXNzYWdlKVxuXHRcdGF3YWl0IHNlbmRFbWFpbCh7XG5cdFx0XHR0bzogJ25hdGhhbkBocHB0aC5jb20nLFxuXHRcdFx0ZnJvbTogJ2FkbWluQGhwcHRoLmNvbScsXG5cdFx0XHRzdWJqZWN0OiAnSmF5IExvdHQgUmV2aWV3cyBTeW5jIEVycm9yJyxcblx0XHRcdGJvZHk6IGBSZXZpZXdzIHN5bmMgZXJyb3I6ICR7ZXJyLm1lc3NhZ2UgfHwgZXJyfWAsXG5cdFx0fSlcblx0fVxuXG5cdHJldHVybiByZXN1bHRzXG59XG4iLCJ2YXIgbWFwID0ge1xuXHRcIi4vZXhhbXBsZXMuanNcIjogXCIuLi8uLi9tYW5nby9jb2xsZWN0aW9ucy9leGFtcGxlcy5qc1wiLFxuXHRcIi4vcGhvdG9zLmpzXCI6IFwiLi4vLi4vbWFuZ28vY29sbGVjdGlvbnMvcGhvdG9zLmpzXCIsXG5cdFwiLi9yZXZpZXdzLmpzXCI6IFwiLi4vLi4vbWFuZ28vY29sbGVjdGlvbnMvcmV2aWV3cy5qc1wiLFxuXHRcIi4vcmV2aWV3c01ldGEuanNcIjogXCIuLi8uLi9tYW5nby9jb2xsZWN0aW9ucy9yZXZpZXdzTWV0YS5qc1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuLi8uLi9tYW5nby9jb2xsZWN0aW9ucyBzeW5jIHJlY3Vyc2l2ZSAuKlxcXFwuanMkXCI7IiwiLypcbiAgICBUaGlzIGlzIGFuIGV4YW1wbGUgY29sbGVjdGlvbi4gSXQgd2lsbCBpbmhlcml0IGl0cyBuYW1lXG4gICAgZnJvbSB0aGUgZmlsZW5hbWUgZm9yIHRoZSBwbHVyYWwgb2YgdGhpcyBjb2xsZWN0aW9uIHR5cGVcbiAgICAoZXhhbXBsZXMpXG5cbiAgICBUaGUgc2luZ3VsYXIgc2hvdWxkIGJlIGRlZmluZWQgb24gdGhlIHJvb3Qgb2YgdGhlIGV4cG9ydFxuICAgIG9yIGl0IHdpbGwgYmUgZGVjbGFyZWQgYXMgYHNpbmd1bGFyRXhhbXBsZXNgIGJ5IGRlZmF1bHQuXG5cbiAgICBUaGVyZSBzaG91bGQgYWxzbyBiZSBhIGBmaWVsZHNgIGF0dHJpYnV0ZSBvbiB0aGUgcm9vdFxuICAgIHdoaWNoIGNvbnRhaW5zIGFsbCBvZiB0aGUgZmllbGRzIGluIHRoZSBjb2xsZWN0aW9uLlxuICAgIEN1c3RvbSBmaWVsZHMgY2FuIGJlIGltcG9ydGVkIGRpcmVjdGx5LCBhbmQgZGVmYXVsdCBmaWVsZHNcbiAgICBjYW4gYmUgaW1wb3J0ZWQgZnJvbSB0aGUgQ01TLlxuKi9cblxuaW1wb3J0IGZpZWxkcyBmcm9tICdAZmllbGRzJ1xubGV0IHsgUmVsYXRpb25zaGlwLCBJbWFnZSB9ID0gZmllbGRzXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBwZXJtaXNzaW9uczoge1xuICAgICAgICBwdWJsaWM6IFsnY3JlYXRlJywgJ3JlYWQnLCAndXBkYXRlJywgJ2RlbGV0ZSddLFxuICAgIH0sXG4gICAgc2luZ3VsYXI6ICdleGFtcGxlJyxcbiAgICBmaWVsZHM6IHtcbiAgICAgICAgc29tZURhdGE6IFN0cmluZyxcbiAgICAgICAgYW5vdGhlckZpZWxkOiAnSW50JyxcbiAgICAgICAgYW5BcnJheU9mSW50czogWydJbnQnXSxcbiAgICAgICAgaW1hZ2U6IEltYWdlKHsgd2lkdGg6IDUwMCB9KSxcbiAgICAgICAgLyogUmVsYXRpb25zaGlwcyByZXF1aXJlIHRoYXQgeW91IHNwZWNpZnkgdGhlIHNpbmd1bGFyIGZvcm1cbiAgICAgICAgb2YgdGhlIGNvbGxlY3Rpb24gdGhhdCB5b3UncmUgcmVsYXRpbmcgdG8gKi9cbiAgICAgICAgZXhhbXBsZVJlbGF0aW9uc2hpcDogUmVsYXRpb25zaGlwKHsgY29sbGVjdGlvbjogJ2V4YW1wbGUnIH0pLFxuICAgICAgICAvKiBUaGlzIGlzIGFuIGV4YW1wbGUgb2YgYSBgY29tcGxleEZpZWxkYCwganVzdCB0aGluayBvZiBpdFxuICAgICAgICBhcyBhIG5lc3RlZCBvYmplY3Qgc3RydWN0dXJlZCB0aGUgc2FtZSB3YXkgYXMgYSBjb2xsZWN0aW9uXG4gICAgICAgIHdpdGggdGhlIGBmaWVsZHNgIGF0dHJpYnV0ZS4gKi9cbiAgICAgICAgc29tZUxlZ2l0RGF0YToge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgeDogJ0ludCcsXG4gICAgICAgICAgICAgICAgICAgIHk6ICdJbnQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvKiBUaGVyZSBhcmUgYWxzbyBzb21lIHN3ZWV0IHRoaW5ncyBsaWtlIGNvbXB1dGVkIGZpZWxkcy5cbiAgICAgICAgVGhlcmUgYXJlIHNvbWUgY29vbCBjYWNoaW5nIG9wdGlvbnMgZm9yIGNvbXB1dGVkIGZpZWxkcyB5b3VcbiAgICAgICAgY2FuIGxvb2t1cCBpbiB0aGUgZG9jcyAqL1xuICAgICAgICBwcm9kdWN0T2ZYWToge1xuICAgICAgICAgICAgY29tcHV0ZWQ6IGRvYyA9PiBkb2Muc29tZUxlZ2l0RGF0YT8uY29vcmRpbmF0ZXM/LnggKiBkb2Muc29tZUxlZ2l0RGF0YT8uY29vcmRpbmF0ZXM/LnlcbiAgICAgICAgfSxcbiAgICAgICAgLyogU29tZXRpbWVzIHlvdSBtaWdodCB3YW50IHRvIHN0b3JlIGEgZGlmZmVyZW50IHR5cGUgb2YgZGF0YVxuICAgICAgICB0aGFuIHlvdSdyZSB0YWtpbmcgaW4uIFRoZXJlIGFyZSBzb21lIGNvb2wgZmllbGQgb3B0aW9ucyB0byBoZWxwXG4gICAgICAgIHdpdGggdGhpcyAqL1xuICAgICAgICB2aW1lbzoge1xuICAgICAgICAgICAgaW5wdXRUeXBlOiAnSW50JyxcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIGlkOiAnSW50JyxcbiAgICAgICAgICAgICAgICB1cmw6ICdTdHJpbmcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJhbnNsYXRlSW5wdXQ6IGlucHV0ID0+ICh7IGlkOiBpbnB1dCwgdXJsOiBgaHR0cHM6Ly92aW1lby5jb20vJHtpbnB1dH1gIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG5cdHBlcm1pc3Npb25zOiB7XG5cdFx0cHVibGljOiBbJ3JlYWQnXSxcblx0fSxcblx0c2luZ3VsYXI6ICdwaG90bycsXG5cdGZpZWxkczoge1xuXHRcdHBob3RvSWQ6IFN0cmluZyxcblx0XHRwcm9qZWN0SWQ6IFN0cmluZyxcblx0XHRzdGF0dXM6IFN0cmluZyxcblx0XHR1cmlzOiB7XG5cdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0dHlwZTogU3RyaW5nLFxuXHRcdFx0XHR1cmk6IFN0cmluZyxcblx0XHRcdFx0dXJsOiBTdHJpbmcsXG5cdFx0XHR9LFxuXHRcdH0sXG5cdFx0aGFzaDogU3RyaW5nLFxuXHRcdGRlc2NyaXB0aW9uOiBTdHJpbmcsXG5cdFx0Y2FwdHVyZWRBdDogRGF0ZSxcblx0XHRjcmVhdGVkQXQ6IERhdGUsXG5cdFx0dXBkYXRlZEF0OiBEYXRlLFxuXHR9LFxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuXHRwZXJtaXNzaW9uczoge1xuXHRcdHB1YmxpYzogWydyZWFkJ10sXG5cdH0sXG5cdHNpbmd1bGFyOiAncmV2aWV3Jyxcblx0ZmllbGRzOiB7XG5cdFx0YXV0aG9yTmFtZTogU3RyaW5nLFxuXHRcdGF1dGhvclVybDogU3RyaW5nLFxuXHRcdGxhbmd1YWdlOiBTdHJpbmcsXG5cdFx0b3JpZ2luYWxMYW5ndWFnZTogU3RyaW5nLFxuXHRcdHByb2ZpbGVQaG90b1VybDogU3RyaW5nLFxuXHRcdHJhdGluZzogTnVtYmVyLFxuXHRcdHJlbGF0aXZlVGltZURlc2NyaXB0aW9uOiBTdHJpbmcsXG5cdFx0dGV4dDogU3RyaW5nLFxuXHRcdHRpbWU6IERhdGUsXG5cdFx0dHJhbnNsYXRlZDogQm9vbGVhbixcblx0XHRzb3VyY2U6IFN0cmluZyxcblx0fSxcbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcblx0cGVybWlzc2lvbnM6IHtcblx0XHRwdWJsaWM6IFsncmVhZCddLFxuXHR9LFxuXHRzaW5ndWxhcjogJ3Jldmlld01ldGEnLFxuXHRmaWVsZHM6IHtcblx0XHRyYXRpbmc6IE51bWJlcixcblx0XHR1c2VyUmF0aW5nc1RvdGFsOiBOdW1iZXIsXG5cdH0sXG59XG4iLCJpbXBvcnQgZmllbGRzIGZyb20gJ0BjbXMvMS4gYnVpbGQvZmllbGRzJ1xubGV0IHsgUGxhaW5UZXh0LCBTZWxlY3QsIFRpbWVzdGFtcCwgUmVsYXRpb25zaGlwIH0gPSBmaWVsZHNcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgLy8gdGl0bGU6IFBsYWluVGV4dCh7IHJlcXVpcmVkOiB0cnVlIH0pLFxuICAgIGF1dGhvcjogUmVsYXRpb25zaGlwKHsgY29sbGVjdGlvbjogJ21lbWJlcicsIHNpbmdsZTogdHJ1ZSwgY29tcHV0ZWQ6IChkb2MsIHJlcSkgPT4gW3JlcT8ubWVtYmVyPy5pZF0gfHwgW10gfSksXG4gICAgZWRpdElkOiB7IGNvbXB1dGVkOiAoZG9jLCByZXEpID0+IHJlcT8ubWVtYmVyPy5pZCB8fCBudWxsIH0sXG4gICAgY3JlYXRlZDogeyBjb21wdXRlZDogZG9jID0+IGRvYy5jcmVhdGVkIHx8IG5ldyBEYXRlLCB0eXBlOiAnRmxvYXQnIH0sXG4gICAgdXBkYXRlZDogeyBjb21wdXRlZDogZG9jID0+IGRvYy51cGRhdGVkID8gbmV3IERhdGUgOiBkb2MuY3JlYXRlZCwgdHlwZTogJ0Zsb2F0JyB9LFxuICAgIHNsdWc6IHsgY29tcHV0ZWQ6IGRvYyA9PiBkb2M/LnRpdGxlPy50b0xvd2VyQ2FzZSgpPy50cmltKCk/LnJlcGxhY2UoL1teYS16QS1aMC05XFxzXS9nLCAnJyk/LnJlcGxhY2UoL1xccy9nLCAnLScpIH0sXG4gICAgc3RhcnREYXRlOiBUaW1lc3RhbXAoKSxcbiAgICBlbmREYXRlOiBUaW1lc3RhbXAoKSxcblxufVxuIiwiaW1wb3J0IHsgcmVhZEVudHJpZXMsIHVwZGF0ZUVudHJ5IH0gZnJvbSAnQGNtcy8xLiBidWlsZC9saWJyYXJpZXMvbW9uZ28nXG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0ZmllbGRzOiB7XG5cdFx0Zmlyc3ROYW1lOiBTdHJpbmcsXG5cdFx0bGFzdE5hbWU6IFN0cmluZyxcblx0XHR0aXRsZToge1xuXHRcdFx0cmVxdWlyZWQ6IGZhbHNlLFxuXHRcdFx0dHlwZTogU3RyaW5nLFxuXHRcdH0sXG5cdH0sXG5cdGZhbWlsaWVzOiB7XG5cdFx0Y29udHJpYnV0b3JzOiB7IHNpbmd1bGFyOiAnY29udHJpYnV0b3InIH0sXG5cdFx0ZWRpdG9yczogeyBzaW5ndWxhcjogJ2VkaXRvcicgfSxcblx0fSxcblx0aG9va3M6IHtcblx0XHRhc3luYyBjcmVhdGVkKHsgZG9jdW1lbnQgfSkge1xuXHRcdFx0bGV0IG1lbWJlcnMgPSBhd2FpdCByZWFkRW50cmllcyh7IGNvbGxlY3Rpb246ICdtZW1iZXJzJyB9KVxuXHRcdFx0aWYgKG1lbWJlcnMubGVuZ3RoID09IDEgJiYgbWVtYmVyc1swXS5pZCA9PSBkb2N1bWVudC5pZCkge1xuXHRcdFx0XHRkb2N1bWVudC5yb2xlcyA9IFsnYWRtaW4nXVxuXHRcdFx0XHRkb2N1bWVudC5hdXRob3JJZCA9IGRvY3VtZW50LmlkXG5cdFx0XHRcdGRvY3VtZW50LmF1dGhvciA9IGRvY3VtZW50LmlkXG5cblx0XHRcdFx0YXdhaXQgdXBkYXRlRW50cnkoe1xuXHRcdFx0XHRcdGNvbGxlY3Rpb246ICdtZW1iZXJzJyxcblx0XHRcdFx0XHRkb2N1bWVudDoge1xuXHRcdFx0XHRcdFx0cm9sZXM6IFsnYWRtaW4nXSxcblx0XHRcdFx0XHRcdGF1dGhvcjogW2RvY3VtZW50LmlkXSxcblx0XHRcdFx0XHRcdGF1dGhvcklkOiBkb2N1bWVudC5pZCxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNlYXJjaDogeyBpZDogZG9jdW1lbnQuaWQgfSxcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9LFxuXHR9LFxufVxuIiwidmFyIG1hcCA9IHtcblx0XCIuL2NvbXBhbnlDYW0uanNcIjogXCIuLi8uLi9tYW5nby9lbmRwb2ludHMvY29tcGFueUNhbS5qc1wiLFxuXHRcIi4vaW5kZXguanNcIjogXCIuLi8uLi9tYW5nby9lbmRwb2ludHMvaW5kZXguanNcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi4vLi4vbWFuZ28vZW5kcG9pbnRzIHN5bmMgcmVjdXJzaXZlIC4qXFxcXC5qcyRcIjsiLCJpbXBvcnQgeyBzeW5jQWxsUGhvdG9zLCBwcm9qZWN0cyB9IGZyb20gJy4uL2hlbHBlcnMvY29tcGFueUNhbS5qcydcbmltcG9ydCB7IGdldE1lbWJlciwgcmVhZEVudHJpZXMsIGNyZWF0ZUVudHJ5LCB1cGRhdGVFbnRyeSwgZGVsZXRlRW50cnkgfSBmcm9tICdAbWFuZ28nXG5cbmNvbnN0IHByb2plY3RJZHMgPSBPYmplY3QudmFsdWVzKHByb2plY3RzKS5tYXAoKHApID0+IHAuaWQpXG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aG9va3M6IHtcblx0XHRwb3N0OiBhc3luYyAocmVxLCByZXMpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IHsgZXZlbnRfdHlwZSwgcGF5bG9hZCB9ID0gcmVxLmJvZHlcblx0XHRcdFx0Y29uc3QgcGhvdG8gPSBwYXlsb2FkPy5waG90b1xuXG5cdFx0XHRcdGlmICghcGhvdG8gfHwgIXBob3RvLnByb2plY3RfaWQpIHtcblx0XHRcdFx0XHRyZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiAnTm8gcGhvdG8gb3IgcHJvamVjdF9pZCBpbiBwYXlsb2FkJyB9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIXByb2plY3RJZHMuaW5jbHVkZXMocGhvdG8ucHJvamVjdF9pZCkpIHtcblx0XHRcdFx0XHRyZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiAnUHJvamVjdCBub3QgdHJhY2tlZCcgfVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgZG9jdW1lbnQgPSB7XG5cdFx0XHRcdFx0cGhvdG9JZDogcGhvdG8uaWQsXG5cdFx0XHRcdFx0cHJvamVjdElkOiBwaG90by5wcm9qZWN0X2lkLFxuXHRcdFx0XHRcdHN0YXR1czogcGhvdG8uc3RhdHVzLFxuXHRcdFx0XHRcdHVyaXM6IHBob3RvLnVyaXM/Lm1hcCgodSkgPT4gKHsgdHlwZTogdS50eXBlLCB1cmk6IHUudXJpLCB1cmw6IHUudXJsIH0pKSB8fCBbXSxcblx0XHRcdFx0XHRoYXNoOiBwaG90by5oYXNoLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBwaG90by5kZXNjcmlwdGlvbixcblx0XHRcdFx0XHRjYXB0dXJlZEF0OiBwaG90by5jYXB0dXJlZF9hdCA/IG5ldyBEYXRlKHBob3RvLmNhcHR1cmVkX2F0ICogMTAwMCkgOiBudWxsLFxuXHRcdFx0XHRcdGNyZWF0ZWRBdDogcGhvdG8uY3JlYXRlZF9hdCA/IG5ldyBEYXRlKHBob3RvLmNyZWF0ZWRfYXQgKiAxMDAwKSA6IG51bGwsXG5cdFx0XHRcdFx0dXBkYXRlZEF0OiBwaG90by51cGRhdGVkX2F0ID8gbmV3IERhdGUocGhvdG8udXBkYXRlZF9hdCAqIDEwMDApIDogbnVsbCxcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgcmVhZEVudHJpZXMoe1xuXHRcdFx0XHRcdGNvbGxlY3Rpb246ICdwaG90b3MnLFxuXHRcdFx0XHRcdHNlYXJjaDogeyBwaG90b0lkOiBwaG90by5pZCB9LFxuXHRcdFx0XHRcdGxpbWl0OiAxLFxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdGlmIChldmVudF90eXBlID09PSAncGhvdG8uZGVsZXRlZCcpIHtcblx0XHRcdFx0XHRpZiAoZXhpc3RpbmcgJiYgZXhpc3RpbmcubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0YXdhaXQgZGVsZXRlRW50cnkoe1xuXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAncGhvdG9zJyxcblx0XHRcdFx0XHRcdFx0c2VhcmNoOiB7IHBob3RvSWQ6IHBob3RvLmlkIH0sXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0cmVzLnN0YXR1cygyMDQpXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzLnN0YXR1cyg0MDQpXG5cdFx0XHRcdFx0cmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdQaG90byBub3QgZm91bmQnIH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChldmVudF90eXBlID09PSAncGhvdG8uY3JlYXRlZCcgfHwgZXZlbnRfdHlwZSA9PT0gJ3Bob3RvLnVwZGF0ZWQnKSB7XG5cdFx0XHRcdFx0aWYgKGV4aXN0aW5nICYmIGV4aXN0aW5nLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdGF3YWl0IHVwZGF0ZUVudHJ5KHtcblx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ3Bob3RvcycsXG5cdFx0XHRcdFx0XHRcdHNlYXJjaDogeyBwaG90b0lkOiBwaG90by5pZCB9LFxuXHRcdFx0XHRcdFx0XHRkb2N1bWVudCxcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRyZXMuc3RhdHVzKDIwMClcblx0XHRcdFx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGFjdGlvbjogJ3VwZGF0ZWQnIH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YXdhaXQgY3JlYXRlRW50cnkoe1xuXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAncGhvdG9zJyxcblx0XHRcdFx0XHRcdFx0ZG9jdW1lbnQsXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0cmVzLnN0YXR1cygyMDEpXG5cdFx0XHRcdFx0XHRyZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBhY3Rpb246ICdjcmVhdGVkJyB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJlcy5zdGF0dXMoNDAwKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0NvbXBhbnlDYW0gd2ViaG9vayBlcnJvcjonLCBlcnJvcilcblx0XHRcdFx0cmVzLnN0YXR1cyg1MDApXG5cdFx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9XG5cdFx0XHR9XG5cdFx0fSxcblx0fSxcblx0J3N5bmMtcGhvdG9zJzoge1xuXHRcdGFzeW5jIGdldChyZXEsIHJlcykge1xuXHRcdFx0Y29uc3QgbWVtYmVyID0gYXdhaXQgZ2V0TWVtYmVyKHJlcSlcblx0XHRcdGlmICghbWVtYmVyIHx8ICFtZW1iZXIucm9sZXMuaW5jbHVkZXMoJ2FkbWluJykpIHtcblx0XHRcdFx0cmVzLnN0YXR1cyg0MDMpXG5cdFx0XHRcdHJldHVybiB7IGVycm9yOiAnVW5hdXRob3JpemVkJyB9XG5cdFx0XHR9XG5cdFx0XHRjb25zdCByZXN1bHRzID0gYXdhaXQgc3luY0FsbFBob3RvcygpXG5cdFx0XHRyZXR1cm4gcmVzdWx0c1xuXHRcdH0sXG5cdH0sXG59XG4iLCJpbXBvcnQgeyBnZXRNZW1iZXIsIHNlbmRFbWFpbCwgcmVhZEVudHJpZXMsIGNvdW50RW50cmllcyB9IGZyb20gJ0BtYW5nbydcbmltcG9ydCB7IHN5bmNSZXZpZXdzIH0gZnJvbSAnLi4vYXV0b21hdGlvbi9zeW5jUmV2aWV3cy5qcydcbmltcG9ydCB7IHByb2plY3RzIH0gZnJvbSAnLi4vaGVscGVycy9jb21wYW55Q2FtLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdCdnYWxsZXJ5LWNhdGVnb3JpZXMnOiB7XG5cdFx0YXN5bmMgZ2V0KHJlcSwgcmVzKSB7XG5cdFx0XHRjb25zdCBjYXRlZ29yaWVzID0gW3sga2V5OiAnYWxsJywgbGFiZWw6ICdBbGwnLCBjb3VudDogMCB9XVxuXG5cdFx0XHRmb3IgKGNvbnN0IFtrZXksIHByb2plY3RdIG9mIE9iamVjdC5lbnRyaWVzKHByb2plY3RzKSkge1xuXHRcdFx0XHRjb25zdCBjb3VudCA9IGF3YWl0IGNvdW50RW50cmllcyh7XG5cdFx0XHRcdFx0Y29sbGVjdGlvbjogJ3Bob3RvcycsXG5cdFx0XHRcdFx0c2VhcmNoOiB7IHByb2plY3RJZDogcHJvamVjdC5pZCB9LFxuXHRcdFx0XHR9KVxuXHRcdFx0XHRjYXRlZ29yaWVzLnB1c2goe1xuXHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHRsYWJlbDogcHJvamVjdC5uYW1lLnJlcGxhY2UoJyMnLCAnJyksXG5cdFx0XHRcdFx0Y291bnQsXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cblx0XHRcdGNhdGVnb3JpZXNbMF0uY291bnQgPSBjYXRlZ29yaWVzLnNsaWNlKDEpLnJlZHVjZSgoc3VtLCBjKSA9PiBzdW0gKyBjLmNvdW50LCAwKVxuXG5cdFx0XHRyZXR1cm4gY2F0ZWdvcmllc1xuXHRcdH0sXG5cdH0sXG5cdCdnYWxsZXJ5LXBob3Rvcyc6IHtcblx0XHRhc3luYyBnZXQocmVxLCByZXMpIHtcblx0XHRcdGNvbnN0IHsgY2F0ZWdvcnkgfSA9IHJlcS5xdWVyeVxuXHRcdFx0bGV0IHNlYXJjaCA9IHt9XG5cblx0XHRcdGlmIChjYXRlZ29yeSAmJiBjYXRlZ29yeSAhPT0gJ2FsbCcgJiYgcHJvamVjdHNbY2F0ZWdvcnldKSB7XG5cdFx0XHRcdHNlYXJjaCA9IHsgcHJvamVjdElkOiBwcm9qZWN0c1tjYXRlZ29yeV0uaWQgfVxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBhbGxQaG90b3MgPSBhd2FpdCByZWFkRW50cmllcyh7XG5cdFx0XHRcdGNvbGxlY3Rpb246ICdwaG90b3MnLFxuXHRcdFx0XHRzZWFyY2gsXG5cdFx0XHRcdGxpbWl0OiA1MDAsXG5cdFx0XHR9KVxuXG5cdFx0XHRjb25zdCBwaG90b3MgPSBhbGxQaG90b3MubWFwKChwKSA9PiAoe1xuXHRcdFx0XHRwaG90b0lkOiBwLnBob3RvSWQsXG5cdFx0XHRcdHByb2plY3RJZDogcC5wcm9qZWN0SWQsXG5cdFx0XHRcdHVybDogcC51cmlzPy5maW5kKCh1KSA9PiB1LnR5cGUgPT09ICdvcmlnaW5hbCcpPy51cmwgfHwgcC51cmlzPy5bMF0/LnVybCB8fCAnJyxcblx0XHRcdH0pKVxuXG5cdFx0XHRpZiAoIWNhdGVnb3J5IHx8IGNhdGVnb3J5ID09PSAnYWxsJykge1xuXHRcdFx0XHRjb25zdCBwcm9qZWN0S2V5cyA9IE9iamVjdC5rZXlzKHByb2plY3RzKVxuXHRcdFx0XHRjb25zdCBncm91cGVkID0ge31cblx0XHRcdFx0Zm9yIChjb25zdCBrZXkgb2YgcHJvamVjdEtleXMpIHtcblx0XHRcdFx0XHRncm91cGVkW2tleV0gPSBwaG90b3MuZmlsdGVyKChwKSA9PiBwLnByb2plY3RJZCA9PT0gcHJvamVjdHNba2V5XS5pZClcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG1peGVkID0gW11cblx0XHRcdFx0bGV0IGhhc01vcmUgPSB0cnVlXG5cdFx0XHRcdHdoaWxlIChoYXNNb3JlKSB7XG5cdFx0XHRcdFx0aGFzTW9yZSA9IGZhbHNlXG5cdFx0XHRcdFx0Zm9yIChjb25zdCBrZXkgb2YgcHJvamVjdEtleXMpIHtcblx0XHRcdFx0XHRcdGlmIChncm91cGVkW2tleV0ubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0XHRtaXhlZC5wdXNoKGdyb3VwZWRba2V5XS5zaGlmdCgpKVxuXHRcdFx0XHRcdFx0XHRoYXNNb3JlID0gdHJ1ZVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbWl4ZWRcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHBob3Rvc1xuXHRcdH0sXG5cdH0sXG5cdCdzeW5jLXJldmlld3MnOiB7XG5cdFx0YXN5bmMgZ2V0KHJlcSwgcmVzKSB7XG5cdFx0XHRjb25zdCBtZW1iZXIgPSBhd2FpdCBnZXRNZW1iZXIocmVxKVxuXHRcdFx0aWYgKCFtZW1iZXIgfHwgIW1lbWJlci5yb2xlcy5pbmNsdWRlcygnYWRtaW4nKSkge1xuXHRcdFx0XHRyZXMuc3RhdHVzKDQwMylcblx0XHRcdFx0cmV0dXJuIHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQnIH1cblx0XHRcdH1cblx0XHRcdGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBzeW5jUmV2aWV3cygpXG5cdFx0XHRyZXR1cm4gcmVzdWx0c1xuXHRcdH0sXG5cdH0sXG5cdHRlc3Q6IHtcblx0XHRhc3luYyBnZXQocmVxKSB7XG5cdFx0XHRyZXR1cm4gYE1hbmdvIGlzIG9ubGluZSEg8J+lrWBcblx0XHR9LFxuXHR9LFxuXHRjb250YWN0OiB7XG5cdFx0YWRtaW46IHtcblx0XHRcdGFzeW5jIHBvc3QocmVxKSB7XG5cdFx0XHRcdHJldHVybiBgWW91IGhpdCAvY29udGFjdC9hZG1pbiB3aXRoIGEgcG9zdCByZXF1ZXN0YFxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdGVkaXRvcjoge1xuXHRcdFx0YXN5bmMgZ2V0KHJlcSkge1xuXHRcdFx0XHRyZXR1cm4gYFlvdSBoaXQgL2NvbnRhY3QvZWRpdG9yIHdpdGggYSBnZXQgcmVxdWVzdGBcblx0XHRcdH0sXG5cdFx0fSxcblx0XHRhc3luYyBwb3N0KHJlcSkge1xuXHRcdFx0Y29uc3QgeyBuYW1lLCBlbWFpbCwgcGhvbmUsIHF1b3RlLCBhZGRyZXNzIH0gPSByZXEuYm9keVxuXHRcdFx0Y29uc3QgZm9ybWF0dGVkUGhvbmUgPSBwaG9uZSA/IGAoJHtwaG9uZS5zbGljZSgwLCAzKX0pICR7cGhvbmUuc2xpY2UoMywgNil9LSR7cGhvbmUuc2xpY2UoNiwgMTApfWAgOiAnTm90IHByb3ZpZGVkJ1xuXHRcdFx0Y29uc3QgaXNRdW90ZSA9ICEhYWRkcmVzc1xuXG5cdFx0XHRjb25zdCBodG1sID0gYFxuPCFET0NUWVBFIGh0bWw+XG48aHRtbD5cbjxoZWFkPlxuPG1ldGEgbmFtZT1cImNvbG9yLXNjaGVtZVwiIGNvbnRlbnQ9XCJsaWdodCBvbmx5XCI+XG48bWV0YSBuYW1lPVwic3VwcG9ydGVkLWNvbG9yLXNjaGVtZXNcIiBjb250ZW50PVwibGlnaHQgb25seVwiPlxuPC9oZWFkPlxuPGJvZHkgc3R5bGU9XCJtYXJnaW46IDA7IHBhZGRpbmc6IDA7IGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7IGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcIj5cbjx0YWJsZSByb2xlPVwicHJlc2VudGF0aW9uXCIgd2lkdGg9XCIxMDAlXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCIwXCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1wiPlxuPHRyPlxuPHRkIGFsaWduPVwiY2VudGVyXCIgc3R5bGU9XCJwYWRkaW5nOiA0MHB4IDIwcHg7XCI+XG48dGFibGUgcm9sZT1cInByZXNlbnRhdGlvblwiIHdpZHRoPVwiNjAwXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCIwXCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmOyBib3JkZXItcmFkaXVzOiA4cHg7IG92ZXJmbG93OiBoaWRkZW47XCI+XG5cbjwhLS0gSGVhZGVyIC0tPlxuPHRyPlxuPHRkIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogIzFhMWExYTsgcGFkZGluZzogMzJweCA0MHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7XCI+XG48aDEgc3R5bGU9XCJtYXJnaW46IDA7IGZvbnQtc2l6ZTogMjhweDsgZm9udC13ZWlnaHQ6IDcwMDsgY29sb3I6ICNmZmZmZmY7IGxldHRlci1zcGFjaW5nOiAtMC41cHg7XCI+QmVsayBIZWF0aW5nICYgQ29vbGluZzwvaDE+XG48cCBzdHlsZT1cIm1hcmdpbjogOHB4IDAgMDsgZm9udC1zaXplOiAxNHB4OyBjb2xvcjogI2EzYTNhMztcIj4ke2lzUXVvdGUgPyAnTmV3IFF1b3RlIFJlcXVlc3QnIDogJ05ldyBDb250YWN0IE1lc3NhZ2UnfTwvcD5cbjwvdGQ+XG48L3RyPlxuXG48IS0tIFJlZCBhY2NlbnQgYmFyIC0tPlxuPHRyPlxuPHRkIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI2I5MWMxYzsgaGVpZ2h0OiA0cHg7XCI+PC90ZD5cbjwvdHI+XG5cbjwhLS0gQ29udGVudCAtLT5cbjx0cj5cbjx0ZCBzdHlsZT1cInBhZGRpbmc6IDMycHggNDBweDtcIj5cblxuPHRhYmxlIHJvbGU9XCJwcmVzZW50YXRpb25cIiB3aWR0aD1cIjEwMCVcIiBjZWxsc3BhY2luZz1cIjBcIiBjZWxscGFkZGluZz1cIjBcIj5cbjx0cj5cbjx0ZCBzdHlsZT1cInBhZGRpbmctYm90dG9tOiAyNHB4OyBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2U1ZTVlNTtcIj5cbjxwIHN0eWxlPVwibWFyZ2luOiAwIDAgNHB4OyBmb250LXNpemU6IDEycHg7IHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IGxldHRlci1zcGFjaW5nOiAxcHg7IGNvbG9yOiAjNzM3MzczO1wiPk5hbWU8L3A+XG48cCBzdHlsZT1cIm1hcmdpbjogMDsgZm9udC1zaXplOiAxNnB4OyBmb250LXdlaWdodDogNjAwOyBjb2xvcjogIzE3MTcxNztcIj4ke25hbWV9PC9wPlxuPC90ZD5cbjwvdHI+XG48dHI+XG48dGQgc3R5bGU9XCJwYWRkaW5nOiAyNHB4IDA7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTVlNWU1O1wiPlxuPHAgc3R5bGU9XCJtYXJnaW46IDAgMCA0cHg7IGZvbnQtc2l6ZTogMTJweDsgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgbGV0dGVyLXNwYWNpbmc6IDFweDsgY29sb3I6ICM3MzczNzM7XCI+RW1haWw8L3A+XG48cCBzdHlsZT1cIm1hcmdpbjogMDsgZm9udC1zaXplOiAxNnB4OyBjb2xvcjogIzE3MTcxNztcIj48YSBocmVmPVwibWFpbHRvOiR7ZW1haWx9XCIgc3R5bGU9XCJjb2xvcjogIzE3MTcxNzsgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XCI+JHtlbWFpbH08L2E+PC9wPlxuPC90ZD5cbjwvdHI+XG48dHI+XG48dGQgc3R5bGU9XCJwYWRkaW5nOiAyNHB4IDA7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTVlNWU1O1wiPlxuPHAgc3R5bGU9XCJtYXJnaW46IDAgMCA0cHg7IGZvbnQtc2l6ZTogMTJweDsgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgbGV0dGVyLXNwYWNpbmc6IDFweDsgY29sb3I6ICM3MzczNzM7XCI+UGhvbmU8L3A+XG48cCBzdHlsZT1cIm1hcmdpbjogMDsgZm9udC1zaXplOiAxNnB4OyBjb2xvcjogIzE3MTcxNztcIj48YSBocmVmPVwidGVsOiR7cGhvbmV9XCIgc3R5bGU9XCJjb2xvcjogIzE3MTcxNzsgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XCI+JHtmb3JtYXR0ZWRQaG9uZX08L2E+PC9wPlxuPC90ZD5cbjwvdHI+XG4ke1xuXHRpc1F1b3RlXG5cdFx0PyBgXG48dHI+XG48dGQgc3R5bGU9XCJwYWRkaW5nOiAyNHB4IDA7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTVlNWU1O1wiPlxuPHAgc3R5bGU9XCJtYXJnaW46IDAgMCA0cHg7IGZvbnQtc2l6ZTogMTJweDsgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgbGV0dGVyLXNwYWNpbmc6IDFweDsgY29sb3I6ICM3MzczNzM7XCI+Sm9iIExvY2F0aW9uPC9wPlxuPHAgc3R5bGU9XCJtYXJnaW46IDA7IGZvbnQtc2l6ZTogMTZweDsgZm9udC13ZWlnaHQ6IDUwMDsgY29sb3I6ICMxNzE3MTc7XCI+JHthZGRyZXNzfTwvcD5cbjwvdGQ+XG48L3RyPlxuYFxuXHRcdDogJydcbn1cbjx0cj5cbjx0ZCBzdHlsZT1cInBhZGRpbmctdG9wOiAyNHB4O1wiPlxuPHAgc3R5bGU9XCJtYXJnaW46IDAgMCAxMnB4OyBmb250LXNpemU6IDEycHg7IHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IGxldHRlci1zcGFjaW5nOiAxcHg7IGNvbG9yOiAjNzM3MzczO1wiPk1lc3NhZ2U8L3A+XG48ZGl2IHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI2ZhZmFmYTsgYm9yZGVyLXJhZGl1czogNnB4OyBwYWRkaW5nOiAyMHB4OyBib3JkZXItbGVmdDogM3B4IHNvbGlkICNiOTFjMWM7XCI+XG48cCBzdHlsZT1cIm1hcmdpbjogMDsgZm9udC1zaXplOiAxNXB4OyBsaW5lLWhlaWdodDogMS42OyBjb2xvcjogIzE3MTcxNzsgd2hpdGUtc3BhY2U6IHByZS13cmFwO1wiPiR7cXVvdGV9PC9wPlxuPC9kaXY+XG48L3RkPlxuPC90cj5cbjwvdGFibGU+XG5cbjwvdGQ+XG48L3RyPlxuXG48IS0tIEZvb3RlciAtLT5cbjx0cj5cbjx0ZCBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNmYWZhZmE7IHBhZGRpbmc6IDIwcHggNDBweDsgdGV4dC1hbGlnbjogY2VudGVyOyBib3JkZXItdG9wOiAxcHggc29saWQgI2U1ZTVlNTtcIj5cbjxwIHN0eWxlPVwibWFyZ2luOiAwOyBmb250LXNpemU6IDEycHg7IGNvbG9yOiAjNzM3MzczO1wiPlNlbnQgZnJvbSBCZWxrIEhlYXRpbmcgJiBDb29saW5nIHdlYnNpdGU8L3A+XG48L3RkPlxuPC90cj5cblxuPC90YWJsZT5cbjwvdGQ+XG48L3RyPlxuPC90YWJsZT5cbjwvYm9keT5cbjwvaHRtbD5cblx0XHRcdGBcblxuXHRcdFx0YXdhaXQgc2VuZEVtYWlsKHtcblx0XHRcdFx0dG86ICdiZWxraGVhdGluZ2FuZGNvb2xpbmdAZ21haWwuY29tJyxcblx0XHRcdFx0ZnJvbTogJ2pheV9sb3R0X2lucXVpcmllc0BocHB0aC5jb20nLFxuXHRcdFx0XHRzdWJqZWN0OiBgJHtpc1F1b3RlID8gJ1F1b3RlIFJlcXVlc3QnIDogJ0NvbnRhY3QgTWVzc2FnZSd9IGZyb20gJHtuYW1lfSAtIEJlbGsgSGVhdGluZyAmIENvb2xpbmdgLFxuXHRcdFx0XHRib2R5OiBodG1sLFxuXHRcdFx0fSlcblxuXHRcdFx0cmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XG5cdFx0fSxcblx0fSxcbn1cbiIsInZhciBtYXAgPSB7XG5cdFwiLi92aW1lby5qc1wiOiBcIi4uLy4uL21hbmdvL2ZpZWxkcy92aW1lby5qc1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuLi8uLi9tYW5nby9maWVsZHMgc3luYyByZWN1cnNpdmUgLipcXFxcLmpzJFwiOyIsImltcG9ydCBheGlvcyBmcm9tICdheGlvcydcbmNvbnN0IGFwaUtleSA9ICdZT1VSLVZJTUVPLUFQSS1LRVknXG5cbmNvbnN0IGdldFZpZGVvVGh1bWJuYWlsID0gYXN5bmMgZnVuY3Rpb24gKHZpZGVvKSB7XG4gICAgbGV0IHZpZGVvRGF0YSA9IGF3YWl0IGF4aW9zLmdldChgaHR0cHM6Ly92aW1lby5jb20vYXBpL3YyL3ZpZGVvLyR7dmlkZW8uaWR9Lmpzb25gKVxuICAgIHJldHVybiB2aWRlb0RhdGE/LmRhdGE/LlswXT8udGh1bWJuYWlsX2xhcmdlXG59XG5cbi8vIGNvbnN0IGdldERvd25sb2FkTGluayA9IGFzeW5jIGZ1bmN0aW9uKHZpZGVvKSB7XG4vLyAgICAgbGV0IHVybCA9IGBodHRwczovL2FwaS52aW1lby5jb20vdmlkZW9zLyR7dmlkZW8uaWR9P2FjY2Vzc190b2tlbj0ke2FwaUtleX1gXG4vLyAgICAgbGV0IHZpZGVvRGF0YSA9IGF3YWl0IGF4aW9zLmdldCh1cmwpXG4vLyAgICAgdmlkZW9EYXRhID0gdmlkZW9EYXRhPy5kYXRhPy5kb3dubG9hZD8uZmlsdGVyKGRvd25sb2FkID0+IGRvd25sb2FkPy5xdWFsaXR5ICE9ICdzb3VyY2UnKVxuLy8gICAgIGxldCBiZXN0RG93bmxvYWQgPSB2aWRlb0RhdGEucmVkdWNlKChjaGFsbGVuZ2VyLCBjaGFtcCkgPT4gY2hhbGxlbmdlci5oZWlnaHQgPiBjaGFtcC5oZWlnaHQgPyBjaGFsbGVuZ2VyIDogY2hhbXAsIHZpZGVvRGF0YVswXSlcbi8vICAgICByZXR1cm4gYmVzdERvd25sb2FkPy5saW5rXG4vLyB9XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICB0eXBlOiAnVmltZW8nLFxuICAgIGlucHV0VHlwZTogU3RyaW5nLFxuICAgIGZpZWxkczoge1xuICAgICAgICBpZDoge30sXG4gICAgICAgIHVybDoge30sXG4gICAgICAgIHRodW1ibmFpbDoge1xuICAgICAgICAgICAgY29tcHV0ZWQ6IGdldFZpZGVvVGh1bWJuYWlsLFxuICAgICAgICAgICAgZXhwaXJlQ2FjaGU6IDYwICogNjAgKiAyNCAqIDMwXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGRvd25sb2FkOiB7XG4gICAgICAgIC8vICAgICBjb21wdXRlZDogZ2V0RG93bmxvYWRMaW5rLFxuICAgICAgICAvLyAgICAgZXhwaXJlQ2FjaGU6IDYwKjYwKjI0KjFcbiAgICAgICAgLy8gfSxcbiAgICB9LFxuICAgIHRyYW5zbGF0ZUlucHV0OiBpbnB1dCA9PiAoe1xuICAgICAgICBpZDogYCR7aW5wdXR9YCxcbiAgICAgICAgdXJsOiBgaHR0cHM6Ly92aW1lby5jb20vJHtpbnB1dH1gLFxuICAgIH0pXG59XG4iLCJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5pbXBvcnQgeyByZWFkRW50cmllcywgY3JlYXRlRW50cnksIHVwZGF0ZUVudHJ5IH0gZnJvbSAnQG1hbmdvJ1xuaW1wb3J0IHNldHRpbmdzIGZyb20gJ0BzZXR0aW5ncydcblxuY29uc3QgQVBJX0JBU0UgPSAnaHR0cHM6Ly9hcGkuY29tcGFueWNhbS5jb20vdjInXG5cbmV4cG9ydCBjb25zdCBwcm9qZWN0cyA9IHtcblx0bWV0YWw6IHtcblx0XHRuYW1lOiAnI01ldGFsIFJvb2ZzJyxcblx0XHRjYXRlZ29yeTogJ01ldGFsIFJvb2ZpbmcnLFxuXHRcdGlkOiAnOTcxNDQwNjAnLFxuXHR9LFxuXHRzaGluZ2xlOiB7XG5cdFx0bmFtZTogJyNTaGluZ2xlIFJvb2ZzJyxcblx0XHRjYXRlZ29yeTogJ1NoaW5nbGUgUm9vZmluZycsXG5cdFx0aWQ6ICc5NzE0NDI2MycsXG5cdH0sXG5cdHJlcGFpcnM6IHtcblx0XHRuYW1lOiAnI1Jvb2YgUmVwYWlycycsXG5cdFx0Y2F0ZWdvcnk6ICdSb29mIFJlcGFpcnMnLFxuXHRcdGlkOiAnOTcxNDQ1MjknLFxuXHR9LFxuXHRmbGF0OiB7XG5cdFx0bmFtZTogJyNGbGF0IFJvb2ZzICYgQ29hdGluZycsXG5cdFx0Y2F0ZWdvcnk6ICdGbGF0IFJvb2ZpbmcnLFxuXHRcdGlkOiAnOTcxNDQ1OTInLFxuXHR9LFxuXHRyZW5vdmF0aW9uOiB7XG5cdFx0bmFtZTogJyNIb21lIFJlbm92YXRpb24nLFxuXHRcdGNhdGVnb3J5OiAnSG9tZSBSZW5vdmF0aW9uJyxcblx0XHRpZDogJzk3MTQ0NzYxJyxcblx0fSxcblx0Y29uc3RydWN0aW9uOiB7XG5cdFx0bmFtZTogJyNDb25zdHJ1Y3Rpb24gUHJvamVjdHMnLFxuXHRcdGNhdGVnb3J5OiAnQ29uc3RydWN0aW9uJyxcblx0XHRpZDogJzk3MTQ0NzMwJyxcblx0fSxcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hGcm9tQ29tcGFueUNhbShlbmRwb2ludCwgcGFyYW1zID0ge30pIHtcblx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoYCR7QVBJX0JBU0V9JHtlbmRwb2ludH1gLCB7XG5cdFx0cGFyYW1zLFxuXHRcdGhlYWRlcnM6IHtcblx0XHRcdEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtzZXR0aW5ncy5jb21wYW55Q2FtVG9rZW59YCxcblx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0fSxcblx0fSlcblx0cmV0dXJuIHJlc3BvbnNlLmRhdGFcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3RQcm9qZWN0cyhwYXJhbXMgPSB7fSkge1xuXHRyZXR1cm4gZmV0Y2hGcm9tQ29tcGFueUNhbSgnL3Byb2plY3RzJywgcGFyYW1zKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGlzdFByb2plY3RQaG90b3MocHJvamVjdElkLCBwYXJhbXMgPSB7fSkge1xuXHRyZXR1cm4gZmV0Y2hGcm9tQ29tcGFueUNhbShgL3Byb2plY3RzLyR7cHJvamVjdElkfS9waG90b3NgLCBwYXJhbXMpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXN0UGhvdG9zKHBhcmFtcyA9IHt9KSB7XG5cdHJldHVybiBmZXRjaEZyb21Db21wYW55Q2FtKCcvcGhvdG9zJywgcGFyYW1zKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UGhvdG8ocGhvdG9JZCkge1xuXHRyZXR1cm4gZmV0Y2hGcm9tQ29tcGFueUNhbShgL3Bob3Rvcy8ke3Bob3RvSWR9YClcbn1cblxuYXN5bmMgZnVuY3Rpb24gc3luY1Bob3Rvc0Zyb21Qcm9qZWN0KHByb2plY3RJZCkge1xuXHRjb25zdCByZXN1bHRzID0geyBjcmVhdGVkOiAwLCB1cGRhdGVkOiAwLCBlcnJvcnM6IFtdIH1cblx0bGV0IHBhZ2UgPSAxXG5cdGxldCBoYXNNb3JlID0gdHJ1ZVxuXG5cdHdoaWxlIChoYXNNb3JlKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHBob3RvcyA9IGF3YWl0IGxpc3RQcm9qZWN0UGhvdG9zKHByb2plY3RJZCwgeyBwYWdlLCBwZXJfcGFnZTogMTAwIH0pXG5cblx0XHRcdGlmICghcGhvdG9zIHx8IHBob3Rvcy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0aGFzTW9yZSA9IGZhbHNlXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHR9XG5cblx0XHRcdGZvciAoY29uc3QgcGhvdG8gb2YgcGhvdG9zKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3QgZXhpc3RpbmcgPSBhd2FpdCByZWFkRW50cmllcyh7XG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAncGhvdG9zJyxcblx0XHRcdFx0XHRcdHNlYXJjaDogeyBwaG90b0lkOiBwaG90by5pZCB9LFxuXHRcdFx0XHRcdFx0bGltaXQ6IDEsXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdGNvbnN0IGRvY3VtZW50ID0ge1xuXHRcdFx0XHRcdFx0cGhvdG9JZDogcGhvdG8uaWQsXG5cdFx0XHRcdFx0XHRwcm9qZWN0SWQ6IHBob3RvLnByb2plY3RfaWQsXG5cdFx0XHRcdFx0XHRzdGF0dXM6IHBob3RvLnN0YXR1cyxcblx0XHRcdFx0XHRcdHVyaXM6IHBob3RvLnVyaXM/Lm1hcCgodSkgPT4gKHsgdHlwZTogdS50eXBlLCB1cmk6IHUudXJpLCB1cmw6IHUudXJsIH0pKSB8fCBbXSxcblx0XHRcdFx0XHRcdGhhc2g6IHBob3RvLmhhc2gsXG5cdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogcGhvdG8uZGVzY3JpcHRpb24sXG5cdFx0XHRcdFx0XHRjYXB0dXJlZEF0OiBwaG90by5jYXB0dXJlZF9hdCA/IG5ldyBEYXRlKHBob3RvLmNhcHR1cmVkX2F0ICogMTAwMCkgOiBudWxsLFxuXHRcdFx0XHRcdFx0Y3JlYXRlZEF0OiBwaG90by5jcmVhdGVkX2F0ID8gbmV3IERhdGUocGhvdG8uY3JlYXRlZF9hdCAqIDEwMDApIDogbnVsbCxcblx0XHRcdFx0XHRcdHVwZGF0ZWRBdDogcGhvdG8udXBkYXRlZF9hdCA/IG5ldyBEYXRlKHBob3RvLnVwZGF0ZWRfYXQgKiAxMDAwKSA6IG51bGwsXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGV4aXN0aW5nICYmIGV4aXN0aW5nLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdGF3YWl0IHVwZGF0ZUVudHJ5KHtcblx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ3Bob3RvcycsXG5cdFx0XHRcdFx0XHRcdHNlYXJjaDogeyBwaG90b0lkOiBwaG90by5pZCB9LFxuXHRcdFx0XHRcdFx0XHRkb2N1bWVudCxcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRyZXN1bHRzLnVwZGF0ZWQrK1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhd2FpdCBjcmVhdGVFbnRyeSh7XG5cdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdwaG90b3MnLFxuXHRcdFx0XHRcdFx0XHRkb2N1bWVudCxcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRyZXN1bHRzLmNyZWF0ZWQrK1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdFx0cmVzdWx0cy5lcnJvcnMucHVzaCh7IHBob3RvSWQ6IHBob3RvLmlkLCBlcnJvcjogZXJyLm1lc3NhZ2UgfSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRwYWdlKytcblx0XHRcdGlmIChwaG90b3MubGVuZ3RoIDwgMTAwKSB7XG5cdFx0XHRcdGhhc01vcmUgPSBmYWxzZVxuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0cmVzdWx0cy5lcnJvcnMucHVzaCh7IHBhZ2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KVxuXHRcdFx0aGFzTW9yZSA9IGZhbHNlXG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlc3VsdHNcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN5bmNBbGxQaG90b3MoKSB7XG5cdGNvbnN0IHJlc3VsdHMgPSB7IHRvdGFsOiB7IGNyZWF0ZWQ6IDAsIHVwZGF0ZWQ6IDAsIGVycm9yczogW10gfSwgYnlQcm9qZWN0OiB7fSB9XG5cblx0Zm9yIChjb25zdCBba2V5LCBwcm9qZWN0XSBvZiBPYmplY3QuZW50cmllcyhwcm9qZWN0cykpIHtcblx0XHRpZiAoIXByb2plY3QuaWQpIHtcblx0XHRcdHJlc3VsdHMuYnlQcm9qZWN0W2tleV0gPSB7IHNraXBwZWQ6IHRydWUsIHJlYXNvbjogJ05vIHByb2plY3QgSUQgY29uZmlndXJlZCcgfVxuXHRcdFx0Y29udGludWVcblx0XHR9XG5cblx0XHRjb25zdCBwcm9qZWN0UmVzdWx0cyA9IGF3YWl0IHN5bmNQaG90b3NGcm9tUHJvamVjdChwcm9qZWN0LmlkKVxuXHRcdHJlc3VsdHMuYnlQcm9qZWN0W2tleV0gPSBwcm9qZWN0UmVzdWx0c1xuXHRcdHJlc3VsdHMudG90YWwuY3JlYXRlZCArPSBwcm9qZWN0UmVzdWx0cy5jcmVhdGVkXG5cdFx0cmVzdWx0cy50b3RhbC51cGRhdGVkICs9IHByb2plY3RSZXN1bHRzLnVwZGF0ZWRcblx0XHRyZXN1bHRzLnRvdGFsLmVycm9ycy5wdXNoKC4uLnByb2plY3RSZXN1bHRzLmVycm9ycylcblx0fVxuXG5cdHJldHVybiByZXN1bHRzXG59XG4iLCJ2YXIgbWFwID0ge1xuXHRcIi4vc3Vic2NyaWJlLmpzXCI6IFwiLi4vLi4vbWFuZ28vaG9va3Mvc3Vic2NyaWJlLmpzXCIsXG5cdFwiLi90ZXN0LmpzXCI6IFwiLi4vLi4vbWFuZ28vaG9va3MvdGVzdC5qc1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuLi8uLi9tYW5nby9ob29rcyBzeW5jIHJlY3Vyc2l2ZSAuKlxcXFwuanMkXCI7IiwiY29uc3Qgc3Vic2NyaWJlID0gKHsgaW8sIGNvbGxlY3Rpb24sIGRvY3VtZW50LCByZXF1ZXN0LCBpbmRpdmlkdWFsLCBvcmlnaW5hbERvY3VtZW50IH0pID0+IHtcbiAgICBsZXQgbWV0aG9kID0gcmVxdWVzdC5tZXRob2RcbiAgICBpZiAoY29sbGVjdGlvbi5zdWJzY3JpYmUgJiYgbWV0aG9kICE9ICdyZWFkJyAmJiBpbmRpdmlkdWFsKSB7XG5cbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gaW8ub2YoY29sbGVjdGlvbi5uYW1lKTtcblxuICAgICAgICAvLyBTZW5kIHRvIHRoZSBpZCBhbmQgdGhlIGF1dGhvciBpZFxuICAgICAgICBsZXQgcGF5bG9hZCA9IG1ldGhvZCA9PSAnZGVsZXRlJyA/IG9yaWdpbmFsRG9jdW1lbnQgOiBkb2N1bWVudFxuICAgICAgICBzdWJzY3JpcHRpb24udG8ocmVxdWVzdC5tZW1iZXI/LmlkKS5lbWl0KGAke2NvbGxlY3Rpb24ubmFtZX06JHttZXRob2R9ZGAsIHBheWxvYWQpO1xuICAgICAgICBzdWJzY3JpcHRpb24udG8oKGRvY3VtZW50Py5pZHx8b3JpZ2luYWxEb2N1bWVudD8uaWQpKS5lbWl0KGAke2NvbGxlY3Rpb24ubmFtZX06JHttZXRob2R9ZGAsIHBheWxvYWQpO1xuXG4gICAgICAgIC8vIFNlbmQgdG8gZWFjaCBjdXN0b20gcm9vbVxuICAgICAgICBmb3IgKGxldCByb29tIG9mIChjb2xsZWN0aW9uLnN1YnNjcmliZT8ucm9vbXN8fFtdKSkge1xuICAgICAgICAgICAgbGV0IGtleXMgPSByb29tLnNwbGl0KCcuJylcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBkb2N1bWVudFxuICAgICAgICAgICAgZm9yIChsZXQga2V5IG9mIGtleXMpIHRhcmdldCA9IHRhcmdldFtrZXldXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkb2N1bWVudCwga2V5cylcbiAgICAgICAgICAgIGxldCByb29tSWQgPSB0YXJnZXRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdHRlbXB0aW5nIHRvIGVtaXQgdG8nLCBjb2xsZWN0aW9uLm5hbWUsIHJvb21JZCwgYCR7Y29sbGVjdGlvbi5uYW1lfToke21ldGhvZH1kYClcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbi50byhyb29tSWQpLmVtaXQoYCR7Y29sbGVjdGlvbi5uYW1lfToke21ldGhvZH1kYCwgcGF5bG9hZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IHN1YnNjcmliZSB9XG4iLCJjb25zdCBleGFtcGxlSG9vayA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhgSGV5LCBJJ20gdGhlIHJlc3VsdCBvZiBhbiBleGFtcGxlIGhvb2sgcnVubmluZyEgKFlvdSBjYW4gZmluZCBtZSBhdCAke2ltcG9ydC5tZXRhLnVybH0pYClcbn1cblxuZXhwb3J0IHsgZXhhbXBsZUhvb2sgfVxuIiwiZnVuY3Rpb24gd2VicGFja0VtcHR5Q29udGV4dChyZXEpIHtcblx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdHRocm93IGU7XG59XG53ZWJwYWNrRW1wdHlDb250ZXh0LmtleXMgPSAoKSA9PiAoW10pO1xud2VicGFja0VtcHR5Q29udGV4dC5yZXNvbHZlID0gd2VicGFja0VtcHR5Q29udGV4dDtcbndlYnBhY2tFbXB0eUNvbnRleHQuaWQgPSBcIi4uLy4uL21hbmdvL3BsdWdpbnMgc3luYyByZWN1cnNpdmUgLipcXFxcLmpzJFwiO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrRW1wdHlDb250ZXh0OyIsImltcG9ydCBjcmVhdGVDb2xsZWN0aW9uIGZyb20gXCIuL2NyZWF0ZUNvbGxlY3Rpb25cIjtcblxuZnVuY3Rpb24gcmVxdWlyZUFsbChyKSB7XG4gICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgci5rZXlzKCkubWFwKGZ1bmN0aW9uIChtcGF0aCwgLi4uYXJncykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcihtcGF0aCwgLi4uYXJncyk7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gbXBhdGhcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvKD86XlsuXFwvXSpcXC98XFwuW14uXSskKS9nLCBcIlwiKSAvLyBUcmltXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLy9nLCBcIl9cIik7IC8vIFJlbGFjZSAnLydzIGJ5ICdfJ3NcbiAgICAgICAgICAgIHJldHVybiBbbmFtZSwgcmVzdWx0XTtcbiAgICAgICAgfSlcbiAgICApO1xufVxuXG5sZXQgZGVmYXVsdENvbGxlY3Rpb25zID0gcmVxdWlyZUFsbChcbiAgICByZXF1aXJlLmNvbnRleHQoXG4gICAgICAgIC8vIEFueSBraW5kIG9mIHZhcmlhYmxlcyBjYW5ub3QgYmUgdXNlZCBoZXJlXG4gICAgICAgIFwiLi9kZWZhdWx0Q29sbGVjdGlvbnMvXCIsIC8vIChXZWJwYWNrIGJhc2VkKSBwYXRoXG4gICAgICAgIHRydWUsIC8vIFVzZSBzdWJkaXJlY3Rvcmllc1xuICAgICAgICAvXig/IS4qZGVmYXVsdENvbGxlY3Rpb25zKS4qXFwuanMkLyAvLyBGaWxlIG5hbWUgcGF0dGVyblxuICAgIClcbik7XG5cbmxldCB1c2VyQ29sbGVjdGlvbnMgPSByZXF1aXJlQWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgLy8gQW55IGtpbmQgb2YgdmFyaWFibGVzIGNhbm5vdCBiZSB1c2VkIGhlcmVcbiAgICAgICAgXCJAbWFuZ28vY29sbGVjdGlvbnMvXCIsIC8vIChXZWJwYWNrIGJhc2VkKSBwYXRoXG4gICAgICAgIHRydWUsIC8vIFVzZSBzdWJkaXJlY3Rvcmllc1xuICAgICAgICAvLipcXC5qcyQvIC8vIEZpbGUgbmFtZSBwYXR0ZXJuXG4gICAgKVxuKTtcblxuLy8gY29uc3QgYWxsQ29sbGVjdGlvbnMgPSBbLi4uZGVmYXVsdENvbGxlY3Rpb25zLCAuLi51c2VyQ29sbGVjdGlvbnNdXG4vLyBjb25zdCBhbGxDb2xsZWN0aW9ucyA9IHVzZXJDb2xsZWN0aW9uc1xuXG5mdW5jdGlvbiBwcm9jZXNzQ29sbGVjdGlvbnMoYWxsQ29sbGVjdGlvbnMpIHtcbiAgICBsZXQgY29sbGVjdGlvbnMgPSBPYmplY3Qua2V5cyhhbGxDb2xsZWN0aW9ucykucmVkdWNlKChhLCBjb2xsZWN0aW9uTmFtZSkgPT4ge1xuICAgICAgICBpZiAoY29sbGVjdGlvbk5hbWUgIT0gXCJpbmRleFwiKSB7XG4gICAgICAgICAgICBsZXQgbW9kdWxlcyA9IGFsbENvbGxlY3Rpb25zW2NvbGxlY3Rpb25OYW1lXTtcbiAgICAgICAgICAgIGxldCBjb2xsZWN0aW9uID0gbW9kdWxlcy5kZWZhdWx0O1xuXG4gICAgICAgICAgICBjb2xsZWN0aW9uLm5hbWUgPSBjb2xsZWN0aW9uTmFtZTtcblxuICAgICAgICAgICAgY29sbGVjdGlvbiA9IGNyZWF0ZUNvbGxlY3Rpb24oY29sbGVjdGlvbik7XG5cbiAgICAgICAgICAgIGEucHVzaChjb2xsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9LCBbXSk7XG5cbiAgICByZXR1cm4gY29sbGVjdGlvbnM7XG59XG5cbi8vIGNvbnNvbGUubG9nKCdkZWZhdWx0Q29sbGVjdGlvbnMnLCBkZWZhdWx0Q29sbGVjdGlvbnMpXG5cbmRlZmF1bHRDb2xsZWN0aW9ucyA9IHByb2Nlc3NDb2xsZWN0aW9ucyhkZWZhdWx0Q29sbGVjdGlvbnMpO1xudXNlckNvbGxlY3Rpb25zID0gcHJvY2Vzc0NvbGxlY3Rpb25zKHVzZXJDb2xsZWN0aW9ucyk7XG5sZXQgYWxsQ29sbGVjdGlvbnMgPSBbLi4uZGVmYXVsdENvbGxlY3Rpb25zLCAuLi51c2VyQ29sbGVjdGlvbnNdO1xuXG5leHBvcnQgZGVmYXVsdCBhbGxDb2xsZWN0aW9ucztcbiIsImltcG9ydCBjcmVhdGVGaWVsZCBmcm9tICcuLi9maWVsZHMvY3JlYXRlRmllbGQnXG5pbXBvcnQgZ2xvYmFsRmllbGRzIGZyb20gJ0BtYW5nby9jb25maWcvZ2xvYmFsRmllbGRzJ1xuaW1wb3J0IHsgZGIgfSBmcm9tICcuLi9saWJyYXJpZXMvbW9uZ28nXG5cbi8qXG4gICAg8J+RhvCfj7zwn5GG8J+PvPCfkYbwn4+8IEFsbCB0aGlzIGlzIHN0b3JlZCBpbiBhIHNlcGFyYXRlIGZpbGUgbm93IGFuZCBpbXBvcnRlZCDwn5GG8J+PvPCfkYbwn4+88J+RhvCfj7xcbiovXG5cbi8vIGltcG9ydCBmaWVsZHMgZnJvbSAnLi4vZmllbGRzJ1xuLy8gbGV0IHsgUGxhaW5UZXh0LCBTZWxlY3QsIFRpbWVzdGFtcCwgUmVsYXRpb25zaGlwIH0gPSBmaWVsZHNcblxuLy8gY29uc3QgZ2xvYmFsRmllbGRzID0ge1xuXG4vLyAgICAgdGl0bGU6IFBsYWluVGV4dCh7IHJlcXVpcmVkOiB0cnVlIH0pLFxuLy8gICAgIGF1dGhvcklkOiBTdHJpbmcsLy97IGNvbXB1dGVkOiAoZG9jLCByZXEpID0+IGRvYy5hdXRob3JJZCB8fCByZXE/Lm1lbWJlcj8uaWQgfHwgIG51bGwgfSxcbi8vICAgICBhdXRob3I6IFJlbGF0aW9uc2hpcCh7IGNvbGxlY3Rpb246ICdtZW1iZXInLCBzaW5nbGU6IHRydWUgfSksXG4vLyAgICAgZWRpdElkOiBTdHJpbmcsLy97IGNvbXB1dGVkOiAoZG9jLCByZXEpID0+IHJlcT8ubWVtYmVyPy5pZCB8fCBudWxsIH0sXG4vLyAgICAgY3JlYXRlZDogVGltZXN0YW1wKCksLy97IGNvbXB1dGVkOiBkb2MgPT4gZG9jLmNyZWF0ZWQgfHwgbmV3IERhdGUsIHR5cGU6ICdGbG9hdCcgfSxcbi8vICAgICB1cGRhdGVkOiBUaW1lc3RhbXAoKSwvL3sgY29tcHV0ZWQ6IGRvYyA9PiBkb2MudXBkYXRlZCA/IG5ldyBEYXRlIDogZG9jLmNyZWF0ZWQsIHR5cGU6ICdGbG9hdCcgfSxcbi8vICAgICBzbHVnOiB7IGNvbXB1dGVkOiBkb2MgPT4gZG9jPy50aXRsZT8udG9Mb3dlckNhc2UoKT8udHJpbSgpPy5yZXBsYWNlKC9bXmEtekEtWjAtOVxcc10vZywgJycpPy5yZXBsYWNlKC9cXHMvZywgJy0nKSB9LFxuLy8gICAgIHN0YXJ0RGF0ZTogVGltZXN0YW1wKCksXG4vLyAgICAgZW5kRGF0ZTogVGltZXN0YW1wKCksXG5cbi8vICAgICAvLyBDRkxcbi8vICAgICBmYWNlYm9va0lkOiBTdHJpbmcsXG4vLyAgICAgcGFybGVySWQ6IFN0cmluZyxcbi8vICAgICBhbGdvbGlhSWQ6IFN0cmluZyxcbi8vICAgICBjaGFubmVsTmFtZTogU3RyaW5nLFxuLy8gICAgIGNoYW5uZWxJZDogJ0ludCcsXG4vLyAgICAgc3RhdHVzOiB7IHRyYW5zZm9ybUlucHV0OiBpbnB1dCA9PiBpbnB1dC50b0xvd2VyQ2FzZSgpIH0sXG4vLyAgICAgZW50cnlJZDogJ0ludCcsXG4vLyAgICAgdXJsVGl0bGU6IFN0cmluZyxcblxuLy8gfVxuXG5PYmplY3Qua2V5cyhnbG9iYWxGaWVsZHMpLmZvckVhY2goKGspID0+IHtcbiAgICBsZXQgZmllbGQgPSBnbG9iYWxGaWVsZHNba11cbiAgICBsZXQgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoZmllbGQpXG4gICAgaWYgKGlzQXJyYXkpIGZpZWxkID0gZmllbGRbMF1cbiAgICBsZXQgbmV3RmllbGRcblxuICAgIGlmICh0eXBlb2YgZmllbGQgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgbmV3RmllbGQgPSB7IC4uLmZpZWxkLCBnbG9iYWw6IHRydWUgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0ZpZWxkID0ge1xuICAgICAgICAgICAgdHlwZTogZmllbGQsXG4gICAgICAgICAgICBnbG9iYWw6IHRydWUsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnbG9iYWxGaWVsZHNba10gPSBpc0FycmF5ID8gW25ld0ZpZWxkXSA6IG5ld0ZpZWxkXG59KVxuXG5hc3luYyBmdW5jdGlvbiBlbnN1cmVDb2xsZWN0aW9uU2VhcmNoSW5kZXhlcyhjb2xsZWN0aW9uKSB7XG4gICAgbGV0IHNlYXJjaEluZGV4ID0gY29sbGVjdGlvbi5fZmllbGRzQXJyYXlcbiAgICAgICAgLy8gLmZsYXRNYXAoKGYsIGluZGV4LCBwYXJlbnQpID0+IGY/Ll9maWVsZHNBcnJheSB8fCBmKVxuICAgICAgICAuZmlsdGVyKChmKSA9PiBmLnNlYXJjaD8uZW5hYmxlZClcbiAgICAgICAgLnJlZHVjZSgoc2VhcmNoLCBmaWVsZCkgPT4ge1xuICAgICAgICAgICAgc2VhcmNoW2ZpZWxkLl9uYW1lXSA9ICd0ZXh0J1xuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFxuICAgICAgICB9LCB7fSlcblxuICAgIGxldCBzZWFyY2hXZWlnaHRzID0gY29sbGVjdGlvbi5fZmllbGRzQXJyYXlcbiAgICAgICAgLmZpbHRlcigoZikgPT4gZi5zZWFyY2g/LmVuYWJsZWQpXG4gICAgICAgIC5yZWR1Y2UoKHdlaWdodHMsIGZpZWxkKSA9PiB7XG4gICAgICAgICAgICB3ZWlnaHRzW2ZpZWxkLl9uYW1lXSA9IGZpZWxkLnNlYXJjaD8ud2VpZ2h0IHx8IDFcbiAgICAgICAgICAgIHJldHVybiB3ZWlnaHRzXG4gICAgICAgIH0sIHt9KVxuXG4gICAgaWYgKE9iamVjdC5rZXlzKHNlYXJjaEluZGV4KS5sZW5ndGgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgZmFpbHMsIGl0J3MgcHJvYmFibHkgYmVjYXVzZSB0aGUgaW5kZXggaGFzIGFscmVhZHkgYmVlbiBjcmVhdGVkLCBidXQgbm93IGl0IG5lZWRzIHRvIGJlIHVwZGF0ZWQuLi5cbiAgICAgICAgICAgIGF3YWl0IGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbi5fbmFtZSkuY3JlYXRlSW5kZXgoc2VhcmNoSW5kZXgsIHtcbiAgICAgICAgICAgICAgICB3ZWlnaHRzOiBzZWFyY2hXZWlnaHRzLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdtYW5nb1NlYXJjaEluZGV4JyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIFRyeSB0byBkZWxldGUgdGhlIG9sZCBpbmRleFxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb24uX25hbWUpLmRyb3BJbmRleCgnbWFuZ29TZWFyY2hJbmRleCcpXG4gICAgICAgICAgICB9IGNhdGNoIHsgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb24uX25hbWUpLmRyb3BJbmRleCgndGl0bGVfdGV4dF9ib2R5X3RleHQnKVxuICAgICAgICAgICAgfSBjYXRjaCB7IH1cbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBpbmRleFxuICAgICAgICAgICAgYXdhaXQgZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uLl9uYW1lKS5jcmVhdGVJbmRleChzZWFyY2hJbmRleCwge1xuICAgICAgICAgICAgICAgIHdlaWdodHM6IHNlYXJjaFdlaWdodHMsXG4gICAgICAgICAgICAgICAgbmFtZTogJ21hbmdvU2VhcmNoSW5kZXgnLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29sbGVjdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgaWYgKCFjb2xsZWN0aW9uLnNpbmd1bGFyKVxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBgXFx1MDAxYlsxOzMzbVlvdSBzaG91bGQgcHJvdmlkZSBhIHNpbmd1bGFyIG5hbWUgZm9yIHlvdXIgJHtjb2xsZWN0aW9uLl90aXRsZU5hbWV9IGNvbGxlY3Rpb24gb3IgaXQgd2lsbCBkZWZhdWx0IHRvIHNpbmdsZSR7Y29sbGVjdGlvbi5fdGl0bGVOYW1lfS5cXHUwMDFiWzE7MzdtYFxuICAgICAgICApXG5cbiAgICBjb2xsZWN0aW9uLmZpZWxkcyA9IHsgLi4uZ2xvYmFsRmllbGRzLCAuLi5jb2xsZWN0aW9uLmZpZWxkcyB9XG5cbiAgICBjb2xsZWN0aW9uLl9uYW1lID0gY29sbGVjdGlvbi5uYW1lXG4gICAgY29sbGVjdGlvbi5fdGl0bGVOYW1lID1cbiAgICAgICAgY29sbGVjdGlvbi5fbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGNvbGxlY3Rpb24uX25hbWUuc2xpY2UoMSlcblxuICAgIC8vIFByb2Nlc3MgYW55IHVucHJvY2Vzc2VkIGZpZWxkc1xuICAgIGZvciAoY29uc3QgZmllbGROYW1lIG9mIE9iamVjdC5rZXlzKGNvbGxlY3Rpb24uZmllbGRzKSkge1xuICAgICAgICBsZXQgZmllbGQgPSBjb2xsZWN0aW9uLmZpZWxkc1tmaWVsZE5hbWVdXG4gICAgICAgIC8vIFByb2Nlc3MgYW55IHVucHJvY2Vzc2VkIGZpZWxkc1xuICAgICAgICBpZiAoIWZpZWxkLl9jcmVhdGVkKSB7XG4gICAgICAgICAgICBmaWVsZCA9IGNyZWF0ZUZpZWxkKGZpZWxkKSh7IF9uYW1lOiBmaWVsZE5hbWUgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWZpZWxkLl9uYW1lKSB7XG4gICAgICAgICAgICBmaWVsZC5fbmFtZSA9IGZpZWxkTmFtZVxuICAgICAgICB9XG4gICAgICAgIGZpZWxkLl9jb2xsZWN0aW9uID0gY29sbGVjdGlvbi5fbmFtZVxuICAgICAgICBmaWVsZC5fY29sbGVjdGlvblRpdGxlID0gY29sbGVjdGlvbi5fdGl0bGVOYW1lXG4gICAgICAgIGNvbGxlY3Rpb24uZmllbGRzW2ZpZWxkTmFtZV0gPSBmaWVsZC5wcm9jZXNzKClcbiAgICAgICAgLy8gaWYgKHRydWUgfHwgZmllbGQuX25hbWUgPT0gJ3RodW1ibmFpbCcpIGNvbnNvbGUubG9nKGZpZWxkLl9uYW1lKVxuICAgIH1cblxuICAgIGNvbGxlY3Rpb24uX3Npbmd1bGFyID0gY29sbGVjdGlvbi5zaW5ndWxhciB8fCBgc2luZ2xlJHtjb2xsZWN0aW9uLl90aXRsZU5hbWV9YFxuICAgIGNvbGxlY3Rpb24uX3RpdGxlU2luZ3VsYXIgPVxuICAgICAgICBjb2xsZWN0aW9uLl9zaW5ndWxhci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGNvbGxlY3Rpb24uX3Npbmd1bGFyLnNsaWNlKDEpXG4gICAgY29sbGVjdGlvbi5fbXV0YXRpb24gPSBgY3JlYXRlJHtjb2xsZWN0aW9uLl90aXRsZU5hbWV9YFxuICAgIGNvbGxlY3Rpb24uX211dGF0aW9uVHlwZVBsdXJhbCA9IGBDcmVhdGUke2NvbGxlY3Rpb24uX3RpdGxlTmFtZX1gXG4gICAgY29sbGVjdGlvbi5fbXV0YXRpb25UeXBlU2luZ3VsYXIgPSBgQ3JlYXRlJHtjb2xsZWN0aW9uLl90aXRsZVNpbmd1bGFyfWBcbiAgICBjb2xsZWN0aW9uLl9maWVsZE5hbWVzID0gT2JqZWN0LmtleXMoY29sbGVjdGlvbi5maWVsZHMpXG4gICAgY29sbGVjdGlvbi5fY29tcGxleEZpZWxkID0gdHJ1ZVxuICAgIGNvbGxlY3Rpb24uX2ZpZWxkTmFtZXMuZm9yRWFjaChcbiAgICAgICAgKGZpZWxkTmFtZSkgPT4gKGNvbGxlY3Rpb24uZmllbGRzW2ZpZWxkTmFtZV0uX25hbWUgPSBmaWVsZE5hbWUpXG4gICAgKVxuICAgIGNvbGxlY3Rpb24uX2ZpZWxkc0FycmF5ID0gY29sbGVjdGlvbi5fZmllbGROYW1lcy5tYXAoKGZpZWxkTmFtZSkgPT4gKHtcbiAgICAgICAgX25hbWU6IGZpZWxkTmFtZSxcbiAgICAgICAgLi4uY29sbGVjdGlvbi5maWVsZHNbZmllbGROYW1lXSxcbiAgICB9KSlcblxuICAgIC8vIGNvbnNvbGUubG9nKCdfZmllbGRzQXJyYXknLCBjb2xsZWN0aW9uLl9maWVsZHNBcnJheSlcbiAgICAvLyBsZXQgdHlwZVNjaGVtYSA9IGNvbGxlY3Rpb24uX2ZpZWxkc0FycmF5Lm1hcChmID0+IGAgICAgJHtmLl9uYW1lfTogJHtmLl9ncWxUeXBlfSAke2YucHJvdGVjdGVkID8gJ0BmaWVsZFByb3RlY3RlZCcgOiAnJ31gKS5qb2luKCdcXG4nKVxuXG4gICAgbGV0IHR5cGVTY2hlbWEgPSBjb2xsZWN0aW9uLl9maWVsZHNBcnJheVxuICAgICAgICAubWFwKChmKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGYuX25hbWVcbiAgICAgICAgICAgIGxldCBhcmdzID0gJydcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGYuYXJyYXkgPyBgWyR7Zi5fZ3FsVHlwZX1dYCA6IGYuX2dxbFR5cGVcblxuICAgICAgICAgICAgLy8gVGhpcyBwaWVjZSBhbGxvd3MgZm9yIHNlYXJjaGluZyBvbiByZWxhdGlvbnNoaXAgZmllbGRzXG4gICAgICAgICAgICBpZiAoZi5uYW1lID09ICdyZWxhdGlvbnNoaXAnKSB7XG4gICAgICAgICAgICAgICAgYXJncyA9IGAoc2VhcmNoOiBTZWFyY2gke2YudGl0bGVDb2xsZWN0aW9ufUlucHV0LCBsaW1pdDogSW50LCBwYWdlOiBJbnQsIHNvcnQ6IFNvcnQke2YudGl0bGVDb2xsZWN0aW9ufUlucHV0KWBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGAke25hbWV9JHthcmdzfTogJHtyZXNwb25zZX1gXG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG4nKVxuXG5cbiAgICBsZXQgY3JlYXRlU2NoZW1hID0gY29sbGVjdGlvbi5fZmllbGRzQXJyYXlcbiAgICAgICAgLmZpbHRlcigoZikgPT4gIWYuY29tcHV0ZWQgJiYgIWYuX3NpbGVudENoaWxkcmVuICYmIGYuX2dxbElucHV0VHlwZSlcbiAgICAgICAgLm1hcChcbiAgICAgICAgICAgIChmKSA9PlxuICAgICAgICAgICAgICAgIGAgICAgJHtmLl9uYW1lfTogJHtmLmFycmF5ID8gYFske2YuX2dxbElucHV0VHlwZX1dYCA6IGYuX2dxbElucHV0VHlwZX0ke2YucmVxdWlyZWQgPyAnIScgOiAnJ1xuICAgICAgICAgICAgICAgIH1gXG4gICAgICAgIClcbiAgICAgICAgLmpvaW4oJ1xcbicpXG5cbiAgICAvLyBsZXQgcmVsYXRpb25zaGlwUHVzaCA9IGNvbGxlY3Rpb24uX2ZpZWxkc0FycmF5XG4gICAgLy8gICAgIC5maWx0ZXIoKGYpID0+IGYubmFtZSA9PSAncmVsYXRpb25zaGlwJylcbiAgICAvLyAgICAgLm1hcChcbiAgICAvLyAgICAgICAgIChmKSA9PlxuICAgIC8vICAgICAgICAgICAgIGAgICAgcHVzaCR7Zi5fdGl0bGVOYW1lfTogJHtmLmFycmF5ID8gYFske2YuX2dxbElucHV0VHlwZX1dYCA6IGYuX2dxbElucHV0VHlwZX0ke2YucmVxdWlyZWQgPyAnIScgOiAnJ1xuICAgIC8vICAgICAgICAgICAgIH1gXG4gICAgLy8gICAgIClcbiAgICAvLyAgICAgLmpvaW4oJ1xcbicpXG5cbiAgICAvLyBjcmVhdGVTY2hlbWEgKz0gcmVsYXRpb25zaGlwUHVzaFxuXG4gICAgbGV0IHNlYXJjaFNjaGVtYSA9IGNvbGxlY3Rpb24uX2ZpZWxkc0FycmF5XG4gICAgICAgIC5maWx0ZXIoKGYpID0+IGYuX2dxbFNlYXJjaFR5cGUgfHwgZi5fZ3FsSW5wdXRUeXBlKVxuICAgICAgICAubWFwKChmKSA9PiB7XG4gICAgICAgICAgICBsZXQgc2VhcmNoVHlwZSA9IGYuX2dxbFNlYXJjaFR5cGUgPyBmLl9ncWxTZWFyY2hUeXBlIDogZi5fZ3FsSW5wdXRUeXBlXG4gICAgICAgICAgICBzZWFyY2hUeXBlID0gZi5hcnJheSA/IGBbJHtzZWFyY2hUeXBlfV1gIDogc2VhcmNoVHlwZVxuICAgICAgICAgICAgcmV0dXJuIGAgICAgJHtmLl9uYW1lfTogJHtzZWFyY2hUeXBlfWBcbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oJ1xcbicpXG4gICAgbGV0IHVwZGF0ZVNjaGVtYSA9IGAgICAgaWQ6IElEXFxuJHtjcmVhdGVTY2hlbWEucmVwbGFjZSgvXFwhL2csICcnKX1gXG4gICAgbGV0IHF1ZXJ5U2NoZW1hID0gYCAgICBpZDogSURcXG4ke3NlYXJjaFNjaGVtYX1gXG4gICAgbGV0IHNvcnRTY2hlbWEgPSBjb2xsZWN0aW9uLl9maWVsZHNBcnJheVxuICAgICAgICAubWFwKChmKSA9PiBgICAgICR7Zi5fbmFtZX06IEludGApXG4gICAgICAgIC5qb2luKCdcXG4nKVxuXG5cbiAgICAvKlxuICAgIENoYW5nZWQgXCJfZ3FsSW5wdXRUeXBlXCIgdG8gXCJfZ3FsVHlwZVwiIGJlbG93IGJlY2F1c2Ugd2UncmUgc2VhcmNoaW5nXG4gICAgYmFzZWQgb24gdGhlIGNvbnRlbnQgaW4gdGhlIGRiLCBub3QgdGhlIGNvbnRlbnQgcHJvdmlkZWQgb24gbXV0YXRpb25cbiAgICAqL1xuICAgIGxldCBjb21wYXJlU2NoZW1hID0gY29sbGVjdGlvbi5fZmllbGRzQXJyYXlcbiAgICAgICAgLmZpbHRlcigoZikgPT5cbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnSW50JyxcbiAgICAgICAgICAgICAgICAnU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAnW0ludF0nLFxuICAgICAgICAgICAgICAgICdbU3RyaW5nXScsXG4gICAgICAgICAgICAgICAgJ0Zsb2F0JyxcbiAgICAgICAgICAgICAgICAnW0Zsb2F0XScsXG4gICAgICAgICAgICAgICAgJ0RhdGVUaW1lJyxcbiAgICAgICAgICAgICAgICAnW0RhdGVUaW1lXScsXG4gICAgICAgICAgICAgICAgJ0Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgICdbQm9vbGVhbl0nLFxuICAgICAgICAgICAgXS5pbmNsdWRlcyhmLl9ncWxUeXBlKVxuICAgICAgICApXG4gICAgICAgIC5tYXAoXG4gICAgICAgICAgICAoZikgPT4gYCAgICBjb21wYXJlJHtmLl9uYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZi5fbmFtZS5zbGljZSgxKX06IGNvbXBhcmUke2YuX2dxbFR5cGUucmVwbGFjZSgnWycsICcnKS5yZXBsYWNlKCddJywgJycpfWBcbiAgICAgICAgKVxuICAgICAgICAuam9pbignXFxuJylcblxuICAgIGNvbXBhcmVTY2hlbWEgKz0gY29sbGVjdGlvbi5fZmllbGRzQXJyYXlcbiAgICAgICAgLmZpbHRlcigoZikgPT4gZi5uYW1lID09ICdyZWxhdGlvbnNoaXAnKVxuICAgICAgICAubWFwKFxuICAgICAgICAgICAgKGYpID0+XG4gICAgICAgICAgICAgICAgYCAgICBzb21lJHtmLl9uYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZi5fbmFtZS5zbGljZSgxKX06IFNlYXJjaCR7Zi50aXRsZUNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICB9SW5wdXRcXG4gICBhbGwke2YuX25hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBmLl9uYW1lLnNsaWNlKDEpXG4gICAgICAgICAgICAgICAgfTogU2VhcmNoJHtmLnRpdGxlQ29sbGVjdGlvbn1JbnB1dGBcbiAgICAgICAgKVxuXG4gICAgY29tcGFyZVNjaGVtYSArPSBjb2xsZWN0aW9uLl9maWVsZHNBcnJheVxuICAgICAgICAuZmxhdE1hcCgoZikgPT4gZj8uX2ZpZWxkc0FycmF5IHx8IGYpXG4gICAgICAgIC5zb21lKChmKSA9PiBmLnNlYXJjaD8uZW5hYmxlZClcbiAgICAgICAgPyBgICAgd29yZFNlYXJjaDogU3RyaW5nXFxuYFxuICAgICAgICA6ICcnXG5cbiAgICBjb21wYXJlU2NoZW1hICs9IGAgIGNvbXBhcmVJZDogY29tcGFyZVN0cmluZ1xcbmBcbiAgICB0eXBlU2NoZW1hICs9IGAgIGNvbGxlY3Rpb246IFN0cmluZ1xcbmBcblxuICAgIHR5cGVTY2hlbWEgPSBgICAgIGlkOiBJRFxcbiR7dHlwZVNjaGVtYX1gXG5cbiAgICBjb2xsZWN0aW9uLl9jcmVhdGVNdXRhdGlvblBsdXJhbCA9IGBjcmVhdGUke2NvbGxlY3Rpb24uX3RpdGxlTmFtZX1gXG4gICAgY29sbGVjdGlvbi5fdXBkYXRlTXV0YXRpb25QbHVyYWwgPSBgdXBkYXRlJHtjb2xsZWN0aW9uLl90aXRsZU5hbWV9YFxuICAgIGNvbGxlY3Rpb24uX2RlbGV0ZU11dGF0aW9uUGx1cmFsID0gYGRlbGV0ZSR7Y29sbGVjdGlvbi5fdGl0bGVOYW1lfWBcblxuICAgIGNvbGxlY3Rpb24uX2NyZWF0ZU11dGF0aW9uU2luZ3VsYXIgPSBgY3JlYXRlJHtjb2xsZWN0aW9uLl90aXRsZVNpbmd1bGFyfWBcbiAgICBjb2xsZWN0aW9uLl91cGRhdGVNdXRhdGlvblNpbmd1bGFyID0gYHVwZGF0ZSR7Y29sbGVjdGlvbi5fdGl0bGVTaW5ndWxhcn1gXG4gICAgY29sbGVjdGlvbi5fZGVsZXRlTXV0YXRpb25TaW5ndWxhciA9IGBkZWxldGUke2NvbGxlY3Rpb24uX3RpdGxlU2luZ3VsYXJ9YFxuXG4gICAgY29sbGVjdGlvbi5fY3JlYXRlU2NoZW1hID0gYGlucHV0IENyZWF0ZSR7Y29sbGVjdGlvbi5fdGl0bGVTaW5ndWxhcn1JbnB1dCB7XFxuJHtjcmVhdGVTY2hlbWF9XFxuICB9XFxuXFxuYFxuICAgIGNvbGxlY3Rpb24uX3VwZGF0ZVNjaGVtYSA9IGBpbnB1dCBVcGRhdGUke2NvbGxlY3Rpb24uX3RpdGxlU2luZ3VsYXJ9SW5wdXQge1xcbiR7dXBkYXRlU2NoZW1hfVxcbiAgcHVzaDogVXBkYXRlJHtjb2xsZWN0aW9uLl90aXRsZVNpbmd1bGFyfUlucHV0fVxcblxcbmBcbiAgICBjb2xsZWN0aW9uLl9xdWVyeVNjaGVtYSA9IGBpbnB1dCBTZWFyY2gke2NvbGxlY3Rpb24uX3RpdGxlU2luZ3VsYXJ9SW5wdXQge1xcbiR7cXVlcnlTY2hlbWF9XFxuJHtjb21wYXJlU2NoZW1hfVxcbiAgYW5kOiBbU2VhcmNoJHtjb2xsZWN0aW9uLl90aXRsZVNpbmd1bGFyfUlucHV0XVxcbiAgb3I6IFtTZWFyY2gke2NvbGxlY3Rpb24uX3RpdGxlU2luZ3VsYXJ9SW5wdXRdXFxuICAgd2hlcmU6IFN0cmluZyBcXG59XFxuXFxuYFxuICAgIGNvbGxlY3Rpb24uX3NvcnRTY2hlbWEgPSBgaW5wdXQgU29ydCR7Y29sbGVjdGlvbi5fdGl0bGVTaW5ndWxhcn1JbnB1dCB7XFxuJHtzb3J0U2NoZW1hfSBcXG59XFxuXFxuYFxuICAgIC8vIGNvbGxlY3Rpb24uX3R5cGVTY2hlbWEgPSBgdHlwZSAke2NvbGxlY3Rpb24uX3RpdGxlU2luZ3VsYXJ9ICR7Y29sbGVjdGlvbi5wcm90ZWN0ZWQgPyAnQGNvbGxlY3Rpb25Qcm90ZWN0ZWQnIDogJyd9IHtcXG4ke3R5cGVTY2hlbWF9IFxcbn1cXG5cXG5gXG4gICAgY29sbGVjdGlvbi5fdHlwZVNjaGVtYSA9IGB0eXBlICR7Y29sbGVjdGlvbi5fdGl0bGVTaW5ndWxhcn0ge1xcbiR7dHlwZVNjaGVtYX0gXFxufVxcblxcbmBcbiAgICAvLyBjb2xsZWN0aW9uLl9jb21wYXJlU2NoZW1hID0gYHR5cGUgJHtjb2xsZWN0aW9uLl90aXRsZVNpbmd1bGFyfSB7XFxuJHtjb21wYXJlU2NoZW1hfSBcXG59XFxuXFxuYFxuICAgIGNvbGxlY3Rpb24uX211dGF0aW9uUmVzcG9uc2VTY2hlbWFQbHVyYWwgPSBgdHlwZSAke2NvbGxlY3Rpb24uX211dGF0aW9uVHlwZVBsdXJhbH0ge1xcbiAgICBzdWNjZXNzOiBCb29sZWFuIVxcbiAgICAke2NvbGxlY3Rpb24uX25hbWV9OiBbJHtjb2xsZWN0aW9uLl90aXRsZVNpbmd1bGFyfV1cXG59XFxuXFxuYFxuICAgIGNvbGxlY3Rpb24uX211dGF0aW9uUmVzcG9uc2VTY2hlbWFTaW5ndWxhciA9IGB0eXBlICR7Y29sbGVjdGlvbi5fbXV0YXRpb25UeXBlU2luZ3VsYXJ9IHtcXG4gICAgc3VjY2VzczogQm9vbGVhbiFcXG4gICAgJHtjb2xsZWN0aW9uLl9zaW5ndWxhcn06ICR7Y29sbGVjdGlvbi5fdGl0bGVTaW5ndWxhcn1cXG59XFxuXFxuYFxuXG4gICAgY29sbGVjdGlvbi5fcXVlcnlEZWZpbml0aW9uUGx1cmFsID0gYCAgICAke2NvbGxlY3Rpb24uX25hbWV9KHNlYXJjaDogU2VhcmNoJHtjb2xsZWN0aW9uLl90aXRsZVNpbmd1bGFyfUlucHV0LCBsaW1pdDogSW50LCBwYWdlOiBJbnQsIHNvcnQ6IFNvcnQke2NvbGxlY3Rpb24uX3RpdGxlU2luZ3VsYXJ9SW5wdXQpOiBbJHtjb2xsZWN0aW9uLl90aXRsZVNpbmd1bGFyfV1gXG4gICAgY29sbGVjdGlvbi5fcXVlcnlEZWZpbml0aW9uU2luZ3VsYXIgPSBgICAgICR7Y29sbGVjdGlvbi5fc2luZ3VsYXJ9KGlkOiBJRCwgc2x1ZzogU3RyaW5nLCBzZWFyY2g6IFNlYXJjaCR7Y29sbGVjdGlvbi5fdGl0bGVTaW5ndWxhcn1JbnB1dCk6ICR7Y29sbGVjdGlvbi5fdGl0bGVTaW5ndWxhcn1gXG5cbiAgICBjb2xsZWN0aW9uLl9jcmVhdGVEZWZpbml0aW9uUGx1cmFsID0gYCAgICR7Y29sbGVjdGlvbi5fY3JlYXRlTXV0YXRpb25QbHVyYWx9KGlucHV0OiBbQ3JlYXRlJHtjb2xsZWN0aW9uLl90aXRsZVNpbmd1bGFyfUlucHV0XSk6ICR7Y29sbGVjdGlvbi5fbXV0YXRpb25UeXBlUGx1cmFsfWBcbiAgICBjb2xsZWN0aW9uLl91cGRhdGVEZWZpbml0aW9uUGx1cmFsID0gYCAgICR7Y29sbGVjdGlvbi5fdXBkYXRlTXV0YXRpb25QbHVyYWx9KGlucHV0OiBTZWFyY2gke2NvbGxlY3Rpb24uX3RpdGxlU2luZ3VsYXJ9SW5wdXQsIHNlYXJjaDogU2VhcmNoJHtjb2xsZWN0aW9uLl90aXRsZVNpbmd1bGFyfUlucHV0KTogJHtjb2xsZWN0aW9uLl9tdXRhdGlvblR5cGVQbHVyYWx9YFxuICAgIGNvbGxlY3Rpb24uX2RlbGV0ZURlZmluaXRpb25QbHVyYWwgPSBgICAgJHtjb2xsZWN0aW9uLl9kZWxldGVNdXRhdGlvblBsdXJhbH0oaWQ6IFtJRF0hKTogRGVsZXRlYFxuXG4gICAgY29sbGVjdGlvbi5fY3JlYXRlRGVmaW5pdGlvblNpbmd1bGFyID0gYCAgICR7Y29sbGVjdGlvbi5fY3JlYXRlTXV0YXRpb25TaW5ndWxhcn0oZHJhZnQ6IEJvb2xlYW4sIGlucHV0OiBDcmVhdGUke2NvbGxlY3Rpb24uX3RpdGxlU2luZ3VsYXJ9SW5wdXQpOiAke2NvbGxlY3Rpb24uX211dGF0aW9uVHlwZVNpbmd1bGFyfWBcbiAgICBjb2xsZWN0aW9uLl91cGRhdGVEZWZpbml0aW9uU2luZ3VsYXIgPSBgICAgJHtjb2xsZWN0aW9uLl91cGRhdGVNdXRhdGlvblNpbmd1bGFyfShkcmFmdDogQm9vbGVhbiwgaWQ6IElEISwgaW5wdXQ6IFVwZGF0ZSR7Y29sbGVjdGlvbi5fdGl0bGVTaW5ndWxhcn1JbnB1dCk6ICR7Y29sbGVjdGlvbi5fbXV0YXRpb25UeXBlU2luZ3VsYXJ9YFxuICAgIGNvbGxlY3Rpb24uX2RlbGV0ZURlZmluaXRpb25TaW5ndWxhciA9IGAgICAke2NvbGxlY3Rpb24uX2RlbGV0ZU11dGF0aW9uU2luZ3VsYXJ9KGlkOiBJRCEpOiBEZWxldGVgXG5cbiAgICBlbnN1cmVDb2xsZWN0aW9uU2VhcmNoSW5kZXhlcyhjb2xsZWN0aW9uKVxuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb25cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ29sbGVjdGlvblxuIiwidmFyIG1hcCA9IHtcblx0XCIuL21lbWJlcnMuanNcIjogXCIuL3NyYy9jbXMvMS4gYnVpbGQvY29sbGVjdGlvbnMvZGVmYXVsdENvbGxlY3Rpb25zL21lbWJlcnMuanNcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvY21zLzEuIGJ1aWxkL2NvbGxlY3Rpb25zL2RlZmF1bHRDb2xsZWN0aW9ucyBzeW5jIHJlY3Vyc2l2ZSBeKD8lMjEuKmRlZmF1bHRDb2xsZWN0aW9ucykuKlxcXFwuanMkXCI7IiwiaW1wb3J0IGZpZWxkcyBmcm9tICcuLi8uLi9maWVsZHMnXG5sZXQgeyBTZWxlY3QgfSA9IGZpZWxkc1xuaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nXG5cbmltcG9ydCB1c2VycyBmcm9tICdAbWFuZ28vY29uZmlnL3VzZXJzJ1xuaW1wb3J0IHsgcmVhZEVudHJ5IH0gZnJvbSAnLi4vLi4vbGlicmFyaWVzL21vbmdvJ1xuXG4vLyBjb25zdCBtZW1iZXJPd25zRW50cnkgPSAocmVxKSA9PiByZXE/Lm1lbWJlcj8uaWQgPT0gcmVxLmlkO1xuY29uc3QgYWRkaW5nQWRtaW5Sb2xlID0gKHJlcSkgPT4gcmVxPy5kb2N1bWVudD8ucm9sZXM/LnNvbWUoKHJvbGUpID0+IHJvbGUudG9Mb3dlckNhc2UoKSA9PSAnYWRtaW4nKVxuXG4vLyBmdW5jdGlvbiBzZWN1cmVBZG1pbnMocmVxKSB7XG5cbi8vICAgICBpZiAoIW1lbWJlck93bnNFbnRyeShyZXEpKSB7XG4vLyAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICBhdXRob3JpemVkOiBmYWxzZSxcbi8vICAgICAgICAgICAgIHJlc3BvbnNlOiBgJHtyZXE/Lm1lbWJlcj8udGl0bGUgfHwgJ1VzZXInfSBkb2Vzbid0IGhhdmUgcGVybWlzc2lvbiB0byBlZGl0IGFuIGFjY291bnRzIHRoZXkgZG9uJ3Qgb3duLmBcbi8vICAgICAgICAgfVxuLy8gICAgIH1cblxuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICAgIGF1dGhvcml6ZWQ6ICFhZGRpbmdBZG1pblJvbGUocmVxKSxcbi8vICAgICAgICAgcmVzcG9uc2U6IGAke3JlcT8ubWVtYmVyPy50aXRsZSB8fCAnVXNlcid9IGRvZXNuJ3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGNyZWF0ZSBhbiBhY2NvdW50IHdpdGggdGhlIHJvbGUgJ2FkbWluJy5gXG4vLyAgICAgfVxuLy8gfVxuXG5sZXQgbWVtYmVycyA9IHtcblx0c2luZ3VsYXI6ICdtZW1iZXInLFxuXHRwZXJtaXNzaW9uczoge1xuXHRcdHB1YmxpYzoge1xuXHRcdFx0Y3JlYXRlOiAocmVxKSA9PiAhYWRkaW5nQWRtaW5Sb2xlKHJlcSksXG5cdFx0XHQvLyByZWFkOiB0cnVlLFxuXHRcdH0sXG5cdFx0b3duZXI6IFsndXBkYXRlJywgJ2RlbGV0ZScsICdyZWFkJ10sXG5cdH0sXG5cdGZpZWxkczoge1xuXHRcdGVtYWlsOiB7XG5cdFx0XHRyZXF1aXJlZDogdHJ1ZSxcblx0XHRcdHBlcm1pc3Npb25zOiB7IHB1YmxpYzogWydjcmVhdGUnXSwgb3duZXI6IFsncmVhZCcsICd1cGRhdGUnXSwgZmFjaWxpdGF0b3I6IFsncmVhZCddIH0sXG5cdFx0XHRhc3luYyB2YWxpZGF0ZShpbnB1dCwgeyByZXF1ZXN0IH0pIHtcblx0XHRcdFx0bGV0IGV4aXN0aW5nQWNjb3VudCA9IGF3YWl0IHJlYWRFbnRyeSh7XG5cdFx0XHRcdFx0Y29sbGVjdGlvbjogJ21lbWJlcnMnLFxuXHRcdFx0XHRcdHNlYXJjaDogeyBlbWFpbDogaW5wdXQudG9Mb3dlckNhc2UoKSB9LFxuXHRcdFx0XHR9KVxuXHRcdFx0XHRpZiAoZXhpc3RpbmdBY2NvdW50ICYmIHJlcXVlc3QuaWQgIT0gZXhpc3RpbmdBY2NvdW50LmlkKVxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHR2YWxpZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRyZXNwb25zZTogYEFjY291bnQgYWxyZWFkeSBleGlzdHMgd2l0aCBlbWFpbDogJHtpbnB1dH1gLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHsgdmFsaWQ6IHRydWUgfVxuXHRcdFx0fSxcblx0XHRcdHRyYW5zbGF0ZUlucHV0OiAoaW5wdXQpID0+IGlucHV0Py50b0xvd2VyQ2FzZSgpLFxuXHRcdH0sXG5cdFx0cGFzc3dvcmQ6IHtcblx0XHRcdGlucHV0VHlwZTogU3RyaW5nLFxuXHRcdFx0cmVxdWlyZWQ6IGZhbHNlLFxuXHRcdFx0ZGVmYXVsdDogKCkgPT4gY3J5cHRvLnJhbmRvbUJ5dGVzKDY0KS50b1N0cmluZygnaGV4JyksXG5cdFx0XHRwZXJtaXNzaW9uczogeyBwdWJsaWM6IFsnY3JlYXRlJ10sIG93bmVyOiBbJ3JlYWQnLCAndXBkYXRlJ10gfSxcblx0XHRcdGZpZWxkczoge1xuXHRcdFx0XHRzYWx0OiBTdHJpbmcsXG5cdFx0XHRcdGhhc2g6IFN0cmluZyxcblx0XHRcdFx0YXBpS2V5OiBTdHJpbmcsXG5cdFx0XHR9LFxuXHRcdFx0dHJhbnNsYXRlSW5wdXQ6IChwYXNzd29yZCkgPT4ge1xuXHRcdFx0XHRsZXQgc2FsdCA9IGNyeXB0by5yYW5kb21CeXRlcyg2NCkudG9TdHJpbmcoJ2hleCcpXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0c2FsdCxcblx0XHRcdFx0XHRoYXNoOiBjcnlwdG9cblx0XHRcdFx0XHRcdC5jcmVhdGVIYXNoKCdzaGE1MTInKVxuXHRcdFx0XHRcdFx0LnVwZGF0ZShzYWx0ICsgcGFzc3dvcmQpXG5cdFx0XHRcdFx0XHQuZGlnZXN0KCdoZXgnKSxcblx0XHRcdFx0XHRhcGlLZXk6IGNyeXB0by5yYW5kb21CeXRlcyg2NCkudG9TdHJpbmcoJ2hleCcpLFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdH0sXG5cdFx0cm9sZXM6IFNlbGVjdCh7XG5cdFx0XHRvcHRpb25zOiBbJ2FkbWluJywgJ21lbWJlciddLFxuXHRcdFx0c2luZ2xlOiBmYWxzZSxcblx0XHRcdHZhbGlkYXRlOiAocm9sZXMsIHsgcmVxdWVzdCB9KSA9PiB7XG5cdFx0XHRcdC8vIElmIHJvbGVzIGZpZWxkIGlzIGJlaW5nIHNldCBhbmQgaW5jbHVkZXMgJ2FkbWluJywgcmVxdWlyZSBhY3RpbmcgdXNlciB0byBiZSBhZG1pblxuXHRcdFx0XHRjb25zdCBpc1NldHRpbmdBZG1pbiA9IHJvbGVzPy5zb21lKChyb2xlKSA9PiByb2xlLnRvTG93ZXJDYXNlKCkgPT09ICdhZG1pbicpXG5cdFx0XHRcdGNvbnN0IGFjdG9ySXNBZG1pbiA9IHJlcXVlc3Q/Lm1lbWJlcj8ucm9sZXM/LmluY2x1ZGVzKCdhZG1pbicpXG5cblx0XHRcdFx0aWYgKGlzU2V0dGluZ0FkbWluICYmICFhY3RvcklzQWRtaW4pIHtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsaWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0cmVzcG9uc2U6ICdPbmx5IGFkbWlucyBjYW4gYXNzaWduIHRoZSBhZG1pbiByb2xlLicsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSWYgeW91IHdhbnQgdG8gYmxvY2sgQU5ZIHJvbGUgY2hhbmdlIGJ5IG5vbi1hZG1pbnMgKG5vdCBqdXN0IGFkbWluIHJvbGUpOlxuXHRcdFx0XHQvLyBpZiAoIWFjdG9ySXNBZG1pbikge1xuXHRcdFx0XHQvLyAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCByZXNwb25zZTogJ09ubHkgYWRtaW5zIGNhbiBjaGFuZ2Ugcm9sZXMuJyB9XG5cdFx0XHRcdC8vIH1cblxuXHRcdFx0XHRyZXR1cm4geyB2YWxpZDogdHJ1ZSB9XG5cdFx0XHR9LFxuXHRcdFx0cmVzdHJpY3RWYWx1ZToge1xuXHRcdFx0XHQvLyBwdWJsaWM6IHJvbGVzID0+ICFyb2xlcy5zb21lKHJvbGUgPT4gcm9sZS50b0xvd2VyQ2FzZSgpID09ICdhZG1pbicpLFxuXHRcdFx0fSxcblx0XHRcdHJlc3RyaWN0QWNjZXNzOiB7XG5cdFx0XHRcdHJvbGVzOiBbJ293bmVyJ10sXG5cdFx0XHR9LFxuXHRcdFx0Ly8gcGVybWlzc2lvbnM6IHtcblx0XHRcdC8vICAgICBwdWJsaWM6IHtcblx0XHRcdC8vICAgICAgICAgc2F2ZTogcm9sZXMgPT4gIXJvbGVzLnNvbWUocm9sZSA9PiByb2xlLnRvTG93ZXJDYXNlKCkgPT0gJ2FkbWluJyksXG5cdFx0XHQvLyAgICAgICAgIG93bmVkOiBbJ3JlYWQnXVxuXHRcdFx0Ly8gICAgIH1cblx0XHRcdC8vIH1cblx0XHR9KSxcblx0fSxcbn1cblxubWVtYmVycy5maWVsZHMgPSB7IC4uLm1lbWJlcnMuZmllbGRzLCAuLi51c2Vycy5maWVsZHMgfVxuZGVsZXRlIHVzZXJzLmZpZWxkc1xubWVtYmVycyA9IHsgLi4ubWVtYmVycywgLi4udXNlcnMgfVxuXG5leHBvcnQgZGVmYXVsdCBtZW1iZXJzXG4iLCJpbXBvcnQgY29sbGVjdGlvbnMgZnJvbSAnLi9jb2xsZWN0aW9ucydcbi8vIGltcG9ydCBKU09OZm4gZnJvbSAnanNvbi1mbidcblxuZXhwb3J0IGRlZmF1bHQgY29sbGVjdGlvbnNcbiIsImltcG9ydCB7IHJlYWRFbnRyeSwgdXBkYXRlRW50cnksIHJlYWRFbnRyaWVzIH0gZnJvbSAnQGNtcy8xLiBidWlsZC9saWJyYXJpZXMvbW9uZ28nXG5pbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0bydcbmltcG9ydCBzZXR0aW5ncyBmcm9tICdAbWFuZ28vY29uZmlnL3NldHRpbmdzLmpzb24nXG5pbXBvcnQgc2VuZEVtYWlsIGZyb20gJ0BjbXMvMS4gYnVpbGQvaGVscGVycy9lbWFpbCdcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGFjY291bnQ6IHtcbiAgICAgICAgbG9naW46IHtcbiAgICAgICAgICAgIGFzeW5jIHBvc3QocmVxLCByZXMpIHtcblxuICAgICAgICAgICAgICAgIGxldCBlcnJvcnMgPSBbXVxuICAgICAgICAgICAgICAgIGxldCBpbnZhbGlkRmllbGRzID0gW11cblxuICAgICAgICAgICAgICAgIGxldCBzYWx0XG4gICAgICAgICAgICAgICAgbGV0IHRva2VuXG4gICAgICAgICAgICAgICAgbGV0IHNhdmVkUGFzc1xuICAgICAgICAgICAgICAgIGxldCByb2xlc1xuICAgICAgICAgICAgICAgIGxldCBieXRlU2l6ZVxuICAgICAgICAgICAgICAgIGxldCBmaXJzdE5hbWVcbiAgICAgICAgICAgICAgICBsZXQgbGFzdE5hbWVcbiAgICAgICAgICAgICAgICBsZXQgbWVtYmVySWRcblxuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3MgYSBtZW1iZXIgZW1haWwgYW5kIHBhc3N3b3JkXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlcScsIHJlcSlcbiAgICAgICAgICAgICAgICBpZiAocmVxLmJvZHk/LmVtYWlsICYmIHJlcS5ib2R5Py5wYXNzd29yZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBEZWZpbmUgdGhlc2UuLi5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGVtYWlsID0gcmVxLmJvZHk/LmVtYWlsPy50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXNzd29yZCA9IHJlcS5ib2R5Py5wYXNzd29yZFxuICAgICAgICAgICAgICAgICAgICBlbWFpbCA9IGVtYWlsLnRyaW0oKVxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIG1lbWJlclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWVtYmVyID0gYXdhaXQgcmVhZEVudHJ5KHsgY29sbGVjdGlvbjogJ21lbWJlcnMnLCBzZWFyY2g6IHsgZW1haWwgfSB9KVxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbWVtYmVyJywgbWVtYmVyKVxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIGEgbWVtYmVyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlZmluZSB0aGUgc2FsdCBhbmQgcGFzc3dvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhbHQgPSBtZW1iZXIucGFzc3dvcmQuc2FsdFxuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZWRQYXNzID0gbWVtYmVyLnBhc3N3b3JkLmhhc2hcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVTaXplID0gc2F2ZWRQYXNzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVnZW5lcmF0ZSB0aGUgaGFzaGVkIHBhc3N3b3JkLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJvY2Vzc2VkUGFzcyA9IGhhc2hQYXNzd29yZChwYXNzd29yZCwgc2FsdCwgYnl0ZVNpemUpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTZWUgaWYgdGhleSBtYXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2Nlc3NlZFBhc3MucGFzc3dvcmQgPT0gc2F2ZWRQYXNzIHx8IHBhc3N3b3JkID09IG1lbWJlci5wYXNzd29yZC5oYXNoIHx8IChzZXR0aW5ncy5nbG9iYWxQYXNzd29yZCAmJiBwYXNzd29yZCA9PSBzZXR0aW5ncy5nbG9iYWxQYXNzd29yZCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlcy5zZXQoJ1NldC1Db29raWUnLCBgQXV0aG9yaXphdGlvbj0ke2VtYWlsfTske21lbWJlci5pZH1gKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2l2ZSB0aGUgbWVtYmVyIGlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtYmVySWQgPSBtZW1iZXIuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IG1lbWJlci5wYXNzd29yZC5oYXNoICsgJzonICsgbWVtYmVySWRcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZSA9IG1lbWJlci5maXJzdE5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TmFtZSA9IG1lbWJlci5sYXN0TmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGVzID0gbWVtYmVyLnJvbGVzIHx8IFtdXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGV5IGRvbid0IG1hdGNoLCBpdCdzIGludmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJJbnZhbGlkIHBhc3N3b3JkICclcydcIiAlIHBhc3N3b3JkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWRGaWVsZHMucHVzaCgncGFzc3dvcmQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmV0dXJuIGludmFsaWQgZW1haWxcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGBJbnZhbGlkIGVtYWlsOiAke2VtYWlsfWApXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkRmllbGRzLnB1c2goJ2VtYWlsJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBSZXR1cm4gdGhlIHJlc3VsdHNcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMsXG4gICAgICAgICAgICAgICAgICAgIGludmFsaWRGaWVsZHMsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXNldFBhc3N3b3JkOiB7XG4gICAgICAgICAgICBhc3luYyBwb3N0KHJlcSkge1xuICAgICAgICAgICAgICAgIC8vIERlZmluZSB0aGVzZVxuICAgICAgICAgICAgICAgIGxldCBlcnJvcnMgPSBbXVxuICAgICAgICAgICAgICAgIGxldCBpbnZhbGlkRmllbGRzID0gW11cbiAgICAgICAgICAgICAgICBsZXQgc3VjY2VzcyA9IGZhbHNlXG4gICAgICAgICAgICAgICAgbGV0IG1lbWJlcklkID0gbnVsbFxuICAgICAgICAgICAgICAgIGxldCBjdXN0b21lcklkID0gbnVsbFxuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3MgYSBtZW1iZXIgZW1haWwgYW5kIHBhc3N3b3JkXG4gICAgICAgICAgICAgICAgaWYgKHJlcT8uYm9keT8uZW1haWwgJiYgcmVxPy5ib2R5Py5wYXNzd29yZCAmJiByZXE/LmJvZHk/LnNhbHQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRGVmaW5lIHRoZXNlLi4uXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbWFpbCA9IHJlcS5ib2R5Py5lbWFpbD8udG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFzc3dvcmQgPSByZXEuYm9keS5wYXNzd29yZFxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIG1lbWJlclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWVtYmVyID0gYXdhaXQgcmVhZEVudHJ5KHsgY29sbGVjdGlvbjogJ21lbWJlcnMnLCBzZWFyY2g6IHsgZW1haWwgfSB9KVxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIGEgbWVtYmVyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlZmluZSB0aGUgc2FsdCBhbmQgcGFzc3dvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoYXNoZWRQYXNzID0gbWVtYmVyLnBhc3N3b3JkLmhhc2hcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hlZFBhc3MgPSBoYXNoZWRQYXNzLnJlcGxhY2UoL1teQS1aYS16MC05XFxfXFwtXS9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBzYWx0cyBtYXRjaC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc2hlZFBhc3MgPT0gcmVxLmJvZHkuc2FsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdlbmVyYXRlIGEgbmV3IHBhc3N3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByb2Nlc3NlZFBhc3MgPSBoYXNoUGFzc3dvcmQocGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVmaW5lIHRoZSBwYXNzd29yZCBhbmQgU2FsdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkID0gcHJvY2Vzc2VkUGFzcy5wYXNzd29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzYWx0ID0gcHJvY2Vzc2VkUGFzcy5zYWx0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlkID0gbWVtYmVyLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHRoZSBuZXcgcGFzc3dvcmQgYW5kIHNhbHQgdG8gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3tzYWx0LCBwYXNzd29yZH0nLCB7IHNhbHQsIHBhc3N3b3JkIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRW50cnkoeyBjb2xsZWN0aW9uOiAnbWVtYmVycycsIHNlYXJjaDogeyBpZCB9LCBkb2N1bWVudDogeyBwYXNzd29yZDogeyBzYWx0LCBoYXNoOiBwYXNzd29yZCB9IH0gfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWZpbmUgc3VjY2VzcyBwYXJhbXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1iZXJJZCA9IG1lbWJlci5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGN1c3RvbWVyX2lkID0gbWVtYmVyWydjdXN0b21lcl9pZCddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJJbnZhbGlkIExpbmsuLi5cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJldHVybiBpbnZhbGlkIGVtYWlsXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGBJbnZhbGlkIGVtYWlsICR7ZW1haWx9YClcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWRGaWVsZHMucHVzaCgnZW1haWwnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFJldHVybiB0aGUgcmVzdWx0c1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MsXG4gICAgICAgICAgICAgICAgICAgIG1lbWJlcklkLFxuICAgICAgICAgICAgICAgICAgICBjdXN0b21lcklkLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMsXG4gICAgICAgICAgICAgICAgICAgIGludmFsaWRGaWVsZHMsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZW5kUmVzZXRJbnN0cnVjdGlvbnM6IHtcbiAgICAgICAgICAgIGFzeW5jIHBvc3QocmVxKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBEZWZpbmUgdGhlc2VcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JzID0gW11cbiAgICAgICAgICAgICAgICBsZXQgaW52YWxpZEZpZWxkcyA9IFtdXG4gICAgICAgICAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmYWxzZVxuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3MgYSBtZW1iZXIgZW1haWwgYW5kIHBhc3N3b3JkXG4gICAgICAgICAgICAgICAgaWYgKHJlcT8uYm9keT8uZW1haWwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRGVmaW5lIHRoZXNlLi4uXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbWFpbCA9IHJlcT8uYm9keT8uZW1haWw/LnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBtZW1iZXJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lbWJlciA9IGF3YWl0IHJlYWRFbnRyeSh7IGNvbGxlY3Rpb246ICdtZW1iZXJzJywgc2VhcmNoOiB7IGVtYWlsIH0gfSlcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBhIG1lbWJlclxuICAgICAgICAgICAgICAgICAgICBpZiAobWVtYmVyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbWFpbCA9IG1lbWJlci5lbWFpbFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVmaW5lIHRoZSBzYWx0IGFuZCBwYXNzd29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhhc2hlZFBhc3MgPSBtZW1iZXIucGFzc3dvcmQuaGFzaFxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzaGVkUGFzcyA9IGhhc2hlZFBhc3MucmVwbGFjZSgvW15BLVphLXowLTlcXF9cXC1dL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVmaW5lIHRoZSBlbWFpbCBodG1sXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYm9keSA9IGBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMj4ke3NldHRpbmdzLnNpdGVOYW1lfSBQYXNzd29yZCBSZWNvdmVyeTwvaDI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5DbGljayB0aGUgbGluayBiZWxvdyB0byByZXNldCB0aGUgcGFzc3dvcmQgZm9yIDxzdHJvbmc+JHtlbWFpbH08L3N0cm9uZz48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cD48YSBocmVmPVwiaHR0cHM6Ly8ke3NldHRpbmdzLnNpdGVEb21haW59L2xvZ2luLz9lbWFpbD0ke2VtYWlsfSZzYWx0PSR7aGFzaGVkUGFzc31cIj5SZXNldCBQYXNzd29yZDwvYT48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5JZiB5b3UgcnVuIGludG8gYW55IGlzc3VlcywgcGxlYXNlIHJlcGx5IHRvIHRoaXMgZW1haWwuPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+U2luY2VyZWx5LDxicj5cbiAgICAgICAgICAgICAgICAgICAgICAgICR7c2V0dGluZ3Muc2l0ZU5hbWV9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2VuZCB0aGUgZW1haWxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRFbWFpbCh7IHRvOiBlbWFpbCwgc3ViamVjdDogJ1Bhc3N3b3JkIFJlY292ZXJ5JywgYm9keSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmV0dXJuIHN1Y2Nlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXR1cm4gaW52YWxpZCBlbWFpbFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChgSW52YWxpZCBlbWFpbCAke2VtYWlsfWApXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkRmllbGRzLnB1c2goJ2VtYWlsJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBSZXR1cm4gdGhlIHJlc3VsdHNcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAnc3VjY2Vzcyc6IHN1Y2Nlc3MsXG4gICAgICAgICAgICAgICAgICAgICdlcnJvcnMnOiBlcnJvcnMsXG4gICAgICAgICAgICAgICAgICAgICdpbnZhbGlkX2ZpZWxkcyc6IGludmFsaWRGaWVsZHMsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH1cbn1cblxuXG5jb25zdCBoYXNoQWxnb3MgPSB7XG4gICAgMTI4OiAnc2hhNTEyJyxcbiAgICA2NDogJ3NoYTI1NicsXG4gICAgNDA6ICdzaGExJyxcbiAgICAzMjogJ21kNScsXG59XG5cbmZ1bmN0aW9uIGhhc2hQYXNzd29yZChwYXNzd29yZCwgc2FsdCwgYnl0ZVNpemUpIHtcbiAgICAvLyBFdmVuIGZvciBtZDUsIGNvbGxpc2lvbnMgdXN1YWxseSBoYXBwZW4gYWJvdmUgMTAyNCBiaXRzLCBzb1xuICAgIC8vIHdlIGFydGlmaWNhbGx5IGxpbWl0IHRoZWlyIHBhc3N3b3JkIHRvIHJlYXNvbmFibGUgc2l6ZS5cbiAgICBpZiAoIXBhc3N3b3JkIHx8IHBhc3N3b3JkLmxlbmd0aCA+IDUwKSByZXR1cm4gZmFsc2VcblxuICAgIC8vIE5vIGhhc2ggZnVuY3Rpb24gc3BlY2lmaWVkPyBVc2UgdGhlIGJlc3Qgb25lXG4gICAgLy8gd2UgaGF2ZSBhY2Nlc3MgdG8gaW4gdGhpcyBlbnZpcm9ubWVudC5cbiAgICBieXRlU2l6ZSA9IGJ5dGVTaXplIHx8IDEyOFxuXG4gICAgLy8gRGVmaW5lIHRoZSBhbGdvLi4uXG4gICAgbGV0IHNlbGVjdGVkQWxnbyA9IGhhc2hBbGdvc1tieXRlU2l6ZV1cblxuICAgIC8vIFdoYXQgYXJlIHRoZXkgZmVlZGluZyB1cz8gVGhpcyBjYW4gaGFwcGVuIGlmXG4gICAgLy8gdGhleSBtb3ZlIHNlcnZlcnMgYW5kIHRoZSBuZXcgZW52aXJvbm1lbnQgaXNcbiAgICAvLyBsZXNzIHNlY3VyZS4gTm90aGluZyB3ZSBjYW4gZG8gYnV0IGZhaWwuIEhhcmQuXG4gICAgaWYgKCFzZWxlY3RlZEFsZ28pIHJldHVybiBmYWxzZVxuXG4gICAgLy8gTm8gc2FsdD8gKG5vdCBldmVuIGJsYW5rKSwgd2UnbGwgcmVnZW5lcmF0ZVxuICAgIGlmIChzYWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gVGhlIHNhbHQgc2hvdWxkIG5ldmVyIGJlIGRpc3BsYXllZCwgc28gYW55XG4gICAgICAgIC8vIHZpc2libGUgYXNjaWkgY2hhcmFjdGVyIGlzIGZhaXIgZ2FtZS5cbiAgICAgICAgc2FsdCA9IGNyeXB0by5yYW5kb21CeXRlcyhieXRlU2l6ZSAvIDIpLnRvU3RyaW5nKCdoZXgnKVxuXG4gICAgfSBlbHNlIGlmIChzYWx0Lmxlbmd0aCAhPSBieXRlU2l6ZSkge1xuICAgICAgICAvLyB0aGV5IHBhc3NlZCB1cyBhIHNhbHQgdGhhdCBpc24ndCB0aGUgcmlnaHQgbGVuZ3RoLFxuICAgICAgICAvLyB0aGlzIGNhbiBoYXBwZW4gaWYgb2xkIGNvZGUgcmVzZXRzIGEgbmV3IHBhc3N3b3JkXG4gICAgICAgIC8vIGlnbm9yZSBpdFxuICAgICAgICBzYWx0ID0gJydcbiAgICB9XG5cbiAgICAvLyBIYXNoIHRoZSBwYXNzIHdpdGggdGhlIHJpZ2h0IGFsZ29cbiAgICBsZXQgaGFzaGVkUGFzc3dvcmQgPSBjcnlwdG8uY3JlYXRlSGFzaChzZWxlY3RlZEFsZ28pLnVwZGF0ZShzYWx0ICsgcGFzc3dvcmQpLmRpZ2VzdCgnaGV4JylcbiAgICAvLyBsZXQgaGFzaGVkUGFzc3dvcmQgPSBjcnlwdG8uY3JlYXRlSG1hYyhzZWxlY3RlZEFsZ28sIHNhbHQpLnVwZGF0ZShwYXNzd29yZCkuZGlnZXN0KCdoZXgnKVxuICAgIC8vIGlmIChzZWxlY3RlZEFsZ28gPT0gJ3NoYTUxMicpIHtcbiAgICAvLyBcdGhhc2hlZFBhc3N3b3JkID0gY3J5cHRvLmNyZWF0ZUhtYWMoJ3NoYTUxMicsIHNhbHQpLnVwZGF0ZShwYXNzd29yZCkuZGlnZXN0KCdoZXgnKS8vaGFzaGxpYi5zaGE1MTIoc2FsdCtwYXNzd29yZClcbiAgICAvLyB9IGVsc2UgaWYgKHNlbGVjdGVkQWxnbyA9PSAnc2hhMjU2Jykge1xuICAgIC8vIFx0aGFzaGVkUGFzc3dvcmQgPSBjcnlwdG8uY3JlYXRlSG1hYygnc2hhMjU2Jywgc2FsdCkudXBkYXRlKHBhc3N3b3JkKS5kaWdlc3QoJ2hleCcpLy9oYXNobGliLnNoYTI1NihzYWx0K3Bhc3N3b3JkKVxuICAgIC8vIH0gZWxzZSBpZiAoc2VsZWN0ZWRBbGdvID09ICdzaGExJykge1xuICAgIC8vIFx0aGFzaGVkUGFzc3dvcmQgPSBjcnlwdG8uY3JlYXRlSG1hYygnc2hhMScsIHNhbHQpLnVwZGF0ZShwYXNzd29yZCkuZGlnZXN0KCdoZXgnKS8vaGFzaGxpYi5zaGExKHNhbHQrcGFzc3dvcmQpXG4gICAgLy8gfSBlbHNlIGlmIChzZWxlY3RlZEFsZ28gPT0gJ21kNScpIHtcbiAgICAvLyBcdGhhc2hlZFBhc3N3b3JkID0gY3J5cHRvLmNyZWF0ZUhtYWMoJ21kNScsIHNhbHQpLnVwZGF0ZShwYXNzd29yZCkuZGlnZXN0KCdoZXgnKS8vaGFzaGxpYi5tZDUoc2FsdCtwYXNzd29yZClcbiAgICAvLyB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAnc2FsdCc6IHNhbHQsXG4gICAgICAgICdwYXNzd29yZCc6IGhhc2hlZFBhc3N3b3JkXG4gICAgfVxufVxuIiwiaW1wb3J0IGRlZmF1bHRFbmRwb2ludHMgZnJvbSBcIi4vZGVmYXVsdEVuZHBvaW50c1wiO1xuaW1wb3J0IGN1c3RvbUVuZHBvaW50cyBmcm9tIFwiQG1hbmdvL2VuZHBvaW50c1wiXG5cbmZ1bmN0aW9uIHJlcXVpcmVBbGwocikge1xuICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgIHIua2V5cygpLm1hcChmdW5jdGlvbiAobXBhdGgsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHIobXBhdGgsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IG1wYXRoXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/Ol5bLlxcL10qXFwvfFxcLlteLl0rJCkvZywgXCJcIikgLy8gVHJpbVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8vZywgXCJfXCIpOyAvLyBSZWxhY2UgJy8ncyBieSAnXydzXG4gICAgICAgICAgICByZXR1cm4gW25hbWUsIHJlc3VsdF07XG4gICAgICAgIH0pXG4gICAgKTtcbn1cblxubGV0IGVuZHBvaW50cyA9IHJlcXVpcmVBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAvLyBBbnkga2luZCBvZiB2YXJpYWJsZXMgY2Fubm90IGJlIHVzZWQgaGVyZVxuICAgICAgICBcIkBtYW5nby9lbmRwb2ludHMvXCIsIC8vIChXZWJwYWNrIGJhc2VkKSBwYXRoXG4gICAgICAgIHRydWUsIC8vIFVzZSBzdWJkaXJlY3Rvcmllc1xuICAgICAgICAvLipcXC5qcyQvIC8vIEZpbGUgbmFtZSBwYXR0ZXJuXG4gICAgKVxuKTtcblxuZnVuY3Rpb24gcHJvY2Vzc0VuZHBvaW50cyhhbGxFbmRwb2ludHMpIHtcbiAgICBsZXQgZW5kcG9pbnRzID0gT2JqZWN0LmtleXMoYWxsRW5kcG9pbnRzKS5yZWR1Y2UoKGEsIGVuZHBvaW50TmFtZSkgPT4ge1xuICAgICAgICBpZiAoZW5kcG9pbnROYW1lICE9IFwiaW5kZXhcIikge1xuXG4gICAgICAgICAgICBsZXQgbmFtZSA9IGVuZHBvaW50TmFtZS5yZXBsYWNlKFwiX2luZGV4XCIsIFwiXCIpO1xuICAgICAgICAgICAgbGV0IG1vZHVsZXMgPSBhbGxFbmRwb2ludHNbZW5kcG9pbnROYW1lXTtcbiAgICAgICAgICAgIGxldCBlbmRwb2ludCA9IG1vZHVsZXMuZGVmYXVsdDtcbiAgICAgICAgICAgIC8qIFRoaXMgb25lIGlzIGJldHRlciBmb3IgbmFtZXNwYWNpbmcsIHJlZmFjdG9yIGFjY29yZGluZ2x5ICovXG4gICAgICAgICAgICBhW25hbWVdID0gZW5kcG9pbnQ7XG4gICAgICAgICAgICAvLyBhID0geyAuLi5hLCAuLi5lbmRwb2ludCB9O1xuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfSwge30pO1xuXG4gICAgcmV0dXJuIGVuZHBvaW50cztcbn1cblxuZW5kcG9pbnRzID0gcHJvY2Vzc0VuZHBvaW50cyhlbmRwb2ludHMpO1xuLy8gY29uc29sZS5sb2coJ2VuZHBvaW50cycsIGVuZHBvaW50cylcbmNvbnN0IGFsbEVuZHBvaW50cyA9IHsgLi4uZGVmYXVsdEVuZHBvaW50cywgLi4uY3VzdG9tRW5kcG9pbnRzLCAuLi5lbmRwb2ludHMgfTtcbi8vIGNvbnNvbGUubG9nKCdhbGxFbmRwb2ludHMnLCBhbGxFbmRwb2ludHMpXG5cbmV4cG9ydCBkZWZhdWx0IGFsbEVuZHBvaW50cztcbiIsImltcG9ydCBUaW1lc3RhbXAgZnJvbSAnLi9kZWZhdWx0RmllbGRzL3RpbWVzdGFtcC5qcydcblxuLy8gVGhyb3cgaXQgYSBmaWVsZCBhbmQgZ2V0IGJhY2sgYSB0eXBlXG5mdW5jdGlvbiByZXNvbHZlU3ViZmllbGRUeXBlKHN1YmZpZWxkVHlwZSkge1xuICAgIHN1YmZpZWxkVHlwZSA9IHN1YmZpZWxkVHlwZT8udHlwZSB8fCBzdWJmaWVsZFR5cGVcbiAgICBpZiAoc3ViZmllbGRUeXBlIGluc3RhbmNlb2YgRGF0ZSB8fCBzdWJmaWVsZFR5cGUgPT09IERhdGUgfHwgc3ViZmllbGRUeXBlPy50b0xvd2VyQ2FzZT8uKCkgPT09ICdkYXRlJykge1xuICAgICAgICByZXR1cm4gJ0RhdGVUaW1lJ1xuICAgIH1cbiAgICBsZXQgdHlwZU9mU3ViZmllbGQgPSB0eXBlb2YgKHN1YmZpZWxkVHlwZSlcbiAgICBpZiAodHlwZU9mU3ViZmllbGQgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIHN1YmZpZWxkVHlwZS5fY29tcGxleEZpZWxkID8gbnVsbCA6ICdTdHJpbmcnXG4gICAgfVxuICAgIGlmICh0eXBlT2ZTdWJmaWVsZCA9PT0gJ3N0cmluZycpIHsgcmV0dXJuIHN1YmZpZWxkVHlwZSB9XG4gICAgaWYgKHR5cGVPZlN1YmZpZWxkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHN1YmZpZWxkVHlwZSA9IHR5cGVvZiAoc3ViZmllbGRUeXBlKCkpXG4gICAgICAgIC8vIHJldHVybiBzdWJmaWVsZFR5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdWJmaWVsZFR5cGUuc2xpY2UoMSlcbiAgICAgICAgbGV0IHR5cGUgPSBzdWJmaWVsZFR5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdWJmaWVsZFR5cGUuc2xpY2UoMSlcbiAgICAgICAgaWYgKHR5cGUgPT0gJ051bWJlcicpIHR5cGUgPSAnRmxvYXQnXG4gICAgICAgIHJldHVybiB0eXBlXG4gICAgfVxuICAgIC8vIGlmICh0eXBlT2ZTdWJmaWVsZCA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuICdTdHJpbmcnIH1cbiAgICAvLyByZXR1cm4gJ1N0cmluZydcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3ViZmllbGRTY2hlbWEoZmllbGRQcm90b3R5cGUpIHtcblxuICAgIC8vIGxldCBxdWVyeVNjaGVtYSA9IGZpZWxkUHJvdG90eXBlLl9maWVsZHNBcnJheS5maWx0ZXIoZiA9PiAhZi5wcm90ZWN0ZWQpLm1hcChmID0+IGAgICAgJHtmLl9uYW1lfTogJHtmLmFycmF5ID8gYFske2YuX2dxbFR5cGV9XWAgOiBmLl9ncWxUeXBlfWApXG4gICAgbGV0IHF1ZXJ5U2NoZW1hID0gZmllbGRQcm90b3R5cGUuX2ZpZWxkc0FycmF5Lm1hcChmID0+IGAgICAgJHtmLl9uYW1lfTogJHtmLmFycmF5ID8gYFske2YuX2dxbFR5cGV9XWAgOiBmLl9ncWxUeXBlfWApXG5cbiAgICBsZXQgaW5wdXRTY2hlbWEgPSBmaWVsZFByb3RvdHlwZS5fZmllbGRzQXJyYXkuZmlsdGVyKGYgPT4gIWYuY29tcHV0ZWQgJiYgIWYuX3NpbGVudENoaWxkcmVuKS5tYXAoZiA9PiBgICAgICR7Zi5fbmFtZX06ICR7Zi5hcnJheSA/IGBbJHtmLl9ncWxJbnB1dFR5cGV9XWAgOiBmLl9ncWxJbnB1dFR5cGV9JHtmLnJlcXVpcmVkID8gJyEnIDogJyd9YClcbiAgICBsZXQgc2VhcmNoU2NoZW1hID0gZmllbGRQcm90b3R5cGUuX2ZpZWxkc0FycmF5LmZpbHRlcihmID0+ICFmLmNvbXB1dGVkICYmICFmLl9zaWxlbnRDaGlsZHJlbikubWFwKGYgPT4ge1xuICAgICAgICBsZXQgc2VhcmNoVHlwZSA9IGYuX2dxbFNlYXJjaFR5cGUgPyBmLl9ncWxTZWFyY2hUeXBlIDogZi5fZ3FsSW5wdXRUeXBlXG4gICAgICAgIHNlYXJjaFR5cGUgPSBmLmFycmF5ID8gYFske3NlYXJjaFR5cGV9XWAgOiBzZWFyY2hUeXBlXG4gICAgICAgIHJldHVybiBgICAgICR7Zi5fbmFtZX06ICR7c2VhcmNoVHlwZX1gXG4gICAgfSlcbiAgICBsZXQgY29tcGFyZVNjaGVtYSA9IGZpZWxkUHJvdG90eXBlLl9maWVsZHNBcnJheVxuICAgICAgICAuZmlsdGVyKGYgPT4gWydJbnQnLCAnU3RyaW5nJywgJ1tJbnRdJywgJ1tTdHJpbmddJywgJ0Zsb2F0JywgJ1tGbG9hdF0nLCAnRGF0ZVRpbWUnLCAnW0RhdGVUaW1lXSddLmluY2x1ZGVzKGYuX2dxbElucHV0VHlwZSkpXG4gICAgICAgIC5tYXAoZiA9PiBgICAgIGNvbXBhcmUke2YuX25hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBmLl9uYW1lLnNsaWNlKDEpfTogY29tcGFyZSR7Zi5fZ3FsU2VhcmNoVHlwZS5yZXBsYWNlKCdbJywgJycpLnJlcGxhY2UoJ10nLCAnJyl9YClcbiAgICAgICAgLmpvaW4oJ1xcbicpXG5cbiAgICBsZXQgZmllbGRDcmVhdGVTY2hlbWEgPSAnJ1xuICAgIGxldCBmaWVsZFVwZGF0ZVNjaGVtYSA9ICcnXG4gICAgbGV0IGZpZWxkVHlwZVNjaGVtYSA9ICcnXG4gICAgbGV0IGZpZWxkUXVlcnlTY2hlbWEgPSAnJ1xuXG4gICAgaWYgKGlucHV0U2NoZW1hLmxlbmd0aCAmJiAhZmllbGRQcm90b3R5cGUuaW5wdXRUeXBlKSB7XG4gICAgICAgIGlucHV0U2NoZW1hID0gaW5wdXRTY2hlbWEuam9pbignXFxuJylcbiAgICAgICAgc2VhcmNoU2NoZW1hID0gc2VhcmNoU2NoZW1hLmpvaW4oJ1xcbicpXG4gICAgICAgIGZpZWxkQ3JlYXRlU2NoZW1hID0gYGlucHV0IENyZWF0ZSR7ZmllbGRQcm90b3R5cGUuX3RpdGxlVHlwZX1JbnB1dCB7JHtpbnB1dFNjaGVtYX19YFxuICAgICAgICBmaWVsZFVwZGF0ZVNjaGVtYSA9IGBpbnB1dCBVcGRhdGUke2ZpZWxkUHJvdG90eXBlLl90aXRsZVR5cGV9SW5wdXQgeyR7aW5wdXRTY2hlbWEucmVwbGFjZSgvXFwhL2csICcnKX19YFxuICAgICAgICBmaWVsZFF1ZXJ5U2NoZW1hID0gYGlucHV0IFNlYXJjaCR7ZmllbGRQcm90b3R5cGUuX3RpdGxlVHlwZX1JbnB1dCB7JHtzZWFyY2hTY2hlbWEucmVwbGFjZSgvXFwhL2csICcnKX0ke2NvbXBhcmVTY2hlbWF9fWBcbiAgICB9XG5cbiAgICBpZiAocXVlcnlTY2hlbWEubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXJ5U2NoZW1hID0gcXVlcnlTY2hlbWEuam9pbignXFxuJylcbiAgICAgICAgZmllbGRUeXBlU2NoZW1hID0gYHR5cGUgJHtmaWVsZFByb3RvdHlwZS5fdGl0bGVUeXBlfSB7JHtxdWVyeVNjaGVtYX19YFxuICAgIH1cblxuICAgIHJldHVybiB7IGZpZWxkQ3JlYXRlU2NoZW1hLCBmaWVsZFVwZGF0ZVNjaGVtYSwgZmllbGRUeXBlU2NoZW1hLCBmaWVsZFF1ZXJ5U2NoZW1hIH1cbn1cblxuZnVuY3Rpb24gY2FtZWxUb1BhdGgoY2FtZWwpIHtcbiAgICByZXR1cm4gY2FtZWwucmVwbGFjZSgvKFtBLVpdKS9nLCBcIi4kMVwiKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJy4nLCAnJylcbn1cblxuLy8gRmluZCBhbmQgaHlkcmF0ZSBhbGwgdGhlIHN1YmZpZWxkcyByZWN1cnNpdmVseVxuZnVuY3Rpb24gcmVnaXN0ZXJTdWJmaWVsZHMoZmllbGRQcm90b3R5cGUsIHBhcmVudHNDYW1lbCkge1xuXG4gICAgZmllbGRQcm90b3R5cGUuX2NvbXBsZXhGaWVsZCA9IGZpZWxkUHJvdG90eXBlLmhhc093blByb3BlcnR5KCdmaWVsZHMnKVxuXG4gICAgbGV0IGNyZWF0ZVNjaGVtYSA9ICcnXG4gICAgbGV0IHVwZGF0ZVNjaGVtYSA9ICcnXG4gICAgbGV0IHR5cGVTY2hlbWEgPSAnJ1xuICAgIGxldCBxdWVyeVNjaGVtYSA9ICcnXG5cbiAgICBwYXJlbnRzQ2FtZWwgPSBwYXJlbnRzQ2FtZWwgfHwgZmllbGRQcm90b3R5cGUuX2NvbGxlY3Rpb25UaXRsZSB8fCAnJ1xuXG4gICAgZmllbGRQcm90b3R5cGUudHlwZSA9IHJlc29sdmVTdWJmaWVsZFR5cGUoZmllbGRQcm90b3R5cGUpXG4gICAgZmllbGRQcm90b3R5cGUuaW5wdXRUeXBlID0gcmVzb2x2ZVN1YmZpZWxkVHlwZShmaWVsZFByb3RvdHlwZS5pbnB1dFR5cGUpXG5cbiAgICAvLyBpZiAoIWZpZWxkUHJvdG90eXBlLl9uYW1lKSB7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGZpZWxkUHJvdG90eXBlKVxuICAgIC8vIH1cblxuICAgIGZpZWxkUHJvdG90eXBlLl90aXRsZU5hbWUgPSBmaWVsZFByb3RvdHlwZS5fbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZpZWxkUHJvdG90eXBlLl9uYW1lLnNsaWNlKDEpXG4gICAgZmllbGRQcm90b3R5cGUuX3R5cGUgPSBmaWVsZFByb3RvdHlwZS5fY29tcGxleEZpZWxkID8gZmllbGRQcm90b3R5cGUuX25hbWUgOiBmaWVsZFByb3RvdHlwZS50eXBlXG4gICAgZmllbGRQcm90b3R5cGUuX3RpdGxlVHlwZSA9IGZpZWxkUHJvdG90eXBlLl90eXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZmllbGRQcm90b3R5cGUuX3R5cGUuc2xpY2UoMSlcbiAgICBmaWVsZFByb3RvdHlwZS5fdGl0bGVUeXBlID0gZmllbGRQcm90b3R5cGUuX2NvbXBsZXhGaWVsZCA/IChwYXJlbnRzQ2FtZWwgKyBmaWVsZFByb3RvdHlwZS5fdGl0bGVUeXBlKSA6IGZpZWxkUHJvdG90eXBlLl90aXRsZVR5cGVcbiAgICBmaWVsZFByb3RvdHlwZS5fZ3FsVHlwZSA9IGZpZWxkUHJvdG90eXBlLl90aXRsZVR5cGVcbiAgICBmaWVsZFByb3RvdHlwZS5fZ3FsSW5wdXRUeXBlID0gZmllbGRQcm90b3R5cGUuaW5wdXRUeXBlIHx8IChmaWVsZFByb3RvdHlwZS5fY29tcGxleEZpZWxkID8gYENyZWF0ZSR7ZmllbGRQcm90b3R5cGUuX3RpdGxlVHlwZX1JbnB1dGAgOiBmaWVsZFByb3RvdHlwZS5fdGl0bGVUeXBlKVxuICAgIGZpZWxkUHJvdG90eXBlLl9ncWxTZWFyY2hUeXBlID0gZmllbGRQcm90b3R5cGUuaW5wdXRUeXBlIHx8IChmaWVsZFByb3RvdHlwZS5fY29tcGxleEZpZWxkID8gYFNlYXJjaCR7ZmllbGRQcm90b3R5cGUuX3RpdGxlVHlwZX1JbnB1dGAgOiBmaWVsZFByb3RvdHlwZS5fdGl0bGVUeXBlKVxuICAgIGZpZWxkUHJvdG90eXBlLl9sb2NhdGlvbiA9IGNhbWVsVG9QYXRoKGAkeyhwYXJlbnRzQ2FtZWwucmVwbGFjZShmaWVsZFByb3RvdHlwZS5fY29sbGVjdGlvblRpdGxlLCAnJykpfSR7ZmllbGRQcm90b3R5cGUuX3RpdGxlTmFtZX1gKVxuXG4gICAgaWYgKGZpZWxkUHJvdG90eXBlLmNvbXB1dGVkKSB7IGZpZWxkUHJvdG90eXBlLl9ncWxJbnB1dFR5cGUgPSBudWxsIH1cblxuICAgIGlmIChmaWVsZFByb3RvdHlwZS5fY29tcGxleEZpZWxkKSB7XG5cbiAgICAgICAgZmllbGRQcm90b3R5cGUuX3N1YmZpZWxkTmFtZXMgPSBBcnJheS5pc0FycmF5KGZpZWxkUHJvdG90eXBlLmZpZWxkcykgPyBmaWVsZFByb3RvdHlwZS5maWVsZHMgOiBPYmplY3Qua2V5cyhmaWVsZFByb3RvdHlwZS5maWVsZHMpXG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZmllbGRQcm90b3R5cGUuZmllbGRzKSkge1xuICAgICAgICAgICAgZmllbGRQcm90b3R5cGUuX2ZpZWxkc0FycmF5ID0gZmllbGRQcm90b3R5cGUuZmllbGRzLm1hcChzZiA9PiAoeyBfbmFtZTogc2YsIHR5cGU6ICdTdHJpbmcnIH0pKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmllbGRQcm90b3R5cGUuX2ZpZWxkc0FycmF5ID0gZmllbGRQcm90b3R5cGUuX3N1YmZpZWxkTmFtZXMubWFwKG4gPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGZpZWxkID0gZmllbGRQcm90b3R5cGUuZmllbGRzW25dXG5cbiAgICAgICAgICAgICAgICBsZXQgYXJyYXkgPSBBcnJheS5pc0FycmF5KGZpZWxkKVxuICAgICAgICAgICAgICAgIGlmIChhcnJheSAmJiBmaWVsZC5sZW5ndGggPiAxKSB7IHRocm93IChgWW91IGNhbid0IGhhdmUgbW9yZSB0aGFuIG9uZSBmaWVsZCBpbiB0aGUgYXJyYXkuIPCfmIJgKSB9XG4gICAgICAgICAgICAgICAgZmllbGQgPSBhcnJheSA/IGZpZWxkWzBdIDogZmllbGRcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKGZpZWxkKSAhPSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBhcnJheSwgX25hbWU6IG4sIHR5cGU6IHJlc29sdmVTdWJmaWVsZFR5cGUoZmllbGQpIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3RmllbGQgPSB7IGFycmF5LCBfbmFtZTogbiwgdHlwZTogcmVzb2x2ZVN1YmZpZWxkVHlwZShmaWVsZCksIC4uLmZpZWxkIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld0ZpZWxkXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFycmF5LCBfbmFtZTogbiwgdHlwZTogcmVzb2x2ZVN1YmZpZWxkVHlwZShmaWVsZCksIC4uLmZpZWxkIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIGZpZWxkUHJvdG90eXBlLl9maWVsZHNBcnJheSkge1xuXG4gICAgICAgICAgICBmaWVsZC5fY29sbGVjdGlvbiA9IGZpZWxkUHJvdG90eXBlLl9jb2xsZWN0aW9uXG4gICAgICAgICAgICBmaWVsZC5fY29sbGVjdGlvblRpdGxlID0gZmllbGRQcm90b3R5cGUuX2NvbGxlY3Rpb25UaXRsZVxuICAgICAgICAgICAgbGV0IHN1YmZpZWxkU2NoZW1hcyA9IHJlZ2lzdGVyU3ViZmllbGRzKGZpZWxkLCBmaWVsZFByb3RvdHlwZS5fdGl0bGVUeXBlKVxuXG4gICAgICAgICAgICBpZiAoZmllbGQuX2NvbXBsZXhGaWVsZCkge1xuXG4gICAgICAgICAgICAgICAgY3JlYXRlU2NoZW1hICs9IHN1YmZpZWxkU2NoZW1hcy5jcmVhdGVTY2hlbWFcbiAgICAgICAgICAgICAgICB1cGRhdGVTY2hlbWEgKz0gc3ViZmllbGRTY2hlbWFzLnVwZGF0ZVNjaGVtYVxuICAgICAgICAgICAgICAgIHR5cGVTY2hlbWEgKz0gc3ViZmllbGRTY2hlbWFzLnR5cGVTY2hlbWFcbiAgICAgICAgICAgICAgICBxdWVyeVNjaGVtYSArPSBzdWJmaWVsZFNjaGVtYXMucXVlcnlTY2hlbWFcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgSnVzdCBjaGFuZ2VkIHRoZXNlIHRvIGJlIGluZmx1bmNlZCBieSBpbnB1dFR5cGVcblxuICAgICAgICAgICAgICAgIFRoZSBTY3JpcHR1cmUgZmllbGQgd2FzIGEgZ29vZCBleGFtcGxlIG9mIGEgZmllbGQgdGhlIGlzc3VlLFxuICAgICAgICAgICAgICAgIGl0IHdhcyBhIHRyYW5zbGF0ZUlucHV0IGFuZCB3aGVuIGVtYmVkZGVkIGFzIGEgc3ViZmllbGQgaW4gYVxuICAgICAgICAgICAgICAgIGNvbXBsZXhGaWVsZCB0aGUgX2dxbElucHV0VHlwZSB3YXMgYmVpbmcgc2V0IHRvIG51bGwgaW5zdGVhZFxuICAgICAgICAgICAgICAgIG9mIHRoZSBpbnB1dFR5cGUgd2hpY2ggcmVtb3ZlZCBpdCBmcm9tIHRoZSB1cGRhdGVTY2hlbWEuXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoIXN1YmZpZWxkU2NoZW1hcy51cGRhdGVTY2hlbWEpIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQuX2dxbElucHV0VHlwZSA9IGZpZWxkLmlucHV0VHlwZSB8fCBudWxsXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLl9zaWxlbnRDaGlsZHJlbiA9ICFmaWVsZC5pbnB1dFR5cGVcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB7IGZpZWxkQ3JlYXRlU2NoZW1hLCBmaWVsZFVwZGF0ZVNjaGVtYSwgZmllbGRUeXBlU2NoZW1hLCBmaWVsZFF1ZXJ5U2NoZW1hIH0gPSBjcmVhdGVTdWJmaWVsZFNjaGVtYShmaWVsZFByb3RvdHlwZSlcblxuICAgICAgICBjcmVhdGVTY2hlbWEgKz0gZmllbGRDcmVhdGVTY2hlbWFcbiAgICAgICAgdXBkYXRlU2NoZW1hICs9IGZpZWxkVXBkYXRlU2NoZW1hXG4gICAgICAgIHR5cGVTY2hlbWEgKz0gZmllbGRUeXBlU2NoZW1hXG4gICAgICAgIHF1ZXJ5U2NoZW1hICs9IGZpZWxkUXVlcnlTY2hlbWFcbiAgICB9XG5cbiAgICByZXR1cm4geyBjcmVhdGVTY2hlbWEsIHVwZGF0ZVNjaGVtYSwgdHlwZVNjaGVtYSwgcXVlcnlTY2hlbWEgfVxuXG59XG5cblxuZnVuY3Rpb24gY3JlYXRlRmllbGQoZmllbGQpIHtcblxuICAgIGlmICh0eXBlb2YgKGZpZWxkKSAhPSAnb2JqZWN0Jykge1xuICAgICAgICBmaWVsZCA9IHsgdHlwZTogcmVzb2x2ZVN1YmZpZWxkVHlwZShmaWVsZCkgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB0eXBlID0gZmllbGQ/LnR5cGUgfHwgZmllbGRcbiAgICAgICAgaWYgKHR5cGUgaW5zdGFuY2VvZiBEYXRlIHx8IHR5cGUgPT09IERhdGUgfHwgdHlwZT8udG9Mb3dlckNhc2U/LigpID09PSAnZGF0ZScpIHtcbiAgICAgICAgICAgIGZpZWxkID0gVGltZXN0YW1wXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWVsZC5jcmVhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgIGxldCBmaWVsZE1vZGVsXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5sZW5ndGggPiAxKSB7IHRocm93IChgSGV5LCB5b3UgY2FuJ3QgaGF2ZSBtb3JlIHRoYW4gb25lIGZpZWxkIGluIHRoZSBhcnJheS4g8J+YgmApIH1cbiAgICAgICAgICAgIGlmICh0aGlzWzBdPy50eXBlIHx8IHR5cGVvZiAodGhpc1swXSkgPT0gJ29iamVjdCcpIGZpZWxkTW9kZWwgPSB7IC4uLnRoaXNbMF0sIGFycmF5OiB0cnVlIH1cbiAgICAgICAgICAgIGVsc2UgZmllbGRNb2RlbCA9IHsgdHlwZTogdGhpc1swXSwgYXJyYXk6IHRydWUgfVxuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGhpcz8udHlwZSkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUubGVuZ3RoID4gMSkgeyB0aHJvdyAoYEhleSwgeW91IGNhbid0IGhhdmUgbW9yZSB0aGFuIG9uZSBmaWVsZCBpbiB0aGUgYXJyYXkuIPCfmIJgKSB9XG4gICAgICAgICAgICBmaWVsZE1vZGVsID0geyAuLi50aGlzLCBhcnJheTogdHJ1ZSB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWVsZE1vZGVsID0gdGhpc1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpZWxkUHJvdG90eXBlID0ge31cbiAgICAgICAgT2JqZWN0LmFzc2lnbihmaWVsZFByb3RvdHlwZSwgZmllbGRNb2RlbClcblxuICAgICAgICBpZiAoZGF0YT8uYmVmb3JlQ3JlYXRlKSB7IGRhdGEuYmVmb3JlQ3JlYXRlLmJpbmQoZmllbGRQcm90b3R5cGUpKCkgfVxuXG4gICAgICAgIC8vIGlmIChkYXRhPy50cmFuc2xhdGVJbnB1dCkgeyBkYXRhLnRyYW5zbGF0ZUlucHV0LmJpbmQoZmllbGRQcm90b3R5cGUpIH1cbiAgICAgICAgLy8gTm90IHdvcmtpbmcgO1BcbiAgICAgICAgaWYgKGRhdGE/LnRyYW5zbGF0ZUlucHV0ICYmIGZpZWxkUHJvdG90eXBlLnRyYW5zbGF0ZUlucHV0KSB7XG5cbiAgICAgICAgICAgIGxldCBuZXdUcmFuc2xhdGVJbnB1dCA9IGRhdGEudHJhbnNsYXRlSW5wdXQuYmluZChmaWVsZFByb3RvdHlwZSlcbiAgICAgICAgICAgIGxldCBvcmlnaW5hbFRyYW5zbGF0ZUlucHV0ID0gZmllbGRQcm90b3R5cGUudHJhbnNsYXRlSW5wdXQuYmluZChmaWVsZFByb3RvdHlwZSlcblxuICAgICAgICAgICAgZGF0YS50cmFuc2xhdGVJbnB1dCA9IGFzeW5jIChpbnB1dCwgcmVxdWVzdCwgaW5kZXgsIHBhcmVudFZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBhd2FpdCBuZXdUcmFuc2xhdGVJbnB1dChpbnB1dCwgcmVxdWVzdCwgaW5kZXgsIHBhcmVudFZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBvcmlnaW5hbFRyYW5zbGF0ZUlucHV0KGlucHV0LCByZXF1ZXN0LCBpbmRleCwgcGFyZW50VmFsdWUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oZmllbGRQcm90b3R5cGUsIGRhdGEpXG5cbiAgICAgICAgaWYgKGZpZWxkTW9kZWw/LmJlZm9yZUNyZWF0ZSkgeyBmaWVsZE1vZGVsLmJlZm9yZUNyZWF0ZS5iaW5kKGZpZWxkUHJvdG90eXBlKSgpIH1cbiAgICAgICAgaWYgKGZpZWxkTW9kZWwuZGF0YSkgeyBPYmplY3QuYXNzaWduKGZpZWxkUHJvdG90eXBlLCBmaWVsZE1vZGVsLmRhdGEuYmluZChmaWVsZFByb3RvdHlwZSkoKSkgfVxuICAgICAgICBmaWVsZFByb3RvdHlwZS5fY3JlYXRlZCA9IHRydWVcblxuICAgICAgICAvLyBCcmluZyBpbiBmaWVsZCB0eXBlIGluZm8gKHR5cGUsIG5hbWUgZXRjLikgb3ZlcnJpZGRlbiBieSBsb2NhbCBkYXRhXG4gICAgICAgIGlmICh0eXBlb2YgKGZpZWxkUHJvdG90eXBlLnR5cGUpID09ICdvYmplY3QnKSBmaWVsZFByb3RvdHlwZSA9IHsgLi4uZmllbGRQcm90b3R5cGUudHlwZSwgLi4uZmllbGRQcm90b3R5cGUgfVxuXG4gICAgICAgIGZpZWxkUHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIGxldCBmaWVsZFByb3RvdHlwZSA9IHRoaXNcblxuICAgICAgICAgICAgbGV0IHsgY3JlYXRlU2NoZW1hLCB1cGRhdGVTY2hlbWEsIHR5cGVTY2hlbWEsIHF1ZXJ5U2NoZW1hIH0gPSByZWdpc3RlclN1YmZpZWxkcyhmaWVsZFByb3RvdHlwZSlcblxuICAgICAgICAgICAgZmllbGRQcm90b3R5cGUuX2NyZWF0ZVNjaGVtYSA9IGNyZWF0ZVNjaGVtYVxuICAgICAgICAgICAgZmllbGRQcm90b3R5cGUuX3VwZGF0ZVNjaGVtYSA9IHVwZGF0ZVNjaGVtYVxuICAgICAgICAgICAgZmllbGRQcm90b3R5cGUuX3R5cGVTY2hlbWEgPSB0eXBlU2NoZW1hXG4gICAgICAgICAgICBmaWVsZFByb3RvdHlwZS5fcXVlcnlTY2hlbWEgPSBxdWVyeVNjaGVtYVxuXG4gICAgICAgICAgICBpZiAoZmllbGRQcm90b3R5cGUuY3JlYXRlZCkgeyBmaWVsZFByb3RvdHlwZS5jcmVhdGVkLmJpbmQoZmllbGRQcm90b3R5cGUpKCkgfVxuXG4gICAgICAgICAgICBmaWVsZFByb3RvdHlwZS5fcHJvY2Vzc2VkID0gdHJ1ZVxuXG4gICAgICAgICAgICByZXR1cm4gZmllbGRQcm90b3R5cGVcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpZWxkUHJvdG90eXBlXG4gICAgfVxuXG4gICAgcmV0dXJuIChkYXRhKSA9PiBmaWVsZC5jcmVhdGUoZGF0YSlcblxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGaWVsZFxuIiwidmFyIG1hcCA9IHtcblx0XCIuL2FkZHJlc3MuanNcIjogXCIuL3NyYy9jbXMvMS4gYnVpbGQvZmllbGRzL2RlZmF1bHRGaWVsZHMvYWRkcmVzcy5qc1wiLFxuXHRcIi4vYWx0UmVsYXRpb25zaGlwLmpzXCI6IFwiLi9zcmMvY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL2FsdFJlbGF0aW9uc2hpcC5qc1wiLFxuXHRcIi4vYXNzZXQuanNcIjogXCIuL3NyYy9jbXMvMS4gYnVpbGQvZmllbGRzL2RlZmF1bHRGaWVsZHMvYXNzZXQuanNcIixcblx0XCIuL2N1c3RvbUZpZWxkLmpzXCI6IFwiLi9zcmMvY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL2N1c3RvbUZpZWxkLmpzXCIsXG5cdFwiLi9maWxlLmpzXCI6IFwiLi9zcmMvY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL2ZpbGUuanNcIixcblx0XCIuL2ltYWdlLmpzXCI6IFwiLi9zcmMvY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL2ltYWdlLmpzXCIsXG5cdFwiLi9wYXJlbnRzLmpzXCI6IFwiLi9zcmMvY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL3BhcmVudHMuanNcIixcblx0XCIuL3BsYWluVGV4dC5qc1wiOiBcIi4vc3JjL2Ntcy8xLiBidWlsZC9maWVsZHMvZGVmYXVsdEZpZWxkcy9wbGFpblRleHQuanNcIixcblx0XCIuL3JlbGF0aW9uc2hpcC5qc1wiOiBcIi4vc3JjL2Ntcy8xLiBidWlsZC9maWVsZHMvZGVmYXVsdEZpZWxkcy9yZWxhdGlvbnNoaXAuanNcIixcblx0XCIuL3JpY2hUZXh0LmpzXCI6IFwiLi9zcmMvY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL3JpY2hUZXh0LmpzXCIsXG5cdFwiLi9zZWxlY3QuanNcIjogXCIuL3NyYy9jbXMvMS4gYnVpbGQvZmllbGRzL2RlZmF1bHRGaWVsZHMvc2VsZWN0LmpzXCIsXG5cdFwiLi90aW1lc3RhbXAuanNcIjogXCIuL3NyYy9jbXMvMS4gYnVpbGQvZmllbGRzL2RlZmF1bHRGaWVsZHMvdGltZXN0YW1wLmpzXCIsXG5cdFwiLi90b2dnbGUuanNcIjogXCIuL3NyYy9jbXMvMS4gYnVpbGQvZmllbGRzL2RlZmF1bHRGaWVsZHMvdG9nZ2xlLmpzXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2Ntcy8xLiBidWlsZC9maWVsZHMvZGVmYXVsdEZpZWxkcyBzeW5jIHJlY3Vyc2l2ZSAuKlxcXFwuanMkXCI7IiwiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xuaW1wb3J0IHNldHRpbmdzIGZyb20gXCJAbWFuZ28vY29uZmlnL3NldHRpbmdzLmpzb25cIjtcblxubGV0IGdvb2dsZU1hcHNLZXkgPSBzZXR0aW5ncy5nb29nbGVNYXBzS2V5XG5cbi8vIGxldCBnZXRBZGRyZXNzQ29vcmRpbmF0ZXMgPSBhc3luYyBmdW5jdGlvbiAoYWRkcmVzcykge1xuLy8gICAgIGlmICghYWRkcmVzcykgcmV0dXJuIG51bGxcbi8vICAgICAvLyBjb25zb2xlLmxvZygnR2V0dGluZyBDb29yZHM6JywgYWRkcmVzcylcbi8vICAgICBhZGRyZXNzID0gZW5jb2RlVVJJKGAke2FkZHJlc3M/LnZlbnVlIHx8ICcnfSAke2FkZHJlc3MuYWRkcmVzcyB8fCAnJ30gJHthZGRyZXNzLmNpdHkgfHwgJyd9LCAke2FkZHJlc3Muc3RhdGUgfHwgJyd9ICR7YWRkcmVzcy56aXAgfHwgJyd9YClcbi8vICAgICBsZXQgZ29vZ2xlQWRkcmVzcyA9IGF3YWl0IGF4aW9zLmdldChgaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9hZGRyZXNzPSR7YWRkcmVzc30ma2V5PSR7Z29vZ2xlTWFwc0tleX1gKVxuLy8gICAgIGxldCBjb29yZHMgPSB7XG4vLyAgICAgICAgIGxhdDogZ29vZ2xlQWRkcmVzcz8uZGF0YT8ucmVzdWx0cz8uWzBdPy5nZW9tZXRyeT8ubG9jYXRpb24/LmxhdCxcbi8vICAgICAgICAgbG5nOiBnb29nbGVBZGRyZXNzPy5kYXRhPy5yZXN1bHRzPy5bMF0/Lmdlb21ldHJ5Py5sb2NhdGlvbj8ubG5nXG4vLyAgICAgfVxuLy8gICAgIC8vIGNvbnNvbGUubG9nKCdHb29nbGUgUmVzcG9uc2UgQ29vcmRzJywgY29vcmRzKVxuLy8gICAgIHJldHVybiBjb29yZHNcbi8vIH1cblxubGV0IHRyYW5zbGF0ZUlucHV0ID0gYXN5bmMgZnVuY3Rpb24gKGFkZHJlc3MpIHtcbiAgICBpZiAoIWFkZHJlc3MpIHJldHVybiBudWxsXG5cbiAgICAvLyBJZiB3ZSBhbHJlYWR5IGdvdCBhbGwgdGhpcyBpbmZvIGZyb20gdGhlIGZyb250ZW5kIGdlb2xvY2F0ZXJcbiAgICBpZiAoYWRkcmVzcy5pZCkgcmV0dXJuIGFkZHJlc3NcblxuICAgIC8vIElmIHRoaXMgd2FzIGFuIG9mZmxpbmUgb3IgbWFudWFsIGVudHJ5XG4gICAgYWRkcmVzcyA9IGVuY29kZVVSSShhZGRyZXNzKVxuICAgIGxldCBnb29nbGVBZGRyZXNzID0gYXdhaXQgYXhpb3MuZ2V0KGBodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2FkZHJlc3M9JHthZGRyZXNzfSZrZXk9JHtnb29nbGVNYXBzS2V5fWApXG4gICAgbGV0IHBsYWNlID0gZ29vZ2xlQWRkcmVzcz8uZGF0YT8ucmVzdWx0cz8uWzBdXG5cbiAgICBpZiAoIXBsYWNlKSByZXR1cm4gbnVsbFxuICAgIC8vIGNvbnNvbGUubG9nKCdwbGFjZScsIHBsYWNlLCBhZGRyZXNzKVxuXG4gICAgYWRkcmVzcyA9IHtcbiAgICAgICAgaWQ6IHBsYWNlPy5wbGFjZV9pZCB8fCBwbGFjZT8ucmVmZXJlbmNlIHx8IG51bGwsXG4gICAgICAgIGFkZHJlc3M6IHBsYWNlPy5hZGRyZXNzX2NvbXBvbmVudHM/LmZpbmQoYyA9PiBjPy50eXBlcz8uaW5jbHVkZXMoJ3N0cmVldF9udW1iZXInKSk/LmxvbmdfbmFtZSArICcgJyArIHBsYWNlPy5hZGRyZXNzX2NvbXBvbmVudHM/LmZpbmQoYyA9PiBjPy50eXBlcz8uaW5jbHVkZXMoJ3JvdXRlJykpPy5sb25nX25hbWUsXG4gICAgICAgIGNpdHk6IHBsYWNlPy5hZGRyZXNzX2NvbXBvbmVudHM/LmZpbmQoYyA9PiBjPy50eXBlcz8uaW5jbHVkZXMoJ2xvY2FsaXR5JykpPy5sb25nX25hbWUsXG4gICAgICAgIHN0YXRlOiBwbGFjZT8uYWRkcmVzc19jb21wb25lbnRzPy5maW5kKGMgPT4gYz8udHlwZXM/LmluY2x1ZGVzKCdhZG1pbmlzdHJhdGl2ZV9hcmVhX2xldmVsXzEnKSk/LmxvbmdfbmFtZSxcbiAgICAgICAgemlwOiBwbGFjZT8uYWRkcmVzc19jb21wb25lbnRzPy5maW5kKGMgPT4gYz8udHlwZXM/LmluY2x1ZGVzKCdwb3N0YWxfY29kZScpKT8ubG9uZ19uYW1lLFxuICAgICAgICBjb3VudHJ5OiBwbGFjZT8uYWRkcmVzc19jb21wb25lbnRzPy5maW5kKGMgPT4gYz8udHlwZXM/LmluY2x1ZGVzKCdjb3VudHJ5JykpPy5sb25nX25hbWUsXG4gICAgICAgIHJhdzogSlNPTi5zdHJpbmdpZnkocGxhY2UpLFxuICAgICAgICBmb3JtYXR0ZWQ6IHBsYWNlLmZvcm1hdHRlZF9hZGRyZXNzLFxuICAgICAgICBjb29yZGluYXRlczoge1xuICAgICAgICAgICAgbGF0OiBwbGFjZT8uZ2VvbWV0cnk/LmxvY2F0aW9uPy5sYXQsXG4gICAgICAgICAgICBsbmc6IHBsYWNlPy5nZW9tZXRyeT8ubG9jYXRpb24/LmxuZyxcbiAgICAgICAgfSxcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZygnR29vZ2xlIFJlc3BvbnNlIENvb3JkcycsIGNvb3JkcylcbiAgICByZXR1cm4gYWRkcmVzc1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogJ0FkZHJlc3MnLFxuICAgIGlucHV0VHlwZTogU3RyaW5nLFxuICAgIHNlYXJjaDogeyBlbmFibGVkOiB0cnVlLCB3ZWlnaHQ6IDUgfSxcbiAgICBmaWVsZHM6IHtcbiAgICAgICAgaWQ6IFN0cmluZyxcbiAgICAgICAgYWRkcmVzczogU3RyaW5nLFxuICAgICAgICBjaXR5OiBTdHJpbmcsXG4gICAgICAgIHN0YXRlOiBTdHJpbmcsXG4gICAgICAgIHppcDogU3RyaW5nLFxuICAgICAgICBjb3VudHJ5OiBTdHJpbmcsXG4gICAgICAgIHJhdzogU3RyaW5nLFxuICAgICAgICBmb3JtYXR0ZWQ6IFN0cmluZyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIGxhdDogeyB0eXBlOiAnRmxvYXQnIH0sXG4gICAgICAgICAgICAgICAgbG5nOiB7IHR5cGU6ICdGbG9hdCcgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHRyYW5zbGF0ZUlucHV0XG59XG4iLCJpbXBvcnQgeyBwcm9jZXNzUmVxdWVzdCB9IGZyb20gJy4uLy4uLy4uLzIuIHByb2Nlc3MvMC4gbWFpbidcbmltcG9ydCBjb2xsZWN0aW9ucyBmcm9tICcuLi8uLi9jb2xsZWN0aW9ucydcbmltcG9ydCBjcmVhdGVGaWVsZCBmcm9tICcuLi9jcmVhdGVGaWVsZCdcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRmllbGQoe1xuICAgIG5hbWU6ICdyZWxhdGlvbnNoaXAnLFxuICAgIGRhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiB0aGlzLnRpdGxlQ29sbGVjdGlvbixcbiAgICAgICAgICAgIGlucHV0VHlwZTogJ1N0cmluZycsXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGJlZm9yZUNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy50aXRsZUNvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb24uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLmNvbGxlY3Rpb24uc2xpY2UoMSlcbiAgICB9LFxuICAgIGFzeW5jIHRyYW5zbGF0ZUlucHV0KHZhbHVlLCByZXF1ZXN0KSB7XG5cbiAgICAgICAgbGV0IHsgY29sbGVjdGlvbiB9ID0gdGhpc1xuICAgICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbnMuZmluZChjID0+IGMuX3Npbmd1bGFyID09IGNvbGxlY3Rpb24pXG4gICAgICAgIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uLl9uYW1lXG5cbiAgICAgICAgbGV0IGlkID0gdmFsdWVcblxuICAgICAgICBsZXQgcmVsYXRpb25SZXF1ZXN0ID0gey4uLnJlcXVlc3QucmVxLCBtZXRob2Q6ICdyZWFkJywgcGF0aDogYC8ke2NvbGxlY3Rpb259LyR7aWR9YH1cbiAgICAgICAgbGV0IGRvY3VtZW50ID0gKGF3YWl0IHByb2Nlc3NSZXF1ZXN0KHJlbGF0aW9uUmVxdWVzdCkpPy5yZXNwb25zZVxuXG4gICAgICAgIHJldHVybiBkb2N1bWVudD8uaWQgfHwgbnVsbFxuXG4gICAgfSxcbiAgICBhc3luYyB0cmFuc2xhdGVPdXRwdXQodmFsdWUsIHJlcXVlc3QsIGRvY3VtZW50KSB7XG5cbiAgICAgICAgbGV0IHsgY29sbGVjdGlvbiB9ID0gdGhpc1xuICAgICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbnMuZmluZChjID0+IGMuX3Npbmd1bGFyID09IGNvbGxlY3Rpb24pXG4gICAgICAgIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uLl9uYW1lXG5cbiAgICAgICAgbGV0IHBhcmVudHMgPSBbLi4ucmVxdWVzdC5wYXJlbnRzLCBkb2N1bWVudF1cblxuICAgICAgICBsZXQgaWQgPSB2YWx1ZVxuXG4gICAgICAgIGxldCByZWxhdGlvblJlcXVlc3QgPSB7Li4ucmVxdWVzdC5yZXEsIG1ldGhvZDogJ3JlYWQnLCBwYXRoOiBgLyR7Y29sbGVjdGlvbn0vJHtpZH1gfVxuICAgICAgICBsZXQgcmVsYXRlZERvY3VtZW50ID0gKGF3YWl0IHByb2Nlc3NSZXF1ZXN0KHJlbGF0aW9uUmVxdWVzdCkpPy5yZXNwb25zZVxuICAgICAgICBsZXQgaWRlbnRpY2FsUGFyZW50ID0gcGFyZW50cy5maW5kKGVudHJ5ID0+IGVudHJ5LmlkID09IGlkKVxuXG4gICAgICAgIGlmIChpZGVudGljYWxQYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAocmVxdWVzdC5hcGlNZXRob2QgPT0gJ2dyYXBocWwnKSA/IGlkZW50aWNhbFBhcmVudCA6IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWxhdGVkRG9jdW1lbnQgfHwgbnVsbFxuXG4gICAgfVxufSlcbiIsImltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB7IHByb2Nlc3NSZXF1ZXN0IH0gZnJvbSAnLi4vLi4vLi4vMi4gcHJvY2Vzcy8wLiBtYWluJ1xuaW1wb3J0IHVwbG9hZCBmcm9tICdAY21zLzEuIGJ1aWxkL2hlbHBlcnMvdXBsb2FkJ1xuaW1wb3J0IGRvd25sb2FkIGZyb20gJ0BjbXMvMS4gYnVpbGQvaGVscGVycy9kb3dubG9hZCdcbmltcG9ydCBjcmVhdGVGaWVsZCBmcm9tICcuLi9jcmVhdGVGaWVsZCdcbmltcG9ydCAqIGFzIHN0cmVhbSBmcm9tICdzdHJlYW0nXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJ1xuaW1wb3J0IHsgdXBkYXRlRW50cnkgfSBmcm9tICcuLi8uLi9saWJyYXJpZXMvbW9uZ28nXG5pbXBvcnQgc2V0dGluZ3MgZnJvbSBcIkBtYW5nby9jb25maWcvc2V0dGluZ3MuanNvblwiO1xuXG4vLyBUaGlzIGlzIG5lZWRlZCB0byByZXBsYWNlIHZhcmlhYmxlcyBpbiBhIGN1c3RvbSBzcGVjaWZpZWQgcGF0aCAoc2VlIGNvbmZpZy9jb2xsZWN0aW9ucy9zZXJtb25zLmpzKVxuT2JqZWN0LmJ5U3RyaW5nID0gZnVuY3Rpb24gKG8sIHMpIHtcbiAgICBzID0gcy5yZXBsYWNlKC9cXFsoXFx3KylcXF0vZywgJy4kMScpIC8vIGNvbnZlcnQgaW5kZXhlcyB0byBwcm9wZXJ0aWVzXG4gICAgcyA9IHMucmVwbGFjZSgvXlxcLi8sICcnKSAvLyBzdHJpcCBhIGxlYWRpbmcgZG90XG4gICAgdmFyIGEgPSBzLnNwbGl0KCcuJylcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGEubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIHZhciBrID0gYVtpXVxuICAgICAgICBpZiAoayBpbiBvKSB7XG4gICAgICAgICAgICBvID0gb1trXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9cbn1cblxuY29uc3QgZmluaXNoZWQgPSBwcm9taXNpZnkoc3RyZWFtLmZpbmlzaGVkKVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGaWVsZCh7XG5cbiAgICBuYW1lOiAnYXNzZXQnLFxuICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgIGlucHV0VHlwZTogJ1N0cmluZycsXG5cbiAgICBhc3luYyB1cGxvYWQoeyB2YWx1ZSwgaWQsIHJlcSwgcmVtb3RlVXJsLCBkb2N1bWVudCwgaW5kZXgsIHBhcmVudFZhbHVlIH0pIHtcbiAgICAgICAgbGV0IGZpZWxkRGF0YSwgZmlsZU5hbWUsIGZpbGUsIHRlbXBQYXRoXG5cbiAgICAgICAgLy8gSWYgYSByZW1vdGUgZmlsZSBpcyBwYXNzZWQsIGdldCB0aGUgZmlsZS4uLiBlbHNlIHVzZSB0aGUgdXBsb2FkZWQgZmlsZVxuICAgICAgICBpZiAocmVtb3RlVXJsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVtb3RlVXJsJywgcmVtb3RlVXJsKVxuICAgICAgICAgICAgbGV0IHVybFBhcnRzID0gcmVtb3RlVXJsLnNwbGl0KCcvJylcbiAgICAgICAgICAgIGZpbGVOYW1lID0gdXJsUGFydHNbdXJsUGFydHMubGVuZ3RoIC0gMV0uc3BsaXQoJz8nKVswXVxuICAgICAgICAgICAgdGVtcFBhdGggPSBgdG1wLyR7aWR9LyR7ZmlsZU5hbWV9YFxuICAgICAgICAgICAgYXdhaXQgZG93bmxvYWQocmVtb3RlVXJsLCB0ZW1wUGF0aClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRlbXBQYXRoID0gdmFsdWUuZmlsZS5wYXRoXG4gICAgICAgICAgICBmaWxlTmFtZSA9IHZhbHVlLmZpbGUubmFtZVxuICAgICAgICB9XG5cbiAgICAgICAgZmlsZSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGVtcFBhdGgpXG4gICAgICAgIGxldCBleHRlbnNpb24gPSBmaWxlTmFtZS5zcGxpdCgnLicpW2ZpbGVOYW1lLnNwbGl0KCcuJykubGVuZ3RoIC0gMV0uc3BsaXQoJz8nKVswXVxuXG4gICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUZpbGUpIHtcbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1lZCA9IGF3YWl0IHRoaXMudHJhbnNmb3JtRmlsZSh7XG4gICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgdGVtcFBhdGgsXG4gICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICBmaWxlTmFtZSxcbiAgICAgICAgICAgICAgICBleHRlbnNpb24sXG4gICAgICAgICAgICAgICAgcmVtb3RlVXJsLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGZpZWxkRGF0YSA9IHRyYW5zZm9ybWVkLmZpZWxkRGF0YVxuICAgICAgICAgICAgZXh0ZW5zaW9uID0gdHJhbnNmb3JtZWQuZXh0ZW5zaW9uXG4gICAgICAgICAgICBmaWxlID0gdHJhbnNmb3JtZWQuZmlsZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhdGggPSBgJHtzZXR0aW5ncy5zM0J1Y2tldH0vYXNzZXRzLyR7dGhpcy5fY29sbGVjdGlvbn0vJHtpZH1gXG5cbiAgICAgICAgLypcblxuICAgICAgICBUaGlzIGFsbG93cyBmb3IgYSBjdXN0b20gcGF0aC9maWxlbmFtZVxuXG4gICAgICAgICovXG5cbiAgICAgICAgaWYgKHRoaXMucGF0aCkge1xuICAgICAgICAgICAgcGF0aCA9IHRoaXMucGF0aFxuICAgICAgICAgICAgaWYgKHR5cGVvZiAocGF0aCkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aCh7IGRvY3VtZW50LCBpbmRleCwgZmlsZU5hbWUsIHBhdGggfSlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGF0aC5pbmNsdWRlcygnOicpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBhcnRzID0gcGF0aC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgcGFydHMgPSBwYXJ0cy5tYXAoKHApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHAuaW5jbHVkZXMoJzonKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0cmluZ01hcCA9IHAucmVwbGFjZSgnOicsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5ieVN0cmluZyhkb2N1bWVudCwgc3RyaW5nTWFwKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhcnRzLmpvaW4oJy8nKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpbGVuYW1lID0gYCR7dGhpcy5fbmFtZX0uJHtleHRlbnNpb259YFxuXG4gICAgICAgIC8vIEhhbmRsZSBBcnJheSBpbXBsZW1lbnRhdGlvblxuICAgICAgICBpZiAodGhpcy5hcnJheSkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ0FSUkFZJylcbiAgICAgICAgICAgIGZpbGVuYW1lID0gYCR7dGhpcy5fbmFtZX0tJHtpbmRleH0uJHtleHRlbnNpb259YFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRE9DVU1FTlQgVEhJU1xuICAgICAgICBpZiAodGhpcy5maWxlbmFtZSkge1xuICAgICAgICAgICAgZmlsZW5hbWUgPSB0aGlzLmZpbGVuYW1lXG4gICAgICAgICAgICBpZiAodHlwZW9mIChmaWxlbmFtZSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lKHsgZG9jdW1lbnQsIGluZGV4LCBwYXJlbnRWYWx1ZSwgZmlsZU5hbWUgfSlcbiAgICAgICAgICAgICAgICBmaWxlbmFtZSArPSBgLiR7ZXh0ZW5zaW9ufWBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZW5hbWUuaW5jbHVkZXMoJzonKSkge1xuICAgICAgICAgICAgICAgIGxldCBzdHJpbmdNYXAgPSBmaWxlbmFtZS5yZXBsYWNlKCc6JywgJycpXG4gICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBgJHtPYmplY3QuYnlTdHJpbmcoZG9jdW1lbnQsIHN0cmluZ01hcCl9LiR7ZXh0ZW5zaW9ufWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG5cbiAgICAgICAgVGhpcyBhbGxvd3MgZm9yIGEgY3VzdG9tIHBhdGgvZmlsZW5hbWVcblxuICAgICAgICAqL1xuXG4gICAgICAgIGxldCB1cmwgPSBhd2FpdCB1cGxvYWQoeyBwYXRoLCBmaWxlbmFtZSwgZmlsZSB9KVxuICAgICAgICB1cmwgKz0gYD91cGRhdGVkPSR7RGF0ZS5ub3coKX1gXG4gICAgICAgIC8vIGZzLnJtKGB0bXAvJHtpZH0vYCwgeyByZWN1cnNpdmU6IHRydWUgfSwgKCkgPT4gbnVsbClcblxuICAgICAgICBsZXQgZmllbGRWYWx1ZSA9IGZpZWxkRGF0YSA/IHsgLi4uZmllbGREYXRhLCB1cmwgfSA6IHVybFxuXG4gICAgICAgIC8vIElmIGl0J3MgYSBmaWxlIHVwbG9hZCBmcm9tIHRoZSBhc3NldHMgZW5kcG9pbnRcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgZG9jdW1lbnQgPSB7IGlkIH1cbiAgICAgICAgICAgIGRvY3VtZW50W3RoaXMuX25hbWVdID0gZmllbGRWYWx1ZVxuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7IHVzZXI6IHJlcS5oZWFkZXJzLnVzZXIgfSxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICd1cGRhdGUnLFxuICAgICAgICAgICAgICAgIHBhdGg6IGAvJHt0aGlzLl9jb2xsZWN0aW9ufS8ke2lkfWAsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgcHJvY2Vzc1JlcXVlc3QocGFyYW1zKVxuXG4gICAgICAgICAgICAvLyBJZiBpdCdzIGEgVVJMIGNvbWluZyBmcm9tIHRoaXMudHJhbnNsYXRlSW5wdXRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZFZhbHVlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYXN5bmMgdHJhbnNsYXRlSW5wdXQoaW5wdXQsIHsgcmVxdWVzdCwgaW5kZXgsIHBhcmVudFZhbHVlIH0pIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3J1bm5pbmcgYXNzZXQgdHJhbnNsYXRpb24nLCBpbnB1dClcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3J1bm5pbmcgYXNzZXQgdHJhbnNsYXRlIGlucHV0JywgaW5wdXQpXG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT0gJ29iamVjdCcpIHJldHVybiBpbnB1dFxuXG4gICAgICAgIC8qXG5cbiAgICAgICAgICAgIFRoaXMgbmVlZHMgdG8gYmUgZG9uZSBkaWZmZXJlbnRseSB3aGVuIGNyZWF0aW5nIGJlY2F1c2UgYXQgdGhlIHRpbWVcbiAgICAgICAgICAgIG9mIHRyYW5zbGF0ZUlucHV0LCB0aGUgZG9jdW1lbnQgd29uJ3QgZXhpc3QgYW5kIHNvIHdlIHdvbid0IGJlIGFibGUgdG9cbiAgICAgICAgICAgIHBhc3MgdGhlIElEIG9mIHRoZSBkb2N1bWVudCB0byB0aGUgdXBsb2FkIGZ1bmN0aW9uXG5cbiAgICAgICAgICAgICoqKiBQUk9CTEVNICoqKlxuXG4gICAgICAgICAgICBUaGUgd2F5IHRoaXMgaXMgYmVpbmcgaGFuZGxlZCBrZWVwcyB1cyBmcm9tIHVzaW5nIGFuIGFzc2V0IGFzIGEgc3ViZmllbGQsXG4gICAgICAgICAgICB0aGlzIG1ldGhvZCB3aWxsIGFsd2F5cyBhcHBseSB0aGUgZmllbGQgdG8gdGhlIHRvcCBsZXZlbCBvZiB0aGUgZG9jdW1lbnQuXG5cbiAgICAgICAgKi9cbiAgICAgICAgaWYgKHJlcXVlc3QubWV0aG9kID09ICdjcmVhdGUnKSB7XG5cbiAgICAgICAgICAgIGlmICghcmVxdWVzdC5xdWV1ZSkgcmVxdWVzdC5xdWV1ZSA9IHt9XG4gICAgICAgICAgICBpZiAoIXJlcXVlc3QucXVldWUuY3JlYXRlZCkgcmVxdWVzdC5xdWV1ZS5jcmVhdGVkID0gW11cblxuICAgICAgICAgICAgLy8gUXVldWUgdGhlIHVwbG9hZCB0byBTM1xuICAgICAgICAgICAgbGV0IHVwbG9hZFRvUzMgPSBhc3luYyAoZG9jdW1lbnQpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCB7IGlkIH0gPSBkb2N1bWVudFxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IEFycmF5LmlzQXJyYXkoZG9jdW1lbnRbdGhpcy5fbmFtZV0pID8gZG9jdW1lbnRbdGhpcy5fbmFtZV0/LmZpbmRJbmRleChpID0+IGkgPT0gaW5wdXQpIHx8IDAgOiAwXG4gICAgICAgICAgICAgICAgbGV0IHByb2Nlc3NlZEZpZWxkID0gYXdhaXQgdGhpcy51cGxvYWQoe1xuICAgICAgICAgICAgICAgICAgICByZW1vdGVVcmw6IGlucHV0LFxuICAgICAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAgICAgcmVxOiByZXF1ZXN0LFxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudCxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFZhbHVlXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGxldCBuZXdEb2N1bWVudCA9IHt9XG4gICAgICAgICAgICAgICAgbmV3RG9jdW1lbnRbdGhpcy5fbmFtZV0gPSBkb2N1bWVudFt0aGlzLl9uYW1lXVxuXG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZG9jdW1lbnRbdGhpcy5fbmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0RvY3VtZW50W3RoaXMuX25hbWVdW2luZGV4XSA9IHByb2Nlc3NlZEZpZWxkXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50W3RoaXMuX25hbWVdW2luZGV4XSA9IHByb2Nlc3NlZEZpZWxkXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3RG9jdW1lbnRbdGhpcy5fbmFtZV0gPSBwcm9jZXNzZWRGaWVsZFxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudFt0aGlzLl9uYW1lXSA9IHByb2Nlc3NlZEZpZWxkXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYXdhaXQgdXBkYXRlRW50cnkoe1xuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLl9jb2xsZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IHsgaWQgfSxcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQ6IG5ld0RvY3VtZW50LFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0LnF1ZXVlLmNyZWF0ZWQucHVzaCh1cGxvYWRUb1MzKVxuXG4gICAgICAgICAgICAvLyAvLyBVcGxvYWQgYXNzZXRzIGFmdGVyIHRoZSBkb2N1bWVudCBpcyBjcmVhdGVkXG4gICAgICAgICAgICAvLyBsZXQgdXBsb2FkQXNzZXRzVG9DcmVhdGVkRG9jdW1lbnQgPSBhc3luYyAoZG9jdW1lbnQpID0+IHtcbiAgICAgICAgICAgIC8vICAgICBkZWxldGUgZG9jdW1lbnQuX2lkXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ29yaWdpbmFsRG9jdW1lbnQnLCByZXF1ZXN0LmRvY3VtZW50KVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdpbnB1dCcsIGlucHV0KVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdgLyR7ZG9jdW1lbnQuY29sbGVjdGlvbn0vJHtkb2N1bWVudC5pZH1gJywgYC8ke2RvY3VtZW50LmNvbGxlY3Rpb259LyR7ZG9jdW1lbnQuaWR9YClcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygncmVxdWVzdC5tZW1iZXI/LmlkICcsIHJlcXVlc3QubWVtYmVyPy5pZClcbiAgICAgICAgICAgIC8vICAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICAgICAgLy8gICAgICAgICBoZWFkZXJzOiB7IHVzZXI6IHJlcXVlc3QubWVtYmVyPy5pZCB9LFxuICAgICAgICAgICAgLy8gICAgICAgICBtZXRob2Q6ICd1cGRhdGUnLFxuICAgICAgICAgICAgLy8gICAgICAgICBwYXRoOiBgLyR7ZG9jdW1lbnQuY29sbGVjdGlvbn0vJHtkb2N1bWVudC5pZH1gLFxuICAgICAgICAgICAgLy8gICAgICAgICBkb2N1bWVudDogeyAuLi5pbnB1dCB9LFxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICAgICAvLyByZXR1cm4gYXdhaXQgcHJvY2Vzc1JlcXVlc3QocGFyYW1zKVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gcmVxdWVzdC5xdWV1ZS5jcmVhdGVkLnB1c2godXBsb2FkQXNzZXRzVG9DcmVhdGVkRG9jdW1lbnQpXG5cbiAgICAgICAgICAgIHJldHVybiBpbnB1dFxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHsgb3JpZ2luYWxEb2N1bWVudCwgaWQgfSA9IHJlcXVlc3RcbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBVUkwgcGFzc2VkIGlzIHRoZSBzYW1lIGFzIHRoZSBzdG9yZWQgVVJMXG4gICAgICAgIGlmIChpbnB1dCA9PSBvcmlnaW5hbERvY3VtZW50Py5bdGhpcy5fbmFtZV0gfHwgaW5wdXQgPT0gbnVsbCkgcmV0dXJuIGlucHV0XG5cbiAgICAgICAgbGV0IHByb2Nlc3NlZEZpZWxkID0gYXdhaXQgdGhpcy51cGxvYWQoe1xuICAgICAgICAgICAgcmVtb3RlVXJsOiBpbnB1dCxcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgcmVxOiByZXF1ZXN0LFxuICAgICAgICAgICAgZG9jdW1lbnQ6IG9yaWdpbmFsRG9jdW1lbnQsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIHBhcmVudFZhbHVlXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHByb2Nlc3NlZEZpZWxkXG4gICAgfSxcbn0pXG4iLCJleHBvcnQgZGVmYXVsdCB7XG5cbiAgICB0eXBlOiAnU3RyaW5nJyxcblxufVxuIiwiaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IGNyZWF0ZUZpZWxkIGZyb20gJ0BjbXMvMS4gYnVpbGQvZmllbGRzL2NyZWF0ZUZpZWxkJ1xuaW1wb3J0IEFzc2V0IGZyb20gJ0BjbXMvMS4gYnVpbGQvZmllbGRzL2RlZmF1bHRGaWVsZHMvYXNzZXQnXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZpZWxkKEFzc2V0KHtcbiAgICB0eXBlOiAnRmlsZScsXG4gICAgbmFtZTogJ2ZpbGUnLFxuXG4gICAgZmllbGRzOiB7XG4gICAgICAgIGZpbGVuYW1lOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgICAgIHNpemU6IHsgdHlwZTogJ0ludCcgfSxcbiAgICAgICAgbWltZXR5cGU6IHsgdHlwZTogJ1N0cmluZycgfSxcbiAgICAgICAgZXh0ZW5zaW9uOiB7IHR5cGU6ICdTdHJpbmcnIH0sXG4gICAgICAgIHVybDoge30sXG4gICAgfSxcblxuICAgIGFzeW5jIHRyYW5zZm9ybUZpbGUoeyB2YWx1ZSwgZmlsZSwgZXh0ZW5zaW9uLCB0ZW1wUGF0aCwgcmVtb3RlVXJsIH0pIHtcbiAgICAgICAgY29uc3Qgc3RhdHMgPSBhd2FpdCBmcy5wcm9taXNlcy5zdGF0KHRlbXBQYXRoKVxuICAgICAgICBjb25zdCBtaW1ldHlwZSA9IHZhbHVlPy5maWxlPy5taW1ldHlwZSB8fCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgICAgICBsZXQgZmlsZW5hbWUgPSB2YWx1ZT8uZmlsZT8ubmFtZSB8fCB0ZW1wUGF0aC5zcGxpdCgnLycpLnBvcCgpXG4gICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUuc3BsaXQoJy0tLS0tJylbMF0gKyAnLicgKyBleHRlbnNpb25cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZmlsZTogYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUodGVtcFBhdGgpLFxuICAgICAgICAgICAgZXh0ZW5zaW9uLFxuICAgICAgICAgICAgZmllbGREYXRhOiB7XG4gICAgICAgICAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgICAgICAgc2l6ZTogc3RhdHMuc2l6ZSxcbiAgICAgICAgICAgICAgICBtaW1ldHlwZSxcbiAgICAgICAgICAgICAgICBleHRlbnNpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59KSlcbiIsImltcG9ydCBzaGFycCBmcm9tICdzaGFycCdcbmltcG9ydCBjcmVhdGVGaWVsZCBmcm9tICdAY21zLzEuIGJ1aWxkL2ZpZWxkcy9jcmVhdGVGaWVsZCdcbmltcG9ydCBBc3NldCBmcm9tICdAY21zLzEuIGJ1aWxkL2ZpZWxkcy9kZWZhdWx0RmllbGRzL2Fzc2V0J1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGaWVsZChBc3NldCh7XG5cbiAgICB0eXBlOiAnSW1hZ2UnLFxuICAgIG5hbWU6ICdpbWFnZScsXG5cbiAgICBmaWVsZHM6IHtcbiAgICAgICAgd2lkdGg6IHsgdHlwZTogJ0ludCcgfSxcbiAgICAgICAgaGVpZ2h0OiB7IHR5cGU6ICdJbnQnIH0sXG4gICAgICAgIHVybDoge30sXG4gICAgfSxcblxuICAgIGFzeW5jIHRyYW5zZm9ybUZpbGUoeyB2YWx1ZSwgZmlsZSwgZXh0ZW5zaW9uLCB0ZW1wUGF0aCwgcmVtb3RlVXJsIH0pIHtcblxuICAgICAgICBpZiAoZXh0ZW5zaW9uID09ICdwbmcnKSB7XG4gICAgICAgICAgICBsZXQgbmV3RmlsZSA9IGF3YWl0IHNoYXJwKHRlbXBQYXRoKVxuICAgICAgICAgICAgICAgIC53aXRoTWV0YWRhdGEoKSAgICAvLyBUaGlzIGVuc3VyZXMgdGhhdCBtZXRhZGF0YSAoaW5jbHVkaW5nIEVYSUYgb3JpZW50YXRpb24pIGlzIGtlcHRcbiAgICAgICAgICAgICAgICAucm90YXRlKCkgICAgICAgICAgLy8gVGhpcyBhcHBsaWVzIHRoZSBFWElGIG9yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgLnJlc2l6ZShcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHsgd2l0aG91dEVubGFyZ2VtZW50OiB0cnVlIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLnBuZyh7XG4gICAgICAgICAgICAgICAgICAgIHF1YWxpdHk6IHRoaXMucXVhbGl0eSB8fCA4MCxcbiAgICAgICAgICAgICAgICAgICAgb3B0aW1pc2VDb2Rpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG9wdGltaXNlU2NhbnM6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50b0J1ZmZlcih7IHJlc29sdmVXaXRoT2JqZWN0OiB0cnVlIH0pXG5cbiAgICAgICAgICAgIC8vIGxldCB7d2lkdGgsIGhlaWdodH0gPSBhd2FpdCBuZXdGaWxlLm1ldGFkYXRhKClcbiAgICAgICAgICAgIGxldCB7IHdpZHRoLCBoZWlnaHQgfSA9IG5ld0ZpbGUuaW5mb1xuICAgICAgICAgICAgZXh0ZW5zaW9uID0gJ3BuZydcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmaWxlOiBuZXdGaWxlLmRhdGEsXG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uLFxuICAgICAgICAgICAgICAgIGZpZWxkRGF0YToge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbmV3RmlsZSA9IGF3YWl0IHNoYXJwKHRlbXBQYXRoKVxuICAgICAgICAgICAgICAgIC53aXRoTWV0YWRhdGEoKSAgICAvLyBUaGlzIGVuc3VyZXMgdGhhdCBtZXRhZGF0YSAoaW5jbHVkaW5nIEVYSUYgb3JpZW50YXRpb24pIGlzIGtlcHRcbiAgICAgICAgICAgICAgICAucm90YXRlKCkgICAgICAgICAgLy8gVGhpcyBhcHBsaWVzIHRoZSBFWElGIG9yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgLnJlc2l6ZShcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHsgd2l0aG91dEVubGFyZ2VtZW50OiB0cnVlIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLmpwZWcoe1xuICAgICAgICAgICAgICAgICAgICBxdWFsaXR5OiB0aGlzLnF1YWxpdHkgfHwgODAsXG4gICAgICAgICAgICAgICAgICAgIG9wdGltaXNlQ29kaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBvcHRpbWlzZVNjYW5zOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudG9CdWZmZXIoeyByZXNvbHZlV2l0aE9iamVjdDogdHJ1ZSB9KVxuXG4gICAgICAgICAgICAvLyBsZXQge3dpZHRoLCBoZWlnaHR9ID0gYXdhaXQgbmV3RmlsZS5tZXRhZGF0YSgpXG4gICAgICAgICAgICBsZXQgeyB3aWR0aCwgaGVpZ2h0IH0gPSBuZXdGaWxlLmluZm9cbiAgICAgICAgICAgIGV4dGVuc2lvbiA9ICdqcGcnXG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZmlsZTogbmV3RmlsZS5kYXRhLFxuICAgICAgICAgICAgICAgIGV4dGVuc2lvbixcbiAgICAgICAgICAgICAgICBmaWVsZERhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSxcblxufSkpXG4iLCJpbXBvcnQgeyByZWFkRW50cmllcyB9IGZyb20gJy4uLy4uLy4uLzEuIGJ1aWxkL2xpYnJhcmllcy9tb25nbydcbmltcG9ydCBjb2xsZWN0aW9ucyBmcm9tICcuLi8uLi9jb2xsZWN0aW9ucydcbmltcG9ydCBjcmVhdGVGaWVsZCBmcm9tICcuLi9jcmVhdGVGaWVsZCdcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRmllbGQoe1xuICAgIC8vIG5hbWU6ICdyZWxhdGlvbnNoaXAnLFxuICAgIGRhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBgWyR7dGhpcy50aXRsZUNvbGxlY3Rpb259XWAsXG4gICAgICAgICAgICBpbnB1dFR5cGU6ICdTdHJpbmcnLFxuICAgICAgICB9XG4gICAgfSxcbiAgICBiZWZvcmVDcmVhdGUoKSB7XG4gICAgICAgIHRoaXMudGl0bGVDb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5jb2xsZWN0aW9uLnNsaWNlKDEpXG4gICAgfSxcbiAgICBleHBpcmVDYWNoZTogMCxcbiAgICBhc3luYyBjb21wdXRlZChkb2N1bWVudCwgcmVxdWVzdCkge1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBHZXR0aW5nIFBhcmVudGApXG5cbiAgICAgICAgaWYgKHJlcXVlc3QuZmV0Y2hpbmdQYXJlbnQpIHJldHVybiBudWxsXG4gICAgICAgIGlmIChyZXF1ZXN0LnJlbGF0ZWREZXB0aCkgcmV0dXJuIG51bGxcblxuICAgICAgICBsZXQgcGFyZW50cyA9IHJlcXVlc3QucGFyZW50c1xuICAgICAgICBwYXJlbnRzLnB1c2goZG9jdW1lbnQpXG5cbiAgICAgICAgbGV0IHsgY29sbGVjdGlvbiB9ID0gdGhpc1xuICAgICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbnMuZmluZChjID0+IGMuX3Npbmd1bGFyID09IGNvbGxlY3Rpb24pXG4gICAgICAgIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uLl9uYW1lXG5cbiAgICAgICAgY29uc29sZS5sb2coYEdldHRpbmcgJHt0aGlzLmNvbGxlY3Rpb259IFBhcmVudGAsIHBhcmVudHMubWFwKHAgPT4gcC50aXRsZSkpXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSk7XG5cbiAgICAgICAgbGV0IHsgaWQgfSA9IGRvY3VtZW50XG4gICAgICAgIC8vIGxldCBzZWFyY2ggPSB7fVxuICAgICAgICAvLyBzZWFyY2hbdGhpcy5maWVsZF0gPSB7ICRpbjogW2lkXSB9XG5cbiAgICAgICAgLy8gbGV0IHNlYXJjaCA9IHsgd2hlcmU6IGB0aGlzLiR7dGhpcy5maWVsZH0gJiYgdGhpcy4ke3RoaXMuZmllbGR9Lmxlbmd0aCAmJiB0aGlzLiR7dGhpcy5maWVsZH0uaW5jbHVkZXMoXCIke2lkfVwiKWAgfVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzZWFyY2gnLCBzZWFyY2gpXG5cbiAgICAgICAgLy8gbGV0IHJlbGF0aW9uUmVxdWVzdCA9IHsgLi4ucmVxdWVzdC5yZXEsIHBhcmVudHMsIGZpZWxkczogWyd0aXRsZScsICdpZCddLCBtZXRob2Q6ICdyZWFkJywgcGF0aDogYC8ke2NvbGxlY3Rpb259YCwgYm9keTogeyBzZWFyY2ggfSwgZmV0Y2hpbmdQYXJlbnQ6IHsgZmllbGQ6IHRoaXMuZmllbGQsIGNvbGxlY3Rpb24gfSB9XG4gICAgICAgIC8vIGxldCByZWxhdGVkRG9jdW1lbnRzID0gKGF3YWl0IHByb2Nlc3NSZXF1ZXN0KHJlbGF0aW9uUmVxdWVzdCkpPy5yZXNwb25zZVxuXG4gICAgICAgIGxldCBzZWFyY2ggPSB7IGNvbGxlY3Rpb24sIHNlYXJjaDoge30sIGZpZWxkczogWyd0aXRsZScsICdpZCddIH1cbiAgICAgICAgc2VhcmNoLnNlYXJjaFt0aGlzLmZpZWxkXSA9IGlkXG4gICAgICAgIGNvbnNvbGUubG9nKCdwIHNlYXJjaCcsIHNlYXJjaClcbiAgICAgICAgbGV0IHJlbGF0ZWREb2N1bWVudHMgPSBhd2FpdCByZWFkRW50cmllcyhzZWFyY2gpXG4gICAgICAgIHJlbGF0ZWREb2N1bWVudHMgPSByZWxhdGVkRG9jdW1lbnRzLm1hcChkID0+IGQuaWQpXG5cbiAgICAgICAgY29uc29sZS5sb2coJ3JlbGF0ZWREb2N1bWVudHMnLCByZWxhdGVkRG9jdW1lbnRzKVxuXG4gICAgICAgIHJldHVybiB0aGlzLnNpbmdsZSA/IHJlbGF0ZWREb2N1bWVudHM/LlswXSA6IHJlbGF0ZWREb2N1bWVudHNcblxuICAgIH0sXG59KVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgdHlwZTogJ1N0cmluZycsXG5cbn1cbiIsImltcG9ydCB7IHJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCB7IHByb2Nlc3NSZXF1ZXN0IH0gZnJvbSAnLi4vLi4vLi4vMi4gcHJvY2Vzcy8wLiBtYWluJ1xuaW1wb3J0IGNvbGxlY3Rpb25zIGZyb20gJy4uLy4uL2NvbGxlY3Rpb25zJ1xuaW1wb3J0IGNyZWF0ZUZpZWxkIGZyb20gJy4uL2NyZWF0ZUZpZWxkJ1xuY29uc3QgeyBGb3JiaWRkZW5FcnJvciwgVmFsaWRhdGlvbkVycm9yIH0gPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIpO1xuXG4vLyBpbXBvcnQgUmVsYXRpb25zaGlwVnVlIGZyb20gJy4vUmVsYXRpb25zaGlwLnZ1ZSdcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRmllbGQoe1xuICAgIG5hbWU6ICdyZWxhdGlvbnNoaXAnLFxuICAgIGRlZmF1bHQ6IFtdLFxuICAgIGRhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyB0aXRsZUNvbGxlY3Rpb246IHRoaXMuY29sbGVjdGlvbi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRoaXMuY29sbGVjdGlvbi5zbGljZSgxKSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMuc2luZ2xlID8gdGhpcy50aXRsZUNvbGxlY3Rpb24gOiBgWyR7dGhpcy50aXRsZUNvbGxlY3Rpb259XWAsXG4gICAgICAgICAgICBpbnB1dFR5cGU6IHRoaXMuc2luZ2xlID8gJ1N0cmluZycgOiAnW1N0cmluZ10nLFxuICAgICAgICAgICAgbGltaXQ6IHRoaXMuc2luZ2xlID8gMSA6IHRoaXMubGltaXRcbiAgICAgICAgfVxuICAgIH0sXG4gICAgYmVmb3JlQ3JlYXRlKCkge1xuICAgICAgICB0aGlzLnRpdGxlQ29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRoaXMuY29sbGVjdGlvbi5zbGljZSgxKVxuICAgIH0sXG4gICAgYXN5bmMgdHJhbnNsYXRlSW5wdXQodmFsdWUsIHsgcmVxdWVzdCB9KSB7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3ZhbHVlJywgdmFsdWUpXG5cbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIFtdXG5cbiAgICAgICAgbGV0IHsgY29sbGVjdGlvbiB9ID0gdGhpc1xuICAgICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbnMuZmluZChjID0+IGMuX3Npbmd1bGFyID09IGNvbGxlY3Rpb24pXG5cbiAgICAgICAgbGV0IGlkcyA9IFtdXG5cbiAgICAgICAgaWYgKHRoaXMuc2luZ2xlKSB7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlKSA9PSAnc3RyaW5nJykgeyBpZHMgPSBbdmFsdWVdIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlWzBdPy5pZCkgeyBpZHMgPSBbdmFsdWVbMF0uaWRdIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7IGlkcyA9IFt2YWx1ZVswXV0gfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mICh2YWx1ZSkgPT0gJ29iamVjdCcgJiYgdmFsdWUuaWQpIHsgaWRzID0gW3ZhbHVlLmlkXSB9XG4gICAgICAgICAgICBlbHNlIHsgY29uc29sZS5lcnJvcihgJHt0aGlzLnR5cGV9IHNob3VsZCBiZSBhbiBBcnJheSBvciBTdHJpbmcuYCkgfVxuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlKSA9PSAnc3RyaW5nJykgeyBpZHMgPSBbdmFsdWVdIH1cbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkgeyBpZHMgPSB2YWx1ZSB9XG4gICAgICAgICAgICAvLyBpZiAodHlwZW9mICh2YWx1ZSkgPT0gJ29iamVjdCcpIHsgaWRzID0gWyhhd2FpdCBwcm9jZXNzUmVxdWVzdCh7IG1ldGhvZDogJ2NyZWF0ZScsIHBhdGg6IGAvJHtjb2xsZWN0aW9uLl9uYW1lfWAsIGJvZHk6IHZhbHVlIH0pKS5yZXNwb25zZS5pZF0gfVxuXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsaWRJZHMgPSBbXVxuICAgICAgICBsZXQgaW52YWxpZElkcyA9IGlkc1xuXG4gICAgICAgIGxldCByZWxhdGlvblJlcXVlc3QgPSB7IG1ldGhvZDogJ3JlYWQnLCBwYXRoOiBgLyR7Y29sbGVjdGlvbi5fbmFtZX1gLCBib2R5OiB7IGxpbWl0OiA5OTk5LCBzZWFyY2g6IHsgaWQ6IHsgJGluOiBpZHMgfSB9IH0sIGZpZWxkczogWydpZCddLCBtZW1iZXI6IHJlcXVlc3QubWVtYmVyIH1cblxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBwcm9jZXNzUmVxdWVzdChyZWxhdGlvblJlcXVlc3QpXG4gICAgICAgIGxldCBkb2N1bWVudHMgPSByZXNwb25zZT8ucmVzcG9uc2VcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZG9jdW1lbnRzKSAmJiBkb2N1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YWxpZElkcyA9IGlkcy5maWx0ZXIoaWQgPT4gZG9jdW1lbnRzLm1hcChkID0+IFN0cmluZyhkLmlkKSkuaW5jbHVkZXMoaWQpKVxuICAgICAgICAgICAgaW52YWxpZElkcyA9IGlkcy5maWx0ZXIoaWQgPT4gZG9jdW1lbnRzLm1hcChkID0+ICFTdHJpbmcoZC5pZCkpLmluY2x1ZGVzKGlkKSlcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZygnZG9jdW1lbnRzJywgZG9jdW1lbnRzKVxuXG4gICAgICAgIGxldCB3YXJuaW5ncyA9IFtdXG4gICAgICAgIHdhcm5pbmdzLnB1c2goYEZpZWxkICR7dGhpcy50eXBlfSBmb3IgZW50cnkgaW4gJHtjb2xsZWN0aW9uLl9uYW1lfSBjb250YWluZWQgdGhlIGZvbGxvd2luZyBpbnZhbGlkIElEczogJHtpbnZhbGlkSWRzfWApXG5cbiAgICAgICAgLy8gaWYgKGNvbGxlY3Rpb24uX25hbWUgPT0gJ21lbWJlcnMnKSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyh2YWxpZElkcywgaW52YWxpZElkcywgZG9jdW1lbnRzLCByZXNwb25zZSwgcmVsYXRpb25SZXF1ZXN0LmJvZHkuc2VhcmNoKVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgcmV0dXJuIHZhbGlkSWRzIHx8IFtdXG4gICAgfSxcbiAgICBhc3luYyB0cmFuc2xhdGVPdXRwdXQodmFsdWUsIHsgcmVxdWVzdCwgZG9jdW1lbnQgfSkge1xuXG5cbiAgICAgICAgaWYgKHJlcXVlc3QuZmV0Y2hpbmdQYXJlbnQpIHJldHVybiB2YWx1ZVxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSByZXR1cm4gW11cbiAgICAgICAgbGV0IGlkcyA9IHZhbHVlXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlbGF0aW9uc2hpcC5qcycsIHRoaXMuY29sbGVjdGlvbiwgcmVxdWVzdC5hcGlNZXRob2QsIGlkcylcblxuICAgICAgICAvKlxuICAgICAgICAgICAgR3JhcGhRTCBjaGlsZCBxdWVyaWVzIGFyZSBoYW5kbGVkIGluIGFwb2xsby5qc1xuICAgICAgICAqL1xuICAgICAgICBpZiAocmVxdWVzdC5hcGlNZXRob2QgPT0gJ2dyYXBocWwnKSByZXR1cm4gaWRzXG5cbiAgICAgICAgbGV0IHsgY29sbGVjdGlvbiwgX25hbWU6IGZpZWxkTmFtZSB9ID0gdGhpc1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncmVsYXRpb25zaGlwLmpzJywgY29sbGVjdGlvbiwgZmllbGROYW1lKVxuICAgICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbnMuZmluZChjID0+IGMuX3Npbmd1bGFyID09IGNvbGxlY3Rpb24pXG5cbiAgICAgICAgLypcbiAgICAgICAgICAgIFJFU1QgREVQVEggQ0hFQ0tcbiAgICAgICAgKi9cbiAgICAgICAgcmVxdWVzdC5yZWxhdGVkRGVwdGggPSByZXF1ZXN0Py5yZWxhdGVkRGVwdGggfHwgMVxuICAgICAgICBsZXQgZGVwdGggPSByZXF1ZXN0LnJlbGF0ZWREZXB0aFxuICAgICAgICBsZXQgZGVwdGhMaW1pdCA9IHJlcXVlc3Q/LmRlcHRoTGltaXQgPiAtMSA/IHJlcXVlc3Q/LmRlcHRoTGltaXQgOiBjb2xsZWN0aW9uPy5kZXB0aExpbWl0IHx8IDEgLy8gZmFsc2VcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygnZGVwdGhMaW1pdCcsIGRlcHRoTGltaXQsIGNvbGxlY3Rpb24/LmRlcHRoTGltaXQsIGRlcHRoLCByZXF1ZXN0Py5kZXB0aExpbWl0LCBgLyR7Y29sbGVjdGlvbi5fbmFtZX1gKVxuXG4gICAgICAgIGlmIChkZXB0aExpbWl0ICE9PSBmYWxzZSAmJiBkZXB0aExpbWl0IDwgZGVwdGgpIHJldHVybiB0aGlzLnNpbmdsZSA/IHsgaWQ6IGlkc1swXSB9IDogaWRzLm1hcChpZCA9PiAoeyBpZCB9KSlcblxuICAgICAgICBsZXQgcGFyZW50cyA9IHJlcXVlc3QucGFyZW50c1xuICAgICAgICBwYXJlbnRzLnB1c2goZG9jdW1lbnQuaWQpXG5cbiAgICAgICAgbGV0IGZldGNoZWRSZWxhdGlvbnNoaXBzID0gcmVxdWVzdC5mZXRjaGVkUmVsYXRpb25zaGlwc1xuICAgICAgICBmZXRjaGVkUmVsYXRpb25zaGlwcy5wdXNoKGRvY3VtZW50KVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBHZXR0aW5nICR7dGhpcy5jb2xsZWN0aW9ufSBSZWxhdGlvbnNoaXBzYCwgcGFyZW50cy5tYXAocCA9PiBwLnRpdGxlKSlcbiAgICAgICAgLy8gYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygnaWRzJywgaWRzKVxuXG4gICAgICAgIC8qXG4gICAgICAgICAgICAvLyBVbmNvbW1lbnQgdG8gZW5hYmxlIGNpcmN1bGFyIGRlYXRoXG4gICAgICAgICAgICBsZXQgY2FjaGVkRW50cmllcyA9IGlkcy5maWx0ZXIoaWQgPT4gZmV0Y2hlZFJlbGF0aW9uc2hpcHMuc29tZShwID0+IHAuaWQgPT0gaWQpKS5tYXAoaWQgPT4gZmV0Y2hlZFJlbGF0aW9uc2hpcHMuZmluZChwID0+IHAuaWQgPT0gaWQpKVxuICAgICAgICAgICAgY2FjaGVkRW50cmllcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY2FjaGVkRW50cmllcykpXG4gICAgICAgICAgICBsZXQgY2lyY3VsYXJJZHMgPSBpZHMuZmlsdGVyKGlkID0+IHBhcmVudHMuaW5jbHVkZXMoaWQpKVxuICAgICAgICAgICAgaWRzID0gaWRzLmZpbHRlcihpZCA9PiAhY2FjaGVkRW50cmllcy5zb21lKGUgPT4gZS5pZCA9PSBpZCkgJiYgIWNpcmN1bGFySWRzLmluY2x1ZGVzKGlkKSlcbiAgICAgICAgKi9cblxuICAgICAgICAvLyBGYWlsaW5nIHRvIGRlbGV0ZSB0aGUgZmllbGRzIGZyb20gYSByZXN0IHJlcXVlc3QgcmVzdWx0ZWQgaW4gbm8gcmVzdWx0cyBmb3IgcmVsYXRlZCBkb2N1bWVudHMgaW4gdGhlIHF1ZXJ5IGJlbG93XG4gICAgICAgIGxldCBmaWVsZHMgPSByZXF1ZXN0LnJlbGF0aW9uc2hpcEZpZWxkcz8uW2ZpZWxkTmFtZV0gfHwgW11cbiAgICAgICAgaWYgKCFmaWVsZHMubGVuZ3RoKSBmaWVsZHMgPSB1bmRlZmluZWRcblxuXG4gICAgICAgIGxldCByZWxhdGlvblJlcXVlc3QgPSB7XG4gICAgICAgICAgICAuLi5yZXF1ZXN0LnJlcSxcbiAgICAgICAgICAgIGZpZWxkcyxcbiAgICAgICAgICAgIG1lbWJlcjogcmVxdWVzdC5tZW1iZXIgfHwgbnVsbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHJlcXVlc3QucmVxPy5oZWFkZXJzLFxuICAgICAgICAgICAgcXVlcnk6IG51bGwsXG4gICAgICAgICAgICBwYWdlOiAwLFxuICAgICAgICAgICAgbGltaXQ6IDk5OTksXG4gICAgICAgICAgICBkb2N1bWVudDogbnVsbCxcbiAgICAgICAgICAgIHBhcmVudHM6IFsuLi5wYXJlbnRzXSxcbiAgICAgICAgICAgIGZldGNoZWRSZWxhdGlvbnNoaXBzLFxuICAgICAgICAgICAgcmVsYXRlZERlcHRoOiBkZXB0aCArIDEsXG4gICAgICAgICAgICBtZXRob2Q6ICdyZWFkJyxcbiAgICAgICAgICAgIHBhdGg6IGAvJHtjb2xsZWN0aW9uLl9uYW1lfWAsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgbGltaXQ6IDk5OTksXG4gICAgICAgICAgICAgICAgcGFnZTogMCxcbiAgICAgICAgICAgICAgICBkZXB0aExpbWl0LFxuICAgICAgICAgICAgICAgIHNlYXJjaDoge1xuICAgICAgICAgICAgICAgICAgICBpZDogeyAkaW46IGlkcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGlmIChyZWxhdGlvblJlcXVlc3QucGF0aCA9PSAnL3Blb3BsZScpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdyZWxhdGlvblJlcXVlc3QnLCByZWxhdGlvblJlcXVlc3QuaGVhZGVycywgcmVsYXRpb25SZXF1ZXN0LmJvZHkuc2VhcmNoKVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgbGV0IGNoaWxkcmVuID0gKFxuICAgICAgICAgICAgYXdhaXQgcHJvY2Vzc1JlcXVlc3QocmVsYXRpb25SZXF1ZXN0KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dldHRpbmcgY2hpbGRyZW4nLCBjb2xsZWN0aW9uLl9uYW1lLCBpZHMsIGRvY3VtZW50LmlkKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRm9yYmlkZGVuRXJyb3IoYCR7ZX0gd2hpY2ggaXMgcmVmZXJlbmNlZCBhcyBhIHJlbGF0aW9uIGluIHRoZSAke3RoaXMuX25hbWV9IGZpZWxkLmAucmVwbGFjZSgnLicsICcnKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICApLnJlc3BvbnNlXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NoaWxkcmVuJywgY2hpbGRyZW4pXG5cbiAgICAgICAgLy8gU29ydCBjaGlsZHJlbiBhY2NvcmRpbmcgdG8gdGhlaXIgcmVsYXRlZCBvcmRlclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikgJiYgY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjaGlsZHJlbiA9IGNoaWxkcmVuLnNvcnQoKGEsIGIpID0+IGlkcy5maW5kSW5kZXgoaSA9PiBpID09IGEuaWQpID4gaWRzLmZpbmRJbmRleChpID0+IGkgPT0gYi5pZCkgPyAxIDogLTEpXG4gICAgICAgICAgICAvLyByZXF1ZXN0LnBhcmVudHMgPVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRvY3VtZW50c1RvUmV0dXJuID0gY2hpbGRyZW5cbiAgICAgICAgLy8gbGV0IGRvY3VtZW50c1RvUmV0dXJuID0gWy4uLmNpcmN1bGFySWRzLCAuLi5jYWNoZWRFbnRyaWVzLCAuLi5jaGlsZHJlbl1cblxuICAgICAgICByZXR1cm4gdGhpcy5zaW5nbGUgPyBkb2N1bWVudHNUb1JldHVyblswXSA6IGRvY3VtZW50c1RvUmV0dXJuXG4gICAgfVxufSlcbiIsImV4cG9ydCBkZWZhdWx0IHtcblxuICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgIG5hbWU6ICdyaWNoVGV4dCdcblxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHByb3BzOiBbJ3NpbmdsZScsICdvcHRpb25zJ10sXG4gICAgdHlwZTogJ1N0cmluZycsXG4gICAgbmFtZTogJ3NlbGVjdCcsXG4gICAgc2luZ2xlOiB0cnVlLFxuICAgIGRhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiB0aGlzLnNpbmdsZSA/IHRoaXMudHlwZSA6IGBbJHt0aGlzLnR5cGV9XWAsXG4gICAgICAgICAgICBjYXNlU2Vuc2l0aXZlOiB0aGlzLmNhc2VTZW5zaXRpdmUgPz8gZmFsc2UsXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHZhbGlkYXRlKGlucHV0KSB7XG4gICAgICAgIGlucHV0ID0gQXJyYXkuaXNBcnJheShpbnB1dCkgPyBpbnB1dCA6IFtpbnB1dF1cbiAgICAgICAgaW5wdXQgPSB0aGlzLmNhc2VTZW5zaXRpdmUgPyBpbnB1dCA6IGlucHV0Lm1hcChpID0+IGkudG9Mb3dlckNhc2UoKSlcblxuICAgICAgICAvLyBsZXQgb3B0aW9uS2V5cyA9IEFycmF5LmlzQXJyYXkodGhpcy5vcHRpb25zKSA/IHRoaXMub3B0aW9ucyA6IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucylcbiAgICAgICAgbGV0IG9wdGlvblZhbHVlcyA9IEFycmF5LmlzQXJyYXkodGhpcy5vcHRpb25zKSA/IHRoaXMub3B0aW9ucyA6IE9iamVjdC52YWx1ZXModGhpcy5vcHRpb25zKVxuICAgICAgICBpZiAodHlwZW9mIChvcHRpb25WYWx1ZXM/LlswXSkgPT09ICdvYmplY3QnKSBvcHRpb25WYWx1ZXMgPSBvcHRpb25WYWx1ZXMubWFwKG8gPT4gby52YWx1ZSlcbiAgICAgICAgb3B0aW9uVmFsdWVzID0gdGhpcy5jYXNlU2Vuc2l0aXZlID8gb3B0aW9uVmFsdWVzIDogb3B0aW9uVmFsdWVzLm1hcChvID0+IG8udG9Mb3dlckNhc2UoKSlcblxuICAgICAgICBsZXQgdmFsaWQgPSBpbnB1dC5ldmVyeSh2ID0+IG9wdGlvblZhbHVlcy5pbmNsdWRlcyh2KSlcbiAgICAgICAgbGV0IGludmFsaWRPcHRpb25zID0gaW5wdXQuZmlsdGVyKHYgPT4gIW9wdGlvblZhbHVlcy5pbmNsdWRlcyh2KSlcblxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBpbnZhbGlkT3B0aW9ucy5sZW5ndGggPiAxID8gYFwiJHtpbnZhbGlkT3B0aW9uc31cIiBhcmUgbm90IHZhbGlkIG9wdGlvbnMuYCA6IGBcIiR7aW52YWxpZE9wdGlvbnN9XCIgaXMgbm90IGEgdmFsaWQgb3B0aW9uLmBcbiAgICAgICAgcmV0dXJuIHsgdmFsaWQsIHJlc3BvbnNlIH1cbiAgICB9LFxuICAgIHRyYW5zbGF0ZUlucHV0KGlucHV0KSB7XG4gICAgICAgIGlucHV0ID0gQXJyYXkuaXNBcnJheShpbnB1dCkgPyBpbnB1dCA6IFtpbnB1dF1cbiAgICAgICAgaW5wdXQgPSB0aGlzLmNhc2VTZW5zaXRpdmUgPyBpbnB1dCA6IGlucHV0Lm1hcChpID0+IGkudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgcmV0dXJuIHRoaXMuc2luZ2xlID8gaW5wdXRbMF0gOiBpbnB1dFxuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICB0eXBlOiAnRGF0ZVRpbWUnLFxuICAgIHZhbGlkYXRlOiBpbnB1dCA9PiB7XG4gICAgICAgIGxldCB2YWxpZCA9IGlucHV0ICYmIG5ldyBEYXRlKGlucHV0KSAhPSAnSW52YWxpZCBEYXRlJ1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBpbnB1dCA/IGBuZXcgRGF0ZShpbnB1dCkgcmV0dXJucyBJbnZhbGlkIERhdGUuIChpbnB1dDogJHtpbnB1dH0pYCA6ICdpbnB1dCBjYW5ub3QgYmUgbnVsbCdcbiAgICAgICAgcmV0dXJuIHsgdmFsaWQsIHJlc3BvbnNlIH1cbiAgICB9LFxuICAgIHRyYW5zbGF0ZUlucHV0OiBpbnB1dCA9PiBuZXcgRGF0ZShpbnB1dClcbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICB0eXBlOiBCb29sZWFuLFxufVxuIiwiaW1wb3J0IGNyZWF0ZUZpZWxkIGZyb20gXCIuL2NyZWF0ZUZpZWxkXCI7XG5cbmZ1bmN0aW9uIHJlcXVpcmVBbGwocikge1xuICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgIHIua2V5cygpLm1hcChmdW5jdGlvbiAobXBhdGgsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHIobXBhdGgsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IG1wYXRoXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/Ol5bLlxcL10qXFwvfFxcLlteLl0rJCkvZywgXCJcIikgLy8gVHJpbVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8vZywgXCJfXCIpOyAvLyBSZWxhY2UgJy8ncyBieSAnXydzXG4gICAgICAgICAgICByZXR1cm4gW25hbWUsIHJlc3VsdF07XG4gICAgICAgIH0pXG4gICAgKTtcbn1cblxubGV0IGRlZmF1bHRGaWVsZHMgPSByZXF1aXJlQWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgLy8gQW55IGtpbmQgb2YgdmFyaWFibGVzIGNhbm5vdCBiZSB1c2VkIGhlcmVcbiAgICAgICAgXCIuL2RlZmF1bHRGaWVsZHMvXCIsIC8vIChXZWJwYWNrIGJhc2VkKSBwYXRoXG4gICAgICAgIHRydWUsIC8vIFVzZSBzdWJkaXJlY3Rvcmllc1xuICAgICAgICAvLipcXC5qcyQvIC8vIEZpbGUgbmFtZSBwYXR0ZXJuXG4gICAgKVxuKTtcblxubGV0IHVzZXJGaWVsZHMgPSByZXF1aXJlQWxsKFxuICAgIHJlcXVpcmUuY29udGV4dChcbiAgICAgICAgLy8gQW55IGtpbmQgb2YgdmFyaWFibGVzIGNhbm5vdCBiZSB1c2VkIGhlcmVcbiAgICAgICAgXCJAbWFuZ28vZmllbGRzL1wiLCAvLyAoV2VicGFjayBiYXNlZCkgcGF0aFxuICAgICAgICB0cnVlLCAvLyBVc2Ugc3ViZGlyZWN0b3JpZXNcbiAgICAgICAgLy4qXFwuanMkLyAvLyBGaWxlIG5hbWUgcGF0dGVyblxuICAgIClcbik7XG5cbmZ1bmN0aW9uIHByb2Nlc3NGaWVsZHMoYWxsRmllbGRzKSB7XG4gICAgbGV0IGZpZWxkcyA9IE9iamVjdC5rZXlzKGFsbEZpZWxkcykucmVkdWNlKChhLCBmaWVsZE5hbWUpID0+IHtcbiAgICAgICAgaWYgKGZpZWxkTmFtZSAhPSBcImluZGV4XCIpIHtcbiAgICAgICAgICAgIGxldCBtb2R1bGVzID0gYWxsRmllbGRzW2ZpZWxkTmFtZV07XG4gICAgICAgICAgICBsZXQgdGl0bGVOYW1lID0gZmllbGROYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZmllbGROYW1lLnNsaWNlKDEpO1xuICAgICAgICAgICAgdGl0bGVOYW1lID0gdGl0bGVOYW1lLnJlcGxhY2UoXCJfaW5kZXhcIiwgXCJcIik7XG4gICAgICAgICAgICBsZXQgZmllbGQgPSBtb2R1bGVzLmRlZmF1bHQ7XG5cbiAgICAgICAgICAgIC8vIElmIHRoaXMgZmllbGQgaGFzIGFscmVheSBiZWVuIHJlZ2lzdGVyZWQuLi4gKGNyZWF0ZUZpZWxkKVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGVzLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGFbdGl0bGVOYW1lXSA9IGZpZWxkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygney4uLmZpZWxkLCBfdHlwZTogZmllbGROYW1lfScsIHsuLi5maWVsZCwgX3R5cGU6IGZpZWxkTmFtZX0pXG4gICAgICAgICAgICAgICAgLy8gaWYgKCFmaWVsZC50eXBlKSB7ZmllbGQudHlwZSA9IHRpdGxlTmFtZX1cbiAgICAgICAgICAgICAgICBhW3RpdGxlTmFtZV0gPSBjcmVhdGVGaWVsZChmaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfSwge30pO1xuXG4gICAgcmV0dXJuIGZpZWxkcztcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVEZWZhdWx0RmllbGRzKCkge1xuICAgIHJldHVybiBwcm9jZXNzRmllbGRzKGRlZmF1bHRGaWVsZHMpO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVVzZXJGaWVsZHMoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3NGaWVsZHModXNlckZpZWxkcyk7XG59XG5cbmRlZmF1bHRGaWVsZHMgPSBwcm9jZXNzRmllbGRzKGRlZmF1bHRGaWVsZHMpO1xudXNlckZpZWxkcyA9IHByb2Nlc3NGaWVsZHModXNlckZpZWxkcyk7XG5jb25zdCBhbGxGaWVsZHMgPSB7IC4uLmRlZmF1bHRGaWVsZHMsIC4uLnVzZXJGaWVsZHMgfTtcblxuZXhwb3J0IGRlZmF1bHQgYWxsRmllbGRzO1xuIiwiY29uc3QgeyBncWwsIFB1YlN1Yiwgd2l0aEZpbHRlciB9ID0gcmVxdWlyZSgnYXBvbGxvLXNlcnZlcicpO1xuaW1wb3J0IHsgcHJvY2Vzc1JlcXVlc3QsIHB1YnN1YiB9IGZyb20gJy4uLy4uLzIuIHByb2Nlc3MvMC4gbWFpbidcbmltcG9ydCBjb2xsZWN0aW9ucyBmcm9tICcuLi9jb2xsZWN0aW9ucydcbmltcG9ydCBncmFwaHFsRmllbGRzIGZyb20gJ2dyYXBocWwtZmllbGRzJ1xuY29uc3QgeyBHcmFwaFFMU2NhbGFyVHlwZSwgS2luZCB9ID0gcmVxdWlyZSgnZ3JhcGhxbCcpO1xuXG5jb25zdCB7XG4gICAgcGFyc2VSZXNvbHZlSW5mbyxcbiAgICBzaW1wbGlmeVxufSA9IHJlcXVpcmUoJ2dyYXBocWwtcGFyc2UtcmVzb2x2ZS1pbmZvJyk7XG5cbmNvbnN0IGRhdGVTY2FsYXIgPSBuZXcgR3JhcGhRTFNjYWxhclR5cGUoe1xuICAgIG5hbWU6ICdEYXRlJyxcbiAgICBkZXNjcmlwdGlvbjogJ0RhdGUgY3VzdG9tIHNjYWxhciB0eXBlJyxcbiAgICBzZXJpYWxpemUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmdldFRpbWUoKTsgLy8gQ29udmVydCBvdXRnb2luZyBEYXRlIHRvIGludGVnZXIgZm9yIEpTT05cbiAgICB9LFxuICAgIHBhcnNlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlKTsgLy8gQ29udmVydCBpbmNvbWluZyBpbnRlZ2VyIHRvIERhdGVcbiAgICB9LFxuICAgIHBhcnNlTGl0ZXJhbChhc3QpIHtcbiAgICAgICAgaWYgKGFzdC5raW5kID09PSBLaW5kLklOVCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHBhcnNlSW50KGFzdC52YWx1ZSwgMTApKTsgLy8gQ29udmVydCBoYXJkLWNvZGVkIEFTVCBzdHJpbmcgdG8gaW50ZWdlciBhbmQgdGhlbiB0byBEYXRlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIEludmFsaWQgaGFyZC1jb2RlZCB2YWx1ZSAobm90IGFuIGludGVnZXIpXG4gICAgfSxcbn0pO1xuXG4vLyBpbXBvcnQgeyBQdWJTdWIgfSBmcm9tICdhcG9sbG8tc2VydmVyJztcbi8vIGNvbnN0IHB1YnN1YiA9IG5ldyBQdWJTdWIoKTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVHcWwoKSB7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnX3Rlc3QnLCBjb2xsZWN0aW9ucy5maW5kKGMgPT4gYy5zaW5ndWxhciA9PSAndGVzdCcpKVxuICAgIGNvbnN0IGFsbEZpZWxkcyA9IGNvbGxlY3Rpb25zLnJlZHVjZSgoYWNjLCBjb2xsZWN0aW9uKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgZmllbGRNb2RlbCBvZiBjb2xsZWN0aW9uLl9maWVsZHNBcnJheSkge1xuICAgICAgICAgICAgaWYgKCFhY2Muc29tZShhY2NGaWVsZCA9PiBhY2NGaWVsZC5fdGl0bGVUeXBlID09IGZpZWxkTW9kZWwuX3RpdGxlVHlwZSkpIHtcbiAgICAgICAgICAgICAgICBhY2MucHVzaChmaWVsZE1vZGVsKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2NcbiAgICB9LCBbXSlcblxuICAgIC8vIFN0YXJ0IHRoZSB0eXBlIHN0cmluZ1xuICAgIGxldCB0eXBlRGVmU3RyaW5nID0gYFxuICAgIHNjYWxhciBEYXRlVGltZVxuXG4gICAgZGlyZWN0aXZlIEBjb2xsZWN0aW9uUHJvdGVjdGVkIG9uIE9CSkVDVFxuICAgIGRpcmVjdGl2ZSBAZmllbGRQcm90ZWN0ZWQgb24gRklFTERfREVGSU5JVElPTlxuXG4gICAgdHlwZSBEZWxldGUge1xuICAgICAgICBkZWxldGVkOiBJbnRcbiAgICB9XG5cbiAgICAke2NvbGxlY3Rpb25zLmZpbHRlcihjID0+IGMuc3Vic2NyaWJlKS5sZW5ndGggPyBgXG4gICAgdHlwZSBTdWJzY3JpcHRpb24ge1xuICAgICAgICAke2NvbGxlY3Rpb25zLmZpbHRlcihjID0+IGMuc3Vic2NyaWJlKS5tYXAoYyA9PiB7XG4gICAgICAgIGxldCBldmVudE5hbWUgPSBgJHtjLl9zaW5ndWxhcn1DaGFuZ2VgXG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICAke2V2ZW50TmFtZX0oaWQ6IElEKTogJHtjLl90aXRsZVNpbmd1bGFyfVxuICAgICAgICAgICAgYFxuICAgIH0pLmpvaW4oJ1xcblxcbicpfVxuICAgIH1cbiAgICBgIDogJyd9XG5cblxuICAgIGlucHV0IGNvbXBhcmVJbnQge1xuICAgICAgICBub3RFcXVhbFRvOiBJbnRcbiAgICAgICAgZ3JlYXRlclRoYW46IEludFxuICAgICAgICBsZXNzVGhhbjogSW50XG4gICAgICAgIGluOiBbSW50XVxuICAgICAgICBub3RJbjogW0ludF1cbiAgICAgICAgbm90OiBJbnRcbiAgICAgICAgZXhpc3RzOiBCb29sZWFuXG4gICAgICAgIGluY2x1ZGVzQWxsOiBbSW50XVxuICAgICAgICBlYWNoSW46IFtJbnRdXG4gICAgICAgIGFuZDogW2NvbXBhcmVJbnRdXG4gICAgICAgIG9yOiBbY29tcGFyZUludF1cbiAgICAgICAgbGVuZ3RoOiBJbnRcbiAgICB9XG5cbiAgICBpbnB1dCBjb21wYXJlRmxvYXQge1xuICAgICAgICBub3RFcXVhbFRvOiBGbG9hdFxuICAgICAgICBncmVhdGVyVGhhbjogRmxvYXRcbiAgICAgICAgbGVzc1RoYW46IEZsb2F0XG4gICAgICAgIGluOiBbRmxvYXRdXG4gICAgICAgIG5vdEluOiBbRmxvYXRdXG4gICAgICAgIG5vdDogRmxvYXRcbiAgICAgICAgZXhpc3RzOiBCb29sZWFuXG4gICAgICAgIGluY2x1ZGVzQWxsOiBbRmxvYXRdXG4gICAgICAgIGVhY2hJbjogW0Zsb2F0XVxuICAgICAgICBhbmQ6IFtjb21wYXJlRmxvYXRdXG4gICAgICAgIG9yOiBbY29tcGFyZUZsb2F0XVxuICAgICAgICBsZW5ndGg6IEZsb2F0XG4gICAgfVxuXG4gICAgaW5wdXQgY29tcGFyZURhdGVUaW1lIHtcbiAgICAgICAgbm90RXF1YWxUbzogRGF0ZVRpbWVcbiAgICAgICAgZ3JlYXRlclRoYW46IERhdGVUaW1lXG4gICAgICAgIGxlc3NUaGFuOiBEYXRlVGltZVxuICAgICAgICBpbjogW0RhdGVUaW1lXVxuICAgICAgICBub3RJbjogW0RhdGVUaW1lXVxuICAgICAgICBub3Q6IERhdGVUaW1lXG4gICAgICAgIGV4aXN0czogQm9vbGVhblxuICAgICAgICBpbmNsdWRlc0FsbDogW0RhdGVUaW1lXVxuICAgICAgICBlYWNoSW46IFtEYXRlVGltZV1cbiAgICAgICAgYW5kOiBbY29tcGFyZURhdGVUaW1lXVxuICAgICAgICBvcjogW2NvbXBhcmVEYXRlVGltZV1cbiAgICAgICAgbGVuZ3RoOiBEYXRlVGltZVxuICAgIH1cblxuICAgIGlucHV0IGNvbXBhcmVTdHJpbmcge1xuICAgICAgICBub3RFcXVhbFRvOiBTdHJpbmdcbiAgICAgICAgZ3JlYXRlclRoYW46IFN0cmluZ1xuICAgICAgICBsZXNzVGhhbjogU3RyaW5nXG4gICAgICAgIGluOiBbU3RyaW5nXVxuICAgICAgICBub3RJbjogW1N0cmluZ11cbiAgICAgICAgbm90OiBTdHJpbmdcbiAgICAgICAgZXhpc3RzOiBCb29sZWFuXG4gICAgICAgIGhhc1ZhbHVlOiBCb29sZWFuXG4gICAgICAgIGluY2x1ZGVzQWxsOiBbU3RyaW5nXVxuICAgICAgICBlYWNoSW46IFtTdHJpbmddXG4gICAgICAgIGFuZDogW2NvbXBhcmVTdHJpbmddXG4gICAgICAgIG9yOiBbY29tcGFyZVN0cmluZ11cbiAgICAgICAgbGVuZ3RoOiBJbnRcbiAgICB9XG5cbiAgICBpbnB1dCBjb21wYXJlU3RyaW5nQXJyYXkge1xuICAgICAgICBsZW5ndGg6IEludFxuICAgICAgICBleGlzdHM6IEJvb2xlYW5cbiAgICAgICAgc29tZUluOiBbU3RyaW5nXVxuICAgICAgICBub25lSW46IFtTdHJpbmddXG4gICAgICAgIGluY2x1ZGVzQWxsOiBbU3RyaW5nXVxuICAgICAgICBlYWNoSW46IFtTdHJpbmddXG4gICAgfVxuXG4gICAgaW5wdXQgY29tcGFyZUludEFycmF5IHtcbiAgICAgICAgbGVuZ3RoOiBJbnRcbiAgICAgICAgZXhpc3RzOiBCb29sZWFuXG4gICAgICAgIHNvbWVJbjogW1N0cmluZ11cbiAgICAgICAgbm9uZUluOiBbU3RyaW5nXVxuICAgICAgICBpbmNsdWRlc0FsbDogW1N0cmluZ11cbiAgICAgICAgZWFjaEluOiBbU3RyaW5nXVxuICAgIH1cblxuICAgIGlucHV0IGNvbXBhcmVGbG9hdEFycmF5IHtcbiAgICAgICAgbGVuZ3RoOiBGbG9hdFxuICAgICAgICBleGlzdHM6IEJvb2xlYW5cbiAgICAgICAgc29tZUluOiBbU3RyaW5nXVxuICAgICAgICBub25lSW46IFtTdHJpbmddXG4gICAgICAgIGluY2x1ZGVzQWxsOiBbU3RyaW5nXVxuICAgICAgICBlYWNoSW46IFtTdHJpbmddXG4gICAgfVxuXG4gICAgaW5wdXQgY29tcGFyZUJvb2xlYW4ge1xuICAgICAgICBub3RFcXVhbFRvOiBCb29sZWFuXG4gICAgICAgIG5vdDogQm9vbGVhblxuICAgICAgICBleGlzdHM6IEJvb2xlYW5cbiAgICAgICAgaGFzVmFsdWU6IEJvb2xlYW5cbiAgICB9XG5cblxuICAgIGBcblxuICAgIC8vIERlZmluZSB0aGUgZGF0YSBtb2RlbHNcbiAgICBjb2xsZWN0aW9ucy5mb3JFYWNoKGNvbGxlY3Rpb24gPT4ge1xuXG4gICAgICAgIHR5cGVEZWZTdHJpbmcgKz0gY29sbGVjdGlvbi5fdHlwZVNjaGVtYVxuICAgICAgICB0eXBlRGVmU3RyaW5nICs9IGNvbGxlY3Rpb24uX2NyZWF0ZVNjaGVtYVxuICAgICAgICB0eXBlRGVmU3RyaW5nICs9IGNvbGxlY3Rpb24uX3VwZGF0ZVNjaGVtYVxuICAgICAgICB0eXBlRGVmU3RyaW5nICs9IGNvbGxlY3Rpb24uX3F1ZXJ5U2NoZW1hXG4gICAgICAgIHR5cGVEZWZTdHJpbmcgKz0gY29sbGVjdGlvbi5fc29ydFNjaGVtYVxuICAgICAgICB0eXBlRGVmU3RyaW5nICs9IGNvbGxlY3Rpb24uX211dGF0aW9uUmVzcG9uc2VTY2hlbWFQbHVyYWxcbiAgICAgICAgdHlwZURlZlN0cmluZyArPSBjb2xsZWN0aW9uLl9tdXRhdGlvblJlc3BvbnNlU2NoZW1hU2luZ3VsYXJcblxuICAgIH0pXG4gICAgdHlwZURlZlN0cmluZyArPSAnXFxuXFxuJ1xuXG4gICAgLy8gRGVmaW5lIHRoZW0gZm9yIGZpZWxkc1xuICAgIGFsbEZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgdHlwZURlZlN0cmluZyArPSBmaWVsZC5fdHlwZVNjaGVtYVxuICAgICAgICB0eXBlRGVmU3RyaW5nICs9IGZpZWxkLl9jcmVhdGVTY2hlbWFcbiAgICAgICAgdHlwZURlZlN0cmluZyArPSBmaWVsZC5fdXBkYXRlU2NoZW1hXG4gICAgICAgIHR5cGVEZWZTdHJpbmcgKz0gZmllbGQuX3F1ZXJ5U2NoZW1hXG4gICAgfSlcbiAgICB0eXBlRGVmU3RyaW5nICs9ICdcXG5cXG4nXG5cbiAgICAvLyBEZWZpbmUgdGhlIHF1ZXJ5IHR5cGVzXG4gICAgdHlwZURlZlN0cmluZyArPSBgdHlwZSBRdWVyeSB7XFxuYFxuICAgIHR5cGVEZWZTdHJpbmcgKz0gY29sbGVjdGlvbnMubWFwKGNvbGxlY3Rpb24gPT4gYFxuICAgICAgICAke2NvbGxlY3Rpb24uX3F1ZXJ5RGVmaW5pdGlvblBsdXJhbH1cbiAgICAgICAgJHtjb2xsZWN0aW9uLl9xdWVyeURlZmluaXRpb25TaW5ndWxhcn1cbiAgICBgKS5qb2luKCdcXG4nKVxuICAgIHR5cGVEZWZTdHJpbmcgKz0gYH1cXG5cXG5gXG5cbiAgICAvLyBEZWZpbmUgdGhlIG11dGF0aW9uIHR5cGVzXG4gICAgdHlwZURlZlN0cmluZyArPSBgdHlwZSBNdXRhdGlvbiB7XFxuYFxuICAgIHR5cGVEZWZTdHJpbmcgKz0gY29sbGVjdGlvbnMubWFwKGNvbGxlY3Rpb24gPT4gYFxuICAgICAgICAke2NvbGxlY3Rpb24uX2NyZWF0ZURlZmluaXRpb25QbHVyYWx9XG4gICAgICAgICR7Y29sbGVjdGlvbi5fdXBkYXRlRGVmaW5pdGlvblBsdXJhbH1cbiAgICAgICAgJHtjb2xsZWN0aW9uLl9kZWxldGVEZWZpbml0aW9uUGx1cmFsfVxuICAgICAgICAke2NvbGxlY3Rpb24uX2NyZWF0ZURlZmluaXRpb25TaW5ndWxhcn1cbiAgICAgICAgJHtjb2xsZWN0aW9uLl91cGRhdGVEZWZpbml0aW9uU2luZ3VsYXJ9XG4gICAgICAgICR7Y29sbGVjdGlvbi5fZGVsZXRlRGVmaW5pdGlvblNpbmd1bGFyfVxuICAgIGApLmpvaW4oJycpXG4gICAgdHlwZURlZlN0cmluZyArPSBgfVxcblxcbmBcblxuICAgIC8vIGNvbnNvbGUubG9nKCd0eXBlRGVmU3RyaW5nJywgdHlwZURlZlN0cmluZylcblxuICAgIC8vIENvbnN0cnVjdCBhIHNjaGVtYSwgdXNpbmcgR3JhcGhRTCBzY2hlbWEgbGFuZ3VhZ2VcbiAgICBjb25zdCB0eXBlRGVmcyA9IGdxbGAke3R5cGVEZWZTdHJpbmd9YDtcblxuICAgIC8vIFJlc29sdmVyIGZvciBhbGwgcXVlcmllc1xuICAgIGxldCBnbG9iYWxRdWVyeVJlc29sdmVyID0gYXN5bmMgZnVuY3Rpb24gKHBhcmVudCwgYXJncywgcmVxLCBpbmZvKSB7XG5cbiAgICAgICAgLy8gY29uc29sZS5kaXIoZ3FsYCR7cmVxLmJvZHkucXVlcnl9YCwgeyBkZXB0aDogbnVsbCB9KVxuICAgICAgICBjb25zdCB0b3BMZXZlbEZpZWxkcyA9IE9iamVjdC5rZXlzKGdyYXBocWxGaWVsZHMoaW5mbykpXG5cbiAgICAgICAgLy8gY29uc3QgcGFyc2VkUmVzb2x2ZUluZm9GcmFnbWVudCA9IHBhcnNlUmVzb2x2ZUluZm8oaW5mbyk7XG4gICAgICAgIC8vIGxldCBmaWVsZHMgPSBwYXJzZWRSZXNvbHZlSW5mb0ZyYWdtZW50LmZpZWxkc0J5VHlwZU5hbWVcbiAgICAgICAgLy8gdG9wTGV2ZWxGaWVsZHMgPSB0b3BMZXZlbEZpZWxkcyB8fCBPYmplY3Qua2V5cyhmaWVsZHNbT2JqZWN0LmtleXMoZmllbGRzKVswXV0pXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0b3BMZXZlbEZpZWxkcycsIHRvcExldmVsRmllbGRzKVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdmaWVsZHMnLCBmaWVsZHMpXG5cbiAgICAgICAgLy8gVGVtcCBmaXggZm9yIGNvbXB1dGVkIGlzc3VlXG4gICAgICAgIGlmICh0b3BMZXZlbEZpZWxkcy5pbmNsdWRlcygnYm9keU1pbicpKSB7IHRvcExldmVsRmllbGRzLnB1c2goJ2JvZHknKSB9XG4gICAgICAgIGlmICh0b3BMZXZlbEZpZWxkcy5pbmNsdWRlcygnZGVzY3JpcHRpb25NaW4nKSkgeyB0b3BMZXZlbEZpZWxkcy5wdXNoKCdkZXNjcmlwdGlvbicpIH1cbiAgICAgICAgaWYgKHRvcExldmVsRmllbGRzLmluY2x1ZGVzKCd0cmVuZGluZ1Njb3JlJykpIHsgdG9wTGV2ZWxGaWVsZHMucHVzaCgnaGl0cycpIH1cblxuICAgICAgICAvLyBHZXQgdGhlIGNvbGxlY3Rpb24gaW5mbyBmcm9tIHRoZSBxdWVyeVxuICAgICAgICBsZXQgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25zLmZpbmQoYyA9PiBbYy5fbmFtZSwgYy5fc2luZ3VsYXJdLmluY2x1ZGVzKGluZm8uZmllbGROYW1lKSlcbiAgICAgICAgbGV0IHNpbmdsZSA9IGluZm8uZmllbGROYW1lID09IGNvbGxlY3Rpb24uX3Npbmd1bGFyID8gdHJ1ZSA6IGZhbHNlXG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSByZXF1ZXN0IGFuZCBnZXQgdGhlIGRvY3VtZW50c1xuICAgICAgICAvLyBsZXQgbWVtYmVyID0gcmVxLm1lbWJlciB8fCBhd2FpdCBnZXRNZW1iZXIocmVxKVxuICAgICAgICBsZXQgcmVxdWVzdCA9IHsgLi4ucmVxLCBoZWFkZXJzOiByZXEuaGVhZGVycywgbWV0aG9kOiAncmVhZCcsIHBhdGg6IGAvJHtjb2xsZWN0aW9uLl9uYW1lfWAsIGJvZHk6IHsgLi4uYXJncyB9LCBmaWVsZHM6IHRvcExldmVsRmllbGRzIH1cbiAgICAgICAgbGV0IGRvY3VtZW50cyA9IChhd2FpdCBwcm9jZXNzUmVxdWVzdChyZXF1ZXN0KSkucmVzcG9uc2VcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2RvY3VtZW50cycsIGRvY3VtZW50cylcblxuICAgICAgICAvLyBTb3J0IGZvciByZWxhdGlvbnNoaXBzXG4gICAgICAgIGlmIChhcmdzLmxpbWl0ID09IDk5OTkgJiYgIWFyZ3Muc29ydCAmJiBhcmdzLnNlYXJjaD8uY29tcGFyZUlkPy5pbj8ubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgaWRzID0gYXJncy5zZWFyY2guY29tcGFyZUlkLmluXG4gICAgICAgICAgICBkb2N1bWVudHMgPSBkb2N1bWVudHMuc29ydCgoYSwgYikgPT4gaWRzLmZpbmRJbmRleChpID0+IGkgPT0gYS5pZCkgPiBpZHMuZmluZEluZGV4KGkgPT4gaSA9PSBiLmlkKSA/IDEgOiAtMSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaW5nbGUgPyBkb2N1bWVudHNbMF0gOiBkb2N1bWVudHNcblxuICAgIH1cblxuICAgIC8vIFJlc29sdmVyIGZvciBtdXRhdGlvbnNcbiAgICBsZXQgZ2xvYmFsTXV0YXRpb25SZXNvbHZlciA9IGFzeW5jIGZ1bmN0aW9uIChwYXJlbnQsIGFyZ3MsIHJlcSwgaW5mbykge1xuXG4gICAgICAgIGxldCBtdXRhdGlvblR5cGUgPSBpbmZvLmZpZWxkTmFtZS5zdWJzdHJpbmcoMCwgNilcbiAgICAgICAgbGV0IGNvbGxlY3Rpb25UaXRsZU5hbWUgPSBpbmZvLmZpZWxkTmFtZS5zdWJzdHJpbmcoNilcbiAgICAgICAgbGV0IGNvbGxlY3Rpb25SZXNwb25zZU5hbWUgPSBjb2xsZWN0aW9uVGl0bGVOYW1lLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgY29sbGVjdGlvblRpdGxlTmFtZS5zbGljZSgxKVxuXG4gICAgICAgIGxldCBtdXRhdGlvbk1hcCA9IHtcbiAgICAgICAgICAgIGNyZWF0ZTogJ2NyZWF0ZScsXG4gICAgICAgICAgICB1cGRhdGU6ICd1cGRhdGUnLFxuICAgICAgICAgICAgZGVsZXRlOiAnZGVsZXRlJ1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1ldGhvZCA9IG11dGF0aW9uTWFwW211dGF0aW9uVHlwZV1cbiAgICAgICAgbGV0IGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9ucy5maW5kKGMgPT4gW2MuX3RpdGxlU2luZ3VsYXIsIGMuX3RpdGxlTmFtZV0uaW5jbHVkZXMoY29sbGVjdGlvblRpdGxlTmFtZSkpXG4gICAgICAgIGxldCBzaW5nbGUgPSBjb2xsZWN0aW9uVGl0bGVOYW1lID09IGNvbGxlY3Rpb24uX3RpdGxlU2luZ3VsYXIgPyB0cnVlIDogZmFsc2VcblxuICAgICAgICBsZXQgaWQgPSBhcmdzPy5pZCB8fCBhcmdzPy5pbnB1dD8uaWRcbiAgICAgICAgbGV0IGRyYWZ0ID0gYXJncz8uZHJhZnRcbiAgICAgICAgbGV0IGRvY3VtZW50cyA9IEFycmF5LmlzQXJyYXkoYXJncy5pbnB1dCkgPyBhcmdzLmlucHV0IDogW2FyZ3MuaW5wdXRdXG5cbiAgICAgICAgbGV0IHBhdGggPSBpZCA/IGAvJHtjb2xsZWN0aW9uLl9uYW1lfS8ke2lkfWAgOiBgLyR7Y29sbGVjdGlvbi5fbmFtZX1gXG5cbiAgICAgICAgLypcblxuICAgICAgICAgICAgVGhpcyBiaXQgYmVsb3cgaGVyZSBuZWVkcyB0byBiZSBmaXhlZFxuICAgICAgICAgICAgaXQncyBydW5uaW5nIHByb2Nlc3NSZXF1ZXN0IGZvciBlYWNoXG4gICAgICAgICAgICBkb2N1bWVudCBwYXNzZWQgKGlmIHdlJ3JlIGNyZWF0aW5nXG4gICAgICAgICAgICBtdWx0aXBsZSksIGFuZCB0aGVuIGpvaW5pbmcgdGhlbSBpbiBhblxuICAgICAgICAgICAgYXJyYXkgZm9yIHRoZSByZXNwb25zZSwgb3IgcGFzc2luZyBiYWNrXG4gICAgICAgICAgICB0aGUgZmlyc3Qgb2YgdGhlIGFycmF5IGlmIGl0J3MgYSBzaW5nbGVcblxuICAgICAgICAqL1xuXG4gICAgICAgIGxldCByZXNwb25zZSA9IHt9XG4gICAgICAgIGxldCByZXN1bHRzID0gW11cbiAgICAgICAgZm9yIChjb25zdCBib2R5IG9mIGRvY3VtZW50cykge1xuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSB7IC4uLnJlcSwgaGVhZGVyczogcmVxLmhlYWRlcnMsIG1ldGhvZCwgcGF0aCwgYm9keSwgZHJhZnQgfVxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IChhd2FpdCBwcm9jZXNzUmVxdWVzdChyZXF1ZXN0KSlcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChyZXN1bHQpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWV0aG9kID09ICdkZWxldGUnKSB7XG4gICAgICAgICAgICByZXNwb25zZS5kZWxldGVkID0gcmVzdWx0cy5yZWR1Y2UoKGFjYywgcmVzdWx0KSA9PiBhY2MgKz0gcmVzdWx0LmRlbGV0ZWQsIDApXG4gICAgICAgICAgICByZXNwb25zZS5zdWNjZXNzID0gcmVzdWx0cy5ldmVyeShyZXN1bHQgPT4gcmVzdWx0LmRlbGV0ZWQgPT0gMSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3BvbnNlLnN1Y2Nlc3MgPSByZXN1bHRzLmV2ZXJ5KHJlc3VsdCA9PiByZXN1bHQuc3VjY2VzcylcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnNvbGUuZGlyKHJlc3VsdHNbMF0ucmVzcG9uc2UsIHtkZXB0aDogbnVsbH0pXG5cbiAgICAgICAgcmVzcG9uc2VbY29sbGVjdGlvblJlc3BvbnNlTmFtZV0gPSBzaW5nbGUgPyByZXN1bHRzWzBdLnJlc3BvbnNlIDogcmVzdWx0cy5tYXAocmVzdWx0ID0+IHJlc3VsdC5yZXNwb25zZSlcblxuICAgICAgICAvLyBpZiAoY29sbGVjdGlvbi5zdWJzY3JpYmUpIHtcbiAgICAgICAgLy8gICAgIGxldCBoYW5kbGVyID0ge31cbiAgICAgICAgLy8gICAgIGhhbmRsZXJbYCR7Y29sbGVjdGlvbi5fc2luZ3VsYXJ9Q2hhbmdlYF0gPSByZXNwb25zZVtjb2xsZWN0aW9uUmVzcG9uc2VOYW1lXVxuICAgICAgICAvLyAgICAgcHVic3ViLnB1Ymxpc2goY29sbGVjdGlvbi5fdGl0bGVTaW5ndWxhciwgaGFuZGxlcik7XG4gICAgICAgIC8vIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9XG5cbiAgICAvLyBidWlsZCBxdWVyeSByZXNvbHZlcnMgZnJvbSBjb2xsZWN0aW9uc1xuICAgIGxldCBxdWVyeVJlc29sdmVyc1BsdXJhbCA9IGNvbGxlY3Rpb25zLnJlZHVjZSgoYWNjLCB7IF9uYW1lIH0pID0+IHsgYWNjW19uYW1lXSA9IGdsb2JhbFF1ZXJ5UmVzb2x2ZXI7IHJldHVybiBhY2MgfSwge30pXG4gICAgbGV0IHF1ZXJ5UmVzb2x2ZXJzU2luZ3VsYXIgPSBjb2xsZWN0aW9ucy5yZWR1Y2UoKGFjYywgeyBfc2luZ3VsYXIgfSkgPT4geyBhY2NbX3Npbmd1bGFyXSA9IGdsb2JhbFF1ZXJ5UmVzb2x2ZXI7IHJldHVybiBhY2MgfSwge30pXG5cbiAgICAvLyBidWlsZCBtdXRhdGlvbiByZXNvbHZlcnMgZnJvbSBjb2xsZWN0aW9uc1xuICAgIGxldCBjcmVhdGVSZXNvbHZlcnMgPSBjb2xsZWN0aW9ucy5yZWR1Y2UoKGFjYywgeyBfbXV0YXRpb24gfSkgPT4geyBhY2NbX211dGF0aW9uXSA9IGdsb2JhbE11dGF0aW9uUmVzb2x2ZXI7IHJldHVybiBhY2MgfSwge30pXG4gICAgbGV0IHVwZGF0ZVJlc29sdmVycyA9IGNvbGxlY3Rpb25zLnJlZHVjZSgoYWNjLCB7IF90aXRsZU5hbWUgfSkgPT4geyBhY2NbYHVwZGF0ZSR7X3RpdGxlTmFtZX1gXSA9IGdsb2JhbE11dGF0aW9uUmVzb2x2ZXI7IHJldHVybiBhY2MgfSwge30pXG4gICAgbGV0IGRlbGV0ZVJlc29sdmVycyA9IGNvbGxlY3Rpb25zLnJlZHVjZSgoYWNjLCB7IF90aXRsZU5hbWUgfSkgPT4geyBhY2NbYGRlbGV0ZSR7X3RpdGxlTmFtZX1gXSA9IGdsb2JhbE11dGF0aW9uUmVzb2x2ZXI7IHJldHVybiBhY2MgfSwge30pXG4gICAgbGV0IGNyZWF0ZVJlc29sdmVyc1Npbmd1bGFyID0gY29sbGVjdGlvbnMucmVkdWNlKChhY2MsIHsgX3RpdGxlU2luZ3VsYXIgfSkgPT4geyBhY2NbYGNyZWF0ZSR7X3RpdGxlU2luZ3VsYXJ9YF0gPSBnbG9iYWxNdXRhdGlvblJlc29sdmVyOyByZXR1cm4gYWNjIH0sIHt9KVxuICAgIGxldCB1cGRhdGVSZXNvbHZlcnNTaW5ndWxhciA9IGNvbGxlY3Rpb25zLnJlZHVjZSgoYWNjLCB7IF90aXRsZVNpbmd1bGFyIH0pID0+IHsgYWNjW2B1cGRhdGUke190aXRsZVNpbmd1bGFyfWBdID0gZ2xvYmFsTXV0YXRpb25SZXNvbHZlcjsgcmV0dXJuIGFjYyB9LCB7fSlcbiAgICBsZXQgZGVsZXRlUmVzb2x2ZXJzU2luZ3VsYXIgPSBjb2xsZWN0aW9ucy5yZWR1Y2UoKGFjYywgeyBfdGl0bGVTaW5ndWxhciB9KSA9PiB7IGFjY1tgZGVsZXRlJHtfdGl0bGVTaW5ndWxhcn1gXSA9IGdsb2JhbE11dGF0aW9uUmVzb2x2ZXI7IHJldHVybiBhY2MgfSwge30pXG5cbiAgICAvLyBHcmFwaFFMIFJlbGF0aW9uc2hpcCBSZXNvbHZlclxuICAgIGxldCBnZW5lcmF0ZUdxbFJlbGF0aW9uc2hpcFJlc29sdmVyID0gKGYpID0+IChwLCBhLCByLCBpKSA9PiB7XG5cbiAgICAgICAgaWYgKCFwW2YuX25hbWVdPy5sZW5ndGgpIHJldHVybiBudWxsXG4gICAgICAgIGEuc2VhcmNoID0gYS5zZWFyY2ggfHwge31cblxuICAgICAgICBpZiAoZi5zaW5nbGUpIHtcbiAgICAgICAgICAgIGkuZmllbGROYW1lID0gZi5jb2xsZWN0aW9uXG4gICAgICAgICAgICBhLnNlYXJjaC5pZCA9IHBbZi5fbmFtZV1bMF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGkuZmllbGROYW1lID0gY29sbGVjdGlvbnMuZmluZChjID0+IGMuX3Npbmd1bGFyID09IGYuY29sbGVjdGlvbikuX25hbWVcbiAgICAgICAgICAgIGEuc2VhcmNoLmNvbXBhcmVJZCA9IHsgaW46IHBbZi5fbmFtZV0gfVxuICAgICAgICB9XG5cbiAgICAgICAgYS5saW1pdCA9IGEubGltaXQgfHwgOTk5OVxuICAgICAgICByZXR1cm4gZ2xvYmFsUXVlcnlSZXNvbHZlcihwLCBhLCByLCBpKVxuXG4gICAgfVxuXG4gICAgbGV0IGNvbnRhaW5zUmVsYXRpb25zaGlwID0gZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgICAgIGlmIChmaWVsZD8uX2ZpZWxkc0FycmF5Py5sZW5ndGgpIHJldHVybiBmaWVsZC5fZmllbGRzQXJyYXkuc29tZShmID0+IGNvbnRhaW5zUmVsYXRpb25zaGlwKGYpKVxuICAgICAgICByZXR1cm4gZmllbGQubmFtZSA9PSAncmVsYXRpb25zaGlwJ1xuICAgIH1cblxuICAgIGxldCByZWxhdGlvbnNoaXBSZWR1Y2VyID0gKGEsIGYpID0+IHtcbiAgICAgICAgYVtmLl9uYW1lXSA9IGdlbmVyYXRlR3FsUmVsYXRpb25zaGlwUmVzb2x2ZXIoZilcbiAgICAgICAgcmV0dXJuIGFcbiAgICB9XG5cbiAgICBsZXQgY29tcGxleFJlbGF0aW9uc2hpcFJlZHVjZXIgPSAoYSwgZikgPT4ge1xuICAgICAgICBpZiAoY29udGFpbnNSZWxhdGlvbnNoaXAoZikgJiYgZi5fZmllbGRzQXJyYXk/Lmxlbmd0aCkgZi5fZmllbGRzQXJyYXkuZmlsdGVyKGYgPT4gY29udGFpbnNSZWxhdGlvbnNoaXAoZikpLnJlZHVjZShjb21wbGV4UmVsYXRpb25zaGlwUmVkdWNlciwgYSlcbiAgICAgICAgbGV0IGNvbXBsZXhOYW1lID0gZi5fdGl0bGVUeXBlLmluY2x1ZGVzKCdbJykgPyBmLl90aXRsZVR5cGUucmVwbGFjZSgnWycsICcnKS5yZXBsYWNlKCddJywgJycpIDogZi5fdGl0bGVUeXBlXG4gICAgICAgIGlmIChmLm5hbWUgIT0gJ3JlbGF0aW9uc2hpcCcpIHsgYVtjb21wbGV4TmFtZV0gPSBmLl9maWVsZHNBcnJheS5maWx0ZXIoZiA9PiBmLm5hbWUgPT0gJ3JlbGF0aW9uc2hpcCcpLnJlZHVjZShyZWxhdGlvbnNoaXBSZWR1Y2VyLCB7fSkgfVxuICAgICAgICByZXR1cm4gYVxuICAgIH1cblxuICAgIC8vIFJlbGF0aW9uc2hpcCBSZXNvbHZlcnNcbiAgICBsZXQgcmVsYXRpb25zaGlwUmVzb2x2ZXJzID0gY29sbGVjdGlvbnMucmVkdWNlKChhY2MsIGMpID0+IHtcblxuICAgICAgICBsZXQgcmVsYXRpb25zaGlwcyA9IGMuX2ZpZWxkc0FycmF5LmZpbHRlcihmID0+IGYubmFtZSA9PSAncmVsYXRpb25zaGlwJykucmVkdWNlKHJlbGF0aW9uc2hpcFJlZHVjZXIsIHt9KVxuICAgICAgICBhY2NbYy5fdGl0bGVTaW5ndWxhcl0gPSByZWxhdGlvbnNoaXBzXG4gICAgICAgIHJldHVybiBhY2NcblxuICAgIH0sIHt9KVxuXG4gICAgLy8gQ29tcGxleCBSZWxhdGlvbnNoaXAgUmVzb2x2ZXJzXG4gICAgbGV0IGNvbXBsZXhSZXNvbHZlcnMgPSBjb2xsZWN0aW9ucy5yZWR1Y2UoKGFjYywgYykgPT4ge1xuXG4gICAgICAgIGxldCBjb21wbGV4ID0gYy5fZmllbGRzQXJyYXkuZmlsdGVyKGYgPT4gY29udGFpbnNSZWxhdGlvbnNoaXAoZikpLnJlZHVjZShjb21wbGV4UmVsYXRpb25zaGlwUmVkdWNlciwge30pXG4gICAgICAgIHJldHVybiB7IC4uLmFjYywgLi4uY29tcGxleCB9XG5cbiAgICB9LCB7fSlcblxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWxhdGlvbnNoaXBSZXNvbHZlcnMnLCByZWxhdGlvbnNoaXBSZXNvbHZlcnMpXG4gICAgLy8gY29uc29sZS5sb2coJ2NvbXBsZXhSZXNvbHZlcnMnLCBjb21wbGV4UmVzb2x2ZXJzKVxuXG4gICAgbGV0IHF1ZXJ5UmVzb2x2ZXJzID0geyAuLi5xdWVyeVJlc29sdmVyc1BsdXJhbCwgLi4ucXVlcnlSZXNvbHZlcnNTaW5ndWxhciB9XG4gICAgbGV0IG11dGF0aW9uUmVzb2x2ZXJzID0ge1xuICAgICAgICAuLi5jcmVhdGVSZXNvbHZlcnMsXG4gICAgICAgIC4uLnVwZGF0ZVJlc29sdmVycyxcbiAgICAgICAgLi4uZGVsZXRlUmVzb2x2ZXJzLFxuICAgICAgICAuLi5jcmVhdGVSZXNvbHZlcnNTaW5ndWxhcixcbiAgICAgICAgLi4udXBkYXRlUmVzb2x2ZXJzU2luZ3VsYXIsXG4gICAgICAgIC4uLmRlbGV0ZVJlc29sdmVyc1Npbmd1bGFyXG4gICAgfVxuXG5cbiAgICBsZXQgc3Vic2NyaXB0aW9uUmVzb2x2ZXJzID0gY29sbGVjdGlvbnMuZmlsdGVyKGMgPT4gYy5zdWJzY3JpYmUpLnJlZHVjZSgoYWNjLCBjKSA9PiB7XG5cbiAgICAgICAgbGV0IGV2ZW50TmFtZSA9IGAke2MuX3Npbmd1bGFyfUNoYW5nZWBcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2V2ZW50TmFtZScsIGV2ZW50TmFtZSlcbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IHt9XG4gICAgICAgIHN1YnNjcmlwdGlvbltldmVudE5hbWVdID0ge1xuICAgICAgICAgICAgc3Vic2NyaWJlOiB3aXRoRmlsdGVyKFxuICAgICAgICAgICAgICAgICgpID0+IHB1YnN1Yi5hc3luY0l0ZXJhdG9yKGV2ZW50TmFtZSksXG4gICAgICAgICAgICAgICAgKHBheWxvYWQsIHZhcmlhYmxlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUGF5bG9hZDonLCBwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1ZhcmlhYmxlczonLCB2YXJpYWJsZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIG5vIHZhcmlhYmxlcyBhcmUgcHJvdmlkZWQsIGxpc3RlbiB0byB0aGUgd2hvbGUgY29sbGVjdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhcmlhYmxlcyB8fCBPYmplY3Qua2V5cyh2YXJpYWJsZXMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhbGwgdmFyaWFibGVzIG1hdGNoIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgcGF5bG9hZCBmaWVsZHNcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhcmlhYmxlcykuZXZlcnkoa2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXlsb2FkW2V2ZW50TmFtZV1ba2V5XSA9PSB2YXJpYWJsZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cblxuXG4gICAgICAgIHJldHVybiB7IC4uLmFjYywgLi4uc3Vic2NyaXB0aW9uIH1cblxuICAgIH0sIHt9KVxuXG4gICAgLy8gY29uc29sZS5sb2coJ3N1YnNjcmlwdGlvblJlc29sdmVycycsIHN1YnNjcmlwdGlvblJlc29sdmVycylcblxuXG4gICAgY29uc3QgcmVzb2x2ZXJzID0ge1xuICAgICAgICBEYXRlVGltZTogZGF0ZVNjYWxhcixcblxuICAgICAgICBRdWVyeTogcXVlcnlSZXNvbHZlcnMsXG4gICAgICAgIC4uLnJlbGF0aW9uc2hpcFJlc29sdmVycyxcbiAgICAgICAgLi4uY29tcGxleFJlc29sdmVycyxcblxuICAgICAgICBNdXRhdGlvbjogbXV0YXRpb25SZXNvbHZlcnMsXG5cbiAgICAgICAgLy8gU3Vic2NyaXB0aW9uOiBzdWJzY3JpcHRpb25SZXNvbHZlcnMsXG4gICAgfTtcblxuICAgIGlmIChjb2xsZWN0aW9ucy5maWx0ZXIoYyA9PiBjLnN1YnNjcmliZSkubGVuZ3RoKSByZXNvbHZlcnMuU3Vic2NyaXB0aW9uID0gc3Vic2NyaXB0aW9uUmVzb2x2ZXJzXG5cbiAgICAvLyBjb25zb2xlLmxvZygncmVzb2x2ZXJzJywgcmVzb2x2ZXJzKVxuXG4gICAgcmV0dXJuIHsgdHlwZURlZnMsIHJlc29sdmVycyB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVHcWxcbiIsImltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBBeGlvcyBmcm9tICdheGlvcydcbmltcG9ydCAqIGFzIHN0cmVhbSBmcm9tICdzdHJlYW0nXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJ1xuY29uc3QgZmluaXNoZWQgPSBwcm9taXNpZnkoc3RyZWFtLmZpbmlzaGVkKVxuXG5hc3luYyBmdW5jdGlvbiBkb3dubG9hZEZpbGUoZmlsZVVybCwgb3V0cHV0TG9jYXRpb25QYXRoKSB7XG4gICAgbGV0IHRhcmdldEZvbGRlciA9IG91dHB1dExvY2F0aW9uUGF0aC5zcGxpdCgnLycpXG4gICAgdGFyZ2V0Rm9sZGVyID0gdGFyZ2V0Rm9sZGVyLnNsaWNlKDAsIHRhcmdldEZvbGRlci5sZW5ndGggLSAxKS5qb2luKCcvJylcbiAgICAvLyBsZXQgdGVzdEZvbGRlciA9IChgJHtfX2Rpcm5hbWV9Ly4uLy4uLy4uLy4uLy4uL3Rlc3RpbmdgKVxuICAgIC8vIGlmICghZnMuZXhpc3RzU3luYyh0ZXN0Rm9sZGVyKSkgZnMubWtkaXJTeW5jKHRlc3RGb2xkZXIpXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKCd0bXAnKSkgZnMubWtkaXJTeW5jKCd0bXAnKVxuICAgIGlmICghZnMuZXhpc3RzU3luYyh0YXJnZXRGb2xkZXIpKSBmcy5ta2RpclN5bmModGFyZ2V0Rm9sZGVyKVxuICAgIGNvbnN0IHdyaXRlciA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKG91dHB1dExvY2F0aW9uUGF0aClcbiAgICByZXR1cm4gQXhpb3Moe1xuICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICB1cmw6IGZpbGVVcmwsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ3N0cmVhbScsXG4gICAgfSkudGhlbihhc3luYyAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgcmVzcG9uc2UuZGF0YS5waXBlKHdyaXRlcilcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZpbmlzaGVkKHdyaXRlcikgLy90aGlzIGlzIGEgUHJvbWlzZVxuICAgIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRvd25sb2FkRmlsZVxuIiwibGV0IHNldHRpbmdzID0gcmVxdWlyZSgnQG1hbmdvL2NvbmZpZy9zZXR0aW5ncy5qc29uJylcblxuY29uc3QgQVBJX0tFWSA9IHNldHRpbmdzPy5lbWFpbFByb3ZpZGVyID09ICdtYWlsZ3VuJyA/IHNldHRpbmdzLm1haWxndW5LZXkgOiBzZXR0aW5ncy5yZXNlbmRLZXlcbmNvbnN0IERPTUFJTiA9IHNldHRpbmdzPy5tYWlsZ3VuRG9tYWluIHx8IHNldHRpbmdzPy5lbWFpbERvbWFpblxuXG5jb25zdCBmb3JtRGF0YSA9IHJlcXVpcmUoJ2Zvcm0tZGF0YScpXG5jb25zdCBNYWlsZ3VuID0gcmVxdWlyZSgnbWFpbGd1bi5qcycpXG5jb25zdCB7IFJlc2VuZCB9ID0gcmVxdWlyZSgncmVzZW5kJylcblxuY29uc3QgX21haWxndW4gPSBhc3luYyBmdW5jdGlvbiAoeyB0bywgZnJvbSwgYm9keSwgaHRtbCwgc3ViamVjdCwgcmVwbHlUbywgdGFnLCBjYywgYmNjLCBhdHRhY2htZW50IH0pIHtcblx0aHRtbCA9IGh0bWwgfHwgYm9keVxuXHRpZiAoIUFQSV9LRVkpIHJldHVybiBjb25zb2xlLmVycm9yKCdNYWlsZ3VuIG5vdCBjb25maWd1cmVkJylcblxuXHRjb25zdCBtYWlsZ3VuID0gbmV3IE1haWxndW4oZm9ybURhdGEpXG5cdGNvbnN0IGNsaWVudCA9IG1haWxndW4uY2xpZW50KHsgdXNlcm5hbWU6ICdhcGknLCBrZXk6IEFQSV9LRVkgfSlcblxuXHRsZXQgZGF0YSA9IHtcblx0XHRmcm9tOiBmcm9tIHx8IHNldHRpbmdzLmVtYWlsRnJvbSxcblx0XHR0byxcblx0XHRzdWJqZWN0LFxuXHRcdGh0bWw6IGh0bWwsXG5cdFx0J286ZGtpbSc6ICd5ZXMnLFxuXHR9XG5cblx0aWYgKHJlcGx5VG8pIGRhdGFbJ2g6UmVwbHktVG8nXSA9IHJlcGx5VG9cblx0aWYgKHRhZykgZGF0YVsnbzp0YWcnXSA9IHRhZ1xuXHRpZiAoYmNjKSBkYXRhLmJjYyA9IGJjY1xuXHRpZiAoY2MpIGRhdGEuY2MgPSBjY1xuXHRpZiAoYXR0YWNobWVudCkgZGF0YS5hdHRhY2htZW50ID0gYXR0YWNobWVudFxuXG5cdC8vIHJldHVybiBhd2FpdCBtYWlsZ3VuLm1lc3NhZ2VzKCkuc2VuZChkYXRhKVxuXHRyZXR1cm4gYXdhaXQgY2xpZW50Lm1lc3NhZ2VzLmNyZWF0ZShET01BSU4sIGRhdGEpXG59XG5cbmNvbnN0IF9yZXNlbmQgPSBhc3luYyBmdW5jdGlvbiAoeyB0bywgZnJvbSwgYm9keSwgaHRtbCwgc3ViamVjdCwgcmVwbHlUbywgdGFnLCBjYywgYmNjLCBhdHRhY2htZW50LCBoZWFkZXJzLCB0ZXh0IH0pIHtcblx0aHRtbCA9IGh0bWwgfHwgYm9keVxuXHRpZiAoIUFQSV9LRVkpIHJldHVybiBjb25zb2xlLmVycm9yKCdSZXNlbmQgbm90IGNvbmZpZ3VyZWQnKVxuXG5cdGNvbnN0IHJlc2VuZCA9IG5ldyBSZXNlbmQoQVBJX0tFWSlcblxuXHQvLyBQYXJzZSBlbWFpbCBhZGRyZXNzZXMgLSBSZXNlbmQgZXhwZWN0cyBzaW1wbGUgc3RyaW5nIGZvcm1hdFxuXHRjb25zdCBwYXJzZUVtYWlsID0gKGVtYWlsKSA9PiB7XG5cdFx0aWYgKCFlbWFpbCkgcmV0dXJuIHVuZGVmaW5lZFxuXHRcdC8vIElmIGVtYWlsIGNvbnRhaW5zIG5hbWUgPGVtYWlsQGRvbWFpbi5jb20+IGZvcm1hdCwgZXh0cmFjdCBqdXN0IHRoZSBlbWFpbFxuXHRcdGNvbnN0IGVtYWlsTWF0Y2ggPSBlbWFpbC5tYXRjaCgvPChbXj5dKyk+Lylcblx0XHRyZXR1cm4gZW1haWxNYXRjaCA/IGVtYWlsTWF0Y2hbMV0gOiBlbWFpbFxuXHR9XG5cblx0Ly8gUGFyc2UgZW1haWwgd2l0aCBuYW1lIC0gUmVzZW5kIGNhbiBhY2NlcHQgXCJOYW1lIDxlbWFpbEBkb21haW4uY29tPlwiIGZvcm1hdCBkaXJlY3RseVxuXHRjb25zdCBwYXJzZUVtYWlsV2l0aE5hbWUgPSAoZW1haWwsIGZhbGxiYWNrKSA9PiB7XG5cdFx0aWYgKCFlbWFpbCAmJiAhZmFsbGJhY2spIHJldHVybiB1bmRlZmluZWRcblx0XHRjb25zdCBlbWFpbFRvVXNlID0gZW1haWwgfHwgZmFsbGJhY2tcblx0XHRyZXR1cm4gZW1haWxUb1VzZVxuXHR9XG5cblx0Y29uc3QgdG9FbWFpbHMgPSBBcnJheS5pc0FycmF5KHRvKSA/IHRvIDogW3RvXVxuXHRjb25zdCBlbWFpbFBheWxvYWQgPSB7XG5cdFx0ZnJvbTogcGFyc2VFbWFpbFdpdGhOYW1lKGZyb20sIHNldHRpbmdzLmVtYWlsRnJvbSksXG5cdFx0dG86IHRvRW1haWxzLm1hcCgoZW1haWwpID0+IHBhcnNlRW1haWxXaXRoTmFtZShlbWFpbCkpLFxuXHRcdHN1YmplY3Q6IHN1YmplY3QsXG5cdFx0dGV4dDogdGV4dCxcblx0XHRodG1sOiBodG1sLFxuXHR9XG5cblx0aWYgKHJlcGx5VG8pIGVtYWlsUGF5bG9hZC5yZXBseVRvID0gW3BhcnNlRW1haWxXaXRoTmFtZShyZXBseVRvKV1cblx0aWYgKHRhZykge1xuXHRcdC8vIFJlc2VuZCByZXF1aXJlcyB0YWdzIHRvIGhhdmUgYm90aCBuYW1lIGFuZCB2YWx1ZSBwcm9wZXJ0aWVzXG5cdFx0Y29uc3QgdGFncyA9IEFycmF5LmlzQXJyYXkodGFnKSA/IHRhZyA6IFt0YWddXG5cdFx0ZW1haWxQYXlsb2FkLnRhZ3MgPSB0YWdzLm1hcCgodCwgaW5kZXgpID0+ICh7XG5cdFx0XHRuYW1lOiB0eXBlb2YgdCA9PT0gJ3N0cmluZycgPyBgdGFnXyR7aW5kZXh9YCA6IHQubmFtZSB8fCBgdGFnXyR7aW5kZXh9YCxcblx0XHRcdHZhbHVlOlxuXHRcdFx0XHR0eXBlb2YgdCA9PT0gJ3N0cmluZydcblx0XHRcdFx0XHQ/IHRcblx0XHRcdFx0XHRcdFx0LnRvTG93ZXJDYXNlKClcblx0XHRcdFx0XHRcdFx0Py50cmltKClcblx0XHRcdFx0XHRcdFx0Py5yZXBsYWNlKC9bXmEtekEtWjAtOVxcc10vZywgJycpXG5cdFx0XHRcdFx0XHRcdD8ucmVwbGFjZSgvXFxzL2csICctJylcblx0XHRcdFx0XHQ6IHQudmFsdWVcblx0XHRcdFx0XHRcdFx0LnRvTG93ZXJDYXNlKClcblx0XHRcdFx0XHRcdFx0Py50cmltKClcblx0XHRcdFx0XHRcdFx0Py5yZXBsYWNlKC9bXmEtekEtWjAtOVxcc10vZywgJycpXG5cdFx0XHRcdFx0XHRcdD8ucmVwbGFjZSgvXFxzL2csICctJykgfHwgJycsXG5cdFx0fSkpXG5cdH1cblx0aWYgKGhlYWRlcnMpIGVtYWlsUGF5bG9hZC5oZWFkZXJzID0gaGVhZGVyc1xuXG5cdGlmIChjYykge1xuXHRcdGNvbnN0IGNjRW1haWxzID0gQXJyYXkuaXNBcnJheShjYykgPyBjYyA6IFtjY11cblx0XHRlbWFpbFBheWxvYWQuY2MgPSBjY0VtYWlscy5tYXAoKGVtYWlsKSA9PiBwYXJzZUVtYWlsV2l0aE5hbWUoZW1haWwpKVxuXHR9XG5cblx0aWYgKGJjYykge1xuXHRcdGNvbnN0IGJjY0VtYWlscyA9IEFycmF5LmlzQXJyYXkoYmNjKSA/IGJjYyA6IFtiY2NdXG5cdFx0ZW1haWxQYXlsb2FkLmJjYyA9IGJjY0VtYWlscy5tYXAoKGVtYWlsKSA9PiBwYXJzZUVtYWlsV2l0aE5hbWUoZW1haWwpKVxuXHR9XG5cblx0aWYgKGF0dGFjaG1lbnQpIHtcblx0XHRjb25zdCBhdHRhY2htZW50cyA9IEFycmF5LmlzQXJyYXkoYXR0YWNobWVudCkgPyBhdHRhY2htZW50IDogW2F0dGFjaG1lbnRdXG5cdFx0ZW1haWxQYXlsb2FkLmF0dGFjaG1lbnRzID0gYXR0YWNobWVudHMubWFwKChmaWxlKSA9PiAoe1xuXHRcdFx0ZmlsZW5hbWU6IGZpbGUuZmlsZW5hbWUsXG5cdFx0XHRjb250ZW50OiBmaWxlLmRhdGEgfHwgZmlsZSwgLy8gUmVzZW5kIGV4cGVjdHMgYmFzZTY0IGVuY29kZWQgY29udGVudFxuXHRcdH0pKVxuXHR9XG5cblx0bGV0IHJlc3BvbnNlID0gYXdhaXQgcmVzZW5kLmVtYWlscy5zZW5kKGVtYWlsUGF5bG9hZClcblx0cmV0dXJuIHJlc3BvbnNlPy5kYXRhIHx8IHJlc3BvbnNlXG59XG5cbmNvbnN0IHNlbmRFbWFpbCA9IHNldHRpbmdzLmVtYWlsUHJvdmlkZXIgPT0gJ21haWxndW4nID8gX21haWxndW4gOiBfcmVzZW5kXG5cbmV4cG9ydCBjb25zdCBzZW5kQnVsa0VtYWlsID0gYXN5bmMgZnVuY3Rpb24gKGVtYWlscykge1xuXHQvLyBlbWFpbHMgPSBBcnJheS5pc0FycmF5KGVtYWlscykgPyBlbWFpbHMgOiBbZW1haWxzXVxuXHRpZiAoIXNldHRpbmdzPy5yZXNlbmRLZXkpIHJldHVybiBjb25zb2xlLmVycm9yKCdSZXNlbmQgbm90IGNvbmZpZ3VyZWQsIHBsZWFzZSBhZGQgXCJyZXNlbmRLZXlcIiB0byBzZXR0aW5ncy5qc29uJylcblxuXHRjb25zdCByZXNlbmQgPSBuZXcgUmVzZW5kKHNldHRpbmdzLnJlc2VuZEtleSlcblxuXHRjb25zdCBwYXJzZUVtYWlsV2l0aE5hbWUgPSAoZW1haWwsIGZhbGxiYWNrKSA9PiB7XG5cdFx0aWYgKCFlbWFpbCAmJiAhZmFsbGJhY2spIHJldHVybiB1bmRlZmluZWRcblx0XHRjb25zdCBlbWFpbFRvVXNlID0gZW1haWwgfHwgZmFsbGJhY2tcblx0XHRyZXR1cm4gZW1haWxUb1VzZVxuXHR9XG5cblx0Ly8gVHJhbnNmb3JtIGFycmF5IG9mIGVtYWlsIG9iamVjdHMgdG8gUmVzZW5kIGJhdGNoIGZvcm1hdFxuXHRjb25zdCBiYXRjaFBheWxvYWQgPSBlbWFpbHMubWFwKChlbWFpbCkgPT4ge1xuXHRcdGxldCB7IHRvLCBmcm9tLCBib2R5LCBodG1sLCBzdWJqZWN0LCByZXBseVRvLCB0YWcsIGNjLCBiY2MsIGhlYWRlcnMsIHRleHQgfSA9IGVtYWlsXG5cblx0XHRodG1sID0gaHRtbCB8fCBib2R5XG5cblx0XHRjb25zdCB0b0VtYWlscyA9IEFycmF5LmlzQXJyYXkodG8pID8gdG8gOiBbdG9dXG5cdFx0Y29uc3QgZW1haWxQYXlsb2FkID0ge1xuXHRcdFx0ZnJvbTogcGFyc2VFbWFpbFdpdGhOYW1lKGZyb20sIHNldHRpbmdzLmVtYWlsRnJvbSksXG5cdFx0XHR0bzogdG9FbWFpbHMubWFwKChlbWFpbCkgPT4gcGFyc2VFbWFpbFdpdGhOYW1lKGVtYWlsKSksXG5cdFx0XHRzdWJqZWN0OiBzdWJqZWN0LFxuXHRcdFx0aHRtbDogaHRtbCxcblx0XHRcdHRleHQ6IHRleHQsXG5cdFx0fVxuXG5cdFx0aWYgKHJlcGx5VG8pIGVtYWlsUGF5bG9hZC5yZXBseVRvID0gW3BhcnNlRW1haWxXaXRoTmFtZShyZXBseVRvKV1cblx0XHRpZiAodGFnKSB7XG5cdFx0XHQvLyBSZXNlbmQgcmVxdWlyZXMgdGFncyB0byBoYXZlIGJvdGggbmFtZSBhbmQgdmFsdWUgcHJvcGVydGllc1xuXHRcdFx0Y29uc3QgdGFncyA9IEFycmF5LmlzQXJyYXkodGFnKSA/IHRhZyA6IFt0YWddXG5cdFx0XHRlbWFpbFBheWxvYWQudGFncyA9IHRhZ3MubWFwKCh0LCBpbmRleCkgPT4gKHtcblx0XHRcdFx0bmFtZTogdHlwZW9mIHQgPT09ICdzdHJpbmcnID8gYHRhZ18ke2luZGV4fWAgOiB0Lm5hbWUgfHwgYHRhZ18ke2luZGV4fWAsXG5cdFx0XHRcdHZhbHVlOlxuXHRcdFx0XHRcdHR5cGVvZiB0ID09PSAnc3RyaW5nJ1xuXHRcdFx0XHRcdFx0PyB0XG5cdFx0XHRcdFx0XHRcdFx0LnRvTG93ZXJDYXNlKClcblx0XHRcdFx0XHRcdFx0XHQ/LnRyaW0oKVxuXHRcdFx0XHRcdFx0XHRcdD8ucmVwbGFjZSgvW15hLXpBLVowLTlcXHNdL2csICcnKVxuXHRcdFx0XHRcdFx0XHRcdD8ucmVwbGFjZSgvXFxzL2csICctJylcblx0XHRcdFx0XHRcdDogdC52YWx1ZVxuXHRcdFx0XHRcdFx0XHRcdC50b0xvd2VyQ2FzZSgpXG5cdFx0XHRcdFx0XHRcdFx0Py50cmltKClcblx0XHRcdFx0XHRcdFx0XHQ/LnJlcGxhY2UoL1teYS16QS1aMC05XFxzXS9nLCAnJylcblx0XHRcdFx0XHRcdFx0XHQ/LnJlcGxhY2UoL1xccy9nLCAnLScpIHx8ICcnLFxuXHRcdFx0fSkpXG5cdFx0fVxuXHRcdGlmIChoZWFkZXJzKSBlbWFpbFBheWxvYWQuaGVhZGVycyA9IGhlYWRlcnNcblxuXHRcdGlmIChjYykge1xuXHRcdFx0Y29uc3QgY2NFbWFpbHMgPSBBcnJheS5pc0FycmF5KGNjKSA/IGNjIDogW2NjXVxuXHRcdFx0ZW1haWxQYXlsb2FkLmNjID0gY2NFbWFpbHMubWFwKChlbWFpbCkgPT4gcGFyc2VFbWFpbFdpdGhOYW1lKGVtYWlsKSlcblx0XHR9XG5cblx0XHRpZiAoYmNjKSB7XG5cdFx0XHRjb25zdCBiY2NFbWFpbHMgPSBBcnJheS5pc0FycmF5KGJjYykgPyBiY2MgOiBbYmNjXVxuXHRcdFx0ZW1haWxQYXlsb2FkLmJjYyA9IGJjY0VtYWlscy5tYXAoKGVtYWlsKSA9PiBwYXJzZUVtYWlsV2l0aE5hbWUoZW1haWwpKVxuXHRcdH1cblxuXHRcdC8vIE5vdGU6IGF0dGFjaG1lbnRzIGFyZSBub3Qgc3VwcG9ydGVkIGluIFJlc2VuZCBiYXRjaCBBUElcblxuXHRcdHJldHVybiBlbWFpbFBheWxvYWRcblx0fSlcblxuXHRyZXR1cm4gYXdhaXQgcmVzZW5kLmJhdGNoLnNlbmQoYmF0Y2hQYXlsb2FkKVxufVxuXG5leHBvcnQgZGVmYXVsdCBzZW5kRW1haWxcbiIsImltcG9ydCBzZXR0aW5ncyBmcm9tIFwiQG1hbmdvL2NvbmZpZy9zZXR0aW5ncy5qc29uXCI7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgUzNDbGllbnQsIFB1dE9iamVjdENvbW1hbmQgfSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LXMzXCI7XG5pbXBvcnQgbWltZSBmcm9tICdtaW1lLXR5cGVzJ1xuXG5jb25zdCB1cGxvYWQgPSBhc3luYyBmdW5jdGlvbiAoeyBwYXRoLCBmaWxlbmFtZSwgZmlsZSB9KSB7XG5cbiAgICBpZiAoc2V0dGluZ3MuczNBY2Nlc3NLZXlJZCkge1xuXG4gICAgICAgIC8vIFNwbGl0IHRoZSBwYXRoXG4gICAgICAgIGNvbnN0IHBhdGhTZWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKTtcbiAgICAgICAgY29uc3QgYnVja2V0TmFtZSA9IHBhdGhTZWdtZW50c1swXTsgLy8gVGhlIGZpcnN0IHNlZ21lbnQgaXMgdGhlIGJ1Y2tldCBuYW1lXG4gICAgICAgIGNvbnN0IG9iamVjdEtleSA9IHBhdGhTZWdtZW50cy5zbGljZSgxKS5qb2luKCcvJykgKyAnLycgKyBmaWxlbmFtZTsgLy8gVGhlIHJlc3QgaXMgdGhlIG9iamVjdCBrZXlcbiAgICAgICAgY29uc3QgY29udGVudFR5cGUgPSBtaW1lLmxvb2t1cChmaWxlbmFtZSkgfHwgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGFuIFMzQ2xpZW50IGluc3RhbmNlXG4gICAgICAgIGNvbnN0IHMzQ2xpZW50ID0gbmV3IFMzQ2xpZW50KHtcbiAgICAgICAgICAgIHJlZ2lvbjogc2V0dGluZ3MuczNSZWdpb24sXG4gICAgICAgICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICAgICAgICAgIGFjY2Vzc0tleUlkOiBzZXR0aW5ncy5zM0FjY2Vzc0tleUlkLFxuICAgICAgICAgICAgICAgIHNlY3JldEFjY2Vzc0tleTogc2V0dGluZ3MuczNBY2Nlc3NLZXlTZWNyZXQsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHVwbG9hZFBhcmFtcyA9IHtcbiAgICAgICAgICAgIEJ1Y2tldDogYnVja2V0TmFtZSxcbiAgICAgICAgICAgIEtleTogb2JqZWN0S2V5LFxuICAgICAgICAgICAgQm9keTogZmlsZSxcbiAgICAgICAgICAgIENvbnRlbnRUeXBlOiBjb250ZW50VHlwZSxcbiAgICAgICAgfTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzM0NsaWVudC5zZW5kKG5ldyBQdXRPYmplY3RDb21tYW5kKHVwbG9hZFBhcmFtcykpO1xuICAgICAgICAgICAgLy8gQ29uc3RydWN0IHRoZSBsb2NhdGlvbiBtYW51YWxseS5cbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gYGh0dHBzOi8vJHtidWNrZXROYW1lfS5zMy4ke3NldHRpbmdzLnMzUmVnaW9ufS5hbWF6b25hd3MuY29tLyR7b2JqZWN0S2V5fWA7XG4gICAgICAgICAgICByZXR1cm4gbG9jYXRpb247XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgdXBsb2FkaW5nIHRvIFMzOlwiLCBlcnJvcik7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU3RyaXAgdGhlIGJ1Y2tldCBuYW1lIGZyb20gdGhlIGxvY2FsIHBhdGhcbiAgICAgICAgbGV0IGxvY2FsUGF0aCA9IHBhdGguc3BsaXQoJy8nKTtcbiAgICAgICAgbG9jYWxQYXRoLnNwbGljZSgwLCAxKTtcbiAgICAgICAgbG9jYWxQYXRoID0gbG9jYWxQYXRoLmpvaW4oJy8nKTtcblxuICAgICAgICBsZXQgbG9jYXRpb24gPSBgJHtsb2NhbFBhdGh9LyR7ZmlsZW5hbWV9YDtcblxuICAgICAgICAvLyBNYWtlIHN1cmUgYWxsIHRoZSBmb2xkZXJzIGV4aXN0XG4gICAgICAgIGxvY2FsUGF0aC5zcGxpdCgnLycpLnJlZHVjZSgoYSwgcCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGEpKSBmcy5ta2RpclN5bmMoYSk7XG4gICAgICAgICAgICBhID0gYSArICcvJyArIHA7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhsb2NhbFBhdGgpKSBmcy5ta2RpclN5bmMobG9jYWxQYXRoKTtcblxuICAgICAgICAvLyBXcml0ZSB0aGUgZmlsZSBhbmQgcmV0dXJuIHRoZSBVUkxcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhsb2NhdGlvbiwgZmlsZSk7XG4gICAgICAgIHJldHVybiBgaHR0cHM6Ly8ke3NldHRpbmdzLmRvbWFpbn0vJHtsb2NhdGlvbn1gO1xuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHVwbG9hZDtcbiIsImNvbnN0IHNldHRpbmdzID0gcmVxdWlyZShcIkBtYW5nby9jb25maWcvc2V0dGluZ3MuanNvblwiKTtcbmNvbnN0IG11bHRpcGFydCA9IHJlcXVpcmUoXCJjb25uZWN0LW11bHRpcGFydHlcIik7XG5cbmltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgY29ycyBmcm9tIFwiY29yc1wiO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSBcImJvZHktcGFyc2VyXCI7XG5pbXBvcnQgY29sbGVjdGlvbnMgZnJvbSBcIi4uL2NvbGxlY3Rpb25zXCI7XG5pbXBvcnQgY3JlYXRlQ29sbGVjdGlvbiBmcm9tIFwiLi4vY29sbGVjdGlvbnMvY3JlYXRlQ29sbGVjdGlvblwiO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG5pbXBvcnQgZ2VuZXJhdGVHcWwgZnJvbSBcIi4uL2dyYXBocWwvYXBvbGxvXCI7XG5pbXBvcnQgeyBBcG9sbG9TZXJ2ZXIgfSBmcm9tIFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCI7XG5pbXBvcnQgeyBjcmVhdGVTZXJ2ZXIgfSBmcm9tIFwiaHR0cFwiO1xuaW1wb3J0IHsgU2VydmVyIH0gZnJvbSAnc29ja2V0LmlvJztcblxuaW1wb3J0IGNsdXN0ZXIgZnJvbSAnY2x1c3RlcidcbmltcG9ydCByZWRpc0FkYXB0ZXIgZnJvbSAnc29ja2V0LmlvLXJlZGlzJztcblxuaW1wb3J0IG9zIGZyb20gXCJvc1wiO1xuY29uc3QgdG90YWxDUFVzID0gb3MuY3B1cygpLmxlbmd0aDtcbmNvbnN0IHdvcmtlcnMgPSBNYXRoLm1heChcbiAgMSxcbiAgTWF0aC5taW4oXG4gICAgTnVtYmVyKHNldHRpbmdzLm1hbmdvVGhyZWFkcyB8fCAxKSwgLy8gZGVmYXVsdCAxXG4gICAgdG90YWxDUFVzXG4gIClcbik7XG5cblxuXG5jb25zdCB7XG4gICAgRm9yYmlkZGVuRXJyb3IsXG4gICAgU2NoZW1hRGlyZWN0aXZlVmlzaXRvcixcbn0gPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIpO1xuY29uc3QgeyBkZWZhdWx0RmllbGRSZXNvbHZlciB9ID0gcmVxdWlyZShcImdyYXBocWxcIik7XG5cbmNsYXNzIGlzTG9nZ2VkaW5EaXJlY3RpdmUgZXh0ZW5kcyBTY2hlbWFEaXJlY3RpdmVWaXNpdG9yIHtcbiAgICB2aXNpdE9iamVjdChvYmopIHtcbiAgICAgICAgY29uc3QgZmllbGRzID0gb2JqLmdldEZpZWxkcygpO1xuICAgICAgICBPYmplY3Qua2V5cyhmaWVsZHMpLmZvckVhY2goKGZpZWxkTmFtZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmllbGQgPSBmaWVsZHNbZmllbGROYW1lXTtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsUmVzb2x2ZSA9IGZpZWxkLnJlc29sdmUgfHwgZGVmYXVsdEZpZWxkUmVzb2x2ZXI7XG4gICAgICAgICAgICBmaWVsZC5yZXNvbHZlID0gYXN5bmMgZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZXh0ID0gYXJnc1syXTtcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gY29udGV4dC51c2VyIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBGb3JiaWRkZW5FcnJvcihcIk5vdCBBdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgb3JpZ2luYWxSZXNvbHZlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmlzaXRGaWVsZERlZmluaXRpb24oZmllbGQpIHtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxSZXNvbHZlID0gZmllbGQucmVzb2x2ZSB8fCBkZWZhdWx0RmllbGRSZXNvbHZlcjtcbiAgICAgICAgZmllbGQucmVzb2x2ZSA9IGFzeW5jIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZmllbGQnLCBmaWVsZClcbiAgICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSBhcmdzWzJdO1xuICAgICAgICAgICAgY29uc3QgdXNlciA9IGNvbnRleHQudXNlciB8fCBcIlwiO1xuICAgICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEZvcmJpZGRlbkVycm9yKFwiTm90IEF1dGhvcml6ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgb3JpZ2luYWxSZXNvbHZlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jb25zdCByZXNvbHZlQ29udHJvbGxlcnMgPSBhc3luYyBmdW5jdGlvbiAoY29udHJvbGxlcnMsIGFwcCwgcGF0aCwgaW8pIHtcbiAgICBwYXRoID0gcGF0aCB8fCBcIlwiO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gY29udHJvbGxlcnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb250cm9sbGVyc1trZXldICE9IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgbGV0IG5ld1BhdGggPSBwYXRoICsga2V5ICsgXCIvXCI7XG4gICAgICAgICAgICBhd2FpdCByZXNvbHZlQ29udHJvbGxlcnMoY29udHJvbGxlcnNba2V5XSwgYXBwLCBuZXdQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtZXRob2RzID0ga2V5ID09ICcqJyA/IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZSddIDogW2tleV1cbiAgICAgICAgICAgIGxldCByZXNvbHZlciA9IGNvbnRyb2xsZXJzW2tleV07XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbWV0aG9kJywgbWV0aG9kKVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3BhdGgnLCBwYXRoKVxuICAgICAgICAgICAgZm9yIChsZXQgbWV0aG9kIG9mIG1ldGhvZHMpIHtcbiAgICAgICAgICAgICAgICBhcHBbbWV0aG9kXShgLyR7c2V0dGluZ3MuZW5kcG9pbnRTZWdtZW50IHx8ICdlbmRwb2ludHMnfS8ke3BhdGh9YCwgbXVsdGlwYXJ0KCksIGFzeW5jIChyZXEsIHJlcywgaW8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHJlc29sdmVyKHJlcSwgcmVzLCBpbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZVwiLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmNvbnN0IHN0YXJ0RXhwcmVzcyA9IGFzeW5jIGZ1bmN0aW9uIChtYWluLCBjb250cm9sbGVycykge1xuXG4gICAgLy8gY29uc29sZS5sb2coJ2NvbnRyb2xsZXJzJywgY29udHJvbGxlcnMpXG5cbiAgICAvLyBNYWtlIHN1cmUgYWxsIHRoZSBjb2xsZWN0aW9ucyBhcmUgYnVpbHRcbiAgICAvLyBjb2xsZWN0aW9ucy5mb3JFYWNoKGFzeW5jIGMgPT4gYXdhaXQgY3JlYXRlQ29sbGVjdGlvbihjKSlcbiAgICBmb3IgKGNvbnN0IGNvbGxlY3Rpb24gb2YgY29sbGVjdGlvbnMpIHtcbiAgICAgICAgYXdhaXQgY3JlYXRlQ29sbGVjdGlvbihjb2xsZWN0aW9uKTtcbiAgICB9XG5cbiAgICBsZXQgeyB0eXBlRGVmcywgcmVzb2x2ZXJzIH0gPSBnZW5lcmF0ZUdxbCgpO1xuXG4gICAgY29uc3QgYXBwID0gZXhwcmVzcygpO1xuXG4gICAgLy8gQ29uZmlndXJlIENPUlMgYmFzZWQgb24gc2V0dGluZ3NcbiAgICBjb25zdCBjb3JzT3JpZ2lucyA9IHNldHRpbmdzLmNvcnNPcmlnaW5zIHx8IFwiKlwiO1xuICAgIGNvbnN0IGNvcnNPcHRpb25zID0gY29yc09yaWdpbnMgPT09IFwiKlwiXG4gICAgICAgID8ge31cbiAgICAgICAgOiB7IG9yaWdpbjogY29yc09yaWdpbnMgfTtcblxuICAgIGFwcC51c2UoY29ycyhjb3JzT3B0aW9ucykpO1xuICAgIGFwcC51c2UoYm9keVBhcnNlci5qc29uKHsgbGltaXQ6IFwiNTAwbWJcIiB9KSk7XG4gICAgYXBwLnVzZShleHByZXNzLmpzb24oeyBsaW1pdDogJzUwMG1iJyB9KSk7XG4gICAgYXBwLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBsaW1pdDogXCI1MDBtYlwiLCBleHRlbmRlZDogdHJ1ZSwgcGFyYW1ldGVyTGltaXQ6IDEwMDAwMDAgfSkpO1xuICAgIC8vIGFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IHRydWUgfSkpO1xuICAgIGNvbnN0IHBvcnQgPSBzZXR0aW5ncy5wb3J0O1xuXG4gICAgLy8gR3JhcGhRTCBTdHVmZlxuICAgIGNvbnN0IGFwb2xsb1NlcnZlciA9IG5ldyBBcG9sbG9TZXJ2ZXIoe1xuICAgICAgICB0eXBlRGVmcyxcbiAgICAgICAgcmVzb2x2ZXJzLFxuICAgICAgICBzY2hlbWFEaXJlY3RpdmVzOiB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uUHJvdGVjdGVkOiBpc0xvZ2dlZGluRGlyZWN0aXZlLFxuICAgICAgICAgICAgZmllbGRQcm90ZWN0ZWQ6IGlzTG9nZ2VkaW5EaXJlY3RpdmUsXG4gICAgICAgICAgICBpc0xvZ2dlZGluOiBpc0xvZ2dlZGluRGlyZWN0aXZlLFxuICAgICAgICB9LFxuICAgICAgICBjb250ZXh0OiAoeyByZXEgfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlcTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZm9ybWF0UmVzcG9uc2U6IChyZXNwb25zZSwgY29udGV4dCkgPT4ge1xuICAgICAgICAvLyAgICAgaWYgKCFyZXNwb25zZS5kYXRhLl9fc2NoZW1hKSB7XG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlLmRhdGEudG90YWwnLCByZXNwb25zZS5kYXRhLnRvdGFsKVxuICAgICAgICAvLyAgICAgICAgIHJlc3BvbnNlLmV4dGVuc2lvbnMgPSB7IHRvdGFsOiAxMiB9XG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cbiAgICB9KTtcbiAgICBhcG9sbG9TZXJ2ZXIuYXBwbHlNaWRkbGV3YXJlKHsgYXBwIH0pO1xuXG4gICAgLy8gU3Vic2NyaXB0aW9uIGVuZHBvaW50XG4gICAgY29uc3Qgc2VydmVyID0gY3JlYXRlU2VydmVyKGFwcCk7XG4gICAgLy8gU2V0IHVwIFNvY2tldC5JTyB3aXRoIENPUlMgc3VwcG9ydFxuICAgIGNvbnN0IHNvY2tldENvcnNPcmlnaW4gPSBjb3JzT3JpZ2lucyA9PT0gXCIqXCIgPyB0cnVlIDogY29yc09yaWdpbnM7XG4gICAgY29uc3QgaW8gPSBuZXcgU2VydmVyKHNlcnZlciwge1xuICAgICAgICBjb3JzOiB7XG4gICAgICAgICAgICBvcmlnaW46IHNvY2tldENvcnNPcmlnaW4sXG4gICAgICAgICAgICBtZXRob2RzOiBbJ0dFVCcsICdQT1NUJ10sXG4gICAgICAgICAgICBjcmVkZW50aWFsczogdHJ1ZVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpby5hZGFwdGVyKHJlZGlzQWRhcHRlcih7IGhvc3Q6IHNldHRpbmdzPy5yZWRpc0hvc3QgfHwgJ2xvY2FsaG9zdCcsIHBvcnQ6IHNldHRpbmdzPy5yZWRpc1BvcnQgfHwgNjM3OSB9KSk7XG5cbiAgICBmb3IgKGxldCBjIG9mIGNvbGxlY3Rpb25zLmZpbHRlcihjID0+IGMuc3Vic2NyaWJlKSkge1xuXG4gICAgICAgIGNvbnN0IG5hbWVzcGFjZSA9IGlvLm9mKGAvJHtjLm5hbWV9YCk7XG4gICAgICAgIG5hbWVzcGFjZS5vbignY29ubmVjdGlvbicsIChzb2NrZXQpID0+IHtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coYFVzZXIgY29ubmVjdGVkOiAke3NvY2tldC5pZH1gKTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIHN1YnNjcmlwdGlvbiB0byBhIHRocmVhZCAoam9pbmluZyBhIHJvb20pXG4gICAgICAgICAgICBzb2NrZXQub24oJ3N1YnNjcmliZVRvVGhyZWFkJywgKHJvb21JZCkgPT4ge1xuICAgICAgICAgICAgICAgIHNvY2tldC5qb2luKHJvb21JZCk7ICAvLyByb29tSWQgaXMgdGhlIHJvb20gbmFtZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBVc2VyICR7c29ja2V0LmlkfSBzdWJzY3JpYmVkIHRvIHRocmVhZDogJHtyb29tSWR9YCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIHVuc3Vic2NyaWJpbmcgZnJvbSBhIHRocmVhZCAobGVhdmluZyBhIHJvb20pXG4gICAgICAgICAgICBzb2NrZXQub24oJ3Vuc3Vic2NyaWJlRnJvbVRocmVhZCcsIChyb29tSWQpID0+IHtcbiAgICAgICAgICAgICAgICBzb2NrZXQubGVhdmUocm9vbUlkKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgVXNlciAke3NvY2tldC5pZH0gdW5zdWJzY3JpYmVkIGZyb20gdGhyZWFkOiAke3Jvb21JZH1gKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgYSBuZXcgbWVzc2FnZSBiZWluZyBzZW50IHRvIGEgdGhyZWFkXG4gICAgICAgICAgICBzb2NrZXQub24oJ25ld01lc3NhZ2UnLCAoeyByb29tSWQsIG1lc3NhZ2UgfSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFNhdmUgdGhlIG1lc3NhZ2UgaW4gdGhlIFwibWVzc2FnZXNcIiBjb2xsZWN0aW9uIGluIE1vbmdvREIgKGV4YW1wbGUpXG4gICAgICAgICAgICAgICAgLy8gRXhhbXBsZTogY29uc3QgbmV3TWVzc2FnZSA9IGF3YWl0IE1lc3NhZ2VzLmNyZWF0ZSh7IHJvb21JZCwgYXV0aG9yLCBjb250ZW50IH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gRW1pdCB0aGUgbWVzc2FnZSB0byBhbGwgdXNlcnMgaW4gdGhlIHRocmVhZCAocm9vbSlcbiAgICAgICAgICAgICAgICBpby50byhyb29tSWQpLmVtaXQoJ21lc3NhZ2UnLCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgTWVzc2FnZSBzZW50IHRvIHRocmVhZCAke3Jvb21JZH06ICR7bWVzc2FnZS5jb250ZW50fWApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNvY2tldC5vbignZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgVXNlciBkaXNjb25uZWN0ZWQ6ICR7c29ja2V0LmlkfWApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvLyBzZXJ2ZXIubGlzdGVuKHBvcnQpO1xuXG4gICAgLy8gYXBvbGxvU2VydmVyLmluc3RhbGxTdWJzY3JpcHRpb25IYW5kbGVycyh3cyk7XG4gICAgLy8gd3MubGlzdGVuKHBvcnQpO1xuXG4gICAgaWYgKGNsdXN0ZXIuaXNNYXN0ZXIgfHwgY2x1c3Rlci5pc1ByaW1hcnkpIHtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgTnVtYmVyIG9mIENQVXMgaXMgJHt0b3RhbENQVXN9YCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBNYXN0ZXIgJHtwcm9jZXNzLnBpZH0gaXMgcnVubmluZ2ApO1xuICAgICAgICBwcm9jZXNzLmVudi5pc01hc3RlciA9IHRydWVcblxuICAgICAgICAvLyAvLyBDcmVhdGUgdGhlIHNlcnZlciBpbiB0aGUgbWFzdGVyIHByb2Nlc3NcbiAgICAgICAgLy8gc2VydmVyLmxpc3Rlbihwb3J0LCAnbG9jYWxob3N0JywgKCkgPT4ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coYE1hc3RlciBzZXJ2ZXIgbGlzdGVuaW5nIG9uIHBvcnQgJHtwb3J0fWApO1xuICAgICAgICAvLyB9KTtcblxuICAgICAgICAvLyBGb3JrIHdvcmtlcnMuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd29ya2VyczsgaSsrKSB7XG4gICAgICAgICAgICBjbHVzdGVyLmZvcmsoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3RhcnRCdWRnZXQgPSBuZXcgTWFwKCk7IC8vIHBpZCAtPiB7IGNvdW50LCBsYXN0IH1cblxuICAgICAgICBmdW5jdGlvbiBiYWNrb2ZmKG1zKSB7IHJldHVybiBuZXcgUHJvbWlzZShyID0+IHNldFRpbWVvdXQociwgbXMpKTsgfVxuXG4gICAgICAgIGNsdXN0ZXIub24oXCJleGl0XCIsIGFzeW5jICh3b3JrZXIsIGNvZGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBjb25zdCByZWMgPSByZXN0YXJ0QnVkZ2V0LmdldCh3b3JrZXIuaWQpIHx8IHsgY291bnQ6IDAsIGxhc3Q6IG5vdyB9O1xuICAgICAgICAgICAgY29uc3QgZWxhcHNlZCA9IG5vdyAtIHJlYy5sYXN0O1xuXG4gICAgICAgICAgICAvLyByZXNldCBidWRnZXQgaWYgc3RhYmxlIGZvciBhIG1pbnV0ZVxuICAgICAgICAgICAgcmVjLmNvdW50ID0gZWxhcHNlZCA+IDYwXzAwMCA/IDAgOiByZWMuY291bnQgKyAxO1xuICAgICAgICAgICAgcmVjLmxhc3QgPSBub3c7XG4gICAgICAgICAgICByZXN0YXJ0QnVkZ2V0LnNldCh3b3JrZXIuaWQsIHJlYyk7XG5cbiAgICAgICAgICAgIC8vIGV4cG9uZW50aWFsLWlzaCBiYWNrb2ZmOiAwLjVzLCAxcywgMnMsIC4uLiBjYXBwaW5nIGF0IDEwc1xuICAgICAgICAgICAgY29uc3QgZGVsYXkgPSBNYXRoLm1pbigxMF8wMDAsIDUwMCAqIDIgKiogcmVjLmNvdW50KTtcbiAgICAgICAgICAgIGF3YWl0IGJhY2tvZmYoZGVsYXkpO1xuXG4gICAgICAgICAgICBjbHVzdGVyLmZvcmsoKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvLyBVbmNvbW1lbnQgaWYgeW91IHdhbnQgaW5maW5pdGUgcHJvY2VzcyBkZWF0aCA7KVxuICAgICAgICAvLyB3cy5saXN0ZW4ocG9ydCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBcXG5cXG5cXG7inKggTGlzdGVuaW5nIGF0IGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fVxcbmApXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYFdvcmtlciAke3Byb2Nlc3MucGlkfSBzdGFydGVkYCk7XG4gICAgICAgIHNlcnZlci5saXN0ZW4ocG9ydCwgJzAuMC4wLjAnKTtcblxuICAgICAgICAvLyBhcHAudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coYFdvcmtlciAke3Byb2Nlc3MucGlkfSBoYW5kbGluZyAke3JlcS5tZXRob2R9ICR7cmVxLnVybH1gKTtcbiAgICAgICAgLy8gICAgIG5leHQoKTtcbiAgICAgICAgLy8gfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIEN1c3RvbSBjb250cm9sbGVycy9lbmRwb2ludHNcbiAgICBhd2FpdCByZXNvbHZlQ29udHJvbGxlcnMoY29udHJvbGxlcnMsIGFwcCwgbnVsbCwgaW8pO1xuXG4gICAgLy8gLy8gQ3VzdG9tIGNvbnRyb2xsZXJzXG4gICAgLy8gbGV0IGNvbnRyb2xsZXJzTWV0aG9kcyA9IE9iamVjdC5rZXlzKGNvbnRyb2xsZXJzKVxuICAgIC8vIGZvciAoY29uc3QgbWV0aG9kIG9mIGNvbnRyb2xsZXJzTWV0aG9kcykge1xuICAgIC8vICAgICBsZXQgcmVzb2x2ZXJzID0gT2JqZWN0LmtleXMoY29udHJvbGxlcnNbbWV0aG9kXSlcbiAgICAvLyAgICAgZm9yIChjb25zdCByZXNvbHZlck5hbWUgb2YgcmVzb2x2ZXJzKSB7XG4gICAgLy8gICAgICAgICBsZXQgcmVzb2x2ZXIgPSBjb250cm9sbGVyc1ttZXRob2RdW3Jlc29sdmVyTmFtZV1cbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdtZXRob2QnLCBtZXRob2QpXG4gICAgLy8gICAgICAgICBhcHBbbWV0aG9kXShgL2NvbnRyb2xsZXJzLyR7cmVzb2x2ZXJOYW1lfWAsIGFzeW5jIChyZXEsIHJlcykgPT4geyByZXMuc2VuZChhd2FpdCByZXNvbHZlcihyZXEpKSB9KVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgLy8gQXNzZXQgVXBsb2FkIGVuZHBvaW50c1xuICAgIGZvciAoY29uc3QgY29sbGVjdGlvbiBvZiBjb2xsZWN0aW9ucykge1xuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIGNvbGxlY3Rpb24uX2ZpZWxkc0FycmF5KSB7XG4gICAgICAgICAgICBpZiAoZmllbGQubmFtZSA9PSBcImFzc2V0XCIpIHtcbiAgICAgICAgICAgICAgICBhcHAucG9zdChcbiAgICAgICAgICAgICAgICAgICAgYC9hc3NldHMvJHtjb2xsZWN0aW9uLm5hbWV9LyovJHtmaWVsZC5fbmFtZX1gLFxuICAgICAgICAgICAgICAgICAgICBtdWx0aXBhcnQoKSxcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGQudXBsb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlkID0gcmVxLnBhdGguc3BsaXQoXCIvXCIpWzNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZpZWxkLnVwbG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXEuZmlsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IGNvbGxlY3Rpb24ubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IGZpZWxkLl9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTVEFSVDogVGVtcCBGaWxlIEhvbGRcblxuICAgIGxldCBtdWx0ZXIgPSByZXF1aXJlKFwibXVsdGVyXCIpO1xuXG4gICAgbGV0IHN0b3JhZ2UgPSBtdWx0ZXIuZGlza1N0b3JhZ2Uoe1xuICAgICAgICBkZXN0aW5hdGlvbjogZnVuY3Rpb24gKHJlcSwgZmlsZSwgY2IpIHtcbiAgICAgICAgICAgIGxldCB0bXBGb2xkZXIgPSAoYCR7X19kaXJuYW1lfS90bXBgKVxuICAgICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKHRtcEZvbGRlcikpIGZzLm1rZGlyU3luYyh0bXBGb2xkZXIpXG4gICAgICAgICAgICBjYihudWxsLCB0bXBGb2xkZXIpO1xuICAgICAgICB9LFxuICAgICAgICBmaWxlbmFtZTogZnVuY3Rpb24gKHJlcSwgZmlsZSwgY2IpIHtcbiAgICAgICAgICAgIGNvbnN0IHVuaXF1ZVN1ZmZpeCA9IERhdGUubm93KCkgKyBcIi1cIiArIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDFlOSk7XG4gICAgICAgICAgICBjYihcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIGZpbGUub3JpZ2luYWxuYW1lLnNwbGl0KFwiLlwiKVswXT8udHJpbSgpPy5yZXBsYWNlKC9bXmEtekEtWjAtOVxcc10vZywgJycpPy5yZXBsYWNlKC9cXHMvZywgJy0nKSArXG4gICAgICAgICAgICAgICAgXCItLS0tLVwiICtcbiAgICAgICAgICAgICAgICB1bmlxdWVTdWZmaXggK1xuICAgICAgICAgICAgICAgIFwiLlwiICtcbiAgICAgICAgICAgICAgICBmaWxlLm9yaWdpbmFsbmFtZS5zcGxpdChcIi5cIilbZmlsZS5vcmlnaW5hbG5hbWUuc3BsaXQoXCIuXCIpLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHVwbG9hZCA9IG11bHRlcih7IHN0b3JhZ2UgfSk7XG5cbiAgICBhcHAucG9zdChcIi91cGxvYWRcIiwgdXBsb2FkLmFueSgpLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgcmVzLnNlbmQoeyBwYXRoczogcmVxLmZpbGVzLm1hcCgoZikgPT4gZi5wYXRoLnNwbGl0KCcvYnVpbGQnKVsxXSkgfSk7XG4gICAgfSk7XG5cbiAgICBhcHAuZ2V0KFwiL3RtcC8qXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgICAgICByZXMuc2VuZEZpbGUoX19kaXJuYW1lICsgcmVxLnBhdGgpO1xuICAgIH0pO1xuXG4gICAgYXBwLmdldChcIi9hc3NldHMvKlwiLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICAgICAgcmVzLnNlbmRGaWxlKF9fZGlybmFtZSArIHJlcS5wYXRoKTtcbiAgICB9KTtcblxuICAgIC8vIEVORDogVGVtcCBGaWxlIEhvbGRcblxuICAgIGxldCByZXNwb25kID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IG1haW4ocmVxLCBpbyk7XG4gICAgICAgIGxldCBzdWNjZXNzID0gMjAwO1xuICAgICAgICBpZiAocmVxLm1ldGhvZCA9PSAnUE9TVCcpIHN1Y2Nlc3MgPSAyMDE7XG4gICAgICAgIGlmIChyZXEubWV0aG9kID09ICdERUxFVEUnKSBzdWNjZXNzID0gMjA0O1xuICAgICAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2U/LmF1dGhvcml6ZWQgPT09IGZhbHNlID8gNDAxIDogc3VjY2VzcztcbiAgICAgICAgc3RhdHVzID0gcmVzcG9uc2U/LnZhbGlkID09PSBmYWxzZSA/IDQwMCA6IHN0YXR1cztcbiAgICAgICAgc3RhdHVzID0gcmVzcG9uc2U/LnN1Y2Nlc3MgPT09IGZhbHNlID8gNTAwIDogc3RhdHVzO1xuICAgICAgICByZXMuc3RhdHVzKHN0YXR1cykuc2VuZChyZXNwb25zZSk7XG4gICAgfVxuXG4gICAgYXBwLmdldChcIi8qXCIsIHJlc3BvbmQpO1xuICAgIGFwcC5wb3N0KFwiLypcIiwgcmVzcG9uZCk7XG4gICAgYXBwLnB1dChcIi8qXCIsIHJlc3BvbmQpO1xuICAgIGFwcC5kZWxldGUoXCIvKlwiLCByZXNwb25kKTtcblxuICAgIC8vIGFwcC5saXN0ZW4ocG9ydCwgKCkgPT4ge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhgRXhhbXBsZSBhcHAgbGlzdGVuaW5nIGF0IGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fWApXG4gICAgLy8gfSlcblxuICAgIHJldHVybiBhcHA7XG59O1xuXG5leHBvcnQgeyBzdGFydEV4cHJlc3MgfTtcbiIsImNvbnN0IHNldHRpbmdzID0gcmVxdWlyZSgnQG1hbmdvL2NvbmZpZy9zZXR0aW5ncy5qc29uJylcbmltcG9ydCB7IE1vbmdvQ2xpZW50LCBPYmplY3RJZCB9IGZyb20gJ21vbmdvZGInXG5cbmNvbnN0IGNsaWVudCA9IG5ldyBNb25nb0NsaWVudChzZXR0aW5ncy5tb25nb1VSSSwge1xuXHRtYXhQb29sU2l6ZTogc2V0dGluZ3MubWF4UG9vbFNpemUgfHwgMTAwLCAvLyB3YXMgMTAwXG5cdG1pblBvb2xTaXplOiBzZXR0aW5ncy5taW5Qb29sU2l6ZSB8fCAwLCAvLyBkb24ndCBwaW4gaWRsZSBjb25uZWN0aW9uc1xuXHRtYXhJZGxlVGltZU1TOiBzZXR0aW5ncy5tYXhJZGxlVGltZU1TIHx8IDYwXzAwMCwgLy8gY2xvc2UgdHJ1bHkgaWRsZSBzb2NrZXRzXG5cdHdhaXRRdWV1ZVRpbWVvdXRNUzogc2V0dGluZ3Mud2FpdFF1ZXVlVGltZW91dE1TIHx8IDVfMDAwLCAvLyBmYWlsIGZhc3QgaWYgcG9vbCBleGhhdXN0ZWRcbn0pXG5jbGllbnQuY29ubmVjdCgpXG5jb25zdCBkYiA9IGNsaWVudC5kYihzZXR0aW5ncy5kYXRhYmFzZSlcblxuZnVuY3Rpb24gZm9ybWF0U2VhcmNoKHNlYXJjaCkge1xuXHQvLyBjb25zb2xlLmxvZygnc2VhcmNoJywgc2VhcmNoKVxuXG5cdGlmIChzZWFyY2g/LmlkKSB7XG5cdFx0c2VhcmNoLl9pZCA9IHNlYXJjaC5pZFxuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoc2VhcmNoLmlkKSkgc2VhcmNoLl9pZCA9IHNlYXJjaC5pZC5tYXAoKGlkKSA9PiBuZXcgT2JqZWN0SWQoaWQpKVxuXG5cdFx0aWYgKHNlYXJjaD8uaWQ/LiRpbikge1xuXHRcdFx0c2VhcmNoLl9pZCA9IHt9XG5cdFx0XHRzZWFyY2guX2lkLiRpbiA9IHNlYXJjaC5pZC4kaW4ubWFwKChpZCkgPT4gbmV3IE9iamVjdElkKGlkKSlcblx0XHR9XG5cblx0XHRpZiAoc2VhcmNoPy4kb3I/LnNvbWUoKHApID0+IHAuaWQpKSB7XG5cdFx0XHRmb3IgKGxldCBzIG9mIHNlYXJjaC4kb3IpIHtcblx0XHRcdFx0aWYgKHMuaWQpIHMuX2lkID0gbmV3IE9iamVjdElkKHMuaWQpXG5cdFx0XHRcdGRlbGV0ZSBzLmlkXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHNlYXJjaD8uaWQ/LiRuaW4pIHtcblx0XHRcdHNlYXJjaC5faWQgPSB7fVxuXHRcdFx0c2VhcmNoLl9pZC4kbmluID0gc2VhcmNoLmlkLiRuaW4ubWFwKChpZCkgPT4gbmV3IE9iamVjdElkKGlkKSlcblx0XHR9XG5cblx0XHQvLyBjb25zb2xlLmxvZygnc2VhcmNoJywgc2VhcmNoKVxuXG5cdFx0aWYgKHR5cGVvZiBzZWFyY2guaWQgPT09ICdzdHJpbmcnICYmIHNlYXJjaC5pZC5sZW5ndGggPT09IDI0KSB7XG5cdFx0XHRzZWFyY2guX2lkID0gbmV3IE9iamVjdElkKHNlYXJjaC5pZClcblx0XHR9XG5cblx0XHRkZWxldGUgc2VhcmNoLmlkXG5cdH1cblxuXHQvLyBjb25zb2xlLmxvZygnc2VhcmNoJywgc2VhcmNoKVxuXHQvLyBjb25zb2xlLmRpcihzZWFyY2gsIHsgZGVwdGg6IG51bGwgfSlcblxuXHRyZXR1cm4gc2VhcmNoXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUVudHJ5KHsgY29sbGVjdGlvbiwgZW50cnksIGRvY3VtZW50IH0gPSB7fSkge1xuXHQvLyBjb25zb2xlLmxvZygnZW50cnknLCBlbnRyeSlcblx0ZG9jdW1lbnQgPSBkb2N1bWVudCB8fCBlbnRyeVxuXHRyZXR1cm4gYXdhaXQgZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKS5pbnNlcnRPbmUoZG9jdW1lbnQpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlYWRFbnRyeSh7IGNvbGxlY3Rpb24sIHNlYXJjaCwgZmllbGRzID0gW10gfSA9IHt9KSB7XG5cdHNlYXJjaCA9IGZvcm1hdFNlYXJjaChzZWFyY2gpXG5cblx0bGV0IHByb2plY3Rpb24gPSBmaWVsZHMucmVkdWNlKChhLCBrKSA9PiB7XG5cdFx0YVtrXSA9IDFcblx0XHRhW2BfXyR7a31DYWNoZURhdGVgXSA9IDFcblx0XHRyZXR1cm4gYVxuXHR9LCB7fSlcblxuXHRpZiAoIWNvbGxlY3Rpb24pIHtcblx0XHRyZXR1cm4geyBlcnJvcjogJ1BsZWFzZSBzcGVjaWZ5IGEgY29sbGVjdGlvbi4nIH1cblx0fVxuXHRsZXQgcmVzdWx0ID0gYXdhaXQgZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKS5maW5kT25lKHNlYXJjaCwgeyBwcm9qZWN0aW9uIH0pXG5cdC8vIGlmIChjb2xsZWN0aW9uID09ICdyZXNvdXJjZXMnKSBjb25zb2xlLmxvZygncmVzdWx0JywgcmVzdWx0Py50aXRsZSwgcmVzdWx0Py5faWQpXG5cdGlmIChyZXN1bHQpIHtcblx0XHRyZXN1bHQuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25cblx0XHRyZXN1bHQuaWQgPSBTdHJpbmcocmVzdWx0Ll9pZClcblx0XHRyZXN1bHQuX2lkID0gcmVzdWx0LmlkXG5cdH1cblx0cmV0dXJuIHJlc3VsdFxufVxuXG5hc3luYyBmdW5jdGlvbiBjb3VudEVudHJpZXMoeyBjb2xsZWN0aW9uLCBzZWFyY2ggfSA9IHt9KSB7XG5cdHNlYXJjaCA9IGZvcm1hdFNlYXJjaChzZWFyY2gpXG5cdHJldHVybiBhd2FpdCBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pLmNvdW50RG9jdW1lbnRzKHNlYXJjaClcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVhZEVudHJpZXMoeyBjb2xsZWN0aW9uLCBzZWFyY2ggPSB7fSwgbGltaXQgPSAxMCwgcGFnZSA9IDAsIHNvcnQsIGZpZWxkcyA9IFtdLCBhZ2dyZWdhdGlvbiA9IG51bGwgfSA9IHt9KSB7XG5cdGlmIChhZ2dyZWdhdGlvbikge1xuXHRcdGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pLmFnZ3JlZ2F0ZShhZ2dyZWdhdGlvbikudG9BcnJheSgpXG5cdFx0cmV0dXJuIHJlc3VsdHMubWFwKChyKSA9PiAoe1xuXHRcdFx0Li4ucixcblx0XHRcdGNvbGxlY3Rpb24sXG5cdFx0XHRpZDogU3RyaW5nKHIuX2lkKSxcblx0XHRcdF9pZDogU3RyaW5nKHIuX2lkKSxcblx0XHR9KSlcblx0fVxuXG5cdHNlYXJjaCA9IGZvcm1hdFNlYXJjaChzZWFyY2gpXG5cblx0aWYgKCFzZWFyY2guJHRleHQgJiYgIXNvcnQpIHtcblx0XHRzb3J0ID0geyBjcmVhdGVkOiAtMSB9XG5cdH1cblxuXHQvLyBjb25zb2xlLmxvZygnc2VhcmNoJywgc2VhcmNoKVxuXHQvLyBpZiAoc2VhcmNoLiRhbmQpIHtcblx0Ly8gICAgIGNvbnNvbGUubG9nKCdzZWFyY2gnKVxuXHQvLyAgICAgY29uc29sZS5kaXIoc2VhcmNoLCB7IGRlcHRoOiBudWxsIH0pXG5cdC8vIH1cblxuXHRsZXQgcHJvamVjdGlvbiA9IGZpZWxkcy5yZWR1Y2UoKGEsIGspID0+IHtcblx0XHRhW2tdID0gMVxuXHRcdGFbYF9fJHtrfUNhY2hlRGF0ZWBdID0gMVxuXHRcdHJldHVybiBhXG5cdH0sIHt9KVxuXHQvLyBjb25zb2xlLmxvZygncHJvamVjdGlvbicsIHByb2plY3Rpb24pXG5cblx0aWYgKHNlYXJjaC4kdGV4dCkge1xuXHRcdHNvcnQgPSB7IHNjb3JlOiB7ICRtZXRhOiAndGV4dFNjb3JlJyB9IH1cblx0XHRwcm9qZWN0aW9uLnNjb3JlID0geyAkbWV0YTogJ3RleHRTY29yZScgfVxuXHR9XG5cblx0Ly8gaWYgKGZpZWxkcz8ubGVuZ3RoKSBjb25zb2xlLmxvZygncHJvamVjdGlvbicsIHByb2plY3Rpb24pXG5cblx0aWYgKHBhZ2UgPCAxKSB7XG5cdFx0cGFnZSA9IDFcblx0fSBlbHNlIHtcblx0XHRwYWdlID0gcGFnZSArIDFcblx0fVxuXG5cdC8vIGNvbnNvbGUubG9nKCdwYWdlJywgcGFnZSwgY29sbGVjdGlvbilcblx0Ly8gY29uc29sZS5sb2coJ3NvcnQnLCBzb3J0KVxuXG5cdGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBkYlxuXHRcdC5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pXG5cdFx0LmZpbmQoc2VhcmNoKVxuXHRcdC5wcm9qZWN0KHByb2plY3Rpb24pXG5cdFx0LnNvcnQoc29ydClcblx0XHQuc2tpcChwYWdlICogbGltaXQgLSBsaW1pdClcblx0XHQubGltaXQobGltaXQpXG5cdFx0LmFsbG93RGlza1VzZSgpXG5cblx0Ly8gY29uc29sZS5sb2coJ3Jlc3VsdHMnLCBhd2FpdCByZXN1bHRzLnRvQXJyYXkoKSlcblxuXHRyZXR1cm4gKGF3YWl0IHJlc3VsdHMudG9BcnJheSgpKS5tYXAoKHIpID0+ICh7XG5cdFx0Li4ucixcblx0XHRjb2xsZWN0aW9uLFxuXHRcdGlkOiBTdHJpbmcoci5faWQpLFxuXHRcdF9pZDogU3RyaW5nKHIuX2lkKSxcblx0fSkpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUVudHJ5KHsgY29sbGVjdGlvbiwgc2VhcmNoLCBkb2N1bWVudCB9ID0ge30pIHtcblx0c2VhcmNoID0gZm9ybWF0U2VhcmNoKHNlYXJjaClcblxuXHQvLyBjb25zb2xlLmxvZygnc2VhcmNoJywgc2VhcmNoKVxuXHQvLyBjb25zb2xlLnRyYWNlKClcblxuXHRkZWxldGUgZG9jdW1lbnQuX2lkXG5cdGRlbGV0ZSBkb2N1bWVudC5pZFxuXG5cdGxldCBvcGVyYXRpb24gPSB7ICRzZXQ6IGRvY3VtZW50IH1cblx0aWYgKE9iamVjdC5rZXlzKGRvY3VtZW50IHx8IHt9KS5pbmNsdWRlcygnJHNldCcpKSB7XG5cdFx0b3BlcmF0aW9uLiRzZXQgPSBkb2N1bWVudC4kc2V0XG5cdFx0ZGVsZXRlIGRvY3VtZW50LiRzZXRcblx0fVxuXHRpZiAoT2JqZWN0LmtleXMoZG9jdW1lbnQgfHwge30pLmluY2x1ZGVzKCckcHVzaCcpKSB7XG5cdFx0b3BlcmF0aW9uLiRwdXNoID0gZG9jdW1lbnQuJHB1c2hcblx0XHRkZWxldGUgZG9jdW1lbnQuJHB1c2hcblx0fVxuXHRpZiAoT2JqZWN0LmtleXMoZG9jdW1lbnQgfHwge30pLmluY2x1ZGVzKCckcHVsbCcpKSB7XG5cdFx0b3BlcmF0aW9uLiRwdWxsID0gZG9jdW1lbnQuJHB1bGxcblx0XHRkZWxldGUgZG9jdW1lbnQuJHB1bGxcblx0fVxuXHRpZiAoT2JqZWN0LmtleXMoZG9jdW1lbnQgfHwge30pLmluY2x1ZGVzKCckYWRkVG9TZXQnKSkge1xuXHRcdG9wZXJhdGlvbi4kYWRkVG9TZXQgPSBkb2N1bWVudC4kYWRkVG9TZXRcblx0XHRkZWxldGUgZG9jdW1lbnQuJGFkZFRvU2V0XG5cdH1cblx0aWYgKE9iamVjdC5rZXlzKGRvY3VtZW50IHx8IHt9KS5pbmNsdWRlcygnJGluYycpKSB7XG5cdFx0b3BlcmF0aW9uLiRpbmMgPSBkb2N1bWVudC4kaW5jXG5cdFx0ZGVsZXRlIGRvY3VtZW50LiRpbmNcblx0fVxuXHRpZiAoIU9iamVjdC5rZXlzKG9wZXJhdGlvbi4kc2V0KS5sZW5ndGgpIHtcblx0XHRkZWxldGUgb3BlcmF0aW9uLiRzZXRcblx0fVxuXG5cdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbikudXBkYXRlT25lKHNlYXJjaCwgb3BlcmF0aW9uKVxuXHRyZXR1cm4geyBtYXRjaGVkOiByZXN1bHQubWF0Y2hlZENvdW50LCBtb2RpZmllZDogcmVzdWx0Lm1vZGlmaWVkQ291bnQgfVxufVxuXG5hc3luYyBmdW5jdGlvbiB1cHNlcnRFbnRyeSh7IGNvbGxlY3Rpb24sIHNlYXJjaCwgdXBkYXRlZEVudHJ5IH0gPSB7fSkge1xuXHRzZWFyY2ggPSBmb3JtYXRTZWFyY2goc2VhcmNoKVxuXG5cdGRlbGV0ZSB1cGRhdGVkRW50cnkuX2lkXG5cdGRlbGV0ZSB1cGRhdGVkRW50cnkuaWRcblxuXHQvLyBjb25zb2xlLmxvZygndXBzZXJ0aW5nJywgY29sbGVjdGlvbiwgc2VhcmNoLCB1cGRhdGVkRW50cnkpXG5cblx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKS51cGRhdGVPbmUoc2VhcmNoLCB7ICRzZXQ6IHVwZGF0ZWRFbnRyeSB9LCB7IHVwc2VydDogdHJ1ZSB9KVxuXHRyZXR1cm4ge1xuXHRcdG1hdGNoZWQ6IHJlc3VsdC5tYXRjaGVkQ291bnQsXG5cdFx0bW9kaWZpZWQ6IHJlc3VsdC5tb2RpZmllZENvdW50LFxuXHRcdGluc2VydGVkOiByZXN1bHQudXBzZXJ0ZWRDb3VudCxcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVFbnRyaWVzKHsgY29sbGVjdGlvbiwgc2VhcmNoLCBkb2N1bWVudCB9ID0ge30pIHtcblx0c2VhcmNoID0gZm9ybWF0U2VhcmNoKHNlYXJjaClcblx0Y29uc3QgcmVzdWx0cyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbikudXBkYXRlTWFueShzZWFyY2gsIHsgJHNldDogZG9jdW1lbnQgfSlcblx0cmV0dXJuIHsgbWF0Y2hlZDogcmVzdWx0cy5tb2RpZmllZENvdW50LCBtb2RpZmllZDogcmVzdWx0cy5tb2RpZmllZENvdW50IH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlRW50cnkoeyBjb2xsZWN0aW9uLCBzZWFyY2ggfSA9IHt9KSB7XG5cdHNlYXJjaCA9IGZvcm1hdFNlYXJjaChzZWFyY2gpXG5cblx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uKS5kZWxldGVPbmUoc2VhcmNoKVxuXHRyZXR1cm4geyBkZWxldGVkOiByZXN1bHQuZGVsZXRlZENvdW50IH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlRW50cmllcyh7IGNvbGxlY3Rpb24sIHNlYXJjaCB9ID0ge30pIHtcblx0c2VhcmNoID0gZm9ybWF0U2VhcmNoKHNlYXJjaClcblxuXHRzZWFyY2ggPSBzZWFyY2ggfHwgeyB0aXRsZTogJ1lvdXIgTWFtbWEnIH1cblx0Y29uc3QgcmVzdWx0cyA9IGF3YWl0IGRiLmNvbGxlY3Rpb24oY29sbGVjdGlvbikuZGVsZXRlTWFueShzZWFyY2gpXG5cdHJldHVybiB7IGRlbGV0ZWQ6IHJlc3VsdHMuZGVsZXRlZENvdW50IH1cbn1cblxuZXhwb3J0IHsgZGIsIGNyZWF0ZUVudHJ5LCByZWFkRW50cnksIHJlYWRFbnRyaWVzLCBjb3VudEVudHJpZXMsIHVwZGF0ZUVudHJ5LCB1cHNlcnRFbnRyeSwgdXBkYXRlRW50cmllcywgZGVsZXRlRW50cnksIGRlbGV0ZUVudHJpZXMgfVxuIiwiZnVuY3Rpb24gcmVxdWlyZUFsbChyKSB7XG4gICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgci5rZXlzKCkubWFwKGZ1bmN0aW9uIChtcGF0aCwgLi4uYXJncykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcihtcGF0aCwgLi4uYXJncyk7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gbXBhdGhcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvKD86XlsuXFwvXSpcXC98XFwuW14uXSskKS9nLCBcIlwiKSAvLyBUcmltXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLy9nLCBcIl9cIik7IC8vIFJlbGFjZSAnLydzIGJ5ICdfJ3NcbiAgICAgICAgICAgIHJldHVybiBbbmFtZSwgcmVzdWx0XTtcbiAgICAgICAgfSlcbiAgICApO1xufVxuXG4vLyBsZXQgZGVmYXVsdFBsdWdpbnMgPSByZXF1aXJlQWxsKFxuLy8gICAgIHJlcXVpcmUuY29udGV4dChcbi8vICAgICAgICAgLy8gQW55IGtpbmQgb2YgdmFyaWFibGVzIGNhbm5vdCBiZSB1c2VkIGhlcmVcbi8vICAgICAgICAgXCIuL2RlZmF1bHRQbHVnaW5zL1wiLCAvLyAoV2VicGFjayBiYXNlZCkgcGF0aFxuLy8gICAgICAgICB0cnVlLCAvLyBVc2Ugc3ViZGlyZWN0b3JpZXNcbi8vICAgICAgICAgLy4qXFwuanMkLyAvLyBGaWxlIG5hbWUgcGF0dGVyblxuLy8gICAgIClcbi8vICk7XG5cbmxldCBwbHVnaW5zID0gcmVxdWlyZUFsbChcbiAgICByZXF1aXJlLmNvbnRleHQoXG4gICAgICAgIC8vIEFueSBraW5kIG9mIHZhcmlhYmxlcyBjYW5ub3QgYmUgdXNlZCBoZXJlXG4gICAgICAgIFwiQG1hbmdvL3BsdWdpbnMvXCIsIC8vIChXZWJwYWNrIGJhc2VkKSBwYXRoXG4gICAgICAgIHRydWUsIC8vIFVzZSBzdWJkaXJlY3Rvcmllc1xuICAgICAgICAvLipcXC5qcyQvIC8vIEZpbGUgbmFtZSBwYXR0ZXJuXG4gICAgKVxuKTtcblxuZnVuY3Rpb24gcHJvY2Vzc1BsdWdpbnMoYWxsUGx1Z2lucykge1xuXG4gICAgbGV0IHBsdWdpbnMgPSBPYmplY3Qua2V5cyhhbGxQbHVnaW5zKS5yZWR1Y2UoKGEsIHBsdWdpbk5hbWUpID0+IHtcblxuICAgICAgICAvLyBJZiBpdCdzIGEgc3ViZm9sZGVyLCBza2lwIGl0XG4gICAgICAgIC8vIGlmIChwbHVnaW5OYW1lLnNwbGl0KCdfJykubGVuZ3RoID4gMikgcmV0dXJuIGFcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3BsdWdpbk5hbWUnLCBwbHVnaW5OYW1lKVxuXG4gICAgICAgIGxldCBtb2R1bGVzID0gYWxsUGx1Z2luc1twbHVnaW5OYW1lXTtcbiAgICAgICAgbGV0IG9iamVjdFR5cGUgPSBwbHVnaW5OYW1lLnNwbGl0KCdfJylbMV07XG4gICAgICAgIGxldCBvYmplY3ROYW1lID0gcGx1Z2luTmFtZS5zcGxpdCgnXycpWzJdO1xuICAgICAgICBsZXQgdGl0bGVOYW1lID0gcGx1Z2luTmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHBsdWdpbk5hbWUuc2xpY2UoMSk7XG4gICAgICAgIHRpdGxlTmFtZSA9IHRpdGxlTmFtZS5zcGxpdCgnXycpWzBdO1xuICAgICAgICBsZXQgZXhpc3RpbmdQbHVnaW4gPSBhLmZpbmQocCA9PiBwLm5hbWUgPT0gdGl0bGVOYW1lKTtcbiAgICAgICAgbGV0IHBsdWdpbiA9IG9iamVjdFR5cGUgPT0gJ2luZGV4JyA/IHsgLi4ubW9kdWxlcy5kZWZhdWx0IH0gOiBleGlzdGluZ1BsdWdpbiB8fCB7fTtcbiAgICAgICAgcGx1Z2luLm5hbWUgPSB0aXRsZU5hbWU7XG4gICAgICAgIHBsdWdpbltvYmplY3RUeXBlXSA9IHBsdWdpbltvYmplY3RUeXBlXSB8fCB7fVxuICAgICAgICBpZiAob2JqZWN0TmFtZSA9PSAnaW5kZXgnKSB7XG4gICAgICAgICAgICBwbHVnaW5bb2JqZWN0VHlwZV0gPSB7IC4uLnBsdWdpbltvYmplY3RUeXBlXSwgLi4ubW9kdWxlcy5kZWZhdWx0IH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbHVnaW5bb2JqZWN0VHlwZV1bb2JqZWN0TmFtZV0gPSBtb2R1bGVzLmRlZmF1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFleGlzdGluZ1BsdWdpbikgYS5wdXNoKHBsdWdpbik7XG5cblxuICAgICAgICByZXR1cm4gYTtcbiAgICB9LCBbXSk7XG5cbiAgICAvLyBjb25zb2xlLmxvZygncGx1Z2lucycsIHBsdWdpbnMpXG5cbiAgICByZXR1cm4gcGx1Z2lucztcbn1cblxuLy8gZnVuY3Rpb24gZ2VuZXJhdGVEZWZhdWx0UGx1Z2lucygpIHtcbi8vICAgICByZXR1cm4gcHJvY2Vzc1BsdWdpbnMoZGVmYXVsdFBsdWdpbnMpO1xuLy8gfVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVBsdWdpbnMoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3NQbHVnaW5zKHBsdWdpbnMpO1xufVxuXG4vLyBkZWZhdWx0UGx1Z2lucyA9IHByb2Nlc3NQbHVnaW5zKGRlZmF1bHRQbHVnaW5zKTtcbnBsdWdpbnMgPSBwcm9jZXNzUGx1Z2lucyhwbHVnaW5zKTtcbi8vIGNvbnNvbGUubG9nKCdwbHVnaW5zJywgcGx1Z2lucylcbi8vIGNvbnN0IGFsbFBsdWdpbnMgPSB7IC4uLmRlZmF1bHRQbHVnaW5zLCAuLi5wbHVnaW5zIH07XG5cbmV4cG9ydCBkZWZhdWx0IHBsdWdpbnM7XG4iLCJpbXBvcnQgeyByZWFkRW50cnkgfSBmcm9tICcuLi8xLiBidWlsZC9saWJyYXJpZXMvbW9uZ28nXG5pbXBvcnQgeyBmb3JtYXRSZXF1ZXN0IH0gZnJvbSAnLi8xLiBmb3JtYXRSZXF1ZXN0J1xuaW1wb3J0IHsgYXV0aG9yaXplIH0gZnJvbSAnLi8yLiBhdXRob3JpemUnXG5pbXBvcnQgeyB2YWxpZGF0ZSwgYWZ0ZXJWYWxpZGF0aW9uIH0gZnJvbSAnLi8zLiB2YWxpZGF0ZSdcbmltcG9ydCB7IHByZVByb2Nlc3MgfSBmcm9tICcuLzQuIHByZVByb2Nlc3MnXG5pbXBvcnQgeyBwZXJmb3JtUXVlcnkgfSBmcm9tICcuLzUuIHF1ZXJ5J1xuaW1wb3J0IHsgcG9zdFByb2Nlc3MgfSBmcm9tICcuLzYuIHBvc3RQcm9jZXNzJ1xuaW1wb3J0IHsgcnVuSG9va3MgfSBmcm9tICcuLzcuIGhvb2tzJ1xuXG5pbXBvcnQgY29sbGVjdGlvbnMgZnJvbSAnLi4vMS4gYnVpbGQvY29sbGVjdGlvbnMnXG5cbmNvbnN0IHsgRm9yYmlkZGVuRXJyb3IsIFZhbGlkYXRpb25FcnJvciB9ID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTtcbmNvbnN0IHsgUHViU3ViIH0gPSByZXF1aXJlKCdhcG9sbG8tc2VydmVyJyk7XG5jb25zdCBwdWJzdWIgPSBuZXcgUHViU3ViKCk7XG5cbmZ1bmN0aW9uIGlzQ3ljbGljKG9iaikge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgdmFyIHN0YWNrID0gW107XG4gICAgdmFyIHN0YWNrU2V0ID0gbmV3IFNldCgpO1xuICAgIHZhciBkZXRlY3RlZCA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gZGV0ZWN0KG9iaiwga2V5KSB7XG4gICAgICAgIGlmIChvYmogJiYgdHlwZW9mIG9iaiAhPSAnb2JqZWN0JykgeyByZXR1cm47IH1cblxuICAgICAgICBpZiAoc3RhY2tTZXQuaGFzKG9iaikpIHsgLy8gaXQncyBjeWNsaWMhIFByaW50IHRoZSBvYmplY3QgYW5kIGl0cyBsb2NhdGlvbnMuXG4gICAgICAgICAgICB2YXIgb2xkaW5kZXggPSBzdGFjay5pbmRleE9mKG9iaik7XG4gICAgICAgICAgICB2YXIgbDEgPSBrZXlzLmpvaW4oJy4nKSArICcuJyArIGtleTtcbiAgICAgICAgICAgIHZhciBsMiA9IGtleXMuc2xpY2UoMCwgb2xkaW5kZXggKyAxKS5qb2luKCcuJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ0lSQ1VMQVI6ICcgKyBsMSArICcgPSAnICsgbDIgKyAnID0gJyArIG9iaik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhvYmopO1xuICAgICAgICAgICAgZGV0ZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICAgIHN0YWNrLnB1c2gob2JqKTtcbiAgICAgICAgc3RhY2tTZXQuYWRkKG9iaik7XG4gICAgICAgIGZvciAodmFyIGsgaW4gb2JqKSB7IC8vZGl2ZSBvbiB0aGUgb2JqZWN0J3MgY2hpbGRyZW5cbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrKSkgeyBkZXRlY3Qob2JqW2tdLCBrKTsgfVxuICAgICAgICB9XG5cbiAgICAgICAga2V5cy5wb3AoKTtcbiAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIHN0YWNrU2V0LmRlbGV0ZShvYmopO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGV0ZWN0KG9iaiwgJ29iaicpO1xuICAgIHJldHVybiBkZXRlY3RlZDtcbn1cblxubGV0IHByb2Nlc3NSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHJlcSwgaW8pIHtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdwcm9jZXNzUmVxdWVzdC5jYWxsZXInLCBwcm9jZXNzUmVxdWVzdC5jYWxsZXIpXG5cbiAgICAvLyBjb25zb2xlLmxvZygncmVxLm1ldGhvZCcsIHJlcS5tZXRob2QpXG4gICAgLy8gY29uc29sZS5sb2coJ3JlcS5wYXRoJywgcmVxLnBhdGgpXG4gICAgLy8gY29uc29sZS5kaXIocmVxLmJvZHksIHsgZGVwdGg6IG51bGwgfSlcbiAgICAvLyBjb25zb2xlLmxvZygncmVxLnF1ZXJ5JywgcmVxLnF1ZXJ5KVxuXG4gICAgLy8gQ3JlYXRlIHRoZSByZXNwb25zZSBvYmplY3RcbiAgICBsZXQgY2FsbFJlc3BvbnNlID0ge1xuICAgICAgICB2YWxpZDogbnVsbCxcbiAgICAgICAgYXV0aG9yaXplZDogbnVsbCxcbiAgICAgICAgcmVzcG9uc2U6IG51bGwsXG4gICAgICAgIHdhcm5pbmdzOiBudWxsLFxuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCdyZXEuYm9keScsIHJlcSlcblxuICAgIC8vIEZvcm1hdCB0aGUgcmVxdWVzdCBkYXRhIChtb3JlIHJlYWRhYmxlKVxuICAgIC8vIGNvbnNvbGUubG9nKCdmb3JtYXQnKVxuICAgIGxldCByZXF1ZXN0ID0gYXdhaXQgZm9ybWF0UmVxdWVzdChyZXEpXG4gICAgLy8gY29uc29sZS5sb2coJ3JlcXVlc3QubWV0aG9kJywgcmVxdWVzdC5tZXRob2QpXG5cbiAgICAvLyBCQ1IgSG90IEZpeCEhXG4gICAgLy8gaWYgKHJlcXVlc3QuY29sbGVjdGlvbiA9PSAnb3Bwb3J0dW5pdGllcycgJiYgcmVxdWVzdD8uZmllbGRzPy5pbmNsdWRlcygnb3duZXJJbmZvLmZpcnN0TmFtZScpICYmIHJlcXVlc3Q/LmxpbWl0ID09IDEwKSB7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCdzdXByZXNzaW5nIGZvciBob3QgZml4JylcbiAgICAvLyAgICAgcmV0dXJuXG4gICAgLy8gfVxuXG5cbiAgICAvLyBHZXQgdGhlIG9sZCBkb2N1bWVudCBpZiBpdCdzIGFuIHVwZGF0ZSBvciBkZWxldGUgKGZvciBob29rcylcbiAgICBsZXQgZ2V0T0QgPSBbJ3VwZGF0ZScsICdkZWxldGUnXS5pbmNsdWRlcyhyZXF1ZXN0Lm1ldGhvZCkgJiYgISEocmVxdWVzdC5pZCB8fCByZXF1ZXN0Py5zZWFyY2g/LmlkKVxuICAgIGxldCBvcmlnaW5hbERvY3VtZW50ID0gZ2V0T0QgPyAoYXdhaXQgcHJvY2Vzc1JlcXVlc3QoeyAuLi5yZXEsIHBhdGg6IGAvJHtyZXF1ZXN0LmNvbGxlY3Rpb259LyR7cmVxdWVzdC5pZCB8fCByZXF1ZXN0Py5zZWFyY2g/LmlkfWAsIG1ldGhvZDogJ3JlYWQnLCBib2R5OiBudWxsLCBkZXB0aExpbWl0OiAwLCBtZW1iZXI6IHJlcXVlc3QubWVtYmVyIH0pKT8ucmVzcG9uc2UgOiBudWxsXG4gICAgcmVxdWVzdC5vcmlnaW5hbERvY3VtZW50ID0gb3JpZ2luYWxEb2N1bWVudFxuXG4gICAgLy8gQXV0aG9yaXphdGlvblxuICAgIC8vIGNvbnNvbGUubG9nKCdhdXRob3JpemF0aW9uJylcbiAgICBjb25zdCBhdXRob3JpemF0aW9uID0gYXdhaXQgYXV0aG9yaXplKHJlcXVlc3QsIHJlcSkuY2F0Y2goY29uc29sZS5lcnJvcilcbiAgICBpZiAoIWF1dGhvcml6YXRpb24uYXV0aG9yaXplZCkge1xuICAgICAgICBjYWxsUmVzcG9uc2UuYXV0aG9yaXplZCA9IGZhbHNlO1xuICAgICAgICBjYWxsUmVzcG9uc2UucmVzcG9uc2UgPSBhdXRob3JpemF0aW9uLnJlc3BvbnNlO1xuICAgICAgICBjb25zb2xlLmxvZygnYXV0aCBlcnJvcicsIGNhbGxSZXNwb25zZS5yZXNwb25zZSlcblxuICAgICAgICAvLyBPbmx5IGRvIHRoaXMgaWYgaXQncyBhIEdRTCByZXNwb25zZVxuICAgICAgICBpZiAocmVxdWVzdC5hcGlNZXRob2QgPT0gJ2dyYXBocWwnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRm9yYmlkZGVuRXJyb3IoYE5vdCBBdXRob3JpemVkOiAke2NhbGxSZXNwb25zZS5yZXNwb25zZX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWxsUmVzcG9uc2VcbiAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsUmVzcG9uc2UuYXV0aG9yaXplZCA9IHRydWVcbiAgICB9XG5cbiAgICAvLyBWYWxpZGF0aW9uXG4gICAgLy8gY29uc29sZS5sb2coJ3ZhbGlkYXRpb24nKVxuICAgIGNvbnN0IHZhbGlkYXRpb24gPSBhd2FpdCB2YWxpZGF0ZShyZXF1ZXN0KS5jYXRjaChjb25zb2xlLmVycm9yKVxuICAgIGlmICghdmFsaWRhdGlvbi52YWxpZCkge1xuICAgICAgICBjYWxsUmVzcG9uc2UudmFsaWQgPSBmYWxzZTtcbiAgICAgICAgY2FsbFJlc3BvbnNlLnJlc3BvbnNlID0gdmFsaWRhdGlvbi5yZXNwb25zZSA/PyAnJztcbiAgICAgICAgaWYgKHZhbGlkYXRpb24uZmllbGRFcnJvcnMpIHtcbiAgICAgICAgICAgIGNhbGxSZXNwb25zZS5maWVsZEVycm9ycyA9IHZhbGlkYXRpb24uZmllbGRFcnJvcnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbGlkYXRpb24ucmVzcG9uc2UgJiYgIXZhbGlkYXRpb24ucmVzcG9uc2U/LmluY2x1ZGVzKCdmYXZpY29uLmljbycpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVmFsaWRhdGlvbiBFcnJvcjonLCB2YWxpZGF0aW9uLnJlc3BvbnNlKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gT25seSBkbyB0aGlzIGlmIGl0J3MgYSBHUUwgcmVzcG9uc2VcbiAgICAgICAgaWYgKHJlcXVlc3QuYXBpTWV0aG9kID09ICdncmFwaHFsJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihgTm90IFZhbGlkOiAke2NhbGxSZXNwb25zZS5yZXNwb25zZX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWxsUmVzcG9uc2VcbiAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsUmVzcG9uc2UudmFsaWQgPSB0cnVlXG4gICAgfVxuXG4gICAgLy8gcHJlUHJvY2VzcyAob25seSBydW5zIG9uIG11dGF0aW9uKVxuICAgIC8vIGNvbnNvbGUubG9nKCdwcmVQcm9jZXNzJylcbiAgICByZXF1ZXN0LmRvY3VtZW50ID0gYXdhaXQgcHJlUHJvY2VzcyhyZXF1ZXN0KVxuXG4gICAgaWYgKHJlcXVlc3QuZHJhZnQpIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgcG9zdFByb2Nlc3MocmVxdWVzdC5kb2N1bWVudCwgcmVxdWVzdCwgcmVxKVxuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCByZXNwb25zZSB9XG4gICAgfVxuXG4gICAgLy8gUnVuIHRoZSBxdWVyeVxuICAgIC8vIGNvbnNvbGUubG9nKCdwZXJmb3JtUXVlcnknKVxuICAgIGxldCBxdWVyeVJlc3VsdCA9IGF3YWl0IHBlcmZvcm1RdWVyeShyZXF1ZXN0KS5jYXRjaChjb25zb2xlLmVycm9yKVxuICAgIGxldCByYXdEb2N1bWVudCA9IHF1ZXJ5UmVzdWx0Py5jb250ZW50ID8geyAuLi5xdWVyeVJlc3VsdC5jb250ZW50IH0gOiB7fVxuXG4gICAgLy8gSWYgd2UncmUgZGVsZXRpbmcgc29tZXRoaW5nLCB3ZSdyZSBkb25lLlxuICAgIGlmIChyZXF1ZXN0Lm1ldGhvZCA9PSAnZGVsZXRlJykge1xuICAgICAgICBjYWxsUmVzcG9uc2UgPSB7IC4uLmNhbGxSZXNwb25zZSwgZGVsZXRlZDogcXVlcnlSZXN1bHQuZGVsZXRlZCB9XG4gICAgfSBlbHNlIHtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShxdWVyeVJlc3VsdC5jb250ZW50KSkge1xuICAgICAgICAgICAgaWYgKHF1ZXJ5UmVzdWx0LmNvdW50KSBjYWxsUmVzcG9uc2UuY291bnQgPSBxdWVyeVJlc3VsdC5jb3VudFxuICAgICAgICAgICAgcmVxdWVzdC5wYXJlbnRzID0gWy4uLnJlcXVlc3QucGFyZW50cywgLi4ucXVlcnlSZXN1bHQuY29udGVudC5tYXAoZSA9PiBlLmlkKV1cbiAgICAgICAgfSBlbHNlIGlmIChxdWVyeVJlc3VsdC5jb250ZW50Py5pZCkge1xuICAgICAgICAgICAgcmVxdWVzdC5wYXJlbnRzID0gWy4uLnJlcXVlc3QucGFyZW50cywgLi4ucXVlcnlSZXN1bHQuY29udGVudC5pZF1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHBvc3RQcm9jZXNzXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwb3N0UHJvY2VzcycpXG4gICAgICAgIHF1ZXJ5UmVzdWx0ID0gYXdhaXQgcG9zdFByb2Nlc3MocXVlcnlSZXN1bHQuY29udGVudCwgcmVxdWVzdCwgcmVxKS8vLmNhdGNoKGNvbnNvbGUuZXJyb3IpXG4gICAgICAgIGNhbGxSZXNwb25zZS5yZXNwb25zZSA9IHF1ZXJ5UmVzdWx0XG4gICAgICAgIGNhbGxSZXNwb25zZS5zdWNjZXNzID0gdHJ1ZVxuXG4gICAgfVxuXG4gICAgLy8gUnVuIHRoZSBob29rc1xuICAgIC8vIGNvbnNvbGUubG9nKCdydW5Ib29rcycpXG4gICAgLy8gY29uc29sZS5sb2coJ3F1ZXJ5UmVzdWx0JywgcXVlcnlSZXN1bHQpXG4gICAgaWYgKHJlcXVlc3QubWV0aG9kID09ICdyZWFkJykgb3JpZ2luYWxEb2N1bWVudCA9IHF1ZXJ5UmVzdWx0XG4gICAgYXdhaXQgcnVuSG9va3MoeyByZXEsIHJlcXVlc3QsIGRvY3VtZW50OiBxdWVyeVJlc3VsdCwgcmF3RG9jdW1lbnQsIG9yaWdpbmFsRG9jdW1lbnQsIGlvIH0pXG5cbiAgICBjYWxsUmVzcG9uc2Uud2FybmluZ3MgPSByZXF1ZXN0Py53YXJuaW5nc1xuICAgIHJldHVybiBjYWxsUmVzcG9uc2VcblxufVxuXG5leHBvcnQgeyBwdWJzdWIsIHByb2Nlc3NSZXF1ZXN0IH1cbiIsImltcG9ydCB7IHJlYWRFbnRyeSB9IGZyb20gJy4uLzEuIGJ1aWxkL2xpYnJhcmllcy9tb25nbydcbmltcG9ydCBjb2xsZWN0aW9ucyBmcm9tICcuLi8xLiBidWlsZC9jb2xsZWN0aW9ucydcbmltcG9ydCB7IHJlYWRFbnRyaWVzIH0gZnJvbSAnLi4vMS4gYnVpbGQvbGlicmFyaWVzL21vbmdvJ1xuaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXG5cbmFzeW5jIGZ1bmN0aW9uIGdldE1lbWJlcihyZXEpIHtcblxuICAgIGlmIChyZXEubWVtYmVyKSByZXR1cm4gcmVxLm1lbWJlclxuICAgIGxldCBtZW1iZXJcbiAgICB0cnkge1xuXG4gICAgICAgIC8vIFdhdGNoIG91dCBiZWNhdXNlIHRoZSBBV1MgTGFtYmRhIGZ1bmN0aW9ucyBhdXRob3JpemUgdGhyb3VnaCB7cmVxPy5oZWFkZXJzPy51c2VyID09IGlkfVxuICAgICAgICBsZXQgaGFzaCA9IHJlcT8uaGVhZGVycz8uYXV0aG9yaXphdGlvbi5zcGxpdCgnOicpWzBdXG4gICAgICAgIGxldCBpZCA9IHJlcT8uaGVhZGVycz8uYXV0aG9yaXphdGlvbi5zcGxpdCgnOicpWzFdXG4gICAgICAgIG1lbWJlciA9IGF3YWl0IHJlYWRFbnRyeSh7IGNvbGxlY3Rpb246ICdtZW1iZXJzJywgc2VhcmNoOiB7IFwicGFzc3dvcmQuaGFzaFwiOiBoYXNoLCBpZCwgc3RhdHVzOiB7ICRuaW46IFsnY2xvc2VkJywgJ2Rpc2FibGVkJ10gfSB9IH0pXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtZW1iZXInLCBtZW1iZXIpXG5cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdlJywgZSlcbiAgICB9XG5cbiAgICBtZW1iZXIgPSBtZW1iZXIgfHwge31cbiAgICBtZW1iZXIucm9sZXMgPSBtZW1iZXI/LnJvbGVzIHx8IFtdXG4gICAgbWVtYmVyID0gbWVtYmVyID8geyAuLi5tZW1iZXIsIHJvbGVzOiBbLi4ubWVtYmVyLnJvbGVzLCAncHVibGljJ10gfSA6IHsgcm9sZXM6IFsncHVibGljJ10gfVxuICAgIHJlcS5tZW1iZXIgPSBtZW1iZXJcblxuICAgIHJldHVybiBtZW1iZXJcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmluZElkKGNvbGxlY3Rpb24sIGdpdmVuSWQpIHtcblxuICAgIC8vIElmIGl0J3MgYSBtb25nb2RiIGlkXG4gICAgY29uc3Qgb2JqZWN0SWRQYXR0ZXJuID0gL15bYS1mQS1GMC05XXsyNH0kLztcbiAgICBpZiAob2JqZWN0SWRQYXR0ZXJuLnRlc3QoZ2l2ZW5JZCkpIHJldHVybiBnaXZlbklkXG5cbiAgICBsZXQgZW50cnlcblxuICAgIC8vIENGTCBSZXNvbHZlclxuICAgIGlmICghaXNOYU4oZ2l2ZW5JZCkpIHtcbiAgICAgICAgaWYgKE51bWJlcihnaXZlbklkKSkge1xuICAgICAgICAgICAgZW50cnkgPSBhd2FpdCByZWFkRW50cnkoeyBjb2xsZWN0aW9uLCBzZWFyY2g6IHsgZW50cnlJZDogTnVtYmVyKGdpdmVuSWQpIH0sIGZpZWxkczogW1wiaWRcIl0gfSlcbiAgICAgICAgfVxuICAgICAgICAvLyBTbHVnIFJlc29sdmVyXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZW50cnkgPSBhd2FpdCByZWFkRW50cnkoeyBjb2xsZWN0aW9uLCBzZWFyY2g6IHsgc2x1ZzogZ2l2ZW5JZCB9LCBmaWVsZHM6IFtcImlkXCJdIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIGVudHJ5Py5pZCB8fCBnaXZlbklkXG5cbn1cblxuXG4vKlxuICAgIEFERCBUTyBIRUFERVJTOlxuXG4gICAge1xuICAgICAgICBcImF1dGhvcml6YXRpb25cIjogXCJZMjVsYVdabGNuUkFibU5tYVdNdWIzSm5PM1JvYm1kek5FMHpcIlxuICAgIH1cblxuICAgIGJ0b2EoJ3VzZXJuYW1lO3Bhc3N3b3JkJylcblxuKi9cblxuLy8gZnVuY3Rpb24gaGFzaFBhc3N3b3JkKHBhc3N3b3JkLCBzYWx0LCBieXRlU2l6ZSkge1xuXG4vLyAgICAgY29uc3QgaGFzaEFsZ29zID0ge1xuLy8gICAgICAgICAxMjg6ICdzaGE1MTInLFxuLy8gICAgICAgICA2NDogJ3NoYTI1NicsXG4vLyAgICAgICAgIDQwOiAnc2hhMScsXG4vLyAgICAgICAgIDMyOiAnbWQ1Jyxcbi8vICAgICB9XG5cbi8vICAgICBsZXQgc2VsZWN0ZWRBbGdvID0gaGFzaEFsZ29zW2J5dGVTaXplXVxuLy8gXHRpZiAoIXNlbGVjdGVkQWxnbykgcmV0dXJuIGZhbHNlXG5cbi8vICAgICBsZXQgaGFzaGVkUGFzc3dvcmQgPSBjcnlwdG8uY3JlYXRlSGFzaChzZWxlY3RlZEFsZ28pLnVwZGF0ZShzYWx0K3Bhc3N3b3JkKS5kaWdlc3QoJ2hleCcpXG5cbi8vIFx0cmV0dXJuIGhhc2hlZFBhc3N3b3JkXG4vLyB9XG5cbi8vIGFzeW5jIGZ1bmN0aW9uIGdldE1lbWJlcihyZXEpIHtcbi8vICAgICB0cnkge1xuXG4vLyAgICAgICAgIGlmIChyZXE/LmhlYWRlcnM/LmF1dGhvcml6YXRpb24pIHtcblxuLy8gICAgICAgICAgICAgbGV0IGJhc2ljQXV0aCA9IEJ1ZmZlci5mcm9tKHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24sICdiYXNlNjQnKS50b1N0cmluZygpXG4vLyAgICAgICAgICAgICBsZXQgZW1haWwgPSBiYXNpY0F1dGguc3BsaXQoJzsnKVswXVxuLy8gICAgICAgICAgICAgbGV0IHBhc3N3b3JkID0gYmFzaWNBdXRoLnNwbGl0KCc7Jykuc2xpY2UoMSkuam9pbignOycpXG4vLyAgICAgICAgICAgICBsZXQgbWVtYmVyID0gYXdhaXQgcmVhZEVudHJ5KHtjb2xsZWN0aW9uOiAnbWVtYmVycycsIHNlYXJjaDogeyBlbWFpbCB9fSlcblxuLy8gICAgICAgICAgICAgbGV0IGNvcnJlY3RQYXNzID0gaGFzaFBhc3N3b3JkKHBhc3N3b3JkLCBtZW1iZXIucGFzc3dvcmQuc2FsdCwgbWVtYmVyLnBhc3N3b3JkLmhhc2gubGVuZ3RoKSA9PSBtZW1iZXIucGFzc3dvcmQuaGFzaFxuLy8gICAgICAgICAgICAgcmV0dXJuIGNvcnJlY3RQYXNzID8gbWVtYmVyIDogbnVsbFxuXG4vLyAgICAgICAgIH0gZWxzZSBpZiAocmVxPy5oZWFkZXJzPy5hcGlrZXkpIHtcblxuLy8gICAgICAgICAgICAgbGV0IG1lbWJlciA9IGF3YWl0IHJlYWRFbnRyeSh7Y29sbGVjdGlvbjogJ21lbWJlcnMnLCBzZWFyY2g6IHsgXCJwYXNzd29yZC5hcGlLZXlcIjogcmVxLmhlYWRlcnMuYXBpa2V5IH19KVxuLy8gICAgICAgICAgICAgcmV0dXJuIG1lbWJlciB8fCBudWxsXG5cbi8vICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgIHJldHVybiBudWxsXG4vLyAgICAgICAgIH1cblxuLy8gICAgIH0gY2F0Y2gge1xuLy8gICAgICAgICByZXR1cm4gbnVsbFxuLy8gICAgIH1cbi8vIH1cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgodGV4dCkge1xuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1stW1xcXXt9KCkqKz8uLFxcXFxeJHwjXFxzXS9nLCBcIlxcXFwkJlwiKTtcbn07XG5cbmxldCBtb25nb09wZXJhdG9yVHJhbnNsYXRpb25zID0ge1xuICAgIGVxdWFsczogJyRlcScsXG4gICAgbm90RXF1YWxUbzogJyRuZScsXG4gICAgZ3JlYXRlclRoYW46ICckZ3QnLFxuICAgIGxlc3NUaGFuOiAnJGx0JyxcbiAgICBpbjogJyRpbicsXG4gICAgbm90SW46ICckbmluJyxcbiAgICBub3Q6ICckbmUnLFxuICAgIGV4aXN0czogJyRleGlzdHMnLFxuICAgIGhhc1ZhbHVlOiAnJyxcbiAgICBhbmQ6ICckYW5kJyxcbiAgICBvcjogJyRvcicsXG4gICAgd29yZFNlYXJjaDogJyR0ZXh0JyxcblxuICAgIGluY2x1ZGVzQWxsOiAnJGFsbCcsXG4gICAgZWFjaEluOiAneyRub3Q6IHskZWxlbU1hdGNoOiB7JG5pbjogcGxhY2Vob2xkZXJ9fX0nLFxuICAgIHNvbWVJbjogJyRpbicsXG4gICAgbm9uZUluOiAnJG5pbicsXG4gICAgLy8gbGVuZ3RoOiAnJHNpemUnLFxuXG4gICAgcHVzaDogJyRwdXNoJyxcbiAgICBhZGRUb1NldDogJyRhZGRUb1NldCcsXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZvcm1hdENvbXBhcmlzb25zKHNlYXJjaCwgY29sbGVjdGlvbikge1xuXG4gICAgaWYgKHNlYXJjaD8ud2hlcmUpIHtcbiAgICAgICAgc2VhcmNoWyckd2hlcmUnXSA9IHNlYXJjaC53aGVyZVxuICAgICAgICBkZWxldGUgc2VhcmNoLndoZXJlXG4gICAgfVxuXG4gICAgaWYgKHNlYXJjaD8uYW5kKSB7XG4gICAgICAgIHNlYXJjaFsnJGFuZCddID0gYXdhaXQgUHJvbWlzZS5hbGwoc2VhcmNoLmFuZC5tYXAoYXN5bmMgYW5kID0+IGF3YWl0IGZvcm1hdENvbXBhcmlzb25zKGFuZCwgY29sbGVjdGlvbikpKVxuICAgICAgICBkZWxldGUgc2VhcmNoLmFuZFxuICAgIH1cblxuICAgIGlmIChzZWFyY2g/Lm9yKSB7XG4gICAgICAgIHNlYXJjaFsnJG9yJ10gPSBhd2FpdCBQcm9taXNlLmFsbChzZWFyY2gub3IubWFwKGFzeW5jIG9yID0+IGF3YWl0IGZvcm1hdENvbXBhcmlzb25zKG9yLCBjb2xsZWN0aW9uKSkpXG4gICAgICAgIGRlbGV0ZSBzZWFyY2gub3JcbiAgICB9XG5cbiAgICBpZiAoc2VhcmNoPy53b3JkU2VhcmNoKSB7XG4gICAgICAgIGxldCB3b3JkU2VhcmNoID0gc2VhcmNoPy53b3JkU2VhcmNoXG4gICAgICAgIC8vIGZ1enp5ID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdleChmdXp6eSksICdnaScpO1xuICAgICAgICAvLyBzZWFyY2gudGl0bGUgPSBmdXp6eVxuICAgICAgICBzZWFyY2hbJyR0ZXh0J10gPSB7ICRzZWFyY2g6IHdvcmRTZWFyY2ggfVxuICAgICAgICBkZWxldGUgc2VhcmNoLndvcmRTZWFyY2hcbiAgICB9XG5cbiAgICAvLyBGb3JtYXQgYWxsIHRoZSBbYWxsLCBzb21lXSBzZWFyY2ggcGFyYW1zXG4gICAgaWYgKHNlYXJjaCAmJiBPYmplY3Qua2V5cyhzZWFyY2gpKSB7XG4gICAgICAgIGZvciAoY29uc3QgcGFyYW0gb2YgT2JqZWN0LmtleXMoc2VhcmNoKSkge1xuICAgICAgICAgICAgbGV0IHBhcmFtU3BsaXQgPSBwYXJhbS5yZXBsYWNlKC8oW2EtejAtOV0pKFtBLVpdKS9nLCAnJDEgJDInKS5zcGxpdCgnICcpXG4gICAgICAgICAgICBsZXQgcHJlZml4ID0gcGFyYW1TcGxpdFswXVxuXG4gICAgICAgICAgICBpZiAoWydhbGwnLCAnc29tZSddLmluY2x1ZGVzKHByZWZpeCkpIHtcblxuICAgICAgICAgICAgICAgIGxldCBjb21wYXJlVHlwZSA9IHByZWZpeFxuICAgICAgICAgICAgICAgIGxldCBmaWVsZE5hbWUgPSBwYXJhbVNwbGl0LnNsaWNlKDEpLmpvaW4oJycpXG4gICAgICAgICAgICAgICAgZmllbGROYW1lID0gZmllbGROYW1lLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgZmllbGROYW1lLnNsaWNlKDEpXG5cbiAgICAgICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uTW9kZWwgPSBjb2xsZWN0aW9ucy5maW5kKGMgPT4gYy5uYW1lID09IGNvbGxlY3Rpb24pXG5cbiAgICAgICAgICAgICAgICBsZXQgcmVsYXRlZENvbGxlY3Rpb25OYW1lID0gY29sbGVjdGlvbnMuZmluZChjID0+IGNvbGxlY3Rpb25Nb2RlbC5maWVsZHNbZmllbGROYW1lXS5jb2xsZWN0aW9uID09IGMuX3Npbmd1bGFyKS5uYW1lXG5cbiAgICAgICAgICAgICAgICBsZXQgc2VhcmNoUGFyYW1zID0gYXdhaXQgZm9ybWF0Q29tcGFyaXNvbnMoc2VhcmNoW3BhcmFtXSwgcmVsYXRlZENvbGxlY3Rpb25OYW1lKVxuICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSB7IGNvbGxlY3Rpb246IHJlbGF0ZWRDb2xsZWN0aW9uTmFtZSwgc2VhcmNoOiBzZWFyY2hQYXJhbXMgfVxuICAgICAgICAgICAgICAgIGxldCBtYXRjaGVkRW50cmllcyA9IChhd2FpdCByZWFkRW50cmllcyhwYXJhbXMpKS5tYXAoZW50cnkgPT4gZW50cnkuaWQpXG5cbiAgICAgICAgICAgICAgICBsZXQgYWRkVG9TZWFyY2ggPSBjb21wYXJlVHlwZSA9PSAnYWxsJyA/IHsgJG5vdDogeyAkZWxlbU1hdGNoOiB7ICRuaW46IG1hdGNoZWRFbnRyaWVzIH0gfSwgJGV4aXN0czogdHJ1ZSB9IDogeyAkaW46IG1hdGNoZWRFbnRyaWVzIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHNlYXJjaFtmaWVsZE5hbWVdKSA9PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShzZWFyY2hbZmllbGROYW1lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoW2ZpZWxkTmFtZV0gPSB7IC4uLnNlYXJjaFtmaWVsZE5hbWVdLCAuLi5hZGRUb1NlYXJjaCB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWFyY2hbZmllbGROYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hbZmllbGROYW1lXSA9IHsgJGVxOiBzZWFyY2hbZmllbGROYW1lXSwgLi4uYWRkVG9TZWFyY2ggfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFtmaWVsZE5hbWVdID0gYWRkVG9TZWFyY2hcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgc2VhcmNoW3BhcmFtXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRm9ybWF0IGFsbCB0aGUgY29tcGFyZXtmaWVsZE5hbWV9IHNlYXJjaCBwYXJhbXNcbiAgICBpZiAoc2VhcmNoICYmIE9iamVjdC5rZXlzKHNlYXJjaCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBwYXJhbSBvZiBPYmplY3Qua2V5cyhzZWFyY2gpKSB7XG5cbiAgICAgICAgICAgIGlmIChwYXJhbS5pbmNsdWRlcygnY29tcGFyZScpKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgZmllbGROYW1lID0gcGFyYW0ucmVwbGFjZSgnY29tcGFyZScsICcnKVxuICAgICAgICAgICAgICAgIGxldCBncmFwaFFsU2VhcmNoID0gc2VhcmNoW3BhcmFtXVxuICAgICAgICAgICAgICAgIGZpZWxkTmFtZSA9IGZpZWxkTmFtZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIGZpZWxkTmFtZS5zbGljZSgxKVxuICAgICAgICAgICAgICAgIHNlYXJjaFtmaWVsZE5hbWVdID0gc2VhcmNoW2ZpZWxkTmFtZV0gfHwge31cblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcGFyYW0gb2YgT2JqZWN0LmtleXMoZ3JhcGhRbFNlYXJjaCkpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoWydhbmQnLCAnb3InXS5pbmNsdWRlcyhwYXJhbSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoW2ZpZWxkTmFtZV1bcGFyYW1dID0gYXdhaXQgUHJvbWlzZS5hbGwoZ3JhcGhRbFNlYXJjaFtwYXJhbV0ubWFwKGFzeW5jIGFuZCA9PiBhd2FpdCBmb3JtYXRDb21wYXJpc29ucyhhbmQsIGNvbGxlY3Rpb24pKSlcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtIGluIG1vbmdvT3BlcmF0b3JUcmFuc2xhdGlvbnMpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlYXJjaFZhbHVlID0gYXdhaXQgZm9ybWF0Q29tcGFyaXNvbnMoZ3JhcGhRbFNlYXJjaFtwYXJhbV0sIGNvbGxlY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbW9uZ29PcGVyYXRvciA9IG1vbmdvT3BlcmF0b3JUcmFuc2xhdGlvbnNbcGFyYW1dXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VhcmNoW2ZpZWxkTmFtZV1bcGFyYW1dXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSA9PSAnZWFjaEluJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFtmaWVsZE5hbWVdID0geyAkbm90OiB7ICRlbGVtTWF0Y2g6IHsgJG5pbjogc2VhcmNoVmFsdWUgfSB9IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW0gPT0gJ2hhc1ZhbHVlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2hWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hbZmllbGROYW1lXSA9IHsgJG5lOiBudWxsIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hbZmllbGROYW1lXSA9IHsgJGVxOiBudWxsIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFtmaWVsZE5hbWVdW21vbmdvT3BlcmF0b3JdID0gc2VhcmNoVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHNlYXJjaFtwYXJhbV1cblxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbSBpbiBtb25nb09wZXJhdG9yVHJhbnNsYXRpb25zKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2VhcmNoVmFsdWUgPSBhd2FpdCBmb3JtYXRDb21wYXJpc29ucyhzZWFyY2hbcGFyYW1dLCBjb2xsZWN0aW9uKVxuICAgICAgICAgICAgICAgIGxldCBtb25nb09wZXJhdG9yID0gbW9uZ29PcGVyYXRvclRyYW5zbGF0aW9uc1twYXJhbV1cbiAgICAgICAgICAgICAgICBkZWxldGUgc2VhcmNoW3BhcmFtXVxuXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtID09ICdlYWNoSW4nKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaCA9IHsgJG5vdDogeyAkZWxlbU1hdGNoOiB7ICRuaW46IHNlYXJjaFZhbHVlIH0gfSB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoW21vbmdvT3BlcmF0b3JdID0gc2VhcmNoVmFsdWVcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVE9ETzogRklYIFRISVNcblxuICAgICAgICAgICAgLy8gTWF5YmUgaWYgaXQncyBhIHJlbGF0aW9uc2hpcCBkb24ndCBhcHBseSB0aGlzP1xuICAgICAgICAgICAgLy8gZWxzZSBpZiAoLi4uICYmIE5PVCBSRUxBVElPTlNISVApIC5hcmd1bWVudHMuLlxuXG4gICAgICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICB0eXBlb2YgKHNlYXJjaFtwYXJhbV0pID09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAgICAgIVsnaWQnLCAnJHRleHQnLCAnJG9yJ10uaW5jbHVkZXMocGFyYW0pICYmXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBUaGlzIGxpbmUgYWxsb3dzIG1lIHRvIGRvIHNlYXJjaGVzIGxpa2Uge3NvbWVNZXNzYWdlczoge2lkOiBcIjEyM1wifX1cbiAgICAgICAgICAgICAgICBDT1VMRCBicmVhayBvdGhlciBzZWFyY2hlcyB3ZSBkZXBlbmQgb24/IEhhdmVuJ3QgdGVzdGVkIDohXG4gICAgICAgICAgICAgICAgU2VlbXMgbGlrZSBpdCBzdGlsbCB3b3Jrcz8ge2FkZHJlc3M6IHtjaXR5OiBcIlJpZGdlY3Jlc3RcIn19IHdvcmtzLiA6dGh1bWJzXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAhYCR7SlNPTi5zdHJpbmdpZnkoc2VhcmNoW3BhcmFtXSl9YC5pbmNsdWRlcygnJCcpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncGFyYW0nLCBwYXJhbSlcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc2VhcmNoW3BhcmFtXScsIGAke0pTT04uc3RyaW5naWZ5KHNlYXJjaFtwYXJhbV0pfWApXG4gICAgICAgICAgICAgICAgYXdhaXQgcmVkdWNlQ29tcGxleEZpZWxkU2VhcmNoKHNlYXJjaFtwYXJhbV0sIHNlYXJjaCwgcGFyYW0sIGNvbGxlY3Rpb24pXG4gICAgICAgICAgICAgICAgZGVsZXRlIHNlYXJjaFtwYXJhbV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzZWFyY2hcbn1cblxubGV0IHJlZHVjZUNvbXBsZXhGaWVsZFNlYXJjaCA9IGFzeW5jIGZ1bmN0aW9uIChzZWFyY2hPYmplY3QsIG1haW5TZWFyY2gsIG9yaWdpbmFsS2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ3NlYXJjaE9iamVjdCcsIHNlYXJjaE9iamVjdClcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzZWFyY2hPYmplY3QpIHtcblxuICAgICAgICBsZXQgdmFsdWUgPSBzZWFyY2hPYmplY3Rba2V5XVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhtb25nb09wZXJhdG9yVHJhbnNsYXRpb25zKS5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICBsZXQgbW9uZ29PcGVyYXRvciA9IG1vbmdvT3BlcmF0b3JUcmFuc2xhdGlvbnNba2V5XVxuICAgICAgICAgICAgdmFsdWUgPSBhd2FpdCBmb3JtYXRDb21wYXJpc29ucyh2YWx1ZSwgY29sbGVjdGlvbilcbiAgICAgICAgICAgIG1haW5TZWFyY2hbYCR7b3JpZ2luYWxLZXl9YF0gPSB7fVxuICAgICAgICAgICAgbWFpblNlYXJjaFtgJHtvcmlnaW5hbEtleX1gXVttb25nb09wZXJhdG9yXSA9IHZhbHVlXG4gICAgICAgIH0gZWxzZSBpZiAoa2V5LmluY2x1ZGVzKCdjb21wYXJlJykpIHtcbiAgICAgICAgICAgIGxldCBmaWVsZE5hbWUgPSBrZXkucmVwbGFjZSgnY29tcGFyZScsICcnKVxuICAgICAgICAgICAgZmllbGROYW1lID0gZmllbGROYW1lLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgZmllbGROYW1lLnNsaWNlKDEpXG4gICAgICAgICAgICB2YWx1ZSA9IGF3YWl0IGZvcm1hdENvbXBhcmlzb25zKHZhbHVlLCBjb2xsZWN0aW9uKVxuICAgICAgICAgICAgbWFpblNlYXJjaFtgJHtvcmlnaW5hbEtleX0uJHtmaWVsZE5hbWV9YF0gPSB2YWx1ZVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiAodmFsdWUpID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndmFsdWUnLCB2YWx1ZSlcbiAgICAgICAgICAgIGF3YWl0IHJlZHVjZUNvbXBsZXhGaWVsZFNlYXJjaCh2YWx1ZSwgbWFpblNlYXJjaCwgYCR7b3JpZ2luYWxLZXl9LiR7a2V5fWApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYWluU2VhcmNoW2Ake29yaWdpbmFsS2V5fS4ke2tleX1gXSA9IHZhbHVlXG4gICAgICAgIH1cblxuICAgIH1cbn1cblxubGV0IGZvcm1hdERvY3VtZW50ID0gYXN5bmMgZnVuY3Rpb24gKGRvY3VtZW50LCBjb2xsZWN0aW9uKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gZG9jdW1lbnQpIHtcblxuICAgICAgICBsZXQgdmFsdWUgPSBkb2N1bWVudFtrZXldXG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKG1vbmdvT3BlcmF0b3JUcmFuc2xhdGlvbnMpLmluY2x1ZGVzKGtleSkpIHtcblxuICAgICAgICAgICAgbGV0IG1vbmdvT3BlcmF0b3IgPSBtb25nb09wZXJhdG9yVHJhbnNsYXRpb25zW2tleV1cbiAgICAgICAgICAgIGRvY3VtZW50W21vbmdvT3BlcmF0b3JdID0gdmFsdWVcblxuICAgICAgICAgICAgaWYgKG1vbmdvT3BlcmF0b3IgPT0gJyRwdXNoJyB8fCBtb25nb09wZXJhdG9yID09ICckYWRkVG9TZXQnKSB7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwdXNoS2V5IG9mIE9iamVjdC5rZXlzKGRvY3VtZW50W21vbmdvT3BlcmF0b3JdKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcHVzaFZhbHVlID0gZG9jdW1lbnRbbW9uZ29PcGVyYXRvcl1bcHVzaEtleV1cbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHVzaFZhbHVlKSkgZG9jdW1lbnRbbW9uZ29PcGVyYXRvcl1bcHVzaEtleV0gPSB7ICRlYWNoOiBwdXNoVmFsdWUgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWxldGUgZG9jdW1lbnRba2V5XVxuXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mICh2YWx1ZSkgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGF3YWl0IGZvcm1hdERvY3VtZW50KHZhbHVlLCBjb2xsZWN0aW9uKVxuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmxldCBmb3JtYXRSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHJlcSkge1xuXG4gICAgbGV0IG1ldGhvZE1hcCA9IHtcbiAgICAgICAgUE9TVDogJ2NyZWF0ZScsXG4gICAgICAgIEdFVDogJ3JlYWQnLFxuICAgICAgICBQVVQ6ICd1cGRhdGUnLFxuICAgICAgICBERUxFVEU6ICdkZWxldGUnLFxuICAgICAgICBZRUVUOiAnZGVsZXRlJ1xuICAgIH1cblxuICAgIGxldCBkcmFmdCA9IHJlcS5kcmFmdCB8fCAhIXJlcT8uaGVhZGVycz8uZHJhZnQgfHwgZmFsc2VcbiAgICAvLyBpZiAoZHJhZnQpIGRlbGV0ZSByZXEuYm9keS5kcmFmdFxuXG4gICAgLy8gRm9ybWF0IHJlcXVlc3QgZGF0YVxuICAgIGxldCBwYXJlbnRzID0gcmVxLnBhcmVudHMgfHwgW11cbiAgICBsZXQgZmV0Y2hlZFJlbGF0aW9uc2hpcHMgPSByZXEuZmV0Y2hlZFJlbGF0aW9uc2hpcHMgfHwgW11cbiAgICBsZXQgbWV0aG9kID0gbWV0aG9kTWFwW3JlcS5tZXRob2RdIHx8IHJlcS5tZXRob2RcbiAgICBsZXQgc2VhcmNoLCBsaW1pdCwgcmVsYXRlZERlcHRoLCBwYWdlLCBzb3J0LCBzZWFyY2hNb2RpZmllclxuICAgIGxldCBkZXB0aExpbWl0ID0gcmVxLmRlcHRoTGltaXQgIT09IHVuZGVmaW5lZCA/IHJlcS5kZXB0aExpbWl0IDogdW5kZWZpbmVkXG4gICAgbGV0IHZlcmJvc2UgPSBmYWxzZVxuICAgIGxldCBmaWVsZHMgPSByZXEuZmllbGRzXG4gICAgbGV0IHJlbGF0aW9uc2hpcEZpZWxkcyA9IHt9XG4gICAgbGV0IGNvbGxlY3Rpb24gPSByZXEucGF0aC5zcGxpdCgnLycpWzFdXG4gICAgbGV0IGFwaU1ldGhvZCA9IHJlcS5vcmlnaW5hbFVybCA9PSAnL2dyYXBocWwnIHx8IHJlcS5vcmlnaW5hbFVybCA9PSAnL2dyYXBocWwvJyA/ICdncmFwaHFsJyA6ICdyZXN0J1xuICAgIGxldCBkb2N1bWVudCA9IHJlcS5kb2N1bWVudCB8fCAoKG1ldGhvZCA9PSAnY3JlYXRlJyB8fCBtZXRob2QgPT0gJ3VwZGF0ZScpID8gcmVxLmJvZHkgOiBudWxsKVxuICAgIGxldCBpZCA9IHJlcS5wYXRoLnNwbGl0KCcvJylbMl0gPyByZXEucGF0aC5zcGxpdCgnLycpWzJdIDogbnVsbFxuXG4gICAgbGV0IG1lbWJlciA9IGF3YWl0IGdldE1lbWJlcihyZXEpXG4gICAgbGV0IGNvbGxlY3Rpb25Nb2RlbCA9IGNvbGxlY3Rpb25zLmZpbmQoYyA9PiBjLm5hbWUgPT0gY29sbGVjdGlvbilcblxuICAgIC8qXG4gICAgICAgIFNUQVJUIENSQVpZIFBTVUVETyBTRUNUSU9OIE5PTlNFTlNFXG4gICAgKi9cblxuICAgIC8vIGlmIHdlIGhhdmUgYSBwYXRoIGZvbGxvd2luZyB0aGUgbW9kZWwgLzpjb2xsZWN0aW9uLzppZC86ZmllbGRcbiAgICBpZiAocmVxLnBhdGguc3BsaXQoJy8nKVszXSkge1xuXG4gICAgICAgIGxldCBwYXJlbnRDb2xsZWN0aW9uID0gY29sbGVjdGlvblxuICAgICAgICBsZXQgcGFyZW50SWQgPSBpZFxuICAgICAgICBsZXQgZmllbGROYW1lID0gcmVxLnBhdGguc3BsaXQoJy8nKVszXVxuXG4gICAgICAgIGlmIChjb2xsZWN0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXRDb2xsZWN0aW9uID0gY29sbGVjdGlvbnMuZmluZChjID0+IGNvbGxlY3Rpb25Nb2RlbC5maWVsZHNbZmllbGROYW1lXS5jb2xsZWN0aW9uID09IGMuX3Npbmd1bGFyKS5uYW1lXG5cbiAgICAgICAgICAgIGxldCByZWxhdGVkSWRzID0gKGF3YWl0IHJlYWRFbnRyeSh7IGNvbGxlY3Rpb246IHBhcmVudENvbGxlY3Rpb24sIHNlYXJjaDogeyBpZDogcGFyZW50SWQgfSwgZmllbGRzOiBbZmllbGROYW1lXSB9KSk/LltmaWVsZE5hbWVdIHx8IG51bGxcblxuICAgICAgICAgICAgY29sbGVjdGlvbiA9IHRhcmdldENvbGxlY3Rpb25cbiAgICAgICAgICAgIGlkID0gbnVsbFxuXG4gICAgICAgICAgICBpZiAocmVsYXRlZElkcykgc2VhcmNoTW9kaWZpZXIgPSB7IGNvbXBhcmVJZDogeyBpbjogcmVsYXRlZElkcyB9IH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLypcbiAgICAgICAgRU5EIENSQVpZIFBTVUVETyBTRUNUSU9OIE5PTlNFTlNFXG4gICAgKi9cblxuXG4gICAgLy8gQkNSIEhPVEZJWFxuICAgIGlmIChtZXRob2QgPT0gJ2NyZWF0ZScgJiYgY29sbGVjdGlvbiA9PSAnb3Bwb3J0dW5pdGllcycpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50W1wib3duZXJJbmZvLmJlc3REYXRlXCJdIHx8IGRvY3VtZW50W1wib3duZXJJbmZvLmJlc3RUaW1lXCJdKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5vd25lckluZm8gPSBkb2N1bWVudC5vd25lckluZm8gfHwge31cbiAgICAgICAgICAgIGRvY3VtZW50Lm93bmVySW5mby5iZXN0RGF0ZSA9IGRvY3VtZW50W1wib3duZXJJbmZvLmJlc3REYXRlXCJdXG4gICAgICAgICAgICBkb2N1bWVudC5vd25lckluZm8uYmVzdFRpbWUgPSBkb2N1bWVudFtcIm93bmVySW5mby5iZXN0VGltZVwiXVxuICAgICAgICAgICAgZGVsZXRlIGRvY3VtZW50W1wib3duZXJJbmZvLmJlc3REYXRlXCJdXG4gICAgICAgICAgICBkZWxldGUgZG9jdW1lbnRbXCJvd25lckluZm8uYmVzdFRpbWVcIl1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gY29uc29sZS5sb2coJ2RlcHRoTGltaXQnLCBkZXB0aExpbWl0KVxuXG4gICAgaWYgKGRvY3VtZW50Py5kZXB0aExpbWl0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2RvY3VtZW50JywgZG9jdW1lbnQpXG4gICAgICAgIGRlcHRoTGltaXQgPSBkb2N1bWVudC5kZXB0aExpbWl0XG4gICAgICAgIGRlbGV0ZSBkb2N1bWVudC5kZXB0aExpbWl0XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkb2N1bWVudCcsIGRvY3VtZW50KVxuICAgIH1cblxuICAgIC8vIERvIHRoaXMgZm9yIG15IGR1bWIgQ0ZMIHNpdGUgLSBKdXN0IGxldHMgeW91IHVzZSB0aGUgb2xkIGVudHJ5X2lkIG9yIGEgc2x1ZyBhcyBpZFxuICAgIGlkID0gYXdhaXQgZmluZElkKGNvbGxlY3Rpb24sIGlkKVxuXG4gICAgaWYgKGNvbGxlY3Rpb25Nb2RlbD8uZm9ybWF0UmVxdWVzdCkge1xuICAgICAgICBsZXQgcmVxdWVzdCA9IGF3YWl0IGNvbGxlY3Rpb25Nb2RlbC5mb3JtYXRSZXF1ZXN0KHsgaWQsIG1ldGhvZCwgcmVxLCBjb2xsZWN0aW9uLCBkb2N1bWVudCwgbWVtYmVyIH0pXG4gICAgICAgIGlkID0gcmVxdWVzdD8uaWQgfHwgaWRcbiAgICAgICAgbWV0aG9kID0gcmVxdWVzdD8ubWV0aG9kIHx8IG1ldGhvZFxuICAgICAgICBkb2N1bWVudCA9IHJlcXVlc3Q/LmRvY3VtZW50IHx8IGRvY3VtZW50XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coJ3JlcS5oZWFkZXJzJywgcmVxLmhlYWRlcnMpXG5cbiAgICAvLyBUaGlzIGFsbG93cyB1cyB0byB1cGRhdGUgYSBkb2MgdXNpbmcgYSBwb3N0IHJlcXVlc3QgKDxmb3JtPiBvbmx5IHN1cHBvcnN0IHBvc3QgYW5kIGdldCBtZXRob2RzKVxuICAgIGlmIChtZXRob2QgPT0gJ2NyZWF0ZScgJiYgaWQpIG1ldGhvZCA9ICd1cGRhdGUnXG5cbiAgICBsZXQgZmV0Y2hpbmdQYXJlbnQgPSByZXEuZmV0Y2hpbmdQYXJlbnQgfHwgbnVsbFxuXG4gICAgaWYgKHJlcS5xdWVyeT8uZmllbGRzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWVsZHMgPSBKU09OLnBhcnNlKHJlcS5xdWVyeS5maWVsZHMpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGZpZWxkcyA9IHJlcS5xdWVyeT8uZmllbGRzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWV0aG9kID09ICdyZWFkJykge1xuXG4gICAgICAgIC8vIGxldCBxdWVyeVN0cmluZ0V4aXN0cyA9IHJlcS5xdWVyeSAmJiBPYmplY3Qua2V5cyhyZXEucXVlcnkpLmxlbmd0aCA+IDBcblxuICAgICAgICBsaW1pdCA9IE51bWJlcihyZXEucXVlcnk/LmxpbWl0KSB8fCBOdW1iZXIocmVxLmJvZHk/LmxpbWl0KSB8fCB1bmRlZmluZWRcbiAgICAgICAgZGVwdGhMaW1pdCA9IChOdW1iZXIocmVxLnF1ZXJ5Py5kZXB0aExpbWl0IHx8IHJlcS5ib2R5Py5kZXB0aExpbWl0KSlcbiAgICAgICAgZGVwdGhMaW1pdCA9IGRlcHRoTGltaXQgPiAtMSA/IGRlcHRoTGltaXQgOiB1bmRlZmluZWRcbiAgICAgICAgcmVsYXRlZERlcHRoID0gTnVtYmVyKHJlcS5yZWxhdGVkRGVwdGgpIHx8IHVuZGVmaW5lZFxuICAgICAgICBwYWdlID0gTnVtYmVyKHJlcS5xdWVyeT8ucGFnZSkgfHwgTnVtYmVyKHJlcS5ib2R5Py5wYWdlKSB8fCB1bmRlZmluZWRcbiAgICAgICAgc29ydCA9IHJlcS5xdWVyeT8uc29ydCB8fCByZXEuYm9keT8uc29ydCB8fCB1bmRlZmluZWRcbiAgICAgICAgdmVyYm9zZSA9IHJlcS5xdWVyeT8udmVyYm9zZSB8fCByZXEuYm9keT8udmVyYm9zZSB8fCB1bmRlZmluZWRcblxuICAgICAgICBpZiAocmVxLnF1ZXJ5Py5zZWFyY2gpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoID0gSlNPTi5wYXJzZShyZXEucXVlcnkuc2VhcmNoKVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHNlYXJjaCA9IHJlcS5xdWVyeT8uc2VhcmNoXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgcmVxLnF1ZXJ5LnNlYXJjaFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VhcmNoID0geyAuLi5yZXEucXVlcnksIC4uLnJlcS5ib2R5Py5zZWFyY2ggfVxuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoID0geyAuLi5zZWFyY2gsIC4uLnNlYXJjaE1vZGlmaWVyIH1cblxuICAgICAgICBpZiAocmVxLnF1ZXJ5Py5zb3J0KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHNvcnQgPSBKU09OLnBhcnNlKHJlcS5xdWVyeS5zb3J0KVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHNvcnQgPSByZXEucXVlcnk/LnNvcnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzSVNPRGF0ZVN0cmluZyh2YWx1ZSkge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgaXQncyBhIHN0cmluZyBhbmQgbWF0Y2hlcyBhIGJhc2ljIElTTyBmb3JtYXQgcGF0dGVybiBiZWZvcmUgdXNpbmcgZGF5anNcbiAgICAgICAgICAgIC8vIElTTyA4NjAxIGZvcm1hdCB0eXBpY2FsbHkgaGFzIGRhc2hlcywgY29sb25zLCBvciAnVCcgc2VwYXJhdG9yc1xuICAgICAgICAgICAgLy8gUmVxdWlyZSBmdWxsIHllYXItbW9udGgtZGF5IGZvcm1hdCB0byBjb25zaWRlciBpdCBhIGRhdGVcbiAgICAgICAgICAgIGNvbnN0IGlzb0Zvcm1hdFJlZ2V4ID0gL15cXGR7NH0tXFxkezJ9LVxcZHsyfShUXFxkezJ9KDpcXGR7Mn0pezAsMn0oXFwuXFxkKyk/KFp8WystXVxcZHsyfTo/XFxkezJ9KT8pPyQvO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgICAgICAgICBpc29Gb3JtYXRSZWdleC50ZXN0KHZhbHVlKSAmJlxuICAgICAgICAgICAgICAgIGRheWpzKHZhbHVlLCBkYXlqcy5JU09fODYwMSwgdHJ1ZSkuaXNWYWxpZCgpO1xuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiBjb252ZXJ0RGF0ZXMob2JqKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzSVNPRGF0ZVN0cmluZyhvYmpba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0gPSBuZXcgRGF0ZShvYmpba2V5XSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICdvYmplY3QnICYmIG9ialtrZXldICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnZlcnREYXRlcyhvYmpba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udmVydERhdGVzKHNlYXJjaClcblxuICAgICAgICBkZWxldGUgc2VhcmNoLmxpbWl0XG4gICAgICAgIGRlbGV0ZSBzZWFyY2guZGVwdGhMaW1pdFxuICAgICAgICBkZWxldGUgc2VhcmNoLnBhZ2VcbiAgICAgICAgZGVsZXRlIHNlYXJjaC5zb3J0XG4gICAgICAgIGRlbGV0ZSBzZWFyY2guZmllbGRzXG4gICAgICAgIGRlbGV0ZSBzZWFyY2gudmVyYm9zZVxuXG4gICAgICAgIGlmIChyZXE/LmJvZHk/LmlkKSBzZWFyY2guaWQgPSByZXE/LmJvZHk/LmlkXG5cbiAgICAgICAgaWYgKHNlYXJjaC5lbnRyeUlkPy4kaW4pIHsgc2VhcmNoLmVudHJ5SWQuJGluID0gc2VhcmNoLmVudHJ5SWQuJGluLm1hcChlID0+IE51bWJlcihlKSkgfVxuICAgICAgICBlbHNlIGlmIChzZWFyY2guZW50cnlJZCkgeyBzZWFyY2guZW50cnlJZCA9IE51bWJlcihzZWFyY2guZW50cnlJZCkgfVxuXG4gICAgICAgIC8vIFJlbGF0aW9uc2hpcCBmaWVsZHNcbiAgICAgICAgaWYgKGZpZWxkcyAmJiBmaWVsZHM/LnNvbWU/LihmID0+IGYuaW5jbHVkZXMoJy4nKSkpIHtcbiAgICAgICAgICAgIGxldCBwb3NzaWJsZVJlbGF0aW9ucyA9IFsuLi5uZXcgU2V0KGZpZWxkcy5maWx0ZXIoZiA9PiBmLmluY2x1ZGVzKCcuJykpLm1hcChmID0+IGYuc3BsaXQoJy4nKVswXSkpXVxuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBwb3NzaWJsZVJlbGF0aW9ucykge1xuICAgICAgICAgICAgICAgIGxldCBmaWVsZElzUmVsYXRpb25zaGlwID0gISFjb2xsZWN0aW9uTW9kZWwuZmllbGRzW3BdPy5jb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkSXNSZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwRmllbGRzW3BdID0gZmllbGRzLmZpbHRlcihmID0+IGYuc3RhcnRzV2l0aChgJHtwfS5gKSkubWFwKGYgPT4gZi5zbGljZShwLmxlbmd0aCArIDEpKVxuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgPSBmaWVsZHMuZmlsdGVyKGYgPT4gIWYuc3RhcnRzV2l0aChgJHtwfS5gKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaWVsZHMuaW5jbHVkZXMocCkpIGZpZWxkcy5wdXNoKHApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZpZWxkcycsIGZpZWxkcywgJ3JlbGF0aW9uc2hpcEZpZWxkcycsIHJlbGF0aW9uc2hpcEZpZWxkcylcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaCA9IGF3YWl0IGZvcm1hdENvbXBhcmlzb25zKHNlYXJjaCwgY29sbGVjdGlvbilcblxuICAgIH0gZWxzZSBpZiAobWV0aG9kID09ICdjcmVhdGUnIHx8IG1ldGhvZCA9PSAndXBkYXRlJykge1xuXG4gICAgICAgIGF3YWl0IGZvcm1hdERvY3VtZW50KGRvY3VtZW50LCBjb2xsZWN0aW9uKVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBpZCxcbiAgICAgICAgZG9jdW1lbnQsXG4gICAgICAgIHNlYXJjaCxcbiAgICAgICAgbGltaXQsXG4gICAgICAgIGRlcHRoTGltaXQsXG4gICAgICAgIHJlbGF0ZWREZXB0aCxcbiAgICAgICAgc29ydCxcbiAgICAgICAgcGFnZSxcbiAgICAgICAgYXBpTWV0aG9kLFxuICAgICAgICBtZW1iZXIsXG4gICAgICAgIHBhcmVudHMsXG4gICAgICAgIGZldGNoZWRSZWxhdGlvbnNoaXBzLFxuICAgICAgICByZXEsXG4gICAgICAgIGZldGNoaW5nUGFyZW50LFxuICAgICAgICBmaWVsZHMsXG4gICAgICAgIHJlbGF0aW9uc2hpcEZpZWxkcyxcbiAgICAgICAgZHJhZnQsXG4gICAgICAgIHZlcmJvc2VcbiAgICB9XG59XG5cbmV4cG9ydCB7IGZvcm1hdFJlcXVlc3QsIGdldE1lbWJlciB9XG4iLCJpbXBvcnQgY29sbGVjdGlvbnMgZnJvbSAnLi4vMS4gYnVpbGQvY29sbGVjdGlvbnMnXG5cbmxldCBwZXJzb25hbENoZWNrID0gZnVuY3Rpb24gKGZpZWxkTW9kZWwpIHtcbiAgICBpZiAoIWZpZWxkTW9kZWwuX2NvbXBsZXhGaWVsZCAmJiBmaWVsZE1vZGVsLnBlcnNvbmFsKSByZXR1cm4gdHJ1ZVxuICAgIGlmIChmaWVsZE1vZGVsLl9maWVsZHNBcnJheSkge1xuICAgICAgICBmaWVsZE1vZGVsLl9maWVsZHNBcnJheS5ldmVyeShmID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwZXJzb25hbENoZWNrKGYpXG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5leHBvcnQgbGV0IGF1dGhvcml6ZSA9IGFzeW5jIGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG5cbiAgICAvLyByZXR1cm4geyBhdXRob3JpemVkOiB0cnVlIH1cblxuICAgIGxldCB7IG1lbWJlciwgZG9jdW1lbnQgfSA9IHJlcXVlc3RcblxuICAgIC8vIEFkbWluc1xuICAgIGlmIChtZW1iZXIucm9sZXMuaW5jbHVkZXMoXCJhZG1pblwiKSkgcmV0dXJuIHsgYXV0aG9yaXplZDogdHJ1ZSB9XG5cbiAgICAvLyBBZGQgdGhlIG93bmVyIHJvbGUgaWYgdGhlIGF1dGhvcklkIG9mIHRoZSByZWZlcmVuY2VkIGRvY3VtZW50IGlzIHRoZSBtZW1iZXIncyBpZFxuICAgIC8vIGNvbnNvbGUubG9nKCdtZW1iZXInLCBtZW1iZXIpXG4gICAgLy8gY29uc29sZS5sb2coJ3JlcXVlc3QnLCByZXF1ZXN0KVxuICAgIGlmIChtZW1iZXI/LmlkICYmIChcbiAgICAgICAgcmVxdWVzdD8ub3JpZ2luYWxEb2N1bWVudD8uYXV0aG9yPy5pZCA9PSBtZW1iZXIuaWQgfHxcbiAgICAgICAgcmVxdWVzdD8ub3JpZ2luYWxEb2N1bWVudD8uYXV0aG9yPy5pbmNsdWRlcz8uKG1lbWJlci5pZCkgfHxcbiAgICAgICAgcmVxdWVzdD8ub3JpZ2luYWxEb2N1bWVudD8uYXV0aG9yPy5zb21lPy4oYSA9PiBhPy5pZCA9PSBtZW1iZXI/LmlkKSB8fFxuICAgICAgICByZXF1ZXN0Py5zZWFyY2g/LmlkID09IG1lbWJlci5pZCB8fCAvLyBHcmFwaHFsXG4gICAgICAgIHJlcXVlc3Q/LmlkID09IG1lbWJlci5pZFxuICAgICkpIHtcbiAgICAgICAgbWVtYmVyLnJvbGVzLnB1c2goJ293bmVyJylcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhtZW1iZXIucm9sZXMpXG5cbiAgICBsZXQgZGVmYXVsdFBlcm1pc3Npb25zID0ge1xuICAgICAgICBhZG1pbjogWydjcmVhdGUnLCAncmVhZCcsICd1cGRhdGUnLCAnZGVsZXRlJ10sXG4gICAgICAgIG93bmVyOiBbJ3JlYWQnLCAndXBkYXRlJywgJ2RlbGV0ZSddLFxuICAgICAgICBwdWJsaWM6IFsncmVhZCddLFxuICAgIH1cblxuICAgIGxldCBjb2xsZWN0aW9uID0gY29sbGVjdGlvbnMuZmluZChjID0+IHJlcXVlc3QuY29sbGVjdGlvbiA9PSBjLl9uYW1lKVxuICAgIGxldCBjb2xsZWN0aW9uUGVybWlzc2lvbnMgPSBjb2xsZWN0aW9uPy5wZXJtaXNzaW9ucyB8fCB7fVxuXG4gICAgLy8gLy8gVXBkYXRlIFBlcnNvbmFsIEZpZWxkc1xuICAgIC8vIGlmIChkb2N1bWVudCAmJiBtZW1iZXIuaWQpIHtcbiAgICAvLyAgICAgbGV0IG9ubHlQZXJzb25hbCA9IE9iamVjdC5rZXlzKGRvY3VtZW50KS5ldmVyeShmID0+IHtcbiAgICAvLyAgICAgICAgIGxldCBmaWVsZE1vZGVsID0gY29sbGVjdGlvbj8uZmllbGRzW2ZdXG4gICAgLy8gICAgICAgICBpZiAoIWZpZWxkTW9kZWwpIHJldHVyblxuICAgIC8vICAgICAgICAgcmV0dXJuIHBlcnNvbmFsQ2hlY2soZmllbGRNb2RlbClcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgICAgLy8gT25seSBmaWVsZHMgdHJ5aW5nIHRvIGJlIHdyaXR0ZW4gYXJlIHBlcnNvbmFsLi4uXG4gICAgLy8gICAgIGlmIChvbmx5UGVyc29uYWwpIHJldHVybiB7IGF1dGhvcml6ZWQ6IHRydWUgfVxuICAgIC8vIH1cblxuICAgIGlmICh0eXBlb2YgKGNvbGxlY3Rpb25QZXJtaXNzaW9ucykgPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGF3YWl0IGNvbGxlY3Rpb25QZXJtaXNzaW9ucyhyZXF1ZXN0KVxuXG4gICAgLy8gUGVybWlzc2lvbnMgYXJyYXkgc2hvcnRoYW5kXG4gICAgY29sbGVjdGlvblBlcm1pc3Npb25zID0gQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uUGVybWlzc2lvbnMpID8geyBwdWJsaWM6IGNvbGxlY3Rpb25QZXJtaXNzaW9ucyB9IDogY29sbGVjdGlvblBlcm1pc3Npb25zXG5cbiAgICBsZXQgcGVybWlzc2lvbnMgPSB7IC4uLmRlZmF1bHRQZXJtaXNzaW9ucywgLi4uY29sbGVjdGlvblBlcm1pc3Npb25zIH1cblxuICAgIC8vIFBlcm1pc3Npb25zIG9iamVjdCBvZiByb2xlcyB3aXRoIGFycmF5IG9mIG1ldGhvZHNcbiAgICBsZXQgYXV0aG9yaXplZCA9IG1lbWJlci5yb2xlcy5zb21lKHJvbGUgPT4gQXJyYXkuaXNBcnJheShwZXJtaXNzaW9ucz8uW3JvbGVdKSAmJiBwZXJtaXNzaW9ucz8uW3JvbGVdPy5pbmNsdWRlcyhyZXF1ZXN0Lm1ldGhvZCkpXG4gICAgaWYgKGF1dGhvcml6ZWQpIHJldHVybiB7IGF1dGhvcml6ZWQgfVxuXG4gICAgLy8gUGVybWlzc2lvbnMgb2JqZWN0IG9mIHJvbGVzIHdpdGggb2JqZWN0IG9mIG1ldGhvZCBmdW5jdGlvbnNcbiAgICBsZXQgcmVzcG9uc2UgPSAnJ1xuICAgIC8vIGNvbnNvbGUubG9nKCdyZXF1ZXN0JywgcmVxdWVzdClcbiAgICBmb3IgKGxldCByb2xlIG9mIG1lbWJlci5yb2xlcykge1xuICAgICAgICBpZiAocGVybWlzc2lvbnM/Lltyb2xlXT8uW3JlcXVlc3QubWV0aG9kXSA9PT0gdHJ1ZSkgYXV0aG9yaXplZCA9IHRydWVcbiAgICAgICAgaWYgKHR5cGVvZiAocGVybWlzc2lvbnM/Lltyb2xlXT8uW3JlcXVlc3QubWV0aG9kXSkgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbGV0IHJlc29sdmVyID0gcGVybWlzc2lvbnM/Lltyb2xlXT8uW3JlcXVlc3QubWV0aG9kXVxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IHJlc29sdmVyKHJlcXVlc3QpXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSB0cnVlIHx8IHJlc3VsdD8uYXV0aG9yaXplZCA9PT0gdHJ1ZSkgYXV0aG9yaXplZCA9IHRydWVcbiAgICAgICAgICAgIGlmIChyZXN1bHQ/LnJlc3BvbnNlKSByZXNwb25zZSA9IHJlc3VsdD8ucmVzcG9uc2VcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXV0aG9yaXplZCkgcmV0dXJuIHsgYXV0aG9yaXplZCB9XG5cbiAgICAvKiBJZiB0aGUgb3duZXIgaGFzIHBlcm1pc3Npb24gdG8gcmVhZCBhbmQgd2UncmUgTk9UIHJlcXVlc3RpbmcgYSBzcGVjaWZpY1xuICAgIGRvY3VtZW50LCBidXQgcmF0aGVyIHNlYXJjaGluZyBhIGNvbGxlY3Rpb24sIGFkZCBhdXRob3JJZCB0byB0aGUgc2VhcmNoXG4gICAgc28gd2Ugb25seSBnZXQgYmFjayBkb2N1bWVudHMgZnJvbSB0aGUgcGVyc29uIHdobydzIG1ha2luZyB0aGUgcmVxdWVzdCAqL1xuXG4gICAgLy8gY29uc29sZS5sb2coJ3N0ZXBwaW5nIHVwJywgbWVtYmVyPy5pZCwgIXJlcXVlc3Q/Lm9yaWdpbmFsRG9jdW1lbnQ/LmlkLCByZXF1ZXN0Lm1ldGhvZCA9PSAncmVhZCcsIChwZXJtaXNzaW9ucz8uWydvd25lciddPy5pbmNsdWRlcygncmVhZCcpIHx8IHBlcm1pc3Npb25zPy5bJ293bmVyJ10/LlsncmVhZCddKSlcbiAgICBpZiAobWVtYmVyPy5pZCAmJiAhcmVxdWVzdD8ub3JpZ2luYWxEb2N1bWVudD8uaWQgJiYgcmVxdWVzdC5tZXRob2QgPT0gJ3JlYWQnICYmIChwZXJtaXNzaW9ucz8uWydvd25lciddPy5pbmNsdWRlcygncmVhZCcpIHx8IHBlcm1pc3Npb25zPy5bJ293bmVyJ10/LlsncmVhZCddKSkge1xuICAgICAgICAvLyBpZiAocmVxdWVzdC5jb2xsZWN0aW9uID09ICdtZW1iZXJzJykge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ3Nob3VsZCBiZSBnb29kJylcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZGlyKHJlcXVlc3Quc2VhcmNoLCB7ZGVwdGg6IG51bGx9KVxuICAgICAgICAvLyB9XG4gICAgICAgIHJlcXVlc3Quc2VhcmNoLiRvciA9IFt7YXV0aG9yOiBtZW1iZXIuaWR9LCB7aWQ6IG1lbWJlci5pZH1dXG4gICAgICAgIHJldHVybiB7IGF1dGhvcml6ZWQ6IHRydWUgfVxuICAgIH1cblxuICAgIHJlc3BvbnNlID0gcmVzcG9uc2UgfHwgYCR7bWVtYmVyPy50aXRsZSB8fCAnVXNlcid9IGRvZXMgbm90IGhhdmUgcGVybWlzc2lvbiB0byAke3JlcXVlc3QubWV0aG9kfSBkb2N1bWVudHMgaW4gdGhlICR7cmVxdWVzdC5jb2xsZWN0aW9ufSBjb2xsZWN0aW9uLmBcbiAgICByZXR1cm4geyBhdXRob3JpemVkLCByZXNwb25zZSB9XG5cbn1cbiIsImltcG9ydCBjb2xsZWN0aW9ucyBmcm9tICcuLi8xLiBidWlsZC9jb2xsZWN0aW9ucydcblxuYXN5bmMgZnVuY3Rpb24gY2hlY2tSZXF1aXJlZEZpZWxkcyhjb2xsZWN0aW9uTW9kZWwsIGRvY3VtZW50LCBtZXRob2QpIHtcblx0aWYgKCFjb2xsZWN0aW9uTW9kZWwuZmllbGRzKSByZXR1cm5cblxuXHRjb25zdCBmaWVsZEVycm9ycyA9IHt9XG5cblx0Zm9yIChjb25zdCBmIG9mIE9iamVjdC5rZXlzKGNvbGxlY3Rpb25Nb2RlbC5maWVsZHMpKSB7XG5cdFx0bGV0IGZpZWxkTW9kZWwgPSBjb2xsZWN0aW9uTW9kZWwuZmllbGRzW2ZdXG5cdFx0bGV0IGZpZWxkVmFsdWUgPSBkb2N1bWVudD8uW2ZdXG5cblx0XHRpZiAoZmllbGRNb2RlbC5yZXF1aXJlZCAmJiAhZmllbGRWYWx1ZSAmJiBtZXRob2QgPT0gJ2NyZWF0ZScpIHtcblx0XHRcdGNvbnN0IGZpZWxkTGFiZWwgPSBmaWVsZE1vZGVsLmxhYmVsIHx8IGZcblx0XHRcdGZpZWxkRXJyb3JzW2ZdID0ge1xuXHRcdFx0XHRlcnJvcjogJ2VtcHR5Jyxcblx0XHRcdFx0bWVzc2FnZTogYCR7ZmllbGRMYWJlbH0gaXMgcmVxdWlyZWQgYW5kIGNhbm5vdCBiZSBlbXB0eWBcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZmllbGRNb2RlbD8uX2NvbXBsZXhGaWVsZCkge1xuXHRcdFx0bGV0IHJlcXVpcmVkID0gY2hlY2tSZXF1aXJlZEZpZWxkcyhmaWVsZE1vZGVsLCBmaWVsZFZhbHVlLCBtZXRob2QpXG5cdFx0XHRpZiAocmVxdWlyZWQudmFsaWQgPT09IGZhbHNlKSByZXR1cm4gcmVxdWlyZWRcblx0XHR9XG5cdFx0Ly8gU2V0IGZpZWxkIGRlZmF1bHRzXG5cdH1cblxuXHRpZiAoT2JqZWN0LmtleXMoZmllbGRFcnJvcnMpLmxlbmd0aCkge1xuXHRcdGNvbnN0IG1pc3NpbmdGaWVsZE5hbWVzID0gT2JqZWN0LmtleXMoZmllbGRFcnJvcnMpLmpvaW4oJywgJylcblx0XHRyZXR1cm4geyB2YWxpZDogZmFsc2UsIHJlc3BvbnNlOiBgTWlzc2luZyByZXF1aXJlZCBmaWVsZChzKTogJHttaXNzaW5nRmllbGROYW1lc31gLCBmaWVsZEVycm9ycyB9XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hlY2tVbmRlZmluZWRGaWVsZHMoY29sbGVjdGlvbk1vZGVsLCBkb2N1bWVudCkge1xuXHRpZiAoIWNvbGxlY3Rpb25Nb2RlbC5maWVsZHMgfHwgIWRvY3VtZW50KSByZXR1cm5cblxuXHRjb25zdCBmaWVsZEVycm9ycyA9IHt9XG5cdGxldCBkb2N1bWVudEZpZWxkcyA9IE9iamVjdC5rZXlzKGRvY3VtZW50KVxuXG5cdGZvciAoY29uc3QgZiBvZiBkb2N1bWVudEZpZWxkcykge1xuXHRcdGlmIChmID09ICdpZCcgfHwgZiA9PSAnJHB1c2gnIHx8IGYgPT0gJ2F1dGhvcklkJykgY29udGludWVcblxuXHRcdGxldCBmaWVsZFZhbHVlID0gZG9jdW1lbnQ/LltmXVxuXHRcdGxldCBmaWVsZE1vZGVsID0gY29sbGVjdGlvbk1vZGVsPy5maWVsZHM/LltmXSB8fCBjb2xsZWN0aW9uTW9kZWw/LmZpZWxkcz8uW2Y/LnNwbGl0KCcuJyk/LlswXV1cblxuXHRcdGlmICghZmllbGRNb2RlbCB8fCBmaWVsZE1vZGVsLmNvbXB1dGVkKSB7XG5cdFx0XHRmaWVsZEVycm9yc1tmXSA9IHtcblx0XHRcdFx0ZXJyb3I6ICdub25leGlzdGVudCcsXG5cdFx0XHRcdG1lc3NhZ2U6IGAke2Z9IGlzIG5vdCBhIHZhbGlkIGZpZWxkYFxuXHRcdFx0fVxuXHRcdFx0Y29udGludWVcblx0XHR9XG5cblx0XHRpZiAoZmllbGRNb2RlbD8uYXJyYXkgJiYgQXJyYXkuaXNBcnJheShmaWVsZFZhbHVlKSAmJiBmaWVsZE1vZGVsPy5fZ3FsSW5wdXRUeXBlLmluY2x1ZGVzKCdDcmVhdGUnKSkge1xuXHRcdFx0bGV0IGFycmF5VmFsaWQgPSBhd2FpdCBQcm9taXNlLmFsbChmaWVsZFZhbHVlLm1hcChhc3luYyAodikgPT4gYXdhaXQgY2hlY2tVbmRlZmluZWRGaWVsZHMoZmllbGRNb2RlbCwgdikpKVxuXHRcdFx0bGV0IGludmFsaWRJbnN0YW5jZSA9IGFycmF5VmFsaWQuZmluZCgocmVzcG9uc2UpID0+IHJlc3BvbnNlPy52YWxpZCA9PT0gZmFsc2UpXG5cdFx0XHRpZiAoaW52YWxpZEluc3RhbmNlKSBmaWVsZEVycm9yc1tmXSA9IGludmFsaWRJbnN0YW5jZS5yZXNwb25zZVxuXHRcdH0gZWxzZSBpZiAoZmllbGRNb2RlbD8uX2NvbXBsZXhGaWVsZCkge1xuXHRcdFx0bGV0IGV4dHJhID0gY2hlY2tVbmRlZmluZWRGaWVsZHMoZmllbGRNb2RlbCwgZmllbGRWYWx1ZSlcblx0XHRcdGlmIChleHRyYT8udmFsaWQgPT09IGZhbHNlKSBmaWVsZEVycm9yc1tmXSA9IGV4dHJhLnJlc3BvbnNlXG5cdFx0fVxuXHR9XG5cblx0aWYgKE9iamVjdC5rZXlzKGZpZWxkRXJyb3JzKS5sZW5ndGgpIHtcblx0XHRjb25zdCBlcnJvckZpZWxkTmFtZXMgPSBPYmplY3Qua2V5cyhmaWVsZEVycm9ycykuam9pbignLCAnKVxuXHRcdHJldHVybiB7IHZhbGlkOiBmYWxzZSwgcmVzcG9uc2U6IGBOb25leGlzdGFudCBmaWVsZChzKTogJHtlcnJvckZpZWxkTmFtZXN9YCwgZmllbGRFcnJvcnMgfVxuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGVuc3VyZVByaW1pdGl2ZVR5cGVzKHZhbHVlLCBkb2N1bWVudCwgZmllbGRNb2RlbCwgaW5BcnJheSwgaSkge1xuXHQvLyBjb25zb2xlLmxvZygnYXJyYXknLCBmaWVsZE1vZGVsPy5hcnJheSwgJ2NvbXBsZXgnLCBmaWVsZE1vZGVsPy5fY29tcGxleEZpZWxkLCBBcnJheS5pc0FycmF5KHZhbHVlKSwgdmFsdWUpXG5cdGlmIChmaWVsZE1vZGVsPy5hcnJheSkge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coZmllbGRNb2RlbC5fbmFtZSwgdmFsdWUpXG5cdFx0XHRsZXQgYXJyYXlWYWxpZCA9IGF3YWl0IFByb21pc2UuYWxsKHZhbHVlLm1hcChhc3luYyAodiwgaSkgPT4gZW5zdXJlUHJpbWl0aXZlVHlwZXModiwgZG9jdW1lbnQsIGZpZWxkTW9kZWwsIHRydWUsIGkpKSlcblx0XHRcdGxldCBpbnZhbGlkSW5zdGFuY2UgPSBhcnJheVZhbGlkLmZpbmQoKHJlc3BvbnNlKSA9PiByZXNwb25zZT8udmFsaWQgPT09IGZhbHNlKVxuXHRcdFx0cmV0dXJuIGludmFsaWRJbnN0YW5jZSB8fCB7IHZhbGlkOiB0cnVlLCByZXNwb25zZTogJycgfVxuXHRcdH0gZWxzZSBpZiAoaW5BcnJheSkge1xuXHRcdFx0cmV0dXJuIHR5cGVWYWxpZGF0aW9uKHZhbHVlLCBkb2N1bWVudCwgZmllbGRNb2RlbCwgaW5BcnJheSwgaSlcblx0XHR9XG5cdH1cblxuXHRpZiAoZmllbGRNb2RlbD8uX2NvbXBsZXhGaWVsZCkge1xuXHRcdGZvciAoY29uc3Qgc3ViZmllbGRNb2RlbCBvZiBmaWVsZE1vZGVsLl9maWVsZHNBcnJheSkge1xuXHRcdFx0aWYgKHZhbHVlW3N1YmZpZWxkTW9kZWwuX25hbWVdICE9IG51bGwpIHtcblx0XHRcdFx0bGV0IHN1YmZpZWxkVmFsdWUgPSB2YWx1ZVtzdWJmaWVsZE1vZGVsLl9uYW1lXVxuXHRcdFx0XHRyZXR1cm4gZW5zdXJlUHJpbWl0aXZlVHlwZXMoc3ViZmllbGRWYWx1ZSwgdmFsdWUsIHN1YmZpZWxkTW9kZWwpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gdHlwZVZhbGlkYXRpb24odmFsdWUsIGRvY3VtZW50LCBmaWVsZE1vZGVsKVxuXHR9XG59XG5cbmZ1bmN0aW9uIHR5cGVWYWxpZGF0aW9uKHZhbHVlLCBkb2N1bWVudCwgZmllbGRNb2RlbCwgaW5BcnJheSwgaSkge1xuXHRsZXQgZmllbGROYW1lID0gZmllbGRNb2RlbC5fbmFtZVxuXHRsZXQgZmllbGRQYXRoID0gZmllbGRNb2RlbC5fbG9jYXRpb25cblx0Ly8gY29uc29sZS5sb2coJ3R2JywgZmllbGRNb2RlbCwgdmFsdWUpXG5cdC8vIEVuc3VyZSBwcmltaXRhdmUgdHlwZSBtYXRjaGVzXG5cdGlmICh2YWx1ZSkge1xuXHRcdGlmIChmaWVsZE1vZGVsLmFycmF5ICYmICFpbkFycmF5KSB7XG5cdFx0XHRyZXR1cm4geyB2YWxpZDogZmFsc2UsIHJlc3BvbnNlOiBgKCR7ZmllbGRQYXRofSkgRXhwZWN0ZWQgYXJyYXksIGdvdCAke3R5cGVvZiB2YWx1ZX1gIH1cblx0XHR9XG5cblx0XHRpZiAoZmllbGRNb2RlbC5fZ3FsSW5wdXRUeXBlID09ICdTdHJpbmcnKSB7XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuXHRcdFx0XHRyZXR1cm4geyB2YWxpZDogZmFsc2UsIHJlc3BvbnNlOiBgKCR7ZmllbGRQYXRofSkgRXhwZWN0ZWQgc3RyaW5nLCBnb3QgJHt0eXBlb2YgdmFsdWV9YCB9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChmaWVsZE1vZGVsLl9ncWxJbnB1dFR5cGUgPT0gJ0ludCcpIHtcblx0XHRcdGlmIChpc05hTih2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09ICdib29sZWFuJykgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCByZXNwb25zZTogYCgke2ZpZWxkUGF0aH0pIEV4cGVjdGVkIG51bWJlciwgZ290ICR7dHlwZW9mIHZhbHVlfWAgfVxuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcblx0XHRcdFx0aWYgKGkgIT0gdW5kZWZpbmVkKSBkb2N1bWVudFtmaWVsZE5hbWVdW2ldID0gTnVtYmVyKHZhbHVlKVxuXHRcdFx0XHRlbHNlIGRvY3VtZW50W2ZpZWxkTmFtZV0gPSBOdW1iZXIodmFsdWUpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChmaWVsZE1vZGVsLl9ncWxJbnB1dFR5cGUgPT0gJ0Zsb2F0Jykge1xuXHRcdFx0aWYgKGlzTmFOKHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT0gJ2Jvb2xlYW4nKSByZXR1cm4geyB2YWxpZDogZmFsc2UsIHJlc3BvbnNlOiBgKCR7ZmllbGRQYXRofSkgRXhwZWN0ZWQgbnVtYmVyLCBnb3QgJHt0eXBlb2YgdmFsdWV9YCB9XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuXHRcdFx0XHRpZiAoaSAhPSB1bmRlZmluZWQpIGRvY3VtZW50W2ZpZWxkTmFtZV1baV0gPSBOdW1iZXIodmFsdWUpXG5cdFx0XHRcdGVsc2UgZG9jdW1lbnRbZmllbGROYW1lXSA9IE51bWJlcih2YWx1ZSlcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGZpZWxkTW9kZWwuX2dxbElucHV0VHlwZSA9PSAnQm9vbGVhbicpIHtcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJykgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCByZXNwb25zZTogYCgke2ZpZWxkUGF0aH0pIEV4cGVjdGVkIGJvb2xlYW4sIGdvdCAke3R5cGVvZiB2YWx1ZX1gIH1cblx0XHR9XG5cdFx0aWYgKGZpZWxkTW9kZWwuX2dxbElucHV0VHlwZSA9PSAnSUQnKSB7XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCByZXNwb25zZTogYCgke2ZpZWxkUGF0aH0pIEV4cGVjdGVkIHN0cmluZywgZ290ICR7dHlwZW9mIHZhbHVlfWAgfVxuXHRcdH1cblx0XHRpZiAoZmllbGRNb2RlbC5fZ3FsSW5wdXRUeXBlLnN0YXJ0c1dpdGgoJ0NyZWF0ZScpKSB7XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCByZXNwb25zZTogYCgke2ZpZWxkUGF0aH0pIEV4cGVjdGVkIG9iamVjdCwgZ290ICR7dHlwZW9mIHZhbHVlfWAgfVxuXHRcdH1cblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBmaWVsZFZhbGlkYXRpb24oZmllbGRWYWx1ZSwgZmllbGRNb2RlbCwgcmVxdWVzdCwgZG9jdW1lbnQsIGZpZWxkKSB7XG5cdGlmIChmaWVsZE1vZGVsPy5hcnJheSAmJiBBcnJheS5pc0FycmF5KGZpZWxkVmFsdWUpKSB7XG5cdFx0bGV0IGFycmF5VmFsaWQgPSBhd2FpdCBQcm9taXNlLmFsbChmaWVsZFZhbHVlLm1hcChhc3luYyAodikgPT4gYXdhaXQgZmllbGRWYWxpZGF0aW9uKHYsIGZpZWxkTW9kZWwsIHJlcXVlc3QsIGRvY3VtZW50KSkpXG5cdFx0bGV0IGludmFsaWRJbnN0YW5jZSA9IGFycmF5VmFsaWQuZmluZCgocmVzcG9uc2UpID0+IHJlc3BvbnNlPy52YWxpZCA9PT0gZmFsc2UpXG5cdFx0cmV0dXJuIGludmFsaWRJbnN0YW5jZSB8fCB7IHZhbGlkOiB0cnVlLCByZXNwb25zZTogJycgfVxuXHR9XG5cblx0aWYgKGZpZWxkTW9kZWw/Ll9jb21wbGV4RmllbGQpIHtcblx0XHRmb3IgKGNvbnN0IHN1YmZpZWxkTW9kZWwgb2YgZmllbGRNb2RlbC5fZmllbGRzQXJyYXkpIHtcblx0XHRcdC8vIGlmICgoZiAhPSAnaWQnICYmICFmaWVsZE1vZGVsKSB8fCBmaWVsZE1vZGVsLmNvbXB1dGVkKSB7IHJldHVybiB7dmFsaWQ6IGZhbHNlLCByZXNwb25zZTogYEludmFsaWQgZmllbGQ6ICR7Zn1gfX1cblxuXHRcdFx0aWYgKHN1YmZpZWxkTW9kZWwudmFsaWRhdGUgJiYgZmllbGRWYWx1ZVtzdWJmaWVsZE1vZGVsLl9uYW1lXSAhPSBudWxsKSB7XG5cdFx0XHRcdGxldCBzdWJmaWVsZFZhbHVlID0gZmllbGRWYWx1ZVtzdWJmaWVsZE1vZGVsLl9uYW1lXVxuXHRcdFx0XHRsZXQgeyB2YWxpZCwgcmVzcG9uc2UgfSA9IGF3YWl0IGZpZWxkVmFsaWRhdGlvbihzdWJmaWVsZFZhbHVlLCBzdWJmaWVsZE1vZGVsLCByZXF1ZXN0LCBkb2N1bWVudClcblx0XHRcdFx0aWYgKCF2YWxpZCkgcmV0dXJuIHsgdmFsaWQsIHJlc3BvbnNlIH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gZm9yIChjb25zdCBzdWJmaWVsZCBvZiApXG5cdFx0fVxuXHR9XG5cblx0aWYgKGZpZWxkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdGlmIChmaWVsZE1vZGVsPy52YWxpZGF0ZSkge1xuXHRcdFx0bGV0IGRhdGEgPSBmaWVsZFZhbHVlXG5cdFx0XHRsZXQgeyB2YWxpZCwgcmVzcG9uc2UgfSA9IGF3YWl0IGZpZWxkTW9kZWwudmFsaWRhdGUoZGF0YSwgeyBmaWVsZE1vZGVsLCByZXF1ZXN0LCBkb2N1bWVudCB9KVxuXHRcdFx0Y29uc3QgZmllbGRMYWJlbCA9IGZpZWxkTW9kZWwubGFiZWwgfHwgZmllbGRNb2RlbC5fbmFtZVxuXHRcdFx0Y29uc3QgZXJyb3JSZXNwb25zZSA9IHtcblx0XHRcdFx0ZXJyb3I6ICdpbnZhbGlkJyxcblx0XHRcdFx0bWVzc2FnZTogcmVzcG9uc2UgfHwgYCR7ZmllbGRMYWJlbH0gaXMgaW52YWxpZGBcblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWxpZCA/IHsgdmFsaWQ6IHRydWUsIHJlc3BvbnNlOiAnJyB9IDogeyB2YWxpZCwgcmVzcG9uc2U6IGVycm9yUmVzcG9uc2UgfVxuXHRcdH1cblx0fVxufVxuXG5sZXQgdmFsaWRhdGUgPSBhc3luYyBmdW5jdGlvbiAocmVxdWVzdCkge1xuXHRsZXQgeyBjb2xsZWN0aW9uLCBkb2N1bWVudCwgbWV0aG9kIH0gPSByZXF1ZXN0XG5cblx0bGV0IGNvbGxlY3Rpb25Nb2RlbCA9IGNvbGxlY3Rpb25zLmZpbmQoKGMpID0+IGMubmFtZSA9PSBjb2xsZWN0aW9uKVxuXHRpZiAoIWNvbGxlY3Rpb25Nb2RlbCkge1xuXHRcdHJldHVybiB7IHZhbGlkOiBmYWxzZSwgcmVzcG9uc2U6IGBJbnZhbGlkIGNvbGxlY3Rpb246ICR7Y29sbGVjdGlvbn1gIH1cblx0fVxuXG5cdGlmIChkb2N1bWVudCkge1xuXHRcdGNvbnN0IGZpZWxkRXJyb3JzID0ge31cblxuXHRcdC8vIE1ha2Ugc3VyZSBhbGwgcmVxdWlyZWQgZmllbGRzIGFyZSB0aGVyZSAoZG9lc24ndCBjaGVjayBzdWJmaWVsZHMgeWV0IC0gdG9kbylcblx0XHRsZXQgcmVxdWlyZWQgPSBhd2FpdCBjaGVja1JlcXVpcmVkRmllbGRzKGNvbGxlY3Rpb25Nb2RlbCwgZG9jdW1lbnQsIG1ldGhvZClcblx0XHRpZiAocmVxdWlyZWQ/LmZpZWxkRXJyb3JzKSB7XG5cdFx0XHRPYmplY3QuYXNzaWduKGZpZWxkRXJyb3JzLCByZXF1aXJlZC5maWVsZEVycm9ycylcblx0XHR9XG5cblx0XHQvLyBUaGlzIGRvZXNuJ3QgY2hlY2sgc3ViZmllbGRzICh0b2RvKVxuXHRcdGxldCBleHRyYSA9IGF3YWl0IGNoZWNrVW5kZWZpbmVkRmllbGRzKGNvbGxlY3Rpb25Nb2RlbCwgZG9jdW1lbnQpXG5cdFx0aWYgKGV4dHJhPy5maWVsZEVycm9ycykge1xuXHRcdFx0T2JqZWN0LmFzc2lnbihmaWVsZEVycm9ycywgZXh0cmEuZmllbGRFcnJvcnMpXG5cdFx0fVxuXG5cdFx0Ly8gRmllbGQgdmFsaWRhdGlvblxuXHRcdGxldCBkb2N1bWVudEZpZWxkcyA9IE9iamVjdC5rZXlzKGRvY3VtZW50KVxuXHRcdGZvciAoY29uc3QgZiBvZiBkb2N1bWVudEZpZWxkcykge1xuXHRcdFx0aWYgKGYgPT0gJ2lkJykgY29udGludWVcblx0XHRcdGxldCBmaWVsZFZhbHVlID0gZG9jdW1lbnRbZl1cblx0XHRcdGxldCBmaWVsZE1vZGVsID0gY29sbGVjdGlvbk1vZGVsPy5maWVsZHNbZl1cblxuXHRcdFx0aWYgKGZpZWxkVmFsdWUpIHtcblx0XHRcdFx0Ly8gbGV0IHR5cGVSZXNwb25zZSA9IGF3YWl0IGVuc3VyZVByaW1pdGl2ZVR5cGVzKGZpZWxkVmFsdWUsIGRvY3VtZW50LCBmaWVsZE1vZGVsKVxuXHRcdFx0XHQvLyBpZiAodHlwZVJlc3BvbnNlPy52YWxpZCA9PT0gZmFsc2UpIHJldHVybiB0eXBlUmVzcG9uc2VcblxuXHRcdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBmaWVsZFZhbGlkYXRpb24oZmllbGRWYWx1ZSwgZmllbGRNb2RlbCwgcmVxdWVzdCwgZG9jdW1lbnQsIGYpXG5cdFx0XHRcdGlmIChyZXNwb25zZT8udmFsaWQgPT09IGZhbHNlKSBmaWVsZEVycm9yc1tmXSA9IHJlc3BvbnNlLnJlc3BvbnNlXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKE9iamVjdC5rZXlzKGZpZWxkRXJyb3JzKS5sZW5ndGgpIHtcblx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZXMgPSBbXVxuXHRcdFx0Y29uc3QgcmVxdWlyZWRGaWVsZHMgPSBbXVxuXHRcdFx0Y29uc3Qgbm9uZXhpc3RhbnRGaWVsZHMgPSBbXVxuXHRcdFx0Y29uc3QgaW52YWxpZEZpZWxkcyA9IFtdXG5cblx0XHRcdGZvciAoY29uc3QgW2ZpZWxkLCBlcnJvcl0gb2YgT2JqZWN0LmVudHJpZXMoZmllbGRFcnJvcnMpKSB7XG5cdFx0XHRcdGlmIChlcnJvci5lcnJvciA9PT0gJ2VtcHR5Jykge1xuXHRcdFx0XHRcdHJlcXVpcmVkRmllbGRzLnB1c2goZmllbGQpXG5cdFx0XHRcdH0gZWxzZSBpZiAoZXJyb3IuZXJyb3IgPT09ICdub25leGlzdGVudCcpIHtcblx0XHRcdFx0XHRub25leGlzdGFudEZpZWxkcy5wdXNoKGZpZWxkKVxuXHRcdFx0XHR9IGVsc2UgaWYgKGVycm9yLmVycm9yID09PSAnaW52YWxpZCcpIHtcblx0XHRcdFx0XHRpbnZhbGlkRmllbGRzLnB1c2goYCR7ZmllbGR9ICgke2Vycm9yLm1lc3NhZ2V9KWApXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHJlcXVpcmVkRmllbGRzLmxlbmd0aCkge1xuXHRcdFx0XHRlcnJvck1lc3NhZ2VzLnB1c2goYE1pc3NpbmcgcmVxdWlyZWQgZmllbGQocyk6ICR7cmVxdWlyZWRGaWVsZHMuam9pbignLCAnKX1gKVxuXHRcdFx0fVxuXHRcdFx0aWYgKG5vbmV4aXN0YW50RmllbGRzLmxlbmd0aCkge1xuXHRcdFx0XHRlcnJvck1lc3NhZ2VzLnB1c2goYE5vbmV4aXN0ZW50IGZpZWxkKHMpOiAke25vbmV4aXN0YW50RmllbGRzLmpvaW4oJywgJyl9YClcblx0XHRcdH1cblx0XHRcdGlmIChpbnZhbGlkRmllbGRzLmxlbmd0aCkge1xuXHRcdFx0XHRlcnJvck1lc3NhZ2VzLnB1c2goYEludmFsaWQgZmllbGQocyk6ICR7aW52YWxpZEZpZWxkcy5qb2luKCc7ICcpfWApXG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHJlc3BvbnNlID0gZXJyb3JNZXNzYWdlcy5qb2luKCcuICcpXG5cdFx0XHRyZXR1cm4geyB2YWxpZDogZmFsc2UsIHJlc3BvbnNlLCBmaWVsZEVycm9ycyB9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHsgdmFsaWQ6IHRydWUgfVxufVxuXG5sZXQgYWZ0ZXJWYWxpZGF0aW9uID0gYXN5bmMgZnVuY3Rpb24gKHJlcXVlc3QpIHt9XG5cbmV4cG9ydCB7IHZhbGlkYXRlLCBhZnRlclZhbGlkYXRpb24gfVxuIiwiaW1wb3J0IGNvbGxlY3Rpb25zIGZyb20gJy4uLzEuIGJ1aWxkL2NvbGxlY3Rpb25zJ1xuaW1wb3J0IHsgdXBzZXJ0RW50cnkgfSBmcm9tICcuLi8xLiBidWlsZC9saWJyYXJpZXMvbW9uZ28nXG5cbmxldCB0cmFuc2xhdGVGaWVsZHMgPSBhc3luYyBmdW5jdGlvbiAoZmllbGRWYWx1ZSwgZmllbGRNb2RlbCwgcmVxdWVzdCwgaW5kZXgsIHBhcmVudFZhbHVlKSB7XG5cbiAgICBpZiAoZmllbGRWYWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm5cblxuICAgIGlmIChmaWVsZE1vZGVsLmFycmF5ICYmIEFycmF5LmlzQXJyYXkoZmllbGRWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKGZpZWxkVmFsdWUubWFwKGFzeW5jICh2LCBpKSA9PiBhd2FpdCB0cmFuc2xhdGVGaWVsZHModiwgZmllbGRNb2RlbCwgcmVxdWVzdCwgaSwgZmllbGRWYWx1ZSB8fCByZXF1ZXN0LmRvY3VtZW50KSkpXG4gICAgfVxuXG4gICAgaWYgKGZpZWxkTW9kZWwuX2NvbXBsZXhGaWVsZCkge1xuICAgICAgICBmb3IgKGNvbnN0IHN1YmZpZWxkTW9kZWwgb2YgZmllbGRNb2RlbC5fZmllbGRzQXJyYXkpIHtcblxuICAgICAgICAgICAgbGV0IHN1YmZpZWxkVmFsdWUgPSBmaWVsZFZhbHVlPy5bc3ViZmllbGRNb2RlbC5fbmFtZV1cbiAgICAgICAgICAgIGxldCBmaWVsZEV4aXN0c0luSW5wdXREb2N1bWVudCA9ICEhc3ViZmllbGRWYWx1ZVxuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzdWJmaWVsZE1vZGVsLl9uYW1lLCBmaWVsZEV4aXN0c0luSW5wdXREb2N1bWVudCwgc3ViZmllbGRWYWx1ZSlcblxuICAgICAgICAgICAgaWYgKGZpZWxkRXhpc3RzSW5JbnB1dERvY3VtZW50KSB7XG4gICAgICAgICAgICAgICAgZmllbGRWYWx1ZVtzdWJmaWVsZE1vZGVsLl9uYW1lXSA9IGF3YWl0IHRyYW5zbGF0ZUZpZWxkcyhzdWJmaWVsZFZhbHVlLCBzdWJmaWVsZE1vZGVsLCByZXF1ZXN0LCBpbmRleCwgZmllbGRWYWx1ZSB8fCByZXF1ZXN0LmRvY3VtZW50KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZpZWxkVmFsdWUgIT09IG51bGwgJiYgZmllbGRNb2RlbD8udHJhbnNsYXRlSW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZpZWxkTW9kZWwudHJhbnNsYXRlSW5wdXQoZmllbGRWYWx1ZSwgeyByZXF1ZXN0LCBpbmRleCwgcGFyZW50VmFsdWUsIGZpZWxkTW9kZWwgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gZmllbGRWYWx1ZVxuXG59XG5cbmxldCBwcmVQcm9jZXNzID0gYXN5bmMgZnVuY3Rpb24gKHJlcXVlc3QpIHtcbiAgICBsZXQgeyBkb2N1bWVudCwgY29sbGVjdGlvbiB9ID0gcmVxdWVzdFxuICAgIC8vIFJ1biB0aGUgc2V0dGVycyBmb3IgZWFjaCBmaWVsZFxuICAgIGlmIChkb2N1bWVudCkge1xuXG4gICAgICAgIGxldCBjb2xsZWN0aW9uTW9kZWwgPSBjb2xsZWN0aW9ucy5maW5kKGMgPT4gYy5uYW1lID09IGNvbGxlY3Rpb24pXG5cbiAgICAgICAgLy8gU2V0IGZpZWxkIGRlZmF1bHRzXG4gICAgICAgIGlmIChyZXF1ZXN0Lm1ldGhvZCA9PSAnY3JlYXRlJykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIGNvbGxlY3Rpb25Nb2RlbC5fZmllbGRzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoKGRvY3VtZW50W2YuX25hbWVdID09PSBudWxsIHx8IGRvY3VtZW50W2YuX25hbWVdID09PSB1bmRlZmluZWQpICYmIGY/LmRlZmF1bHQgIT0gdW5kZWZpbmVkICYmIGY/LmRlZmF1bHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChmLmRlZmF1bHQpID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkb2MgPSByZXF1ZXN0Lm9yaWdpbmFsRG9jdW1lbnQgfHwgeyAuLi5kb2N1bWVudCB9XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudFtmLl9uYW1lXSA9IGYuZGVmYXVsdChkb2MsIHJlcXVlc3QpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudFtmLl9uYW1lXSA9IGYuZGVmYXVsdFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRvY3VtZW50RmllbGRzID0gT2JqZWN0LmtleXMoZG9jdW1lbnQpXG5cbiAgICAgICAgLy8gUnVuIFRyYW5zbGF0aW9uc1xuXG4gICAgICAgIC8qXG4gICAgICAgIFN3aXRjaGluZyB0byBcIm9mIGNvbGxlY3Rpb25Nb2RlbC5fZmllbGRzQXJyYXlcIiBzbyB0aGF0IHdlIGNhblxuICAgICAgICBzZXQgdGhlIGF1ZGlvIGZpZWxkIHRvIHRoZSB0cmFuc2xhdGVkIHJlc3VsdCBvZiB2aWRlbyBmaWVsZCBkYXRhXG4gICAgICAgIGFuZCBzdGlsbCBoYXZlIGl0IHByb2Nlc3NlZC4gOilcbiAgICAgICAgKi9cbiAgICAgICAgZm9yIChjb25zdCBmIG9mIGNvbGxlY3Rpb25Nb2RlbC5fZmllbGRzQXJyYXkpIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGRvY3VtZW50W2YuX25hbWVdXG4gICAgICAgICAgICBsZXQgZmllbGRNb2RlbCA9IGNvbGxlY3Rpb25Nb2RlbD8uZmllbGRzW2YuX25hbWVdXG4gICAgICAgICAgICBpZiAoIWZpZWxkTW9kZWwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgeyBjb250aW51ZSB9XG4gICAgICAgICAgICBkb2N1bWVudFtmLl9uYW1lXSA9IGF3YWl0IHRyYW5zbGF0ZUZpZWxkcyh2YWx1ZSwgZmllbGRNb2RlbCwgcmVxdWVzdCwgMCwgZG9jdW1lbnQpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBkb2N1bWVudFxuXG59XG5cbmV4cG9ydCB7IHByZVByb2Nlc3MgfVxuIiwiaW1wb3J0IHsgcmVhZEVudHJ5LCByZWFkRW50cmllcywgY291bnRFbnRyaWVzLCBjcmVhdGVFbnRyeSwgdXBkYXRlRW50cnksIGRlbGV0ZUVudHJ5IH0gZnJvbSAnLi4vMS4gYnVpbGQvbGlicmFyaWVzL21vbmdvJ1xuXG5jb25zdCBwZXJmb3JtUXVlcnkgPSBhc3luYyBmdW5jdGlvbiAoeyBtZXRob2QsIGNvbGxlY3Rpb24sIGlkLCBkb2N1bWVudCwgc2VhcmNoLCBsaW1pdCwgc29ydCwgcGFnZSwgZmllbGRzLCB2ZXJib3NlIH0pIHtcblxuICAgIHRyeSB7XG5cbiAgICAgICAgaWYgKG1ldGhvZCA9PSAncmVhZCcpIHtcblxuICAgICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVudHJ5ID0gYXdhaXQgcmVhZEVudHJ5KHsgY29sbGVjdGlvbiwgc2VhcmNoOiB7IGlkIH0sIGZpZWxkcyB9KVxuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGNvbnRlbnQ6IGVudHJ5IH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvdW50ID0gdmVyYm9zZSA/IGF3YWl0IGNvdW50RW50cmllcyh7IGNvbGxlY3Rpb24sIHNlYXJjaCB9KSA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIGxldCBlbnRyaWVzID0gYXdhaXQgcmVhZEVudHJpZXMoeyBjb2xsZWN0aW9uLCBzZWFyY2gsIGxpbWl0LCBzb3J0LCBwYWdlLCBmaWVsZHMgfSlcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBjb250ZW50OiBlbnRyaWVzLCBjb3VudCB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT0gJ2NyZWF0ZScpIHtcblxuICAgICAgICAgICAgbGV0IG5ld0VudHJ5SWQgPSAoYXdhaXQgY3JlYXRlRW50cnkoeyBjb2xsZWN0aW9uLCBlbnRyeTogZG9jdW1lbnQgfSkpLmluc2VydGVkSWRcbiAgICAgICAgICAgIGxldCBuZXdFbnRyeSA9IGF3YWl0IHJlYWRFbnRyeSh7IGNvbGxlY3Rpb24sIHNlYXJjaDogeyBpZDogbmV3RW50cnlJZCB9LCBmaWVsZHMgfSlcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGNvbnRlbnQ6IG5ld0VudHJ5IH1cblxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PSAndXBkYXRlJykge1xuXG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgdXBkYXRlZFJlc3BvbnNlID0gYXdhaXQgdXBkYXRlRW50cnkoeyBjb2xsZWN0aW9uLCBzZWFyY2g6IHsgaWQgfSwgZG9jdW1lbnQgfSkuY2F0Y2goY29uc29sZS5lcnJvcilcbiAgICAgICAgICAgICAgICBsZXQgdXBkYXRlZEVudHJ5ID0gYXdhaXQgcmVhZEVudHJ5KHsgY29sbGVjdGlvbiwgc2VhcmNoOiB7IGlkIH0sIGZpZWxkcyB9KVxuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGNvbnRlbnQ6IHVwZGF0ZWRFbnRyeSB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBjb250ZW50OiAnTm8gSUQgc3BlY2lmaWVkIGZvciB1cGRhdGUgcmVxdWVzdC4nIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PSAnZGVsZXRlJykge1xuXG4gICAgICAgICAgICBsZXQgZGVsZXRlZENvdW50ID0gKGF3YWl0IGRlbGV0ZUVudHJ5KHsgY29sbGVjdGlvbiwgc2VhcmNoOiB7IGlkIH0gfSkpLmRlbGV0ZWRcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRlbGV0ZWQ6IGRlbGV0ZWRDb3VudCB9XG4gICAgICAgIH1cblxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgcGVyZm9ybVF1ZXJ5LCB9XG4iLCJpbXBvcnQgY29sbGVjdGlvbnMgZnJvbSAnLi4vMS4gYnVpbGQvY29sbGVjdGlvbnMnXG5pbXBvcnQgeyByZWFkRW50cnksIHVwZGF0ZUVudHJ5LCB1cHNlcnRFbnRyeSB9IGZyb20gJy4uLzEuIGJ1aWxkL2xpYnJhcmllcy9tb25nbydcbmltcG9ydCB7IGNsb25lRGVlcCB9IGZyb20gJ2xvZGFzaCdcblxuY29uc3QgY29tcHV0ZUZpZWxkcyA9IGFzeW5jIGZ1bmN0aW9uIChyZXF1ZXN0LCBkb2N1bWVudCwgb3JpZ2luYWxWYWx1ZSwgZmllbGQsIHBhcmVudCwgcHREb2N1bWVudCwgcHRPcmlnaW5hbFZhbHVlLCBwdFBhcmVudCwgZmllbGRQYXRoID0gJycpIHtcblx0bGV0IGlzQ2hpbGQgPSAhIXBhcmVudFxuXHRpZiAoIWlzQ2hpbGQpIGZvciAobGV0IGtleSBpbiBwdERvY3VtZW50KSBpZiAoa2V5ICE9IGZpZWxkLl9uYW1lKSBkZWxldGUgcHREb2N1bWVudFtrZXldXG5cdHBhcmVudCA9IHBhcmVudCB8fCBkb2N1bWVudFxuXHRwdFBhcmVudCA9IHB0UGFyZW50IHx8IHB0RG9jdW1lbnRcblxuXHRpZiAoZmllbGQuYXJyYXkgJiYgQXJyYXkuaXNBcnJheShvcmlnaW5hbFZhbHVlKSkge1xuXHRcdHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChvcmlnaW5hbFZhbHVlLm1hcChhc3luYyAodiwgaSkgPT4gYXdhaXQgY29tcHV0ZUZpZWxkcyhyZXF1ZXN0LCBkb2N1bWVudCwgdiwgZmllbGQsIHBhcmVudCwgcHREb2N1bWVudCwgcHRPcmlnaW5hbFZhbHVlPy5baV0sIHB0UGFyZW50LCBmaWVsZFBhdGgpKSlcblx0fVxuXG5cdGlmIChmaWVsZC5jb21wdXRlZCkge1xuXHRcdGxldCBwcm92aWRlZERhdGEgPSBwYXJlbnRcblx0XHRsZXQgc2hvdWxkTmV2ZXJDYWNoZSA9IGZpZWxkLmV4cGlyZUNhY2hlID09PSB0cnVlIHx8IGZpZWxkLmV4cGlyZUNhY2hlID09PSAwXG5cblx0XHRpZiAoZmllbGQucHJvdmlkZSkge1xuXHRcdFx0Y29uc3QgbWlzc2luZ0ZpZWxkcyA9IGZpZWxkLnByb3ZpZGUuc29tZSgocHJvdmlkZUZpZWxkKSA9PiAhcGFyZW50Lmhhc093blByb3BlcnR5KHByb3ZpZGVGaWVsZCkpXG5cdFx0XHRpZiAobWlzc2luZ0ZpZWxkcykge1xuXHRcdFx0XHRwcm92aWRlZERhdGEgPSBhd2FpdCByZWFkRW50cnkoeyBjb2xsZWN0aW9uOiBkb2N1bWVudC5jb2xsZWN0aW9uLCBzZWFyY2g6IHsgaWQ6IGRvY3VtZW50LmlkIH0sIGZpZWxkczogZmllbGQucHJvdmlkZSB9KVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnN0IHJlc29sdmVyID0gdHlwZW9mIGZpZWxkLmNvbXB1dGVkID09PSAnZnVuY3Rpb24nID8gZmllbGQuY29tcHV0ZWQuYmluZChmaWVsZCkgOiBmaWVsZC5jb21wdXRlZD8ucmVzb2x2ZXI/LmJpbmQoZmllbGQpXG5cdFx0bGV0IG5ld1ZhbHVlXG5cblx0XHRpZiAoc2hvdWxkTmV2ZXJDYWNoZSkge1xuXHRcdFx0bmV3VmFsdWUgPSBhd2FpdCByZXNvbHZlcihwcm92aWRlZERhdGEsIHJlcXVlc3QsIGRvY3VtZW50KVxuXHRcdFx0Ly8gU2F2ZSB0aGUgdmFsdWUgc28gd2UgY2FuIHN0aWxsIHF1ZXJ5IGZvciB0aGlzIGVudHJ5IGJ5IHRoZSB2YWx1ZSAoaWUgaWhoIGN1c3RvbVVybClcblx0XHRcdGNvbnN0IGZ1bGxGaWVsZFBhdGggPSBmaWVsZFBhdGggPyBgJHtmaWVsZFBhdGh9LiR7ZmllbGQuX25hbWV9YCA6IGZpZWxkLl9uYW1lXG5cdFx0XHRsZXQgZGF0YSA9IHsgW2Z1bGxGaWVsZFBhdGhdOiBuZXdWYWx1ZSB9XG5cdFx0XHRpZiAobmV3VmFsdWUgIT09IHVuZGVmaW5lZCkgYXdhaXQgdXBkYXRlRW50cnkoeyBjb2xsZWN0aW9uOiBkb2N1bWVudC5jb2xsZWN0aW9uLCBzZWFyY2g6IHsgaWQ6IGRvY3VtZW50LmlkIH0sIGRvY3VtZW50OiBkYXRhIH0pXG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGNhY2hlVmFsdWUgPSBwYXJlbnRbZmllbGQuX25hbWVdXG5cdFx0XHRjb25zdCBmaWVsZENhY2hlTmFtZSA9IGBfXyR7ZmllbGQuX25hbWV9Q2FjaGVEYXRlYFxuXHRcdFx0Y29uc3QgbGFzdENhY2hlZCA9IHBhcmVudFtmaWVsZENhY2hlTmFtZV0gfHwgMFxuXHRcdFx0Y29uc3QgY2FjaGVBZ2UgPSBuZXcgRGF0ZSgpIC0gbGFzdENhY2hlZFxuXHRcdFx0Y29uc3QgY2FzaEV4cGlyYXRpb25EZWZpbmVkID0gZmllbGQuZXhwaXJlQ2FjaGUgIT0gdW5kZWZpbmVkXG5cdFx0XHRjb25zdCBuZXZlckJlZW5DYWNoZWQgPSAoY2FzaEV4cGlyYXRpb25EZWZpbmVkICYmICFjYWNoZUFnZSkgfHwgWydjcmVhdGUnLCAndXBkYXRlJ10uaW5jbHVkZXMocmVxdWVzdC5tZXRob2QpIHx8IGNhY2hlVmFsdWUgPT09IHVuZGVmaW5lZFxuXHRcdFx0Y29uc3QgY2FjaGVFeHBpcmVkID0gKGNhc2hFeHBpcmF0aW9uRGVmaW5lZCAmJiBjYWNoZUFnZSA+IGZpZWxkLmV4cGlyZUNhY2hlICogMTAwMCkgfHwgbmV2ZXJCZWVuQ2FjaGVkXG5cblx0XHRcdGlmIChjYWNoZUV4cGlyZWQpIHtcblx0XHRcdFx0bmV3VmFsdWUgPSBhd2FpdCByZXNvbHZlcihwcm92aWRlZERhdGEsIHJlcXVlc3QsIGRvY3VtZW50KVxuXHRcdFx0XHQvLyBwdFBhcmVudFtmaWVsZC5fbmFtZV0gPSBuZXdWYWx1ZTtcblxuXHRcdFx0XHRpZiAoIXJlcXVlc3QuZHJhZnQpIHtcblx0XHRcdFx0XHRjb25zdCBmdWxsRmllbGRQYXRoID0gZmllbGRQYXRoID8gYCR7ZmllbGRQYXRofS4ke2ZpZWxkLl9uYW1lfWAgOiBmaWVsZC5fbmFtZVxuXHRcdFx0XHRcdGxldCBkYXRhID0geyBbZnVsbEZpZWxkUGF0aF06IG5ld1ZhbHVlIH1cblx0XHRcdFx0XHRpZiAoZmllbGQuZXhwaXJlQ2FjaGUgIT09IHVuZGVmaW5lZCkgZGF0YVtmaWVsZENhY2hlTmFtZV0gPSBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ2RhdGEnLCBkYXRhKVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRpZiAobmV3VmFsdWUgIT09IHVuZGVmaW5lZCkgYXdhaXQgdXBkYXRlRW50cnkoeyBjb2xsZWN0aW9uOiBkb2N1bWVudC5jb2xsZWN0aW9uLCBzZWFyY2g6IHsgaWQ6IGRvY3VtZW50LmlkIH0sIGRvY3VtZW50OiBkYXRhIH0pXG5cdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ0NvbXB1dGVkIENhY2hpbmcgRXJyb3I6JywgZSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5ld1ZhbHVlID0gY2FjaGVWYWx1ZVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBuZXdWYWx1ZVxuXHR9XG5cblx0aWYgKGZpZWxkLl9jb21wbGV4RmllbGQgJiYgdHlwZW9mIG9yaWdpbmFsVmFsdWUgPT09ICdvYmplY3QnKSB7XG5cdFx0Y29uc3QgbmV3Q29udGFpbmVyID0geyAuLi5vcmlnaW5hbFZhbHVlIH1cblxuXHRcdGZvciAoY29uc3Qgc3ViZmllbGQgb2YgZmllbGQuX2ZpZWxkc0FycmF5KSB7XG5cdFx0XHRjb25zdCBzdWJmaWVsZFZhbHVlID0gb3JpZ2luYWxWYWx1ZT8uW3N1YmZpZWxkLl9uYW1lXSA/PyBudWxsXG5cdFx0XHRjb25zdCBuZXdGaWVsZFBhdGggPSBmaWVsZFBhdGggPyBgJHtmaWVsZFBhdGh9LiR7ZmllbGQuX25hbWV9YCA6IGZpZWxkLl9uYW1lXG5cblx0XHRcdGlmIChvcmlnaW5hbFZhbHVlIHx8IHN1YmZpZWxkLmNvbXB1dGVkKSB7XG5cdFx0XHRcdG5ld0NvbnRhaW5lcltzdWJmaWVsZC5fbmFtZV0gPSBhd2FpdCBjb21wdXRlRmllbGRzKHJlcXVlc3QsIGRvY3VtZW50LCBzdWJmaWVsZFZhbHVlLCBzdWJmaWVsZCwgb3JpZ2luYWxWYWx1ZSwgcHREb2N1bWVudCwgcHRPcmlnaW5hbFZhbHVlPy5bc3ViZmllbGQuX25hbWVdLCBwdFBhcmVudCwgbmV3RmllbGRQYXRoKVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBuZXdDb250YWluZXJcblx0fVxuXG5cdHJldHVybiBvcmlnaW5hbFZhbHVlXG59XG5cbi8vIGNvbnN0IGJ1aWxkTmVzdGVkVXBkYXRlID0gKHBhcmVudCwgZmllbGRQYXRoLCB2YWx1ZSkgPT4ge1xuLy8gICAgIGNvbnN0IHBhdGhTZWdtZW50cyA9IGZpZWxkUGF0aC5zcGxpdCgnLicpO1xuLy8gICAgIGxldCBjdXJyZW50ID0gcGFyZW50O1xuXG4vLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoU2VnbWVudHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4vLyAgICAgICAgIGNvbnN0IHNlZ21lbnQgPSBwYXRoU2VnbWVudHNbaV07XG5cbi8vICAgICAgICAgLy8gSWYgdGhlIHNlZ21lbnQgZG9lc24ndCBleGlzdCBpbiB0aGUgcGFyZW50LCBjcmVhdGUgaXRcbi8vICAgICAgICAgaWYgKCFjdXJyZW50W3NlZ21lbnRdIHx8IHR5cGVvZiBjdXJyZW50W3NlZ21lbnRdICE9PSAnb2JqZWN0Jykge1xuLy8gICAgICAgICAgICAgY3VycmVudFtzZWdtZW50XSA9IHt9O1xuLy8gICAgICAgICB9XG5cbi8vICAgICAgICAgLy8gTW92ZSB0byB0aGUgbmV4dCBsZXZlbCBpbiB0aGUgb2JqZWN0XG4vLyAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50W3NlZ21lbnRdO1xuLy8gICAgIH1cblxuLy8gICAgIC8vIFNldCB0aGUgdmFsdWUgYXQgdGhlIGZpbmFsIHNlZ21lbnRcbi8vICAgICBjdXJyZW50W3BhdGhTZWdtZW50c1twYXRoU2VnbWVudHMubGVuZ3RoIC0gMV1dID0gdmFsdWU7XG5cbi8vICAgICByZXR1cm4gY3VycmVudDtcbi8vIH07XG5cbmxldCB0cmFuc2xhdGVGaWVsZHMgPSBhc3luYyBmdW5jdGlvbiAoZmllbGRWYWx1ZSwgZmllbGRNb2RlbCwgcmVxdWVzdCwgZG9jdW1lbnQsIGFmdGVyKSB7XG5cdC8vIFRoaXMgbWVhbnMgaXQgd29uJ3Qgd29yayB3aXRoIHRyYW5zbGF0ZUFmdGVyIHN1YmZpZWxkcywgYnV0IGl0J3MgYSBob3RmaXguLi5cblx0aWYgKGFmdGVyICYmICFmaWVsZE1vZGVsLnRyYW5zbGF0ZUFmdGVyKSByZXR1cm4gZmllbGRWYWx1ZVxuXG5cdGlmIChmaWVsZE1vZGVsLmFycmF5ICYmIEFycmF5LmlzQXJyYXkoZmllbGRWYWx1ZSkpIHtcblx0XHRyZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwoZmllbGRWYWx1ZS5tYXAoYXN5bmMgKHYpID0+IGF3YWl0IHRyYW5zbGF0ZUZpZWxkcyh2LCBmaWVsZE1vZGVsLCByZXF1ZXN0LCBkb2N1bWVudCwgYWZ0ZXIpKSlcblx0fVxuXG5cdGlmIChmaWVsZE1vZGVsLl9jb21wbGV4RmllbGQpIHtcblx0XHRmb3IgKGNvbnN0IHN1YmZpZWxkTW9kZWwgb2YgZmllbGRNb2RlbC5fZmllbGRzQXJyYXkpIHtcblx0XHRcdGxldCBzdWJmaWVsZFZhbHVlID0gZmllbGRWYWx1ZT8uW3N1YmZpZWxkTW9kZWwuX25hbWVdXG5cdFx0XHRsZXQgZmllbGRFeGlzdHNJbklucHV0RG9jdW1lbnQgPSAhIXN1YmZpZWxkVmFsdWVcblxuXHRcdFx0aWYgKGZpZWxkRXhpc3RzSW5JbnB1dERvY3VtZW50KSB7XG5cdFx0XHRcdGlmIChzdWJmaWVsZE1vZGVsLmFycmF5KSB7XG5cdFx0XHRcdFx0bGV0IG5ld1ZhbCA9IFtdXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ3N1YmZpZWxkVmFsdWUnLCBzdWJmaWVsZFZhbHVlLCBmaWVsZE1vZGVsLl9uYW1lLCBkb2N1bWVudC5pZCwgYWZ0ZXIpXG5cdFx0XHRcdFx0Zm9yIChjb25zdCB2YWwgb2Ygc3ViZmllbGRWYWx1ZSkge1xuXHRcdFx0XHRcdFx0bGV0IHRyYW5zbGF0ZWQgPSBhd2FpdCB0cmFuc2xhdGVGaWVsZHModmFsLCBzdWJmaWVsZE1vZGVsLCByZXF1ZXN0LCBkb2N1bWVudCwgYWZ0ZXIpXG5cdFx0XHRcdFx0XHRuZXdWYWwucHVzaCh0cmFuc2xhdGVkKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmaWVsZFZhbHVlW3N1YmZpZWxkTW9kZWwuX25hbWVdID0gbmV3VmFsXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZmllbGRWYWx1ZVtzdWJmaWVsZE1vZGVsLl9uYW1lXSA9IGF3YWl0IHRyYW5zbGF0ZUZpZWxkcyhzdWJmaWVsZFZhbHVlLCBzdWJmaWVsZE1vZGVsLCByZXF1ZXN0LCBkb2N1bWVudCwgYWZ0ZXIpXG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gZmllbGRWYWx1ZVtzdWJmaWVsZE1vZGVsLl9uYW1lXSA9IGF3YWl0IHRyYW5zbGF0ZUZpZWxkcyhzdWJmaWVsZFZhbHVlLCBzdWJmaWVsZE1vZGVsLCByZXF1ZXN0LCBkb2N1bWVudClcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiAoZmllbGRNb2RlbD8udHJhbnNsYXRlT3V0cHV0KSB7XG5cdFx0Ly8gcmV0dXJuIGF3YWl0IGZpZWxkTW9kZWwudHJhbnNsYXRlT3V0cHV0KGZpZWxkVmFsdWUsIHsgcmVxdWVzdCwgZG9jdW1lbnQgfSlcblx0XHRpZiAoYWZ0ZXIgJiYgZmllbGRNb2RlbC50cmFuc2xhdGVBZnRlcikgcmV0dXJuIGF3YWl0IGZpZWxkTW9kZWwudHJhbnNsYXRlT3V0cHV0KGZpZWxkVmFsdWUsIHsgcmVxdWVzdCwgZG9jdW1lbnQgfSlcblx0XHRpZiAoIWFmdGVyICYmICFmaWVsZE1vZGVsPy50cmFuc2xhdGVBZnRlcikgcmV0dXJuIGF3YWl0IGZpZWxkTW9kZWwudHJhbnNsYXRlT3V0cHV0KGZpZWxkVmFsdWUsIHsgcmVxdWVzdCwgZG9jdW1lbnQgfSlcblx0fVxuXG5cdHJldHVybiBmaWVsZFZhbHVlXG59XG5cbmxldCBwcm90ZWN0RmllbGRzID0gYXN5bmMgZnVuY3Rpb24gKHJlcSwgcmVxdWVzdCwgZmllbGRWYWx1ZSwgZmllbGRNb2RlbCkge1xuXHRpZiAoZmllbGRNb2RlbC5hcnJheSAmJiBBcnJheS5pc0FycmF5KGZpZWxkVmFsdWUpKSB7XG5cdFx0bGV0IHByb3RlY3RlZFJlc3VsdCA9IGF3YWl0IFByb21pc2UuYWxsKGZpZWxkVmFsdWUubWFwKGFzeW5jICh2KSA9PiBhd2FpdCBwcm90ZWN0RmllbGRzKHJlcSwgcmVxdWVzdCwgdiwgZmllbGRNb2RlbCkpKVxuXHR9XG5cblx0aWYgKGZpZWxkTW9kZWwuX2NvbXBsZXhGaWVsZCkge1xuXHRcdGZvciAoY29uc3Qgc3ViZmllbGRNb2RlbCBvZiBmaWVsZE1vZGVsLl9maWVsZHNBcnJheSkge1xuXHRcdFx0bGV0IHN1YmZpZWxkVmFsdWUgPSBmaWVsZFZhbHVlPy5bc3ViZmllbGRNb2RlbC5fbmFtZV1cblx0XHRcdGxldCBmaWVsZEV4aXN0c0luSW5wdXREb2N1bWVudCA9IHN1YmZpZWxkVmFsdWUgIT0gbnVsbFxuXG5cdFx0XHRpZiAoZmllbGRFeGlzdHNJbklucHV0RG9jdW1lbnQpIHtcblx0XHRcdFx0bGV0IHsgYXV0aG9yaXplZCwgdmFsdWUgfSA9IGF3YWl0IHByb3RlY3RGaWVsZHMocmVxLCByZXF1ZXN0LCBzdWJmaWVsZFZhbHVlLCBzdWJmaWVsZE1vZGVsKVxuXHRcdFx0XHRpZiAoIWF1dGhvcml6ZWQpIHtcblx0XHRcdFx0XHRkZWxldGUgZmllbGRWYWx1ZVtzdWJmaWVsZE1vZGVsLl9uYW1lXVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKGZpZWxkTW9kZWwucGVybWlzc2lvbnMpIHtcblx0XHRsZXQgbWVtYmVyID0gcmVxdWVzdC5tZW1iZXJcblxuXHRcdGlmIChtZW1iZXIucm9sZXMuaW5jbHVkZXMoJ2FkbWluJykpIHJldHVybiB7IHZhbHVlOiBmaWVsZFZhbHVlLCBhdXRob3JpemVkOiB0cnVlIH1cblxuXHRcdGxldCBkZWZhdWx0UGVybWlzc2lvbnMgPSB7XG5cdFx0XHRhZG1pbjogWydjcmVhdGUnLCAncmVhZCcsICd1cGRhdGUnLCAnZGVsZXRlJ10sXG5cdFx0XHRvd25lcjogWydyZWFkJywgJ3VwZGF0ZScsICdkZWxldGUnXSxcblx0XHRcdHB1YmxpYzogWydyZWFkJ10sXG5cdFx0fVxuXG5cdFx0bGV0IHBlcm1pc3Npb25zID0gZmllbGRNb2RlbD8ucGVybWlzc2lvbnMgfHwgZGVmYXVsdFBlcm1pc3Npb25zXG5cdFx0cGVybWlzc2lvbnMgPSBBcnJheS5pc0FycmF5KHBlcm1pc3Npb25zKSA/IHsgcHVibGljOiBwZXJtaXNzaW9ucyB9IDogcGVybWlzc2lvbnNcblxuXHRcdGlmICh0eXBlb2YgcGVybWlzc2lvbnMgPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGF3YWl0IHBlcm1pc3Npb25zKHJlcXVlc3QpXG5cblx0XHRsZXQgYXV0aG9yaXplZCA9IG1lbWJlci5yb2xlcy5zb21lKChyb2xlKSA9PiBBcnJheS5pc0FycmF5KHBlcm1pc3Npb25zPy5bcm9sZV0pICYmIHBlcm1pc3Npb25zPy5bcm9sZV0/LmluY2x1ZGVzKHJlcXVlc3QubWV0aG9kKSlcblx0XHRpZiAoYXV0aG9yaXplZCkgcmV0dXJuIHsgdmFsdWU6IGZpZWxkVmFsdWUsIGF1dGhvcml6ZWQgfVxuXG5cdFx0Zm9yIChsZXQgcm9sZSBvZiBtZW1iZXIucm9sZXMpIHtcblx0XHRcdGlmIChwZXJtaXNzaW9ucz8uW3JvbGVdPy5bcmVxdWVzdC5tZXRob2RdID09PSB0cnVlKSBhdXRob3JpemVkID0gdHJ1ZVxuXHRcdFx0aWYgKHR5cGVvZiBwZXJtaXNzaW9ucz8uW3JvbGVdPy5bcmVxdWVzdC5tZXRob2RdID09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0bGV0IHJlc29sdmVyID0gcGVybWlzc2lvbnM/Lltyb2xlXT8uW3JlcXVlc3QubWV0aG9kXVxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gYXdhaXQgcmVzb2x2ZXIocmVxdWVzdClcblx0XHRcdFx0aWYgKHJlc3VsdCA9PT0gdHJ1ZSB8fCByZXN1bHQ/LmF1dGhvcml6ZWQgPT09IHRydWUpIGF1dGhvcml6ZWQgPSB0cnVlXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHsgdmFsdWU6IGF1dGhvcml6ZWQgPyBmaWVsZFZhbHVlIDogbnVsbCwgYXV0aG9yaXplZCB9XG5cblx0XHQvLyBpZiAodHlwZW9mKGZpZWxkTW9kZWw/LnByb3RlY3RlZCkgPT09ICdmdW5jdGlvbicpIHtcblx0XHQvLyAgICAgYXV0aG9yaXplZCA9IGZpZWxkTW9kZWw/LnByb3RlY3RlZCh7cmVxdWVzdCwgcmVxfSlcblx0XHQvLyAgICAgYXV0aG9yaXplZCA9IHR5cGVvZihhdXRob3JpemVkKSA9PT0gJ29iamVjdCcgPyBhdXRob3JpemVkLmF1dGhvcml6ZWQgOiBhdXRob3JpemVkXG5cdFx0Ly8gfVxuXHR9XG5cblx0cmV0dXJuIHsgdmFsdWU6IGZpZWxkVmFsdWUsIGF1dGhvcml6ZWQ6IHRydWUgfVxufVxuXG5sZXQgc2F2ZVBlcnNvbmFsRmllbGRzID0gYXN5bmMgZnVuY3Rpb24gKHZhbHVlLCBmaWVsZCwgcmVxdWVzdCwgcGFyZW50LCBjb2xsZWN0aW9uLCBpZCkge1xuXHRpZiAoZmllbGQuYXJyYXkgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRyZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwodmFsdWUubWFwKGFzeW5jICh2LCBpKSA9PiBhd2FpdCBzYXZlUGVyc29uYWxGaWVsZHModiwgZmllbGQsIHJlcXVlc3QsIHBhcmVudCwgY29sbGVjdGlvbiwgaWQpKSlcblx0fVxuXG5cdGlmIChmaWVsZC5fY29tcGxleEZpZWxkKSB7XG5cdFx0Zm9yIChjb25zdCBzdWJmaWVsZE1vZGVsIG9mIGZpZWxkLl9maWVsZHNBcnJheSkge1xuXHRcdFx0bGV0IHN1YmZpZWxkVmFsdWUgPSB2YWx1ZT8uW3N1YmZpZWxkTW9kZWwuX25hbWVdXG5cdFx0XHRsZXQgZmllbGRFeGlzdHNJbklucHV0RG9jdW1lbnQgPSAhIXN1YmZpZWxkVmFsdWVcblxuXHRcdFx0Ly8gY29uc29sZS5sb2coc3ViZmllbGRNb2RlbC5fbmFtZSwgZmllbGRFeGlzdHNJbklucHV0RG9jdW1lbnQsIHN1YmZpZWxkVmFsdWUpXG5cblx0XHRcdGlmIChmaWVsZEV4aXN0c0luSW5wdXREb2N1bWVudCkge1xuXHRcdFx0XHR2YWx1ZVtzdWJmaWVsZE1vZGVsLl9uYW1lXSA9IGF3YWl0IHNhdmVQZXJzb25hbEZpZWxkcyhzdWJmaWVsZFZhbHVlLCBzdWJmaWVsZE1vZGVsLCByZXF1ZXN0LCB2YWx1ZSwgY29sbGVjdGlvbiwgaWQpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKGZpZWxkLnBlcnNvbmFsKSB7XG5cdFx0Ly8gY29uc29sZS5sb2coJ1BFUlNPTkFMOiB2YWx1ZScsIHZhbHVlKVxuXG5cdFx0bGV0IG1pY3JvQ29sbGVjdGlvbiA9IGBfXyR7Y29sbGVjdGlvbn1fcGVyc29uYWxfJHtmaWVsZC5fbmFtZX1gXG5cdFx0Ly8gU2F2ZSB0aGUgZmllbGQgdG8gdGhlIG1pY3JvLWNvbGxlY3Rpb25cblx0XHRhd2FpdCB1cHNlcnRFbnRyeSh7XG5cdFx0XHRjb2xsZWN0aW9uOiBtaWNyb0NvbGxlY3Rpb24sXG5cdFx0XHRzZWFyY2g6IHsgYXV0aG9ySWQ6IHJlcXVlc3QubWVtYmVyLmlkLCBkb2N1bWVudElkOiBpZCB9LFxuXHRcdFx0dXBkYXRlZEVudHJ5OiB7IGF1dGhvcklkOiByZXF1ZXN0Lm1lbWJlci5pZCwgZG9jdW1lbnRJZDogaWQsIHZhbHVlIH0sXG5cdFx0fSlcblx0fVxufVxuXG5sZXQgZ2V0UGVyc29uYWxGaWVsZHMgPSBhc3luYyBmdW5jdGlvbiAoZmllbGRNb2RlbCwgZmllbGRWYWx1ZSwgcmVxdWVzdCwgY29sbGVjdGlvbiwgaWQsIGRvY3VtZW50LCBwYXJlbnQpIHtcblx0aWYgKGZpZWxkTW9kZWwuYXJyYXkgJiYgQXJyYXkuaXNBcnJheShmaWVsZFZhbHVlKSkge1xuXHRcdGF3YWl0IFByb21pc2UuYWxsKGZpZWxkVmFsdWUubWFwKGFzeW5jICh2KSA9PiBhd2FpdCBnZXRQZXJzb25hbEZpZWxkcyhmaWVsZE1vZGVsLCB2LCByZXF1ZXN0LCBjb2xsZWN0aW9uLCBpZCwgcGFyZW50KSkpXG5cdH1cblxuXHRpZiAoZmllbGRNb2RlbC5fY29tcGxleEZpZWxkKSB7XG5cdFx0Zm9yIChjb25zdCBzdWJmaWVsZE1vZGVsIG9mIGZpZWxkTW9kZWwuX2ZpZWxkc0FycmF5KSB7XG5cdFx0XHRsZXQgc3ViZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWU/LltzdWJmaWVsZE1vZGVsLl9uYW1lXVxuXHRcdFx0bGV0IGZpZWxkRXhpc3RzSW5JbnB1dERvY3VtZW50ID0gc3ViZmllbGRWYWx1ZSAhPSBudWxsXG5cblx0XHRcdGlmIChmaWVsZEV4aXN0c0luSW5wdXREb2N1bWVudCkge1xuXHRcdFx0XHRhd2FpdCBnZXRQZXJzb25hbEZpZWxkcyhzdWJmaWVsZE1vZGVsLCBzdWJmaWVsZFZhbHVlLCByZXF1ZXN0LCBjb2xsZWN0aW9uLCBpZCwgZmllbGRWYWx1ZSlcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiAoZmllbGRNb2RlbC5wZXJzb25hbCkge1xuXHRcdC8vIGNvbnNvbGUubG9nKCdnZXR0aW5nJywgZmllbGRNb2RlbC5fbmFtZSlcblxuXHRcdGxldCBtaWNyb0NvbGxlY3Rpb24gPSBgX18ke2NvbGxlY3Rpb259X3BlcnNvbmFsXyR7ZmllbGRNb2RlbC5fbmFtZX1gXG5cblx0XHRsZXQgdmFsdWUgPSBhd2FpdCByZWFkRW50cnkoe1xuXHRcdFx0Y29sbGVjdGlvbjogbWljcm9Db2xsZWN0aW9uLFxuXHRcdFx0c2VhcmNoOiB7IGF1dGhvcklkOiByZXF1ZXN0Lm1lbWJlci5pZCwgZG9jdW1lbnRJZDogaWQgfSxcblx0XHR9KVxuXG5cdFx0Ly8gY29uc29sZS5sb2coJ3ZhbHVlJywgdmFsdWUpXG5cdFx0Ly8gY29uc29sZS5sb2coJ3BhcmVudCcsIHBhcmVudClcblxuXHRcdHBhcmVudFtmaWVsZE1vZGVsLl9uYW1lXSA9IHZhbHVlPy52YWx1ZVxuXHR9XG59XG5cbmxldCBwb3N0UHJvY2VzcyA9IGFzeW5jIGZ1bmN0aW9uIChkb2N1bWVudCwgcmVxdWVzdCwgcmVxKSB7XG5cdGlmICghZG9jdW1lbnQpIHtcblx0XHRyZXR1cm5cblx0fVxuXHRsZXQgbXVsdGlwbGUgPSBBcnJheS5pc0FycmF5KGRvY3VtZW50KVxuXHRsZXQgZG9jdW1lbnRzID0gbXVsdGlwbGUgPyBkb2N1bWVudCA6IFtkb2N1bWVudF1cblxuXHRmb3IgKGNvbnN0IGRvY3VtZW50IG9mIGRvY3VtZW50cykge1xuXHRcdGxldCBjb2xsZWN0aW9uID0gZG9jdW1lbnQuY29sbGVjdGlvblxuXHRcdGxldCBpZCA9IGRvY3VtZW50LmlkXG5cblx0XHRsZXQgb3JpZ2luYWxEb2N1bWVudCA9IGNsb25lRGVlcChkb2N1bWVudClcblxuXHRcdGxldCBjb2xsZWN0aW9uTW9kZWwgPSBjb2xsZWN0aW9ucy5maW5kKChjKSA9PiBjLm5hbWUgPT0gcmVxdWVzdC5jb2xsZWN0aW9uKVxuXG5cdFx0Ly8gY29uc29sZS5sb2coJ2JlZm9yZScsIGRvY3VtZW50KVxuXG5cdFx0Ly8gUnVuIFRyYW5zbGF0aW9uc1xuXHRcdGZvciAoY29uc3QgZiBvZiBPYmplY3Qua2V5cyhkb2N1bWVudCkpIHtcblx0XHRcdGxldCB2YWx1ZSA9IGRvY3VtZW50W2ZdXG5cdFx0XHRsZXQgZmllbGRNb2RlbCA9IGNvbGxlY3Rpb25Nb2RlbD8uZmllbGRzW2ZdXG5cdFx0XHRpZiAoIWZpZWxkTW9kZWwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb250aW51ZVxuXHRcdFx0fVxuXHRcdFx0ZG9jdW1lbnRbZl0gPSBhd2FpdCB0cmFuc2xhdGVGaWVsZHModmFsdWUsIGZpZWxkTW9kZWwsIHJlcXVlc3QsIGRvY3VtZW50LCBmYWxzZSlcblx0XHR9XG5cblx0XHQvLyBSdW4gQ29tcHV0YXRpb25zXG5cdFx0Zm9yIChjb25zdCBmaWVsZCBvZiBjb2xsZWN0aW9uTW9kZWwuX2ZpZWxkc0FycmF5KSB7XG5cdFx0XHRsZXQgb3JpZ2luYWxWYWx1ZSA9IGRvY3VtZW50W2ZpZWxkLl9uYW1lXVxuXHRcdFx0bGV0IHB0T3JpZ2luYWxWYWx1ZSA9IG9yaWdpbmFsRG9jdW1lbnRbZmllbGQuX25hbWVdXG5cdFx0XHRpZiAoKG9yaWdpbmFsVmFsdWUgIT0gdW5kZWZpbmVkIHx8IGZpZWxkLmNvbXB1dGVkKSAmJiAoIXJlcXVlc3QuZmllbGRzIHx8IHJlcXVlc3QuZmllbGRzPy5pbmNsdWRlcyhmaWVsZC5fbmFtZSkpKSB7XG5cdFx0XHRcdGRvY3VtZW50W2ZpZWxkLl9uYW1lXSA9IGF3YWl0IGNvbXB1dGVGaWVsZHMocmVxdWVzdCwgZG9jdW1lbnQsIG9yaWdpbmFsVmFsdWUsIGZpZWxkLCBudWxsLCBvcmlnaW5hbERvY3VtZW50LCBwdE9yaWdpbmFsVmFsdWUsIG51bGwpXG5cdFx0XHR9IGVsc2UgaWYgKCFyZXF1ZXN0Py5maWVsZHM/Lmxlbmd0aCkge1xuXHRcdFx0XHQvLyBEbyB0aGlzIHNvIGl0IGFsd2F5cyByZXR1cm5zIHRvcCBsZXZlbCBmaWVsZHMgZXZlbiBpZiB0aGV5IGRvbid0IGV4aXN0IGZvciBhIGNvbnNpc3RlbnQgZGF0YSBtb2RlbFxuXHRcdFx0XHRkb2N1bWVudFtmaWVsZC5fbmFtZV0gPSBudWxsXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gUnVuIFRyYW5zbGF0aW9ucyBBZnRlciAoZm9yIGNvbXB1dGVkIHJlbGF0aW9uc2hpcHMgZXRjLi4uKVxuXHRcdGZvciAoY29uc3QgZiBvZiBPYmplY3Qua2V5cyhkb2N1bWVudCkpIHtcblx0XHRcdGxldCB2YWx1ZSA9IGRvY3VtZW50W2ZdXG5cdFx0XHRsZXQgZmllbGRNb2RlbCA9IGNvbGxlY3Rpb25Nb2RlbD8uZmllbGRzW2ZdXG5cdFx0XHRpZiAoIWZpZWxkTW9kZWwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb250aW51ZVxuXHRcdFx0fVxuXHRcdFx0ZG9jdW1lbnRbZl0gPSBhd2FpdCB0cmFuc2xhdGVGaWVsZHModmFsdWUsIGZpZWxkTW9kZWwsIHJlcXVlc3QsIGRvY3VtZW50LCB0cnVlKVxuXHRcdH1cblxuXHRcdC8vIFBlcnNvbmFsIGZpZWxkc1xuXHRcdGlmIChyZXF1ZXN0Lm1lbWJlcj8uaWQpIHtcblx0XHRcdGlmIChyZXF1ZXN0Lm1ldGhvZCA9PT0gJ2NyZWF0ZScgfHwgcmVxdWVzdC5tZXRob2QgPT09ICd1cGRhdGUnKSB7XG5cdFx0XHRcdGxldCBkb2N1bWVudEZpZWxkcyA9IE9iamVjdC5rZXlzKHJlcXVlc3QuZG9jdW1lbnQpXG5cblx0XHRcdFx0Ly8gU2F2ZSBQZXJzb25hbCBGaWVsZHNcblx0XHRcdFx0Zm9yIChjb25zdCBmIG9mIGRvY3VtZW50RmllbGRzKSB7XG5cdFx0XHRcdFx0bGV0IHZhbHVlID0gcmVxdWVzdC5kb2N1bWVudFtmXVxuXHRcdFx0XHRcdGxldCBmaWVsZE1vZGVsID0gY29sbGVjdGlvbk1vZGVsPy5maWVsZHNbZl1cblx0XHRcdFx0XHRpZiAoIWZpZWxkTW9kZWwpIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGF3YWl0IHNhdmVQZXJzb25hbEZpZWxkcyh2YWx1ZSwgZmllbGRNb2RlbCwgcmVxdWVzdCwgcmVxdWVzdC5kb2N1bWVudCwgY29sbGVjdGlvbiwgaWQpXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gR2V0IFBlcnNvbmFsIEZpZWxkc1xuXHRcdFx0Zm9yIChjb25zdCBmaWVsZE1vZGVsIG9mIGNvbGxlY3Rpb25Nb2RlbC5fZmllbGRzQXJyYXkpIHtcblx0XHRcdFx0bGV0IHZhbHVlID0gZG9jdW1lbnRbZmllbGRNb2RlbC5fbmFtZV1cblx0XHRcdFx0YXdhaXQgZ2V0UGVyc29uYWxGaWVsZHMoZmllbGRNb2RlbCwgdmFsdWUsIHJlcXVlc3QsIGNvbGxlY3Rpb24sIGlkLCBkb2N1bWVudCwgZG9jdW1lbnQpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gY29uc29sZS5sb2coJ2FmdGVyJywgZG9jdW1lbnQpXG5cdFx0Ly8gY29uc29sZS5kaXIoZG9jdW1lbnQsIHtkZXB0aDogbnVsbH0pXG5cblx0XHQvLyBSdW4gUHJvdGVjdGlvblxuXHRcdGZvciAoY29uc3QgZiBvZiBPYmplY3Qua2V5cyhkb2N1bWVudCkpIHtcblx0XHRcdGxldCBmaWVsZFZhbHVlID0gZG9jdW1lbnRbZl1cblx0XHRcdGxldCBmaWVsZE1vZGVsID0gY29sbGVjdGlvbk1vZGVsPy5maWVsZHNbZl1cblx0XHRcdGlmICghZmllbGRNb2RlbCkge1xuXHRcdFx0XHRjb250aW51ZVxuXHRcdFx0fVxuXG5cdFx0XHRsZXQgeyBhdXRob3JpemVkLCB2YWx1ZSB9ID0gYXdhaXQgcHJvdGVjdEZpZWxkcyhyZXEsIHJlcXVlc3QsIGZpZWxkVmFsdWUsIGZpZWxkTW9kZWwpXG5cblx0XHRcdGlmICghYXV0aG9yaXplZCkge1xuXHRcdFx0XHRkZWxldGUgZG9jdW1lbnRbZl1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRvY3VtZW50W2ZdID0gdmFsdWVcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBHZXQgcmlkIG9mIHRoaXMsIGl0J3MgaHVnZSBhbmQgdW5uY2Vzc2FyeS4uLiBqdXN0IGRvbid0IHJlbW92ZSBpdCBmcm9tIHJlYWRFbnRyeSBiZWNhdXNlIHdlIG5lZWQgaXQgaW4gdGhlIGhvb2tzLlxuXHRcdGRlbGV0ZSBkb2N1bWVudC5oaXRzXG5cdH1cblxuXHRyZXR1cm4gbXVsdGlwbGUgPyBkb2N1bWVudHMgOiBkb2N1bWVudHNbMF1cbn1cblxuZXhwb3J0IHsgcG9zdFByb2Nlc3MgfVxuIiwiZnVuY3Rpb24gcmVxdWlyZUFsbChyKSB7XG4gICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgci5rZXlzKCkubWFwKGZ1bmN0aW9uIChtcGF0aCwgLi4uYXJncykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcihtcGF0aCwgLi4uYXJncyk7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gbXBhdGhcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvKD86XlsuXFwvXSpcXC98XFwuW14uXSskKS9nLCBcIlwiKSAvLyBUcmltXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLy9nLCBcIl9cIik7IC8vIFJlbGFjZSAnLydzIGJ5ICdfJ3NcbiAgICAgICAgICAgIHJldHVybiBbbmFtZSwgcmVzdWx0XTtcbiAgICAgICAgfSlcbiAgICApO1xufVxuY29uc3QgYWxsTW9kdWxlcyA9IHJlcXVpcmVBbGwoXG4gICAgcmVxdWlyZS5jb250ZXh0KFxuICAgICAgICAvLyBBbnkga2luZCBvZiB2YXJpYWJsZXMgY2Fubm90IGJlIHVzZWQgaGVyZVxuICAgICAgICBcIkBtYW5nby9ob29rc1wiLCAvLyAoV2VicGFjayBiYXNlZCkgcGF0aFxuICAgICAgICB0cnVlLCAvLyBVc2Ugc3ViZGlyZWN0b3JpZXNcbiAgICAgICAgLy4qXFwuanMkLyAvLyBGaWxlIG5hbWUgcGF0dGVyblxuICAgIClcbik7XG5cbmxldCBhbGxIb29rcyA9IE9iamVjdC5rZXlzKGFsbE1vZHVsZXMpLnJlZHVjZSgoYSwgaykgPT4ge1xuICAgIGlmIChrICE9IFwiaW5kZXhcIikge1xuICAgICAgICBsZXQgaG9va3MgPSBhbGxNb2R1bGVzW2tdO1xuICAgICAgICBob29rcyA9IE9iamVjdC5rZXlzKGhvb2tzKS5tYXAoKGspID0+IGhvb2tzW2tdKTtcbiAgICAgICAgaWYgKGhvb2tzKSB7XG4gICAgICAgICAgICByZXR1cm4gWy4uLmEsIC4uLmhvb2tzXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYTtcbn0sIFtdKTtcblxuLy8gZXhwb3J0IGZ1bmN0aW9uIHJ1bkhvb2tzKCkge1xuLy8gICAgIGFsbEhvb2tzLmZvckVhY2goaG9vayA9PiBob29rKCkpXG4vLyB9XG5cbmltcG9ydCBjb2xsZWN0aW9ucyBmcm9tIFwiLi4vMS4gYnVpbGQvY29sbGVjdGlvbnNcIjtcblxuY29uc3QgaG9va1R5cGVzID0ge1xuICAgIGNyZWF0ZTogXCJjcmVhdGVkXCIsXG4gICAgcmVhZDogXCJyZWFkXCIsXG4gICAgdXBkYXRlOiBcInVwZGF0ZWRcIixcbiAgICBkZWxldGU6IFwiZGVsZXRlZFwiLFxufTtcblxuYXN5bmMgZnVuY3Rpb24gcnVuSG9va3MoZSkge1xuXG4gICAgbGV0IHtcbiAgICAgICAgcmVxLFxuICAgICAgICByZXF1ZXN0LFxuICAgICAgICBkb2N1bWVudCxcbiAgICAgICAgcmF3RG9jdW1lbnQsXG4gICAgICAgIG9yaWdpbmFsRG9jdW1lbnQsXG4gICAgICAgIGlvXG4gICAgfSA9IGU7XG5cbiAgICBlLm9sZERvY3VtZW50ID0gb3JpZ2luYWxEb2N1bWVudFxuICAgIGVbZG9jdW1lbnQ/LmNvbGxlY3Rpb25dID0gZG9jdW1lbnRcbiAgICBlW2BvcmlnaW5hbCR7ZG9jdW1lbnQ/LmNvbGxlY3Rpb259YF0gPSBvcmlnaW5hbERvY3VtZW50XG4gICAgZVtgb2xkJHtkb2N1bWVudD8uY29sbGVjdGlvbn1gXSA9IG9yaWdpbmFsRG9jdW1lbnRcbiAgICBlW2ByYXcke2RvY3VtZW50Py5jb2xsZWN0aW9ufWBdID0gcmF3RG9jdW1lbnRcblxuICAgIGxldCBkb2N1bWVudHMgPSBBcnJheS5pc0FycmF5KGRvY3VtZW50KSA/IGRvY3VtZW50IDogW2RvY3VtZW50XVxuICAgIGxldCBpbmRpdmlkdWFsID0gIUFycmF5LmlzQXJyYXkoZG9jdW1lbnQpXG5cbiAgICBsZXQgY29sbGVjdGlvbk5hbWUgPSBkb2N1bWVudHM/LlswXT8uY29sbGVjdGlvbiB8fCBvcmlnaW5hbERvY3VtZW50Py5jb2xsZWN0aW9uO1xuICAgIGxldCBjb2xsZWN0aW9uTW9kZWwgPSBjb2xsZWN0aW9ucy5maW5kKChjKSA9PiBjLm5hbWUgPT0gY29sbGVjdGlvbk5hbWUpO1xuXG4gICAgbGV0IGhvb2tUeXBlID0gaG9va1R5cGVzW3JlcXVlc3QubWV0aG9kXTtcblxuICAgIGlmIChob29rVHlwZSA9PSAncmVhZCcgJiYgIWluZGl2aWR1YWwpIHtcbiAgICAgICAgaWYgKGNvbGxlY3Rpb25Nb2RlbD8uaG9va3M/Lmxpc3QpIHtcbiAgICAgICAgICAgIGF3YWl0IGNvbGxlY3Rpb25Nb2RlbC5ob29rcy5saXN0KHsgLi4uZSwgZG9jdW1lbnRzLCBpbmRpdmlkdWFsLCBpbyB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGRvY3VtZW50IG9mIGRvY3VtZW50cykge1xuXG4gICAgICAgIGlmIChjb2xsZWN0aW9uTW9kZWw/Lmhvb2tzPy5baG9va1R5cGVdKSB7XG4gICAgICAgICAgICBhd2FpdCBjb2xsZWN0aW9uTW9kZWwuaG9va3NbaG9va1R5cGVdKHsgLi4uZSwgZG9jdW1lbnQsIGluZGl2aWR1YWwsIGlvIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlcXVlc3QucXVldWU/Lltob29rVHlwZV0pIHtcbiAgICAgICAgICAgIGZvciAobGV0IGhvb2sgb2YgcmVxdWVzdC5xdWV1ZT8uW2hvb2tUeXBlXSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGhvb2soZG9jdW1lbnQsIHJlcXVlc3QpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGhvb2sgb2YgYWxsSG9va3MpIHtcbiAgICAgICAgICAgIGhvb2soeyAuLi5lLCBkb2N1bWVudCwgaG9va1R5cGUsIGluZGl2aWR1YWwsIGNvbGxlY3Rpb246IGNvbGxlY3Rpb25Nb2RlbCwgaW8gfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYWxsSG9va3MuZm9yRWFjaChob29rID0+IGhvb2soeyBob29rVHlwZSwgcmVxLCByZXF1ZXN0LCBkb2N1bWVudCwgb3JpZ2luYWxEb2N1bWVudCB9KSlcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgcnVuSG9va3MgfTtcbiIsImltcG9ydCBzZXR0aW5ncyBmcm9tICdAY29uZmlnL2NvbmZpZy9zZXR0aW5ncy5qc29uJ1xuaW1wb3J0IHsgcmVhZEVudHJ5LCB1cGRhdGVFbnRyeSwgcmVhZEVudHJpZXMsIGNyZWF0ZUVudHJ5LCBkZWxldGVFbnRyeSwgdXBkYXRlRW50cmllcywgdXBzZXJ0RW50cnksIGRlbGV0ZUVudHJpZXMsIGNvdW50RW50cmllcyB9IGZyb20gJ0BjbXMvMS4gYnVpbGQvbGlicmFyaWVzL21vbmdvJ1xuaW1wb3J0IHsgZ2V0TWVtYmVyIH0gZnJvbSAnQGNtcy8yLiBwcm9jZXNzLzEuIGZvcm1hdFJlcXVlc3QnXG5pbXBvcnQgY29sbGVjdGlvbnMgZnJvbSAnQGNtcy8xLiBidWlsZC9jb2xsZWN0aW9ucydcbmltcG9ydCBmaWVsZHMgZnJvbSAnQGNtcy8xLiBidWlsZC9maWVsZHMnXG5pbXBvcnQgcGx1Z2lucyBmcm9tICdAY21zLzEuIGJ1aWxkL3BsdWdpbnMnXG5pbXBvcnQgc2VuZEVtYWlsLCB7IHNlbmRCdWxrRW1haWwgfSBmcm9tICdAY21zLzEuIGJ1aWxkL2hlbHBlcnMvZW1haWwnXG5pbXBvcnQgeyBwcm9jZXNzUmVxdWVzdCB9IGZyb20gJ0BjbXMvMi4gcHJvY2Vzcy8wLiBtYWluJ1xuaW1wb3J0IHVwbG9hZCBmcm9tICdAY21zLzEuIGJ1aWxkL2hlbHBlcnMvdXBsb2FkJ1xuaW1wb3J0IGRvd25sb2FkRmlsZSBmcm9tICdAY21zLzEuIGJ1aWxkL2hlbHBlcnMvZG93bmxvYWQnXG5pbXBvcnQgY3JlYXRlRmllbGQgZnJvbSAnQGNtcy8xLiBidWlsZC9maWVsZHMvY3JlYXRlRmllbGQnXG5pbXBvcnQgY3JlYXRlQ29sbGVjdGlvbiBmcm9tICdAY21zLzEuIGJ1aWxkL2NvbGxlY3Rpb25zL2NyZWF0ZUNvbGxlY3Rpb24nXG5cbmV4cG9ydCB7XG4gICAgcmVhZEVudHJ5LFxuICAgIHVwZGF0ZUVudHJ5LFxuICAgIHJlYWRFbnRyaWVzLFxuICAgIGNyZWF0ZUVudHJ5LFxuICAgIGdldE1lbWJlcixcbiAgICBjb2xsZWN0aW9ucyxcbiAgICBmaWVsZHMsXG4gICAgcGx1Z2lucyxcbiAgICBzZW5kRW1haWwsXG4gICAgc2VuZEJ1bGtFbWFpbCxcbiAgICBwcm9jZXNzUmVxdWVzdCxcbiAgICB1cGxvYWQsXG4gICAgZG93bmxvYWRGaWxlLFxuICAgIHNldHRpbmdzLFxuICAgIGRlbGV0ZUVudHJ5LFxuICAgIHVwZGF0ZUVudHJpZXMsXG4gICAgdXBzZXJ0RW50cnksXG4gICAgZGVsZXRlRW50cmllcyxcbiAgICBjb3VudEVudHJpZXMsXG4gICAgY3JlYXRlRmllbGQsXG4gICAgY3JlYXRlQ29sbGVjdGlvbixcbn1cblxuLy8gY29uc29sZS5sb2coJ2NvbGxlY3Rpb25zJywgY29sbGVjdGlvbnMubWFwKGMgPT4gYy5uYW1lKSlcblxuLy8gbGV0IGFwaSA9IGBodHRwOi8vbG9jYWxob3N0OiR7c2V0dGluZ3MucG9ydH1gXG5sZXQgaW5pdCA9ICgpID0+IHtcbiAgICBjb25zdCBNYW5nbyA9IGNvbGxlY3Rpb25zLnJlZHVjZSgoYSwgYykgPT4ge1xuXG4gICAgICAgIGxldCBydW5RdWVyeSA9IGFzeW5jICh7IGxpbWl0LCBwYWdlLCBzZWFyY2gsIGZpZWxkcywgaWQsIHNvcnQsIGRlcHRoTGltaXQsIGF1dGhvcml6ZWQsIG1lbWJlciB9ID0ge30pID0+IHtcblxuICAgICAgICAgICAgbGV0IGZ1bGxRdWVyeVxuXG5cbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHsgbGltaXQsIHBhZ2UsIHNlYXJjaCwgZmllbGRzLCBzb3J0LCBkZXB0aExpbWl0IH1cblxuICAgICAgICAgICAgZGVwdGhMaW1pdCA9IDJcblxuICAgICAgICAgICAgaWYgKHBhcmFtcy5zZWFyY2ggIT0gdW5kZWZpbmVkKSBwYXJhbXMuc2VhcmNoID0gSlNPTi5zdHJpbmdpZnkocGFyYW1zLnNlYXJjaClcbiAgICAgICAgICAgIGlmIChwYXJhbXMuZmllbGRzICE9IHVuZGVmaW5lZCkgcGFyYW1zLmZpZWxkcyA9IEpTT04uc3RyaW5naWZ5KHBhcmFtcy5maWVsZHMpXG4gICAgICAgICAgICBpZiAocGFyYW1zLnNvcnQgIT0gdW5kZWZpbmVkKSBwYXJhbXMuc29ydCA9IEpTT04uc3RyaW5naWZ5KHBhcmFtcy5zb3J0KVxuXG4gICAgICAgICAgICBjb25zdCBxdWVyeSA9IE9iamVjdC5rZXlzKHBhcmFtcylcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGtleSA9PiBwYXJhbXNba2V5XSAhPSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgPy5tYXAoa2V5ID0+IGAke2VuY29kZVVSSUNvbXBvbmVudChrZXkpfT0ke2VuY29kZVVSSUNvbXBvbmVudChwYXJhbXNba2V5XSl9YClcbiAgICAgICAgICAgICAgICA/LmpvaW4oJyYnKSB8fCAnJ1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocXVlcnkpXG5cbiAgICAgICAgICAgIGxldCBwYXRoID0gYC8ke2MubmFtZX0vJHtpZCB8fCAnJ31gXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhmdWxsUXVlcnkpXG5cbiAgICAgICAgICAgIGlmICghbWVtYmVyICYmIGF1dGhvcml6ZWQpIG1lbWJlciA9IGF3YWl0IHJlYWRFbnRyeSh7Y29sbGVjdGlvbjogJ21lbWJlcnMnLCBzZWFyY2g6IHtyb2xlczogJ2FkbWluJ319KVxuICAgICAgICAgICAgbGV0IGF1dGhvcml6YXRpb24gPSBgJHttZW1iZXI/LnBhc3N3b3JkPy5oYXNofToke21lbWJlcj8uaWR9YFxuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb2Nlc3NSZXF1ZXN0KHtwYXRoLCBxdWVyeTogcGFyYW1zLCBoZWFkZXJzOiB7IGF1dGhvcml6YXRpb24gfSwgbWV0aG9kOiAncmVhZCd9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNvbHZlKHJlc3BvbnNlPy5yZXNwb25zZSkpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IHJlamVjdChlKSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBydW5HcmFwaHFsID0gYXN5bmMgKHF1ZXJ5LCB7YXV0aG9yaXplZCwgbWVtYmVyfSA9IHt9KSA9PiB7XG5cbiAgICAgICAgICAgIGlmICghbWVtYmVyICYmIGF1dGhvcml6ZWQpIG1lbWJlciA9IGF3YWl0IHJlYWRFbnRyeSh7Y29sbGVjdGlvbjogJ21lbWJlcnMnLCBzZWFyY2g6IHtyb2xlczogJ2FkbWluJ319KVxuICAgICAgICAgICAgbGV0IGF1dGhvcml6YXRpb24gPSBgJHttZW1iZXI/LnBhc3N3b3JkPy5oYXNofToke21lbWJlcj8uaWR9YFxuXG4gICAgICAgICAgICBxdWVyeSA9IHF1ZXJ5LmluY2x1ZGVzKCdtdXRhdGlvbicpID8geyBxdWVyeSB9IDogeyBxdWVyeTogYHF1ZXJ5IHsgJHtxdWVyeX0gfWAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzUmVxdWVzdCh7cGF0aDogYC9ncmFwaHFsYCwgbWV0aG9kOiAncG9zdCcsIGJvZHk6IHF1ZXJ5LCBoZWFkZXJzOiB7IGF1dGhvcml6YXRpb24gfX0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc29sdmUocmVzcG9uc2U/LmRhdGEpKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiByZWplY3QoZSkpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH1cblxuXG4gICAgICAgIGxldCBzYXZlID0gYXN5bmMgKGRhdGEsIHthdXRob3JpemVkLCBtZW1iZXJ9ID0ge30pID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdhdXRob3JpemVkJywgYXV0aG9yaXplZClcbiAgICAgICAgICAgIGlmICghbWVtYmVyICYmIGF1dGhvcml6ZWQpIG1lbWJlciA9IGF3YWl0IHJlYWRFbnRyeSh7Y29sbGVjdGlvbjogJ21lbWJlcnMnLCBzZWFyY2g6IHtyb2xlczogJ2FkbWluJ319KVxuICAgICAgICAgICAgbGV0IGF1dGhvcml6YXRpb24gPSBgJHttZW1iZXI/LnBhc3N3b3JkPy5oYXNofToke21lbWJlcj8uaWR9YFxuXG4gICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgICAgICAgICAgIGxldCB7IGlkIH0gPSBkYXRhXG4gICAgICAgICAgICBsZXQgbWV0aG9kID0gaWQgPyAndXBkYXRlJyA6ICdjcmVhdGUnXG5cbiAgICAgICAgICAgIC8vIC8vIFJlbW92ZSBfaWQgYW5kIGNvbXB1dGVkIGZpZWxkc1xuICAgICAgICAgICAgZGVsZXRlIGRhdGEuY29sbGVjdGlvblxuICAgICAgICAgICAgZGVsZXRlIGRhdGEuX2lkXG4gICAgICAgICAgICBkZWxldGUgZGF0YS5pZFxuXG4gICAgICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiBjLl9maWVsZHNBcnJheSkge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZC5jb21wdXRlZCkgZGVsZXRlIGRhdGFbZmllbGQuX25hbWVdXG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkLm5hbWUgPT0gJ3JlbGF0aW9uc2hpcCcgJiYgZGF0YVtmaWVsZC5fbmFtZV0pIGRhdGFbZmllbGQuX25hbWVdID0gQXJyYXkuaXNBcnJheShkYXRhW2ZpZWxkLl9uYW1lXSkgPyBkYXRhW2ZpZWxkLl9uYW1lXS5tYXAociA9PiByLmlkKSA6IGRhdGFbZmllbGQuX25hbWVdPy5pZCA/IGRhdGFbZmllbGQuX25hbWVdLmlkIDogZGF0YVtmaWVsZC5fbmFtZV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lLmluY2x1ZGVzKCdfXycpKSBkZWxldGUgZGF0YVtuYW1lXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcGF5bG9hZCA9IHsgLi4uZGF0YSB9XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdwYXlsb2FkJywgcGF5bG9hZClcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzUmVxdWVzdCh7cGF0aDogYC8ke2MubmFtZX0vJHtpZCB8fCAnJ31gLCBtZXRob2QsIGJvZHk6IHBheWxvYWQsIGhlYWRlcnM6IHsgYXV0aG9yaXphdGlvbiB9IH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc29sdmUocmVzcG9uc2U/LnJlc3BvbnNlKSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4gcmVqZWN0KGUpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkZWxldGVFbnRyeSA9IGFzeW5jIChkYXRhLCB7YXV0aG9yaXplZCwgbWVtYmVyfSA9IHt9KSA9PiB7XG4gICAgICAgICAgICBsZXQgaWQgPSBkYXRhLmlkIHx8IGRhdGFcblxuICAgICAgICAgICAgaWYgKCFtZW1iZXIgJiYgYXV0aG9yaXplZCkgbWVtYmVyID0gYXdhaXQgcmVhZEVudHJ5KHtjb2xsZWN0aW9uOiAnbWVtYmVycycsIHNlYXJjaDoge3JvbGVzOiAnYWRtaW4nfX0pXG4gICAgICAgICAgICBsZXQgYXV0aG9yaXphdGlvbiA9IGAke21lbWJlcj8ucGFzc3dvcmQ/Lmhhc2h9OiR7bWVtYmVyPy5pZH1gXG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc1JlcXVlc3Qoe3BhdGg6IGAvJHtjLm5hbWV9LyR7aWQgfHwgJyd9YCwgbWV0aG9kOiAnZGVsZXRlJywgaGVhZGVyczogeyBhdXRob3JpemF0aW9uIH0gfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzb2x2ZShyZXNwb25zZT8ucmVzcG9uc2UpKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiByZWplY3QoZSkpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgYVtjLm5hbWVdID0gcnVuUXVlcnlcbiAgICAgICAgYVtjLm5hbWVdWydzYXZlJ10gPSBzYXZlXG4gICAgICAgIGFbYy5uYW1lXVsnZGVsZXRlJ10gPSBkZWxldGVFbnRyeVxuICAgICAgICBhW2Muc2luZ3VsYXJdID0gKGlkLCBxdWVyeSkgPT4gcnVuUXVlcnkoeyBpZCwgLi4ucXVlcnkgfSlcblxuICAgICAgICBhLmdyYXBocWwgPSBydW5HcmFwaHFsXG5cbiAgICAgICAgcmV0dXJuIGFcblxuICAgIH0sIHt9KVxuXG4gICAgTWFuZ28uY29sbGVjdGlvbnMgPSBjb2xsZWN0aW9uc1xuXG4gICAgcmV0dXJuIE1hbmdvXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgaW5pdFxuIiwiLy8gTWFpbiBmaWxlIHRvIHByb2Nlc3MgdGhlIGFwaSByZXF1ZXN0XG5cbmltcG9ydCB7IHN0YXJ0RXhwcmVzcyB9IGZyb20gJy4vMS4gYnVpbGQvbGlicmFyaWVzL2V4cHJlc3MnXG5pbXBvcnQgeyBwcm9jZXNzUmVxdWVzdCB9IGZyb20gJy4vMi4gcHJvY2Vzcy8wLiBtYWluJ1xuaW1wb3J0IHsgdGVzdHMgfSBmcm9tICcuL3Rlc3RzJ1xuaW1wb3J0IGZpZWxkcyBmcm9tICcuLzEuIGJ1aWxkL2ZpZWxkcydcbmltcG9ydCBwbHVnaW5zIGZyb20gJy4vMS4gYnVpbGQvcGx1Z2lucydcbmltcG9ydCBjb2xsZWN0aW9ucyBmcm9tICcuLzEuIGJ1aWxkL2NvbGxlY3Rpb25zJ1xuaW1wb3J0IGNyZWF0ZUZpZWxkIGZyb20gJy4vMS4gYnVpbGQvZmllbGRzL2NyZWF0ZUZpZWxkJ1xuaW1wb3J0IGNyZWF0ZUNvbGxlY3Rpb24gZnJvbSAnLi8xLiBidWlsZC9jb2xsZWN0aW9ucy9jcmVhdGVDb2xsZWN0aW9uJ1xuaW1wb3J0IHNlbmRFbWFpbCBmcm9tICcuLzEuIGJ1aWxkL2hlbHBlcnMvZW1haWwnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgc3RhcnRBdXRvbWF0aW9ucyBmcm9tICdAbWFuZ28vYXV0b21hdGlvbidcbmltcG9ydCBzZXR0aW5ncyBmcm9tICdAbWFuZ28vY29uZmlnL3NldHRpbmdzLmpzb24nXG5pbXBvcnQgY2x1c3RlciBmcm9tICdjbHVzdGVyJ1xuaW1wb3J0IGVuZHBvaW50cyBmcm9tIFwiLi8xLiBidWlsZC9lbmRwb2ludHNcIjtcblxuLy8gY29uc29sZS5sb2coJ2VuZHBvaW50cycsIGVuZHBvaW50cylcblxuXG4vLyBmdW5jdGlvbiByZXNvbHZlVHlwZShzdWJmaWVsZFR5cGUpIHtcbi8vICAgICBpZiAoIXN1YmZpZWxkVHlwZSkgeyByZXR1cm4gJ1N0cmluZycgfVxuLy8gICAgIHJldHVybiB0eXBlb2Yoc3ViZmllbGRUeXBlKSA9PT0gJ3N0cmluZycgPyBzdWJmaWVsZFR5cGUgOiB0eXBlb2Yoc3ViZmllbGRUeXBlKCkpXG4vLyB9XG5cbmZ1bmN0aW9uIHBhcnNlRW5kcG9pbnRTdHJ1Y3R1cmUob2JqLCBwYXRoID0gJycsIHJlc3VsdCA9IHt9KSB7XG4gICAgLy8gSFRUUCBtZXRob2RzIHRvIGNoZWNrIGZvclxuICAgIGNvbnN0IGh0dHBNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJywgJ3BhdGNoJ11cblxuICAgIC8vIENoZWNrIGlmIHRoaXMgbGV2ZWwgaGFzIGFueSBIVFRQIG1ldGhvZHNcbiAgICBjb25zdCBtZXRob2RzID0gaHR0cE1ldGhvZHMuZmlsdGVyKG1ldGhvZCA9PiB0eXBlb2Ygb2JqW21ldGhvZF0gPT09ICdmdW5jdGlvbicpXG5cbiAgICBpZiAobWV0aG9kcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgYW4gZW5kcG9pbnQgLSBzdG9yZSB0aGUgYXZhaWxhYmxlIG1ldGhvZHNcbiAgICAgICAgcmVzdWx0W3BhdGggfHwgJy8nXSA9IG1ldGhvZHNcbiAgICB9XG5cbiAgICAvLyBSZWN1cnNpdmVseSBwcm9jZXNzIG5lc3RlZCByb3V0ZXNcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKGh0dHBNZXRob2RzLmluY2x1ZGVzKGtleSkgfHwgdHlwZW9mIG9ialtrZXldICE9PSAnb2JqZWN0JyB8fCBvYmpba2V5XSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gU2tpcCBIVFRQIG1ldGhvZHMgYW5kIG5vbi1vYmplY3RzXG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQnVpbGQgdGhlIG5lc3RlZCBwYXRoXG4gICAgICAgIGNvbnN0IG5lc3RlZFBhdGggPSBwYXRoID8gYCR7cGF0aH0vJHtrZXl9YCA6IGtleVxuICAgICAgICBwYXJzZUVuZHBvaW50U3RydWN0dXJlKG9ialtrZXldLCBuZXN0ZWRQYXRoLCByZXN1bHQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdFxufVxuXG5mdW5jdGlvbiByZWdpc3RlclN1YmZpZWxkcyhmaWVsZHMpIHtcbiAgICByZXR1cm4gZmllbGRzLm1hcCgoZikgPT4ge1xuICAgICAgICBsZXQgdmFsaWRhdG9yID0gbnVsbFxuXG4gICAgICAgIC8vIFNlcmlhbGl6ZSB2YWxpZGF0b3IgaWYgaXQncyBjbGllbnQtc2FmZVxuICAgICAgICBpZiAoZi52YWxpZGF0ZSAmJiB0eXBlb2YgZi52YWxpZGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaWYgKGYudmFsaWRhdGUuc2VydmVyT25seSA9PT0gdHJ1ZSkgcmV0dXJuXG4gICAgICAgICAgICBjb25zdCBmblN0cmluZyA9IGYudmFsaWRhdGUudG9TdHJpbmcoKVxuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gZm5TdHJpbmcubWF0Y2goL1xcKChbXildKilcXCkvKT8uWzFdPy5zcGxpdCgnLCcpLm1hcChwID0+IHAudHJpbSgpKSB8fCBbXVxuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBleHBsaWNpdGx5IG1hcmtlZCBhcyBjbGllbnQtc2FmZVxuICAgICAgICAgICAgY29uc3QgZXhwbGljaXRseUNsaWVudFNhZmUgPSBmLnZhbGlkYXRlLnNlcnZlck9ubHkgPT09IGZhbHNlXG5cbiAgICAgICAgICAgIC8vIEF1dG8tZGV0ZWN0IGlmIGl0J3MgY2xpZW50LXNhZmUgKHNpbXBsZSB2YWxpZGF0b3Igd2l0aG91dCBzZXJ2ZXIgZGVwZW5kZW5jaWVzKVxuICAgICAgICAgICAgY29uc3QgaGFzU2VydmVyQ29udGV4dCA9IGZuU3RyaW5nLmluY2x1ZGVzKCdyZXF1ZXN0JykgfHwgZm5TdHJpbmcuaW5jbHVkZXMoJ2RvY3VtZW50JykgfHwgZm5TdHJpbmcuaW5jbHVkZXMoJ2ZpZWxkTW9kZWwnKVxuICAgICAgICAgICAgY29uc3QgaGFzU2VydmVySW1wb3J0cyA9IGZuU3RyaW5nLmluY2x1ZGVzKCdyZXF1aXJlKCcpIHx8IGZuU3RyaW5nLmluY2x1ZGVzKCdpbXBvcnQgJylcbiAgICAgICAgICAgIGNvbnN0IGlzU2ltcGxlVmFsaWRhdG9yID0gcGFyYW1zLmxlbmd0aCA9PT0gMSB8fCAocGFyYW1zLmxlbmd0aCA+IDEgJiYgIWhhc1NlcnZlckNvbnRleHQpXG5cbiAgICAgICAgICAgIGNvbnN0IGlzQ2xpZW50U2FmZSA9IGV4cGxpY2l0bHlDbGllbnRTYWZlIHx8IChpc1NpbXBsZVZhbGlkYXRvciAmJiAhaGFzU2VydmVySW1wb3J0cylcblxuICAgICAgICAgICAgaWYgKGlzQ2xpZW50U2FmZSkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRvciA9IGZuU3RyaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogZi5fbmFtZSxcbiAgICAgICAgICAgIGFycmF5OiBmLmFycmF5LFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IGYuZGlzcGxheU5hbWUsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogZi5wbGFjZWhvbGRlcixcbiAgICAgICAgICAgIHNlYXJjaDogZi5zZWFyY2gsXG4gICAgICAgICAgICBmaWx0ZXI6IGYuZmlsdGVyLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGYuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBzaW5nbGU6IGYuc2luZ2xlLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwOiBmLm5hbWUgPT0gJ3JlbGF0aW9uc2hpcCcgPyBjb2xsZWN0aW9ucz8uZmluZChjID0+IGMuX3Npbmd1bGFyID09IGYuY29sbGVjdGlvbik/Ll9uYW1lIDogZmFsc2UsXG4gICAgICAgICAgICBpbnN0YW5jZU9mOiBmPy5uYW1lIHx8IG51bGwsXG4gICAgICAgICAgICBvcHRpb25zOiBmPy5jYXNlU2Vuc2l0aXZlID8gZj8ub3B0aW9ucyA6IGY/Lm9wdGlvbnM/Lm1hcChvID0+IG8udG9Mb3dlckNhc2UoKSkgfHwgbnVsbCxcbiAgICAgICAgICAgIGNhc2VTZW5zaXRpdmU6IGY/LmNhc2VTZW5zaXRpdmUsXG4gICAgICAgICAgICBodW1hbk5hbWU6IGYuX25hbWUucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJyksXG4gICAgICAgICAgICB0eXBlOiBmLl9ncWxUeXBlLFxuICAgICAgICAgICAgaW5wdXRUeXBlOiBmLl9ncWxJbnB1dFR5cGUsXG4gICAgICAgICAgICBjb21wdXRlZDogISFmLmNvbXB1dGVkLFxuICAgICAgICAgICAgY29tcGxleDogZi5fY29tcGxleEZpZWxkLFxuICAgICAgICAgICAgdHJhbnNsYXRlOiAhIWYudHJhbnNsYXRlSW5wdXQsXG4gICAgICAgICAgICByZXF1aXJlZDogISFmLnJlcXVpcmVkLFxuICAgICAgICAgICAgY3VzdG9tRmllbGQ6IGYuX2NvbXBsZXhGaWVsZCAmJiAhZi50cmFuc2xhdGVJbnB1dCxcbiAgICAgICAgICAgIGV4YW1wbGU6IGYuaW5wdXRFeGFtcGxlLFxuICAgICAgICAgICAgZ2xvYmFsOiBmLmdsb2JhbCB8fCBmYWxzZSxcbiAgICAgICAgICAgIGZpZWxkczogZi5fZmllbGRzQXJyYXkgPyByZWdpc3RlclN1YmZpZWxkcyhmLl9maWVsZHNBcnJheSkgOiBudWxsLFxuICAgICAgICAgICAgdmFsaWRhdG9yLFxuICAgICAgICB9XG4gICAgfSlcbn1cblxuYXN5bmMgZnVuY3Rpb24gc3RhcnQoKSB7XG5cbiAgICBhd2FpdCBzdGFydEV4cHJlc3MobWFpbiwgZW5kcG9pbnRzKVxuXG4gICAgaWYgKGNsdXN0ZXIuaXNNYXN0ZXIgfHwgY2x1c3Rlci5pc1ByaW1hcnkpIHtcbiAgICAgICAgc3RhcnRBdXRvbWF0aW9ucygpXG4gICAgfVxuXG4gICAgbGV0IGNvbGxlY3Rpb25zSlNPTiA9IGNvbGxlY3Rpb25zLm1hcCgoYykgPT4gKHtcbiAgICAgICAgbmFtZTogYy5fbmFtZSxcbiAgICAgICAgc3NyTW9kZWw6IGMuc3NyTW9kZWwgfHwgbnVsbCxcbiAgICAgICAgdGl0bGVOYW1lOiBjLl90aXRsZU5hbWUsXG4gICAgICAgIHNpbmd1bGFyOiBjLl9zaW5ndWxhcixcbiAgICAgICAgdGl0bGVTaW5ndWxhcjogYy5fdGl0bGVTaW5ndWxhcixcbiAgICAgICAgaHVtYW5OYW1lOiBjLl90aXRsZU5hbWUucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJyksXG4gICAgICAgIGh1bWFuU2luZ3VsYXI6IGMuX3RpdGxlU2luZ3VsYXIucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJyksXG4gICAgICAgIGxpYnJhcnk6IGMubGlicmFyeU5hbWUsXG4gICAgICAgIHR5cGU6IGMuX3R5cGUsXG4gICAgICAgIGZpZWxkczogYy5fZmllbGRzQXJyYXkgPyByZWdpc3RlclN1YmZpZWxkcyhjLl9maWVsZHNBcnJheSkgOiBudWxsLFxuICAgICAgICBhZG1pbkluZGV4OiBjLmFkbWluSW5kZXgsXG4gICAgICAgIGFsZ29saWE6IGMuYWxnb2xpYSxcbiAgICB9KSlcblxuICAgIC8qSWYgeW91IGVuYWJsZSB0aGlzLCBwbTIgd2l0aCAtLXdhdGNoIHdpbGwgaW5maW5pdGVseSByZXN0YXJ0IDopICovXG4gICAgbGV0IGNvbGxlY3Rpb25zVGFyZ2V0ID0gYCR7cHJvY2Vzcy5lbnYuQ09ORklHX1JPT1R9L2NvbmZpZy8uY29sbGVjdGlvbnMuanNvbmBcbiAgICBmcy53cml0ZUZpbGUoXG4gICAgICAgIGNvbGxlY3Rpb25zVGFyZ2V0LFxuICAgICAgICBKU09OLnN0cmluZ2lmeShjb2xsZWN0aW9uc0pTT04pLFxuICAgICAgICB7fSxcbiAgICAgICAgKCkgPT4geyB9XG4gICAgKVxuXG4gICAgLy8gR2VuZXJhdGUgZW5kcG9pbnRzIEpTT05cbiAgICBjb25zdCBlbmRwb2ludHNTdHJ1Y3R1cmUgPSBwYXJzZUVuZHBvaW50U3RydWN0dXJlKGVuZHBvaW50cylcbiAgICBsZXQgZW5kcG9pbnRzVGFyZ2V0ID0gYCR7cHJvY2Vzcy5lbnYuQ09ORklHX1JPT1R9L2NvbmZpZy8uZW5kcG9pbnRzLmpzb25gXG4gICAgZnMud3JpdGVGaWxlKFxuICAgICAgICBlbmRwb2ludHNUYXJnZXQsXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KGVuZHBvaW50c1N0cnVjdHVyZSwgbnVsbCwgMiksXG4gICAgICAgIHt9LFxuICAgICAgICAoKSA9PiB7IH1cbiAgICApXG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4ocmVxLCBpbykge1xuICAgIHJldHVybiBhd2FpdCBwcm9jZXNzUmVxdWVzdChyZXEsIGlvKS5jYXRjaChjb25zb2xlLmVycm9yKVxufVxuXG5mdW5jdGlvbiB0ZXN0KCkge1xuICAgIHJldHVybiB0ZXN0cyhtYWluKS5jYXRjaChjb25zb2xlLmVycm9yKVxufVxuXG5mdW5jdGlvbiB1c2UobGlicmFyeSkge1xuXG4gICAgLy8gbGV0IGNvbGxlY3Rpb25zID0gW11cbiAgICAvLyBsZXQgZW5kcG9pbnRzID0gW11cbiAgICAvLyBsZXQgZmllbGRzID0gW11cblxuICAgIC8vIGNvbnNvbGUubG9nKCdsaWJyYXJ5JywgbGlicmFyeSlcblxuICAgIGlmIChsaWJyYXJ5Py5jb2xsZWN0aW9ucz8ubGVuZ3RoKSB7XG4gICAgICAgIGxpYnJhcnkuY29sbGVjdGlvbnMuZm9yRWFjaCgoYykgPT5cbiAgICAgICAgICAgIGNvbGxlY3Rpb25zLnB1c2goeyAuLi5jLCBsaWJyYXJ5TmFtZTogbGlicmFyeS5uYW1lIH0pXG4gICAgICAgIClcbiAgICB9IGVsc2UgaWYgKGxpYnJhcnk/LmNvbGxlY3Rpb25zKSB7XG4gICAgICAgIGZvciAobGV0IGNvbGxlY3Rpb25OYW1lIGluIGxpYnJhcnkuY29sbGVjdGlvbnMpIHtcbiAgICAgICAgICAgIGxldCBjb2xsZWN0aW9uID0gbGlicmFyeS5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uTmFtZV1cbiAgICAgICAgICAgIGNvbGxlY3Rpb25zLnB1c2goeyAuLi5jb2xsZWN0aW9uLCBsaWJyYXJ5TmFtZTogbGlicmFyeS5uYW1lLCBuYW1lOiBjb2xsZWN0aW9uTmFtZSB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgKGxpYnJhcnk/LmZpZWxkcykge1xuICAgIC8vICAgICBmaWVsZHMgPSBbLi4uZmllbGRzLCAuLi5saWJyYXJ5LmZpZWxkc11cbiAgICAvLyB9XG5cbiAgICBpZiAobGlicmFyeT8uZW5kcG9pbnRzKSB7XG4gICAgICAgIGZvciAobGV0IGVuZHBvaW50TmFtZSBpbiBsaWJyYXJ5LmVuZHBvaW50cykge1xuICAgICAgICAgICAgZW5kcG9pbnRzW2VuZHBvaW50TmFtZV0gPSBsaWJyYXJ5LmVuZHBvaW50c1tlbmRwb2ludE5hbWVdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZygnbGlicmFyeT8uZW5kcG9pbnRzJywgbGlicmFyeT8uZW5kcG9pbnRzKVxuXG4gICAgLypcbiAgICBNYWtlIGZpZWxkcyBhbmQgZW5kcG9pbnRzIGEgY2xhc3Mgc28gdGhleSBoYXZlIHNldHRlcnM/XG4gICAgKi9cblxuICAgIC8vIGlmIChsaWJyYXJ5Py5maWVsZHMpIGZpZWxkcyA9IFsuLi5maWVsZHMsIC4uLmxpYnJhcnkuZmllbGRzXVxuICAgIC8vIGlmIChsaWJyYXJ5Py5lbmRwb2ludHMpIGVuZHBvaW50cyA9IHsgLi4uZW5kcG9pbnRzLCAuLi5saWJyYXJ5LmVuZHBvaW50cyB9XG4gICAgaWYgKGxpYnJhcnkuaW5zdGFsbCkgbGlicmFyeS5pbnN0YWxsKHsgY29sbGVjdGlvbnMsIGZpZWxkcywgZW5kcG9pbnRzIH0pXG59XG5cbi8vIGNvbnNvbGUubG9nKCdwbHVnaW5zJywgcGx1Z2lucylcbmZvciAobGV0IHBsdWdpbiBvZiBwbHVnaW5zKSB7XG4gICAgdXNlKHBsdWdpbilcbn1cblxuLy8gY29uc29sZS5sb2coJ2VuZHBvaW50cycsIGVuZHBvaW50cylcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHN0YXJ0LFxuICAgIHRlc3QsXG4gICAgdXNlLFxuICAgIGNvbGxlY3Rpb25zLFxuICAgIGZpZWxkcyxcbiAgICBjcmVhdGVGaWVsZCxcbiAgICBjcmVhdGVDb2xsZWN0aW9uLFxuICAgIHByb2Nlc3NSZXF1ZXN0LFxuICAgIHNlbmRFbWFpbCxcbn1cbiIsImltcG9ydCBnZW5lcmF0ZUdxbCBmcm9tIFwiLi4vLi4vY21zLzEuIGJ1aWxkL2dyYXBocWwvYXBvbGxvXCI7XG5sZXQgeyByZXNvbHZlcnMgfSA9IGdlbmVyYXRlR3FsKClcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlTWVtYmVyKG1haW4pIHtcbiAgICBsZXQgbWVtYmVyRGF0YSA9IHtcbiAgICAgICAgXCJ0aXRsZVwiOiBcIlRlc3QgTWVtYmVyXCIsXG4gICAgICAgIFwicm9sZXNcIjogW1wibWVtYmVyXCJdXG4gICAgfVxuICAgIGxldCBuZXdNZW1iZXIgPSBhd2FpdCBtYWluKHttZXRob2Q6ICdQT1NUJywgYm9keTogbWVtYmVyRGF0YSwgcGF0aDogJy9tZW1iZXJzJ30pXG4gICAgLy8gY29uc29sZS5sb2coJ25ld01lbWJlcicsIG5ld01lbWJlcilcbiAgICByZXR1cm4gbmV3TWVtYmVyLnJlc3BvbnNlLmlkXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlc3REYXRhKHsgcGFzc1ZhbGlkYXRpb24sIG1lbWJlcklkIH0pIHtcblxuICAgIGxldCBkYXRhID0ge1xuICAgICAgICB0cmFuc2xhdGVJbnB1dDogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgdHJhbnNsYXRlT3V0cHV0OiBcIkxPV0VSQ0FTRVwiLFxuICAgICAgICByZWxhdGlvbnNoaXA6IFttZW1iZXJJZF0sXG4gICAgICAgIHByb3RlY3RlZDogXCJwcm90ZWN0ZWRcIixcbiAgICAgICAgdmFsaWRhdGlvbjogcGFzc1ZhbGlkYXRpb24gPyAnUEFTUycgOiAnRkFJTCcsXG4gICAgICAgIGludEFycmF5OiBbMSwyLDNdLFxuICAgIH1cblxuICAgIGxldCB0ZXN0RGF0YSA9IHtcbiAgICAgICAgXCJ0aXRsZVwiOiBcIlRlc3QgQ29sbGVjdGlvblwiLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBjb21wbGV4QXJyYXk6IFt7XG4gICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgY29tcGxleEFycmF5OiBbe1xuICAgICAgICAgICAgICAgIC4uLmRhdGFcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1dXG4gICAgfVxuXG4gICAgcmV0dXJuIHRlc3REYXRhXG5cbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlVGVzdEVudHJ5KG1haW4sIHsgcGFzc1ZhbGlkYXRpb24sIG1lbWJlcklkIH0pIHtcbiAgICBsZXQgZGF0YSA9IGNyZWF0ZVRlc3REYXRhKHsgcGFzc1ZhbGlkYXRpb24sIG1lbWJlcklkIH0pXG4gICAgcmV0dXJuIGF3YWl0IG1haW4oe21ldGhvZDogJ1BPU1QnLCBib2R5OiBkYXRhLCBwYXRoOiAnL190ZXN0cyd9KVxufVxuXG5mdW5jdGlvbiB0ZXN0TGV2ZWxzKHtkYXRhLCBtZW1iZXJJZCwgbGV2ZWx9KSB7XG4gICAgY29uc29sZS5sb2coJ2xldmVsOicsIGxldmVsKVxuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGE/LmludEFycmF5KSkgeyBjb25zb2xlLmxvZygn4pyFICBOb3JtYWwgQXJyYXknKSB9IGVsc2UgeyBjb25zb2xlLmxvZygn4p2MIE5vcm1hbCBBcnJheScpfVxuICAgIGlmIChkYXRhPy50cmFuc2xhdGVJbnB1dCA9PT0gJ1VQUEVSQ0FTRScrbGV2ZWwpIHsgY29uc29sZS5sb2coJ+KchSAgdHJhbnNsYXRlSW5wdXQnKSB9IGVsc2UgeyBjb25zb2xlLmxvZygn4p2MIHRyYW5zbGF0ZUlucHV0Jyl9XG4gICAgaWYgKGRhdGE/LnRyYW5zbGF0ZU91dHB1dCA9PT0gJ2xvd2VyY2FzZScrbGV2ZWwpIHsgY29uc29sZS5sb2coJ+KchSAgdHJhbnNsYXRlT3V0cHV0JykgfSBlbHNlIHsgY29uc29sZS5sb2coJ+KdjCB0cmFuc2xhdGVPdXRwdXQnKX1cbiAgICBpZiAoZGF0YT8uY29tcHV0ZWROZXZlckNhY2hlID09PSAxMCtsZXZlbCkgeyBjb25zb2xlLmxvZygn4pyFICBjb21wdXRlZE5ldmVyQ2FjaGUnKSB9IGVsc2UgeyBjb25zb2xlLmxvZygn4p2MIGNvbXB1dGVkTmV2ZXJDYWNoZScpfVxuICAgIGlmIChkYXRhPy5jb21wdXRlZEV4cGlyZUNhY2hlID09PSAxMCtsZXZlbCkgeyBjb25zb2xlLmxvZygn4pyFICBjb21wdXRlZEV4cGlyZUNhY2hlJykgfSBlbHNlIHsgY29uc29sZS5sb2coJ+KdjCBjb21wdXRlZEV4cGlyZUNhY2hlJyl9XG4gICAgaWYgKGRhdGE/LmNvbXB1dGVkQ2FjaGUgPT09IDEwK2xldmVsKSB7IGNvbnNvbGUubG9nKCfinIUgIGNvbXB1dGVkQ2FjaGUnKSB9IGVsc2UgeyBjb25zb2xlLmxvZygn4p2MIGNvbXB1dGVkQ2FjaGUnKX1cbiAgICBpZiAoZGF0YT8ucmVsYXRpb25zaGlwWzBdLmlkID09PSBtZW1iZXJJZCkgeyBjb25zb2xlLmxvZygn4pyFICByZWxhdGlvbnNoaXAnKSB9IGVsc2UgeyBjb25zb2xlLmxvZygn4p2MIHJlbGF0aW9uc2hpcCcpfVxuICAgIGlmIChkYXRhPy5wcm90ZWN0ZWQgPT09IHVuZGVmaW5lZCkgeyBjb25zb2xlLmxvZygn4pyFICBwcm90ZWN0ZWQnKSB9IGVsc2UgeyBjb25zb2xlLmxvZyhg4p2MIHByb3RlY3RlZDogJHtkYXRhPy5wcm90ZWN0ZWR9YCl9XG4gICAgY29uc29sZS5sb2coJycpXG59XG5cblxuZnVuY3Rpb24gdXBkYXRlVGVzdERhdGEoeyBwYXNzVmFsaWRhdGlvbiwgbWVtYmVySWRzIH0pIHtcblxuICAgIGxldCBkYXRhID0ge1xuICAgICAgICB0cmFuc2xhdGVJbnB1dDogXCJ1cHBlci11cGRhdGVkXCIsXG4gICAgICAgIHRyYW5zbGF0ZU91dHB1dDogXCJMT1dFUi1VUERBVEVEXCIsXG4gICAgICAgIHJlbGF0aW9uc2hpcDogbWVtYmVySWRzLFxuICAgICAgICBwcm90ZWN0ZWQ6IFwicHJvdGVjdGVkXCIsXG4gICAgICAgIHZhbGlkYXRpb246IHBhc3NWYWxpZGF0aW9uID8gJ1BBU1MnIDogJ0ZBSUwnLFxuICAgICAgICBpbnRBcnJheTogWzMsMiwxXSxcbiAgICB9XG5cbiAgICBsZXQgdGVzdERhdGEgPSB7XG4gICAgICAgIFwidGl0bGVcIjogXCJVcGRhdGVkIFRlc3QgQ29sbGVjdGlvblwiLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBjb21wbGV4QXJyYXk6IFt7XG4gICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgY29tcGxleEFycmF5OiBbe1xuICAgICAgICAgICAgICAgIC4uLmRhdGFcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1dXG4gICAgfVxuXG4gICAgcmV0dXJuIHRlc3REYXRhXG5cbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlVGVzdEVudHJ5KG1haW4sIHsgcGFzc1ZhbGlkYXRpb24sIG1lbWJlcklkcywgZW50cnlJZCB9KSB7XG4gICAgbGV0IGRhdGEgPSB1cGRhdGVUZXN0RGF0YSh7IHBhc3NWYWxpZGF0aW9uLCBtZW1iZXJJZHMgfSlcbiAgICAvLyBjb25zb2xlLmRpcihkYXRhLCB7ZGVwdGg6IG51bGx9KVxuICAgIHJldHVybiBhd2FpdCBtYWluKHttZXRob2Q6ICdQVVQnLCBib2R5OiBkYXRhLCBwYXRoOiBgL190ZXN0cy8ke2VudHJ5SWR9YH0pXG59XG5cbmZ1bmN0aW9uIHRlc3RVcGRhdGVMZXZlbHMoe2RhdGEsIG1lbWJlcklkcywgbGV2ZWx9KSB7XG4gICAgY29uc29sZS5sb2coJ1VwZGF0ZSBsZXZlbDonLCBsZXZlbClcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhPy5pbnRBcnJheSkpIHsgY29uc29sZS5sb2coJ+KchSAgTm9ybWFsIEFycmF5JykgfSBlbHNlIHsgY29uc29sZS5sb2coJ+KdjCBOb3JtYWwgQXJyYXknKX1cbiAgICBpZiAoZGF0YT8udHJhbnNsYXRlSW5wdXQgPT09ICdVUFBFUi1VUERBVEVEJytsZXZlbCkgeyBjb25zb2xlLmxvZygn4pyFICB0cmFuc2xhdGVJbnB1dCcpIH0gZWxzZSB7IGNvbnNvbGUubG9nKCfinYwgdHJhbnNsYXRlSW5wdXQnKX1cbiAgICBpZiAoZGF0YT8udHJhbnNsYXRlT3V0cHV0ID09PSAnbG93ZXItdXBkYXRlZCcrbGV2ZWwpIHsgY29uc29sZS5sb2coJ+KchSAgdHJhbnNsYXRlT3V0cHV0JykgfSBlbHNlIHsgY29uc29sZS5sb2coJ+KdjCB0cmFuc2xhdGVPdXRwdXQnKX1cbiAgICBpZiAoZGF0YT8uY29tcHV0ZWROZXZlckNhY2hlID09PSAxNCtsZXZlbCkgeyBjb25zb2xlLmxvZygn4pyFICBjb21wdXRlZE5ldmVyQ2FjaGUnKSB9IGVsc2UgeyBjb25zb2xlLmxvZygn4p2MIGNvbXB1dGVkTmV2ZXJDYWNoZScpfVxuICAgIGlmIChkYXRhPy5jb21wdXRlZEV4cGlyZUNhY2hlID09PSAxNCtsZXZlbCkgeyBjb25zb2xlLmxvZygn4pyFICBjb21wdXRlZEV4cGlyZUNhY2hlJykgfSBlbHNlIHsgY29uc29sZS5sb2coJ+KdjCBjb21wdXRlZEV4cGlyZUNhY2hlJyl9XG4gICAgaWYgKGRhdGE/LmNvbXB1dGVkQ2FjaGUgPT09IDE0K2xldmVsKSB7IGNvbnNvbGUubG9nKCfinIUgIGNvbXB1dGVkQ2FjaGUnKSB9IGVsc2UgeyBjb25zb2xlLmxvZygn4p2MIGNvbXB1dGVkQ2FjaGUnKX1cbiAgICBpZiAoZGF0YT8ucmVsYXRpb25zaGlwLmV2ZXJ5KHIgPT4gbWVtYmVySWRzLmluY2x1ZGVzKHIuaWQpKSkgeyBjb25zb2xlLmxvZygn4pyFICByZWxhdGlvbnNoaXAnKSB9IGVsc2UgeyBjb25zb2xlLmxvZygn4p2MIHJlbGF0aW9uc2hpcCcpfVxuICAgIGlmIChkYXRhPy5wcm90ZWN0ZWQgPT09IHVuZGVmaW5lZCkgeyBjb25zb2xlLmxvZygn4pyFICBwcm90ZWN0ZWQnKSB9IGVsc2UgeyBjb25zb2xlLmxvZyhg4p2MIHByb3RlY3RlZDogJHtkYXRhPy5wcm90ZWN0ZWR9YCl9XG4gICAgY29uc29sZS5sb2coJycpXG59XG5cblxuYXN5bmMgZnVuY3Rpb24gdGVzdHMobWFpbil7XG5cbiAgICB0cnkge1xuXG5cbiAgICAgICAgLy8gQ3JlYXRlXG4gICAgICAgICAgICAvLyBJbXBvcnRlZCBDb2xsZWN0aW9uXG4gICAgICAgICAgICAvLyBGb2xkZXIgQ29sbGVjdGlvblxuICAgICAgICAgICAgLy8gQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIC8vIEhvb2tzXG4gICAgICAgICAgICAgICAgLy8gUGVybWlzc2lvbnNcbiAgICAgICAgICAgICAgICAvLyBGaWVsZHNcbiAgICAgICAgICAgICAgICAgICAgLy8gQXJyYXlcbiAgICAgICAgICAgICAgICAgICAgLy8gQXNzZXRzXG4gICAgICAgICAgICAgICAgICAgIC8vIFZhbGlkYXRpb25cbiAgICAgICAgICAgICAgICAgICAgLy8gUGVybWlzc2lvbnNcbiAgICAgICAgICAgICAgICAgICAgLy8gVHJhbnNsYXRlSW5wdXRcbiAgICAgICAgICAgICAgICAgICAgLy8gVHJhbnNsYXRlT3V0cHV0XG4gICAgICAgICAgICAgICAgICAgIC8vIENvbXB1dGVkIChjYWNoZSlcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29tcHV0ZWQgKG5vIGNhY2hlKVxuICAgICAgICAgICAgICAgICAgICAvLyBTdWJmaWVsZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFycmF5XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBc3NldHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFZhbGlkYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBlcm1pc3Npb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWxhdGlvbnNoaXBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRyYW5zbGF0ZUlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUcmFuc2xhdGVPdXRwdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbXB1dGVkIChjYWNoZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbXB1dGVkIChubyBjYWNoZSlcblxuICAgICAgICBsZXQgbWVtYmVySWQgPSBhd2FpdCBjcmVhdGVNZW1iZXIobWFpbilcbiAgICAgICAgbGV0IG1lbWJlcklkMiA9IGF3YWl0IGNyZWF0ZU1lbWJlcihtYWluKVxuICAgICAgICBsZXQgbWVtYmVySWRzID0gW21lbWJlcklkLCBtZW1iZXJJZDJdXG5cbiAgICAgICAgY29uc29sZS5sb2coJ21lbWJlcklkJywgbWVtYmVySWQpXG5cbiAgICAgICAgbGV0IHNob3VsZEJlSW52YWxpZCA9IGF3YWl0IGNyZWF0ZVRlc3RFbnRyeShtYWluLCB7cGFzc1ZhbGlkYXRpb246IGZhbHNlLCBtZW1iZXJJZH0pXG4gICAgICAgIGlmIChzaG91bGRCZUludmFsaWQudmFsaWQgPT09IGZhbHNlICYmIHNob3VsZEJlSW52YWxpZC5yZXNwb25zZSA9PSAnKHZhbGlkYXRpb24pIG5vdCBwYXNzJykgeyBjb25zb2xlLmxvZygn4pyFICBWYWxpZGF0aW9uJykgfSBlbHNlIHsgY29uc29sZS5sb2coYOKdjCBWYWxpZGF0aW9uYCl9XG5cbiAgICAgICAgbGV0IHNob3VsZEJlVmFsaWQgPSAoYXdhaXQgY3JlYXRlVGVzdEVudHJ5KG1haW4sIHtwYXNzVmFsaWRhdGlvbjogdHJ1ZSwgbWVtYmVySWR9KSkucmVzcG9uc2VcbiAgICAgICAgLy8gY29uc29sZS5kaXIoc2hvdWxkQmVWYWxpZCwge2RlcHRoOiBudWxsfSlcbiAgICAgICAgaWYgKHNob3VsZEJlVmFsaWQ/LmlkKSB7IGNvbnNvbGUubG9nKCfinIUgIENyZWF0ZScpIH0gZWxzZSB7IGNvbnNvbGUubG9nKCfinYwgQ3JlYXRlJyl9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHNob3VsZEJlVmFsaWQ/LmNvbXBsZXhBcnJheSkpIHsgY29uc29sZS5sb2coJ+KchSAgQ29tcGxleCBBcnJheScpIH0gZWxzZSB7IGNvbnNvbGUubG9nKCfinYwgQ29tcGxleCBBcnJheScpfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCcnKVxuICAgICAgICB0ZXN0TGV2ZWxzKHtkYXRhOiBzaG91bGRCZVZhbGlkLCBtZW1iZXJJZCwgbGV2ZWw6IDF9KVxuICAgICAgICB0ZXN0TGV2ZWxzKHtkYXRhOiBzaG91bGRCZVZhbGlkLmNvbXBsZXhBcnJheVswXSwgbWVtYmVySWQsIGxldmVsOiAyfSlcbiAgICAgICAgdGVzdExldmVscyh7ZGF0YTogc2hvdWxkQmVWYWxpZC5jb21wbGV4QXJyYXlbMF0uY29tcGxleEFycmF5WzBdLCBtZW1iZXJJZCwgbGV2ZWw6IDN9KVxuXG4gICAgICAgIHNob3VsZEJlSW52YWxpZCA9IGF3YWl0IHVwZGF0ZVRlc3RFbnRyeShtYWluLCB7cGFzc1ZhbGlkYXRpb246IGZhbHNlLCBtZW1iZXJJZHMsIGVudHJ5SWQ6IHNob3VsZEJlVmFsaWQuaWR9KVxuICAgICAgICBpZiAoc2hvdWxkQmVJbnZhbGlkLnZhbGlkID09PSBmYWxzZSAmJiBzaG91bGRCZUludmFsaWQucmVzcG9uc2UgPT0gJyh2YWxpZGF0aW9uKSBub3QgcGFzcycpIHsgY29uc29sZS5sb2coJ+KchSAgVXBkYXRlIFZhbGlkYXRpb24nKSB9IGVsc2UgeyBjb25zb2xlLmxvZyhg4p2MIFVwZGF0ZSBWYWxpZGF0aW9uYCl9XG5cbiAgICAgICAgc2hvdWxkQmVWYWxpZCA9IChhd2FpdCB1cGRhdGVUZXN0RW50cnkobWFpbiwge3Bhc3NWYWxpZGF0aW9uOiB0cnVlLCBtZW1iZXJJZHMsIGVudHJ5SWQ6IHNob3VsZEJlVmFsaWQuaWR9KSkucmVzcG9uc2VcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1VwZGF0ZWQgc2hvdWxkQmVWYWxpZCcsIHNob3VsZEJlVmFsaWQpXG4gICAgICAgIGlmIChzaG91bGRCZVZhbGlkPy5pZCkgeyBjb25zb2xlLmxvZygn4pyFICBVcGRhdGUnKSB9IGVsc2UgeyBjb25zb2xlLmxvZygn4p2MIFVwZGF0ZScpfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzaG91bGRCZVZhbGlkPy5jb21wbGV4QXJyYXkpKSB7IGNvbnNvbGUubG9nKCfinIUgIFVwZGF0ZSBDb21wbGV4IEFycmF5JykgfSBlbHNlIHsgY29uc29sZS5sb2coJ+KdjCBVcGRhdGUgQ29tcGxleCBBcnJheScpfVxuXG5cbiAgICAgICAgY29uc29sZS5sb2coJycpXG4gICAgICAgIHRlc3RVcGRhdGVMZXZlbHMoe2RhdGE6IHNob3VsZEJlVmFsaWQsIG1lbWJlcklkcywgbGV2ZWw6IDF9KVxuICAgICAgICB0ZXN0VXBkYXRlTGV2ZWxzKHtkYXRhOiBzaG91bGRCZVZhbGlkLmNvbXBsZXhBcnJheVswXSwgbWVtYmVySWRzLCBsZXZlbDogMn0pXG4gICAgICAgIHRlc3RVcGRhdGVMZXZlbHMoe2RhdGE6IHNob3VsZEJlVmFsaWQuY29tcGxleEFycmF5WzBdLmNvbXBsZXhBcnJheVswXSwgbWVtYmVySWRzLCBsZXZlbDogM30pXG5cbiAgICAgICAgYXdhaXQgbWFpbih7aGVhZGVyczoge3VzZXI6IG1lbWJlcklkfSwgbWV0aG9kOiAnREVMRVRFJywgcGF0aDogJy9tZW1iZXJzLycgKyBtZW1iZXJJZH0pXG4gICAgICAgIGF3YWl0IG1haW4oe2hlYWRlcnM6IHt1c2VyOiBtZW1iZXJJZDJ9LCBtZXRob2Q6ICdERUxFVEUnLCBwYXRoOiAnL21lbWJlcnMvJyArIG1lbWJlcklkMn0pXG4gICAgICAgIGxldCB7IGRlbGV0ZWQgfSA9IGF3YWl0IG1haW4oe21ldGhvZDogJ0RFTEVURScsIHBhdGg6ICcvX3Rlc3RzLycgKyBzaG91bGRCZVZhbGlkLmlkfSlcblxuICAgICAgICBpZiAoZGVsZXRlZCA9PT0gMSkgeyBjb25zb2xlLmxvZygn4pyFICBEZWxldGUnKSB9IGVsc2UgeyBjb25zb2xlLmxvZygn4p2MIERlbGV0ZScpfVxuXG5cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCB7IHRlc3RzIH1cbi8vIHRlc3RzKCkuY2F0Y2goY29uc29sZS5lcnJvcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYXdzLXNkay9jbGllbnQtczNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXhpb3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2x1c3RlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb25uZWN0LW11bHRpcGFydHlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjcnlwdG9cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZGF5anNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmb3JtLWRhdGFcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JhcGhxbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncmFwaHFsLWZpZWxkc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncmFwaHFsLXBhcnNlLXJlc29sdmUtaW5mb1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYWlsZ3VuLmpzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1pbWUtdHlwZXNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29kYlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtdWx0ZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwib3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVzZW5kXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNoYXJwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzb2NrZXQuaW8tcmVkaXNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN0cmVhbVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGV4aXN0cyAoZGV2ZWxvcG1lbnQgb25seSlcblx0aWYgKF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdID09PSB1bmRlZmluZWQpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJztcbmltcG9ydCBzZXR0aW5ncyBmcm9tICdAbWFuZ28vY29uZmlnL3NldHRpbmdzLmpzb24nO1xuXG4vLyAvLyAtLS0tLS0tLS0tLS0gU0VOVFJZXG5cbi8vIC8vIFlvdSBjYW4gYWxzbyB1c2UgQ29tbW9uSlMgYHJlcXVpcmUoJ0BzZW50cnkvbm9kZScpYCBpbnN0ZWFkIG9mIGBpbXBvcnRgXG4vLyBpbXBvcnQgKiBhcyBTZW50cnkgZnJvbSBcIkBzZW50cnkvbm9kZVwiO1xuLy8gaW1wb3J0IHsgUHJvZmlsaW5nSW50ZWdyYXRpb24gfSBmcm9tIFwiQHNlbnRyeS9wcm9maWxpbmctbm9kZVwiO1xuXG4vLyBTZW50cnkuaW5pdCh7XG4vLyAgICAgZHNuOiAnaHR0cHM6Ly9kYjRmMTY3OTNmZDM0OWI5ZjAzZTFiOGRkYjNkZDM0YkBvNDUwNjMxNjI3ODU5NTU4NC5pbmdlc3Quc2VudHJ5LmlvLzQ1MDYzMjIzODM2NjcyMDAnLFxuLy8gICAgIGludGVncmF0aW9uczogW1xuLy8gICAgICAgICBuZXcgUHJvZmlsaW5nSW50ZWdyYXRpb24oKSxcbi8vICAgICBdLFxuLy8gICAgIC8vIFBlcmZvcm1hbmNlIE1vbml0b3Jpbmdcbi8vICAgICB0cmFjZXNTYW1wbGVSYXRlOiAxLjAsXG4vLyAgICAgLy8gU2V0IHNhbXBsaW5nIHJhdGUgZm9yIHByb2ZpbGluZyAtIHRoaXMgaXMgcmVsYXRpdmUgdG8gdHJhY2VzU2FtcGxlUmF0ZVxuLy8gICAgIHByb2ZpbGVzU2FtcGxlUmF0ZTogMS4wLFxuLy8gfSk7XG5cbi8vIC8vIC0tLS0tLS0tLS0tLSBTRU5UUllcblxuaWYgKHNldHRpbmdzLnRpbWV6b25lKSBwcm9jZXNzLmVudi5UWiA9IHNldHRpbmdzLnRpbWV6b25lO1xuXG5pbXBvcnQgQ01TIGZyb20gJy4vY21zJ1xuXG4vLyBpbXBvcnQgbWFuZ29TdGFuZCBmcm9tICcuL21hbmdvLXN0YW5kJ1xuLy8gQ01TLnVzZShtYW5nb1N0YW5kKVxuXG4vLyBsZXQgUGVvcGxlID0gQ01TLmNvbGxlY3Rpb25zLmZpbmQoYyA9PiBjLl9uYW1lID09ICdwZW9wbGUnKVxuLy8gUGVvcGxlLmZpZWxkcy5zaGlydCA9IENNUy5maWVsZHMuUmVsYXRpb25zaGlwKHtjb2xsZWN0aW9uOiAnc2hpcnQnLCBzaW5nbGU6IHRydWV9KVxuXG4vLyBjb25zb2xlLmxvZygnTWVtYmVycycsIE1lbWJlcnMpXG4vLyBjb25zb2xlLmxvZyhDTVMuY29sbGVjdGlvbnMuZmluZChjID0+IGMuX25hbWUgPSAnc2hpcnRzJykpXG5cbmRlbGV0ZSBDTVMuY29sbGVjdGlvbnMuZmluZChjID0+IGMuX25hbWUgPSAnbWVtYmVycycpLnRpdGxlXG5cbkNNUy5zdGFydCgpXG4vLyBDTVMudGVzdCgpXG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9