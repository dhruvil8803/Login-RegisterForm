const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose');
const { json } = require('express');
mongoose.connect("mongodb://localhost:27017/LoginData")
.then(()=>{
    console.log("Connection SuccessFull");
})
.catch((err)=>{
    console.log("there is some error while conneting to server");
})
const Schema  = new mongoose.Schema({
    name:{
        type: String,
        minlength: 2,
        maxlength: 30
    },
    sirname:{
        type: String
    },
    userId:{
        type: String,
        unique: [true, 'There is a error'],
    },
    password:{
        type: String
    },
    age: {
        type: Number,
        validate(value){
            if(value <= 0 || value > 150){
                throw new Error('Enter Valid Date');
            }
        }
    }
});
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const model = new mongoose.model('myData', Schema);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'partials'));
app.use(express.static(path.join(__dirname, 'views')));
app.get('/register', (req, res)=>{
    res.render('register');
})
app.get('/login', (req, res)=>{
    res.render('login');
})
app.get('/changepassword', (req, res)=>{
    res.render('changepassword');
})
app.get('/deleteaccount', (req, res)=>{
    res.render('deleteaccount');
})
app.post('/add', (req, res)=>{
    const data = req.body;
        const addData = async ()=>{
     const document = await new model({
         name: data.name,
         sirname:data.sirname,
         userId: data.userid,
         password: data.password,
         age: data.age
     });
     try{
        await document.save();
        res.send('<h1>Login SuccessFull</h1>')
        }
    catch(err){
        res.send('This user id is already registerd or age might be wrong or something went wrong');
    }
}
        addData();
})

app.post('/get', (req, res)=>{
     const getData = async ()=>{
         try{
         const result = await model.find({userId: req.body.userid});
         if(result[0].password == req.body.password){
          res.send('Login SuccessFull');
         }
         else{
             res.send('Wrong Password Try again');
         }
         }
         catch(err){
             res.send("No such userId exists login and enter again");
         }
     }
    getData();
})
app.post('/update', (req, res)=>{
    const updateData = async ()=>{
        try{
        const result = await model.find({userId: req.body.userid});
        if(result[0].password == req.body.password){
         await model.updateOne({userId: req.body.userid}, {
             $set:{
                 password: req.body.newPassword
             }
         })
         res.send('Password Updated');
        }
        else{
            res.send('Invalid initial password enter again');
        }
        }
        catch(err){
            res.send("No such userId exists login and enter again");
        }
    }
   updateData();
})


app.post('/delete', (req, res)=>{
    const getData = async ()=>{
        try{
        const result = await model.find({userId: req.body.userid});
        if(result[0].password == req.body.password){
            await model.deleteOne({useId: req.body.userid});
          res.send('Deletion of your account successfull');
        }
        else{
            res.send('Wrong Password Try again');
        }
        }
        catch(err){
            res.send("No such userId exists login and enter again");
        }
    }
   getData();
})

app.listen(8000, ()=>{
    console.log('Listening to server 8000');
})