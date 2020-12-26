// var fs = require('fs');
// function Read(elem, type="val"){
//     fs.readFile("Save.txt", function(err, data){
//         if(err){
//             console.log(err);
//         }else eval("elem."+type+"(data)");
//     });
// }
// function Save(val){
//     fs.writeFile("Save.txt", val, function(err){
//         if(err){
//             console.log(err);
//         }else console.log("Save successfully!");
//     });
//     console.log("save ("+val+")");
// }

// window.onload = () => {
//     Read($('#input'));
//     $('#input').bind('input protertychange', () => {
//         Save($('#input').val());
//     });
// }

var main_data = null;
main_data = '[{"edit_time": "2020.12.25 23:00","describe": "","content": "你好 MyPad!"}, {"edit_time": "2020.12.25 23:00","describe": "","content": "Hello MyPad!"}, {"edit_time": "2020.12.25 23:00","describe": "","content": "Hello MyPad!"}, {"edit_time": "2020.12.25 23:00","describe": "","content": "Hello MyPad!"}]';
function read(task){
    // 本地读取模块
    // fs.readFile("Save.txt", function(err, data){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         data = String(data).replace(/^\s/g, '');
    //         main_data = JSON.parse(data); eval(task);
    //     }
    // });
    // 网络读取模块
    main_data = JSON.parse(main_data); eval(task);
}
function write(content){
    // 本地写入模块
    // fs.writeFile("Save.txt", content, function(err){
    //     if(err){
    //         console.log(err);
    //     }else return ;
    // });
}
function real_len(s){
    var len = s.length;
    for(var i=0,j=len;i<j;++i){
        var c = s.charCodeAt(i);
        if(c<0||c>127) ++len;
    } return len;
}
function real_slice(s, st, cnt){
    var len = s.length, ns="";
    if(st+cnt-1 >= len) cnt = len-st;
    for(var i=0,j=0;j<cnt;++i,++j){
        var c = s.charCodeAt(i);
        if(c<0||c>127) ++j;
        if(j<cnt) ns += s[i];
    } return ns;
}
function get_now_time(){
    var now = new Date(), s="";
    s += now.getFullYear()+".";
    s += (now.getMonth()+1<10?"0":"")+(now.getMonth()+1)+".";
    s += (now.getDate()<10?"0":"")+now.getDate()+" ";
    s += (now.getHours()<10?"0":"")+now.getHours()+":";
    s += (now.getMinutes()<10?"0":"")+now.getMinutes();
    return s;
}

class LIST_PAD{
    constructor(father, edit_time, describe, content){
        // 基本信息存储
        this.on_edit = false;
        this.edit_time = edit_time;
        this.describe = describe;
        this.content = content;
        this.father = father;
        
        // 基本结构定义
        this.box = $('<div class="pad_box"></div>');
        this.des = $('<div class="pad_des"></div>');
        this.tim = $('<div class="pad_time"></div>');

        this.box.append(this.des, this.tim);
        this.father.append(this.box);
        this.load();

        var th = this;
        this.box.click(function(){
            if(th.on_edit) return ;
            editor.edit(th);
        });
    }
    load(){// 加载显示内容
        if(this.describe == ''){
            // 如果描述为空，自动取前 15 个字符作为简述
            if(real_len(this.content) <= 15){
                this.des.text(this.content);
            }else this.des.text(real_slice(this.content, 0, 12) + "...");
        }else this.des.text(this.describe);
        this.tim.text(this.edit_time);
    }
}
class LIST{
    constructor(base){
        this.pads = [];
        this.base = base;

        for(var i in main_data){
            var info = main_data[i];
            this.pads.push(new LIST_PAD(base, info['edit_time'], info['describe'], info['content']));
        }    
    }
    save(){
        var s = [];
        for(var i in this.pads){
            var item = this.pads[i];
            s.push({
                "edit_time": item.edit_time,
                "describe": item.describe,
                "content": item.content
            });
        } write(JSON.stringify(s));
    }
}
class EDITOR{
    constructor(base){
        this.on_edit = false;
        this.on_elem = null;
        this.base = base;

        // 创建工具栏
        this.tools_box = $('<div class="editor_tools"></div>');
        // 创建文本编辑区域
        var edit_h = $('<div class="editor_h"></div>').text('笔记正文');
        var des_h = $('<div class="editor_h"></div>').text('笔记描述');
        this.edit_box = $('<textarea class="editor_area"></textarea>');
        this.des_box = $('<textarea class="editor_des"></textarea>');
        // 创建按钮区域
        this.btn_box = $('<div class="editor_btn"></div>');
        this.save_btn = $('<div class="editor_save"></div>').text("保存");
        this.cancle_btn = $('<div class="editor_cancle"></div>').text("关闭");

        this.btn_box.append(this.save_btn, this.cancle_btn);
        this.base.append(this.tools_box, edit_h, this.edit_box, des_h, this.des_box, this.btn_box);
    }
    save(elem){
        elem.content = this.edit_box.val();
        elem.describe = this.des_box.val();
        elem.edit_time = get_now_time();
        elem.load(); list.save();
    }
    cancle(elem){
        this.edit_box.val(elem.content);
        this.des_box.val(elem.describe);
        
        elem.on_edit = false;
        this.on_edit = false;

        this.des_box.val('');
        this.edit_box.val('');
        this.base.toggleClass("active");

        this.save_btn.click(null);
        this.cancle_btn.click(null);
    }
    edit(elem){
        if(this.on_edit)
            this.cancle(this.on_elem);
        this.on_elem = elem;
        console.log(this.on_elem);
        this.on_edit = true;
        elem.on_edit = true;
        this.base.toggleClass("active");

        this.edit_box.val(elem.content);
        this.des_box.val(elem.describe);

        var th = this;
        this.save_btn.click(function(){
            th.save(elem);
        });
        this.cancle_btn.click(function(){
            th.cancle(elem);
        });
    }
}
var editor,list;
function init(){
    list = new LIST($('.pad_list'));
    editor = new EDITOR($('.pad_editor'));
}
window.onload = function(){
    read('init();');
}