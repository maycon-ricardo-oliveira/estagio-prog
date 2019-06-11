if (process.env.NODE_ENV == "production") {
    
    module.exports = {mongoURI: "mongodb+srv://esf-system-prod:Q8cjMPobIbZQpcYd@cluster0-hnfvt.mongodb.net/esf-system?retryWrites=true"}
                                
} else {
    
    module.exports = {mongoURI: "mongodb://localhost/tcc"}
    
}
