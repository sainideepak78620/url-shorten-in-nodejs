const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shorturl');
const app = express();

mongoose.connect('mongodb://localhost/urlshortener',{ useUnifiedTopology:true
});
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));

app.get("/",async (req,res)=>{
    const shorturls = await ShortUrl.find();
    res.render("index", {shorturls: shorturls});
});

app.post("/shorturls",async(req,res)=>{
    await ShortUrl.create({
        full:req.body.fullurl
    });
    res.redirect('/');
});

app.get('/:shorturl', async (req,res)=>{
    console.log(req.params.shorturl);
    const data = await ShortUrl.findOne({short: req.params.shorturl});

    if(data == null){
        return res.sendStatus(404);
    }
    data.clicks++;
    data.save();

    res.redirect(data.full);
    
});

app.listen(5000);