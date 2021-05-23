import { useQuery } from '../../utils';

import QUERY_KEYS from '../../constants/queryKeys';

import snxData from 'synthetix-data';
import { TradesRequestData } from '../../types/data';

export const useTradesOverPeriodQuery = (args: any) => {
	return useQuery<TradesRequestData[], string>(
		QUERY_KEYS.Trading.TradesOverPeriod(args),
		async () => {
			return (await snxData.exchanges.aggregate(args)).reverse();
		}
	);
};
