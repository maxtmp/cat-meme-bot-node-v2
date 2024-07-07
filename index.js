// Import required modules
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Retrieve the bot token from environment variables
const TOKEN = process.env.TOKEN;
const BOT_USERNAME = '@MaxsCatBot';
const MEME_DIRECTORY = path.resolve(__dirname, 'memes');

// Create a new Telegram bot instance
const bot = new TelegramBot(TOKEN, { polling: true });

// Log the directory path
console.log(`MEME_DIRECTORY: ${MEME_DIRECTORY}`);

// Check if the directory exists
if (!fs.existsSync(MEME_DIRECTORY)) {
  console.error(`Directory does not exist: ${MEME_DIRECTORY}`);
} else {
  console.log(`Directory exists: ${MEME_DIRECTORY}`);
}

// Handle the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Hello! I am ${BOT_USERNAME}. Send "/help" to see the list of commands.`);
});

// Handle the /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Here is the list of commands:\n/help - Show the list of commands\n/meow - Show a random cat picture');
});

// Handle the /meow command
bot.onText(/\/meow/, (msg) => {
  const chatId = msg.chat.id;

  // Read the meme directory to get the list of meme files
  fs.readdir(MEME_DIRECTORY, (err, files) => {
    if (err) {
      console.error('Error reading meme directory:', err);
      bot.sendMessage(chatId, 'An error occurred while fetching memes.');
      return;
    }

    // Log the number of files and file extensions
    const fileCount = files.length;
    const fileExtensions = files.map(file => path.extname(file)).filter((ext, index, self) => self.indexOf(ext) === index);
    console.log(`Number of files: ${fileCount}`);
    console.log(`File extensions: ${fileExtensions.join(', ')}`);

    // Check if there are any memes available
    if (files.length > 0) {
      // Select a random meme
      const randomMeme = files[Math.floor(Math.random() * files.length)];
      const memePath = path.join(MEME_DIRECTORY, randomMeme);

      // Send the selected meme to the user
      bot.sendPhoto(chatId, memePath);
    } else {
      // No memes found in the directory
      bot.sendMessage(chatId, 'No cat memes found!');
    }
  });
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot started');
