// settings
if (localStorage.getItem("readaloud") === null) {
  // option to automatically read vocabulary aloud in quiz or not
  localStorage.setItem('readaloud',1); // default on
}


var loadpage_settings = function(){
    $('div[data-role="header"] h1').text("Settings");

    // ---------------
    // option to automatically read vocabulary aloud in quiz or not
    // TODO Test
    var selected=''; 
    if (localStorage.getItem("readaloud")) selected=' selected=""';
    $('div[role="main"]').append('<div class="ui-field-contain">'+
                                    '<label for="readaloud" style="float:left;width: 70% !important;">Read words aloud in quiz:</label>'+
                                        '<select name="readaloud" id="readaloud" data-role="flipswitch">'+
                                            '<option value="off">Off</option>'+
                                            '<option value="on" '+selected+'>On</option>'+
                                        '</select></div>');
    $("#readaloud").on("change", function(e){
        if (this.value=="off") localStorage.setItem('readaloud',0);
        else localStorage.setItem('readaloud',1);
        //console.log("T", this.value, localStorage.getItem("readaloud"));
    });

    // ---------------
    $('div[role="main"]').append('<input type="submit" name="user_logout" value="Logout" />');
    $('input[name="user_logout"]').click(function(event){            
        logout();
    });


}