
const GEMINI_API_KEY = "";

const users = [
  {
    name: "You",
    color: "#CD63E8",
  },
  {
    name: "Senuka",
    color: "#D7AFD4",
  },
  {
    name: "Gemini AI",
    color: "#ff0051"
  }
];

const messages = [];

let isAIEnabled = false;

setupUI();

function setupUI() {
  let user_1_label = document.getElementById("labelUserA");
  let user_2_label = document.getElementById("labelUserB");

  user_1_label.innerText = users[0].name;
  user_2_label.innerText = users[1].name;

  var input = document.getElementById("messageField");

  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

  switchChecked();
}

function isSwitchToggled() {
  return document.getElementById("userSwitch").checked;
}

function switchChecked() {
  let user_1_label = document.getElementById("labelUserA");
  let user_2_label = document.getElementById("labelUserB");

  let textField = document.getElementById("messageField");

  let userSwitch = document.getElementById("userSwitch");

  if (isSwitchToggled()) {
    userSwitch.style.backgroundColor = users[1].color;

    user_2_label.style.color = users[1].color;
    user_1_label.style.color = "white";
    textField.placeholder = `Send a message as ${users[1].name}`;
  } else {
    userSwitch.style.backgroundColor = users[0].color;

    user_1_label.style.color = users[0].color;
    user_2_label.style.color = "white";
    textField.placeholder = `Send a message as ${users[0].name}`;
  }
}

function updateMessages() {
  let chatContainer = document.getElementById("chatContainer");

  let msgHTML = "";

  messages.forEach((message) => {
    

    msgHTML += `
            <div class="row">
                <div class="col ${
                  message.user === 0 ? "text-end" : "text-start"
                } " >

                    ${
                      message.user === 1 || message.user === 2
                        ? `
                        <div class="d-inline-block rounded-circle text-start bg-success mt-2 me-2  mb-3  p-3 px-3 py-2 " style="position: sticky;" >
                            ${message.user === 1 ? users[message.user].name.at(0) : "AI"}
                        </div>    
                    `
                        : ""
                    }


                    <div class="message text-wrap d-inline-block ${message.user === 2 ? "text-white" : "text-black"}  d-inline-block  mt-3 mw-100 rounded-4 p-3 text-black" style="background-color: ${
                      users[message.user].color
                     }; "> 
                        
                        ${message.message}
                    </div>

                    ${
                      message.user === 0
                        ? `
                        <div class="d-inline-block rounded-circle text-end bg-success mb-4  p-3 px-3 py-2 ms-2" style="position: sticky;">
                            ${users[message.user].name.at(0)}
                        </div>    
                    `
                        : ""
                    }

                    <div class="opacity-50">
                        ${users[message.user].name} ${message.timeString}
                    </div>

                    
                </div>
        </div> 
        `;
  });

  chatContainer.innerHTML = msgHTML;
}

function toggleAI() {
  isAIEnabled = !document.getElementById("checkBoxToggleAI").checked;

  if (isAIEnabled) {
    document.getElementById("userSwitch").disabled = true;
  } else {
    document.getElementById("userSwitch").disabled = false;
  }
}

function sendMessage() {
  let userIndex = isSwitchToggled() ? 1 : 0;

  let messageField = document.getElementById("messageField");

  messages.push({
    user: userIndex,
    message: messageField.value,
    timeString: new Date().toLocaleTimeString(),
  });

  if (isAIEnabled) {
    console.log("Yes");

    getAIMessage(messageField.value).then(message => {        

        messages.push({
            user: 2,
            message: `<pre>${message}</pre>`,
            timeString: new Date().toLocaleTimeString(),
        });


        updateMessages();
    });
        

    
  }

  messageField.value = "";

  updateMessages();
}

async function getAIMessage(prompt) {
    let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, 

        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                
                "contents": [
                    {
                        "parts":[{"text": prompt}]
                    }
                ]
                  
            })
        
        }
    );

    

    let res = await response.json().then(obj => {
        return obj.candidates[0].content.parts[0].text;
    });

    return res;
}