/* 
This walker stores the personality types into a json file. 
You can edit the personality types by editing the dictionary below and then 
running the program to save the changes.
*/

walker init{
    personality_types = {};

    personality_types['intj'] = ['Architect', 'Imaginative and strategic thinkers, with a plan for everything.'];
    personality_types['intp'] = ['Logician', 'Innovative inventors with an unquenchable thirst for knowledge.'];
    personality_types['entj'] = ['Commander', 'Bold, imaginative and strong-willed leaders, always finding a way - or making one.'];
    personality_types['entp'] = ['Debater', 'Smart and curious thinkers who cannot resist an intellectual challenge.'];
    personality_types['infj'] = ['Advocate', 'Quiet and mystical, yet very inspiring and tireless idealists.'];
    personality_types['infp'] = ['Mediator', 'Poetic, kind and altruistic people, always eager to help a good cause.'];
    personality_types['enfj'] = ['Protagonist', 'Charismatic and inspiring leaders, able to mesmerize their listeners.'];
    personality_types['enfp'] = ['Campaigner', 'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.'];
    personality_types['istj'] = ['Logistician', 'Practical and fact-minded individuals, whose reliability cannot be doubted.'];
    personality_types['isfj'] = ['Defender', 'Very dedicated and warm protectors, always ready to defend their loved ones.'];
    personality_types['estj'] = ['Executive', 'Excellent administrators, unsurpassed at managing things - or people.'];
    personality_types['esfj'] = ['Consul', 'Extraordinarily caring, social and popular people, always eager to help.'];
    personality_types['istp'] = ['Virtuoso', 'Bold and practical experimenters, masters of all kinds of tools.'];
    personality_types['isfp'] = ['Adventurer', 'Flexible and charming artists, always ready to explore and experience something new.'];
    personality_types['estp'] = ['Entrepreneur', 'Smart, energetic and very perceptive people, who truly enjoy living on the edge.'];
    personality_types['esfp'] = ['Entertainer', 'Spontaneous, energetic and enthusiastic people - life is never boring around them.'];

    file.dump_json('../data/personality_types.json', personality_types);
    report personality_types;
}