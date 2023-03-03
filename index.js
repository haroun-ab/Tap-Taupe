$(document).ready(function(){ 
    //Modal
    const form = $('form')
    form.submit((e) => {
        e.preventDefault();
        $('.backdrop').hide()
        $('.modal').hide()

        const body = {
            pseudo : form[0][0].value,
            niveau : form[0][1].value
        }
    
        localStorage.setItem('user', JSON.stringify(body))
        const data = JSON.parse(localStorage.getItem('user'))
        $('.nom').html(data['pseudo'])
        $('.niveau').html(data['niveau'])
    })
    
    const img = $('.hole img');
    img.hide()
 
 
    $('button').click(() => {
        let time = 60
        let score = 0
        // désactive le boutton
        $('.start-game').html("Game started");
        $('.start-game').css("border", "5px solid transparent")
        $('.start-game').css( "background", "transparent")
        $('.start-game').css( "color", "white")
        $('.start-game').css( "fontSize", "20px")
        $('.start-game').attr("disabled", "disabled")
       
        //timer
       $('.timer').html(`${time}'`)

      
            const hole = $('.hole');
            let delay = 1000 
            for(let i = 0; i<60; i++){         
                delay += 1000
                setTimeout(()=>{
                    time -= 1
                    let moleAnimDelay = 0
                    if(time % 2 == 0){
                        const data = JSON.parse(localStorage.getItem('user'))
                        if(data['niveau'] == 'Easy'){
                            moleAnimDelay = 500
                        } else if(data['niveau'] == 'Medium'){
                            moleAnimDelay = 375
                        } else{
                            moleAnimDelay = 250
                        }
                        a(hole, moleAnimDelay)
                    }
                    $('.timer').html(`${time}'`)
                    console.log(time)
                    if(time === 0){
                        displayGameOver(score)
                    }
                }, delay) 
            }
        
      
       
       
       
        // Si le joueur clique sur une taupe 
        img.click(()=> {
            score = scoreCount(img, score)
        })
        
                
    })  

   function displayGameOver(score){
    //Réactive le boutton
    $('.start-game').html("");
    $('.container').html(`<div class="left"><h2>GAME OVER</h2><h3 class="score-final"><span>Score</span><span>${score}</span></h3><button class='play-again'>Play Again</button></div>`)
    $('.play-again').click(() => {
        location.reload()
    })
   }

   function scoreCount(img, score){
    $(img).hide()
    score++
    $('#score').html((score))
    return score;
   }

   function a(hole, delay){
    let random = Math.floor(Math.random() * 9);
    const imgToMov = $(hole[random]).find("img");
    imgToMov.show(delay).hide(delay)
   }
  });
