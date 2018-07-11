var s = io.connect();                                               //サーバーと接続
var msg_in = document.getElementById("msg_in");                     //メッセージの入力欄
var msg_out = document.getElementById("msg_out");                   //メッセージの出力欄

//サーバから受け取るイベント
s.on("connect", function () {});                                    //接続時
s.on("disconnect", function (client) {});                           //切断時
s.on("S_to_C_message", function (data) {                            //受信時
    addMessage(data.value, 1);
});

//送信して自分のメッセージを追加
function sendMyMessage() {
    addMessage(msg_in.value, 0);
    sendBroadcast();
}

//クライアントからイベント送信（イベント名は自由に設定できます）
//みんなに送信
function sendMessage() {
    var msg = msg_in.value;                                         //取得
    msg_in.value = null;                                            //空白にする
    s.emit("C_to_S_message", {value:msg});                          //サーバへ送信
}

//自分以外に送信
function sendBroadcast() {
    var msg = msg_in.value;                                         //取得
    msg_in.value = null;                                            //空白にする
    s.emit("C_to_S_broadcast", {value:msg});                        //サーバへ送信
}

//メッセージを追加
function addMessage(value,who) {
    var bottom_scroll = msg_out.scrollHeight-msg_out.clientHeight-msg_out.scrollTop;
    var msg_block = document.createElement("div");
    var msg = document.createElement("div");
    if (who == 0) {                                                 //自分からのメッセージ
        msg_block.className = "msg_block right";
        msg.className = "msg right";
    } else {                                                        //相手からのメッセージ
        msg_block.className = "msg_block left";
        msg.className = "msg left";
    }
    msg.innerText = value;
    msg_block.appendChild(msg);
    msg_out.appendChild(msg_block);                                 //追加
    if (bottom_scroll == 0 || who == 0) {
        msg_out.scrollTop = msg_out.scrollHeight;                   //一番下までスクロール
    }
}

//エンターキーが押されたら自分以外に送信
msg_in.addEventListener("keypress", (e)=>{
    if (e.keyCode == 13) {
        e.preventDefault();
    }
});
msg_in.addEventListener("keyup", (e)=>{
    if (e.keyCode == 13) {
        sendMyMessage();
    }
});