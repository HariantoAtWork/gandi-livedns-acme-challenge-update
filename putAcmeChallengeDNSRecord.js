#!/usr/bin/env node

const fs = require('fs')
let APIKEY = process.env.APIKEY
if (!APIKEY)
	try {
		APIKEY = fs.readFileSync('APIKEY')
	} catch (error) {
		console.error(
			'ERROR: APIKEY undefined\n\nEXAMPLE: create a file APIKEY with GANDI Apikey\nEXAMPLE: APIKEY=GANDIAPIKEYHERE ./getAcmeChallengeDNSRecord.js domain'
		)
	}
if (!APIKEY) process.exit(1)

const processArguments = process.argv.slice(2)
if (processArguments.length !== 3) {
	console.error(
		'Need 3 arguments\n\nEXAMPLE: putAcmeChallengeDNSRecord.js <domain> <_acme-challenge #1> <_acme-challenge #2>\nEXAMPLE: putAcmeChallengeDNSRecord.js sylo.space KXXFZfPGXCJF9fBepbrPvy2DLOTplL7Km-qs-fWpg4g RXXydCOEbgZRVThTKvB6HkrLfX1VR8T3_5CVV69CQYo'
	)
	process.exit()
}

const fqdn = processArguments[0]
const rrset_values = processArguments.slice(1).map(val => `"${val}"`)

console.log({
	fqdn,
	rrset_values
})

const axiosData = require('./axiosData'),
	headers = {
		'Authorization': `Apikey ${APIKEY}`
	},
	getAcmeChallengeTxt = {
		method: 'get',
		url: `https://api.gandi.net/v5/livedns/domains/${fqdn}/records/_acme-challenge/TXT`,
		headers
	}

axiosData(getAcmeChallengeTxt)
	.then(({ data }) => data)
	.then(record => ({
		...record,
		...{ rrset_values }
	}))
	.then(mutatedRecord =>
		axiosData({
			...getAcmeChallengeTxt,
			...{ method: 'put', data: mutatedRecord }
		})
	)
	.then(({ data }) => data)
	.then(console.log.bind(console))
