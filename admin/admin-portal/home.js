var sentinel_id = document.getElementById("app-interact").getAttribute('data-sentinelid');
var server = document.getElementById("app-interact").getAttribute('data-server');
var walker = document.getElementById("app-interact").getAttribute('data-walkername');
var token = document.getElementById("app-interact").getAttribute('data-token');
var last_jid = null;

var questions = [];
 $.ajax({
    type: "GET",
    async: false,
    url: "../../../data/questions_dir.json",
    data: {},
    success: function(questions_data){
        questions = questions_data; 
    },
});

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

question_categories = ["Mind", "Energy", "Nature", "Tactics", "Identity"];
qc_count = {};
for (i=0; i<question_categories.length; i++){
  qc_count[question_categories[i]] = 0;
}
for (i=0; i<questions.length; i++){
  qc_count[questions[i]["q_category"]] =  qc_count[questions[i]["q_category"]] + 1;
}
qc_num = [qc_count[question_categories[0]], qc_count[question_categories[1]], qc_count[question_categories[2]], qc_count[question_categories[3]], qc_count[question_categories[4]]];

pt_types = [];
pt_types_num = {};
for (i=0; i<user_pts.length; i++){
  if (!pt_types.includes(user_pts[i]["p_type"][0])){
    pt_types.push(user_pts[i]["p_type"][0]);
    pt_types_num[user_pts[i]["p_type"][0]] = 0;
  }
}

for (i=0; i<user_pts.length; i++){
  pt_types_num[user_pts[i]["p_type"][0]] = pt_types_num[user_pts[i]["p_type"][0]] + 1;
}

document.getElementById('app-interact').parentNode.innerHTML = `
    <div id="home${sentinel_id}">
      <!-- NAVBAR--><nav class="navbar navbar-expand-lg navbar-dark" style="position:sticky;"></nav><!-- NAVBAR-->
      <br/>

      <div class="container">
        <div class="row">
          <div class="col">
            <canvas id="questions_by_category" style="max-width:350px;"></canvas>
          </div>
          <div class="col">
            <canvas id="users_pt" style="max-width:300px;"></canvas>
          </div>
        </div>
      </div>
    </div>
    `;

    var xValues = question_categories;
    var yValues = qc_num;
    var barColors = ["#45b6fe", "#6ac5fe", "#8fd3fe", "#b5e2ff", "#daf0ff"];
    
    new Chart("questions_by_category", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        legend: {display: false},
        title: {
          display: true,
          text: "Number of questions per category"
        }, 
        barValueSpacing: 20,
        scales: {
          yAxes: [{
            ticks: {
              min: 0
            }
          }]
        }
      }
    });

    var xValues = Object.keys(pt_types_num);
    var yValues = Object.values(pt_types_num);
    var barColors = ['#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'];
    
    new Chart("users_pt", {
      type: "pie",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        title: {
          display: true,
          text: "Pie Chart showing users' personality types"
        },

        responsive: true,
        legend: {
            display: true,
            position: "bottom",
            align: "start"
        }
        
      }
    
    });