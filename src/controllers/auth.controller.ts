import pool from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authRepository from "../repositories/auth.repository";
import authRefresh from "../services/auth.service";
import type { Request, Response, NextFunction } from "express";
import type { RegisterBody } from "../types/api";
import { registerSchema } from "../validators/auth.validator";
import {loginSchema} from "../validators/auth.validator";

async function register(
    req: Request<{}, {}, RegisterBody>,
    res: Response,
    next: NextFunction
  ) {

  try{
    const data = registerSchema.parse(req.body);
    const { email, password } = data;

    const existing = await pool.query(
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
    return next(err);
  }
}

async function login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

  try{
    const data = loginSchema.parse(req.body);
    const { email, password } = data;

    const result = await pool.query(
      "SELECT id,email,password,role FROM users WHERE email=$1",
      [email]
    );

    const user=result.rows[0];

    if(!user){
      return res.status(401).json({error:"invalid credentials"});
    }

    const valid = await bcrypt.compare(password,user.password);

    if(!valid){
      return res.status(401).json({error:"invalid credentials"});
    }

    const accessToken = jwt.sign(
      {
        userId:user.id,
        email:user.email,
        role:user.role
      },
      process.env.JWT_SECRET!,
      {
        expiresIn:"15m"
      }
    );

    const refreshToken = jwt.sign(
      {
        userId:user.id
      },
      process.env.REFRESH_SECRET!,
      {
        expiresIn:"7d"
      }
    );
 
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await authRepository.saveRefreshToken(
      user.id,
      refreshToken,
      expiresAt
    );

    res.json({accessToken, refreshToken}); 
    
  } catch(err) {
    return next(err);
  }
}

async function refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
  try {
    const { refreshToken } = req.body;

    const tokens = await authRefresh(refreshToken);
    
    res.json(tokens);

  } catch(err) {
    return next(err);
  }
}

export default {
  register,
  login,
  refresh
}
