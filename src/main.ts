import { NestFactory} from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express'
import {join} from 'path'
const express = require('express')

import * as session from 'express-session';
let RedisStore = require('connect-redis')(session) //import REDIS session storage
// const { createClient } = require("redis")
// let redisClient = createClient()

const cookieSession = require('cookie-session');
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // running Nest on Express
  // app.use(cookieSession({
  //   keys: ['asdfghjkl'],
  // }))

  

  // application should provide cookies
  app.use(cookieParser());
  
  // using http sessions
  // app.use(
  //   session({
  //     store: new RedisStore({client: redisClient}),
  //     secret: 'my-secret', // TODO: make this a secret, for real [it should not be seen]
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );


  // for csrf protection
  // app.use(csurf())
  
  // enabling Cross-Site Request
  app.enableCors({
    credentials: true, // credentials will be accessed
  });

  app.use('/uploads' , express.static(join(__dirname, '..', 'uploads')));


  // app.use('/src/public' , express.static(path.join(__dirname, '..', 'public')));

  // apps should use pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes unnecessary properties in POST request body
      transform: true,
    }),
  )
  await app.listen(3000);
}
bootstrap();
