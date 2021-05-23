import snxData from 'synthetix-data';
import { ethers } from 'ethers';
import { ChartPeriod, TreeMapData } from '../types/data';
import { COLORS } from '../constants/styles';
import QUERY_KEYS from '../constants/queryKeys';

import { renBTC } from '../contracts';
import { synthetix, Network } from '@synthetixio/contracts-interface';
//import { useSnxPriceChartQuery } from '../queries/network/useSnxPriceChartQuery';
import { formatEther } from 'ethers/lib/utils';
import { useSnxjsContractQuery } from '../queries/shared/useSnxjsContractQuery';
import { useTokenBalanceQuery } from '../queries/shared/useTokenBalanceQuery';
import { useCMCQuery } from '../queries/shared/useCMCQuery';
import { useQuery } from '../utils';
import { useSNXInfo } from '../queries/shared/useSNXInfo';
import { useSUSDInfo } from '../queries/shared/useSUSDInfo';

const NetworkSection = () => {

	//const SNXChartPriceData: any = useSnxPriceChartQuery(priceChartPeriod);

    const provider = new ethers.providers.InfuraProvider(
        'homestead',
        process.env.SECRET_INFURA_KEY
    );
    const snxjs = synthetix({ network: Network.Mainnet , provider });

	const {
		SNXPrice,
		SNXTotalSupply,
		SNXPercentLocked,
		issuanceRatio,
		activeCRatio,
		totalIssuedSynths,

		SNXPriceQuery,
		SNXTotalSupplyQuery,
		issuanceRatioQuery,
		totalIssuedSynthsQuery,
		SNXHoldersQuery,
	} = useSNXInfo(snxjs);

	const { sUSDPrice, sUSDPriceQuery } = useSUSDInfo(provider);

	const unformattedSUSDTotalSupply: any = useSnxjsContractQuery<ethers.BigNumber>(
		snxjs,
		'SynthsUSD',
		'totalSupply',
		[]
	);

	const ethSusdCollateralBalance: any = useTokenBalanceQuery(
		provider,
		ethers.constants.AddressZero,
		snxjs.contracts.EtherCollateralsUSD.address
	);
	const ethCollateralBalance: any = useTokenBalanceQuery(
		provider,
		ethers.constants.AddressZero,
		snxjs.contracts.EtherCollateral.address
	);
	const multiCollateralEtherBalance: any = useTokenBalanceQuery(
		provider,
		ethers.constants.AddressZero,
		snxjs.contracts.CollateralEth.address
	);
	const bitcoinLocked: any = useTokenBalanceQuery(
		provider,
		renBTC.address,
		snxjs.contracts.CollateralErc20.address,
		{ decimals: 8 }
	);
	const sUSDShortLocked: any = useTokenBalanceQuery(
		provider,
		snxjs.contracts.SynthsUSD.address,
		snxjs.contracts.CollateralShort.address
	);

	const cmcSNXData: any = useCMCQuery('SNX');

	const snxTotals: any = useQuery<any, string>(QUERY_KEYS.SnxTotals, async () => {
		return snxData.snx.total();
	});

	const etherLocked =
		ethCollateralBalance.isSuccess &&
		ethSusdCollateralBalance.isSuccess &&
		multiCollateralEtherBalance.isSuccess
			? Number(ethCollateralBalance.data!) +
			  Number(ethSusdCollateralBalance.data!) +
			  Number(multiCollateralEtherBalance.data!)
			: null;

	const SNXHolders = snxTotals.data?.snxHolders;

	const SNX24HVolume = cmcSNXData?.data?.quote?.USD?.volume_24h || null;

	const totalSupplySUSD: any = unformattedSUSDTotalSupply.isSuccess
		? Number(formatEther(unformattedSUSDTotalSupply.data!))
		: null;

	const networkCRatio =
		SNXTotalSupply && SNXPrice && totalIssuedSynths
			? (SNXTotalSupply * SNXPrice) / totalIssuedSynths
			: null;

	//const priorSNXPrice = SNXChartPriceData.isSuccess ? SNXChartPriceData.data![0].value : null;
    let statResult = {
		SNXPercentLocked: SNXPercentLocked,
		issuanceRatio: issuanceRatio,
		activeCRatio: activeCRatio,
		totalIssuedSynths: totalIssuedSynths,
        cmcSNXData: cmcSNXData,
        snxTotals: snxTotals,
        etherLocked: etherLocked,
        SNXHolders: SNXHolders,
        SNX24HVolume: SNX24HVolume,
        totalSupplySUSD: totalSupplySUSD,
        networkCRatio: networkCRatio
    }

    return statResult;
}

export default NetworkSection;