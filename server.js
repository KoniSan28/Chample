var http = require("http");
var socketio = require("socket.io");
var fs = require("fs");
 
var server = http.createServer((req,res)=>{
    var url = req.url;                                                      //リクエストからURLを取得
    var tmp = url.split(".");                                               //splitで . で区切られた配列にする 
    var ext = tmp[tmp.length - 1];                                          //tmp配列の最後の要素(外部ファイルの拡張子)を取得
    var path = "." + url;                                                   //リクエストされたURLをサーバの相対パスへ変換する
    switch(ext){
        case "js":                                                          //拡張子がjsならContent-Typeをtext/javascriptにする
            fs.readFile(path, (err,data)=>{
                res.writeHead(200,{"Content-Type":"text/javascript"});
                res.end(data,"utf-8");
            });
            break;
        case "css":                                                          //拡張子がcssならContent-Typeをtext/cssにする
            fs.readFile(path, (err,data)=>{
                res.writeHead(200,{"Content-Type":"text/css"});
                res.end(data,"utf-8");
            });
            break;
        case "/":                                                           //拡張子が/(index.html)だった場合はindex.htmlを返す
            fs.readFile("./index.html", (err,data)=>{
                res.writeHead(200,{"Content-Type":"text/html"});
                res.end(data,"utf-8");
            });
            break;
    }
}).listen(3000);

console.log("server is running.");
 
var io = socketio.listen(server);
 
io.sockets.on("connection", (socket)=>{

    //メッセージ送信（送信者にも送られる）
    socket.on("C_to_S_message", (data)=>{
        io.sockets.emit("S_to_C_message", {value:data.value});
    });

    //ブロードキャスト（送信者以外の全員に送信）
    socket.on("C_to_S_broadcast", (data)=>{
        socket.broadcast.emit("S_to_C_message", {value:data.value});
    });

    //切断したときに送信
    socket.on("disconnect", ()=>{
        //io.sockets.emit("S_to_C_message", {value:"user disconnected"});
    });
});