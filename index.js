const express = require('express');
const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const bot = new Telegraf(TOKEN);
const MEME_DIRECTORY = path.resolve(__dirname, '../memes');

// Log the directory path
console.log(`MEME_DIRECTORY: ${MEME_DIRECTORY}`);

// Check if the directory exists
if (!fs.existsSync(MEME_DIRECTORY)) {
  console.error(`Directory does not exist: ${MEME_DIRECTORY}`);
} else {
  console.log(`Directory exists: ${MEME_DIRECTORY}`);
}

// Handle the /start command
bot.start((ctx) => {
  ctx.reply(`Hello! I am ${BOT_USERNAME}. Send "/help" to see the list of commands.`);
});

// Handle the /help command
bot.help((ctx) => {
  ctx.reply('Here is the list of commands:\n/help - Show the list of commands\n/meow - Show a random cat picture');
});

// Handle the /meow command
bot.command('meow', (ctx) => {
  fs.readdir(MEME_DIRECTORY, (err, files) => {
    if (err) {
      console.error('Error reading meme directory:', err);
      ctx.reply('An error occurred while fetching memes.');
      return;
    }

    // Log the list of files found and their extensions
    console.log(`Files found in meme directory: ${files}`);
    const fileCount = files.length;
    const fileExtensions = files.map(file => path.extname(file)).filter((ext, index, self) => self.indexOf(ext) === index);
    console.log(`Number of files: ${fileCount}`);
    console.log(`File extensions: ${fileExtensions.join(', ')}`);

    // Check if there are any memes available
    if (fileCount > 0) {
      // Select a random meme
      const randomMeme = files[Math.floor(Math.random() * files.length)];
      const memePath = path.join(MEME_DIRECTORY, randomMeme);

      // Send the selected meme to the user
      ctx.replyWithPhoto({ source: memePath });
    } else {
      // No memes found in the directory
      ctx.reply('No cat memes found!');
    }
  });
});

// Set the webhook
bot.telegram.setWebhook(`${WEBHOOK_URL}/telegram`);

app.post('/telegram', (req, res) => {
  bot.handleUpdate(req.body, res);
});

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
