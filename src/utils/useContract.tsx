import { useEffect, useState } from 'react';
import { TonClient } from '@ton/ton';
import { Address, Contract, OpenedContract } from '@ton/core';
import { getHttpEndpoint } from '@orbs-network/ton-access';

export const useContract = <T extends Contract>(
  contract_address: string,
  ContractClass: new (address: Address) => T
) => {
  const [openContract, setOpenContract] = useState<OpenedContract<T>>();

  useEffect(() => {
    (async () => {
      const endpoint = await getHttpEndpoint();
      const contractAddress = Address.parse(contract_address);
      const closedContract = new ContractClass(contractAddress);
      const client = new TonClient({ endpoint });
      const contract = client.open(closedContract);
      setOpenContract(contract);
    })();
  }, [ContractClass, contract_address]);

  return openContract;
};
