require("dotenv").config();
const pool=require("../db/db.js");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const authService=require("../services/auth.service");

async function register(req,res,next){
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
  }catch(err) {
    next(err);
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

    const accessToken = jwt.sign(
      {
        userId:user.id,
        email:user.email,
        role:user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn:"15m"
      }
    );

    const refreshToken = jwt.sign(
      {
        userId:user.id
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn:"7d"
      }
    );    
    res.json({accessToken, refreshToken}); 
  } catch(err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {

    const { refreshToken } = req.body;

    const tokens =
      await authService.refresh(refreshToken);

    res.json(tokens);

  } catch(err) {
    next(err);
  }
}

module.exports={
  register,
  login,
  refresh
};