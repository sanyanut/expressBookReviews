const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbnCode = req.params.isbn;
  const review = req.body.review;
  const book = books[isbnCode]
  const currentUser = req.session.authorization.username;
  const reviews = book.reviews;
 
  const isReviewByCurrentUser = (value) => {
    return reviews.some(el => {
      return el.username === value
    })
  }
    if(isReviewByCurrentUser(currentUser)) {
      const index = reviews.findIndex(item => item.username === currentUser)
      reviews[index].review = review
      res.status(200).send(reviews)
    } else {
      reviews.push({username: currentUser, review})
      res.status(200).send(reviews)
    }
  
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbnCode = req.params.isbn;
  const book = books[isbnCode];
  const currentUser = req.session.authorization.username;

  try { 
    book.reviews = book.reviews.filter(item => item.username !== currentUser)
    res.status(204)
  } catch(error) {
    return res.status(404).json({message: "Failed to delete"});
  }
});
 
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.doesExist = doesExist;
module.exports.users = users;
