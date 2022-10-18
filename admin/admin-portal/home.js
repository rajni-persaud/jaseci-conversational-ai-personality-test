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

// Calculating the number of questions per category
question_categories = ["Mind", "Energy", "Nature", "Tactics", "Identity"];
qc_count = {};
for (i=0; i<question_categories.length; i++){
  qc_count[question_categories[i]] = 0;
}
for (i=0; i<questions.length; i++){
  qc_count[questions[i]["q_category"]] =  qc_count[questions[i]["q_category"]] + 1;
}
qc_num = [qc_count[question_categories[0]], qc_count[question_categories[1]], qc_count[question_categories[2]], qc_count[question_categories[3]], qc_count[question_categories[4]]];
// ---------------------------------

all_user_pts = [];
pt_types_num = {};

for (i=0; i<user_pts.length; i++){
  all_user_pts.push(user_pts[i]["p_type"][0]);
}

var pt_types = all_user_pts.filter((v, i, a) => a.indexOf(v) === i);

for (i=0; i<pt_types.length; i++){
  pt_types_num[pt_types[i]] = 0;
}

for (i=0; i<user_pts.length; i++){
  pt_types_num[user_pts[i]["p_type"][0]] = pt_types_num[user_pts[i]["p_type"][0]] + 1;
}

common_pt = ['', 0]
for (const [key, value] of Object.entries(pt_types_num)) {
  if(value > common_pt[1]){
    common_pt = [key, value];
  }
}

all_pt_code = [];
for (i=0; i<user_pts.length; i++){
  all_pt_code.push(user_pts[i]["p_code"]);
}

count_traits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
traits = ['i', 'e', 's', 'n', 't', 'f', 'j', 'p', 'a', 't'];

for (b=0; b<user_pts.length; b++){
  for (a=0; a<2; a++){  
    if(all_pt_code[b][0] == traits[a]){
      count_traits[a] = count_traits[a] + 1;
    }
  }

  for (a=2; a<4; a++){  
    if(all_pt_code[b][1] == traits[a]){
      count_traits[a] = count_traits[a] + 1;
    }
  }

  for (a=4; a<6; a++){  
    if(all_pt_code[b][2] == traits[a]){
      count_traits[a] = count_traits[a] + 1;
    }
  }

  for (a=6; a<8; a++){  
    if(all_pt_code[b][3] == traits[a]){
      count_traits[a] = count_traits[a] + 1;
    }
  }

  if(all_pt_code[b].includes('-a')){
    count_traits[8] = count_traits[8] + 1;
  }

  if(all_pt_code[b].includes('-t')){
    count_traits[9] = count_traits[9] + 1;
  }
}

document.getElementById('app-interact').parentNode.innerHTML = `
    <div id="home${sentinel_id}">
      <!-- NAVBAR--><nav class="navbar navbar-expand-lg navbar-dark"></nav><!-- NAVBAR-->
      <br/>

      <div class="container" style="margin-top:5%;">
        <div class="row">
          <div class="col">
            <div class="card" style="max-width: 18rem; max-height: 200px; background-color:#0C99BA; color: white;">
              <div class="card-body">
                <h6 class="card-title">Number of Questions</h5>
                <p class="card-text">${questions.length}<i class="fa fa-question-circle fa-2x" style="color: white; position:absolute; left: 80%; z-index: 5"></i></p>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card" style="max-width: 18rem; max-height: 200px; background-color:#21A5B7; color: white;">
              <div class="card-body">
                <h6 class="card-title">Number of Responses</h5>
                <p class="card-text">${responses.length}<i class="fa fa-comments fa-2x" style="color: white; position:absolute; left: 80%; z-index: 5"></i></p>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card" style="max-width: 18rem; max-height: 200px; background-color:#30BFBF; color: white;">
              <div class="card-body">
                <h6 class="card-title">Most Common Personality Type</h5>
                <p class="card-text">${common_pt[0]}<i class="fa fa-user fa-2x" style="color: white; position:absolute; left: 80%; z-index: 5"></i></p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="container" style="padding-top:10px;">
        <div class="row">
          <div class="col-5">
            <div class="card bg-light">
              <div class="card-body">
                <h6 class="card-title">Number of questions per category</h5>
                  <canvas id="questions_by_category" style="max-width:400px;"></canvas>
              </div>
            </div>
          </div>

          <div class="col-5">
            <div class="card bg-light">
              <div class="card-body">
                <h6 class="card-title">Pie Chart showing users' personality types</h5>
                <canvas id="users_pt" style="max-width:350px;"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="card bg-light">
              <div class="card-body">
                <h6 class="card-title">Stacked bar chart showing respondents' personality traits</h5>
                <canvas id="ctx" width="500"></canvas>
              </div>
            </div>
          </div>

          <div class="col">
            <canvas id="users_pt" style="max-width:300px;"></canvas>
          </div>
        </div>

      </div>
    </div>
    `;

    // var qc_chart = $('#questions_by_category');

    // qc_chart.height(250);
    
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
          display: false,
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
          display: false,
          text: "Pie Chart showing users' personality types"
        },

        responsive: true,
        legend: {
            display: true,
            position: "top"
        }
        
      }
    
    });

    var chart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
         labels: ["Mind", "Energy", "Nature", "Tactics", "Identity"],
         datasets: [{
            label: 'Introverted',
            data: [count_traits[0], 0, 0, 0, 0],
            backgroundColor: '#8B0000'
         }, {
            label: 'Extraverted',
            data: [count_traits[1], 0, 0, 0, 0],
            backgroundColor: '#FF0000'
         }, {
            label: 'Observant',
            data: [0, count_traits[2], 0, 0, 0],
            backgroundColor: '#8B4000'
         }, {
            label: 'Intuitive',
            data: [0, count_traits[3], 0, 0, 0],
            backgroundColor: '#FFA500'
         }, {
            label: 'Thinking',
            data: [0, 0, count_traits[4], 0, 0],
            backgroundColor: '#FFD700'
         }, {
            label: 'Feeling',
            data: [0, 0, count_traits[5], 0, 0],
            backgroundColor: '#FFFF00'
         }, {
            label: 'Judging',
            data: [0, 0, 0, count_traits[6], 0],
            backgroundColor: '#008000'
         }, {
            label: 'Prospecting',
            data: [0, 0, 0, count_traits[7], 0],
            backgroundColor: '#7CFC00'
         }, {
            label: 'Assertive',
            data: [0, 0, 0, 0, count_traits[8]],
            backgroundColor: '#00008B'
         }, {
            label: 'Turbulent',
            data: [0, 0, 0, 0, count_traits[9]],
            backgroundColor: '#0000FF'
         }]
      },
      options: {
         responsive: true,
        title: {
          display: false,
          text: "Stacked bar chart showing respondents' personality traits"
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