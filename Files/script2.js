 import {game_object,gamePlayingFunction} from "./script.js"
 //The DOM, to target all functionalities which are not directly attached to the game
const gameDOMFunction = (() => {
    const intro_section = document.getElementById('intro');
    const header = document.querySelector('header');
    const intro_h1 = document.querySelectorAll('h1');
    const intro_fig = document.querySelectorAll('figure');
    const audios = document.querySelectorAll('audio'); //1,intro_boom...2,typing...3,game_music
    const input_collection = document.getElementById('input_collection'); //section for input_collection
    const form = input_collection.querySelector('form');
    const gameSettings = document.getElementById('game_settings'); //this contains the ul which have all the settings
    const gameSettingsList = document.getElementById('settingsList'); //the ul
    const gamePlaying = document.getElementById('game_playing'); //this is the section of the game board

    const start_page = () => {
        intro_fig.forEach(figure => {
            figure.style.animationPlayState = 'Running';
        })
        intro_h1.forEach(h1 => {
           h1.style.animationPlayState = 'Running';
        })
        header.style.animationPlayState = 'Running';
        intro_section.style.animationPlayState = 'Running';
        input_collection.style.animationPlayState = 'Running';
        document.getElementById('game_settings_section').style.animationPlayState = 'Running';
        audios[0].play();
        setTimeout(() => {
            audios[1].play()
        },17000)
        setTimeout(() => {
            audios[2].play()
        },10000)
        setTimeout (() => {
            audios[3].play()
        },2500)
        setTimeout (() => {
            audios[3].play()
        },5000)
    }

    const game_music = (state = true) => {
        if (state) {
            audios[1].play();
            gameSettingsList.children[0].innerText = 'Sound OFF';
        }
        else {
            audios[1].pause();
            gameSettingsList.children[0].innerText = 'Sound ON';
        }
    }

    const create_game_board = () => {
        const hints_to_win = document.getElementById('hints_to_win');
        for (let i = 0; i<game_object.game_patterns.length; i++) {
            const outerShell = document.createElement('div');
            outerShell.setAttribute('class','outer_shell');
            outerShell.innerHTML = `
                <div class="inner_shell"><span>1</span></div>
                <div class="inner_shell"><span>2</span></div>
                <div class="inner_shell"><span>3</span></div>
                <div class="inner_shell"><span>4</span></div>
                <div class="inner_shell"><span>5</span></div>
                <div class="inner_shell"><span>6</span></div>
                <div class="inner_shell"><span>7</span></div>
                <div class="inner_shell"><span>8</span></div>
                <div class="inner_shell"><span>9</span></div>
            `;
            hints_to_win.append(outerShell);
            const innerShells = outerShell.querySelectorAll('.inner_shell');
            //hints to win game section
            for (let j = 0; j<game_object.game_patterns[i].length; j++) {
                const matching_index = game_object.game_board.indexOf(game_object.game_patterns[i][j]);
                innerShells[matching_index].style.backgroundColor = 'darkgreen';
            }
            if (i === (game_object.game_patterns.length - 1)) {
                const gameBoard = document.getElementById('game_board');
                const outerShell = document.createElement('div');
                outerShell.setAttribute('class','outer_shell');
                outerShell.innerHTML = `
                <div class="inner_shell"><span>1</span></div>
                <div class="inner_shell"><span>2</span></div>
                <div class="inner_shell"><span>3</span></div>
                <div class="inner_shell"><span>4</span></div>
                <div class="inner_shell"><span>5</span></div>
                <div class="inner_shell"><span>6</span></div>
                <div class="inner_shell"><span>7</span></div>
                <div class="inner_shell"><span>8</span></div>
                <div class="inner_shell"><span>9</span></div>
            `;
            gameBoard.append(outerShell);
            }
        }
    }

    const game_playing_board = () => {
        if (gamePlaying.matches('.none')) {
            gamePlaying.removeAttribute('class','none');
        }
        else {
            gamePlaying.setAttribute('class','none');
        }
        //display the select levels form when playing with computer to allow user to easily change the game level hardness
        if (game_object.player_2_name !== 'Robot') {
         document.getElementById('select-level-form').setAttribute('class','none');
         document.getElementById('level_playing').setAttribute('class','none');
        }
        else {
            document.getElementById('select-level-form').removeAttribute('class','none');
            document.getElementById('level_playing').removeAttribute('class','none');
            document.getElementById('level_playing').innerText = `You are playing the (${document.getElementById('level_select').value}) Level`;
        }
    }

    //For restarting or going back to input section
    const back_to_hint_or_to_game = e => {
        if (e.target.innerText === 'Back To The Hints' || e.target.innerText === 'Back To The Game') {
            input_collection_fn();
            game_playing_board();
        }
    }
    const game_control_btns_parent = e => {
        if (e.target.innerText === 'Back To The Hints' || e.target.innerText === 'Back To The Game') {
            document.getElementById('game_control_btn').children[1].addEventListener('mousedown',back_to_hint_or_to_game);
        }
        else if (e.target.innerText === 'Restart The Round') {
            document.getElementById('game_control_btn').children[0].addEventListener('mousedown',gamePlayingFunction.invoke_game_reset_board);
        }
    }

    //Input Section
    const input_collection_fn = (form_hide = true) => {
        input_collection.style.animation = 'unset';
        if (!form_hide) {
            if (form.matches('.none')) {
                form.removeAttribute('class','none');
            }
            else {
                form.setAttribute('class','none');
            }
            if (document.getElementById('back_to_game_btn').matches('.none')) {
                document.getElementById('back_to_game_btn').removeAttribute('class','none');
            }
            else {
                document.getElementById('back_to_game_btn').setAttribute('class','none');
            }   
        }
        if (input_collection.matches('.none')) {
            input_collection.removeAttribute('class','none');
        }
        else {
            input_collection.setAttribute('class','none');
        }
    }

    //Game settings in Nav Bar ... Nav Bar
    const music_controller = e => {
        if (e.target.innerText === 'Sound OFF') {
            game_music(false);
        }
        else if (e.target.innerText === 'Sound ON'){
            game_music(true);
        }
    }

    const game_strict_restart_fn = () => {
        if (!game_object.player_1_name) {
            window.alert("The game has not yet started!");
        }
        else {
            gamePlayingFunction.game_strict_restart_fn();
        }
    }

    //Nav Bar, outside and inside nav bar 
    const outside_inside_nav_bar = (e) => {
        if (!e.target.matches('.a_setting')) {
            document.addEventListener('mousedown',navbarHide);
        }
        else {
            document.removeEventListener('mousedown',navbarHide);
            if(e.target.innerText === 'Sound OFF' || e.target.innerText === 'Sound ON') {
                gameSettingsList.children[0].addEventListener('mousedown',music_controller);      
            }
            if (e.target.innerText === 'Restart The Game') {
                gameSettingsList.children[1].addEventListener('mousedown',game_strict_restart_fn);
            }
        }
    }

    const navbarHide = e => {
        document.querySelectorAll('section').forEach((section) => {
            if(section.matches('.none')) {
                section.setAttribute('class','none');
            }
            else if(!section.matches('#game_settings_section') && !section.matches('#round_won')) {
                section.removeAttribute('class','no_select');
            }
        })     
        gameSettings.setAttribute('class','hide-nav');
        document.removeEventListener('mousemove',outside_inside_nav_bar);
        document.removeEventListener('mousedown',navbarHide);
    }

   const navbarShow = () => {
        document.querySelectorAll('section').forEach((section) => {
            if(section.matches('.none')) {
                section.setAttribute('class','none');
            }
            else if(!section.matches('#game_settings_section') && !section.matches('#round_won') ) {
                section.setAttribute('class','no_select');
            }
        })
        if (gameSettings.matches('.hide-nav')) {
            gameSettings.removeAttribute('class','hide-nav');
        }
        document.addEventListener('mousemove',outside_inside_nav_bar);
    }

    //user inputs collection
    const user_inputs_form_collection = e => {
        e.preventDefault();
        let firstPlayerName = document.getElementById('firstUserName').value;
        let secondPlayerName = document.getElementById('secondUserName').value;
        let gameLevel = document.getElementById('level_select').value;
        let bool = true;
        if (!firstPlayerName || (!secondPlayerName && !document.getElementById('player_2').matches('.hide'))) {
            bool = false;
            if (!firstPlayerName) {
                setTimeout (() => {
                    document.getElementById('warning_p').removeAttribute('class','hide');
                },100)
                setTimeout (() => {
                    document.getElementById('warning_p').setAttribute('class','hide');
                },4000)
            }
            if (!secondPlayerName && !document.getElementById('player_2').matches('.hide')) {
                setTimeout (() => {
                    document.getElementById('warning_p2').removeAttribute('class','hide');
                },100)
                setTimeout (() => {
                    document.getElementById('warning_p2').setAttribute('class','hide');
                },4000)
            }
        }
        if (!secondPlayerName && document.getElementById('player_2').matches('.hide')) {
            secondPlayerName = 'Robot';
        }
        else if (!document.getElementById('player_2').matches('.hide')) {
            gameLevel = 'none';
        }
        if ((secondPlayerName === 'Robot' && !document.getElementById('player_2').matches('.hide')) || firstPlayerName === 'Robot') {
            bool = false;
            if (firstPlayerName === 'Robot') {
                window.alert(`Sorry ${firstPlayerName} name is not allowed for the users`);
            }
            else {
                window.alert(`Sorry ${secondPlayerName} name is not allowed for the users`);
            }
        }
        if (secondPlayerName === firstPlayerName) {
            bool = false;
            window.alert(`Sorry players can't have a same name #${secondPlayerName}`);
        }    
        if (bool) {
                gamePlayingFunction.game_set_fn(firstPlayerName,secondPlayerName,gameLevel,true)
                gameDOMFunction.input_collection_fn(false);
                gameDOMFunction.game_playing_board();
        }
    }

    return {start_page,create_game_board,navbarShow,navbarHide,game_playing_board,input_collection_fn,game_control_btns_parent,back_to_hint_or_to_game,user_inputs_form_collection}
})()


