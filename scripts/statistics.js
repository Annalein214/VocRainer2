var loadpage_statistics = function(){
    $('#header div.h1').text("Statistics");
    $('#main').append('<h2>Numbers</h2>');
    $('#main').append('<p id="stat_words"></p>');
    $('#main').append('<p id="stat_lect"></p>');
    $('#main').append('<p id="stat_tags"></p>');
    $('#main').append('<h2>Graphs</h2>');
    $('#main').append('<div><canvas id="levelPerDay"></canvas></div>');
    $('#main').append('<div><canvas id="wordsPerDay"></canvas></div>');
    $('#main').append('<div><canvas id="timePerDay"></canvas></div>');

}