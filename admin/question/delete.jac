walker init{
    has q_id;
   
    q_id = std.input("ID of question to delete: ");
    questions = file.load_json('../data/questions_dir.json');
    ids = [];
    for question in questions: ids.list::append(question["q_id"].str);

    if(!q_id){
        report:status = 400;
        report "Missing required parameters";
    }
    elif(q_id not in ids){
        report:status = 404;
        report "Id not found";
    }
    else{
        q_index = ids.list::index(q_id);
        report questions[q_index];
        questions.list::remove(questions[q_index]);
        file.dump_json('../data/questions_dir.json', questions);
    }
}