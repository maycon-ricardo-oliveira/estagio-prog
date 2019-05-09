if (process.env.NODE_ENV == "production") {
    
    module.exports = {mongoURI: "mongodb+srv://prod:prodblogtesteagr@cluster0-hnfvt.mongodb.net/test?retryWrites=true"}
                                
} else {
    
    module.exports = {mongoURI: "mongodb://localhost/tcc"}
    
}
