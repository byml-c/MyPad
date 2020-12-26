var fs = require('fs');

// var main_data = null;
// main_data = '[{"edit_time": "2020.12.25 23:00","describe": null,"content": "Hello MyPad!"}, {"edit_time": "2020.12.25 23:00","describe": null,"content": "Hello MyPad!"}, {"edit_time": "2020.12.25 23:00","describe": null,"content": "Hello MyPad!"}, {"edit_time": "2020.12.25 23:00","describe": null,"content": "Hello MyPad!"}]';
// function Read(){
//     main_data = JSON.parse(main_data);

// }

// function real_len(s){
//     var len = s.length;
//     for(var i=0,j=len;i<j;++i)
//         if(s.charCodeAt(i)&0xff00 != 0)
//             ++len;
//     return len;
// }
// function real_slice(s, st, cnt){
//     var len = s.length, ns="";
//     if(st+cnt-1 >= len) cnt = len-st;
//     for(var i=0,j=0;j<cnt;++i,++j){
//         if(s.charCodeAd(i)&0xff00!=0){
//             ++j;
//         } ns += s[i];
//     }
// }
// function LIST_PAD(father, edit_time, describe, content){
//     // 基本信息存储
//     var edit_time = edit_time;
//     var describe = describe;
//     var content = content;
//     var father = father;
    
//     // 基本结构定义
//     var box = $('<div class="pad_box"></div>');
//     var des = $('<div class="pad_des"></div>');
//     var tim = $('<div class="pad_time"></div>');

//     if(describe == null){
//         // 如果描述为空，自动取前 10 个字符作为简述
//         if(real_len(content) <= 10){
//             des.text(content);
//         }else des.text(content.slice(0, 7) + "...");
//     }else des.text(describe);
//     tim.text(edit_time);

//     box.append(des, tim);
//     father.append(box);
// }
// function LIST(){
//     var pads = [];
//     var base = $('.pad_list');

//     for(var i in main_data){
//         var info = main_data[i];
//         pads.push(new LIST_PAD(base, info['edit_time'], info['describe'], info['content']));
//     }
// }
// window.onload = () => {
//     Read(); var a = LIST();
// }

function Read(elem, type="val"){
    fs.readFile("Save.txt", function(err, data){
        if(err){
            console.log(err);
        }else eval("elem."+type+"(data)");
    });
}
function Save(val){
    fs.writeFile("Save.txt", val, function(err){
        if(err){
            console.log(err);
        }else console.log("Save successfully!");
    });
    console.log("save ("+val+")");
}

window.onload = () => {
    Read($('#input'));
    $('#input').bind('input protertychange', () => {
        Save($('#input').val());
    });
}