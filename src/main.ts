import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
const MongoStore = require('connect-mongo');

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(process.env.KEY_PATH),
    cert: readFileSync(process.env.CERT_PATH),
  };

  const app = await NestFactory.create(
    AppModule,
    process.env.PRODUCTION ? { httpsOptions } : {},
  );
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

  app.use(bodyParser.json({ limit: '5mb' }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: [process.env.FRONT_URL || 'https://ivan-dev.ru:80'], //your front url,
    methods: ['POST', 'GET', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'PUT'],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
