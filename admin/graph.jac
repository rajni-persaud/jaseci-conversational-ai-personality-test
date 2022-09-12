node app_root;
node hop_state;
node create_question;
node edit_question;
node delete_question;

graph app_graph {

    has anchor app_root;

    spawn {
        app_root = spawn node::app_root;
        hop_node = spawn app_root --> node::hop_state;

        create_q = spawn node::create_question;
        app_root --> create_q;
        hop_node --> create_q;
        hop_node <-- create_q;

        edit_q = spawn node::edit_question;
        app_root --> edit_q;
        hop_node --> edit_q;
        hop_node <-- edit_q;

        delete_q = spawn node::delete_question;
        app_root --> delete_q;
        hop_node --> delete_q;
        hop_node <-- delete_q;
    }

}