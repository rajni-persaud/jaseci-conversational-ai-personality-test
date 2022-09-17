/* 
This walker goes through the user responses and removes all those that 
are incomplete; those without personality types.
*/

walker init{
    responses = file.load_json('./user_responses.json');
    user_pts = file.load_json('./user_personalities.json');

    user_ids = [];
    for i in user_pts:user_ids.l::append(i['user_id']);

    for response in responses{
        if(response['user_id'] not in user_ids){
            responses.list::remove(response);
        }
    }
    file.dump_json('../data/user_responses.json', responses);
}