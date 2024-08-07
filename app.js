const express = require('express');  //Express Application
const mongoose = require('mongoose');  //Use mongoose to connect to the database

const app = express();  //Instance of Express Application

mongoose.connect('mongodb+srv://test:test@cluster0.vkjnqsh.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0')
const db = mongoose.connection;    //To store the mongoose connection to the variable

db.on('error', console.error.bind(console, 'MongoDB Connection Error'));   //Error message


const userSchema = new mongoose.Schema({
    name : String,
    age : Number,
    email : String
})

const User = mongoose.model('User', userSchema);   //Creating user model using schema

app.use(express.json());  //to use Json data

//USER CRUD
//Get All Users
app.get('/user', async (req,res)=>{   //Get all users  //async : when we use await write async here
    try{
        const users = await User.find();   //await :  wait till all data is fetched
        res.send(users);
    }catch(error){
        res.status(500).send(error);  //(500) is internal server error and sending error message written in db.on line 9
    }
})

//Get User by Id
app.get('/user/:id', async (req,res)=>{   //Get user by id  
    try{
        const user = await User.findById(req.params.id);   
        if(!user){
            return res.status(404).send('User not found');  //If user not found this error will thrown
        }
        res.send(user);
    }catch(error){
        res.status(500).send(error);  
    }
})

//Delete User by Id
app.delete('/user/:id', async (req,res)=>{   //Get user by id and delete 
    try{
        const user = await User.findByIdAndDelete(req.params.id);   
        if(!user){
            return res.status(404).send('User not found');  //If user not found this error will thrown
        }
        res.send(user); //Returns the deleted user
        //res.send('User has been deleted');
    }catch(error){
        res.status(500).send(error);  
    }
})

//Update the user by Id
app.put('/user/:id', async (req,res)=>{   //Get user by id and delete 
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true});   //req.body will return old user but {new:true} will return updated user
        if(!user){
            return res.status(404).send('User not found');  //If user not found this error will thrown
        }
        res.send(user); //Returns the deleted user
        //res.send('User has been deleted');
    }catch(error){
        res.status(500).send(error);  
    }
})

//Post request to create a new user
app.post('/user', async (req,res)=>{   //Get user by id  
    try{
        const user = new User(req.body);   //Creating new user in the body --> raw
        await user.save();   //Saving new user in the database
        res.send(user);
    }catch(error){
        res.status(500).send(error);  
    }
})


const PORT = 3005;  //Express Application is running on PORT 3000
app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})