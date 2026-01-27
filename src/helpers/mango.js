// import collections from '../../../mango/config/.collections.json'
// import { algoliaAppId, algoliaSearchKey, algoliaIndex, port, domain } from '../../../mango/config/settings'
import collections from '@collections'
import { algoliaAppId, algoliaSearchKey, algoliaIndex, port, mangoDomain, useDevAPI } from '@settings'
import axios from "axios";
import { ref } from 'vue'
import algoliasearch from 'algoliasearch/dist/algoliasearch-lite.esm.browser'
import LocalDB from './localDB'
import { io } from 'socket.io-client';

import { useRoute } from 'vue-router'
let route = useRoute()

let endpoints = {
    authors: ['get'],
    // scripture: { validate: ['post'] }
}

// console.log('collections', collections)

const client = algoliasearch(algoliaAppId, algoliaSearchKey);
const algolia = client.initIndex(algoliaIndex);

let api = `https://${mangoDomain}`
let ws = `wss://${mangoDomain}/graphql`

if (process.env.NODE_ENV != 'production' && useDevAPI) {
    api = `http://localhost:${port}`
    ws = `ws://localhost:${port}/graphql`
}

function getQuery(params) {

    if (params.search != undefined)
        params.search = JSON.stringify(params.search);
    if (params.fields != undefined)
        params.fields = JSON.stringify(params.fields);
    if (params.sort != undefined) params.sort = JSON.stringify(params.sort);

    const query =
        Object.keys(params)
            .filter((key) => params[key] != undefined)
            ?.map(
                (key) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(
                        params[key]
                    )}`
            )
            ?.join("&") || "";

    return query
}

const Mango = collections.reduce((a, c) => {

    let localDB = new LocalDB(c.name, api)

    let runQuery = ({ limit, page, search, fields, id, sort, depthLimit, verbose } = {}) => {

        let fullQuery

        const query = getQuery({ limit, page, search, fields, sort, depthLimit, verbose })

        fullQuery = `${api}/${c.name}/${id || ''}?${query}`

        let Authorization = window.localStorage.getItem('token')

        return new Promise((resolve, reject) => {
            // If it's a local entry
            if (id && !isNaN(id)) {
                id = Number(id);
                let request = window.indexedDB.open(c.name, 1);
                request.onsuccess = (e) => {
                    let db = e.target.result;
                    let transaction = db.transaction([c.name], "readwrite");
                    let store = transaction.objectStore(c.name);
                    let entryRequest = store.get(id);
                    entryRequest.onsuccess = (e) => {
                        let result = entryRequest.result;
                        if (result) resolve(result);
                        else reject("No entry found");
                    };
                };
            } else {
                axios
                    .get(fullQuery, { headers: { Authorization } })
                    .then((response) => resolve(verbose ? response?.data : response?.data?.response))
                    .catch((e) => reject(e));
            }
        });

    }

    let runGraphql = (query) => {

        let Authorization = window.localStorage.getItem('token')
        query = { query }
        return new Promise((resolve, reject) => {
            axios.post(`${api}/graphql`, query, { headers: { Authorization } })
                .then(response => resolve(response?.data?.data))
                .catch(e => reject(e))
        })

    }

    let runAlgolia = (search, query, algoliaFilters) => {

        search = search || ''

        let filters = `collection:${c.name}`
        if (algoliaFilters) filters += ` AND ${algoliaFilters}`

        let algoliaQuery = {
            page: query?.page || 0,
            filters,
            hitsPerPage: query?.limit || 10
        }

        if (query?.fields) algoliaQuery.attributesToRetrieve = query.fields

        return new Promise((resolve, reject) => {
            algolia.search(search, algoliaQuery)
                .then(({ hits, nbHits }) => {
                    hits.forEach(h => h.id = h.objectID)
                    resolve({ hits, nbHits })
                })
        })

    }

    let mangoSave = (data, options = {}) => {

        let { id } = data
        let method = id ? 'put' : 'post'

        // // Remove _id and computed fields
        delete data.collection
        delete data._id
        delete data.id

        for (let field of c.fields) {
            if (field.computed) delete data[field.name]
            if (field.relationship) data[field.name] = Array.isArray(data[field.name]) ? data[field.name].map(r => r?.id || r) : data[field.name]?.id ? data[field.name].id : data[field.name]
        }
        for (let name in data) {
            if (name.includes('__')) delete data[name]
        }

        let payload = { ...data }
        let Authorization = window.localStorage.getItem('token')
        let headers = {
            Authorization,
            ...options.headers
        }

        return new Promise((resolve, reject) => {
            axios[method](`${api}/${c.name}/${id || ''}`, payload, { headers })
                .then(response => resolve(response?.data?.response))
                .catch(e => reject(e))
        })
    }

    let save = (data, options = { bypassLocal: true }) => {
        if (!options.bypassLocal) return localDB.save(save, data, options)
        else return mangoSave(data, options)
    }

    let deleteEntry = (data) => {
        let id = data.id || data

        let Authorization = window.localStorage.getItem('token')

        return new Promise((resolve, reject) => {
            axios.delete(`${api}/${c.name}/${id || ''}`, { headers: { Authorization } })
                .then(response => resolve(response?.data))
                .catch(e => reject(e))
        })
    }


    let sync = () => {

        let remainingEntries = ref([])
        let syncedEntries = ref([])
        let online = ref(navigator.onLine)
        let syncing = ref(false)

        setInterval(async () => {

            // console.log('syncing', syncing.value, route?.params?.id)
            online.value = navigator.onLine

            if (syncing.value) return

            syncing.value = true

            let entries = await localDB.getEntries()
            remainingEntries.value = entries?.filter(e => (new Date() - new Date(e.updatedLocally)) > 30*1000)

            for (let [index, entry] of remainingEntries.value.entries()) {

                // Don't sync what we're actively working on
                if (route?.params?.id == entry.id || (!isNaN(entry.id) && window.location.pathname.includes(`/${entry.id}`))) {
                    console.log('skipping', entry.id)
                    continue
                }

                try {
                    let response = await save(entry, {syncing: true})
                    if (response?.id) remainingEntries.value.splice(index, 1)
                } catch(e) {
                    console.log('Error saving entry', e, entry)
                }

                await new Promise(resolve => setTimeout(resolve, 10*1000))

            }

            syncing.value = false
            syncedEntries.value = []

        }, 500)


        return { remainingEntries, syncedEntries, online, syncing }

    }

    let subscribe = ({target, triggers, room} = {}) => {

        let socket = io(`${api}/${c.name}`, { transports: ['websocket'] })
        let userId = window.localStorage.getItem('token').split(':')[1]

        room = room || userId
        socket.emit('subscribeToThread', room)

        triggers = triggers || {}
        let defaultTriggers = {
            created: (data) => {
                if (Array.isArray(target)) target.push(data)
                else Object.assign(target, data)
            },
            updated: (data) => {
                if (Array.isArray(target)) {
                    const index = target.findIndex(t => t.id == data.id)
                    if (index !== -1) {
                        Object.assign(target[index], data)
                    }
                }
                else if (target.id == data.id) Object.assign(target, data)
            },
            deleted: (data) => {
                if (Array.isArray(target)) {
                    const index = target.findIndex(t => t.id == data.id)
                    if (index !== -1) {
                        target.splice(index, 1) // Mutates the existing array
                    }
                }
                else if (target.id == data.id) {
                    // Clear the object properties while maintaining reactivity
                    Object.keys(target).forEach(key => delete target[key])
                }
            }
        }

        let combinedTriggers = { ...defaultTriggers, ...triggers }

        for (let trigger of Object.keys(combinedTriggers)) {
            socket.on(`${c.name}:${trigger}`, combinedTriggers[trigger])
        }

    }

    a[c.name] = runQuery
    a[c.name]['save'] = save
    a[c.name]['delete'] = deleteEntry
    a[c.name]['subscribe'] = subscribe
    a[c.singular] = (id, query) => runQuery({ id, ...query })
    a[c.singular]['subscribe'] = (id, callback, message) => {
        if (!id) return console.error('No id provided')
        return subscribe(id, message, callback)
    }

    a[c.name]['local'] = localDB.getEntries
    a[c.singular]['local'] = localDB.get
    a[c.singular]['local']['delete'] = localDB.delete
    a[c.name]['sync'] = sync

    a[c.name]['search'] = runAlgolia
    a[c.name]['search']['init'] = (search, query, algoliaFilters) => {
        let loading = ref(true)
        let data = ref(null)
        let error = ref(null)
        let totalResults = ref(null)

        let response = runAlgolia(search, query, algoliaFilters)
            .then(response => {
                data.value = response.hits
                totalResults.value = response.nbHits
                loading.value = false
            })
            .catch(e => {
                loading.value = false
                error.value = e
            })

        return { data, loading, error }
    }

    a[c.name]['init'] = ({ limit, page, search, fields, id, sort } = {}) => {

        let loading = ref(true)
        let data = ref(null)
        let error = ref(null)

        let response = runQuery({ limit, page, search, fields, id, sort })
            .then(response => {
                data.value = response
                loading.value = false
            })
            .catch(e => {
                loading.value = false
                error.value = e
            })

        return { data, loading, error }

    }

    a[c.singular]['init'] = (id) => a[c.name]['init']({ id })

    a.relationRequest = ({ limit, page, search, fields, id, sort, depthLimit, path } = {}) => {

        let fullQuery


        const params = { limit, page, search, fields, sort, depthLimit }

        if (params.search != undefined) params.search = JSON.stringify(params.search)
        if (params.fields != undefined) params.fields = JSON.stringify(params.fields)
        if (params.sort != undefined) params.sort = JSON.stringify(params.sort)

        const query = Object.keys(params)
            .filter(key => params[key] != undefined)
            ?.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            ?.join('&') || ''
        // console.log(query)

        fullQuery = `${api}/${path}?${query}`

        let Authorization = window.localStorage.getItem('token')

        return new Promise((resolve, reject) => {
            axios.get(fullQuery, { headers: { Authorization } })
                .then(response => resolve(response?.data?.response))
                .catch(e => reject(e))
        })

    }
    a.relationRequest.init = (query) => {

        let loading = ref(true)
        let data = ref(null)
        let error = ref(null)

        let response = a.relationRequest(query)
            .then(response => {
                data.value = response
                loading.value = false
            })
            .catch(e => {
                loading.value = false
                error.value = e
            })

        return { data, loading, error }

    }


    a.graphql = runGraphql
    a.graphql.init = (query) => {

        let loading = ref(true)
        let data = ref(null)
        let error = ref(null)

        let response = runGraphql(query)
            .then(response => {
                data.value = response
                loading.value = false
            })
            .catch(e => {
                loading.value = false
                error.value = e
            })

        return { data, loading, error }

    }

    return a

}, {})

Mango.search = (search, query, algoliaFilters) => {

    search = search || ''

    let filters = ``
    if (algoliaFilters) filters += `${algoliaFilters}`

    let algoliaQuery = {
        page: query?.page || 0,
        filters,
        hitsPerPage: query?.limit || 10
    }

    if (query?.fields) algoliaQuery.attributesToRetrieve = query.fields

    return new Promise((resolve, reject) => {
        algolia.search(search, algoliaQuery)
            .then(({ hits }) => {
                hits.forEach(h => h.id = h.objectID)
                resolve(hits)
            })
    })

}

Mango.login = ({ email, password }) => {
    return new Promise((resolve, reject) => {
        axios.post(`${api}/endpoints/account/login`, { email, password })
            .then(response => {
                window.localStorage.setItem('token', response.data.token)
                window.localStorage.setItem('user', response.data.memberId)
                window.localStorage.setItem('email', email)
                resolve(response.data)
            })
            .catch(e => reject(e))
    })
}

Mango.endpoints = Object.keys(endpoints).reduce((a, c) => {

    a[c] = {}

    for (let method of endpoints[c]) {
        a[c][method] = () => {

            return new Promise((resolve, reject) => {
                console.log('method', method)
                console.log('`${api}/endpoints/${c}`', `${api}/endpoints/${c}`)
                axios[method](`${api}/endpoints/${c}`)
                    .then(response => resolve(response?.data))
                    .catch(e => reject(e))
            })

        }
    }

    for (let method of endpoints[c]) {
        a[c][method]['init'] = () => {

            let loading = ref(true)
            let data = ref(null)
            let error = ref(null)

            let response = a[c][method]().then(r => {
                data.value = r
                loading.value = false
            })

            return { data, loading, error }
        }
    }

    return a

}, {})

Mango.upload = async (file) => {

    return new Promise((resolve, reject) => {
        const formData = new FormData()

        let uploading = true
        let filename = file.name
        let progress = 0
        let url
        let error

        // // Compress the image
        // if (file.type.includes('image')) {
        //     let results = await compress.compress([file], {
        //         quality: .75, // the quality of the image, max is 1,
        //         maxWidth: 1920, // the max width of the output image, defaults to 1920px
        //         maxHeight: 1920, // the max height of the output image, defaults to 1920px
        //         resize: true, // defaults to true, set false if you do not want to resize the image width and height
        //         rotate: false, // See the rotation section below
        //     })
        //     const img1 = results[0]
        //     const base64str = img1.data
        //     const imgExt = img1.ext
        //     const filename = file.name
        //     file = Compress.convertBase64ToFile(base64str, imgExt)
        //     file = new File([file], filename, { type: file.type });
        //     console.log('file', file)
        // }

        formData.append('file', file)

        const xhr = new XMLHttpRequest()

        xhr.open('POST', `${api}/upload`, true)

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                progress = (event.loaded / event.total) * 100
            }
        }

        xhr.onload = () => {
            if (xhr.status === 200) {
                const json = JSON.parse(xhr.response)
                const path = json.paths[0]
                const url = api + path
                uploading = false
                progress = 0
                resolve(url)
            } else {
                error = 'Error while uploading file'
                uploading = false
                reject(error)
            }
        }

        xhr.onerror = () => {
            error = 'Error while uploading file'
            uploading = false
            reject(error)
        }

        xhr.send(formData)
    })
}

Mango.collections = collections
Mango.ws = ws

Mango.online = async () => { try { return (await axios.get(`${api}/endpoints/test`))?.data?.includes('🥭') } catch (e) { return false } }

export default Mango
