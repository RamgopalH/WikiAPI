const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app = express();
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const ArticleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', ArticleSchema);

app.route('/articles').get((req, res)=> {
    Article.find((err, articles)=> {
        if(err) res.send(err)
        else res.send(articles);
    });
}).post((req, res)=> {
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });

    article.save((err, savedArticle)=> {
        if(err) res.send(err);
        else res.send(savedArticle);
    })
}).delete((req, res)=> {
    Article.deleteMany({}, (err)=> {
        if(err) res.send(err);
        else res.send("Successfully Deleted all Articles");
    });
});

app.route('/article/:articleTitle')
.get((req, res)=> {
    Article.findOne({ title: req.params.articleTitle }, (err, article)=> {
        if(err) res.send(err);
        else if(!article) res.send("No articles found with that title");
        else res.send(article);
    });
}).put((req, res)=> {
    Article.updateOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, {overwrite:true}, (err)=> {
        if(err) res.send(err);
        else res.send("Updated");
    });
}).patch((req, res)=> {
    Article.updateOne({ title: req.params.articleTitle }, {$set: req.body}, (err, updated)=> {
        if(err) res.send(err);
        else res.send(updated);
    });
}).delete((req, res)=> {
    Article.deleteOne({title: req.params.title }, (err)=> {
        if(err) res.send(err);
        else res.send("Deleted");
    });
});

app.listen(3000, ()=> {
    console.log('Bruh');
});