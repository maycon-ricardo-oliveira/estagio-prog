require("../models/TypeUser")
require("../models/Client")
require("../models/User") 
require("../models/ClientAddress")

const express       = require('express')
const mongoose      = require('mongoose')
const format        = require('date-format')
const {eAdmin}      = require("../helpers/eAdmin")
const axios         = require('axios')

const router        = express.Router()
const TypeUser      = mongoose.model('typeuser')
const Client        = mongoose.model('client')
const ClientAddress = mongoose.model('clientaddress')
const User          = mongoose.model('user')


router.get('/', (req, res) => {

    res.render("admin/index")

})

router.get('/client', (req, res) => {

    Client.find().then((client) => {

        res.render("admin/client/index", {client:client} )

    }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao listar clientes")
        res.redirect("/admin")

    })
})

router.get("/client/add", (req, res) => {

    TypeUser.find().then((typeuser) => {

        res.render("admin/client/addclient", {typeuser: typeuser})

    }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin/client")

    })

})

router.post("/client/new", (req,  res) => {

    var errors =[]
 
    if (!req.body.name || typeof req.body.name  == undefined || req.body.name == null) {
       
        errors.push({text: "Nome inválido"})

    }

    if (req.body.name.length < 2) {

        errors.push({ text: "O nome é muito pequeno" })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {

        errors.push({ text: "Email inválido" })

    }

    if (!req.body.telephone || typeof req.body.telephone  == undefined || req.body.telephone == null) {

        errors.push({text: "Telefone inválida"})

    }

    if (req.body.telephone.length < 2) {

        errors.push({ text: "O telefone é muito pequeno" })
    }

    if (!req.body.cpf || typeof req.body.cpf  == undefined || req.body.cpf == null) {

        errors.push({text: "Cpf inválido"})

    }

    if (req.body.cpf.length < 2) {

        errors.push({ text: "O cpf é muito pequeno" })
    }

    if ( req.body.typeuser == "0") {

        errors.push({text: "Tipo de pessoa inválido!"})

    }

    if (errors.length > 0) {

        res.render("admin/client/addclient", {errors: errors} )

    } else {

        const newClient = {

            name:       req.body.name,
            email:      req.body.email,
            telephone:  req.body.telephone,
            cpf:        req.body.cpf,
            typeUser:   req.body.typeuser,
            address:    req.body.id 

        }
        new Client(newClient).save().then(() => {

            req.flash("success_msg", "Cliente criado com sucesso!")
            res.redirect("/admin/client")

        }).catch((error) => {
            console.log(error)

            req.flash("error_msg", "Houve um erro ao salvar cliente")
            res.redirect("/admin/client")

        })
    }
})

router.get("/client/edit/:id", (req,res) => {

    Client.findOne( {_id: req.params.id} ).then((client) => {

        TypeUser.find().then((typeuser) => {

            res.render("admin/client/editclient", {typeuser: typeuser, client: client} )

        }).catch((error) => {

            req.flash("error_msg", "Houve um erro ao listar os tipos de pessoas")
            res.redirect("/admin/client")

        })

    }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao caarregar o formulário de edição")
        res.redirect("/admin/client")

    })

})

router.post("/client/edit", (req, res) => {

    var errors =[]
 
    if (!req.body.name || typeof req.body.name  == undefined || req.body.name == null) {
       
        errors.push({text: "Nome inválido"})

    }

    if (req.body.name.length < 2) {

        errors.push({ text: "O nome é muito pequeno" })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {

        errors.push({ text: "Email inválido" })

    }

    if (!req.body.telephone || typeof req.body.telephone  == undefined || req.body.telephone == null) {

        errors.push({text: "Telefone inválida"})

    }

    if (req.body.telephone.length < 2) {

        errors.push({ text: "O telefone é muito pequeno" })
    }

    if (!req.body.cpf || typeof req.body.cpf  == undefined || req.body.cpf == null) {

        errors.push({text: "Cpf inválido"})

    }

    if (req.body.cpf.length < 2) {

        errors.push( {text: "O cpf é muito pequeno"} )
    }

    if ( req.body.typeuser == "0") {

        errors.push( {text: "Tipo de pessoa inválido!"} )

    }

    if (errors.length > 0) {

        res.render("admin/client/index", {errors: errors} )

    } else {

        Client.findOne( {_id: req.body.id} ).then((client) => {

            client.name         = req.body.name,
            client.email        = req.body.email,
            client.telephone    = req.body.telephone,
            client.cpf          = req.body.cpf,
            client.typeUser     = req.body.typeuser

            client.save().then(() => {

                req.flash("success_msg", "Cliente editado com sucesso!")
                res.redirect("/admin/client")

            }).catch((error) => {

                req.flash("error_msg", "Erro interno")
                res.redirect("/admin/client")

            })

        }).catch((error) =>{

                req.flash("error_msg", "Houve um erro ao salvar edição")
                res.redirect("/admin/client")

            })
        }
    })

router.get("/client/delete/:id", (req,res) => {

    Client.remove({_id: req.params.id}).then(() => {

        req.flash("success_msg", "Cliente deletado!")
        res.redirect("/admin/client")
 
    }).catch((error) =>{

        req.flash("error_msg", "Houve um erro ao deletar cliente")
        res.redirect("/admin/client")

    })
})

router.get("/client/address/add/:id", (req, res) => {

    Client.findOne( {_id: req.params.id} ).then((client) => {

        res.render("admin/client/address/addclientaddress",  {client: client} )

     }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
        res.redirect("/admin/client")

    })

})

