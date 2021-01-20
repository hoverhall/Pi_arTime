const TelegramBot = require('node-telegram-bot-api');

const fs = require('fs');
const path = "./pidar_directory/"
const filename = "pidar_base.json"
 


// replace the value below with the Telegram token you receive from @BotFather
const token = 'TELEGRAM_BOT_TOKEN';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/reg_game/, (msg, match) => {
    const chatId = msg.chat.id.toString();
    const chatId_ = msg.chat.id;

    console.log(msg)
    let jdata = {}
    new Promise(res => {
        fs.readFile(path+filename, function(err, data){
            if(err){
                console.error(err);
            }else{
                jdata = JSON.parse(data)
                res()
            }
        });
    })
    .then(() => {
        if (jdata.games_list.indexOf(chatId) == 0) {
            bot.sendMessage(chatId_, "Игра уже существует!");
        } else {
            jdata.games_list.push(chatId)
            jdata.games[chatId] = {
                users_list: [],
                users: {
                },
                pidar: null
            }

            let udata = JSON.stringify(jdata)
            fs.writeFileSync(path+filename, udata);
            bot.sendMessage(chatId_, "Игра зарегана! Можно выбирать пидара!");
        }
    })
})

bot.onText(/\/reg_me/, (msg, match) => {
    const chatId = msg.chat.id.toString();
    const chatId_ = msg.chat.id;

    console.log(msg)
    let jdata = {}
    new Promise(res => {
        fs.readFile(path+filename, function(err, data){
            if(err){
                console.error(err);
            }else{
                jdata = JSON.parse(data)
                res()
            }
        });
    })
    .then(() => {
        if (jdata.games[chatId].users_list.indexOf(msg.from.id) == 0) {
            bot.sendMessage(chatId_, "Дохуя хочешь, ты уже есть!");
        } else {
            jdata.games[chatId].users_list.push(msg.from.id)
            jdata.games[chatId].users[msg.from.id] = {
                ...msg.from,
                pidar_count: 0,
                pidar_time: 0,
                reg_warnings: 0
            }
            // jdata.game_user_data[msg.from.id] = {
            //     pidar_count: 0
            // }

            let udata = JSON.stringify(jdata)
            fs.writeFileSync(path+filename, udata);
            bot.sendMessage(chatId_, "Поздравляю! Теперь ты кандидат в пидары!");
        }
    })
})

// Matches "/echo [whatever]"
bot.onText(/\/kto_pidarok/, (msg, match) => {
    const chatId = msg.chat.id.toString();
    const chatId_ = msg.chat.id;

    console.log(msg)
    let jdata = {}
    new Promise(res => {
        fs.readFile(path+filename, function(err, data){
            if(err){
                console.error(err);
            }else{
                jdata = JSON.parse(data)
                res()
            }
        });
    })
    .then(() => {
        if (jdata.games[chatId].users_list.length < 2) {
            bot.sendMessage(chatId_, "Маловато кандидатов в пидары!");
        } else {
            if (jdata.games[chatId].users[jdata.games[chatId].pidar].pidar_time < msg.date) {
                jdata.games[chatId].pidar = jdata.games[chatId].users_list[Math.floor(Math.random() *  jdata.users_list.length)]
    
                jdata.games[chatId].users[msg.from.id].pidar_count += 1;
                jdata.games[chatId].users[msg.from.id].pidar_time = (msg.date + 86400) * 1000
    
                let udata = JSON.stringify(jdata)
                fs.writeFileSync(path+filename, udata);
                bot.sendMessage(chatId_, `Пидар выбран! И это ${jdata.games[chatId].users[jdata.games[chatId].pidar].first_name} ${jdata.games[chatId].users[jdata.games[chatId].pidar].last_name} (@${jdata.games[chatId].users[jdata.games[chatId].pidar].username})`);
            } else {
                bot.sendMessage(chatId_, `${jdata.games[chatId].users[jdata.games[chatId].pidar].first_name} ${jdata.games[chatId].users[jdata.games[chatId].pidar].last_name} (@${jdata.games[chatId].users[jdata.games[chatId].pidar].username}) сегодня пидарасина`)
            }
        }
    })
});

bot.onText(/\/pidar_top/, (msg, match) => {
    const chatId = msg.chat.id.toString();
    const chatId_ = msg.chat.id;

    console.log(msg)
    let jdata = {}
    new Promise(res => {
        fs.readFile(path+filename, function(err, data){
            if(err){
                console.error(err);
            }else{
                jdata = JSON.parse(data)
                res()
            }
        });
    })
    .then(() => {
        if (jdata.games[chatId].users_list.length < 2) {
            bot.sendMessage(chatId_, "Статистики нет");
        } else {
            let score_list = []
            let stats = []
            let message = "Статистика по пидарам:\n"
            jdata.games[chatId].pidar = jdata.games[chatId].users_list[Math.floor(Math.random() *  jdata.users_list.length)]

            jdata.games[chatId].users[msg.from.id].pidar_count += 1;
            jdata.games[chatId].users[msg.from.id].pidar_time = (msg.date + 86400) * 1000

            for (let user_name of jdata.games[chatId].users_list) {
                score_list.push(jdata.games[chatId].users[user_name].pidar_count)
            }

            score_list.sort((a, b) => b - a);
            console.log(score_list)

            for (let score of score_list) {
                for (let user_name of jdata.games[chatId].users_list) {
                    let user = jdata.games[chatId].users[user_name]
                    if (score == user.pidar_count) {
                        message += `${user.first_name} ${user.last_name} (@${user.username}) - ${score} раз(а)\n`
                    }
                }    
            }

            bot.sendMessage(chatId_, message);
        }
    })
});

bot.onText(/\/bot_info/, (msg, match) => {
    const chatId = msg.chat.id.toString();
    const chatId_ = msg.chat.id;

    let message = `Disclaimer - Do not use this bot if you don't like fun!\n`+
                  `Author - hoverhall\n`+
                  `git - https://github.com/hoverhall/Pi_arTime`

    bot.sendMessage(chatId_, message);
});