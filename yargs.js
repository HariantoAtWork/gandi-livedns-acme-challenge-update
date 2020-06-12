#!/usr/bin/env node

const yargs = require('yargs'),
	axiosBluebird = require('axiosbluebird'),
	fs = require('fs')
let APIKEY = process.env.APIKEY
if (!APIKEY)
	try {
		APIKEY = fs.readFileSync('APIKEY')
	} catch (error) {
		console.error(`
ERROR: APIKEY undefined
 - Example: create a file APIKEY with GANDI Apikey
 - Example GET: APIKEY=GANDIAPIKEYHERE ./gandiAcmeChallenge.js domain.ext
 - Example PUT: APIKEY=GANDIAPIKEYHERE ./gandiAcmeChallenge.js domain.ext acmeChallenge1 acmeChallenge2
`)
	}
if (!APIKEY) process.exit(1)

const argv = yargs
	.option('write', {
		alias: 'w',
		description: 'PUT _acme-challenge records',
		type: 'boolean'
	})
	.help()
	.alias('help', 'h').argv

const axiosData = requestConfig =>
		axiosBluebird.axios(requestConfig).then(({ data }) => data),
	headers = {
		'Authorization': `Apikey ${APIKEY}`
	},
	methods = {
		getAcmeChallengeTxt(fqdn) {
			return {
				method: 'get',
				url: `https://api.gandi.net/v5/livedns/domains/${fqdn}/records/_acme-challenge/TXT`,
				headers
			}
		},
		getAcmeChallengeTxtFromSubdomains(fqdn, subdomains) {
			return subdomains.map(subdomain => ({
				method: 'get',
				url: `https://api.gandi.net/v5/livedns/domains/${fqdn}/records/_acme-challenge.${subdomain}/TXT`,
				headers
			}))
		},
		setAcmeChallengeTxt({ fqdn, rrset_values }) {
			const data = {
				'rrset_type': 'TXT',
				'rrset_ttl': 1800,
				'rrset_name': '_acme-challenge',
				'rrset_href': `https://api.gandi.net/v5/livedns/domains/${fqdn}/records/_acme-challenge/TXT`,
				'rrset_values': rrset_values.map(val => `"${val}"`)
			}
			return {
				method: 'put',
				url: `https://api.gandi.net/v5/livedns/domains/${fqdn}/records/_acme-challenge/TXT`,
				headers,
				data
			}
		},
		setAcmeChallengeTxtToSubdomain({ fqdn, subdomain, rrset_values }) {
			const data = {
				'rrset_type': 'TXT',
				'rrset_ttl': 1800,
				'rrset_name': '_acme-challenge',
				'rrset_href': `https://api.gandi.net/v5/livedns/domains/${fqdn}/records/_acme-challenge.${subdomain}/TXT`,
				'rrset_values': rrset_values.map(val => `"${val}"`)
			}
			return {
				method: 'put',
				url: `https://api.gandi.net/v5/livedns/domains/${fqdn}/records/_acme-challenge.${subdomain}/TXT`,
				headers,
				data
			}
		},
		getGandi(argv) {
			const queue = [],
				promises = [],
				read = argv.r || argv.read,
				fqdn = argv._[0]

			queue.push(this.getAcmeChallengeTxt(fqdn))

			if (read) {
				queue.push(
					...this.getAcmeChallengeTxtFromSubdomains(
						fqdn,
						String(read).split(',')
					)
				)
			}
			queue.forEach(item => {
				promises.push(
					axiosData(item).catch(
						console.warn.bind(console, 'FAIL: retrievedData')
					)
				)
			})

			Promise.all(promises)
				.then(values => {
					console.log(JSON.stringify(values, null, '\t'))
				})
				.catch(console.error.bind(console, 'FAIL Promise All - GET:'))
		},
		setGandi(argv) {
			const queue = [],
				promises = [],
				write = argv.w || argv.write,
				fqdn = argv._[0],
				keys = argv._.slice(1),
				domain = keys.reduce((acc, item) => {
					if (item.includes(':')) {
						let [key, value] = item.split(':')
						if (!String(key).length || !String(value).length) return acc

						let object = acc[key]
						acc[key] =
							object && Array.isArray(object)
								? (val => {
										object.push(val)
										return object
								  })(value)
								: [value]
					} else {
						let object = acc['_']
						acc['_'] =
							object && Array.isArray(object)
								? (val => {
										object.push(val)
										return object
								  })(item)
								: [item]
					}
					return acc
				}, {})

			console.log({ keys, domain })
			// Collect to Queue
			Object.entries(domain).forEach(([subdomain, rrset_values]) => {
				if (subdomain === '_') {
					queue.push(this.setAcmeChallengeTxt({ fqdn, rrset_values }))
				} else {
					queue.push(
						this.setAcmeChallengeTxtToSubdomain({
							fqdn,
							subdomain,
							rrset_values
						})
					)
				}
			})

			// Collect promises
			queue.forEach(item => {
				promises.push(
					axiosData(item).catch(
						console.warn.bind(console, 'FAIL: retrievedData')
					)
				)
			})

			Promise.all(promises)
				.then(values => {
					console.log(JSON.stringify(values, null, '\t'))
				})
				.catch(console.error.bind(console, 'FAIL Promise All - PUT:'))
		}
	}

const read = argv.r || argv.read,
	write = argv.w || argv.write

// READ
if (argv._.length) {
	if (write) {
		if (argv._.length > 1) {
			methods.setGandi(argv)
		} else {
			console.log('READ')
			methods.getGandi(argv)
		}
	} else {
		methods.getGandi(argv)
	}
} else {
	console.log(`
Gandi API v5
 - Example GET: ./gandiAcmeChallenge.js sylo.space
 - Example GET: ./gandiAcmeChallenge.js sylo.space -r oib
 - Example GET: ./gandiAcmeChallenge.js sylo.space -r oib,otherinbox
 - Example PUT: ./gandiAcmeChallenge.js sylo.space -w KXXFZfPGXCJF9fBepbrPvy2DLOTplL7Km-qs-fWpg4g RXXydCOEbgZRVThTKvB6HkrLfX1VR8T3_5CVV69CQYo
 - Example PUT: ./gandiAcmeChallenge.js sylo.space -w key-basic1 oib:key-oib1 otherinbox:key-otherinbox1 key-basic2
`)
	process.exit()
}

// console.log(argv)