router.post("/client/address/add", (req, res) => {

    var errors =[]
 
    if (!req.body.cep || typeof req.body.cep  == undefined || req.body.cep == null) {
       
        errors.push({text: "CEP inválido"})

    }

    if (req.body.cep.length < 8) {

        errors.push( { text: "O CEP é muito pequeno" } )

    }

    if (!req.body.street || typeof req.body.street == undefined || req.body.street == null) {

        errors.push( { text: "Rua inválida" } )

    }

    if (!req.body.district || typeof req.body.district  == undefined || req.body.district == null) {

        errors.push( {text: "Bairro inválida"} )

    }

    if (!req.body.number || typeof req.body.number  == undefined || req.body.number == null) {

        errors.push( {text: "Número inválido"} )

    }

    if (!req.body.city || typeof req.body.city  == undefined || req.body.city == null) {

        errors.push( {text: "Cidade inválida"} )

    }

    if (!req.body.state || typeof req.body.state  == undefined || req.body.state == null) {

        errors.push( {text: "Estado inválido"} )

    }

    if (errors.length > 0) {

        res.render("admin/client/index", { errors: errors } )

    } else {

        const newClientAddress = {

            cep:           req.body.cep,
            street:        req.body.street,
            district:      req.body.district,
            number:        req.body.number,
            complement:    req.body.complement,
            city:          req.body.city,
            state:         req.body.state,
            sourceClient:  req.body.id
        }
        // concate address and search on api google
        var location = 
        req.body.street + ' ' +
        req.body.district + ' ' +
        req.body.number + ' ' +
        req.body.complement + ' ' +
        req.body.city + ' ' +
        req.body.state + ' ' +
        req.body.cep 
    
        axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
            address:location,
            key:'AIzaSyBdta5MVGzl9iMQFvelogCTiONPGTwt5Nk'
            }
        })
        .then(function(response) {
        // Log full response
        console.log(response)
            const lat = response.data.results[0].geometry.location.lat;
            const lng = response.data.results[0].geometry.location.lng;
            newClientAddress.latitude = lat
            newClientAddress.longitude = lng

            new ClientAddress(newClientAddress).save().then(() => {

                console.log(newClientAddress)

                Client.findOne( {_id: req.body.id} ).then((client) => {
                    
                    client.address = newClientAddress._id
                    console.log(client)

                    client.save().then(() => {
        
                        req.flash("success_msg", "Endereço do cliente criado com sucesso!")
                        res.redirect("/admin/client")
        
                    }).catch((error) => {
        
                        req.flash("error_msg", "Erro interno")
                        res.redirect("/admin/client")
        
                    })
        
                }).catch((error) =>{
        
                        req.flash("error_msg", "Houve um erro ao encontrar cliente")
                        res.redirect("/admin/client")
        
                    })
    
            }).catch((error) => {
    
                req.flash("error_msg", "Houve um erro ao salvar endereço do cliente!")
                res.redirect("/admin/client")
    
            })

        }).catch((error) => {

            console.log(error);
            req.flash("error_msg", "Houve um erro ao encontrar coordenadas do endereço!")
            res.redirect("/admin/client")

        })
        
    }

})

