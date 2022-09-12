var sentinel_id = document.getElementById("app-interact").getAttribute('data-sentinelid');
var server = document.getElementById("app-interact").getAttribute('data-server');
var walker = document.getElementById("app-interact").getAttribute('data-walkername');
var token = document.getElementById("app-interact").getAttribute('data-token');
var last_jid = null;

// // Replace the script tag with the app
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const qid = urlParams.get('qid');

var questions = [];
 $.ajax({
    type: "GET",
    async: false,
    url: "../../../data/questions_dir.json",
    data: {},
    success: function(questions_data){
        console.log(questions_data);
        questions = questions_data; 
    },
});

var qids = [];
for (i=0; i<questions.length; i++){
  qids.push(questions[i]['q_id']);
}

q_index = qids.indexOf(Number(qid));
if(q_index >= 0){
  old_question = questions[q_index]['q_text'];
  old_category = questions[q_index]['q_category'];
  category_options = ["Mind", "Energy", "Nature", "Tactics", "Identity"];
  options_list = ``;
  for (i=0; i<category_options.length; i++){
    if (category_options[i] == old_category){
      options_list = options_list + `<option selected>${category_options[i]}</option>`;
    }
    else{
      options_list = options_list + `<option>${category_options[i]}</option>`;
    }
  }
  document.getElementById('app-interact').parentNode.innerHTML = `
  <div id="question_io${sentinel_id}">
    <!-- NAVBAR--><nav class="navbar navbar-expand-lg navbar-dark"></nav><!-- NAVBAR-->
    <br/>
    <div class="container">
      <div class="card">
        <div class="card-header">Edit Question</div>  
        <div class="card-body">
          <div class="form-group">
            <label for="Question">Question: </label>
            <input class="form-control" type="text" id="Question" placeholder="Enter Question">
            <label for="Category">Category: </label>
            <select class="form-control" id="Category">`+options_list+`</select>
          </div>
        </div>
        <div class="card-footer">
        <button type="button" class="btn btn-danger" style="float: right; margin-left: 10px;" onclick="delete_q();">Delete</button>
        <button type="button" class="btn btn-primary" style="float: right;" onclick="edit_q();">Save</button>
        </div> 
      </div>
    </div>
  </div>
  `;
  document.getElementById("Question").defaultValue = old_question;
}
else{
  location.replace("./questions.html");
}

function edit_q(){
  var uQuestion = document.getElementById("Question").value;
  var uCategory = document.getElementById("Category").value;
  walker_run("edit_question", uQuestion, uCategory);
  // window.location.href ="./questions.html";
}

function delete_q(){
  walker_run("delete_question");
  // window.location.href ="./questions.html";
}

function walker_run(name, q_text="", q_category="") {

  query = `
  {
    "name": "${name}",
    "ctx": {"q_id": "${Number(qid)}", "q_text": "${q_text}", "q_category": "${q_category}"},
    "snt": "${sentinel_id}",
    "detailed":"false"
  }
  `;

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