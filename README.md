# [FlatBuffer](https://github.com/google/flatbuffers)

# 使用说明

## pomelo 中安装与使用

### 安装
```bash
npm install pomelo-flatbuffer --save
```
### 使用
在 app.js 中添加一下脚本

```javascript
// app configuration
app.configure('development', 'gate|connector', () =>
{
	app.use(flatBuffer, {
		serverProtos : '/serverProtos.json',
        clientProtos : '/clientProtos.json',
        serverFBPath : '/serverBFBS/',
        clientFBPath : '/clientBFBS/'
	});
	app.set('connectorConfig',
		{
			connector   : pomelo.connectors.hybridconnector,
			// timeout:10,
			handshake   : handshake,
			heartbeat   : 5,
			useProtobuf : false,
			setNoDelay  : true,
			// disconnectOnTimeOut : true
			// ,distinctHost:true
		});
});
```

#### 参数说明
- serverProtos dafault: config/serverProtos.json  服务器发送到客户端的消息
- clientProtos default: config/clientProtos.json  客户端发送到服务器的消息
- serverFBPath default: config/serverBFBS/        flatbuffer 序列化服务器发送的数据（bfbs 格式文件）
- clientFBPath default: config/clientBFBS/        flatbuffer 反序列化服务器接受的数据（bfbs 格式文件）


## bfbs 文件生成
```sh
# cd tests
# flatc -o bfbsData  -b --schema flatSchema/*.fbs
```



## 实例使用

### 文件夹说明

- serverBFBS 服务器发送到客户端的消息， 和 serverProtos.json 一致
    - .json route与class对照表
    - .bfbs flatc生成的数据
  
- clientBFBS 客户端发送到服务器的消息， 和 clientProtos.json 一致
    - .json route与class对照表
    - .bfbs flatc生成的数据
    
- flatSchema flat文件的消息格式 

```javascript
const FlatBuffer = require('../lib/components/flatbuffer');
const flatBufferInstance = FlatBuffer(app, {
	serverProtos : '/serverProtos.json',
	clientProtos : '/clientProtos.json',
	serverFBPath : '/serverBFBS/',
	clientFBPath : '/clientBFBS/'
});

FlatBuffer.start(()=>{
    // 序列化数据
    const data = flatBufferInstance.encode('ItemDistances', exampleData.ItemDistances);
    // 反序列化数据
    flatBufferInstance.decode('ItemDistances', data);
})
```

### 测试

```bash
node ./test/PomeloFlatBuffer.js 
node ./test/FlatBufferTest.js
```
