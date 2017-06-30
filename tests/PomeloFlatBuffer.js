const FlatBuffer = require('../lib/components/flatbuffer');
const exampleData = require('./exampleData');

const app = {
	getBase : function()
	{
		return __dirname;
	},
	get: function()
	{
		return 'development';
	}
};

const flatBufferInstance = FlatBuffer(app, {
	serverProtos : '/serverProtos.json',
	clientProtos : '/clientProtos.json',
	serverFBPath : '/serverBFBS/',
	clientFBPath : '/clientBFBS/'
});

flatBufferInstance.start(() =>
{
	const data = flatBufferInstance.encode('LoginUserInfo', exampleData.LoginUserInfo);
	console.log(data.toString());

});