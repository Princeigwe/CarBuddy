import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';


const cookieSession = require('cookie-session');
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cookieSession({
  //   keys: ['asdfghjkl'],
  // }))

  

  // application should provide cookies
  app.use(cookieParser()); 


  // for csrf protection
  // app.use(csurf())
  
  // enabling Cross-Site Request
  app.enableCors({
    credentials: true, // credentials will be accessed
  });
  
  // apps should use pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes unnecessary properties in POST request body
    }),
  )
  await app.listen(3000);
}
bootstrap();
