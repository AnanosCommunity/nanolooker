import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, Col, Row, Skeleton, Tag, Tooltip } from "antd";
import find from "lodash/find";
import BigNumber from "bignumber.js";
import TimeAgo from "timeago-react";
import {
  Theme,
  PreferencesContext,
  CurrencySymbol,
  CurrencyDecimal,
} from "api/contexts/Preferences";
import { MarketStatisticsContext } from "api/contexts/MarketStatistics";
import { AccountInfoContext } from "api/contexts/AccountInfo";
import { RepresentativesOnlineContext } from "api/contexts/RepresentativesOnline";
import { RepresentativesContext } from "api/contexts/Representatives";
import { ConfirmationQuorumContext } from "api/contexts/ConfirmationQuorum";
import QuestionCircle from "components/QuestionCircle";
import { rawToRai, timestampToDate, TwoToneColors } from "components/utils";

interface AccountDetailsLayoutProps {
  bordered?: boolean;
  children?: ReactElement;
}

export const AccountDetailsLayout = ({
  bordered,
  children,
}: AccountDetailsLayoutProps) => (
  <Row gutter={[{ xs: 6, sm: 12, md: 12, lg: 12 }, 12]}>
    <Col xs={24} xl={12}>
      <Card size="small" bordered={bordered} className="detail-layout">
        {children}
      </Card>
    </Col>
  </Row>
);

const AccountDetails = () => {
  const { t } = useTranslation();
  const { theme, fiat } = React.useContext(PreferencesContext);
  const [representativeAccount, setRepresentativeAccount] = React.useState(
    {} as any,
  );
  const [accountsRepresentative, setAccountsRepresentative] = React.useState(
    {} as any,
  );
  const {
    marketStatistics: {
      currentPrice,
      priceStats: { bitcoin: { [fiat]: btcCurrentPrice = 0 } } = {
        bitcoin: { [fiat]: 0 },
      },
    },
    isInitialLoading: isMarketStatisticsInitialLoading,
  } = React.useContext(MarketStatisticsContext);
  const {
    account,
    accountInfo,
    isLoading: isAccountInfoLoading,
  } = React.useContext(AccountInfoContext);
  const {
    representatives,
    isLoading: isRepresentativesLoading,
  } = React.useContext(RepresentativesContext);
  const {
    confirmationQuorum: { principal_representative_min_weight: minWeight },
  } = React.useContext(ConfirmationQuorumContext);
  const { representatives: representativesOnline } = React.useContext(
    RepresentativesOnlineContext,
  );
  const balance = new BigNumber(rawToRai(accountInfo?.balance || 0)).toNumber();
  const balancePending = new BigNumber(
    rawToRai(accountInfo?.pending || 0),
  ).toFormat(8);
  const fiatBalance = new BigNumber(balance)
    .times(currentPrice)
    .toFormat(CurrencyDecimal?.[fiat]);
  const btcBalance = new BigNumber(balance)
    .times(currentPrice)
    .dividedBy(btcCurrentPrice)
    .toFormat(12);
  const modifiedTimestamp = Number(accountInfo?.modified_timestamp) * 1000;

  const skeletonProps = {
    active: true,
    paragraph: false,
    loading: isAccountInfoLoading || isMarketStatisticsInitialLoading,
  };

  React.useEffect(() => {
    if (!account || isRepresentativesLoading || !representatives.length) return;

    setRepresentativeAccount(find(representatives, ["account", account]) || {});

    if (accountInfo.representative) {
      setAccountsRepresentative(
        find(representatives, ["account", accountInfo.representative]) || {},
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    account,
    accountInfo.representative,
    isRepresentativesLoading,
    representatives.length,
  ]);

  const isRepresentativeOnline = representativesOnline.includes(
    accountInfo?.representative || "",
  );

  return (
    <AccountDetailsLayout bordered={false}>
      <>
        {representativeAccount?.account ? (
          <Row gutter={6}>
            <Col xs={24} sm={6}>
              <span style={{ marginRight: "6px" }}>
                {t("pages.account.votingWeight")}
              </span>
              <Tooltip
                placement="right"
                title={t("tooltips.votingWeight", { minWeight })}
              >
                <QuestionCircle />
              </Tooltip>
            </Col>
            <Col xs={24} sm={18}>
              {new BigNumber(representativeAccount.weight).toFormat()} NANO
            </Col>
          </Row>
        ) : null}
        <Row gutter={6}>
          <Col xs={24} sm={6}>
            {t("common.balance")}
          </Col>
          <Col xs={24} sm={18}>
            <Skeleton {...skeletonProps}>
              {new BigNumber(balance).toFormat()} NANO
              <br />
            </Skeleton>
            <Skeleton {...skeletonProps}>
              {`${CurrencySymbol?.[fiat]}${fiatBalance} / ${btcBalance} BTC`}
            </Skeleton>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col xs={24} sm={6}>
            {t("common.representative")}
          </Col>
          <Col xs={24} sm={18}>
            <Skeleton {...skeletonProps}>
              {accountInfo?.representative ? (
                <>
                  <div style={{ display: "flex", marginBottom: "3px" }}>
                    <Tag
                      color={
                        isRepresentativeOnline
                          ? theme === Theme.DARK
                            ? TwoToneColors.RECEIVE_DARK
                            : TwoToneColors.RECEIVE
                          : theme === Theme.DARK
                          ? TwoToneColors.SEND_DARK
                          : TwoToneColors.SEND
                      }
                      className={`tag-${
                        isRepresentativeOnline ? "online" : "offline"
                      }`}
                    >
                      {t(
                        `common.${
                          isRepresentativeOnline ? "online" : "offline"
                        }`,
                      )}
                    </Tag>
                    {accountsRepresentative?.weight >= minWeight ? (
                      <Tag>{t("common.principalRepresentative")}</Tag>
                    ) : null}
                  </div>
                  <Link
                    to={`/account/${accountInfo.representative}`}
                    className="break-word"
                  >
                    {accountInfo.representative}
                  </Link>
                </>
              ) : (
                t("pages.account.noRepresentative")
              )}
            </Skeleton>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col xs={24} sm={6}>
            {t("transaction.pending")}
            <Tooltip placement="right" title={t("tooltips.pending")}>
              <QuestionCircle />
            </Tooltip>
          </Col>
          <Col xs={24} sm={18}>
            <Skeleton {...skeletonProps}>{balancePending} NANO</Skeleton>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col xs={24} sm={6}>
            {t("pages.account.lastTransaction")}
          </Col>
          <Col xs={24} sm={18}>
            <Skeleton {...skeletonProps}>
              {modifiedTimestamp ? (
                <>
                  <TimeAgo datetime={modifiedTimestamp} live={false} /> (
                  {timestampToDate(modifiedTimestamp)})
                </>
              ) : null}
            </Skeleton>
          </Col>
        </Row>
        {/* <Row gutter={6}>
          <Col xs={24} sm={6}></Col>
          <Col xs={24} sm={18}></Col>
        </Row> */}
      </>
    </AccountDetailsLayout>
  );
};

export default AccountDetails;
