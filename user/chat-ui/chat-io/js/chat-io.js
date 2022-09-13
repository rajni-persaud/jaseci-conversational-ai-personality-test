var sentinel_id = document.getElementById("app-interact").getAttribute('data-sentinelid');
var server = document.getElementById("app-interact").getAttribute('data-server');
var walker = document.getElementById("app-interact").getAttribute('data-walkername');
var token = document.getElementById("app-interact").getAttribute('data-token');
var last_jid = null;

// // Replace the script tag with the app
document.getElementById('app-interact').parentNode.innerHTML = `
<div id="chatio__${sentinel_id}">
  <div class="chat-bar-collapsible">
        <button id="chat-button" type="button" class="collapsible active">Chat with us!
            <i id="chat-icon" style="color: #fff;" class="fa fa-fw fa-comments-o"></i>
        </button>

        <div class="content">
            <div class="full-chat-block">
                <!-- Message Container -->
                <div class="outer-container">
                    <div class="chat-container">
                        <!-- Messages -->
                        <div id="chatbox">
                            <h5 id="chat-timestamp"></h5>
                            <!-- <p id="botStarterMessage" class="botText"><span>Loading...</span></p> -->
                        </div>

                        <!-- User input box -->
                        <div class="chat-bar-input-block">
                            <div id="userInput">
                                <input id="chatio__inputField" class="input-box" type="text" name="msg"
                                    placeholder="ask me something...">
                                <p></p>
                            </div>

                            <div class="chat-bar-icons">
                                <i id="chat-icon" style="color: #333;" class="fa fa-fw fa-send"
                                    onclick="sendButton()"></i>
                            </div>
                        </div>

                        <div id="chat-bar-bottom">
                            <p></p>
                        </div>

                    </div>
                </div>

            </div>
        </div>

    </div>
</div>`;


var user_id = null;
var user_index = null;

var inputField = document.getElementById('chatio__inputField');

var chat_messages = [];
//  $.ajax({
//     type: "GET",
//     async: false,
//     url: "../csr-bot/chat_data.json",
//     data: {},
//     success: function(chat_data){
//         console.log(chat_data);
//         chat_messages = chat_data; 
//     },
// });

welcome_message = "Welcome to NeXusU's personality test. We'll try our best to make you feel comfortable. If you wish, share your name with us. Otherwise, just press enter :)";

function detectURLs(text) {
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return text.match(urlRegex)
}

if (chat_messages.length < 1){
  chat_messages = [["bot", welcome_message]];
}

let conv = "";
let new_message = "";
update_messages();

function sendButton(){
    var utterance = inputField.value;
    if(utterance){
      chat_messages.push(["user", utterance]);
    }

    walker_run('take_test', utterance, last_jid, user_id, user_index).then((result) => {

      console.log(result.report);
      // console.log(last_jid);

      if(result.report[0].node) {
        last_jid = result.report[0].node.jid;
        // console.log(last_jid);

        if(result.report[0].node.context['q_text']){
          chat_messages.push(["bot", result.report[0].node.context['q_text']]);
        }
        if(result.report[0].user_id){
          user_id = result.report[0].user_id;
          user_index = result.report[0].user_index;
        }
        if(result.report[0].node.name == "user_response"){
          sendButton();
        }

        // std.out("Your personality type: ", my_personality["p_type"][0], "-", my_personality["p_type"][1]);
        // for d=0 to d < usc.length by d+=1{
        //     std.out(usc[d], " = ", uscv[d],"%");
        // }
        // std.out("Read more about your personality type here: ", p_link);

        update_messages();

        //show the response message in the chat
      } 
      else {
        // last_jid = null;
        if(user_id && result.report[0].my_personality){
          chat_messages.push(["bot", "Your personality type: "+result.report[0].my_personality["p_type"][0]+" - "+result.report[0].my_personality["p_type"][1]]);

          let my_personality_scores = result.report[0].my_personality["u_subcategories"];
          personality_scores_msg = ``;
          for (const [key, value] of Object.entries(my_personality_scores)) {
            personality_scores_msg = personality_scores_msg + key + ": " + value + "%" + "<br>";
          }
          chat_messages.push(["bot", personality_scores_msg]);

          pt_link = "https://www.16personalities.com/"+result.report[0].my_personality["p_code"].slice(0, -2)+"-personality";
          pt_link_message = "Read more about your personality type here: "+pt_link;
          pt_link_message = pt_link_message.replace(detectURLs(pt_link_message), "<a href='"+detectURLs(pt_link_message)+"' target='_blank'>"+detectURLs(pt_link_message)+"</a>");
          chat_messages.push(["bot", pt_link_message]);
        }
        // chat_messages.push(["bot", "Hmm.. I don't understand what you mean."]);
        update_messages();
      }

    }).catch(function (error) {
        console.log(error);
    });
    update_messages();
}
function update_messages() {
    conv = "";
    for (let i = 0; i < chat_messages.length; i++) {
        if(chat_messages[i][0] == "bot"){
            new_message = '<p class="botText"><span>' + chat_messages[i][1] + '</span></p>';
        }
        else{
            new_message = '<p class="userText"><span>' + chat_messages[i][1] + '</span></p>';
        }
        // let userHtml = '<p class="userText"><span>' + chat_messages[i] + '</span></p>';
        // let botHtml = '<p class="botText"><span>' + chat_messages[i] + '</span></p>';
        conv = conv + new_message;
        // $("#chatbox").append(userHtml);
        // $("#chatbox").append(botHtml);
      }
      document.getElementById("chatbox").innerHTML = conv;
      document.getElementById("chat-bar-bottom").scrollIntoView(true);
      inputField.value = '';
}

function walker_run(name, utterance="", nd = null, user_id, user_index) {

    query = `
    {
      "name": "${name}",
      "ctx": {"utterance": "${utterance}"},
      "snt": "${sentinel_id}",
      "detailed":"false"
    }
    `;
  
    if(nd) { //if we have a node param
      query = `
      {
        "name": "${name}",
        "nd" : "${nd}",
        "ctx": {"utterance": "${utterance}", "u_id":${user_id}, "user_index":${user_index}}, 
        "snt": "${sentinel_id}",
        "detailed":"false"
      }
      `;
    }
  
    return fetch(`${server}/js/walker_run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`
      },
      body: query,
    }).then(function (result) {
      return result.json();
    });
  }