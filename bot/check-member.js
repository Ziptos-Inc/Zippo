// const TelegramBot = require('node-telegram-bot-api');
import TelegramBot from 'node-telegram-bot-api';

const TOKEN = import.meta.env.VITE_BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

async function listToken(msg) {
    const userId = msg.from.id;
    const channelId = 'channel_id_no';
    const groupId = 'group_id_no';

    // const isChannelMember = await isUserMember(5532711018, '@dvdoye');
    // console.log(isChannelMember);
    // const isGroupMember = await isUserMember(userId, groupId);
    const isChannelMember = await isUserMember(userId, channelId);

    if (!(isChannelMember)) {
        await bot.sendMessage(
            msg.chat.id,
            "<i>C'mon Mate, Subscribe to our channel(@apetrending).\n\n",
            { parse_mode: 'HTML' }
        );
        return;
    }

    await bot.sendMessage(msg.chat.id, "Enter the contract address of your token:");
}

async function isUserMember(userId, chatId) {
    try {
        const memberStatus = await bot.getChatMember(chatId, userId);
        if (['member', 'administrator', 'creator'].includes(memberStatus.status)) {
            console.log(`They are a member`);
            return true;
        }
        return false;
    } catch (e) {
        console.error(`Error checking membership: ${e}`);
        return false;
    }
}

async function checkMembership(userId, groupOrChannelId) {
    try {
        const memberStatus = await bot.getChatMember(groupOrChannelId, userId);
        if (['member', 'administrator', 'creator'].includes(memberStatus.status)) {
            console.log(`User ${userId} is a member of ${groupOrChannelId}`);
            return true;
        }
        return false;
    } catch (e) {
        console.error(`Error checking membership: ${e}`);
        return false;
    }
}

// Register command handler
bot.onText(/\/list_token/, listToken);

console.log('Bot is running...');