import { NestFactory} from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express'
import {join} from 'path'
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger' // swagger documentation  packages for nest


const express = require('express')

import * as session from 'express-session';
let RedisStore = require('connect-redis')(session) //import REDIS session storage
// const { createClient } = require("redis")
// let redisClient = createClient()

const cookieSession = require('cookie-session');
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import Helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // running Nest on Express

  // using http sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Car Buddy')
    .setDescription('API service that helps in buying/ selling your cars.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)

  // app.use(cookieSession({
  //   keys: ['asdfghjkl'],
  // }))

  if (process.env.NODE_ENV == 'production') {
    app.use(Helmet()); // wrapper function for some web security functions
  }

  // application should provide cookies
  app.use(cookieParser());

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

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  
  
  await app.listen(3000);
}
bootstrap();
