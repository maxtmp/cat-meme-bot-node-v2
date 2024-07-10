const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const TOKEN = process.env.TOKEN;
const BOT_USERNAME = '@MaxsCatBot';
const MEME_DIRECTORY = path.resolve(__dirname, 'memes');

const bot = new TelegramBot(TOKEN, { polling: true });

console.log(`MEME_DIRECTORY: ${MEME_DIRECTORY}`);

if (!fs.existsSync(MEME_DIRECTORY)) {
  console.error(`Directory does not exist: ${MEME_DIRECTORY}`);
} else {
  console.log(`Directory exists: ${MEME_DIRECTORY}`);
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  console.log(`/start command received from ${chatId}`);
  bot.sendMessage(chatId, `Hello! I am ${BOT_USERNAME}. Send "/help" to see the list of commands.`);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  console.log(`/help command received from ${chatId}`);
  bot.sendMessage(chatId, 'Here is the list of commands:\n/help - Show the list of commands\n/meow - Show a random cat picture');
});

bot.onText(/\/meow/, (msg) => {
  const chatId = msg.chat.id;
  console.log(`/meow command received from ${chatId}`);

  fs.readdir(MEME_DIRECTORY, (err, files) => {
    if (err) {
      console.error('Error reading meme directory:', err);
      bot.sendMessage(chatId, 'An error occurred while fetching memes.');
      return;
    }

    const fileCount = files.length;
    const fileExtensions = files.map(file => path.extname(file)).filter((ext, index, self) => self.indexOf(ext) === index);
    console.log(`Number of files: ${fileCount}`);
    console.log(`File extensions: ${fileExtensions.join(', ')}`);

    if (fileCount > 0) {
      const randomMeme = files[Math.floor(Math.random() * files.length)];
      const memePath = path.join(MEME_DIRECTORY, randomMeme);

      bot.sendPhoto(chatId, memePath).then(() => {
        console.log(`Meme sent to ${chatId}: ${randomMeme}`);
      }).catch(error => {
        console.error('Error sending meme:', error);
      });
    } else {
      bot.sendMessage(chatId, 'No cat memes found!');
    }
  });
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot started');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
