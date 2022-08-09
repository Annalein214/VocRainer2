// help navigation by saving current page name
var CURRENTPAGE="home";



// ############################################################################
// Main code to start the app

// require that all content is loaded
$( window ).on( "load", function() {
    console.log( "MAIN: Window loaded" ); 
    // -------------- 
    // load the page

    // either show login screen or initialize website
    check_login(); // executes initialize_website()

    // MAIN: Prevent ENTER reload
    $(document).keydown (function(e){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            event.preventDefault();
            //console.log("MAIN: Prevent ENTER reload");
        }
        
    });
}); // window loaded

// ############################################################################


var initialize_website = function(){
    // collect what is needed to start the website

    // remove login screen
    $('div[class="ui-login"]').hide();
    // show footer
    $('div[data-role="footer"]').show();
    // add footer functionality
    $('div[data-role="footer"] a').click(function(event){            
        loadpage(event.target.name);
    });
}

// ############################################################################

var loadpage = function(name, data=null){
    /*
    Handler to load full pages
    the unique name defines which page is to be loaded
    mainly used by the navbar in footer
    */

    // update current page
    var previousPage=CURRENTPAGE;
    CURRENTPAGE=name;

    // first empty the page
    $('div[role="main"]').empty();
    // header cannot be removed+added, only manipulated
    $('div[data-role="header"] a[name="left"]').hide();
    $('div[data-role="header"] a[name="right"]').hide();

    // load new page
    switch (name){
        case "quiz":
            // if quiz still running, go back
            if (QUIZ.length!=0) loadpage_quizword();
            else loadpage_quizstart();
            break;
        case "quizword":
            loadpage_quizword();
            break;
        case "quizsummary":
            loadpage_quizsummary();
            break
        case "vocabulary":
            loadpage_voc(data);
            break;
        case "words":
            loadpage_words(data);
            break;
        case "newword":
            loadpage_newword(data);
            break;
        case "settings":
            loadpage_settings();
            break
        case "search":
            loadpage_search(data);
            break
        case "statistics":
        default:
            loadpage_statistics();
            break;
    }
}

// ############################################################################

