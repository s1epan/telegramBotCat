require('dotenv').config()
const { Bot, GrammyError, HttpError } = require('grammy')
const axios = require('axios')
const { useState, useEffect } = require('react')

const bot = new Bot(process.env.BOT_APY_KEY)

bot.api.setMyCommands([
   {
      command: 'start',
      description: 'Start bot'
   },
   {
      command: 'help',
      description: 'Get help'
   }
])

bot.command('help', async (ctx) => {
   await ctx.reply('Возникли трудности, напиши <a href="https://t.me/l053xx">мне</a>', {
      parse_mode: 'HTML'
   })
})

bot.command('start', async (ctx) => {
   await ctx.react('❤')
   await console.log(ctx.msg)
   await ctx.reply('Привет! Давай выберем тебе котика ^-^ \nдостаточно написать «cat»')
})

bot.hears('cat', async (ctx) => {

   await axios({
      url: `https://api.thecatapi.com/v1/images/search?limit=1&api_key=${process.env.CAT_API_KEY}`
   }).then(async res => {
      const data = res
      console.log(data.data.map(el => el.url).toString());
      const material = data.data.map(el => el.url).toString()
      console.log(material.slice(-3));
      if(material.slice(-3) === 'gif') {
         await ctx.replyWithVideo(`${material}`);
      } else {
         await ctx.replyWithPhoto(`${material}`);
      }
   })
})

bot.hears(/блять/, async (ctx) => {
   await ctx.reply('Ругаемся? (◣_◢)')
})

bot.hears('ID').filter((ctx) => {
   return ctx.from.id === 798621247
}, async (ctx) => {
   await ctx.reply(`Админ, ваш ID: ${ctx.from.id}`)
})

bot.on('msg', async (ctx) => {
   await ctx.reply('Что-то не так... ( ╥ω╥ ) \n/help')
})

bot.on('edit', async (ctx) => {
   await ctx.reply('Ты изменил сообщение, я все вижу (★≧▽^))★☆')
})

bot.catch((err) => {
   const ctx = err.ctx
   console.error(`Error while handling update ${ctx.update.update_id}:`);
   const e = err.error

   if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
   } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
   } else {
      console.error("Unknown error:", e);
   }
})

bot.start()