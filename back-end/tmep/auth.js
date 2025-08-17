import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import { config } from 'dotenv';

config();

const router = express.Router();

import oauth2client from './googleConfig.js';

router.get('/google', async (req, res) => {
    const code = req.query.code;
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);
    const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
    
    const { email, name, picture } = userInfo.data;
    const token = jwt.sign({ email, name, picture}, process.env.JWTSECRET , {expiresIn: '10d'});

    res.json({email, name, picture, token});
});


export default router;