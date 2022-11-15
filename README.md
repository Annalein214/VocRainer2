# VocRainer2
Online Version of VocRainer - a trainer for foreign languages


# Coding help

## How to add functionality 

### Quiz type
in quizstart.js
* add type in getQuizWords
* add type in form in show_quiz_settings
in quiz.js
* add a function to select next words when proceeding through the quiz (in selectWord)
* add function to update progress bar (in updateProgressBar)
* change layout of quiz in show_quiz_word if needed and adjust style.css accordingly
* add functionality of quiz in add_quiz_fct
in quizend.js
* add evaluation in evaluateQuiz


## jQuery tricks
* read form elements input/text, textarea etc.: use .val()
* read other elements div, ul, a: use.text()

## javascript functions often used
* parseInt(variable)
* newstring = string.trim() removes whitespace at the start and the end of a string, not in the middle
* var bool = string.includes(substring)
* string.split('divider')