
import fs from 'fs'
import { utilService } from './util.service.js'
// import { loggerService } from './logger.service.js'

export const toySrvService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = {}) {
    if (filterBy.name) {
        const regex = new RegExp(filterBy.name, 'i')
        toys = toys.filter(toy => regex.test(toy.name))
    }

    if (filterBy.inStock !== undefined) {

        const inStock = filterBy.inStock === true
        toys = toys.filter(toy => toy.inStock === inStock)
    }

    if (filterBy.label) {
        toys = toys.filter(toy => toy.labels.includes(filterBy.label))
    }

    if (filterBy.sortBy) {
        let dir
        if (filterBy.isDesc) dir = 1
        else dir = -1

        if (filterBy.sortBy === 'name') {
            toys.sort((toy1, toy2) => dir * toy2.name.localCompare(toy1.name))
        }
        if (filterBy.sortBy === 'price') {
            toys.sort((toy1, toy2) => dir * (toy2.price - toy1.price))
        }
        if (filterBy.sortBy === 'createdAt') {
            toys.sort((toy1, toy2) => dir * (toy2.createdAt - toy1.createdAt))
        }

    }
    return Promise.resolve(toys)
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
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)

        // if (!loggedinUser.isAdmin &&
        //     carToUpdate.owner._id !== loggedinUser._id) {
        //     return Promise.reject('Not your car')
        // }

        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toyToUpdate.inStock = toy.inStock
        toy = toyToUpdate

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
