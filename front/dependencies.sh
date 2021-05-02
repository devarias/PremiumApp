#!/usr/bin/env bash
npm init -y
npm i -S antd
npm i -S axios
npm i -S react
npm i -S react-dom
npm i -S react-highlight-words
npm i -S react-router-dom
npm i -S react-scripts
npm i -S web-vitals
sed -i '7i \\t\t"start": "react-scripts start",' package.json
