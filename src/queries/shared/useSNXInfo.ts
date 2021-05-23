import { SynthetixJS } from '@synthetixio/contracts-interface';
import { ethers } from 'ethers';
import { useSnxjsContractQuery } from './useSnxjsContractQuery';
import { usePageResults } from './usePageResults';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import { synthetixSnx } from '../../constants/graph-urls';
import { BigNumber, formatFixed } from '@ethersproject/bignumber';

export const useSNXInfo = (snxjs: SynthetixJS) => {
	const snxPriceQuery: any = useSnxjsContractQuery<BigNumber>(
		snxjs,
		'ExchangeRates',
		'rateForCurrency',
		[snxjs.toBytes32('SNX')]
	);
	const snxTotalSupplyQuery: any = useSnxjsContractQuery<BigNumber>(
		snxjs,
		'Synthetix',
		'totalSupply',
		[]
	);
	const lastDebtLedgerEntryQuery: any = useSnxjsContractQuery<BigNumber>(
		snxjs,
		'SynthetixState',
		'lastDebtLedgerEntry',
		[]
	);
	const totalIssuedSynthsQuery: any = useSnxjsContractQuery<BigNumber>(
		snxjs,
		'Synthetix',
		'totalIssuedSynthsExcludeEtherCollateral',
		[snxjs.toBytes32('sUSD')]
	);
	const issuanceRatioQuery: any = useSnxjsContractQuery<BigNumber>(
		snxjs,
		'SystemSettings',
		'issuanceRatio',
		[]
	);

	const holdersQuery: any = usePageResults<any[]>({
		api: synthetixSnx,
		query: {
			entity: 'snxholders',
			selection: {
				orderBy: 'collateral',
				orderDirection: 'desc',
				where: {
					block_gt: 5873222,
				},
			},
			properties: ['collateral', 'debtEntryAtIndex', 'initialDebtOwnership'],
		},
		max: 1000,
	});

	const lastDebtLedgerEntry = lastDebtLedgerEntryQuery.isSuccess
		? Number(formatUnits(lastDebtLedgerEntryQuery.data!, 27))
		: null;

	const SNXTotalSupply = snxTotalSupplyQuery.isSuccess
		? Number(formatFixed(snxTotalSupplyQuery.data!))
		: null;

	const totalIssuedSynths = totalIssuedSynthsQuery.isSuccess
		? Number(formatFixed(totalIssuedSynthsQuery.data!))
		: null;
	const tempIssuanceRatio = issuanceRatioQuery.isSuccess
		? Number(formatFixed(issuanceRatioQuery.data!))
		: null;
	const usdToSnxPrice = snxPriceQuery.isSuccess ? Number(formatFixed(snxPriceQuery.data!)) : null;

	let snxTotal = 0;
	let snxLocked = 0;
	let stakersTotalDebt = 0;
	let stakersTotalCollateral = 0;

	if (
		totalIssuedSynths &&
		usdToSnxPrice &&
		tempIssuanceRatio &&
		lastDebtLedgerEntry &&
		holdersQuery.isSuccess
	) {
		for (const { collateral, debtEntryAtIndex, initialDebtOwnership } of holdersQuery.data!) {
			//console.log(collateral, debtEntryAtIndex, initialDebtOwnership)
			if (!collateral || !debtEntryAtIndex || !initialDebtOwnership) continue;

			const collateralFmt = Number(formatFixed(BigNumber.from(collateral)));
			const debtEntryAtIndexFmt = Number(
				formatFixed(BigNumber.from(debtEntryAtIndex))
			);
			const initialDebtOwnershipFmt = Number(
				formatFixed(BigNumber.from(initialDebtOwnership))
			);

			let debtBalance =
				((totalIssuedSynths * lastDebtLedgerEntry) / debtEntryAtIndexFmt) * initialDebtOwnershipFmt;
			let collateralRatio = debtBalance / collateralFmt / usdToSnxPrice;

			if (isNaN(debtBalance)) {
				debtBalance = 0;
				collateralRatio = 0;
			}
			const lockedSnx = collateralFmt * Math.min(1, collateralRatio / tempIssuanceRatio);

			if (Number(debtBalance) > 0) {
				stakersTotalDebt += Number(debtBalance);
				stakersTotalCollateral += Number(collateralFmt * usdToSnxPrice);
			}
			snxTotal += Number(collateralFmt);
			snxLocked += Number(lockedSnx);
		}
	}

	const SNXPrice = snxPriceQuery.isSuccess ? Number(formatFixed(snxPriceQuery.data!)) : null;

	return {
		SNXPrice,
		SNXTotalSupply,
		SNXStaked:
			SNXPrice && totalIssuedSynths && tempIssuanceRatio
				? totalIssuedSynths / tempIssuanceRatio / SNXPrice
				: null,
		SNXPercentLocked: snxTotal ? snxLocked / snxTotal : null,
		issuanceRatio: tempIssuanceRatio,
		activeCRatio: stakersTotalDebt ? stakersTotalCollateral / stakersTotalDebt : null,
		totalIssuedSynths,

		SNXPriceQuery: snxPriceQuery,
		SNXTotalSupplyQuery: snxTotalSupplyQuery,
		SNXHoldersQuery: holdersQuery,
		totalIssuedSynthsQuery,
		issuanceRatioQuery,
	};
};
