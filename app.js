// Carregando Módulos
const express       = require('express')
const handlebars    = require('express-handlebars')
const bodyParser    = require('body-parser')
const path          = require('path')
const mongoose      = require('mongoose')
const session       = require('express-session')
const flash         = require('connect-flash')
const passport      = require('passport')

// Constants Routes
const db            = require("./config/db")
const admin         = require('./routes/admin')
const user          = require("./routes/user")

const app           = express()

require("./config/auth")(passport)


//  Configs
    //  Session
        app.use(session( {

            secret: "tcc",
            resave: true,
            saveUninitialized: true

        } ))
         
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    //  Middleware
        app.use((req, res, next) => {
            
            res.locals.success_msg  = req.flash("success_msg")
            res.locals.error_msg    = req.flash("error_msg")
            res.locals.error        = req.flash("error")
            res.locals.success      = req.flash("success")
            res.locals.user         = req.user || null;
            next()
        })

    //  Body Parser
    app.use(bodyParser.urlencoded( {extend: true} ) )
    app.use(bodyParser.json())

    //  Handlebars
    app.engine('handlebars', handlebars( {defaultLayout: 'main'} ))
    app.set('view engine', 'handlebars')

    //  Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect(db.mongoURI).then(() => {

         console.log("Database conected!!! ")

    }).catch((error) => {

        console.log("Connection DataBase failed..." + error)

    })

    //  Public
    app.use(express.static( path.join(__dirname, 'public') ))

    //  Routes
    app.get("/404", (req, res) => {

        res.send("Erro 404!")

    })

    app.get("/", (req, res) => {

        res.render("index")

    })

    app.use('/admin', admin)
    app.use('/user', user)


    //  Others
    const   PORT = process.env.PORT || 8081
    app.listen(PORT, () => {
        console.log("Server Running!!! ")
    })