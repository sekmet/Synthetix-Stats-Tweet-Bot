import { getFormattedNumber } from '../utils';
import { COLORS, NumberColor, NumberStyle } from '../constants/styles';

interface StatsProps {
	title: string;
	num: number | null;
    formattedNumber: any | undefined,
	percentChange: number | null;
	subText: string;
    numberStyle: NumberStyle;
}

// TODO what if num is 0 and is supposed to be zero!!
const statsBox = (
	title: any,
	num: any,
	percentChange: any,
	subText: any,
    numberStyle: any
    ): StatsProps => {

	const formattedNumber =
		num != null && numberStyle 
			? getFormattedNumber(num, numberStyle)
			: getFormattedNumber(0, numberStyle)!.replace(/0/g, '-');
   
    return {num, title, formattedNumber, percentChange, subText, numberStyle}; 
};

export default statsBox;
