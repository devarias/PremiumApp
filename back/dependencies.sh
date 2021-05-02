#!/usr/bin/env bash
npm init -y
npm i -S axios
npm i -S cors
npm i -S dotenv
npm i -S express
npm i -S -D nodemon
sed -i '7i \\t\t"start": "nodemon index.js",' package.json
