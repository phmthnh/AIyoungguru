const chatBox=document.getElementById("chatBox");
const promptInput=document.getElementById("prompt");
const sendBtn=document.getElementById("sendBtn");

async function ask(){

const message=promptInput.value.trim();
if(!message) return;

addMsg("user",message);
promptInput.value="";

const res=await fetch("/api/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message})
});

const data=await res.json();

addMsg("ai",data.reply);
}

function addMsg(role,text){

const div=document.createElement("div");

div.className="msg "+role;

div.innerHTML=
role==="user"
? `<b>👨‍🎓 Bạn:</b><br>${text}`
: `<b>🤖 SmartStudy:</b><br>${text}`;

chatBox.appendChild(div);
chatBox.scrollTop=chatBox.scrollHeight;
}

sendBtn.onclick=ask;

promptInput.addEventListener("keydown",(e)=>{
if(e.key==="Enter"){
e.preventDefault();
ask();
}
});