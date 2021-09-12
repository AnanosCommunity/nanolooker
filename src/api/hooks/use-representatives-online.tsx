import * as React from "react";
import uniq from "lodash/uniq";
import { rpc } from "api/rpc";
import { ANANOSLOOKER } from "../../knownAccounts.json";

export interface RepresentativesOnlineReturn {
  representatives: string[];
  isError: boolean;
}

const useRepresentativesOnline = (): RepresentativesOnlineReturn => {
  const [representatives, setRepresentatives] = React.useState<string[]>([]);
  const [isError, setIsError] = React.useState(false);

  const getBlockCount = async () => {
    const json = await rpc("representatives_online");

    !json || json.error
      ? setIsError(true)
      : setRepresentatives(uniq(json.representatives.concat([ANANOSLOOKER])));
  };

  React.useEffect(() => {
    getBlockCount();
  }, []);

  return { representatives, isError };
};

export default useRepresentativesOnline;
