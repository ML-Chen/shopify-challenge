# Backend

Backend server. This uses:

- TypeScript
- Azure Blob Storage for storing images
- and it is deployed in Heroku

Setup:

```
npm install
```

Put necessary environment variables in the `.env` file. See the `.env.example` file for reference.

Then run,

```
npm run dev
```

to run in development mode, or `npm start` to build and run in production mode.

## Code overview

- `src`
  - `controllers`: defines Express endpoint functions
    - POST /images – multipart/form-data request to upload images
      - user id and password
      - public or private
    - DELETE /images
      - array of image names to be deleted
      - user id and password
    - DELETE /images/all
      - user id and password
  - `models`: Mongoose models
    - `Image.ts`
      - username: string
      - password: string
      - public: boolean
- `test`: integration tests

### Tests

To run tests, start the server, and then run `npm run test`.

## Development

### MongoDB Atlas

We're using a MongoDB Atlas database. See https://studio3t.com/knowledge-base/articles/connect-to-mongodb-atlas/ for instructions on how to obtain the connection string.

### Heroku

Create a Heroku app.

From the root folder, you can push to Heroku (after `heroku login`):

```
git subtree push --prefix backend heroku master
```

Under the Heroku dashboard Settings tab, make sure to set additional config vars to match the `.env` file. (Make sure you don't have single quotes for the environment variable CONNECTION_STRING_AZURE in Heroku.) Add the `heroku/nodejs` buildpack.

Make sure to disable production mode. To do this, create a config var called `NPM_CONFIG_PRODUCTION` which is set to `false`. Otherwise, Heroku will not install the dev dependencies properly, and the build will fail. You can set this config var by running the following command in this repo folder, after logging into Heroku CLI:

```sh
heroku config:set NPM_CONFIG_PRODUCTION=false
```

### Azure

https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal

- Create an Azure storage account.
- Create a container with public access level set to Blob (anonymous read access for blobs only). I named mine "images".
- To get the connection string, go to "Access keys" under the storage account information. Press "Show keys" and then copy the connection string to .env.
- Set the following environment variables in .env:
  - CONNECTION_STRING_AZURE (you'll need to surround it with single quotes since it has semicolons)
  - STORAGE_ACCOUNT_NAME_AZURE
  - CONTAINER_NAME_AZURE

## License

This project is open source and is licensed under the GPL v3. It is based on the starter template [microsoft/TypeScript-Node-Starter](https://github.com/microsoft/TypeScript-Node-Starter/). The code (and README) here is based on what I've written at https://github.com/GTBitsOfGood/umi-feeds-backend. This Bits of Good repo is actually a team project, so where any code is not entirely mine and is not from the starter template, I've written a comment in the relevant file (just `imageController.ts`).

TypeScript Node Starter has the following license:

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

The image "Undercover Investigation at Manitoba Pork Factory Farm" by Mercy For Animals Canada is licensed under CC BY 2.0. The other images in the /test folder are CC0.
