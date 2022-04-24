import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
const MongoStore = require('connect-mongo');
// const MongoDBStore = require('connect-mongodb-session')(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sessionStore = MongoStore.create({
    mongoUrl:
      'mongodb://' +
      process.env.MONGO_LOGIN +
      ':' +
      process.env.MONGO_PASSWORD +
      '@' +
      process.env.MONGO_HOST +
      ':' +
      process.env.MONGO_PORT +
      '/' +
      process.env.MONGO_AUTHDATABASE,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'mySecret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60 * 60 * 1000 }, // 60 minutes
      store: sessionStore,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: ['http://localhost:3001'], //your front url,
    methods: ['POST', 'GET', 'DELETE', 'PATCH'],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
