import path from 'path'
import cors from 'cors'

import express from 'express'
import cookieParser from 'cookie-parser'

import { toySrvService } from './services/toy.srv.service.js'
import { loggerService } from './services/logger.service.js'


const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173'
    ],
    credentials: true
}


// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))


// REST API for Toys

// Toy LIST
app.get('/api/toy', (req, res) => {

    const filterBy = req.query

    // const filterBy = {
    //     name: req.query.name || '',
    //     inStock: req.query.inStock || undefined,
    //     label: req.query.label || '',
    //     isDesc: req.query.isDesc || 1,
    //     sortBy: req.query.sortBy || '',
    // }

    toySrvService.query(filterBy)
        .then((toys) => {
            res.send(toys)
        })
        .catch((err) => {
            loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toys')
        })
})

// Toy READ
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toySrvService.getById(toyId)
        .then((toy) => {
            toy.msgs = ['Hello', 'hey!', 'how are you']
            res.send(toy)
        })
        .catch((err) => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

// Toy CREATE
app.post('/api/toy', (req, res) => {
    console.log("🚀 ~ app.post ~ req:", req.body)
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot add car')

    // const toy = req.body

    const toy = {
        name: req.body.name,
        price: +req.body.price,
        labels: req.body.labels,
        createdAt: new Date().getTime()
    }
    console.log("🚀 ~ app.post ~ toy:", toy)


    // toySrvService.save(toy, loggedinUser)
    toySrvService.save(toy)
        .then((savedToy) => {
            console.log("🚀 ~ .then ~ savedToy:", savedToy)

            res.send(savedToy)
        })
        .catch((err) => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })

})

// Toy UPDATE
app.put('/api/toy', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot update toy')

    // const car = {
    //     _id: req.body._id,
    //     vendor: req.body.vendor,
    //     speed: +req.body.speed,
    //     price: +req.body.price,
    // }
    // toySrvService.save(toy, loggedinUser)

    const toy = {
        _id: req.body._id,
        name: req.body.name,
        price: +req.body.price,
        labels: req.body.labels,
        inStock: req.body.inStock
    }

    toySrvService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch((err) => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })
})

// Toy DELETE
app.delete('/api/toy/:toyId', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // loggerService.info('loggedinUser car delete:', loggedinUser)
    // if (!loggedinUser) {
    //     loggerService.info('Cannot remove car, No user')
    //     return res.status(401).send('Cannot remove car')
    // }

    const { toyId } = req.params
    // toySrvService.remove(toyId, loggedinUser)
    toySrvService.remove(toyId)
        .then(() => {
            loggerService.info(`Toy ${toyId} removed`)
            res.send('Removed!')
        })
        .catch((err) => {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        })

})


// AUTH API
// app.get('/api/user', (req, res) => {
//     userService.query()
//         .then((users) => {
//             res.send(users)
//         })
//         .catch((err) => {
//             loggerService.error('Cannot load users', err)
//             res.status(400).send('Cannot load users')
//         })
// })

// app.post('/api/auth/login', (req, res) => {
//     const credentials = req.body
//     userService.checkLogin(credentials)
//         .then(user => {
//             if (user) {
//                 const loginToken = userService.getLoginToken(user)
//                 res.cookie('loginToken', loginToken)
//                 res.send(user)
//             } else {
//                 loggerService.info('Invalid Credentials', credentials)
//                 res.status(401).send('Invalid Credentials')
//             }
//         })
// })

// app.post('/api/auth/signup', (req, res) => {
//     const credentials = req.body
//     userService.save(credentials)
//         .then(user => {
//             if (user) {
//                 const loginToken = userService.getLoginToken(user)
//                 res.cookie('loginToken', loginToken)
//                 res.send(user)
//             } else {
//                 loggerService.info('Cannot signup', credentials)
//                 res.status(400).send('Cannot signup')
//             }
//         })
// })

// app.post('/api/auth/logout', (req, res) => {
//     res.clearCookie('loginToken')
//     res.send('logged-out!')
// })

// app.get('/api/user/:userId', (req, res) => {
//     const { userId } = req.params
//     userService.getById(userId)
//         .then((user) => {
//             res.send(user)
//         })
//         .catch((err) => {
//             loggerService.error('Cannot get user', err)
//             res.status(400).send('Cannot get user')
//         })
// })

// app.put('/api/user', (req, res) => {
//     const loggedinUser = userService.validateToken(req.cookies.loginToken)
//     if (!loggedinUser) return res.status(400).send('No logged in user')
//     const { diff } = req.body
//     if (loggedinUser.score + diff < 0) return res.status(400).send('No credit')
//     loggedinUser.score += diff
//     return userService.save(loggedinUser).then(user => {
//         const token = userService.getLoginToken(user)
//         res.cookie('loginToken', token)
//         res.send(user)
//     })
// })

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})



const PORT = 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
