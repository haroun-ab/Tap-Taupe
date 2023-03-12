$(document).ready(function(){ 
     // Modal leader board
     $('#leaderboard').hide();  

     $('#leaderboard-btn').click(() => displayLeaderboard());

    //Modal
    const form = $('form')
    form.submit((e) => {
        e.preventDefault();
        $('#home').hide()
        
        const body = {
            pseudo : form[0][0].value,
            niveau : form[0][1].value
        }
    
        localStorage.setItem('user', JSON.stringify(body))
        const data = JSON.parse(localStorage.getItem('user'))
        $('.nom').html(data['pseudo']);
        $('.niveau').html(data['niveau']);
    })
    
    const img = $('.hole img');
    img.hide()

   

 
    // Leaderboard
    $('.start-game').click(() => {
        let time = 60
        let score = 0
        // désactive le boutton
        $('.start-game').html("Game started");
        $('.start-game').css("border", "5px solid transparent")
        $('.start-game').css( "background", "transparent")
        $('.start-game').css( "color", "white")
        $('.start-game').css( "fontSize", "20px")
        $('.start-game').css( "cursor", "initial")
        $('.start-game').attr("disabled", "disabled")

       
        //timer
       $('.timer').html(`${time}'`)

      
            const hole = $('.hole');
            let delay = 1000;
            for(let i = 0; i<60; i++){         
                delay += 1000;
                setTimeout(()=>{
                    time -= 1
                    let moleAnimDelay = 0;
                    const data = JSON.parse(localStorage.getItem('user'))
                    if(time % 2 == 0){
                        if(data['niveau'] == 'Easy'){
                            moleAnimDelay = 350;
                        } else if(data['niveau'] == 'Medium'){
                            moleAnimDelay = 300;
                        } else{
                            moleAnimDelay = 250;
                        }
                        molePopping(hole, moleAnimDelay);
                    }
                    $('.timer').html(`${time}'`)
                    if(time === 0){
                        displayGameOver(score);
                        saveOnLeaderboard(data['pseudo'], data['niveau'], score );
                    }
                }, delay) 
            }
 
        // Si le joueur clique sur une taupe 
        img.click(()=> {
            score = scoreCount(img, score)
        })       
    })  


  
  });



  function displayGameOver(score){
    //Réactive le boutton
    $('.start-game').html("");
    $('.container').html(`<div class="left"><h2>GAME OVER</h2><h3 class="score-final"><span>Score</span><span>${score}</span></h3><button class='play-again'>Play Again</button></div>`)
    $('.play-again').click(() => {
        location.reload();
    })
   }

   function scoreCount(img, score){
    $(img).hide();
    score++;
    $('#score').html((score));
    return score;
   }

   function molePopping(hole, delay){
    let random = Math.floor(Math.random() * 9);
    const imgToMov = $(hole[random]).find("img");
    imgToMov.show(delay)
    setTimeout(() => {
        imgToMov.hide(delay);
    }, delay*1.5);
 
   }

   function saveOnLeaderboard(pseudo, niveau, score){
    const dataObject = {
        pseudo : pseudo,
        niveau : niveau,
        score: score, 
    };
    if(!localStorage.getItem('Leaderboard')){
        const array = [dataObject];
        localStorage.setItem('Leaderboard', JSON.stringify(array))
    } else {
        const leaderboard = JSON.parse(localStorage.getItem('Leaderboard'));
        leaderboard.push(dataObject);
        localStorage.setItem('Leaderboard', JSON.stringify(leaderboard))
    }
  
   }

   function displayLeaderboard(){
    // Apparition
    $('#leaderboard').show();  

    // Disparition
    $('#close').click(() => {
        $('#leaderboard').hide(); 
        $('.leaderboard').html(``)
    })

    //Classement
    const leaderboard = JSON.parse(localStorage.getItem('Leaderboard'));
    let easyLbArr = [];
    let mediumLbArr = [];
    let hardLbArr = [];
    leaderboard.forEach(lbByLevel => {
        if (lbByLevel.niveau == "Easy"){
            const easyTab = [lbByLevel.pseudo, lbByLevel.score]
            easyLbArr.push(easyTab)
        } else if (lbByLevel.niveau == "Medium") {
            const mediumTab = [lbByLevel.pseudo, lbByLevel.score]
            mediumLbArr.push(mediumTab)
        } else{
            const hardTab = [lbByLevel.pseudo, lbByLevel.score]
            hardLbArr.push(hardTab)
        }
    });

    easyLbArr =  threeBestScores(easyLbArr);
    mediumLbArr = threeBestScores(mediumLbArr);
    hardLbArr = threeBestScores(hardLbArr);

    easyContainer = $('#Easy');
    mediumContainer = $('#Medium');
    hardContainer = $('#Hard');


    insertInDom(easyLbArr, easyContainer);
    insertInDom(mediumLbArr, mediumContainer);
    insertInDom(hardLbArr, hardContainer);
}

function threeBestScores(tab) {
    let maxScore1 = 0;
    let pseudo1 = "";
    let maxScore2 = 0;
    let pseudo2 = "";
    let maxScore3 = 0;
    let pseudo3 = "";
    const orderedTab = [];
    tab.forEach(element => {
        let score = element[1];
        let pseudo = element[0]
        if(maxScore1<=score){
            maxScore3 = maxScore2;
            maxScore2 = maxScore1;
            maxScore1 = score;    
           
            pseudo3 = pseudo2;
            pseudo2 = pseudo1;
            pseudo1 = pseudo;   
        } else if (maxScore2<=score){
            maxScore3 = maxScore2;
            maxScore2 = score;

            pseudo3 = pseudo2;
            pseudo2 = pseudo; 
        } else if(maxScore3<=score){
            maxScore3 = score;
            pseudo3 = pseudo; 
        }
    });

    orderedTab.push([1, pseudo1, maxScore1])
    orderedTab.push([2, pseudo2, maxScore2])
    orderedTab.push([3, pseudo3, maxScore3])

    return orderedTab;
}

function insertInDom(tab, container){
    
    tab.forEach(element => {
        container.append(`<div class='user-score' title="${element[1]}">
    <span>${element[0]}</span>
    <span>${element[1]}</span>
    <span>${element[2]}</span>
    </div>`)

    });
}