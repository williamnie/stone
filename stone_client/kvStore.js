import got, { Options } from 'got'

const prefixUrl = 'http://0.0.0.0:3000/'
const apis = {
    createSubLeavel: '/internal/db/createSubLeavel',
    getLeavelData: 'internal/db/getData',
    createLeavelData: '/internal/db/createData',
    deleteLeavelData: '/internal/db/deleteData'
}

const options = {
    prefixUrl,
    method: 'POST',
    responseType: 'json',
};

const createSubLeavel = async (data) => {
    try {
        options.json = data
        const { body } = await got(apis.createSubLeavel, options)
        return body
    } catch (error) {

    }
}

const getData = async (data) => {
    options.json = data
    try {
        const { body } = await got(apis.getLeavelData, options)
        return body
    } catch (error) {
        console.log(error);
    }
}

const createLeavelData = async (data) => {
    try {
        options.json = data
        const { body } = await got(apis.createLeavelData, options)
        return body
    } catch (error) {
    }
}

const deleteLeavelData = async (data) => {
    try {
        options.json = data
        const { body } = await got(apis.deleteLeavelData, options)
        return body
    } catch (error) {

    }
}


export { createSubLeavel, getData, createLeavelData, deleteLeavelData }