gameDOMFunction.create_game_board();

//Global Events
//When the game starts
document.getElementById('start_page_btn').addEventListener('mousedown',() => {
    document.getElementById('start_page_btn').style.display = 'none';
    gameDOMFunction.start_page();

})

//Anonymous fn for adding the second player
document.getElementById('partner_btn').addEventListener('click', e => {
    e.preventDefault();
    if (document.getElementById('player_2').matches('.hide')) {
        document.getElementById('player_2').removeAttribute('class','hide');
        document.getElementById('level_select').setAttribute('class','none');
        document.getElementById('play_with_partener_or_comp').setAttribute('class','hide');
        document.getElementById('partner_btn').innerText = 'With Computer';
    }
    else {
        document.getElementById('player_2').setAttribute('class','hide');
        document.getElementById('level_select').removeAttribute('class','none');
        document.getElementById('play_with_partener_or_comp').removeAttribute('class','hide');
        document.getElementById('secondUserName').value = '';
        document.getElementById('partner_btn').innerText = 'With Partener'   
    }
})

//Function for adding the players and starting the game
document.getElementById('game_starting_btn').addEventListener('click',gameDOMFunction.user_inputs_form_collection)

//game controlling buttons, to either restart the round or get back to check the hints, under the game board
document.getElementById('game_control_btn').addEventListener('mouseover',gameDOMFunction.game_control_btns_parent);
document.getElementById('back_to_game_btn').addEventListener('mousedown',gameDOMFunction.back_to_hint_or_to_game);
//The nav bar
document.getElementById('navbar').addEventListener('mousedown',gameDOMFunction.navbarShow);

window.addEventListener('load',() => {
    document.getElementById('start_page_btn').classList.toggle('none');
})