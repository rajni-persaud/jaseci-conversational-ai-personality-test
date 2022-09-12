walker create_question{
    has q_text;
    has q_category;

    root: take -->[0];
    app_root: take --> node::create_question;
    hop_state: take --> node::create_question;

    create_question{
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
        take -->;
        disengage;
    }
}

walker edit_question{
    has q_id;
    has q_text;
    has q_category;

    root: take -->[0];
    app_root: take --> node::edit_question;
    hop_state: take --> node::edit_question;

    edit_question{
        ids = [];
        questions = file.load_json('../data/questions_dir.json');
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
            if (q_text): questions[q_index]["q_text"] = q_text;
            if (q_category): questions[q_index]["q_category"] = q_category;
            if (q_text || q_category): file.dump_json('../data/questions_dir.json', questions);
            report questions[q_index];
        }
        take -->;
        disengage;
    }
}

walker delete_question{
    has q_id;
    
    root: take -->[0];
    app_root: take --> node::delete_question;
    hop_state: take --> node::delete_question;

    delete_question{
        ids = [];
        questions = file.load_json('../data/questions_dir.json');
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
        take -->;
        disengage;
    }
}