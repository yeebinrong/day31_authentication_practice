// Load libraries
const express = require('express')
const morgan = require('morgan')
const mysql = require('mysql2/promise')
const secure = require('secure-env')
const cors = require('cors')
const jwt = require('jsonwebtoken')

// Passport core
const passport = require('passport')
// Passport strategy
const LocalStrategy = require('passport-local').Strategy

// configure passport with a strategy
passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, username, password, done) => {
        try {
            // perform the authentication
            const data = (await QUERY_SELECT_USER_PASS_WITH_USER([username, password]))
            if (data.length > 0) {
                done(null,
                    // info about the user
                    {
                        username: username,
                        loginTime: (new Date().toString()),
                        security: 2
                    }
                )
            } else {
                // Incorrect login
                done('Incorrect username and/or password', false)
            }
        } catch (e) {
            done(`Error authenticating: ${e}`, false)
        }
    }
))

// create an instance of express
const app = express()

// declare variables
global.env = secure({secret: process.env.ENV_PASSWORD})
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const POOL = mysql.createPool({
    host: global.env.SQL_HOST,
    port: global.env.SQL_PORT,
    user: global.env.SQL_USER,
    password: global.env.SQL_PASS,
    database: global.env.SQL_SCHEMA,
    connectionLimit: global.env.SQL_CON_LIMIT
})

// Boilerplate for making SQL queries
const mkQuery = (SQL, POOL) => {
    return async (PARAMS) => {
        // get a connection from pool
        const conn = await POOL.getConnection()
        try {
            // Execute the query
            const results = await conn.query(SQL, PARAMS)
            return results[0]
        } catch (e) {
            return Promise.reject(e)
        } finally {
            conn.release()
        }
    }
}

// Authentication function
const mkAuth = (passport) => {
    return (req, resp, next) => {
        passport.authenticate('local',
            (err, user, info) => {
                if (null != err) {
                    resp.status(401)
                    resp.type('application/json')
                    resp.json({ error: err })
                    return
                }
                if (!user) {
                    resp.status(401);
                    resp.type('application/json');
                    resp.json({ info });
                    return;
                  }
                // need to set req.user to user if using custom middleware
                req.user = user
                next()
            }
        )(req, resp, next)
    }
}

const localStrategyAuth = mkAuth(passport)

const SELECT_USER_PASS_WITH_USER = 'SELECT user_id FROM user WHERE user_id = ? and password = sha1(?)' 
const QUERY_SELECT_USER_PASS_WITH_USER = mkQuery(SELECT_USER_PASS_WITH_USER, POOL)

// log requests with morgan
app.use(morgan('combined'))

// parse json and urlencoded
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// initialise passport (must be done after parsing  json / urlencoded)
app.use(passport.initialize())

app.post('/login',
    // passport middleware to perform login
    // passport.authenticate('local', {session: false}),
    localStrategyAuth,
    (req, resp) => {
        console.info(`user: ${req.user.username}`)
        const currTime = (new Date()).getTime() / 1000
        const token = jwt.sign({
            sub: req.user.username,
            iss: 'myapp',
            iat: currTime,
            exp: currTime + (30),
            data: {
                  // avatar: req.user.avatar,
                loginTime : req.user.loginTime
            }
        }, process.env.ENV_PASSWORD)

        resp.status(200)
        resp.type('application/json')
        resp.json({message: `Login at ${new Date()}`, token})
    }
)

// Look for token in HTTP header
// Authorization: Bear <token>
app.get('/protected/secret',
    (req, resp, next) => {
        // check if request has Authorization header
        const auth = req.get('Authorization')
        if (null == auth) {
            resp.status(403)
            resp.type('application/json')
            resp.json({message: 'Missing Authorization Header.'})
            return
        }
        // Bearer authorization
        const terms = auth.split(' ')
        if ((terms.length != 2) || (terms[0] != 'Bearer')) {
            resp.status(403)
            resp.json({message: 'Incorrect Authorization'})
            return
        }
        const token = terms[1]
        try {
            const verified = jwt.verify(token, process.env.ENV_PASSWORD)
            console.info(`Verified? ${verified}`)
            req.token = verified
            next()
        } catch (e) {
            resp.status(403)
            resp.type('application/json')
            resp.json({message: 'Incorrect Token', error: e})
        }
    },
    (req, resp) => {
        resp.status(200)
        resp.type('application/json')
        resp.json({meaning_of_life: 42})
    }
)

// Tests the MYSQL server
const checkMYSQL = () => {
    try {
        return POOL.getConnection()
        .then ((conn) => {
            console.info("Pinging MYSQL in progress...")
            conn.ping()
            return conn
        })
        .then ((conn) => {
            conn.release()
            console.info("Pinging MYSQL is successful...")
            return Promise.resolve()
        })
    } catch (e) {
        return Promise.reject(e)
    }
}

// Runs all tests before starting server
Promise.all([checkMYSQL()])
.then (() => {
    app.listen(PORT, () => {
        console.info(`Application is listening PORT ${PORT} at ${new Date()}`)
    })
}).catch (e => {
    console.info("Error starting server: ",  e)
})