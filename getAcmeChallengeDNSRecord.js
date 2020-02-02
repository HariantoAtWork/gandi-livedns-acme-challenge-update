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
if (processArguments.length !== 1) {
	console.error(
		'Need 1 argument\n\nEXAMPLE: getAcmeChallengeDNSRecord.js domain\nEXAMPLE: getAcmeChallengeDNSRecord.js sylo.space'
	)
	process.exit(1)
}
const fqdn = processArguments[0]

const axiosData = require('./lib/axiosData'),
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
	.then(console.log.bind(console))
