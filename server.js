'use strict';

const express=require('express');
const superagent=require('superagent');
const app = express();
const PORT = process.env.PORT||3000;

require('dotenv').config()


app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.post('/searches',createSearch);
app.listen(PORT,function(){
    console.log(`server running at ${PORT}`);
  });
  

function Book(info){
    this.title = info.title;
    this.author = info.author;
    this.isbn = info.isbn;
    this.image_url = info.image_url;
    this.description = info.description;
    this.bookshelf = info.bookshelf;
  }

  function createSearch(req,res){
    // console.log(req.body.search);
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  
    if (req.body.search[1]==='title'){url += `+intitle:${req.body.search[0]}`;}
    if (req.body.search[1]==='author'){url += `+inauthor:${req.body.search[0]}`;}
    superagent.get(url)
      .then(apiRes=>{
        console.log(apiRes.body.items);
        return apiRes.body.items.map(bookResult=>new Book(bookResult.volumeInfo));
    })
      .then(results=>{
        console.log(results);
          res.render('pages/index.ejs',{items: results})
  
      }).catch(() => res.render('pages/error'));
  }
  
  function handleError(err, res){
    res.render('pages/error');
  }
  