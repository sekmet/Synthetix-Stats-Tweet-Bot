import db from '../db';
import Twit, { Response } from 'twit';
import { toMoneyFormat, getSNXPrice, totalSupply } from '../utils';

const Twitter = new Twit(require('../config'));
const snxData = require('synthetix-data'); // common js

const tweetAlert = async (trade: any) => {
    let tweet = `
🌟 1 $SNX = ${toMoneyFormat(await getSNXPrice())}
💵 From: $${trade.fromCurrencyKey} ( ${toMoneyFormat(trade.fromAmountInUSD)} )
💶 To: $${trade.toCurrencyKey} ( ${toMoneyFormat(trade.toAmountInUSD)} )
🧾 Fees USD: ${toMoneyFormat(trade.feesInUSD)}
🛡️ Block: ${trade.block}
🔥 Gas Price: ${trade.gasPrice} Gwei

🚀 Total Supply ${trade.fromCurrencyKey}: ${toMoneyFormat(await totalSupply(trade.fromCurrencyKey))}
🚀 Total Supply ${trade.toCurrencyKey}: ${toMoneyFormat(await totalSupply(trade.toCurrencyKey))}

✅ #SNX $${trade.toCurrencyKey} $${trade.fromCurrencyKey} #Swaps.Vision #openDefiHackathon
`

try {
    let isData = db.getData(`/${trade.hash}`);
    return isData;
} catch(error) {
    db.push(`/${trade.hash}`, {trade});
    console.log(tweet);
    Twitter.post('statuses/update', { status: tweet }, (error: Error, response: Response) => {
        if (response) {
          console.log(
            'Success! Check your bot, it should have tweeted something.',
          );
        }
        if (error) {
          console.log('There was an error with Twitter:', error);
        }
      }
    );   
};

}

export default tweetAlert;