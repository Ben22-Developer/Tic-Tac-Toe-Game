const game_object = {
    game_board: [1,2,3,4,5,6,7,8,9],
    game_patterns: [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,5,7],[3,6,9],[4,5,6],[7,8,9]],
    player_1_name:'',player_2_name:'',player_1_symbol:'',player_2_symbol:'',
    player_1: [],
    player_2: [],
    players_score:[0,0],
    game_rounds: 1
}

const gamePlayingFunction =(() => {
    //Global Variables in gamePlayingFunction
    const player_symblos = ['X','O'];
    let dom_game_board,spans;
    let taken_keys = [];
    let comp_plays,comp_plays_first,user2_plays,easy,medium,hard;
    comp_plays = false;
    user2_plays = false;
    comp_plays_first = false;
    //setting users names and the game level
    const game_set_fn = (firstPlayerName,secondPlayerName,gameLevel,start) => {      
        if (start) {
            game_object.player_1_name = firstPlayerName;
            game_object.player_2_name = secondPlayerName;
            if (game_object.player_2_name === 'Robot') {
                comp_plays = true;
            }
        }
        if (gameLevel === 'Easy') {
            easy = true; 
            medium = false; 
            hard = false;
        }
        else if (gameLevel === 'Medium') {
            easy = true; 
            medium = true; 
            hard = false;  
        }
        else if (gameLevel === 'Hard') {
            easy = true; 
            medium = true; 
            hard = true;
        }
        //setting players symbols either X or O
        game_object.player_1_symbol = player_symblos[Math.round(Math.random(0,1))];
        for (let i = 0; i<player_symblos.length; i++) {
            if (player_symblos[i] !== game_object.player_1_symbol) {
                game_object.player_2_symbol = player_symblos[i];
            }
        }
        //Upper Information about players
        document.getElementById('player_1_symbol').innerText = `Symbol: ${game_object.player_1_symbol}`;
        document.getElementById('player_2_symbol').innerText = `Symbol: ${game_object.player_2_symbol}`;
        document.getElementById('player_1_name').innerText = `Player: ${game_object.player_1_name}`;
        document.getElementById('player_2_name').innerText = `Player: ${game_object.player_2_name}`;
        //Information about the rounds and the player playing
        document.getElementById('game_round').innerText = `Round: ${game_object.game_rounds}`;
        document.getElementById('player_playing').innerText = `${game_object.player_1_name}'s turn (${game_object.player_1_symbol})`;

        dom_game_board = document.getElementById('game_board').querySelectorAll('.inner_shell');
        spans = document.getElementById('game_board').querySelectorAll('span');
        document.addEventListener('keyup',user_keyboard_validation);
    }

    //keyboard support validation
    const user_keyboard_validation = e => {
        const isItNum = parseInt(e.key);
        if (isItNum) {
            game_controller_fn(isItNum)
        }
    }

    //Functions to help in collection of the user inputs
    const pass_user_choice_fn = (e) => {
        game_controller_fn(parseInt(e.target.innerText));
    }
    const user_choice_fn = () => {
        dom_game_board.forEach((shell) => {
            shell.addEventListener('mousedown',pass_user_choice_fn);
        })
        dom_game_board.forEach(shell => {
            shell.addEventListener('mouseup',() => {
                shell.removeEventListener('mousedown',pass_user_choice_fn);
            });
        });
    }

    //This function executes when user is playing with computer and he needs to change the hardness level of the game
    const game_change_level_fn = () => {
        document.addEventListener('mousedown',hide_game_level_btns);
        const game_level_btns = document.querySelectorAll('.game-level');
        game_level_btns.forEach(button => {
            button.removeAttribute('class','hide');
            button.setAttribute('class','game-level');
        })
        game_level_btns.forEach(button => {
            button.addEventListener('mousedown',e => {
            e.preventDefault();
            game_set_fn('','',e.target.value,false);
            document.getElementById('level_playing').innerText = `You are playing the (${e.target.value}) Level`;
            comp_plays = false;
            reset_game_board();
            comp_plays = true;
            comp_plays_first = false;
            game_level_btns.forEach(button => {
                button.setAttribute('class','game-level hide');
            })
            })
        })
    }

    const hide_game_level_btns = e => {
        if (!e.target.matches('#form-of-game-level')) {
            document.querySelectorAll('.game-level').forEach(button => {
                button.setAttribute('class','game-level hide');
            })
            document.removeEventListener('mousedown',hide_game_level_btns);
        }
    }

    //This function controls 80% of this game flow program
    const game_controller_fn = (user_choice = 5) => {

        //Global Variables in game_controller_fn
        let user1_choice_check,last_comp_possibility;
        user1_choice_check = true;

        //when user 1 is playing condition
        if (taken_keys.length < 8 && taken_keys.length && !user2_plays) {
            document.getElementById('game_board').style.pointerEvents = 'none';
            let user_win;
            user1_choice_check = not_repeat_taken_keys(user_choice);
            if (user1_choice_check && user_choice) {
                taken_keys.push(user_choice);
                user_win = game_record_fn(user_choice,game_object.player_1_name);
            }
            //to check if the user has made a win
            if (game_object.player_1.length >= 3) {
                if (user_win) {
                    document.querySelector('#game_board').setAttribute('class','game_board_off');
                    user1_choice_check = false;
                    setTimeout(() => {
                        game_end(game_object.player_1_name);
                        document.getElementById('game_board').style.pointerEvents = 'all';
                    },1500)
                    return 0
                }
            }
            if (taken_keys.length === 8) {
                last_comp_possibility = last_play_possibility_or_draw(game_object.player_2);                
                if (!last_comp_possibility) {
                    document.getElementById('game_board').style.pointerEvents = 'all';
                    return 0
                }
            }
            document.getElementById('game_board').style.pointerEvents = 'all';
        }
        else if (!taken_keys.length && !user2_plays && !comp_plays_first) {
            game_record_fn(user_choice,game_object.player_1_name);
            taken_keys.push(user_choice);
        }

        if (!comp_plays && taken_keys.length < 8 && !user2_plays) {
            document.getElementById('player_playing').innerText = `${game_object.player_2_name}'s turn (${game_object.player_2_symbol})`; 
            user2_plays = true;
            return 0
        }

        //when another user is playing
        if(user2_plays && user1_choice_check && taken_keys.length < 8 && user_choice) {
            taken_keys.push(user_choice);
            const user2_win = game_record_fn(user_choice,game_object.player_2_name);
                //to check if user2 has made a win
                if (game_object.player_2.length >= 3) {
                    if (user2_win) {
                        document.querySelector('#game_board').setAttribute('class','game_board_off');
                        setTimeout(() => {
                            game_end(game_object.player_2_name);
                        
                        },1500)
                    }
                }
                if (taken_keys.length === 8) {
                    last_play_possibility_or_draw(game_object.player_1);
                }
                user2_plays = false;
                document.getElementById('player_playing').innerText = `${game_object.player_1_name}'s turn (${game_object.player_1_symbol})`;
                return 0
            }                

        //when computer is playing condition
        if (comp_plays && user1_choice_check && taken_keys.length < 8 && user_choice) {
            document.getElementById('player_playing').innerText = `${game_object.player_2_name}'s turn (${game_object.player_2_symbol})`;
            document.getElementById('game_board').style.pointerEvents = 'none';
            const comp_choice = comp_choice_fn();
            taken_keys.push(comp_choice);

            setTimeout(() => {
                const comp_win = game_record_fn(comp_choice,game_object.player_2_name);
                //to check if the computer has made a win
                if (game_object.player_2.length >= 3) {
                    if (comp_win) {
                        document.querySelector('#game_board').setAttribute('class','game_board_off');
                        setTimeout(()=> {
                            game_end(game_object.player_2_name);    
                            },1500)
                    }
                }
                document.getElementById('game_board').style.pointerEvents = 'all';   
                document.getElementById('player_playing').innerText = `${game_object.player_1_name}'s turn (${game_object.player_1_symbol})`;
            },1000)
            if (taken_keys.length === 8) {
                last_play_possibility_or_draw(game_object.player_1);
            }
            return 0
        }

        //last play for the user 
        else if (user1_choice_check && taken_keys.length === 8 && user_choice && !comp_plays_first) {
            const user_win = game_record_fn(user_choice,game_object.player_1_name);
            //to check if the user has made a win
            if (user_win) {
                document.querySelector('#game_board').setAttribute('class','game_board_off');            
                setTimeout(() => {
                    game_end(game_object.player_1_name);
                },1500)
            }
        }
        
        //last play for the computer
        else if (user1_choice_check && taken_keys.length === 8 && user_choice && comp_plays_first) {
            document.getElementById('player_playing').innerText = `${game_object.player_2_name}'s turn (${game_object.player_2_symbol})`;
            document.getElementById('game_board').style.pointerEvents = 'none';
            setTimeout(() => {
                const comp_win = game_record_fn(last_comp_possibility,game_object.player_2_name);
                //to check if the computer has made a win
                if (comp_win) {
                    document.querySelector('#game_board').setAttribute('class','game_board_off');
                    game_end(game_object.player_2_name);        
                }
                document.getElementById('game_board').style.pointerEvents = 'all';   
            },1500)
        }
        return 0
    }

    const last_play_possibility_or_draw = (array_to_check) => {
        const possibility = comp_medium_hard_level_fn (array_to_check);
        //draw situation
        if (!possibility) {
            document.querySelector('#game_board').setAttribute('class','game_board_off');
            setTimeout (() => {
                game_end();
            },1500)
            return false
        }
        else {
            return possibility
        }
    }

    const game_record_fn = (choice,who_plays) => {
        let winner;
        mark_dom_game_board_taken_index(choice,who_plays);
        if (who_plays === game_object.player_1_name) {
            game_object.player_1.push(choice);
            game_object.player_1.sort();
            winner = game_winner_fn(game_object.player_1);
        }
        else if (who_plays === game_object.player_2_name) {
            game_object.player_2.push(choice);
            game_object.player_2.sort();
            winner = game_winner_fn(game_object.player_2);
        }
        return winner
    }

    const mark_dom_game_board_taken_index = (choice,who_plays) => {
        let i;
        for (i = 0; i<dom_game_board.length; i++) {
            if (parseInt(dom_game_board[i].innerText) === choice) {
                break
            }
        }
        dom_game_board[i].setAttribute('class','inner_shell show');
        if (who_plays === game_object.player_1_name) {
            spans[i].textContent = game_object.player_1_symbol;
            spans[i].setAttribute('class','show');
        }
        else if (who_plays === game_object.player_2_name) {
            spans[i].textContent = game_object.player_2_symbol;
            spans[i].setAttribute('class','show');  
        }
    }

    const game_end = (who_plays = 'draw') => {
        document.removeEventListener('keyup',user_keyboard_validation);
        game_restart();
        if (who_plays === game_object.player_1_name) {
            game_object.players_score[0]++;
            document.getElementById('player_1_points').innerText = `Rounds: ${game_object.players_score[0]}`;
        }
        else if (who_plays === game_object.player_2_name) {
            game_object.players_score[1]++;
            document.getElementById('player_2_points').innerText = `Rounds: ${game_object.players_score[1]}`;
        }
        if (who_plays !== 'draw') {
            document.querySelector('#round_won').querySelector('p').innerText = `${who_plays} wins the round \n 🥳 🥳 🥳`;
        }
        else {
            document.querySelector('#round_won').querySelector('p').innerText = `It's a draw`;
        }
        if (game_object.players_score[0] > game_object.players_score[1]) {
            player_with_trophy(0);
        }
        else if (game_object.players_score[0] < game_object.players_score[1]) {
            player_with_trophy(1);
        }
        else {
            player_with_trophy(-1);
        }
        game_object.game_rounds ++;
        game_sections_attribute_set(true);
    }

    const game_sections_attribute_set = (bool = false) => {
        if (bool) {
            document.querySelector('#game_playing').setAttribute('class','no_select');
            document.querySelector('#navbar').setAttribute('class','no_select');
            document.querySelector('#round_won').removeAttribute('class','round_won_hide');
        }
        else {
            document.querySelector('#game_playing').removeAttribute('class','no_select');
            document.querySelector('#game_board').removeAttribute('class','game_board_off');
            document.querySelector('#navbar').removeAttribute('class','no_select');
            document.querySelector('#round_won').setAttribute('class','round_won_show round_won_hide');
            document.addEventListener('keyup',user_keyboard_validation);
        }
    }

    const player_with_trophy = (index) => {
        const trophy_class = document.querySelectorAll('.trophy');
        if (index === -1) {
            trophy_class[0].innerText = `Champion `;
            trophy_class[1].innerText = `Champion `;
            return 0
        }
        for (let i = 0; i<trophy_class.length; i++) {
            if (i === index) {
                trophy_class[i].innerText = `Champion 🏆`;
            }
            else {
                trophy_class[i].innerText = `Champion 😞`;
            }
        }
    }

    const continue_to_play = () => {
        game_sections_attribute_set();
        reset_game_board();
    }
    const continue_or_stop_rounds_fn = e => {

        if (e.target.innerText === 'Continue To Play') {
            document.getElementById('continue_or_stop_rounds').children[0].addEventListener('mousedown',continue_to_play);
        }
        else if (e.target.innerText === 'Restart The Game') {
            document.getElementById('continue_or_stop_rounds').children[1].addEventListener('mousedown',game_strict_restart_fn);
        }
    }

    //game restart functions
    const game_restart = (scratch_start = false) => {
        if (scratch_start) {
            comp_plays_first = false;
            game_object.player_1_name = '';
            game_object.player_2_name = '';
            game_object.players_score = [0,0];
            game_object.game_rounds = 1;
            player_with_trophy(-1);
        }
        taken_keys = [];
        game_object.player_1 = [];
        game_object.player_2 = [];
        document.getElementById('game_round').innerText = `Round: ${game_object.game_rounds}`;
        document.getElementById('player_playing').innerText = `Player: ${game_object.player_1_name} (${game_object.player_1_symbol})`;
        document.getElementById('player_1_points').innerText = `Rounds: ${game_object.players_score[0]}`;
        document.getElementById('player_2_points').innerText = `Rounds: ${game_object.players_score[1]}`;
    }

    //game restarting from scratch
    const game_strict_restart_fn = () => {
        document.removeEventListener('keyup', user_keyboard_validation);   
        comp_plays = false;
        user2_plays = false;
        gameDOMFunction.input_collection_fn(false);
        gameDOMFunction.game_playing_board();
        game_restart(true);
        reset_game_board(true);
        document.querySelector('#round_won').setAttribute('class','round_won_show round_won_hide');
        document.querySelector('#game_board').removeAttribute('class','game_board_off');
        document.querySelector('#navbar').removeAttribute('class','no_select');
        document.getElementById('game_settings').setAttribute('class','hide-nav');
    }

    const invoke_game_reset_board = () => {
        reset_game_board();
    }

    const reset_game_board = (bool = false) => {
        document.getElementById('game_board').querySelectorAll('.inner_shell').forEach((shell,index) => {
            shell.setAttribute('class','inner_shell');
            if (shell.querySelector('span').matches('.show')) {
                shell.querySelector('span').removeAttribute('class','show');
                shell.querySelector('span').innerText = (index + 1);
            }
        })

        //To avoid  unnecessary calls when we have already triggered game_restart()
        if (!bool) {
            game_restart();
        }
        if (comp_plays) {
            if (comp_plays_first) {
                comp_plays_first = false
                document.getElementById('player_playing').innerText = `${game_object.player_1_name}'s turn (${game_object.player_1_symbol})`;
            }
            else {
                comp_plays_first = true
                document.getElementById('player_playing').innerText = `${game_object.player_2_name}'s turn (${game_object.player_2_symbol})`;
                game_controller_fn ();
            }
        }
    }

    const game_winner_fn = (game_player_array) => {
        let i,j,failed_index,failed_at_index,failed_index_array,suceed_index_array,include_check,check_index1_new_array,check_winner_incr,winner;
        winner = false;
        failed_index_array = [];
        for (i = 0; i < game_object.game_patterns.length; i++) {
            check_index1_new_array = true;
            check_winner_incr = 0;
            suceed_index_array = [];
            for (j = 0; j < game_object.game_patterns.length; j++) {
                if (failed_index) {
                    check_index1_new_array = (failed_index === game_object.game_patterns[i][0]) ? false:true;
                    if (!check_index1_new_array) {
                        for (let k = 1; k < failed_at_index; k++) {
                            check_index1_new_array = failed_index_array[k] === game_object.game_patterns[i][k] ? false:true;
                            if(check_index1_new_array) 
                               break
                        }
                    }
                }
                if (check_index1_new_array) {
                    include_check = game_player_array.includes(game_object.game_patterns[i][j]);
                    failed_index = 0;
                    failed_index_array = [];
                    if (include_check) {
                        check_winner_incr ++;
                        suceed_index_array.push(game_object.game_patterns[i][j]);
                    }
                    else {
                        failed_index = game_object.game_patterns[i][0];
                        if (check_winner_incr) {
                            failed_at_index = check_winner_incr + 1;
                            failed_index_array = [...game_object.game_patterns[i]];
                        }
                        break
                    }
                }
                else {
                    break
                }
            }
            if (check_winner_incr === 3) {
                winner = true;
                break
            }
        }
        if (winner) {
            highLight_winning_indexes(suceed_index_array);
            return true
        }
        else {
            return false
        }
    }

    const highLight_winning_indexes = (suceed_index_array) => {
        for (let i = 0; i<suceed_index_array.length; i++) {
            suceed_index_array[i]--;
        }
        for (let j = 0; j<suceed_index_array.length; j++) {
            dom_game_board[suceed_index_array[j]].setAttribute('class','inner_shell show won');
        }
    }

    const comp_choice_fn = () => {
        let choice,choice_check,check_last_index_for_comp_win;
        check_last_index_for_comp_win = false;


        if (medium === true && easy === true) {
            if (game_object.player_2.length >= 2) {

                //to make comp win if it's in the way while having 2 similar nbrs 
                choice = comp_medium_hard_level_fn(game_object.player_2);
                if (typeof(choice) === 'number') {
                    return choice
                }
                //block for priority 2 
                if (hard === true) {
                    choice = comp_medium_hard_level_fn(game_object.player_1);
                    if (typeof(choice) === 'number') {
                        return choice
                    }  
                }
            }

            //to block the user for the first time play if the user needs to win
            if (game_object.player_1.length === 2 && hard === true) {
                choice = comp_medium_hard_level_fn(game_object.player_1);
                if (typeof(choice) === 'number') {
                    return choice
                }
            }

            //to play 5 for the first time if the user misses it
            if (!game_object.player_2.length) {
                choice_check = not_repeat_taken_keys(5)
                if (choice_check) {
                    return 5
                }
            }
        }
        const array_possibilities = [1,2,3,4,5,6,7,8,9];
        for (let i = 0; i<array_possibilities.length; i++) {
            choice = array_possibilities[i];
            choice_check = not_repeat_taken_keys(choice);
            if (choice_check) {
                break
            }
        }
        return choice
    }

    const comp_medium_hard_level_fn = (array_to_check) => {
        for (let i = 0; i<game_object.game_patterns.length; i++) {
            let similar_index,similar_index_incr,not_in_array_to_check;
            similar_index_incr = 1; 

            //iterating through a single array to find 2 nbrs which can make a block or make a win
            for (let k = 0; k<game_object.game_patterns[i].length; k++) {
                similar_index = array_to_check.includes(game_object.game_patterns[i][k]) ? true:false;
                if (similar_index) {
                    similar_index_incr ++;
                }
                else {
                    not_in_array_to_check = game_object.game_patterns[i][k];
                }
            }
            if (similar_index_incr > 2) {
                const if_not_taken = not_repeat_taken_keys(not_in_array_to_check);
                if (if_not_taken) {
                    return not_in_array_to_check
                }
            }
        }
        return false
    }

    const not_repeat_taken_keys = choice => {
        if (choice === 0) {
            return false
        }
        for (let i = 0; i<taken_keys.length; i++) {
            if (choice === taken_keys[i]) {
                return false
            }
        }
        return true
    }
    return {game_controller_fn,game_set_fn,user_choice_fn,continue_or_stop_rounds_fn,game_strict_restart_fn,game_change_level_fn,invoke_game_reset_board}
})()

//events firing directly to the gamePlayingFunction
document.getElementById('select-change-level').addEventListener('click',gamePlayingFunction.game_change_level_fn);
document.getElementById('game_board').addEventListener('mousemove',gamePlayingFunction.user_choice_fn);
document.getElementById('continue_or_stop_rounds').addEventListener('mouseover',gamePlayingFunction.continue_or_stop_rounds_fn)

export {game_object,gamePlayingFunction}