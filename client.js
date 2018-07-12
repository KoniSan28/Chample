var s = io.connect();                                               //サーバーと接続
var msg_out = document.getElementById("msg_out");                   //メッセージの出力欄
var msg_form = document.getElementById("msg_form");                 //メッセージの送信フォーム
var msg_in = document.getElementById("msg_in");                     //メッセージの入力欄
var msg_button = document.getElementById("msg_button");             //メッセージの送信ボタン

//サーバーからのイベントを受信
s.on("connect", function () {});                                    //接続時
s.on("disconnect", function (client) {});                           //切断時
s.on("S_to_C_message", function (data) {                            //相手からのメッセージを受信
    addMessage(data.value, 1);
});

//自分からメッセージを送信
function sendMessage() {
    var msg = msg_in.value;
    msg_in.value = null;
    msg_out.style.height = null;
    msg_form.style.height = null;
    msg_in.style.height = null;
    msg_button.style.height = null;
    //s.emit("C_to_S_message", {value:msg});                          //全員に送信
    s.emit("C_to_S_broadcast", {value:msg});                        //自分以外に送信
    addMessage(msg, 0);
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
    if (value.match(/\n$/g)) {
        value += "\n";
    }
    msg.innerText = value;
    msg_block.appendChild(msg);
    msg_out.appendChild(msg_block);                                 //追加
    if (bottom_scroll == 0 || who == 0) {
        msg_out.scrollTop = msg_out.scrollHeight;                   //一番下までスクロール
    }
}

//改行に合わせてmsg_formをリサイズ
function nlResize() {
    msg_out.style.height = null;
    msg_form.style.height = null;
    msg_in.style.height = null;
    msg_button.style.height = null;

    //改行の個数
    if (document.body.clientWidth > 480) {
        var nl_num = (msg_in.scrollHeight - 10) / 24 - 1;
    } else {
        var nl_num = (msg_in.scrollHeight - 10) / 20 - 1;
    }
    
    if (nl_num < 5 && document.body.clientWidth > 480) {
        msg_out.style.height = "calc(100% - " + String(70 + 24 * nl_num) + "px)";
        msg_form.style.height = String(70 + 24 * nl_num) + "px";
        msg_in.style.height = String(40 + 24 * nl_num) + "px";
        msg_button.style.height = String(40 + 24 * nl_num) + "px";
    } else if (nl_num < 5) {
        msg_out.style.height = "calc(100% - " + String(44 + 20 * nl_num) + "px)";
        msg_form.style.height = String(44 + 20 * nl_num) + "px";
        msg_in.style.height = String(34 + 20 * nl_num) + "px";
        msg_button.style.height = String(34 + 20 * nl_num) + "px";
    } else if (document.body.clientWidth > 480) {
        msg_out.style.height = "calc(100% - 166px)";
        msg_form.style.height = "166px";
        msg_in.style.height = "136px";
        msg_button.style.height = "136px";
    } else {
        msg_out.style.height = "calc(100% - 124px)";
        msg_form.style.height = "124px";
        msg_in.style.height = "114px";
        msg_button.style.height = "114px";
    }
}

msg_in.addEventListener("input", nlResize);
window.addEventListener("resize", nlResize);

//オルトキー+エンターキーが押されたら自分以外に送信
msg_in.addEventListener("keyup", (e)=>{
    if (e.altKey && e.keyCode == 13) {
        sendMessage();
    }
});

msg_button.addEventListener("click", sendMessage);