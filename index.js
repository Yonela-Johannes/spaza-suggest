import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import SpazaSuggest from './spaza-suggest.js'
import pgPromise from 'pg-promise';
import session from 'express-session'
const local = 'postgres://postgres:juanesse@123@localhost:5432/spaza_suggest'
const connectionString = process.env.DATABASE_URL || local
import handlebars from 'express-handlebars'
import dotenv from 'dotenv'
import {Routes } from './routes/routes.js'

const pgp = pgPromise();
const app = express()

dotenv.config()

const config = {
    connectionString,
    max: 20,
    ssl: {
        rejectUnauthorized: false
    }
}

const db = pgp(config)
const spazaSuggest = SpazaSuggest(db)
const routes = Routes(spazaSuggest)


// handlebars components initializing
app.set('view engine', 'hbs')
app.engine('hbs', handlebars.engine({
    layoutsDir: `./views/layouts`,
    extname: 'hbs',
    defaultLayout: 'main',
}))

// required packages
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }), bodyParser.json())
app.use(cors())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}))

app.get('/', routes.getLanding)
app.post('/', routes.postLanding)
app.get('/login', routes.getLogin)
app.post('/login', routes.postLogin)
app.get('/client/:id', routes.clientPage)
app.post('/client/:id', routes.postClientPage)

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('Your app is running on port: ', port)
})