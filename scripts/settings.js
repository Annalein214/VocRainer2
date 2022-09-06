// settings
if (localStorage.getItem("readaloud") === null) {
  // option to automatically read vocabulary aloud in quiz or not
  localStorage.setItem('readaloud',1); // default on
}

if (localStorage.getItem("readNativeDelay") === null) {
  // option to automatically read vocabulary aloud in quiz or not
   // default on
  if (iPhone){ // on iPhone there is a strange delay before giving the German output
    localStorage.setItem('readNativeDelay',100);
  }
  else{
    localStorage.setItem('readNativeDelay',3000);
  }
}

if (localStorage.getItem("readForeignDelay") === null) {
  // option to automatically read vocabulary aloud in quiz or not
   // default on
  if (iPhone){ // on iPhone there is a strange delay before giving the German output
    localStorage.setItem('readForeignDelay',12000);
  }
  else{
    localStorage.setItem('readForeignDelay',7000);
  }
}


var loadpage_settings = function(){
    $('#header div.h1').text("Settings");

    // ------------------------------------------------------------------
    // option to automatically read vocabulary aloud in quiz or not
    // TODO Test
    $('#main').append('<br /><br /><div class="ui-field-contain">'+
                                    '<label for="readaloud" style="float:left;width: 70% !important;">Read words aloud in Training/Test automatically:</label>'+
                                        '<select name="readaloud" id="readaloud" data-role="flipswitch">'+
                                            '<option value="0">Off</option>'+
                                            '<option value="3">Only Foreign</option>'+
                                            '<option value="2">Only Native</option>'+
                                            '<option value="1">Native and Foreign</option>'+
                                        '</select></div>');

    $('#readaloud').val(localStorage.getItem("readaloud"));

    $("#readaloud").on("change", function(){
        console.log("SETTINGS: READALOUD switch to ", this.value);
        localStorage.setItem('readaloud',Number(this.value));
    });

    // ------------------------------------------------------------------
    // change the time when vocabulary is read aloud in oral quiz
    var string='<br /><br /><div class="ui-field-contain">'+
                                    '<label for="foreignDelay" style="float:left;width: 70% !important;">Delay before reading native word (sec):</label>'+
                                        '<select name="foreignDelay" id="foreignDelay" data-role="flipswitch">'+
                                            '<option value="100">0</option>';

        for (var i=1; i<20; i++){
            string+='<option value="'+Number(i)*1000+'">'+i+'</option>';
        }            
        string+='</select></div>';
    $('#main').append(string);
    $('#foreignDelay').val(localStorage.getItem("readForeignDelay"));

    $("#foreignDelay").on("change", function(){
        console.log("SETTINGS: foreignDelay switch to ", this.value);
        localStorage.setItem('readForeignDelay',Number(this.value));
    });


    string='<br /><br /><div class="ui-field-contain">'+
                                    '<label for="nativeDelay" style="float:left;width: 70% !important;">Delay before reading native word (sec):</label>'+
                                        '<select name="nativeDelay" id="nativeDelay" data-role="flipswitch">'+
                                            '<option value="100">0</option>';

        for (var i=1; i<20; i++){
            string+='<option value="'+Number(i)*1000+'">'+i+'</option>';
        }            
        string+='</select></div>';
    $('#main').append(string);
    $('#nativeDelay').val(localStorage.getItem("readNativeDelay"));

    $("#nativeDelay").on("change", function(){
        console.log("SETTINGS: nativeDelay switch to ", this.value);
        localStorage.setItem('readNativeDelay',Number(this.value));
    });
    

    // ------------------------------------------------------------------
    $('#main').append('<br /><br /><input type="submit" name="user_logout" value="Logout" class="btn_fullwidth btn_red" />');
    $('input[name="user_logout"]').click(function(event){            
        logout();
    });

    // ------------------------------------------------------------------

    $('#main').append('<br /><br /><input type="submit" name="impressum" value="Show Impressum" class="btn_fullwidth btn_red" />');
    $('input[name="impressum"]').click(function(event){            
        impressum();
    });


}