const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Category")
const Category = mongoose.model("category")
require("../models/Post")
const Post = mongoose.model("post")
const {eAdmin}= require("../helpers/eAdmin")
const {eBlogger}= require("../helpers/eBlogger")
const format = require('date-format');

router.get('/', eAdmin, (req, res) => {

    res.render("admin/index")

})

router.get('/category', eAdmin, (req, res) => {

    Category.find().sort( {

        date:'desc'

    }).then((category) => {

        res.render("admin/category", {category: category})

    }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")

    })
})

router.get('/category/add', eAdmin, (req, res) => {

    res.render("admin/addcategory")

})

router.post('/category/new', eAdmin, (req, res) => {

    var errors = []

    if (!req.body.name || typeof req.body.name  == undefined || req.body.name == null) {

        errors.push({text: "Nome inválido"})

    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {

        errors.push({ text: "Slug inválido" })

    }

    if (req.body.name.length < 2) {

        errors.push({ text: "Nome da categoria é muito pequeno" })

    }

    if (errors.length > 0) {

        res.render("admin/addcategory", { errors: errors })

    } else {

        const newCategory = {

            name: req.body.name,
            slug: req.body.slug

        }

        new Category(newCategory).save().then(() => {

            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/category")

        }).catch((error) => {

            req.flash("error_msg", "Houve um erro ao salvar categoria, tente novamente!")
            res.redirect("/admin")

        })
    }
})

router.get("/category/edit/:id", eAdmin, (req, res) => {

    Category.findOne({_id:req.params.id}).then((category) => {

        res.render("admin/editcategory", {category: category})

    }).catch((error) => {

        req.flash("error_msg", "Esta categoria não existe!")
        res.redirect("/admin/category")

    })
})

router.post("/category/edit", eAdmin, (req, res) => {

    var errors = []

    if (!req.body.name || typeof req.body.name  == undefined || req.body.name == null) {

        errors.push({text: "Nome inválido"})

    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {

        errors.push({ text: "Slug inválido" })

    }

    if (req.body.name.length < 2) {

        errors.push({ text: "Nome da categoria é muito pequeno" })

    }

    if (errors.length > 0) {

        res.render("admin/addcategory", {

            errors: errors

        })

    } else {

            Category.findOne({_id: req.body.id}).then((category) => {
            category.name = req.body.name
            category.slug = req.body.slug

            category.save().then(() => {

                req.flash("success_msg", "Categoria editada com sucesso!")
                res.redirect("/admin/category")

            }).catch((error) => {

                req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria!")
                res.redirect("/admin/category")

            })

        }).catch((error) => {

            req.flash("error_msg", "Houve um erro ao editar a categoria!")
            res.redirect("/admin/category")

        })
    }
})

router.post("/category/delete", eAdmin, (req, res) => {

    Category.remove( {_id: req.body.id}).then(() => {

        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/category")

    }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao deletar categoria")
        res.redirect("/admin/category")

    })
})

router.get("/post", eAdmin, (req, res) => {

    Post.find().populate("category").sort( {date: "desc"} ).then((post) => {

        res.render("admin/post", {post: post} )

    }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/admin")

    })
})

router.get("/post/add", eAdmin, (req, res) => {

    Category.find().then((category) => {

        res.render("admin/addpost", {category: category})

    }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao carregar formulário!")
        res.redirect("/admin")

    })
})

router.post("/post/new", eAdmin, (req,  res) => {

    var errors =[]
    //Título
    if (!req.body.title || typeof req.body.title  == undefined || req.body.title == null) {
       
        errors.push({text: "Título inválido"})

    }

    if (req.body.title.length < 2) {

        errors.push({ text: "O título é muito pequeno" })
    }

    //Slug
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {

        errors.push({ text: "Slug inválido" })

    }

    //Descrição
    if (!req.body.description || typeof req.body.description  == undefined || req.body.description == null) {

        errors.push({text: "Descrição inválida"})

    }

    if (req.body.description.length < 2) {

        errors.push({ text: "A descrição é muito pequena" })
    }

    //Conteúdo
    if (!req.body.content || typeof req.body.content  == undefined || req.body.content == null) {

        errors.push({text: "Conteúdo inválido"})

    }

    if (req.body.description.length < 2) {

        errors.push({ text: "O conteúdoo é muito pequeno" })
    }

    //Categoria
    if ( req.body.category == "0") {

        errors.push({text: "Categoria inválida!"})

    }

    if (errors.length > 0) {

        res.render("admin/addpost", { errors: errors })

    } else {

        const newPost = {

            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category,
            slug: req.body.slug

        }

        new Post(newPost).save().then(() => {

            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/admin/post")

        }).catch((error) => {

            req.flash("error_msg", "houve um erro ao salvar postagem")
            res.redirect("/admin/post")

        })
    }
})


router.get("/post/edit/:id", eAdmin, (req,res) => {

    Post.findOne({_id: req.params.id}).then((post) => {

        Category.find().then((category) => {

            res.render("admin/editpost", {category: category, post: post})

        }).catch((error) => {

            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/post")

        })

    }).catch((error) => {

        req.flash("error_msg", "Houve um erro ao caarregar o formulário de edição")
        res.redirect("/admin/post")

    })

})


router.post("/post/edit", eAdmin, (req, res) => {

    var errors =[]
    //Título
    if (!req.body.title || typeof req.body.title  == undefined || req.body.title == null) {

        errors.push({text: "Título inválido"})

    }

    if (req.body.title.length < 2) {

        errors.push({ text: "O título é muito pequeno" })
    }

    //Slug
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {

        errors.push({ text: "Slug inválido" })

    }

    //Descrição
    if (!req.body.description || typeof req.body.description  == undefined || req.body.description == null) {

        errors.push({text: "Descrição inválida"})

    }

    if (req.body.description.length < 2) {

        errors.push({ text: "A descrição é muito pequena" })
    }

    //Conteúdo
    if (!req.body.content || typeof req.body.content  == undefined || req.body.content == null) {

        errors.push({text: "Conteúdo inválido"})

    }

    if (req.body.description.length < 2) {

        errors.push({ text: "O conteúdoo é muito pequeno" })

    }

    //Categoria
    if ( req.body.category == "0") {

        errors.push({text: "Categoria inválida!"})

    }

    if (errors.length > 0) {

        res.render("admin/addpost", { errors: errors })

    } else {

        Post.findOne({_id: req.body.id}).then((post) => {

            post.title = req.body.title
            post.description = req.body.description
            post.slug = req.body.slug
            post.content = req.body.content
            post.category = req.body.category

            post.save().then(() => {

                req.flash("success_msg", "Postagem editada com sucesso!")
                res.redirect("/admin/post")

            }).catch((error) =>{

                req.flash("error_msg", "Erro interno")
                res.redirect("/admin/post")

            })

        }).catch((error) =>{

                req.flash("error_msg", "Houve um erro ao salvar edição")
                res.redirect("/admin/post")

            })
        }
    })


router.get("/post/delete/:id", eAdmin, (req,res) => {

    Post.remove({_id: req.params.id}).then(() => {

        req.flash("success_msg", "Postagem deletada!")
        res.redirect("/admin/post")

    }).catch((error) =>{

        console.log(error)
        req.flash("error_msg", "Houve um erro ao deletar postagem")
        res.redirect("/admin/post")

    })
})

module.exports = router