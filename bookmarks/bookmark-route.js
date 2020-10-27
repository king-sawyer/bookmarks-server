const express = require('express');
const logger = require('../logger');


const {v4: uuid} = require('uuid')

const bookmarkRouter = express.Router();
const bodyParser = express.json();
const {bookmarks,resetBookmarks} = require('../store');

bookmarkRouter
.route('/bookmarks')
.get((req,res) =>{
    res.json(bookmarks)
})
.post(bodyParser, (req,res) =>{

    const {title, url, rating, description} = req.body;
    if(!title){
        logger.error('Title is required')
        return res.status(400)
        .send('Please include a title for your bookmark!')
    }
    if(!url){
        logger.error('url is required')
        return res.status(400)
        .send('Please include a url for your bookmark!')
    }

    const id = uuid()

    const bookmark = {
        id,
        title,
        url,
        rating,
        description
    };

    bookmarks.push(bookmark)
    logger.info(`Bookmark with id of ${id} and title of ${title} created`)
    res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json(bookmark)

})

bookmarkRouter
.route('/bookmarks/:id')
.get((req,res) =>{
    const {id} = req.params;
    const bookmark = bookmarks.find(mark => mark.id == id)

    if(!bookmark){
        logger.error(`Card with id ${id} not found`)
        return res.status(404).send('Bookmark not found')
    }
    res.json(bookmark)
})
.delete((req,res)=>{
    const {id} = req.params;
    const bookmarkIndex = bookmarks.findIndex(b => b.id==id)

    if(bookmarkIndex=== -1){
        logger.error(`Card with id ${id} not found`)
        return res.status(404).send('Not found')
    }

    bookmarks.splice(bookmarkIndex,1);


    logger.info(`Bookmark with id ${id} deleted`)

    res.status(204).end()


    
})


module.exports = bookmarkRouter