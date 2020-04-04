!function(e){var t={};function a(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=6)}([function(e,t){e.exports=React},function(e,t){e.exports=firebase},function(e,t,a){"use strict";a.d(t,"d",(function(){return o})),a.d(t,"b",(function(){return c})),a.d(t,"e",(function(){return i})),a.d(t,"c",(function(){return m})),a.d(t,"a",(function(){return d}));var n=a(0),r=a.n(n),s=a(1),l=a.n(s);l.a.initializeApp({apiKey:"AIzaSyCWzFat3oUpn_4TtOpDCMhcOD2Qf4u1Mr4",authDomain:"crack-atlas-251509.firebaseapp.com",databaseURL:"https://crack-atlas-251509.firebaseio.com",projectId:"crack-atlas-251509",storageBucket:"crack-atlas-251509.appspot.com",messagingSenderId:"646437940818",appId:"1:646437940818:web:080ff48019a68c74d3b98b",measurementId:"G-QLHKJ38SWW"}),l.a.analytics();const o=l.a;var c=l.a.auth(),i=l.a.storage(),m=l.a.firestore();class d extends r.a.Component{signup(){c.createUserWithEmailAndPassword(this.state.mail_addr,this.state.mail_pass).catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}signin(){c.signInWithEmailAndPassword(this.state.mail_addr,this.state.mail_pass).catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}pass_reset(){c.sendPasswordResetEmail(this.state.mail_addr).then(()=>{alert("SEND_EMAIL!")}).catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}account_delete(){c.currentUser.delete().then(()=>{alert("ACCOUNT_DELETED!")}).catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}signin_easy(){c.signInWithEmailAndPassword("a@b.com","asdfgh").catch(()=>{c.createUserWithEmailAndPassword("a@b.com","asdfgh").catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})})}google_login(){c.signInWithPopup(new l.a.auth.GoogleAuthProvider).then().catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}constructor(e){super(e),this.state={uid:"",mail_addr:"",mail_pass:""},setInterval(()=>{c.currentUser?this.state.uid!=c.currentUser.uid&&this.setState({uid:c.currentUser.uid}):""!=this.state.uid&&this.setState({uid:""})},100)}accountmodal_render(e,t){let a="mygape_modal_"+e,n="#"+a;return t=t.bind(this),r.a.createElement("div",null,r.a.createElement("button",{type:"button",className:"btn btn-primary btn-sm mx-1","data-toggle":"modal","data-target":n},e),r.a.createElement("div",{className:"modal fade",id:a,role:"dialog","aria-hidden":"true"},r.a.createElement("div",{className:"modal-dialog modal-lg",role:"document"},r.a.createElement("div",{className:"modal-content"},r.a.createElement("div",{className:"modal-header"},r.a.createElement("h5",{className:"modal-title"},e)),r.a.createElement("div",{className:"modal-body row"},r.a.createElement("input",{type:"text",name:"mail_addr",className:"form-control col-6",placeholder:"mail_address",onChange:e=>{this.setState({mail_addr:e.target.value})}}),r.a.createElement("input",{type:"text",name:"mail_pass",className:"form-control col-6",placeholder:"set_password",onChange:e=>{this.setState({mail_pass:e.target.value})}})),r.a.createElement("div",{className:"modal-footer"},r.a.createElement("button",{type:"button",className:"btn btn-primary","data-dismiss":"modal",onClick:t},"Submit"),r.a.createElement("button",{type:"button",className:"btn btn-secondary","data-dismiss":"modal"},"Close"))))))}render(){return r.a.createElement("div",{className:"bg-light p-2"},""==this.state.uid?r.a.createElement("div",{className:"d-flex justify-content-between"},r.a.createElement("h5",null,"サービスを利用するには、ログインしてください"),r.a.createElement("div",{className:"ml-auto"},r.a.createElement("div",{className:"form-inline"},r.a.createElement("input",{type:"button",value:"Googleでログイン",className:"btn btn-success mx-1 btn-sm",onClick:this.google_login}),this.accountmodal_render("Sign_in",this.signin),this.accountmodal_render("Sign_up",this.signup),r.a.createElement("button",{type:"button",className:"btn btn-warning mx-1 btn-sm",onClick:this.signin_easy},"Easy_login")))):r.a.createElement("div",{className:"d-flex justify-content-between"},r.a.createElement("div",null,c.currentUser.photoURL?r.a.createElement("img",{src:c.currentUser.photoURL,alt:"user.photoURL",width:"64",height:"64"}):r.a.createElement("div",null),c.currentUser.displayName?r.a.createElement("h6",null,"ようこそ ",c.currentUser.displayName," さん"):r.a.createElement("h6",null,"ようこそ ",c.currentUser.email," さん")),r.a.createElement("div",{className:"form-inline"},r.a.createElement("button",{type:"button",className:"btn btn-secondary btn-sm mx-1",onClick:()=>{c.signOut()}},"logout"),r.a.createElement("button",{type:"button",className:"btn btn-warning btn-sm mx-1","data-toggle":"modal","data-target":"#account_modal_config"},"config"),r.a.createElement("div",{className:"modal fade",id:"account_modal_config",role:"dialog","aria-hidden":"true"},r.a.createElement("div",{className:"modal-dialog",role:"document"},r.a.createElement("div",{className:"modal-content"},r.a.createElement("div",{className:"modal-header"},r.a.createElement("h5",{className:"modal-title"},"Config")),r.a.createElement("div",{className:"modal-body row"},r.a.createElement("input",{type:"text",name:"mail_addr",className:"form-control col-12",placeholder:"send mail for password_reset"})),r.a.createElement("div",{className:"modal-footer"},r.a.createElement("button",{type:"button",className:"btn btn-sm btn-warning","data-dismiss":"modal"},"password_reset"),r.a.createElement("button",{type:"button",className:"btn btn-sm btn-danger","data-dismiss":"modal"},"account_delete"),r.a.createElement("button",{type:"button",className:"btn btn-secondary","data-dismiss":"modal"},"Close"))))))))}}},function(e,t){e.exports=ReactDOM},,,function(e,t,a){"use strict";a.r(t),a.d(t,"Tptef_tsx",(function(){return c}));var n=a(0),r=a.n(n),s=a(3),l=a.n(s),o=a(2);class c extends r.a.Component{db_load_room(){if(""==this.state.room)return;o.c.collection("tptef").doc(this.state.room).get().then(e=>{e.exists?this.setState({thread:JSON.stringify(e.data())}):this.setState({thread:JSON.stringify({NULL:{handlename:"NULL",uid:"NULL",content:"Thread is not exist",date:Date.now().toString(),attachment_name:"",attachment_dir:""}})})})}db_update_remark_add(e,t){if(""==this.state.uid||""==this.state.room)return;if(""==e)return void alert("Plz input content");const a=o.c.collection("tptef").doc(this.state.room),n=Date.now().toString();let r="",s="";a.get().then(l=>{l.exists||a.set({}),t&&(r=t.name,s="tptef/"+this.state.room+"/"+n,o.e.ref(s).put(t)),a.update({[n]:{handlename:this.state.handlename,uid:this.state.uid,content:e,date:Date.now().toString(),attachment_name:r,attachment_dir:s}})}),setTimeout(this.db_load_room,500)}storage_download(e){o.e.ref(e).getDownloadURL().then(e=>{window.open(e,"_blank")}).catch(()=>{alert("cant download")})}db_update_remark_del(e){if(""==this.state.uid||""==this.state.room)return;const t=o.c.collection("tptef").doc(this.state.room);t.get().then(a=>{a.exists&&(a.data()[e].attachment_dir&&o.e.ref(a.data()[e].attachment_dir).delete(),t.update({[e]:o.d.firestore.FieldValue.delete()})),Object.keys(a.data()).length<2&&t.delete()}),setTimeout(this.db_load_room,500)}render_table_thread(){const e=JSON.parse(this.state.thread),t=[],a=Object.keys(e).sort();for(var n=0;n<a.length;n++){const s=[];s.push(r.a.createElement("div",{style:{display:"none"}},a[n])),s.push(r.a.createElement("td",null,e[a[n]].handlename)),s.push(r.a.createElement("td",null,e[a[n]].content)),s.push(r.a.createElement("td",{style:{fontSize:"12px"}},e[a[n]].date,r.a.createElement("br",null),e[a[n]].uid));{const t=[];e[a[n]].uid==this.state.uid&&t.push(r.a.createElement("button",{className:"btn btn-danger btn-sm mx-1",onClick:e=>{this.db_update_remark_del(e.currentTarget.children[0].innerHTML)}},"delete",r.a.createElement("div",{style:{display:"none"}},a[n]))),""!=e[a[n]].attachment_name&&t.push(r.a.createElement("button",{className:"btn btn-primary btn-sm mx-1",onClick:e=>{this.storage_download(e.currentTarget.children[0].innerHTML)}},e[a[n]].attachment_name,r.a.createElement("div",{style:{display:"none"}},e[a[n]].attachment_dir))),s.push(r.a.createElement("td",null,t))}t.push(r.a.createElement("tr",null,s))}return r.a.createElement("tbody",null,t)}constructor(e){super(e),this.state={uid:"",room:"main",handlename:"窓の民は名無し",thread:JSON.stringify({})},this.db_load_room=this.db_load_room.bind(this),setInterval(()=>{o.b.currentUser?this.state.uid!=o.b.currentUser.uid&&this.setState({uid:o.b.currentUser.uid}):""!=this.state.uid&&this.setState({uid:""})},200)}componentDidMount(){this.db_load_room()}render(){return r.a.createElement("div",{className:"m-2"},r.a.createElement("h2",{style:{color:"black"}},"Chat_Room"),r.a.createElement("div",{className:"d-flex justify-content-between"},r.a.createElement("input",{className:"form-control",id:"room_name",type:"text",value:this.state.room,placeholder:"Room",onChange:e=>{this.setState({room:e.target.value})}}),r.a.createElement("button",{className:"btn btn-success btn-sm ml-auto",onClick:()=>{this.db_load_room()}},"Goto_Room")),r.a.createElement("table",{className:"table table-sm bg-light"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",{style:{width:"15%"}},"handlename"),r.a.createElement("th",null,"content"),r.a.createElement("th",{style:{width:"15%"}},"timestamp/uid"),r.a.createElement("th",{style:{width:"15%"}},"ops"))),this.render_table_thread()),""==this.state.uid?r.a.createElement("h4",{className:"m-2"},"Plz login to submit"):r.a.createElement("div",{className:"mt-2 p-2",style:{color:"#AAFEFE",border:"3px double silver",background:"#001111"}},r.a.createElement("h5",{style:{color:"white",fontStyle:""}},"入力フォーム"),r.a.createElement("textarea",{className:"form-control my-1",id:"tptef_content",rows:6}),r.a.createElement("div",{className:"my-1 d-flex justify-content-between"},r.a.createElement("div",{className:"ml-auto"},r.a.createElement("div",{className:"form-inline"},r.a.createElement("input",{className:"form-control form-control-sm mx-1",type:"text",value:this.state.handlename,onChange:e=>{this.setState({handlename:e.target.value})}}),r.a.createElement("input",{type:"file",id:"tptef_attachment"}),r.a.createElement("button",{className:"btn btn-primary btn-sm mx-1",onClick:()=>{this.db_update_remark_add(document.getElementById("tptef_content").value,document.getElementById("tptef_attachment").files[0]),document.getElementById("tptef_content").value="",document.getElementById("tptef_attachment").value=""}},"remark"))))))}}l.a.render(r.a.createElement(o.a,null),document.getElementById("account_tsx")),l.a.render(r.a.createElement(c,null),document.getElementById("tptef_tsx"))}]);
//# sourceMappingURL=tptef.js.map