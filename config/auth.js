const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


// Model de usuário 
require("../models/User")
const User = mongoose.model("user")

module.exports = function(passport) {

    passport.use(new LocalStrategy( {

        usernameField: 'email',
        passwordField: 'password'

    }, (email,password, done)  => {

            User.findOne({
            
                email: email
            
            }).then((user) => {

                if (!user) {
                    
                    return done(null, false, { message: 'Email incorreto.' })

                }
                
                bcrypt.compare(password, user.password, (erro, checkpass) => {
                    
                    if (checkpass) {

                        return done(null, user)
                        
                    } else {

                        return done(null, false, { message: 'Senha incorreta.' })

                    }

                })

            })

        }

    ))

    passport.serializeUser((user, done) => {

        done(null, user.id)

    })

    passport.deserializeUser((id, done) => {

        User.findById(id, (error, user) => {

            done (error, user)

        })

    })

}