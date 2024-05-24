const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./option')
const token = '6583807713:AAECHkaGEPiUCozwDGNQ2HleikZsaaf3EoE'

const bot = new TelegramApi(token, {polling: true}) 

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
} 

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра: угадай цифру'}
    ])
    
    bot.on( 'message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/8b3/866/8b3866c8-c107-4b96-9bc3-7089e4478e75/192/2.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Тиграна`)
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
           return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if(data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${data}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению, ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }   
    })
}

start ()