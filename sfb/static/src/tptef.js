!function(e){var t={};function a(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=5)}([function(e,t){e.exports=React},function(e,t){e.exports=firebase},function(e,t,a){"use strict";a.d(t,"b",(function(){return o})),a.d(t,"d",(function(){return c})),a.d(t,"c",(function(){return i})),a.d(t,"a",(function(){return m}));var n=a(0),r=a.n(n),s=a(1),l=a.n(s);l.a.initializeApp({apiKey:"AIzaSyCWzFat3oUpn_4TtOpDCMhcOD2Qf4u1Mr4",authDomain:"crack-atlas-251509.firebaseapp.com",databaseURL:"https://crack-atlas-251509.firebaseio.com",projectId:"crack-atlas-251509",storageBucket:"crack-atlas-251509.appspot.com",messagingSenderId:"646437940818",appId:"1:646437940818:web:080ff48019a68c74d3b98b",measurementId:"G-QLHKJ38SWW"}),l.a.analytics();var o=l.a.auth(),c=l.a.storage(),i=l.a.firestore();class m extends r.a.Component{signup(){o.createUserWithEmailAndPassword(this.state.mail_addr,this.state.mail_pass).catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}signin(){o.signInWithEmailAndPassword(this.state.mail_addr,this.state.mail_pass).catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}pass_reset(){o.sendPasswordResetEmail(this.state.mail_addr).then(()=>{alert("SEND_EMAIL!")}).catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}account_delete(){o.currentUser.delete().then(()=>{alert("ACCOUNT_DELETED!")}).catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}signin_easy(){o.signInWithEmailAndPassword("a@b.com","asdfgh").catch(()=>{o.createUserWithEmailAndPassword("a@b.com","asdfgh").catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})})}google_login(){o.signInWithPopup(new l.a.auth.GoogleAuthProvider).then().catch(e=>{alert("error_code:"+e.code+"\nerror_message:"+e.message)})}constructor(e){super(e),this.state={uid:"",mail_addr:"",mail_pass:""},setInterval(()=>{o.currentUser?this.state.uid!=o.currentUser.uid&&this.setState({uid:o.currentUser.uid}):""!=this.state.uid&&this.setState({uid:""})},100)}accountmodal_render(e,t){let a="mygape_modal_"+e,n="#"+a;return t=t.bind(this),r.a.createElement("div",null,r.a.createElement("button",{type:"button",className:"btn btn-primary btn-sm mx-1","data-toggle":"modal","data-target":n},e),r.a.createElement("div",{className:"modal fade",id:a,role:"dialog","aria-hidden":"true"},r.a.createElement("div",{className:"modal-dialog modal-lg",role:"document"},r.a.createElement("div",{className:"modal-content"},r.a.createElement("div",{className:"modal-header"},r.a.createElement("h5",{className:"modal-title"},e)),r.a.createElement("div",{className:"modal-body row"},r.a.createElement("input",{type:"text",name:"mail_addr",className:"form-control col-6",placeholder:"mail_address",onChange:e=>{this.setState({mail_addr:e.target.value})}}),r.a.createElement("input",{type:"text",name:"mail_pass",className:"form-control col-6",placeholder:"set_password",onChange:e=>{this.setState({mail_pass:e.target.value})}})),r.a.createElement("div",{className:"modal-footer"},r.a.createElement("button",{type:"button",className:"btn btn-primary","data-dismiss":"modal",onClick:t},"Submit"),r.a.createElement("button",{type:"button",className:"btn btn-secondary","data-dismiss":"modal"},"Close"))))))}render(){return r.a.createElement("div",{className:"bg-light p-2"},""!=this.state.uid?r.a.createElement("div",{className:"d-flex justify-content-between"},r.a.createElement("div",null,o.currentUser.photoURL?r.a.createElement("img",{src:o.currentUser.photoURL,alt:"user.photoURL",width:"64",height:"64"}):r.a.createElement("div",null),o.currentUser.displayName?r.a.createElement("h6",null,"ようこそ ",o.currentUser.displayName," さん"):r.a.createElement("h6",null,"ようこそ ",o.currentUser.email," さん")),r.a.createElement("div",{className:"form-inline"},r.a.createElement("button",{type:"button",className:"btn btn-secondary btn-sm mx-1",onClick:()=>{o.signOut()}},"logout"),r.a.createElement("button",{type:"button",className:"btn btn-warning btn-sm mx-1","data-toggle":"modal","data-target":"#account_modal_config"},"config"),r.a.createElement("div",{className:"modal fade",id:"account_modal_config",role:"dialog","aria-hidden":"true"},r.a.createElement("div",{className:"modal-dialog",role:"document"},r.a.createElement("div",{className:"modal-content"},r.a.createElement("div",{className:"modal-header"},r.a.createElement("h5",{className:"modal-title"},"Config")),r.a.createElement("div",{className:"modal-body row"},r.a.createElement("input",{type:"text",name:"mail_addr",className:"form-control col-12",placeholder:"send mail for password_reset"})),r.a.createElement("div",{className:"modal-footer"},r.a.createElement("button",{type:"button",className:"btn btn-sm btn-warning","data-dismiss":"modal"},"password_reset"),r.a.createElement("button",{type:"button",className:"btn btn-sm btn-danger","data-dismiss":"modal"},"account_delete"),r.a.createElement("button",{type:"button",className:"btn btn-secondary","data-dismiss":"modal"},"Close"))))))):r.a.createElement("div",{className:"d-flex justify-content-between"},r.a.createElement("h5",null,"サービスを利用するには、ログインしてください"),r.a.createElement("div",{className:"ml-auto"},r.a.createElement("div",{className:"form-inline"},r.a.createElement("input",{type:"button",value:"Googleでログイン",className:"btn btn-success mx-1 btn-sm",onClick:this.google_login}),this.accountmodal_render("Sign_in",this.signin),this.accountmodal_render("Sign_up",this.signup),r.a.createElement("button",{type:"button",className:"btn btn-warning mx-1 btn-sm",onClick:this.signin_easy},"Easy_login")))))}}},function(e,t){e.exports=ReactDOM},,function(e,t,a){"use strict";a.r(t),a.d(t,"Tptef_tsx",(function(){return c}));var n=a(0),r=a.n(n),s=a(3),l=a.n(s),o=a(2);class c extends r.a.Component{load_room(){if(""==this.state.room)return;let e=o.c.collection("tptef").doc(this.state.room);e.get().then(t=>{t.exists?this.setState({thread:t.data()}):(e.set({}),this.setState({thread:{}}))})}thread_table_render(e){alert("A");const t=[];let a=Object.keys(e).sort();alert("B");for(var n=0;n<a.length;n++){const s=[];s.push(r.a.createElement("td",null,e[a[n]].user)),t.push(r.a.createElement("tr",null,s))}return alert("V"),r.a.createElement("tbody",null,t)}constructor(e){super(e),this.state={room:"main",thread:null},setInterval(()=>{o.b.currentUser?this.state.uid!=o.b.currentUser.uid&&this.setState({uid:o.b.currentUser.uid}):""!=this.state.uid&&this.setState({uid:""})},100)}render(){return r.a.createElement("div",{className:"m-2"},r.a.createElement("h2",{style:{color:"black"}},"Chat_Room"),r.a.createElement("div",{className:"d-flex justify-content-between"},r.a.createElement("input",{type:"text",id:"room_name",className:"form-control",value:this.state.room,placeholder:"Room",onChange:e=>{this.setState({room:e.target.value})}}),r.a.createElement("button",{type:"button",className:"btn btn-success btn-sm ml-auto",onClick:()=>{this.load_room()}},"Goto_Room")),r.a.createElement("table",{className:"table table-sm bg-light"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",{style:{width:"15%"}}," user_name "),r.a.createElement("th",null,"content"),r.a.createElement("th",{style:{width:"15%"}}," timestamp/uid "),r.a.createElement("th",{style:{width:"15%"}},"ops"))),this.thread_table_render({})),r.a.createElement("div",{className:"mt-2 p-2",style:{color:"#AAFEFE",border:"3px double silver",background:"#001111"}},r.a.createElement("div",{id:"submits",style:{display:"none"}})))}}l.a.render(r.a.createElement(o.a,null),document.getElementById("account_tsx")),l.a.render(r.a.createElement(c,null),document.getElementById("tptef_tsx"))}]);
//# sourceMappingURL=tptef.js.map