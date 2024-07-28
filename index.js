const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const users = require('./MOCK_DATA.json');
const fs = require("fs");
const app = express();

app.use(express.urlencoded({ extended:false }))

app.get("/",(req,res)=> {
    return res.send("This is a Home Page🚀!");
})
app.get("/users",(req,res)=> {
    const html = 
    `<ul>
        ${users.map((user)=> (
            `<li>
                ID: ${user.id}<br>
                First Name: ${user.first_name}<br>
                Gender: ${user.gender}<br>
                Email: ${user.email}<br>
                <hr>
            </li>`
        )).join("")}
    </ul>`;
    return res.send(html);
})


//API ROUTES

app.route("/api/users")
.get((req, res)=>{
    return res.json(users);
})
.post((req, res)=>{
    const body = req.body;
    const newUser = {id: users.length+1, ...body};
    users.push(newUser);
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=>{
        return res.json({ status:"Success", id: users.length });
    });
})


app.route("/api/users/:id").get((req, res)=>{
    const id = Number(req.params.id);
    if(isNaN(id)) return res.status(400).send({msg: "ID must be a number."});
    const user = users.find((user)=> user.id === id);
    if(!user) return res.status(404).send({msg: "404 User Not Found."});

    return res.send(user);
})
.delete((req, res)=>{
    const id = Number(req.params.id);
    if(isNaN(id)) return res.status(400).send({msg: "ID must be a number."});
    const userIdx = users.findIndex((user)=> user.id === id);
    if(!userIdx) return res.status(404).send({msg: "404 User Not Found."});
    
    const delUser = users.splice(userIdx);
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=>{
        return res.json({status: "User successfully deleted", delUser});
    })
})
.patch((req, res)=>{
    const id = Number(req.params.id);
    const body = req.body;

    if(isNaN(id)) return res.status(400).send({msg: "ID must be a number."});
    const userIdx = users.findIndex((user)=> user.id === id);
    if(!userIdx) return res.status(404).send({msg: "404 User Not Found."});
    
    users[userIdx] = {...users[userIdx], ...body}
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=> {
        return res.json({status:"User Updated Successfully.", userIdx})
    })
})

try {
    app.listen(PORT, (req, res)=> {
        console.log(`Server running at port: ${PORT}`);
    })
} catch (err) {
    console.log("Server Connection Error=> ",err);
}
