import express from 'express';
import compression from 'compression'; // compresses requests
import session from 'express-session';
import lusca from 'lusca';
import mongo from 'connect-mongo';
import path from 'path';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import cors from 'cors';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';

// Controllers (route handlers)
import * as imageController from './controllers/imageController';

// Routers
import imageRouter from './routes/images';

const MongoStore = mongo(session);

// Create Express server
const app = express();

// Connect to MongoDB
const ENVIRONMENT = process.env.NODE_ENV;
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

if (ENVIRONMENT !== 'test') {
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
        () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ }
    ).catch(err => {
        console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
        // process.exit();
    });
} else if (ENVIRONMENT === 'test') {
    // Connect to mongo memory server for testing
    const mongoServer = new MongoMemoryServer(); // in-memory server

    mongoServer.getUri().then((mongoUri: string) => {
        mongoose.connect(mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
            () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ }
        ).catch(err => {
            console.log(`Mock MongoDB connection error. Please make sure MongoDB is running. ${err}`);
            // process.exit();
        });
    });
}

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(
    express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);
const fileupload = require('express-fileupload');

app.use(fileupload());

// Routes
app.use('', imageRouter);

export default app;
