const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {    
    const user = req.body.user;

    if (!user) {
        return res.status(404).json({message: "ERROR: No user to login"});
    }
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 30 * 60 });
      req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User "+ user.username +" successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if(req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token
        jwt.verify(token, "access",(err,user)=>{
            if(!err){

                const isbn = req.params.isbn;
            
                const book = books.filter(book => book.isbn == isbn);

                const reviewExists = book[0].reviews.find(review => review.user === user.data.username);
                if (reviewExists) {
                    console.dir('existiert')
                    console.dir(reviewExists)
                    reviewExists.text = req.body.review;
                    return res.send("The existing Review of user "+ user.data.username +"for this Book has been modified:\n"+ JSON.stringify(book))
                }
                
                book[0].reviews.push({
                    "user": user.data.username,
                    "text": req.body.review
                })
            
                return res.send("Review for Book with ISBN added:\n"+ JSON.stringify(book))
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
});



// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    if(req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token
        jwt.verify(token, "access",(err,user)=>{
            if(!err){

                const isbn = req.params.isbn;
            
                const book = books.filter(book => book.isbn == isbn);

                const reviewExists = book[0].reviews.find(review => review.user === user.data.username);
                if (reviewExists) {
                    console.dir('wird gelöscht')

                    book[0].reviews = book[0].reviews.filter(review => review.user !== reviewExists.user);

                    return res.send("The existing Review of user "+ user.data.username +"for this Book has been modified:\n"+ JSON.stringify(book))
                }
                
                book[0].reviews.push({
                    "user": user.data.username,
                    "text": req.body.review
                })
            
                return res.send("Review for Book with ISBN added:\n"+ JSON.stringify(book))
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
