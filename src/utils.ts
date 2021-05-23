import numbro from 'numbro';
import { format } from 'date-fns';

import { NumberStyle } from './constants/styles';
import { TimeSeries } from './types/data';
import { BigNumberish } from 'ethers';

const DEFAULT_CURRENCY_DECIMALS = 2;
const BigNumber = require('bignumber.js');
const axios = require('axios');
const { SynthetixJs } = require('synthetix-js');
const snxjs = new SynthetixJs();

export const toMoneyFormat = (amount: number) => {
    const money = new BigNumber(amount).toFixed(4);
    let money_formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(money);
    return money_formatted;
}

export const getSNXPrice = async () => {
    let _price = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=havven&vs_currencies=usd');
    const snx_price: number = _price.data.havven.usd;
    return Promise.resolve(snx_price);
}

export const totalSupply = async (asset: string) => {
    const totalSupply = await eval(`snxjs.${asset}.totalSupply()`);
    const totalMoney = new BigNumber(snxjs.utils.formatEther(totalSupply)).toNumber();
    return Promise.resolve(totalMoney);
}


export async function useQuery<T, String>(args: any , request: any){
    return await request;
}


export const toBigNumber = (value: number | string): BigNumberish => new BigNumber(value);

export const formatCurrency = (
	value: string | number,
	decimals: number = DEFAULT_CURRENCY_DECIMALS
): string => {
	if (value !== 0 && !value) {
		return '$-.--';
	}

	// always use dollars for now
	return (
		'$' +
		numbro(value).format({
			thousandSeparated: true,
			mantissa: Number.isInteger(value) ? 0 : decimals,
		})
	);
};

export const formatPercentage = (
	value: string | number,
	decimals: number = DEFAULT_CURRENCY_DECIMALS
): string => {
	return numbro(value).format({
		output: 'percent',
		mantissa: decimals,
	});
};

export const formatNumber = (num: number, mantissa: number = 0) =>
	numbro(num).format({ thousandSeparated: true, mantissa });

export const getFormattedNumber = (num: number | null, numFormat: NumberStyle) => {
	if (num == null) {
		return null;
	}
	let formattedNum;
	if (numFormat === 'currency0') {
		formattedNum = formatCurrency(num, 0);
	} else if (numFormat === 'currency2') {
		formattedNum = formatCurrency(num, 2);
	} else if (numFormat === 'number') {
		formattedNum = formatNumber(num);
	} else if (numFormat === 'number4') {
		formattedNum = formatNumber(num, 4);
	} else if (numFormat === 'percent2') {
		formattedNum = formatPercentage(num);
	} else if (numFormat === 'percent0') {
		formattedNum = formatPercentage(num, 0);
	}
	return formattedNum;
};

export const formatIdToIsoString = (id: string, timeSeries: TimeSeries) => {
	let multiple = 0;
	if (timeSeries === '1d') {
		multiple = 86400;
	} else if (timeSeries === '15m') {
		multiple = 900;
	}
	const created = new Date(Number(id) * multiple * 1000);
	return created.toISOString();
};

export type TimeSeriesType = '15m' | '1d';

export const formatTime = (created: string | number, type: TimeSeriesType) => {
	if (type === '15m') {
		return format(new Date(created), 'HH:00');
	} else if (type === '1d') {
		return format(new Date(created), 'MM/dd');
	}
	throw new Error('unrecognized time to format');
};

export const formatDate = (created: string) => format(new Date(created), 'PPpp');
