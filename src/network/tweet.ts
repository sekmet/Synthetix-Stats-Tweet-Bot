import db from '../db';
import Twit, { Response } from 'twit';
import { toMoneyFormat, getSNXPrice, totalSupply } from '../utils';

const Twitter = new Twit(require('../config'));

const tweetAlert = async (data: any) => {

    let tweet = `
🌟 1 $SNX = ${toMoneyFormat(await getSNXPrice())}
🚀 SNX Market Cap = ${toMoneyFormat(data.SNX24HVolume)}
💵 sUSD on Curve: ${toMoneyFormat(data.SNX24HVolume)}
📊 SNX Volume: ${toMoneyFormat(data.SNX24HVolume)}
🛡️ Issuance Ratio: ${toMoneyFormat(data.SNX24HVolume)}
🏧 Total SNX Staked: ${toMoneyFormat(data.SNX24HVolume)}
➗ Network C-RATIO: ${toMoneyFormat(100)}
👍 Active C-RATIO: ${data.SNX24HVolume}
😃 SNX Holders: ${data.SNX24HVolume}

✅ #SNX Network statistics #Swaps.Vision #openDefiHackathon
`

console.log(tweet)
/*
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
*/

return Promise.resolve(tweet);

}

export default tweetAlert;

/*
SNX Market Cap
$2,919,245,910
Fully diluted market cap for SNX
sUSD PRICE
$1.00
Price of sUSD on Curve
SNX Volume
$257,647,714
SNX 24 hr volume from Coinmarketcap
Issuance Ratio
500%
The base issuance ratio of SNX/(sUSD debt) for all SNX stakers
Total SNX Staked
$1,513,711,537
The total value of all staked SNX
Network C-RATIO
532%
The aggregate collateralization ratio of all SNX wallets
Active C-RATIO
367%
The aggregate collateralization ratio of SNX wallets that are currently staking
Snx Holders
77,961
Total number of SNX holders*/