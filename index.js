const express = require('express')
const app = express();
const mongoose = require('mongoose')
const Post = require('./schemas/post')
const User = require('./schemas/user')
const Comment = require('./schemas/comment')

const mongoDb = 'mongodb://127.0.0.1/mongoose-codealong'
mongoose.connect(mongoDb, {useNewUrlParser: true})
const db = mongoose.connection

// sends a message when we create a connection
db.once('open', () => {
    console.log(`connected to mongodb at ${db.host}:${db.port}`)
})

// sends a message when we have an error
db.on('error', (error) => {
    console.log('Database Error: ', error)
})

app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.json({
        message: "Welcome to our API!"
    })
})

app.get('/users', (req, res) => {
    User.find({})
    .then(users => {
        console.log('All users', users);
        res.json({ users: users });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

// app.get('/findAll', (req, res) => {
//     // .find should have 2 params
//     User.find({}, (err, users) => {
//         if (err) res.send(`Failed to find record, mongodb error ${err}`)
//         res.send(users)
//     })
// })

// app.get('/findById/:id', (req,res) => {
//     User.findById(req.params.id, (err, users) => {
//         if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
//         res.send(users);
//     })

//     //find by Id without the findByID command, not ideal
//     // User.find({_id: mongoose.Types.ObjectId(Objreq.params.id)}, (err, users) => {
//     //     if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
//     //     res.send(users);
//     // })
// })

// app.get('/users/:email', (req,res) => {
//     User.findOne({email: req.params.email}, (err, users) => {
//         if (err) res.send(`Failed to find record by email, mongodb error ${err}`);
//         res.send(users);
//     })
// })

app.get('/users/:email', (req, res) => {
    console.log('find user by', req.params.email)
    User.findOne({
        email: req.params.email
    })
    .then(user => {
        console.log('Here is the user', user.name);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

app.post('/users', (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        meta: {
            age: req.body.age,
            website: req.body.website
        }
    })
    .then(user => {
        console.log('New user =>>', user);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

app.put('/users/:email', (req, res) => {
    console.log('route is being on PUT')
    User.findOne({ email: req.params.email })
    .then(foundUser => {
        console.log('User found', foundUser);
        User.findOneAndUpdate({ email: req.params.email }, 
        { 
            name: req.body.name ? req.body.name : foundUser.name,
            email: req.body.email ? req.body.email : foundUser.email,
            meta: {
                age: req.body.age ? req.body.age : foundUser.age,
                website: req.body.website ? req.body.website : foundUser.website
            }
        })
        .then(user => {
            console.log('User was updated', user);
            res.redirect(`/users/${req.params.email}`)
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});

app.delete('/users/:email', (req, res) => {
    User.findOneAndRemove({ email: req.params.email })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.email} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

 // ================ POSTS ROUTES ========================

 app.get('/posts', (req, res) => {
    Post.find()
    .then(posts => {
        console.log('All posts', posts);
        res.json({ posts: posts });
    })
    .catch(error => { 
        console.log('error', error) 
    });
});

app.get('/posts/:id', (req,res) => {
    Post.findById(req.params.id)
    .then(posts => {
        console.log('This post', posts);
        res.json({ posts: posts });
    })
    .catch(error => { 
        console.log('error >>>>>>', error) 
    });
});

app.post('/posts', (req, res) => {
    Post.create({
        title: req.body.title,
        body: req.body.body,
    })
    .then(post => {
        console.log('New post =>>', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

app.put('/posts/:id', (req, res) => {
    console.log('route is being on PUT')
    Post.findById(req.params.id)
    .then(foundPost => {
        console.log('Post found', foundPost);
        console.log('ID CHECK', req.params.id);
        // Post.findByIdAndUpdate(req.params.id)
        Post.findOneAndUpdate({ _id: req.params.id }, 
        { 
            title: req.body.title ? req.body.title : foundPost.title,
            body: req.body.body ? req.body.body : foundPost.body,
        })
        .then(post => {
            console.log('ID CHECK 2', req.params.id);
            console.log('Post was updated', post);
            res.redirect(`/posts/${req.params.id}`)
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});

app.delete('/posts/:id', (req, res) => {
    User.findOneAndRemove({ _id: req.params.id })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.id} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});


// ================ COMMENTS ROUTES ========================

app.get('/comments', (req, res) => {
    Comment.find({})
    .then(comments => {
        console.log('All comments', comments);
        res.json({ comments: comments });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    });
});

app.get('/comments/:id', (req, res) => {
    console.log('find comment by', req.params.id)
    Comment.findById(req.params.id)
        .then(comment => {
            res.json({ comment: comment });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
});

app.get('/posts/:id/comments', (req, res) => {
    Post.findById(req.params.id).populate('comments').exec()
    .then(post => {
        console.log('here is the post', post)
        res.json({ post:post })
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

app.post('/posts/:id/comments', (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
        console.log('Heyyy, this is the post', post);
        // create and pust comment inside of post
        Comment.create({
            header: req.body.header,
            content: req.body.content
        })
        .then(comment => {
            post.comments.push(comment);
            // save the post
            post.save();
            res.redirect(`/posts/${req.params.id}`);
        })
        .catch(error => { 
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

app.put('/comments/:id', (req, res) => {
    console.log('route is being on PUT')
    Comment.findById(req.params.id)
        .then(foundComment => {
            console.log('Comment found', foundComment);
            Comment.findByIdAndUpdate(req.params.id,
                {
                    header: req.body.header ? req.body.header : foundComment.header,
                    content: req.body.content ? req.body.content : foundComment.content,
                })
                .then(comment => {
                    console.log('Comment was updated', comment);
                    res.redirect(`/comments/${req.params.id}`)
                })
                .catch(error => {
                    console.log('error', error)
                    res.json({ message: "Error ocurred, please try again" })
                })
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" })
        })

});

app.delete('/comments/:id', (req, res) => {
    Comment.findByIdAndRemove(req.params.id)
        .then(response => {
            console.log('This was delete', response);
            res.json({ message: `${req.params.id} was deleted` });
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" });
        })
});



// app.get('/', (req, res) => {

//     const user = new User({
//         name: 'Amy',
//         email: 'bobbsd@gmail.com',
//         meta: {
//             age: 24,
//             website: 'https://bobby.me'
//         }
//     })
    
//     user.save((error) => {
//         if (error) return console.log(error)
//         console.log('User Created')
//     })

//     res.send(user.sayHello())
// })

// User.create({
//     name: 'created using Create()',
//     email: 'Tester2@gmail.com'
// })

// const newUser = new User({
//     name: 'created using User and Save',
//     email: 'Tester3@gmail.com'
// })

// newUser.save((err) => {
//     if (err) return console.log(err)
//     console.log('created new user')
// })

// creates a new JSON document in the table 
// Post.create({
//     content: 'this is post content...again!'
// })

// Mongoose Update Statements
// User.updateOne({name: 'Amy'}, {
//     meta: {
//         age: 22
//     }
// }, (err, updatedOutcome) => {
//     if (err) return console.log(err, updatedOutcome)
//     console.log(`Updated user: ${updatedOutcome} : ${updatedOutcome.matchedCount} : ${updatedOutcome.modifiedCount}`)
// })

// User.findOneAndUpdate({name: 'Amy'},{
//     meta: {
//         age: 32,
//         website: "whowhowhow.com"
//     }
// }, (err, user) => {
//     if (err) return console.log(err, user)
//     console.log(`Updated user: ${user}`)
// })

// Mongoose Delete Statements
// User.remove({name: 'created using User and Save'}, (err) => {
//     if (err) return console.log(err)
//     return console.log(`user record deleted`)
// })

// User.findOneAndRemove({name: 'Chris'},(err, user) => {
//     if (err) return console.log(err, user)
//     console.log(`Updated user: ${user}`)
// })

// Post schema with association to comments
// const newPost = new Post({
//     title: 'Our first post',
//     body: 'Some body text for our post',
// })

// newPost.comments.push({
//     header: 'our first comment',
//     content: 'this is my comment text'
// })

// newPost.save(function(err){
//     if (err) return console.log(err)
//     console.log('Created post')
// })



// Post.findOne({title: 'our first post'}, (err, post) => {
//     if (err) console.log(err)
//     Post.findById(post._id).populate('comments').exec((err, post)=>{
//         if (err) console.log(err)
//         console.log(post)
//     })
// })

app.listen(3001, () => {
    console.log("You're now listening to the smooth sounds of port 3001")
})