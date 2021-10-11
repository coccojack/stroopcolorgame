//dotenv file module
const dotenv = require('dotenv');
dotenv.config();
//express module
const express = require('express');
const portn = process.env.PORT;
//telegram module
const telegram = require('node-telegram-bot-api');
const token = process.env.TELEGRAMTOKEN;
const bot = new telegram(token, { polling: true });
const gameName = "StroopColorGame";
const gamehosturl = process.env.GAMEHOSTURL;

//init
const app = express();
const queries = {};

app.use(express.static('public'));
//bot commands

//help
bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "This bot implements Stroop Color Game. Say /game if you want to play."));

//start - game
bot.onText(/start|game/, (msg) => bot.sendGame(msg.from.id, gameName));

//start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome");
});

//called when user select the bot callback_query about the game
bot.on("callback_query", function(query) {
    if (query.game_short_name !== gameName) {
        bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
    } else {
        console.log(query.id, 'requested game');
        queries[query.id] = query;
        let gameurl = gamehosturl + "?id=" + query.id;
        bot.answerCallbackQuery(query.id, { url: gameurl });
    }
});

//inlinequery per fornire il gioco
bot.on("inline_query", function(iq) {
    bot.answerInlineQuery(iq.id, [{ type: "game", id: "0", game_short_name: gameName }]);
});


//logica highscore
app.get("/highscore/:score", function(req, res, next) {
    let score = req.params.score;
    console.log('......new score from:', req.query.id, 'score:', score);
    if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
    let query = queries[req.query.id];
    let options;
    console.log('......retrieving query options.......\n');
    if (query.message) {
        options = {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id
        };
    } else {
        options = {
            inline_message_id: query.inline_message_id
        };
    }
    console.log('........setting score.......\n');
    bot.setGameScore(query.from.id, parseInt(score), options).then(() => { console.log('...highscore updated!\n') }, (err) => { console.log('...error: score too low.\n') });
});

//server start
app.listen(portn);
console.log('\n< ~~~ > Server listening on port', portn, "< ~~~ > Ctrl+C to Quit.\n");