router.get("/client/address/edit/:id", (req, res) => {

    ClientAddress.findOne( {_id: req.params.id} ).then((clientaddress) => {

        res.render("admin/client/address/editclientaddress", {clientaddress: clientaddress} )

    }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
        res.redirect("/admin/client")

    })

 })


router.post("/client/address/edit", (req, res) => {

    var errors =[]
 
    if (!req.body.cep || typeof req.body.cep  == undefined || req.body.cep == null) {
       
        errors.push({text: "CEP inválido"})

    }

    if (req.body.cep.length < 8) {

        errors.push( { text: "O CEP é muito pequeno" } )

    }

    if (!req.body.street || typeof req.body.street == undefined || req.body.street == null) {

        errors.push( { text: "Rua inválida" } )

    }

    if (!req.body.district || typeof req.body.district  == undefined || req.body.district == null) {

        errors.push( {text: "Bairro inválida"} )

    }

    if (!req.body.number || typeof req.body.number  == undefined || req.body.number == null) {

        errors.push( {text: "Número inválido"} )

    }

    if (!req.body.city || typeof req.body.city  == undefined || req.body.city == null) {

        errors.push( {text: "Cidade inválida"} )

    }

    if (!req.body.state || typeof req.body.state  == undefined || req.body.state == null) {

        errors.push( {text: "Estado inválido"} )

    }

    if (errors.length > 0) {

        res.render("admin/client/index", { errors: errors } )

    } else {

        ClientAddress.findOne( {_id: req.body.id} ).then((clientAddress) => {

            clientAddress.cep           = req.body.cep,
            clientAddress.street        = req.body.street,
            clientAddress.district      = req.body.district,
            clientAddress.number        = req.body.number,
            clientAddress.complement    = req.body.complement,
            clientAddress.city          = req.body.city,
            clientAddress.state         = req.body.state,
            clientAddress.clientSource  = req.body.clientSource 
        
        // concate address and search on api google
        var location = 
        req.body.street + ' ' +
        req.body.district + ' ' +
        req.body.number + ' ' +
        req.body.complement + ' ' +
        req.body.city + ' ' +
        req.body.state + ' ' +
        req.body.cep 
    
        axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
            params:{
                address:location,
                key:'AIzaSyBdta5MVGzl9iMQFvelogCTiONPGTwt5Nk'
            }
        })
        .then(function(response) {
        //    Latitude longitude for function axios
            const lat = response.data.results[0].geometry.location.lat;
            const lng = response.data.results[0].geometry.location.lng;
            clientAddress.latitude = lat
            clientAddress.longitude = lng

            new ClientAddress(clientAddress).save().then(() => {

                console.log(clientAddress)

                Client.findOne( {_id: clientAddress.sourceClient} ).then((client) => {
                    
                    client.address = clientAddress._id
                    console.log(client)

                    client.save().then(() => {
        
                        req.flash("success_msg", "Endereço do cliente criado com sucesso!")
                        res.redirect("/admin/client")
        
                    }).catch((error) => {
        
                        req.flash("error_msg", "Erro interno")
                        res.redirect("/admin/client")
        
                    })
        
                }).catch((error) =>{
        
                    req.flash("error_msg", "Houve um erro ao encontrar cliente")
                    res.redirect("/admin/client")
        
                })
    
            }).catch((error) => {
    
                req.flash("error_msg", "Houve um erro ao salvar endereço do cliente!")
                res.redirect("/admin/client")
    
            })

            }).catch((error) => {

                console.log(error);
                req.flash("error_msg", "Houve um erro ao encontrar coordenadas do endereço!")
                res.redirect("/admin/client")

            })
        
        })

    }

})

router.get("/client/data/:id", (req, res) => {

    Client.findOne( {_id: req.params.id} ).then((client) => { 

        ClientAddress.findOne( {sourceClient: client.id} ).then((address) => {

            res.render("admin/client/dataclient", {client: client, address: address} )
    
        }).catch((error) => {

            req.flash("error_msg", "Houve um erro ao encontrar endereço do cliente")
            res.redirect("/")

        }) 

    }).catch((error) => {

        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")

    })

})

// router.get("/sundatabase", (req, res) => {

//     res.render("admin/database/index" )

// })


router.get("/client/energybill/add/", (req, res) => {

    res.render("admin/client/energybill/addclientenergybill" )

})

router.get("/client/calculate/modules/", (req, res) => {

    res.render("admin/client/energybill/calculatemodules" )

})



router.post("/client/energybill/add/", (req,res) => {



})

module.exports = router



