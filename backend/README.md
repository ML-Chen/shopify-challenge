# Backend

Backend server. This uses:

- TypeScript
- Auth0 for authentication
- Azure Blob Storage for storing images
- and it is deployed in Heroku

Setup:

```
npm install
```

Put necessary environment variables in the `.env` file. See the `.env.example` file for reference.

As a best security practice, the passwords should be salted and hashed, but for simplicity, I did not.

Then run,

```
npm run dev
```

to run in development mode, or …

## Code overview

API

- POST /images
  - multipart/form-data
  - user id and password
  - public or private
- DELETE /images
  - array of image names to be deleted
  - user id and password
- DELETE /images/all
  - user id and password

Models

- Image
  - username: string
  - password (hashed): string
  - public: boolean

## Development

### MongoDB Atlas

We're using a MongoDB Atlas database. See https://studio3t.com/knowledge-base/articles/connect-to-mongodb-atlas/ for instructions on how to obtain the connection string.

### Heroku

Heroku is set to auto-deploy the `develop` branch of this repo to [URL pending]. Here's how to set Heroku to deploy from a subfolder: https://stackoverflow.com/questions/39197334/automated-heroku-deploy-from-subfolder

If you wanted to create another deployment to Heroku for some reason, here's how you would do it:

Create a Heroku app, and in the Heroku dashboard Deploy tab, set it to deploy from this GitHub repo (or your fork, or whatever).

Under the Heroku dashboard Settings tab, make sure to set additional config vars to match the `.env` file. Add the `heroku/nodejs` buildpack.

Make sure to disable production mode. To do this, create a config var called `NPM_CONFIG_PRODUCTION` which is set to `false`. Otherwise, Heroku will not install the dev dependencies properly, and the build will fail. You can set this config var by running the following command in this repo folder, after logging into Heroku CLI:

```sh
heroku config:set NPM_CONFIG_PRODUCTION=false
```

## License

This project is open source and is licensed under the GPL v3. It is based on the starter template [microsoft/TypeScript-Node-Starter](https://github.com/microsoft/TypeScript-Node-Starter/), which has the following license:

    MIT License

    Copyright (c) Microsoft Corporation. All rights reserved.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE
