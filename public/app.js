const chatBox = document.getElementById("chatBox");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const saveBtn = document.getElementById("saveBtn");

let sending = false;

/* ======================
SERVER CHECK
====================== */
async function checkServer() {
    const res = await fetch("/api/test");
    const data = await res.json();
    document.getElementById("status").innerText =
        data.message;
}
checkServer();

/* ======================
CHAT UI
====================== */

function addMessage(role, text) {

    const div = document.createElement("div");
    div.className = role;

    div.innerHTML = `<b>${role==="user"?"Bạn":"AI"}:</b> ${text}`;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* ======================
ASK AI
====================== */

async function ask() {

    const message = promptInput.value.trim();
    if (!message || sending) return;

    sending = true;

    addMessage("user", message);
    promptInput.value = "";

    try {

        const res = await fetch("/api/ai", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                prompt: message
            })
        });

        const data = await res.json();

        addMessage("ai", data.reply);

    } catch {
        addMessage("ai","❌ Server error");
    }

    sending = false;
}

/* BUTTON */
sendBtn.addEventListener("click", ask);

/* ENTER SEND ✅ */
promptInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        e.preventDefault();
        ask();
    }
});

/* ======================
JOURNAL
====================== */

async function saveNote(){

    const content =
        document.getElementById("content").value;

    if(!content) return;

    await fetch("/api/journal",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({content})
    });

    document.getElementById("content").value="";
    loadNotes();
}

saveBtn.addEventListener("click",saveNote);

async function loadNotes(){

    const res = await fetch("/api/journal");
    const data = await res.json();

    const history =
        document.getElementById("history");

    history.innerHTML="";

    data.forEach(n=>{
        history.innerHTML+=`
            <div class="note">
                ${n.content}
            </div>
        `;
    });
}

loadNotes();