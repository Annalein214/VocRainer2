/*if (localStorage.getItem("current_page") === null) {
  localStorage.setItem('current_page','statistics'); 
}
if (localStorage.getItem("last_page") === null) {
  localStorage.setItem('current_page','statistics'); 
}*/

// ############################################################################
// Main code to start the app

// require that all content is loaded
$( window ).on( "load", function() {
    console.log( "MAIN: Window loaded" ); 
    // -------------- 
    // load the page

    // either show login screen or initialize website
    check_login(); // executes initialize_website()

    // MAIN: Prevent ENTER reload, issue for textareas!!
    /*$(document).keydown (function(e){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            event.preventDefault();
            //console.log("MAIN: Prevent ENTER reload");
        }
        
    });*/
}); // window loaded

// ############################################################################


var initialize_website = function(){
    // collect what is needed to start the website
    // remove login screen
    $('div[class="ui-login"]').hide();
    // show footer
    $('div[data-role="footer"]').show();
    // add footer functionality
    $('#navbar a').click(function(event){  
        $('#navbar a').removeClass("cs_highl_btn");
        $('#navbar a[name="'+event.target.name+'"]').addClass("cs_highl_btn");
        loadpage(event.target.name);
    });
    loadpage();
}

// ############################################################################

var emptyPage = function(){
    $('#main').empty();
    // header cannot be removed+added, only manipulated
    $('#header div a[name="left"]').hide();
    $('#header div a[name="right"]').hide();

}
    
var loadpage = function(name="home", data=null){
    /*
    Handler to load full pages
    the unique name defines which page is to be loaded
    mainly used by the navbar in footer
    */

    // first empty the page
    emptyPage();

    // set new page => required for backward functionality of edit_word
    //localStorage.setItem('current_page',name);
    console.log("MAIN: load page:", name);

    // load new page
    switch (name){
        case "quizstart":
            // if quiz still running, go back
            //if (QUIZ.length!=0) loadpage_quizword();
            //else 
            loadpage_quizstart();
            break;
        case "oral":
            loadpage_oral(data);
            break;
        case "quiz":
            loadpage_quiz(data);
            break;
        case "quizend":
            loadpage_quizend();
            break
        case "vocabulary":
            loadpage_voc(data); // data: true/false if tags are shown
            break;
        case "words":
            loadpage_words(data); // data: lecture id
            break;
        case "newword":
            loadpage_newword(data); // data: word id
            break;
        case "settings":
            loadpage_settings();
            break
        /*case "search":
            loadpage_search(data);
            break*/
        case "statistics":
        default:
            loadpage_statistics();
            break;
    }
}

// ############################################################################

