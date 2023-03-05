/// <reference path="./typings/koa-swig.d.ts"/>
import Koa from 'koa';
import { createContainer, Lifetime } from "awilix";
import socketIO from "socket.io";
import { createServer } from "http";
import { join } from "path";
import co from "co";
import render from "koa-swig";
import serve from 'koa-static';
import { scopePerRequest, loadControllers } from 'awilix-koa';
const app = new Koa();
app.context.render = co.wrap(render<render.defaultSettings>({
    root: join(__dirname, 'views'),
    autoescape: true,
    writeBody: false,
    cache: false,
    ext: 'html'
}));
const server = createServer(app.callback());
const io = socketIO(server);
app.use(serve(__dirname + '/assets'));
const container = createContainer();
container.loadModules([__dirname + "/services/*.ts"], {
    formatName: "camelCase",
    resolverOptions: {
        lifetime: Lifetime.SCOPED
    }
});
app.use(scopePerRequest(container));
//让所有的路由 初始化
app.use(loadControllers(__dirname + "/routers/*.ts"));
io.on("connection", socket => {
    console.log("🐻 Socket服务端启动成功");
    socket.emit('request', "京程一灯" + Math.random());
    // io.emit('broadcast', /* … */);
    socket.on('reply', (data) => {
        console.log("🌺", data);
    });
});
server.listen(3001);
app.listen(3000, () => {
    console.log("🍺 京程一灯主服务器Server启动成功");
});
