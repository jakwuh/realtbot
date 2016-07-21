import Botkit from 'botkit';
import {extend} from 'lodash';
import appConfig from './configs/app.json';
import replies from './configs/replies.json';

function create({token}) {
    return new Promise((resolve, reject) => {
        const controller = Botkit.slackbot(appConfig.botkit);
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

    for (let key in replies) {
        controller.hears([key], 'direct_message,direct_mention,mention,ambient', function (bot, message) {
            bot.reply(message, replies[key]);
        });
    }

    return {controller, bot};
}

export function createBot({token}) {
    return create({token}).then(initialize);
}
