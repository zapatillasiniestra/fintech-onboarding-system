const pool=require("../db/db.js");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const SECRET="super-secret-key";

async function register(req,res){
  try{
    const{email,password}=req.body;

    if(!email||!password){
      return res.status(400).json({error:"email and password are required"});
    }

    const existing=await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if(existing.rows.length>0){
      return res.status(409).json({error:"email already exists"});
    }

    const hashedPassword=await bcrypt.hash(password,10);

    const result=await pool.query(
      "INSERT INTO users (email,password) VALUES ($1,$2) RETURNING id,email",
      [email,hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  }catch(err){
    console.log("server error:",err);
    res.status(500).json({error:"server error"});
  }
}

async function login(req,res){
  try{
    const{email,password}=req.body;

    if(!email||!password){
      return res.status(400).json({error:"email and password are required"});
    }

    const result=await pool.query(
      "SELECT id,email,password,role FROM users WHERE email=$1",
      [email]
    );

    const user=result.rows[0];

    if(!user){
      return res.status(401).json({error:"invalid credentials"});
    }

    const valid=await bcrypt.compare(password,user.password);

    if(!valid){
      return res.status(401).json({error:"invalid credentials"});
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      "super-secret-key",
      { expiresIn: "1d" }
    );
    res.json({token});
  }catch(err){
    console.error("LOGIN ERROR:", err);
    res.status(500).json({error:"server error"});
  }
}

module.exports={register,login};