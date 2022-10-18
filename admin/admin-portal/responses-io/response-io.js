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
      <div class="container" style="padding-top:5%;">
        Personality Type: <a href="${pt_link}" target="_blank">${u_personality['p_type'][0]} / ${u_personality['p_code']}</a>
      </div>

      <div class="container">
        <div style="text-align: center;">Summary of respondent's personality traits</div>
        <div class="row">
          <div class="col">
            <canvas id="mind_chart" style="max-width:250px;"></canvas>
          </div>
          <div class="col">
            <canvas id="energy_chart" style="max-width:250px;"></canvas>
          </div>
          <div class="col">
            <canvas id="nature_chart" style="max-width:250px;"></canvas>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <canvas id="tactics_chart" style="max-width:250px;"></canvas>
          </div>
          <div class="col">
            <canvas id="identity_chart" style="max-width:250px;"></canvas>
          </div>
        </div>
      </div>

    </div>
    `;

    sub_categories = u_personality['u_subcategories'];

    var mind_xValues = ["Introverted", "Extraverted"]
    var mind_yValues = [sub_categories[mind_xValues[0]], sub_categories[mind_xValues[1]]];
    var barColors = ["#45b6fe", "#daf0ff"];
    
    new Chart("mind_chart", {
      type: "doughnut",
      data: {
        labels: mind_xValues,
        datasets: [{
          backgroundColor: barColors,
          data: mind_yValues
        }]
      },
      options: {
        title: {
          display: true,
          text: "Mind"
        }
      }
    });

    var energy_xValues = ["Intuitive", "Observant"]
    var energy_yValues = [sub_categories[energy_xValues[0]], sub_categories[energy_xValues[1]]];
    var barColors = ["#45b6fe", "#daf0ff"];
    
    new Chart("energy_chart", {
      type: "doughnut",
      data: {
        labels: energy_xValues,
        datasets: [{
          backgroundColor: barColors,
          data: energy_yValues
        }]
      },
      options: {
        title: {
          display: true,
          text: "Energy"
        }
      }
    });

    var nature_xValues = ["Thinking", "Feeling"]
    var nature_yValues = [sub_categories[nature_xValues[0]], sub_categories[nature_xValues[1]]];
    var barColors = ["#45b6fe", "#daf0ff"];
    
    new Chart("nature_chart", {
      type: "doughnut",
      data: {
        labels: nature_xValues,
        datasets: [{
          backgroundColor: barColors,
          data: nature_yValues
        }]
      },
      options: {
        title: {
          display: true,
          text: "Nature"
        }
      }
    });

    var tactics_xValues = ["Judging", "Prospecting"]
    var tactics_yValues = [sub_categories[tactics_xValues[0]], sub_categories[tactics_xValues[1]]];
    var barColors = ["#45b6fe", "#daf0ff"];
    
    new Chart("tactics_chart", {
      type: "doughnut",
      data: {
        labels: tactics_xValues,
        datasets: [{
          backgroundColor: barColors,
          data: tactics_yValues
        }]
      },
      options: {
        title: {
          display: true,
          text: "Tactics"
        }
      }
    });

    var identity_xValues = ["Assertive", "Turbulent"]
    var identity_yValues = [sub_categories[identity_xValues[0]], sub_categories[identity_xValues[1]]];
    var barColors = ["#45b6fe", "#daf0ff"];
    
    new Chart("identity_chart", {
      type: "doughnut",
      data: {
        labels: identity_xValues,
        datasets: [{
          backgroundColor: barColors,
          data: identity_yValues
        }]
      },
      options: {
        title: {
          display: true,
          text: "Identity"
        }
      }
    });

}

