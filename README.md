Express & ES6 REST API Boilerplate
==================================

This is a modified boilerplate for building REST APIs with ES6 and Express forked from [Express & ES6 REST API Boilerplate](https://github.com/developit/express-es6-rest-api)

- ES6 support via [babel](https://babeljs.io)
- REST resources as middleware via [resource-router-middleware](https://github.com/developit/resource-router-middleware)
- CORS support via [cors](https://github.com/troygoode/node-cors)
- Body Parsing via [body-parser](https://github.com/expressjs/body-parser)

> Tip: If you are using [Mongoose](https://github.com/Automattic/mongoose), you can automatically expose your Models as REST resources using [restful-mongoose](https://git.io/restful-mongoose).


Getting Started
---------------

### clone it
```
git clone git@github.com:therightstuff/express-es6-rest-api.git
cd express-es6-rest-api
```

### Make it your own
```
rm -rf .git && git init && npm init
```

### Install dependencies
```
npm install
```

### Configuration
`config.json` is located in the configuration folder. `port`, `logLevel` and `environment` values can be overridden by environment variables `PORT`, `LOG_LEVEL` and `NODE_ENV` respectively.

### HTTPS
If you want the server to run in https, ensure that the key and certificate files are in the same folder as `server.key` and `server.cert`

### Start development live-reload server
```
npm run dev
```
or
```
PORT=8080 npm run dev
```

### Start production server:
```
npm start
```
or
```
PORT=8080 npm start
```

### Testing
Tests must be in the `test` folder.

```
npm run test
```

Docker Support
------
```sh
cd express-es6-rest-api

# Build your docker
docker build -t es6/api-service .
#            ^      ^           ^
#          tag  tag name      Dockerfile location

# run your docker
docker run -p 8080:8080 es6/api-service
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port   

```

License
-------

MIT
