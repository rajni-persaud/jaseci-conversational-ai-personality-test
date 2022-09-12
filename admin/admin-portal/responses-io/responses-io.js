var sentinel_id = document.getElementById("app-interact").getAttribute('data-sentinelid');
var server = document.getElementById("app-interact").getAttribute('data-server');
var walker = document.getElementById("app-interact").getAttribute('data-walkername');
var token = document.getElementById("app-interact").getAttribute('data-token');
var last_jid = null;

// // Replace the script tag with the app

var responses = [];
 $.ajax({
    type: "GET",
    async: false,
    url: "../../../data/user_responses.json",
    data: {},
    success: function(responses_data){
        console.log(responses_data);
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
        console.log(user_pt_data);
        user_pts = user_pt_data; 
    },
});

p_user_ids = [];
for (u=0; u<user_pts.length; u++){p_user_ids.push(user_pts[u]['user_id'])}


if (responses.length > 0){
  table_body = ``;
  for (i=0; i<responses.length; i++){
    pt_user_index = p_user_ids.indexOf(responses[i]['user_id']);
    if(pt_user_index > -1){
      table_body = table_body +
      `<tr>
      <td>${responses[i]['user_name']}</td>
      <td>${responses[i]['num_response']}/${responses[i]['num_question']}</td>
      <td>${user_pts[pt_user_index]['p_type'][0]}</td>
      <td><button type="button" class="btn btn-primary" onclick="view_response(${responses[i]['user_id']})">View</button></td>
      </tr>`;
    }
    else{
      table_body = table_body +
      `<tr>
      <td>${responses[i]['user_name']}</td>
      <td>${responses[i]['num_response']}/${responses[i]['num_question']}</td>
      <td>N/A</td>
      <td> </td>
      </tr>`;
    }
  }
  responses_table = 
  `<table class="table table-striped table-fluid" id="myResponsesTable">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Responses</th>
        <th scope="col">Personality Type</th>
        <th scope="col">View</th>
      </tr>
    </thead>
  <tbody>` + table_body + `</tbody>
  </table>`;
  document.getElementById('app-interact').parentNode.innerHTML = `
  <div id="responses_io${sentinel_id}">
    <!-- NAVBAR--><nav class="navbar navbar-expand-lg navbar-dark"></nav><!-- NAVBAR-->   
    <div id="response">
        ${responses_table}
    </div>   
  </div>
  `;
}
else{
  document.getElementById('app-interact').parentNode.innerHTML = `
  <div id="responses_io${sentinel_id}">
    <!-- NAVBAR--><nav class="navbar navbar-expand-lg navbar-dark"></nav><!-- NAVBAR-->   
    <div id="no_response" class="center">
      <i class="fa fa-comments"></i>
      <p>There are currently no responses in the database.</p>
    </div>   
  </div>
  `;
}

function view_response(user_id){
  window.location.href = "response.html?uid="+user_id;
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