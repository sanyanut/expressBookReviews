const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const bookList = await books; //await for bookList is just a mock representation of data that should be delivered from db 
    res.send(bookList).status(200)
  } catch(error) {
    res.send(error).status(404)
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const booksList = await books;
    const isbnCode = req.params.isbn;
    res.send(booksList[isbnCode])
  } catch(error) {
    res.send(error).status(404)
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const bookList = await books;
    const authorName = req.params.author;
    let booksByAuthor = []

    for(let item in books) {
      if(bookList[item].author === authorName) {
        booksByAuthor.push(bookList[item])
      }
    }
    res.send(booksByAuthor)
  } catch(error) {
    res.send(error).status(404)
  }

});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  //Write your code here
  try {
    const bookList = await books;
    const titleName = req.params.title;
    let booksByTitle = []

    for(let item in books) {
      if(bookList[item].title === titleName) {
        booksByTitle.push(bookList[item])
      }
    }
    res.send(booksByTitle)
  } catch(error) {
    res.send(error).status(404)
  }
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const bookList = await books;
    const isbnCode = req.params.isbn;

    if(isbnCode) {
      res.send(bookList[isbnCode].reviews)
    }
  } catch(error) {
    res.send(error).status(404)
  }
});

module.exports.general = public_users;
