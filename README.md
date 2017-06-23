# [FlatBuffer](https://github.com/google/flatbuffers)

# 使用说明
## 文件生成
```sh
# cd tests
# flatc -o bfbsData  -b --schema flatSchema/*.fbs
```

## 文件夹说明

- serverBFBS 服务器发送到客户端的消息， 和 serverProtos.json 一致
    - .json route与class对照表
    - .bfbs flatc生成的数据
  
- clientBFBS 客户端发送到服务器的消息， 和 clientProtos.json 一致
    - .json route与class对照表
    - .bfbs flatc生成的数据
    
- flatSchema flat文件的消息格式 

## 实例使用
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
