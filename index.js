const { log, time } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const { type } = require("os");
const path = require("path");
const methodOverride = require("method-override");
const app = express();

const Schema = mongoose.Schema({
    destination : {
        type: String,
        required: true,
    },
    time : {
        type:String,
        required: true
    },
    bnumber :{
        type: Number,
        required: true
    },
    status : {
        type: String,
        required: true,
        enum:["Waiting", "Departed"]
    }
})

const Model = mongoose.model('Bus-Schedule', Schema);
const MONGODB_URL = "mongodb+srv://chetankshirsagar:chetan%40123@cluster0.vnrtb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connection = async() => {
    await mongoose.connect(MONGODB_URL);
}
connection()
    .then(()=>{
        console.log("Connected to the Database");
    })
    .catch((err)=>{
    console.log("Error connecting to the Database");
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'))


app.post('/addBus', async(req, res) => {
     let {destination , time , bnumber , status} = req.body;
    //  console.log(destination,time,bnumber,status);
     await Model.insertOne({destination , time , bnumber , status})
         .then(()=>{
             res.redirect("/");
             console.log("Successfully inserted");
         })
         .catch((err)=>{
             res.send("Error adding to the Database");
        console.log(err);
    })
})

app.get('/', async(req, res) => {
    let allSchedules = await Model.find({});
    res.render("index",{schedules : allSchedules});
});

app.get("/addBus",(req,res)=>{
    res.render("addBusForm");
});

app.get("/update/:id",async(req,res)=>{
    let {id} = req.params;
    const busEntry = await Model.find({_id:id});
    // console.log(busEntry);
    res.render("updateForm",{bus : busEntry});
});

app.put("/update/:id", async(req,res)=>{
   const {id} = req.params;
   const {destination , time, bnumber, status} = req.body;
   const bus = await Model.findByIdAndUpdate(id,{destination,time,bnumber,status});
   console.log(bus);
   res.redirect("/");
});

app.delete("/delete/:id", async (req,res)=>{
    const {id} = req.params;
    await Model.findByIdAndDelete(id);
    res.redirect("/");
})

app.listen(3002,(req,res)=>{
    console.log('Server started on port 3002');
})
