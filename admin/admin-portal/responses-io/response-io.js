var sentinel_id = document.getElementById("app-interact").getAttribute('data-sentinelid');
var server = document.getElementById("app-interact").getAttribute('data-server');
var walker = document.getElementById("app-interact").getAttribute('data-walkername');
var token = document.getElementById("app-interact").getAttribute('data-token');
var last_jid = null;

// // Replace the script tag with the app
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const uid = urlParams.get('uid');

var responses = [];
 $.ajax({
    type: "GET",
    async: false,
    url: "../../../data/user_responses.json",
    data: {},
    success: function(responses_data){
        responses = responses_data; 
    },
});

var user_pts = [];
 $.ajax({
    type: "GET",
    async: false,
    url: "../../../data/user_personalities.json",
    data: {},
    success: function(user_pt_data){
        user_pts = user_pt_data; 
    },
});

r_user_ids = [];
for (u=0; u<responses.length; u++){r_user_ids.push(responses[u]['user_id'])}

p_user_ids = [];
for (u=0; u<user_pts.length; u++){p_user_ids.push(user_pts[u]['user_id'])}

user_index = [r_user_ids.indexOf(Number(uid)), p_user_ids.indexOf(Number(uid))];

if(user_index[0] > -1){u_response = responses[user_index[0]];} 
if(user_index[1] > -1){u_personality = user_pts[user_index[1]];}

if(user_index[0] == -1){
  document.getElementById('app-interact').parentNode.innerHTML = `
    <div id="response_io${sentinel_id}">
      <!-- NAVBAR--><nav class="navbar navbar-expand-lg navbar-dark"></nav><!-- NAVBAR-->
      <br/>
      <div id="no_response" class="center">
        <img src="../../../assets/nxu-logo.png" width="25%" height="25%">
        <p>This response doesn't exist</p>
        <button type="button" class="btn btn-primary" onclick="location.href='./responses.html'">See other responses</button>
      </div>  
    </div>
    `;
}
else if(user_index[1] == -1){
  document.getElementById('app-interact').parentNode.innerHTML = `
    <div id="response_io${sentinel_id}">
      <!-- NAVBAR--><nav class="navbar navbar-expand-lg navbar-dark"></nav><!-- NAVBAR-->
      <br/>
      <div id="no_response" class="center">
        <img src="../../../assets/nxu-logo.png" width="25%" height="25%">
        <p>The user did not complete this test. As such, a personality was not assigned.</p>
        <button type="button" class="btn btn-primary" onclick="location.href='./responses.html'">See other responses</button>
      </div>  
    </div>
    `;
}
else{
  
  console.log(u_response);
  console.log(u_personality);
  pt_link = "https://www.16personalities.com/"+u_personality["p_code"].slice(0, -2)+"-personality";

  document.getElementById('app-interact').parentNode.innerHTML = `
    <div id="response_io${sentinel_id}">
      <!-- NAVBAR--><nav class="navbar navbar-expand-lg navbar-dark"></nav><!-- NAVBAR-->
      <br/>
      <div class="container">

        <div class="row">
          <div class="col-sm">
            Personality Type:
          </div>
          <div class="col-lg">
          ${u_personality['p_type'][0]}
          </div>
        </div>

        <div class="row">
          <div class="col-sm">
            Personality Code:
          </div>
          <div class="col-lg">
          <a href="${pt_link}" target="_blank">${u_personality['p_code']}</a>
          </div>
        </div>

      </div>
      <canvas id="myChart" style="width:100%;max-width:600px"></canvas>
    </div>
    `;
    
}