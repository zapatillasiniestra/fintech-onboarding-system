require("dotenv").config();
const pool=require("../db/db.js");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

async function register(req,res){
  try{
    const {
      registerSchema
    } = require("../validators/auth.validator");

    const data =
    registerSchema.parse(req.body);

    const { email, password } = data;

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

async function login(req, res, next){
  try{
    const {
      loginSchema
    } = require("../validators/auth.validator");

    const data =
    loginSchema.parse(req.body);

    const { email, password } = data;

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
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({token});
  } catch(err) {
    next(err);
  }
}

module.exports={
  register,
  login
};