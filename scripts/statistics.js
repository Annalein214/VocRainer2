var loadpage_statistics = function(){
    $('#header div.h1').text("Statistics");
    $('#main').append('<h2 class="textpink">Numbers</h2>');
    $('#main').append('<div id="stat_words"></div>');
    $('#main').append('<h2 class="textpink">Graphs</h2>');
    
    $('#main').append('<div class="canvas"><canvas id="wordsPerDay"></canvas></div>');
    $('#main').append('<div class="canvas"><canvas id="timePerDay"></canvas></div>');
    $('#main').append('<div class="canvas"><canvas id="levelPerDay4"></canvas></div>');
    $('#main').append('<div class="canvas"><canvas id="levelPerDay3"></canvas></div>');
    $('#main').append('<div class="canvas"><canvas id="levelPerDay2"></canvas></div>');
    $('#main').append('<div class="canvas"><canvas id="levelPerDay1"></canvas></div>');
    $('#main').append('<div class="canvas"><canvas id="levelPerDay0"></canvas></div>');
    $('#main').append('<div class="stopfloat br"></div>');

    $("#busy").show();

    getQuizInfo();
}

var getQuizInfo = function (){
    $.ajax({
        url: "http://pollmann.co/VocRainer/php/get_quiz_statistics.php",
        type:"POST",
        success: function(data){
            //console.log("DEBUG: ", data);
            const obj = JSON.parse(data);
            fillStatisticsPage(obj);
        }
    });
}

var fillStatisticsPage = function(obj){
    var level = obj.Level;
    var string = '';
    for (var i = 0; i < level.length; i++) { 
        string += 'Words on Level '+level[i].Level+': '+level[i].Count+'<br />';  
    }
    
    $('#stat_words').append(string);

    // ----

    var labels = [];
    var lea=[];
    var dur=[];
    var learned = obj.Learned;
    for (var i = 0; i < learned.length; i++) { 
         labels.push(learned[i].Day);
         lea.push(learned[i].Learned);
         dur.push(learned[i].Duration/60); // sek -> min
    }

    fillWordsGraph(labels, lea);
    fillTimeGraph(labels, dur);
    for (var i =0; i<5; i++){
        fillLevelGraph(i, obj);
    }
}

var fillLevelGraph = function(count, obj){
    var labels=[];
    var values=[];
    var learned = obj.Learned;
    for (var i = 0; i < learned.length; i++) { 
         labels.push(learned[i].Day);
         values.push(learned[i]["L"+count]);
    }

    colors=['rgb(128, 0, 14)', 'rgb(168, 39, 0)', 'rgb(255, 220, 0)', 'rgb(0, 179, 20)', 'rgb(0, 173, 172)'];

    const data = {
            labels: labels,
            datasets: [{
              label: 'Words in Level '+count,
              backgroundColor: colors[count],
              borderColor: colors[count],
              data: values,
            }]
          };

          const config = {
            type: 'line',
            data: data,
            options: {}
          };

        const myChart = new Chart(
            document.getElementById('levelPerDay'+count),
            config
          );
        $("#busy").hide();
}


var fillWordsGraph = function(labels, values){
        color='rgb(0, 162, 199)';
        const data = {
            labels: labels,
            datasets: [{
              label: 'Words learned per day',
              backgroundColor: color,
              borderColor: color,
              data: values,
            }]
          };

          const config = {
            type: 'line',
            data: data,
            options: {}
          };

        const myChart = new Chart(
            document.getElementById('wordsPerDay'),
            config
          );
        $("#busy").hide();
}

var fillTimeGraph = function(labels, values){
        color='rgb(0, 206, 0)';
        const data = {
            labels: labels,
            datasets: [{
              label: 'Time leanred per day',
              backgroundColor: color,
              borderColor: color,
              data: values,
            }]
          };

          const config = {
            type: 'line',
            data: data,
            options: {}
          };

        const myChart = new Chart(
            document.getElementById('timePerDay'),
            config
          );

        $("#busy").hide();
}





