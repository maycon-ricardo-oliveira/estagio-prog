require("../models/User")
require("../models/TypeUser")

const express   = require('express')
const mongoose  = require('mongoose')
const bcrypt    = require('bcryptjs')
const passport  = require('passport')

const router    = express.Router()
const User      = mongoose.model("user")
const TypeUser  = mongoose.model('typeuser')

router.get("/register", (req,res) => {

    TypeUser.find().then((typeuser) => {
    
        res.render("user/register", {typeuser: typeuser})
    
    }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao carregar formulário!")
        res.redirect("/user/register")

    })

})

router.post("/register", (req,res) => {

    var errors = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {

        errors.push( {text: "Nome inválido"} )

    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {

        errors.push( {text: "Email inválido"} )

    }

    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {

        errors.push( {text: "Senha inválido"} )

    }

    if (req.body.password.length < 8) {

        errors.push( {text: "Senha muito curta"} )

    }

    if (req.body.password != req.body.password_2) {

        errors.push( {text: "As senhas são diferentes, tente novamente!"} )

    }

    if (errors.length > 0 ) {

        res.render("user/register", {errors: errors} )

    } else {

        User.findOne( {email: req.body.email} ).then((user) => {

            if (user) {

                req.flash("error_msg", "Email já cadastrado!")
                res.redirect("/user/register")

            } else {
                
                const newUser = new User({

                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    eAdmin: 1

                })

                bcrypt.genSalt(10, (error,salt) => {

                    bcrypt.hash(newUser.password, salt, (error, hash) => {

                        if (error) {

                            req,flash("error_msg", "Houve um erro ao salvar usuário")
                            res.redirect("/")
                        }

                        newUser.password = hash

                        newUser.save().then(() => {

                            req.flash("success_msg", "Usuário cadastrado com sucesso!")
                            res.redirect("/")

                        }).catch((error) => {

                            console.log(error)
                            req.flash("error_msg", "Houve um erro ao criar usuário")
                            res.redirect("/user/register")

                        })

                    })

                })

            }

        }).catch((error) => {

            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/register")

        })

    }

})

router.get("/login", (req, res) => {

    res.render("user/login")

})

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {

        successFlash: 'Bem Vindo!',
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true 

    })(req, res, next)

});

router.get("/logout", (req, res) => {

    req.logout()
    req.flash("success_msg", "Volte sempre")
    res.redirect("/")

})

router.get('/listuser', (req, res) => {

    User.find().then((user) => {

        res.render("user/user", {user: user})

    }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao listar usuários")
        res.redirect("/admin")

    })

})

router.get("/typeuser", (req, res) => {

    TypeUser.find().then((typeuser) => {

        res.render("user/typeuser", {typeuser: typeuser} )

    }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao carregar formulário!")
        res.redirect("/admin")

    })

})

router.get('/typeuser/add', (req, res) => {

    res.render("user/addtypeuser")

})

router.post('/addtypeuser/new', (req, res) => {

    var errors = []

    if (!req.body.name || typeof req.body.name  == undefined || req.body.name == null) {

        errors.push({text: "Nome inválido"})

    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {

        errors.push({ text: "Slug inválido" })

    }

    if (req.body.name.length < 2) {

        errors.push({ text: "Nome do tipo é muito pequeno" })

    }

    if (req.body.active == 'on') {

      var active = 1
    
    }else {
    
        active = 0
    
    }

    if (errors.length > 0) {
       
        res.render("admin/addtypeuser", { errors: errors })

    } else {

        const newTypeUser = {

            name: req.body.name,
            slug: req.body.slug,
            active: active

        }

        new TypeUser(newTypeUser).save().then(() => {

            req.flash("success_msg", "Tipo de usuário criado com sucesso!")
            res.redirect("/user/typeuser")

        }).catch((error) => {
            console.log(req.body.active )
            req.flash("error_msg", "Houve um erro ao salvar tipo de usuário, tente novamente!")
            res.redirect("/admin")

        })
    }
})


module.exports = router