require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('../logger')

const { NODE_ENV} = require('./config');
const { loggers } = require('winston');
const bookmarkRouter = require('../bookmarks/bookmark-route');

const app =express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common;';

app.use(morgan(morganOption));
app.use(cors());
app.use (helmet());
app.use(express.json())

app.use(function validateBearerToken(req,res,next){
    const apiToken = process.env.API_TOKEN;
    const bearerToken = req.get('Authorization');

    if(!bearerToken || apiToken !== bearerToken.split(' ')[1]){
        logger.error(`Unauthorized request to path: ${req.path}`)
        return res.status(401).json({message: "Unauthorized Request"})
    }


    next()
})




app.use(bookmarkRouter)




app.get('/', (req,res) => {
    res.send("Hello, world!");
});

app.use(function errorHandler(error,req,res,next){
    let response;
    if(NODE_ENV==='product'){
        response = {error: { message: 'server error'}}
    }else{
        console.error(error);
        response= { message: error.message, error}
    }
    res.status(500).json(response)
});


module.exports = app;