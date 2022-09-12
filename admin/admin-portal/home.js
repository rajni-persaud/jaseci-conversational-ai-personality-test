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

document.getElementById('app-interact').parentNode.innerHTML = `
    <div id="home${sentinel_id}">
      <!-- NAVBAR--><nav class="navbar navbar-expand-lg navbar-dark"></nav><!-- NAVBAR-->
      <br/>
      <canvas id="questions_by_category" style="width:100%;max-width:600px"></canvas>
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

    var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    var yValues = [55, 49, 44, 24, 15];
    var barColors = ["#45b6fe", "#6ac5fe", "#8fd3fe", "#b5e2ff", "#daf0ff"];
    
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
        }
      }
    });