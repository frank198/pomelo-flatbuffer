
const SERVER = 'server';
const CLIENT = 'client';
const SERVERFB = 'serverFB';
const CLIENTFB = 'clientFB';
const FlatBufferIndex = require('../index');
const fs = require('fs');
const path = require('path');
const watchers = Symbol('watchers');
const serverFlatBuffer = Symbol('serverFlatBuffer');
const clientFlatBuffer = Symbol('serverFlatBuffer');

class FlatBuffer
{
	constructor(app, opts)
	{
		this.app = app;
		this.version = 0;
		this[watchers] = new Map();
		this[serverFlatBuffer] = new Map();
		this[clientFlatBuffer] = new Map();
		this.serverFBCheck = {};
		this.clientFBCheck = {};
		opts = opts || {};
		this.serverProtosPath = opts.serverProtos || '/config/serverProtos.json';
		this.clientProtosPath = opts.clientProtos || '/config/clientProtos.json';
		this.serverFBPath = opts.serverFBPath || '/config/serverBFBS';
		this.clientFBPath = opts.clientFBPath || '/config/clientBFBS';
		this.logger = opts.logger || console;
	}

	start(cb)
	{
		this.setProtos(SERVER, path.join(this.app.getBase(), this.serverProtosPath));
		this.setProtos(CLIENT, path.join(this.app.getBase(), this.clientProtosPath));
		this.setProtos(SERVERFB, path.join(this.app.getBase(), this.serverFBPath));
		this.setProtos(CLIENTFB, path.join(this.app.getBase(), this.clientFBPath));
		process.nextTick(cb);
	}

	check(type, route)
	{
		let curRoute = route;
		let flatInstance = null;
		switch(type) {
			case SERVER:
				if (this.serverFBCheck[route])
				{
					curRoute = this.serverFBCheck[route];
				}
				flatInstance = this[serverFlatBuffer].get(curRoute);
				break;
			case CLIENT:
				if (this.clientFBCheck[route])
				{
					curRoute = this.clientFBCheck[route];
				}
				flatInstance = this[clientFlatBuffer].get(curRoute);
				break;
			default:
				throw new Error('decodeIO meet with error type of protos, type: ' + type + ' route: ' + route);
				break;
		}
		return flatInstance != null;
	}

	encode(route, message)
	{
		let curRoute = route;
		if (this.serverFBCheck[route])
		{
			curRoute = this.serverFBCheck[route];
		}
		const flatInstance = this[serverFlatBuffer].get(curRoute);
		if (flatInstance != null)
		{
			return flatInstance.generate(message);
		}
		return null;
	}

	decode(route, message)
	{
		let curRoute = route;
		if (this.clientFBCheck[route])
		{
			curRoute = this.clientFBCheck[route];
		}
		const flatInstance = this[clientFlatBuffer].get(curRoute);
		if (flatInstance != null)
		{
			return flatInstance.parse(message);
		}
		return null;
	}

	getProtos()
	{
		return {
			server  : this.serverProtos,
			client  : this.clientProtos,
			version : this.version
		};
	}

	getVersion()
	{
		return this.version;
	}

	setProtos(type, filePath)
	{
		if (!fs.existsSync(filePath))
		{
			return;
		}

		const stats = fs.statSync(filePath);
		if (stats.isFile())
		{
			const baseName = path.basename(filePath);
			if (type === SERVER)
			{
				this.serverProtos = require(filePath);
			}
			else if (type === CLIENT)
			{
				this.clientProtos = require(filePath);
			}
			else
			{
				this.setFlatBufferData(type, filePath);
			}

			// Set version to modify time
			const time = stats.mtime.getTime();
			if (this.version < time)
			{
				this.version = time;
			}

			// Watch file
			const watcher = fs.watch(filePath, this.onUpdate.bind(this, type, filePath));
			if (this[watchers].has(baseName))
			{
				this[watchers].get(baseName).close();
			}
			this[watchers].set(baseName, watcher);
		}
		else if (stats.isDirectory())
		{
			const files = fs.readdirSync(filePath);
			files.forEach((val, index) =>
			{
				const fPath = path.join(filePath, val);
				const stats = fs.statSync(fPath);
				if (stats.isFile()) this.setProtos(type, fPath);
			});
		}

	}

	onUpdate(type, filePath, event)
	{
		if (event !== 'change')
		{
			return;
		}
		try
		{
			if (type === SERVER || type === CLIENT)
			{
				const data = fs.readFileSync(filePath, 'utf8');
				if (type === SERVER)
				{
					this.serverProtos = JSON.parse(data);
				}
				else if (type === CLIENT)
				{
					this.clientProtos = JSON.parse(data);
				}
			}
			else
			{
				this.setFlatBufferData(type, filePath);
			}
			this.version = fs.statSync(filePath).mtime.getTime();
			this.logger && this.logger.debug('change proto file , type : %j, path : %j, version : %j', type, filePath, this.version);
		}
		catch (err)
		{
			this.logger && this.logger.warn('change proto file error! path : %j', filePath);
			this.logger && this.logger.warn(err);
		}
	}

	setFlatBufferData(type, filePath)
	{
		const extName = path.extname(filePath);
		const baseName = path.basename(filePath, extName);
		const data = fs.readFileSync(filePath);
		if (extName === '.json')
		{
			if (type === SERVERFB)
			{
				this.serverFBCheck = JSON.parse(data);
			}
			else if (type === CLIENTFB)
			{
				this.clientFBCheck = JSON.parse(data);
			}
		}
		else
		{
			const flatBuild = FlatBufferIndex.compileSchema(data);
			if (type === SERVERFB)
			{
				this[serverFlatBuffer].set(baseName, flatBuild);
			}
			else if (type === CLIENTFB)
			{
				this[clientFlatBuffer].set(baseName, flatBuild);
			}
		}
	}

	stop(force, cb)
	{
		for (const watcher of this[watchers].values())
		{
			if (watcher)
				watcher.close();
		}
		this[watchers].clear();
		this[watchers] = null;
		process.nextTick(cb);
	}
}

module.exports = function(app, opts)
{
	return new FlatBuffer(app, opts);
};
FlatBuffer.prototype.name = '__decodeIO__protobuf__';