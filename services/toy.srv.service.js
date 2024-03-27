
import fs from 'fs'
import { utilService } from './util.service.js'
// import { loggerService } from './logger.service.js'

export const toySrvService = {
    query,
    getById,
    remove,
    save
}

let toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = {}) {
    let toysToReturn = [...toys]

    if (filterBy.name) {
        const regex = new RegExp(filterBy.name, 'i')
        toysToReturn = toysToReturn.filter(toy => regex.test(toy.name))
    }

    if (filterBy.inStock === 'true' || filterBy.inStock === 'false') {
        const inStock = filterBy.inStock === 'true'
        toysToReturn = toysToReturn.filter(toy => toy.inStock === inStock)
    }
    // if (filterBy.inStock !== undefined) {
    //     const inStock = filterBy.inStock === true
    //     toysToReturn = toysToReturn.filter(toy => toy.inStock === inStock)
    // }

    if (filterBy.label) {
        toysToReturn = toysToReturn.filter(toy => toy.labels.includes(filterBy.label))
    }

    if (filterBy.sortBy) {
        const isDesc = filterBy.isDesc === 'false'
        let dir = isDesc ? -1 : 1

        if (filterBy.sortBy === 'name') {
            toysToReturn.sort((toy1, toy2) => dir * toy2.name.localeCompare(toy1.name))
        }
        if (filterBy.sortBy === 'price') {
            toysToReturn.sort((toy1, toy2) => dir * (toy2.price - toy1.price))
        }
        if (filterBy.sortBy === 'createdAt') {
            toysToReturn.sort((toy1, toy2) => dir * (new Date(toy2.createdAt) - new Date(toy1.createdAt)))
        }

    }

    return Promise.resolve(toysToReturn)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

// function remove(toyId, loggedinUser) {
function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such toy')
    const toy = toys[idx]

    toys.splice(idx, 1)
    return _saveCarsToFile()
}

// function save(toy, loggedinUser) {
function save(toy) {
    console.log("🚀 ~ save ~ toy:", toy)

    if (toy._id) {
        console.log("🚀 ~ save - edit ~ toy:", toy)

        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)

        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toyToUpdate.inStock = toy.inStock
        toyToUpdate.labels = toy.labels
        toy = toyToUpdate
        console.log("🚀 ~ save ~ toy:", toy)


    } else {
        toy._id = utilService.makeId()
        toy.name = toy.name
        toy.price = toy.price
        toy.inStock = toy.inStock
        toy.labels = toy.labels
        toy.createdAt = new Date().getTime()
        toy.inStock = true

        toys.push(toy)
    }

    return _saveCarsToFile().then(() => toy)
}


function _saveCarsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}
