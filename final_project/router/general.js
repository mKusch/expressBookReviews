const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {

    const username = req.body.username
    const password = req.body.password
    

    if (!username) {
        res.status(500).send("ERROR: No username was provided!")    
    }

    if (!password) {
        res.status(500).send("ERROR: No password provided for user "+ username)    
    }

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        res.status(500).send("ERROR: The user " + (req.body.username) + " already exists!")    
    }
    
    users.push({"username": username,"password": password});

    res.send("The user " + (req.body.username) + " Has been added!")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  //Write your code here
  return res.send(books.filter(book => book.isbn == isbn))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    return res.send(books.filter(book => book.author == author))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    return res.send(books.filter(book => book.title == title))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    const book = books.filter(book => book.isbn == isbn)

    return res.send("Review for Book with ISBN "+ isbn +":\n"+ JSON.stringify(book[0].reviews))
});

module.exports.general = public_users;
