walker init{
    has q_text;
    has q_category;

    q_text = std.input("Question: ");
    q_category = std.input("Category: ");

    if(!q_text || !q_category){
        report:status = 400;
        report "Missing required parameters";
    }
    else{
        questions = file.load_json('../data/questions_dir.json');
        if questions.length > 0: next_id = questions[-1]["q_id"]+1; else: next_id = 1; //finding the next id
        next_question = {"q_id": next_id, "q_text": q_text, "q_category": q_category};
        questions.list::append(next_question);
        file.dump_json('../data/questions_dir.json', questions);
        report next_question;
    }
}