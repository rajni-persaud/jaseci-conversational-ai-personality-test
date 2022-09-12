walker init{
    has q_id;
    has q_text;
    has q_category;

    q_id = std.input("ID of question to edit: ");
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
        q_text = std.input("Question: ");
        q_category = std.input("Category: ");
        if (q_text): questions[q_index]["q_text"] = q_text;
        if (q_category): questions[q_index]["q_category"] = q_category;
        if(q_text || q_category): file.dump_json('../data/questions_dir.json', questions);
        report questions[q_index];
    }
}