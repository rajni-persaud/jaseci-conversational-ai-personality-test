var sentinel_id = document.getElementById("app-interact").getAttribute('data-sentinelid');
var server = document.getElementById("app-interact").getAttribute('data-server');
var walker = document.getElementById("app-interact").getAttribute('data-walkername');
var token = document.getElementById("app-interact").getAttribute('data-token');
var last_jid = null;

// // Replace the script tag with the app
document.getElementById('app-interact').parentNode.innerHTML = `
<div id="chatio__${sentinel_id}">
  <div class="chat-bar-collapsible">
        <button id="chat-button" type="button" class="collapsible active" style="padding-bottom:5px;"><img src="../../assets/nxu-logo.png" width="45" alt="">Personality Test
        </button>
        <div class="w3-light-grey">
         <div class="w3-grey" style="color: #1a58a5; height:10px;width:0%"></div>
        </div>
        <div id="prg_score" class="prg-per"></div>
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
                        <div id="pt_chart" style="display:none; width: 540px; height: 320px;">
                          <canvas id="ctx" style = "max-width:520px; max-height:300px; margin-left:2%;"></canvas>
                        </div>
                        <!-- User input box -->
                        <div class="chat-bar-input-block">
                            <div id="userInput">
                                <input id="chatio__inputField" class="input-box" type="text" name="msg"
                                    placeholder="ask me something...">
                                <p></p>
                            </div>

                            <div class="chat-bar-icons">
                              <span class="fa-stack fa-1x">
                                <i class="fa fa-circle fa-stack-2x icon-background"></i>
                                <i id="chat-icon" class="fa fa-send fa-stack-1x" onclick="sendButton()"></i>
                              </span>    
                              
                              <span class="fa-stack fa-1x">
                                <i id="mic-bg" class="fa fa-circle fa-stack-2x icon-background"></i>
                                <i id="mic-btn" class="fa fa-microphone fa-stack-1x" onclick="mic_click()"></i>
                              </span>
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

var total_q = 0;
var current_q = 0;

var inputField = document.getElementById('chatio__inputField');

var chat_messages = [];

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

function readOutLoud(message){
  speech = new SpeechSynthesisUtterance(message);
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
  speech.onend = (event) => {
    // console.log(`Utterance has finished being spoken after ${event.elapsedTime} seconds.`);
    mic_click();
  }
  
}

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
          readOutLoud(result.report[0].node.context['q_text']);
          current_q = result.report[0].my_response.num_response;
          total_q = result.report[0].my_response.num_question;
          progress = (current_q/total_q)*100;
          if(progress > 0){
            document.getElementsByClassName("w3-grey")[0].style.width = progress+"%";
            document.getElementById("prg_score").innerHTML = progress.toFixed(2)+"%";
          }
        }
        if(result.report[0].user_id){
          user_id = result.report[0].user_id;
          user_index = result.report[0].user_index;
        }
        if(result.report[0].node.name == "user_response"){
          sendButton();
          document.getElementsByClassName("w3-grey")[0].style.width = "100%";
          document.getElementById("prg_score").innerHTML = "100%";
        }

        update_messages();

        if(result.report[0].node.name == "user_response"){
          document.getElementById('pt_chart').style.display = "block";
        }

        //show the response message in the chat
      } 
      else {
        // last_jid = null;
        if(user_id && result.report[0].my_personality){
          // chat_messages.push(["bot", "Your personality type: "+result.report[0].my_personality["p_type"][0]+" - "+result.report[0].my_personality["p_type"][1]]);

          let my_personality_scores = result.report[0].my_personality["u_subcategories"];
          // personality_scores_msg = ``;
          // var barColors = [];
          // for (const [key, value] of Object.entries(my_personality_scores)) {
          //   personality_scores_msg = personality_scores_msg + key + ": " + value + "%" + "<br>";
          //   barColors.push("blue");
          // }
          // chat_messages.push(["bot", personality_scores_msg]);

          pt_link = "https://www.16personalities.com/"+result.report[0].my_personality["p_code"].slice(0, -2)+"-personality";
          // pt_link_message = "Read more about your personality type here: "+pt_link;
          // pt_link_message = pt_link_message.replace(detectURLs(pt_link_message), "<a href='"+detectURLs(pt_link_message)+"' target='_blank'>"+detectURLs(pt_link_message)+"</a>");
          // chat_messages.push(["bot", pt_link_message]);

          chat_messages.push(["bot", "Your personality type is "+result.report[0].my_personality["p_type"][0]+"; "+result.report[0].my_personality["p_type"][1].toLowerCase()+" The graph below shows a summary of your personality traits. You can learn more about the <a href='"+pt_link+"' target='_blank'>"+result.report[0].my_personality["p_type"][0]+"</a> personality type here. Thank you."]);
          

          var xValues = Object.keys(my_personality_scores);
          var yValues = Object.values(my_personality_scores);

          // new Chart("myChart", {
          //   type: "bar",
          //   data: {
          //     labels: xValues,
          //     datasets: [{
          //       backgroundColor: barColors,
          //       data: yValues
          //     }]
          //   },
          //   options: {
          //     legend: {display: false},
          //     title: {
          //       display: true,
          //       text: "Your personality traits"
          //     }, 
          //     barValueSpacing: 20,
          //     scales: {
          //       yAxes: [{
          //         ticks: {
          //           min: 0,
          //           max: 100
          //         }
          //       }]
          //     }
          //   }
          // });


          var chart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
               labels: ["Mind", "Energy", "Nature", "Tactics", "Identity"],
               datasets: [{
                  label: 'Introverted',
                  data: [yValues[0], 0, 0, 0, 0],
                  backgroundColor: '#8B0000'
               }, {
                  label: 'Extraverted',
                  data: [yValues[1], 0, 0, 0, 0],
                  backgroundColor: '#FF0000'
               }, {
                  label: 'Observant',
                  data: [0, yValues[2], 0, 0, 0],
                  backgroundColor: '#8B4000'
               }, {
                  label: 'Intuitive',
                  data: [0, yValues[3], 0, 0, 0],
                  backgroundColor: '#FFA500'
               }, {
                  label: 'Thinking',
                  data: [0, 0, yValues[4], 0, 0],
                  backgroundColor: '#FFD700'
               }, {
                  label: 'Feeling',
                  data: [0, 0, yValues[5], 0, 0],
                  backgroundColor: '#FFFF00'
               }, {
                  label: 'Judging',
                  data: [0, 0, 0, yValues[6], 0],
                  backgroundColor: '#008000'
               }, {
                  label: 'Prospecting',
                  data: [0, 0, 0, yValues[7], 0],
                  backgroundColor: '#7CFC00'
               }, {
                  label: 'Assertive',
                  data: [0, 0, 0, 0, yValues[8]],
                  backgroundColor: '#00008B'
               }, {
                  label: 'Turbulent',
                  data: [0, 0, 0, 0, yValues[9]],
                  backgroundColor: '#0000FF'
               }]
            },
            options: {
               responsive: true,
              title: {
                display: false,
                text: "Stacked bar chart showing your personality traits"
              },
               legend: {
                  position: 'right'
               },
               scales: {
                  xAxes: [{
                     stacked: true
                  }],
                  yAxes: [{
                     stacked: true
                  }]
               }
            }
          });

        }

        update_messages();
      }

    }).catch(function (error) {
        console.log(error);
    });
    update_messages();
}

// ----------------- Microphone --------------------------
var speechRecognition = window.webkitSpeechRecognition

var recognition = new speechRecognition()

var textbox = $("#chatio__inputField")

var content = ''

recognition.continuous = false

stat = true

recognition.onstart = function(){
    console.log("Recording start")
    document.getElementById("mic-btn").style.color = "#ffffff";
    document.getElementById("mic-bg").style.color = "#1a58a5";
}

recognition.onend = function(){
    console.log("Recording end")
    document.getElementById("mic-btn").style.color = "#000000";
    document.getElementById("mic-bg").style.color = "rgb(235, 235, 235)";
    sendButton()
    content = ''
    stat = true
}

recognition.onresult = function(event){
    var current = event.resultIndex;
    var transcript = event.results[current][0].transcript
    content += transcript
    textbox.val(content)
}

function mic_click(){
  if(stat){
      if(content.length){
          content += ''
      }
  
      recognition.continuous = false
      recognition.start()
      stat = false   
  }
  else{
      recognition.stop()
  }
}

// ----------------- Microphone --------------------------

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