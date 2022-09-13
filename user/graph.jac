node app_root;
node user{
    has user_id;
    has user_name;
    has user_email;
    has message = "Welcome to NeXusU's personality test. We'll try our best to make you feel comfortable. If you wish, share your name with us. Otherwise, just press enter :)";
}
node question{
    has q_id;
    has q_text;
    has q_category;
    has u_response;
}
node user_response{
    has u_response;
}

graph app_graph {

    has anchor app_root;
    
    spawn {
        questions = file.load_json('../data/questions_dir.json');
        q_nodes = [];
        app_root = spawn node::app_root;
        user_node = spawn node::user;
        response_node = spawn node::user_response;
        app_root --> user_node;
        for q in questions{
            node_name = 'q_'+q['q_id'].str;
            node_name = spawn node::question(q_id = q['q_id'], q_text = q['q_text'], q_category = q['q_category']);
            q_nodes.list::append(node_name);
        }
        user_node --> q_nodes[0];
        if questions.length > 1{
            for i=1 to i<questions.length by i+=1{
                q_nodes[i-1] --> q_nodes[i];
            }
        }
        q_nodes[-1] --> response_node;
    }

}