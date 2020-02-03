const axiosBluebird = require('axiosbluebird')
const Promise = axiosBluebird.Promise

let axiosDataRequest = Promise.resolve()

const axiosData = requestConfig => {
	axiosDataRequest.cancel()
	axiosDataRequest = axiosBluebird.axios(requestConfig)
	return axiosDataRequest.catch(e => {
		console.error('ERROR:', { ...e.response.data })
		process.exit(1)
	})
}

module.exports = axiosData
