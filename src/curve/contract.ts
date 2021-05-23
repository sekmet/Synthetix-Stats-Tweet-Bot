import Twit, { Response } from 'twit';
import db from '../db';
const Web3 = require('web3'); 
const client = require('node-rest-client-promise').Client();
const dotenv = require('dotenv');
dotenv.config();

const Twitter = new Twit(require('../config'));

import { toMoneyFormat, getSNXPrice, totalSupply } from '../utils';

const INFURA_KEY = process.env.SECRET_INFURA_KEY; // Insert your own key here :)
const ETHERSCAN_API_KEY = process.env.SECRET_ETHERSCAN_KEY;
const web3 = new Web3('wss://mainnet.infura.io/ws/v3/'  +  INFURA_KEY);
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const etherescan_url = `http://api.etherscan.io/api?module=contract&action=getabi&address=${CONTRACT_ADDRESS}&apikey=${ETHERSCAN_API_KEY}`

const tweetCurveAlert = async (trade: any) => {
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

const checkThreshold = (trade: any) => {
    let values = trade.returnValues;
    console.log(values);
    if (parseInt(values.bought_id) === 3 || parseInt(values.sold_id) === 3){
        let tokens_bought = toMoneyFormat(values.tokens_bought);
        let tokens_sold = toMoneyFormat(values.tokens_sold);

        console.log(trade, tokens_bought, tokens_sold);
    }

}

async function getContractAbi() {
    const etherescan_response = await client.getPromise(etherescan_url)
    const CONTRACT_ABI = JSON.parse(etherescan_response.data.result);
    return CONTRACT_ABI;
}

export async function eventQuery(threshold: number){
const CONTRACT_ABI = await getContractAbi();
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
contract.events.allEvents()
.on('data', (event:any) => {
    if (event.event === 'TokenExchange'){
        //console.log(event);
        checkThreshold(event);
    }
})
.on('error', console.error);

console.log('### Listening Curve-sUSDv2 Cross Assets Swaps');
console.info(etherescan_url)
}
