import Botkit from 'botkit';
import {extend} from 'lodash';
import botkitConfig from './configs/botkit.json';
import replies from './configs/replies.json';

const channel = 'C1Q6L2K1B';

function create({token}) {
    return new Promise((resolve, reject) => {
        const controller = Botkit.slackbot(botkitConfig);
        controller.spawn({token}).startRTM((err, bot) => {
            if (err) {
                reject(err);
            } else {
                resolve({controller, bot});
            }
        });
    })
}

function initialize({controller, bot}) {

    bot.say({
        channel,
        text: 'Я снова здесь. Уже приступаю к работе.'
    });

    for (let key in replies) {
        controller.hears([key], 'direct_message,direct_mention,mention,ambient', function (bot, message) {
            bot.reply(message, replies[key]);
        });
    }

    return {controller, bot};
}

export function createBot({token}) {
    return create({token}).then(initialize).then(({controller, bot}) => {
        return {
            say: message => bot.say(extend({}, message, {channel}))
        }
    })
}
