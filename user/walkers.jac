walker take_test{
    can use.enc_question, use.enc_answer;
    has utterance = "";
    has my_response = {};
    has my_personality = {};
    has q_categories = [];
    has u_id;
    has u_name;
    has u_email;
    has user_index;
    has q_response;
    has response;

    root: take -->[0];
    app_root: take --> node::user;
    user{
        message = "Welcome to NeXusU's personality test. We'll try our best to make you feel comfortable. If you wish, share your name with us. Otherwise, just press enter :)";
        // std.out(message);
        // utterance = std.input("> ");
        u_name = utterance;
        // u_email = std.input("Email: ");
        if (!u_name): u_name = "Anonymous User";
        questions = file.load_json('../data/questions_dir.json');
        responses = file.load_json('../data/user_responses.json');
        if responses.length > 0: u_id = responses[-1]["user_id"]+1; else: u_id = 1; //finding the next id
        my_response["user_id"] = u_id;
        my_response["user_name"] = u_name;
        my_response["user_email"] = u_email;
        my_response["num_question"] = questions.length;
        my_response["num_response"] = 0;
        my_response["num_categories"] = {};
        my_response["total_categories"] = {};
        my_response["categories_weight"] = {};
        for q in questions{
            if q["q_category"] not in q_categories{
                my_response["num_categories"][q["q_category"]] = 1;
                q_categories.list::append(q["q_category"]);
            }
            else: my_response["num_categories"][q["q_category"]] = my_response["num_categories"][q["q_category"]] + 1;
        }
        for c in q_categories: my_response["total_categories"][c] = 0;
        responses.list::append(my_response);
        user_index = responses.list::index(my_response);
        file.dump_json('../data/user_responses.json', responses);
        // report my_response;
        // take --> node::question;
        response = -->;

                nodeobj = {};

            if(!response) {
                // message = "I'm not sure what you mean";
                nodeobj = here;
            } else {
                // message = response[0].message;
                nodeobj = response[0];
            }  

            report {"user_id":u_id, "user_index":user_index, "message": message, "utterance": utterance, "node": nodeobj, "my_response": my_response};          

            disengage;
    }

    question{
        responses = file.load_json('../data/user_responses.json');
        message = here.q_text;
        // std.out(message);
        // utterance = std.input("> ");
        q_response = utterance;
        // take here;
        my_response = responses[user_index];
        if(q_response){
            my_response["num_response"] = my_response["num_response"] + 1;
            my_response["q_"+here.q_id.str] = [here.q_text, here.q_category, q_response];
            my_response["total_categories"][here.q_category] = my_response["total_categories"][here.q_category] + 1;
            my_response["categories_weight"][here.q_category] = (1/my_response["total_categories"][here.q_category])*100;
            responses[user_index] = my_response;
            file.dump_json('../data/user_responses.json', responses);
            // report my_response;
            // take -->;
            response = -->;
        }

        nodeobj = {};

            if(!response) {
                // message = "I'm not sure what you mean";
                nodeobj = here;
            } else {
                // message = response[0].message;
                nodeobj = response[0];
            }  

            report {"user_id":u_id, "user_index":user_index, "message": message, "utterance": utterance, "node": nodeobj, "my_response": my_response};          

            disengage;
    }

    user_response{
        personality_types = file.load_json('../data/personality_types.json');
        user_personalities = file.load_json('../data/user_personalities.json');
        questions = file.load_json('../data/questions_dir.json');
        responses = file.load_json('../data/user_responses.json');

        my_response = responses[user_index];

        a_1 = ["Definitely", "Absolutely", "of course", "Agree", "I will", "yes"];
        b_2 = ["maybe", "most likely", "slightly agree", "I would", "sometimes"];
        c_3 = ["I don't know", "not sure", "hmm..", "I can't tell", "unsure", "neutral", "it depends", "doesn't matter"];
        d_4 = ["slightly disagree", "I don't think so", "maybe not", "not really"];
        e_5 = ["no", "nope", "absolutely not", "definitely not"];


        sc_desc = {};
        sc_desc['Introverted'] = 'Introverted individuals prefer solitary activities and get exhausted by social interaction.';
        sc_desc['Extraverted'] = 'Extraverted individuals prefer group activities and get energized by social interaction.';
        sc_desc['Observant'] = 'Observant individuals are highly practical, pragmatic and down-to-earth. They tend to have strong habits and focus on what is happening or has already happened.';
        sc_desc['Intuitive'] = 'Intuitive individuals are very imaginative, open-minded and curious. They prefer novelty over stability and focus on hidden meanings and future possibilities.';
        sc_desc['Thinking'] = 'Thinking individuals focus on objectivity and rationality, prioritizing logic over emotions. They tend to hide their feelings and see efficiency as more important than cooperation.';
        sc_desc['Feeling'] = 'Feeling individuals are sensitive and emotionally expressive. They are more empathic and less competitive than Thinking types, and focus on social harmony and cooperation.';
        sc_desc['Judging'] = 'Judging individuals are decisive, thorough and highly organized. They value clarity, predictability and closure, preferring structure and planning to spontaneity.';
        sc_desc['Prospecting'] = 'Prospecting individuals are very good at improvising and spotting opportunities. They tend to be flexible, relaxed nonconformists who prefer keeping their options open.';
        sc_desc['Assertive'] = 'Assertive individuals are self-assured, even-tempered and resistant to stress. They refuse to worry too much and do not push themselves too hard when it comes to achieving goals.';
        sc_desc['Turbulent'] = 'Turbulent individuals are self-conscious and sensitive to stress. They are likely to experience a wide range of emotions and to be success-driven, perfectionistic and eager to improve.';
        subcategories = {};
        subcategories["Mind"] = ['Introverted', 'Extraverted'];
        subcategories["Energy"] = ['Observant', 'Intuitive'];
        subcategories["Nature"] = ['Thinking', 'Feeling'];
        subcategories["Tactics"] = ['Judging', 'Prospecting'];
        subcategories["Identity"] = ['Assertive', 'Turbulent'];

        u_subcategories = {};
        u_subcategories['Introverted'] = 0;
        u_subcategories['Extraverted'] = 0;
        u_subcategories['Observant'] = 0;
        u_subcategories['Intuitive'] = 0;
        u_subcategories['Thinking'] = 0;
        u_subcategories['Feeling'] = 0;
        u_subcategories['Judging'] = 0;
        u_subcategories['Prospecting'] = 0;
        u_subcategories['Assertive'] = 0;
        u_subcategories['Turbulent'] = 0;

        Q_subcategories = [];
        for q in questions{
            if q['q_category'] == "Mind": answers = [sc_desc['Introverted'], sc_desc['Extraverted']];
            if q['q_category'] == "Energy": answers = [sc_desc['Observant'], sc_desc['Intuitive']];
            if q['q_category'] == "Nature": answers = [sc_desc['Thinking'], sc_desc['Feeling']];
            if q['q_category'] == "Tactics": answers = [sc_desc['Judging'], sc_desc['Prospecting']];
            if q['q_category'] == "Identity": answers = [sc_desc['Assertive'], sc_desc['Turbulent']];
            q_enc = use.enc_question(q['q_text']);
            a_enc = use.enc_answer(answers); # can take lists or single strings

            a_scores=[];

            max_score = 0;

            for i in a_enc: a_scores.l::append(vector.cosine_sim(q_enc, i));

            sc = sc_desc.d::keys;
            scv = sc_desc.d::values;

            if a_scores[0] > a_scores[1]{
                Q_subcategories.l::append(sc[scv.list::index(answers[0])]);
            }
            else{
                Q_subcategories.l::append(sc[scv.list::index(answers[1])]);
            }
        }

        u_scores = [];
        sample_responses = [];

        for a in a_1: sample_responses.l::append(a);
        for b in b_2: sample_responses.l::append(b);
        for c in c_3: sample_responses.l::append(c);
        for d in d_4: sample_responses.l::append(d);
        for e in e_5: sample_responses.l::append(e);

        for qn=1 to qn <= responses[user_index]['num_response'] by qn+=1{

            q_enc = use.enc_question(responses[user_index]['q_'+qn.str][2]);
            a_enc = use.enc_answer(sample_responses); # can take lists or single strings

            a_scores=[];

            max_score = 0;

            for i in a_enc:
                a_scores.l::append(vector.cosine_sim(q_enc, i));

            for i in a_scores {
                if i > max_score: 
                    max_score = i;
            }

            max_index = a_scores.list::index(max_score);

            if (sample_responses[max_index] in a_1): u_scores.list::append(1);
            if (sample_responses[max_index] in b_2): u_scores.list::append(2);
            if (sample_responses[max_index] in c_3): u_scores.list::append(3);
            if (sample_responses[max_index] in d_4): u_scores.list::append(4);
            if (sample_responses[max_index] in e_5): u_scores.list::append(5);
        }

        for c=0 to c < responses[user_index]['num_response'] by c+=1{
            if Q_subcategories[c] in subcategories["Mind"]: weight = responses[user_index]['categories_weight']["Mind"];
            if Q_subcategories[c] in subcategories["Energy"]: weight = responses[user_index]['categories_weight']["Energy"];
            if Q_subcategories[c] in subcategories["Nature"]: weight = responses[user_index]['categories_weight']["Nature"];
            if Q_subcategories[c] in subcategories["Tactics"]: weight = responses[user_index]['categories_weight']["Tactics"];
            if Q_subcategories[c] in subcategories["Identity"]: weight = responses[user_index]['categories_weight']["Identity"];

            if Q_subcategories[c] == "Introverted"{
                if u_scores[c] == 1{
                    u_subcategories['Introverted'] = u_subcategories['Introverted'] + (1*weight);
                    u_subcategories['Extraverted'] = u_subcategories['Extraverted'] + (0*weight);
                }
                if u_scores[c] == 2{
                    u_subcategories['Introverted'] = u_subcategories['Introverted'] + (0.75*weight);
                    u_subcategories['Extraverted'] = u_subcategories['Extraverted'] + (0.25*weight);
                }
                if u_scores[c] == 3{
                    u_subcategories['Introverted'] = u_subcategories['Introverted'] + (0.5*weight);
                    u_subcategories['Extraverted'] = u_subcategories['Extraverted'] + (0.5*weight);
                }
                if u_scores[c] == 4{
                    u_subcategories['Introverted'] = u_subcategories['Introverted'] + (0.25*weight);
                    u_subcategories['Extraverted'] = u_subcategories['Extraverted'] + (0.75*weight);
                }
                if u_scores[c] == 5{
                    u_subcategories['Introverted'] = u_subcategories['Introverted'] + (0*weight);
                    u_subcategories['Extraverted'] = u_subcategories['Extraverted'] + (1*weight);
                }
            }

             if Q_subcategories[c] == "Extraverted"{
                if u_scores[c] == 1{
                    u_subcategories['Extraverted'] = u_subcategories['Extraverted'] + (1*weight);
                    u_subcategories['Introverted'] = u_subcategories['Introverted'] + (0*weight);
                }
                if u_scores[c] == 2{
                    u_subcategories['Extraverted'] = u_subcategories['Extraverted'] + (0.75*weight);
                    u_subcategories['Introverted'] = u_subcategories['Introverted'] + (0.25*weight);
                }
                if u_scores[c] == 3{
                    u_subcategories['Extraverted'] = u_subcategories['Extraverted'] + (0.5*weight);
                    u_subcategories['Introverted'] = u_subcategories['Introverted'] + (0.5*weight);
                }
                if u_scores[c] == 4{
                    u_subcategories['Extraverted'] = u_subcategories['Extraverted'] + (0.25*weight);
                    u_subcategories['Introverted'] = u_subcategories['Introverted'] + (0.75*weight);
                }
                if u_scores[c] == 5{
                    u_subcategories['Extraverted'] = u_subcategories['Extraverted'] + (0*weight);
                    u_subcategories['Introverted'] = u_subcategories['Introverted'] + (1*weight);
                }
            }

             if Q_subcategories[c] == "Observant"{
                if u_scores[c] == 1{
                    u_subcategories['Observant'] = u_subcategories['Observant'] + (1*weight);
                    u_subcategories['Intuitive'] = u_subcategories['Intuitive'] + (0*weight);
                }
                if u_scores[c] == 2{
                    u_subcategories['Observant'] = u_subcategories['Observant'] + (0.75*weight);
                    u_subcategories['Intuitive'] = u_subcategories['Intuitive'] + (0.25*weight);
                }
                if u_scores[c] == 3{
                    u_subcategories['Observant'] = u_subcategories['Observant'] + (0.5*weight);
                    u_subcategories['Intuitive'] = u_subcategories['Intuitive'] + (0.5*weight);
                }
                if u_scores[c] == 4{
                    u_subcategories['Observant'] = u_subcategories['Observant'] + (0.25*weight);
                    u_subcategories['Intuitive'] = u_subcategories['Intuitive'] + (0.75*weight);
                }
                if u_scores[c] == 5{
                    u_subcategories['Observant'] = u_subcategories['Observant'] + (0*weight);
                    u_subcategories['Intuitive'] = u_subcategories['Intuitive'] + (1*weight);
                }
            }

             if Q_subcategories[c] == "Intuitive"{
                if u_scores[c] == 1{
                    u_subcategories['Intuitive'] = u_subcategories['Intuitive'] + (1*weight);
                    u_subcategories['Observant'] = u_subcategories['Observant'] + (0*weight);
                }
                if u_scores[c] == 2{
                    u_subcategories['Intuitive'] = u_subcategories['Intuitive'] + (0.75*weight);
                    u_subcategories['Observant'] = u_subcategories['Observant'] + (0.25*weight);
                }
                if u_scores[c] == 3{
                    u_subcategories['Intuitive'] = u_subcategories['Intuitive'] + (0.5*weight);
                    u_subcategories['Observant'] = u_subcategories['Observant'] + (0.5*weight);
                }
                if u_scores[c] == 4{
                    u_subcategories['Intuitive'] = u_subcategories['Intuitive'] + (0.25*weight);
                    u_subcategories['Observant'] = u_subcategories['Observant'] + (0.75*weight);
                }
                if u_scores[c] == 5{
                    u_subcategories['Intuitive'] = u_subcategories['Intuitive'] + (0*weight);
                    u_subcategories['Observant'] = u_subcategories['Observant'] + (1*weight);
                }
            }

             if Q_subcategories[c] == "Thinking"{
                if u_scores[c] == 1{
                    u_subcategories['Thinking'] = u_subcategories['Thinking'] + (1*weight);
                    u_subcategories['Feeling'] = u_subcategories['Feeling'] + (0*weight);
                }
                if u_scores[c] == 2{
                    u_subcategories['Thinking'] = u_subcategories['Thinking'] + (0.75*weight);
                    u_subcategories['Feeling'] = u_subcategories['Feeling'] + (0.25*weight);
                }
                if u_scores[c] == 3{
                    u_subcategories['Thinking'] = u_subcategories['Thinking'] + (0.5*weight);
                    u_subcategories['Feeling'] = u_subcategories['Feeling'] + (0.5*weight);
                }
                if u_scores[c] == 4{
                    u_subcategories['Thinking'] = u_subcategories['Thinking'] + (0.25*weight);
                    u_subcategories['Feeling'] = u_subcategories['Feeling'] + (0.75*weight);
                }
                if u_scores[c] == 5{
                    u_subcategories['Thinking'] = u_subcategories['Thinking'] + (0*weight);
                    u_subcategories['Feeling'] = u_subcategories['Feeling'] + (1*weight);
                }
            }

            if Q_subcategories[c] == "Feeling"{
                if u_scores[c] == 1{
                    u_subcategories['Feeling'] = u_subcategories['Feeling'] + (1*weight);
                    u_subcategories['Thinking'] = u_subcategories['Thinking'] + (0*weight);
                }
                if u_scores[c] == 2{
                    u_subcategories['Feeling'] = u_subcategories['Feeling'] + (0.75*weight);
                    u_subcategories['Thinking'] = u_subcategories['Thinking'] + (0.25*weight);
                }
                if u_scores[c] == 3{
                    u_subcategories['Feeling'] = u_subcategories['Feeling'] + (0.5*weight);
                    u_subcategories['Thinking'] = u_subcategories['Thinking'] + (0.5*weight);
                }
                if u_scores[c] == 4{
                    u_subcategories['Feeling'] = u_subcategories['Feeling'] + (0.25*weight);
                    u_subcategories['Thinking'] = u_subcategories['Thinking'] + (0.75*weight);
                }
                if u_scores[c] == 5{
                    u_subcategories['Feeling'] = u_subcategories['Feeling'] + (0*weight);
                    u_subcategories['Thinking'] = u_subcategories['Thinking'] + (1*weight);
                }
            }

            if Q_subcategories[c] == "Judging"{
                if u_scores[c] == 1{
                    u_subcategories['Judging'] = u_subcategories['Judging'] + (1*weight);
                    u_subcategories['Prospecting'] = u_subcategories['Prospecting'] + (0*weight);
                }
                if u_scores[c] == 2{
                    u_subcategories['Judging'] = u_subcategories['Judging'] + (0.75*weight);
                    u_subcategories['Prospecting'] = u_subcategories['Prospecting'] + (0.25*weight);
                }
                if u_scores[c] == 3{
                    u_subcategories['Judging'] = u_subcategories['Judging'] + (0.5*weight);
                    u_subcategories['Prospecting'] = u_subcategories['Prospecting'] + (0.5*weight);
                }
                if u_scores[c] == 4{
                    u_subcategories['Judging'] = u_subcategories['Judging'] + (0.25*weight);
                    u_subcategories['Prospecting'] = u_subcategories['Prospecting'] + (0.75*weight);
                }
                if u_scores[c] == 5{
                    u_subcategories['Judging'] = u_subcategories['Judging'] + (0*weight);
                    u_subcategories['Prospecting'] = u_subcategories['Prospecting'] + (1*weight);
                }
            }

            if Q_subcategories[c] == "Prospecting"{
                if u_scores[c] == 1{
                    u_subcategories['Prospecting'] = u_subcategories['Prospecting'] + (1*weight);
                    u_subcategories['Judging'] = u_subcategories['Judging'] + (0*weight);
                }
                if u_scores[c] == 2{
                    u_subcategories['Prospecting'] = u_subcategories['Prospecting'] + (0.75*weight);
                    u_subcategories['Judging'] = u_subcategories['Judging'] + (0.25*weight);
                }
                if u_scores[c] == 3{
                    u_subcategories['Prospecting'] = u_subcategories['Prospecting'] + (0.5*weight);
                    u_subcategories['Judging'] = u_subcategories['Judging'] + (0.5*weight);
                }
                if u_scores[c] == 4{
                    u_subcategories['Prospecting'] = u_subcategories['Prospecting'] + (0.25*weight);
                    u_subcategories['Judging'] = u_subcategories['Judging'] + (0.75*weight);
                }
                if u_scores[c] == 5{
                    u_subcategories['Prospecting'] = u_subcategories['Prospecting'] + (0*weight);
                    u_subcategories['Judging'] = u_subcategories['Judging'] + (1*weight);
                }
            }

            if Q_subcategories[c] == "Assertive"{
                if u_scores[c] == 1{
                    u_subcategories['Assertive'] = u_subcategories['Assertive'] + (1*weight);
                    u_subcategories['Turbulent'] = u_subcategories['Turbulent'] + (0*weight);
                }
                if u_scores[c] == 2{
                    u_subcategories['Assertive'] = u_subcategories['Assertive'] + (0.75*weight);
                    u_subcategories['Turbulent'] = u_subcategories['Turbulent'] + (0.25*weight);
                }
                if u_scores[c] == 3{
                    u_subcategories['Assertive'] = u_subcategories['Assertive'] + (0.5*weight);
                    u_subcategories['Turbulent'] = u_subcategories['Turbulent'] + (0.5*weight);
                }
                if u_scores[c] == 4{
                    u_subcategories['Assertive'] = u_subcategories['Assertive'] + (0.25*weight);
                    u_subcategories['Turbulent'] = u_subcategories['Turbulent'] + (0.75*weight);
                }
                if u_scores[c] == 5{
                    u_subcategories['Assertive'] = u_subcategories['Assertive'] + (0*weight);
                    u_subcategories['Turbulent'] = u_subcategories['Turbulent'] + (1*weight);
                }
            }


            if Q_subcategories[c] == "Turbulent"{
                if u_scores[c] == 1{
                    u_subcategories['Turbulent'] = u_subcategories['Turbulent'] + (1*weight);
                    u_subcategories['Assertive'] = u_subcategories['Assertive'] + (0*weight);
                }
                if u_scores[c] == 2{
                    u_subcategories['Turbulent'] = u_subcategories['Turbulent'] + (0.75*weight);
                    u_subcategories['Assertive'] = u_subcategories['Assertive'] + (0.25*weight);
                }
                if u_scores[c] == 3{
                    u_subcategories['Turbulent'] = u_subcategories['Turbulent'] + (0.5*weight);
                    u_subcategories['Assertive'] = u_subcategories['Assertive'] + (0.5*weight);
                }
                if u_scores[c] == 4{
                    u_subcategories['Turbulent'] = u_subcategories['Turbulent'] + (0.25*weight);
                    u_subcategories['Assertive'] = u_subcategories['Assertive'] + (0.75*weight);
                }
                if u_scores[c] == 5{
                    u_subcategories['Turbulent'] = u_subcategories['Turbulent'] + (0*weight);
                    u_subcategories['Assertive'] = u_subcategories['Assertive'] + (1*weight);
                }
            }
        }

        mp_code = '';
        if (u_subcategories['Introverted'] > u_subcategories['Extraverted']): mp_code = mp_code + 'i'; else: mp_code = mp_code + 'e';
        if (u_subcategories['Observant'] > u_subcategories['Intuitive']): mp_code = mp_code + 's'; else: mp_code = mp_code + 'n';
        if (u_subcategories['Thinking'] > u_subcategories['Feeling']): mp_code = mp_code + 't'; else: mp_code = mp_code + 'f';
        if (u_subcategories['Judging'] > u_subcategories['Prospecting']): mp_code = mp_code + 'j'; else: mp_code = mp_code + 'p';
        if (u_subcategories['Assertive'] > u_subcategories['Turbulent']): mp_code = mp_code + '-a'; else: mp_code = mp_code + '-t';

        my_personality["user_id"] = u_id;
        my_personality["q_subcategories"] = Q_subcategories;
        my_personality["u_scores"] = u_scores;
        my_personality["u_subcategories"] = u_subcategories;
        my_personality["p_code"] = mp_code;
        my_personality["p_type"] = personality_types[mp_code[0:-2]];
        p_link = "https://www.16personalities.com/"+mp_code[0:-2]+"-personality";
        user_personalities.list::append(my_personality);
        file.dump_json('../data/user_personalities.json', user_personalities);

        usc = u_subcategories.d::keys;
        uscv = u_subcategories.d::values;

        // std.out("Your personality type: ", my_personality["p_type"][0], "-", my_personality["p_type"][1]);
        // for d=0 to d < usc.length by d+=1{
        //     std.out(usc[d], " = ", uscv[d],"%");
        // }
        // std.out("Read more about your personality type here: ", p_link);
        // report my_personality;
        report {"user_id":u_id, "user_index":user_index, "utterance": utterance, "my_response": my_response, "my_personality": my_personality}; 
        disengage;
    }
}