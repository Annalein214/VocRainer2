var SYNTH = window.speechSynthesis;
var VOICE_DE;
var VOICE_JP;
var VOICE_EN;
var voices;

function voiceList() {
  voices = SYNTH.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });
  console.log("SPEAK", voices.length);
  for(i = 0; i < voices.length ; i++) {
    //console.log("SPEAK voice", voices[i]);

    if (voices[i].lang.includes("DE")){
        console.log("SPEECH: Voices: ",voices[i].name,  voices[i].lang);
        // "Anna" – "de-DE"
        VOICE_DE=voices[i];
    }
    else if (voices[i].lang.includes("JP")){
        console.log("SPEECH: Voices: ",voices[i].name,  voices[i].lang);
        // "Kyoko" – "ja-JP"
        VOICE_JP=voices[i];
    }
    else if (voices[i].lang.includes("en-GB")){
        console.log("SPEECH: Voices: ",voices[i].name,  voices[i].lang);
        VOICE_EN=voices[i];
    }
    // else console.log("SPEECH: Voices: ",voices[i].name,  voices[i].lang);

  }
}


if ('onvoiceschanged' in SYNTH) {
    SYNTH.onvoiceschanged = voiceList;
} else {
    voiceList();
}

function speak(text, language){
    /* seems not to be an issue
    if (SYNTH.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }*/
    if (text !== '') {
      var utterThis = new SpeechSynthesisUtterance(text);
      utterThis.onend = function (event) {
          //console.log('SPEECH: SpeechSynthesisUtterance.onend');
      }
      utterThis.onerror = function (event) {
          console.error('SPEECH: SpeechSynthesisUtterance.onerror', event);
      }
      switch (language){
        case "de":
            utterThis.voice = VOICE_DE;
            //utterThis.lang = VOICE_DE.lang;
            break;
        case "jp":
            utterThis.voice = VOICE_JP;
            //utterThis.lang = VOICE_JP.lang;
            break;
        case "en":
        default:
            utterThis.voice = VOICE_EN;
            //utterThis.lang = VOICE_EN.lang;
            break;
      }

      //utterThis.voice = voices.find((voice) => voice.lang === 'en-GB');
      utterThis.pitch = 1; // tonhoehe
      utterThis.rate = 1; // geschwindigkeit
      console.log("SPEAK", text);
      SYNTH.speak(utterThis);
    }
}

// -----------------------------------

//speak("Dies ist ein Test.", "de");
//speak("おげんきですか。いい、げんきです", "jp");

// help if no voice on mac: https://wethegeek.com/macos-sound-not-working-on-safari-browser/
