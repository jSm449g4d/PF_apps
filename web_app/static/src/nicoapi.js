!function(e){var t={};function a(n){if(t[n])return t[n].exports;var l=t[n]={i:n,l:!1,exports:{}};return e[n].call(l.exports,l,l.exports,a),l.l=!0,l.exports}a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)a.d(n,l,function(t){return e[t]}.bind(null,l));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=5)}([function(e,t){e.exports=React},function(e,t){e.exports=firebase},function(e,t,a){"use strict";a.d(t,"d",(function(){return i})),a.d(t,"b",(function(){return o})),a.d(t,"e",(function(){return c})),a.d(t,"c",(function(){return d})),a.d(t,"a",(function(){return m}));var n=a(0),l=a.n(n),s=a(1),r=a.n(s);r.a.initializeApp({apiKey:"AIzaSyCWzFat3oUpn_4TtOpDCMhcOD2Qf4u1Mr4",authDomain:"crack-atlas-251509.firebaseapp.com",databaseURL:"https://crack-atlas-251509.firebaseio.com",projectId:"crack-atlas-251509",storageBucket:"crack-atlas-251509.appspot.com",messagingSenderId:"646437940818",appId:"1:646437940818:web:080ff48019a68c74d3b98b",measurementId:"G-QLHKJ38SWW"}),r.a.analytics();const i=r.a;var o=r.a.auth(),c=r.a.storage(),d=r.a.firestore();class m extends l.a.Component{constructor(e){super(e),this.state={uid:"",mail_addr:"",mail_pass:""},setInterval(()=>{o.currentUser?this.state.uid!=o.currentUser.uid&&this.setState({uid:o.currentUser.uid}):""!=this.state.uid&&this.setState({uid:""})},100)}signup(){o.createUserWithEmailAndPassword(this.state.mail_addr,this.state.mail_pass).catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}signin(){o.signInWithEmailAndPassword(this.state.mail_addr,this.state.mail_pass).catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}pass_reset(){o.sendPasswordResetEmail(this.state.mail_addr).then(()=>{alert("SEND_EMAIL!")}).catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}account_delete(){o.currentUser.delete().then(()=>{alert("ACCOUNT_DELETED!")}).catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}signin_easy(){o.signInWithEmailAndPassword("a@b.com","asdfgh").catch(()=>{o.createUserWithEmailAndPassword("a@b.com","asdfgh").catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})})}google_login(){o.signInWithPopup(new r.a.auth.GoogleAuthProvider).then().catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}accountmodal_render(e,t){let a="mygape_modal_"+e,n="#"+a;return t=t.bind(this),l.a.createElement("div",null,l.a.createElement("button",{type:"button",className:"btn btn-primary btn-sm mx-1","data-toggle":"modal","data-target":n},e),l.a.createElement("div",{className:"modal fade",id:a,role:"dialog","aria-hidden":"true"},l.a.createElement("div",{className:"modal-dialog modal-lg",role:"document"},l.a.createElement("div",{className:"modal-content"},l.a.createElement("div",{className:"modal-header"},l.a.createElement("h5",{className:"modal-title"},e)),l.a.createElement("div",{className:"modal-body row"},l.a.createElement("input",{type:"text",name:"mail_addr",className:"form-control col-6",placeholder:"mail_address",onChange:e=>{this.setState({mail_addr:e.target.value})}}),l.a.createElement("input",{type:"text",name:"mail_pass",className:"form-control col-6",placeholder:"set_password",onChange:e=>{this.setState({mail_pass:e.target.value})}})),l.a.createElement("div",{className:"modal-footer"},l.a.createElement("button",{type:"button",className:"btn btn-primary","data-dismiss":"modal",onClick:t},"Submit"),l.a.createElement("button",{type:"button",className:"btn btn-secondary","data-dismiss":"modal"},"Close"))))))}render(){return l.a.createElement("div",{className:"bg-light p-2"},""==this.state.uid?l.a.createElement("div",{className:"d-flex justify-content-between"},l.a.createElement("h5",null,"サービスを利用するには、ログインしてください"),l.a.createElement("div",{className:"ml-auto"},l.a.createElement("div",{className:"form-inline"},l.a.createElement("input",{type:"button",value:"Googleでログイン",className:"btn btn-success mx-1 btn-sm",onClick:this.google_login}),this.accountmodal_render("Sign_in",this.signin),this.accountmodal_render("Sign_up",this.signup),l.a.createElement("button",{type:"button",className:"btn btn-warning mx-1 btn-sm",onClick:this.signin_easy},"Easy_login")))):l.a.createElement("div",{className:"d-flex justify-content-between"},l.a.createElement("div",{className:"form-inline"},o.currentUser.photoURL?l.a.createElement("img",{src:o.currentUser.photoURL,alt:"user.photoURL",width:"64",height:"64"}):l.a.createElement("div",null),o.currentUser.displayName?l.a.createElement("h6",null,"ようこそ ",o.currentUser.displayName," さん"):l.a.createElement("h6",null,"ようこそ ",o.currentUser.email," さん")),l.a.createElement("div",{className:"form-inline"},l.a.createElement("button",{type:"button",className:"btn btn-secondary btn-sm mx-1",onClick:()=>{o.signOut()}},"logout"),l.a.createElement("button",{type:"button",className:"btn btn-warning btn-sm mx-1","data-toggle":"modal","data-target":"#account_modal_config"},"config"),l.a.createElement("div",{className:"modal fade",id:"account_modal_config",role:"dialog","aria-hidden":"true"},l.a.createElement("div",{className:"modal-dialog",role:"document"},l.a.createElement("div",{className:"modal-content"},l.a.createElement("div",{className:"modal-header"},l.a.createElement("h5",{className:"modal-title"},"Config")),l.a.createElement("div",{className:"modal-body row"},l.a.createElement("input",{type:"text",name:"mail_addr",className:"form-control col-12",placeholder:"send mail for password_reset"})),l.a.createElement("div",{className:"modal-footer"},l.a.createElement("button",{type:"button",className:"btn btn-sm btn-warning","data-dismiss":"modal"},"password_reset"),l.a.createElement("button",{type:"button",className:"btn btn-sm btn-danger","data-dismiss":"modal"},"account_delete"),l.a.createElement("button",{type:"button",className:"btn btn-secondary","data-dismiss":"modal"},"Close"))))))))}}},function(e,t){e.exports=ReactDOM},,function(e,t,a){"use strict";a.r(t),a.d(t,"Nicoapi_tsx",(function(){return o}));var n=a(0),l=a.n(n),s=a(3),r=a.n(s),i=a(2);class o extends l.a.Component{constructor(e){super(e),this.state={uid:"",API_endpoint:"https://site.nicovideo.jp/search-api-docs/search.html",service_name:"ニコニコ動画",fields:JSON.stringify({}),fors:JSON.stringify({})},setInterval(()=>{i.b.currentUser?this.state.uid!=i.b.currentUser.uid&&this.setState({uid:i.b.currentUser.uid}):""!=this.state.uid&&this.setState({uid:""})},200)}db_update_orders(){if(""!=this.state.uid){this.state.API_endpoint,this.state.fields;var e=i.c.collection("nicoapi").doc(this.state.uid);e.get().then(t=>{t.exists||e.set({}),e.update({})})}}generate_orders(){const e=[this.state.API_endpoint+"?"],t=JSON.parse(this.state.fields),a=Object.keys(JSON.parse(this.state.fields)).sort();for(let n=0;n<a.length;n++)if(""!=t[a[n]].field)if(0!=t[a[n]].value.indexOf("$for("))for(let l=0;l<e.length;l++)e[l]+="&"+t[a[n]].field+"="+t[a[n]].value;else{const l=t[a[n]].value.split(/[(;)]/);if(5!=l.length)return void alert("wrong:fields→value");const s=e.length;for(let r=0;r<s;r++)for(let s=Number(l[1]);s<Number(l[2]);s+=Number(l[3]))e.push(e[r]+"&"+t[a[n]].field+"="+String(s));e.splice(0,s)}alert(e)}show_requests(){[].push(this.state.API_endpoint)}render_table_APIendpoint_selector(e,t,a){return l.a.createElement("tr",null,l.a.createElement("td",null,l.a.createElement("button",{className:"btn btn-primary btn-sm","data-toggle":"collapse","data-target":"#nicoapi_navber_APIendpoint_selector",onClick:()=>{"ニコニコ動画"==e?this.setState({API_endpoint:t,service_name:e,fields:JSON.stringify({[String(Date.now()-5)]:{field:"q",value:"ゆっくり解説"},[String(Date.now()-4)]:{field:"targets",value:"title,description,tags"},[String(Date.now()-3)]:{field:"fields",value:"contentId,title,description,tags"},[String(Date.now()-2)]:{field:"sort",value:"viewCounter"},[String(Date.now()-1)]:{field:"_limit",value:"100"},[String(Date.now()-0)]:{field:"_offset",value:"$for(1;1601;100)"}})}):this.setState({API_endpoint:t,service_name:e,fields:JSON.stringify({})})}},e)),l.a.createElement("td",null,""==a?l.a.createElement("div",null,"None"):l.a.createElement("a",{href:a},a)))}render_textform_APIendpoint(){return l.a.createElement("div",{className:"form-inline"},l.a.createElement("b",null,this.state.service_name),l.a.createElement("input",{type:"text",className:"form-control form-control-sm mx-1",size:60,value:this.state.API_endpoint,onChange:e=>{this.setState({API_endpoint:e.target.value,service_name:"カスタム"})}}))}render_table_filelds(){const e=Object.keys(JSON.parse(this.state.fields)).sort();alert(e);const t=[];let a=JSON.parse(this.state.fields);for(var n=0;n<e.length;n++){const s=[];s.push(l.a.createElement("td",{key:1},l.a.createElement("input",{type:"text",className:"form-control form-control-sm mx-1",value:JSON.parse(this.state.fields)[e[n]].field,onChange:e=>{a[e.target.name].field=e.target.value,this.setState({fields:JSON.stringify(a)})},name:e[n]}))),s.push(l.a.createElement("td",{key:2},l.a.createElement("input",{type:"text",className:"form-control form-control-sm mx-1",value:JSON.parse(this.state.fields)[e[n]].value,onChange:e=>{a[e.target.name].value=e.target.value,this.setState({fields:JSON.stringify(a)})},name:e[n]}))),s.push(l.a.createElement("td",{key:3},l.a.createElement("button",{className:"btn btn-warning btn-sm",onClick:e=>{a[e.target.name].value="$for(1;1601;500)",this.setState({fields:JSON.stringify(a)})},name:e[n]},"$for"))),s.push(l.a.createElement("td",{key:4},l.a.createElement("button",{className:"btn btn-outline-danger btn-sm rounded-pill",onClick:e=>{delete a[e.target.name],this.setState({fields:JSON.stringify(a)})},name:e[n]},"Delete"))),t.push(l.a.createElement("tr",{key:n},s))}return l.a.createElement("table",{className:"table table-sm"},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",{style:{width:"10%"}},"Field"),l.a.createElement("th",null,"Value"),l.a.createElement("th",{style:{width:"8%"}},"Command"),l.a.createElement("th",{style:{width:"8%"}},"Ops"))),l.a.createElement("tbody",null,t,l.a.createElement("tr",{className:"my-2"},l.a.createElement("td",null),l.a.createElement("td",{className:"d-flex justify-content-center"},l.a.createElement("button",{className:"btn btn-outline-primary rounded-pill",style:{width:"50%"},onClick:()=>{this.setState({fields:JSON.stringify(Object.assign(JSON.parse(this.state.fields),{[Date.now().toString()]:{field:"",value:""}}))})}},"+Add")),l.a.createElement("td",null,l.a.createElement("button",{className:"btn btn-success",onClick:()=>{this.db_update_orders(),this.generate_orders()}},"Launch")))))}render(){return l.a.createElement("div",{className:"m-2"},""==this.state.uid?l.a.createElement("h4",{className:"m-2"},"This application cant use without login"):l.a.createElement("div",null,l.a.createElement("div",{style:{backgroundColor:"lightcyan"}},l.a.createElement("div",{className:"collapse",id:"nicoapi_navber_help"},l.a.createElement("h4",{className:"d-flex justify-content-center",style:{fontStyle:"Sylfaen"}},"Command"),l.a.createElement("div",{className:"d-flex justify-content-center"},"一度に複数のリクエストを行う為の、特殊なvalueの仕方です。"),l.a.createElement("h5",null,"$for(A;B;C)"),l.a.createElement("li",{style:{listStyle:"none"}},"A:開始の数値 B:終了条件の数値(上限) C:インクリメント"),l.a.createElement("li",{style:{listStyle:"none"}},"一度のリクエストで得られるレコード数(limit)が限られる際等に、繰り返し要求を出すときに使用します。")),l.a.createElement("div",{className:"collapse",id:"nicoapi_navber_APIendpoint_selector"},l.a.createElement("table",{className:"table table-sm"},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"endpoint"),l.a.createElement("th",null,"reference"))),l.a.createElement("tbody",null,this.render_table_APIendpoint_selector("ニコニコ動画","https://api.search.nicovideo.jp/api/v2/video/contents/search","https://site.nicovideo.jp/search-api-docs/search.html"),this.render_table_APIendpoint_selector("ニコニコ生放送","https://api.search.nicovideo.jp/api/v2/live/contents/search","https://site.nicovideo.jp/search-api-docs/search.html"),this.render_table_APIendpoint_selector("なろう小説","https://api.syosetu.com/novelapi/api/","https://dev.syosetu.com/man/api/"),this.render_table_APIendpoint_selector("カスタム","https://","")))),l.a.createElement("nav",{className:"navbar",style:{backgroundColor:"paleturquoise"}},l.a.createElement("div",null,l.a.createElement("button",{className:"btn btn-primary mx-1","data-toggle":"collapse","data-target":"#nicoapi_navber_APIendpoint_selector"},"Select API_endpoint"),l.a.createElement("button",{className:"btn btn-success rounded-pill mx-1","data-toggle":"collapse","data-target":"#nicoapi_navber_help"},"HELP")),this.render_textform_APIendpoint())),this.render_table_filelds(),l.a.createElement("div",{style:{backgroundColor:"lightyellow"}},l.a.createElement("nav",{className:"navbar",style:{backgroundColor:"wheat"}},l.a.createElement("div",null,l.a.createElement("button",{className:"btn btn-info btn-sm","data-toggle":"collapse","data-target":"#nicoapi_navber_orders"},"Show_Orders")),l.a.createElement("div",null,l.a.createElement("button",{className:"btn btn-primary btn-sm mx-1"},"Download"),l.a.createElement("button",{className:"btn btn-danger btn-sm mx-1"},"Delete"))),l.a.createElement("div",{className:"collapse",id:"nicoapi_navber_orders"},l.a.createElement("table",{className:"table table-sm"},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"URL?query"),l.a.createElement("th",null,"timestamp"))),l.a.createElement("tbody",null))))))}}r.a.render(l.a.createElement(i.a,null),document.getElementById("account_tsx")),r.a.render(l.a.createElement(o,null),document.getElementById("nicoapi_tsx"))}]);
//# sourceMappingURL=nicoapi.js.map