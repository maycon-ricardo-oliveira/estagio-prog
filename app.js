// Carregando Módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    require("./models/Post")
    const Post = mongoose.model("post")
    require("./models/Category")
    const Category = mongoose.model("category")
    const user = require("./routes/user")
    const passport = require('passport')
    require("./config/auth")(passport)
    const db = require("./config/db")

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
            
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.success = req.flash("success")
            res.locals.user = req.user || null;
            next()
        })

    //  Body Parser
    app.use(bodyParser.urlencoded({extend: true}))
    app.use(bodyParser.json())

    //  Handlebars
    app.engine('handlebars', handlebars( {

        defaultLayout: 'main'

    }))

    app.set('view engine', 'handlebars')

    //  Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect(db.mongoURI).then(() => {

         console.log("Database conected!")

    }).catch((error) => {

        console.log("Connection DataBase failed..." + error)

    })

    //  Public
    app.use(express.static(path.join(__dirname, 'public')))


//  Routes
    app.get('/', (req,res) => {

        Post.find().populate("category").sort( {data: "desc"} ).then((post) => {

            res.render("index", {post: post})

        }).catch((error) => {

            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")

        })

    })

    app.get("/404", (req, res) => {

        res.send("Erro 404!")

    })

    app.get('/post/:slug', (req,res) => {

        Post.findOne({slug:req.params.slug}).then((post) => {
            if (post) {

                res.render("post/index", {post: post})

            } else {

                req.flash("error_msg", "Esta postagem não existe")
                res.redirect("/")

            }

        }).catch((error) => {

            req.flash("error_msg", "houve um erro interno")
            res.redirect("/")

        })

    })

    app.get('/category', (req,res) => {

        Category.find().then((category) => {

            res.render("category/index", {category: category})

        }).catch((error) => {

            req.flash("error_msg", "Houve um erro interno ao listar categorias")
            res.redirect("/404")

        })

    })

    app.get('/category/:slug', (req,res) => {

        Category.findOne( {slug: req.params.slug} ).then((category) => {

            if (category) {

                Post.find( {category: category._id}).then((post) => {

                    res.render("category/posts", {post: post, category: category})

                }).catch((error) => {

                    req.flash("error_msg", "houve um erro ao listar posts!")
                    res.redirect("/")

                })
                

            } else {

                req.flash("error_msg", "Esta categoria não existe")
                res.redirect("/")

            }

        }).catch((error) => {

            req.flash("error_msg", "Houve um erro interno ao carregar a página desta categoria")
            res.redirect("/")

        })

    })

    app.use('/admin', admin)
    app.use('/user', user)


//  Others
const   PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log("Server Running!!! ")
})