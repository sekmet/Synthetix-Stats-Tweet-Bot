import { ethers } from 'ethers';
import { synthetix, Network } from '@synthetixio/contracts-interface';
import network from './network';
import db from './db';
//import Twit, { Response } from 'twit';
//import { toMoneyFormat, getSNXPrice, totalSupply } from './utils';

//const Twitter = new Twit(require('./config'));

async () => await network;

//import { useCMCQuery } from './queries/shared/useCMCQuery';
//import { useSNXInfo } from './queries/shared/useSNXInfo';useSUSDInfo
//import { useSUSDInfo } from './queries/shared/useSUSDInfo';
//import { useTokenBalanceQuery } from './queries/shared/useTokenBalanceQuery';

/*
const provider = new ethers.providers.InfuraProvider(
	'homestead',
	process.env.SECRET_INFURA_KEY
);
const snxjs = synthetix({ network: Network.Mainnet });*/

//const snxinfo = useTokenBalanceQuery(provider);
//snxinfo.useTokenBalanceQuery.then((res:any) => res().then((res:any) => console.log(res)));

//const snxinfo = useSUSDInfo(provider);
//snxinfo.sUSDPriceQuery.then((res:any) => res().then((res:any) => console.log(res)));

//useCMCQuery('BTC').then((resp) => resp().then((res:any) => console.log(res)))

/*const snxinfo = useSNXInfo(snxjs);
console.log(snxinfo)
snxinfo.SNXPriceQuery.then((res:any) => res().then((res:any) => console.log(res)));
snxinfo.SNXTotalSupplyQuery.then((res:any) => res().then((res:any) => console.log(res)));
snxinfo.SNXHoldersQuery.then((res:any) => res().then((res:any) => console.log(res)));
snxinfo.totalIssuedSynthsQuery.then((res:any) => res().then((res:any) => console.log(res)));
snxinfo.issuanceRatioQuery.then((res:any) => res().then((res:any) => console.log(res)));*/



/*const { SynthetixJs } = require('synthetix-js');
const snxjs = new SynthetixJs(); //uses default ContractSettings - ethers.js default provider, mainnet
(async function () {
  const totalSUSD = await snxjs.sUSD.totalSupply();
  const totalSBTC = await snxjs.sBTC.totalSupply();
  const totalSETH = await snxjs.sETH.totalSupply();
  const totalSDOT = await snxjs.sDOT.totalSupply();
  const totalSUSDSupply = snxjs.utils.formatEther(totalSUSD);
  const totalSBTCSupply = snxjs.utils.formatEther(totalSBTC);
  const money = new BigNumber(totalSBTCSupply).toNumber();
  let money_formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(money);
  console.log('sUSDTotalSupply', money_formatted);
  return true;
})();*/

/*const snxData = require('synthetix-data'); // common js
const curveCrossSwaps = require('./curve/contract');

const usd_threshold = 1000000;
const susd_curve_threshold = 100000;

console.log(useCMCQuery)

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

const checkThreshold = (trade: any) => {
    
    if (trade.toAmountInUSD > usd_threshold){
        console.log(trade);
        tweetAlert(trade);
    }

}


// query and log resolved results
/*snxData.exchanges
  .since({
    minTimestamp: Math.floor(Date.now() / 1e3) - 3600 * 24, // one day ago
  })
  .then((exchanges: any) => console.log(exchanges));*/

// subscribe and log streaming results
/*
snxData.exchanges.observe().subscribe({
  next(val:any) {
    checkThreshold(val);
  },
  error: console.error,
  complete() {
    console.log('done');
  },
});

curveCrossSwaps.eventQuery(susd_curve_threshold);
console.log('### Listening Synthetix Trades', new Date());*/