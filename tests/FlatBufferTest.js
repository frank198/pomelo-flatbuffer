const FlatBuffer = require('../lib/index');
const exampleData = require('./exampleData');
const fs = require('fs');
const path = require('path');

const data = fs.readFileSync(path.join(__dirname, '/serverBFBS/MessageBoxInfo.bfbs'));
const flatBuild = FlatBuffer.compileSchema(data);
const bytes = flatBuild.generate(exampleData.MessageBoxInfo);
console.log(bytes.toString());
const jsonData = flatBuild.parse(bytes);
