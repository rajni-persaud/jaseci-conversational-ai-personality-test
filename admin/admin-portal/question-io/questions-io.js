var sentinel_id = document.getElementById("app-interact").getAttribute('data-sentinelid');
var server = document.getElementById("app-interact").getAttribute('data-server');
var walker = document.getElementById("app-interact").getAttribute('data-walkername');
var token = document.getElementById("app-interact").getAttribute('data-token');
var last_jid = null;

// // Replace the script tag with the app

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

create_modal = `
<!-- Modal -->
<div class="modal fade" id="createQuestion" tabindex="-1" role="dialog" aria-labelledby="createQuestionLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createQuestionLabel">Create Question</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="newQuestion">New Question: </label>
          <input class="form-control" type="text" id="newQuestion" placeholder="Enter Question">
          <label for="newCategory">Category: </label>
          <select class="form-control" id="newCategory">
            <option>Mind</option>
            <option>Energy</option>
            <option>Nature</option>
            <option>Tactics</option>
            <option>Identity</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick="create_q();">Create</button>
      </div>
    </div>
  </div>
</div>
`

if (questions.length > 0){
  table_body = ``;
  for (i=0; i<questions.length; i++){
    table_body = table_body +
    `<tr>
    <td><span onclick=view_question(${questions[i]['q_id']})><i class="fa fa-edit"></span></td>
    <td>${questions[i]['q_text']}</td>
    <td>${questions[i]['q_category']}</td>
    </tr>`;
  }
  questions_table = 
  `<table class="table table-striped table-fluid" id="myQuestionsTable">
    <thead>
      <tr>
        <th scope="col"></th>  
        <th scope="col">Question</th>
        <th scope="col">Category</th>
      </tr>
    </thead>
  <tbody>` + table_body + `</tbody>
  </table>`;
  document.getElementById('app-interact').parentNode.innerHTML = `
  <div id="questions_io${sentinel_id}">
    <!-- NAVBAR--><nav class="navbar navbar-expand-lg navbar-dark"></nav><!-- NAVBAR-->   
    <div id="q">
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createQuestion" style="float:right; margin: 10px;">Create Question</button>
        ${questions_table}
    </div>   
  </div>
  ${create_modal}
  `;
}
else{
  document.getElementById('app-interact').parentNode.innerHTML = `
  <div id="questions_io${sentinel_id}">
    <!-- NAVBAR--><nav class="navbar navbar-expand-lg navbar-dark"></nav><!-- NAVBAR-->   
    <div id="no_q" class="center">
      <i class="fa fa-question-circle"></i>
      <p>There are currently no questions in the database.</p>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createQuestion">Create Question</button>
    </div>   
  </div>
  ${create_modal}
  `;
}

function view_question(qid){
  window.location.href = "question.html?qid="+qid;
}

function create_q(){
  var newQuestion = document.getElementById("newQuestion").value;
  var newCategory = document.getElementById("newCategory").value;
  walker_run("create_question", newQuestion, newCategory);
  document.getElementById("newQuestion").value = "";
  // window.location.href ="./questions.html";
}

function walker_run(name, q_text="", q_category="") {

  query = `
  {
    "name": "${name}",
    "ctx": {"q_text": "${q_text}", "q_category": "${q_category}"},
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