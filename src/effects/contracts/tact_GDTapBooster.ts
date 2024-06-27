import {
  Cell,
  Slice,
  Address,
  Builder,
  beginCell,
  ComputeError,
  TupleItem,
  TupleReader,
  Dictionary,
  contractAddress,
  ContractProvider,
  Sender,
  Contract,
  ContractABI,
  ABIType,
  ABIGetter,
  ABIReceiver,
  TupleBuilder,
  DictionaryValue
} from '@ton/core';

export type StateInit = {
  $$type: 'StateInit';
  code: Cell;
  data: Cell;
};

export function storeStateInit(src: StateInit) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeRef(src.code);
    b_0.storeRef(src.data);
  };
}

export function loadStateInit(slice: Slice) {
  let sc_0 = slice;
  let _code = sc_0.loadRef();
  let _data = sc_0.loadRef();
  return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
  let _code = source.readCell();
  let _data = source.readCell();
  return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
  let builder = new TupleBuilder();
  builder.writeCell(source.code);
  builder.writeCell(source.data);
  return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
    },
    parse: (src) => {
      return loadStateInit(src.loadRef().beginParse());
    }
  };
}

export type Context = {
  $$type: 'Context';
  bounced: boolean;
  sender: Address;
  value: bigint;
  raw: Cell;
};

export function storeContext(src: Context) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeBit(src.bounced);
    b_0.storeAddress(src.sender);
    b_0.storeInt(src.value, 257);
    b_0.storeRef(src.raw);
  };
}

export function loadContext(slice: Slice) {
  let sc_0 = slice;
  let _bounced = sc_0.loadBit();
  let _sender = sc_0.loadAddress();
  let _value = sc_0.loadIntBig(257);
  let _raw = sc_0.loadRef();
  return {
    $$type: 'Context' as const,
    bounced: _bounced,
    sender: _sender,
    value: _value,
    raw: _raw
  };
}

function loadTupleContext(source: TupleReader) {
  let _bounced = source.readBoolean();
  let _sender = source.readAddress();
  let _value = source.readBigNumber();
  let _raw = source.readCell();
  return {
    $$type: 'Context' as const,
    bounced: _bounced,
    sender: _sender,
    value: _value,
    raw: _raw
  };
}

function storeTupleContext(source: Context) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.bounced);
  builder.writeAddress(source.sender);
  builder.writeNumber(source.value);
  builder.writeSlice(source.raw);
  return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeContext(src)).endCell());
    },
    parse: (src) => {
      return loadContext(src.loadRef().beginParse());
    }
  };
}

export type SendParameters = {
  $$type: 'SendParameters';
  bounce: boolean;
  to: Address;
  value: bigint;
  mode: bigint;
  body: Cell | null;
  code: Cell | null;
  data: Cell | null;
};

export function storeSendParameters(src: SendParameters) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeBit(src.bounce);
    b_0.storeAddress(src.to);
    b_0.storeInt(src.value, 257);
    b_0.storeInt(src.mode, 257);
    if (src.body !== null && src.body !== undefined) {
      b_0.storeBit(true).storeRef(src.body);
    } else {
      b_0.storeBit(false);
    }
    if (src.code !== null && src.code !== undefined) {
      b_0.storeBit(true).storeRef(src.code);
    } else {
      b_0.storeBit(false);
    }
    if (src.data !== null && src.data !== undefined) {
      b_0.storeBit(true).storeRef(src.data);
    } else {
      b_0.storeBit(false);
    }
  };
}

export function loadSendParameters(slice: Slice) {
  let sc_0 = slice;
  let _bounce = sc_0.loadBit();
  let _to = sc_0.loadAddress();
  let _value = sc_0.loadIntBig(257);
  let _mode = sc_0.loadIntBig(257);
  let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
  let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
  let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
  return {
    $$type: 'SendParameters' as const,
    bounce: _bounce,
    to: _to,
    value: _value,
    mode: _mode,
    body: _body,
    code: _code,
    data: _data
  };
}

function loadTupleSendParameters(source: TupleReader) {
  let _bounce = source.readBoolean();
  let _to = source.readAddress();
  let _value = source.readBigNumber();
  let _mode = source.readBigNumber();
  let _body = source.readCellOpt();
  let _code = source.readCellOpt();
  let _data = source.readCellOpt();
  return {
    $$type: 'SendParameters' as const,
    bounce: _bounce,
    to: _to,
    value: _value,
    mode: _mode,
    body: _body,
    code: _code,
    data: _data
  };
}

function storeTupleSendParameters(source: SendParameters) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.bounce);
  builder.writeAddress(source.to);
  builder.writeNumber(source.value);
  builder.writeNumber(source.mode);
  builder.writeCell(source.body);
  builder.writeCell(source.code);
  builder.writeCell(source.data);
  return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
    },
    parse: (src) => {
      return loadSendParameters(src.loadRef().beginParse());
    }
  };
}

export type Deploy = {
  $$type: 'Deploy';
  queryId: bigint;
};

export function storeDeploy(src: Deploy) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2490013878, 32);
    b_0.storeUint(src.queryId, 64);
  };
}

export function loadDeploy(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2490013878) {
    throw Error('Invalid prefix');
  }
  let _queryId = sc_0.loadUintBig(64);
  return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
  let _queryId = source.readBigNumber();
  return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeDeploy(src)).endCell());
    },
    parse: (src) => {
      return loadDeploy(src.loadRef().beginParse());
    }
  };
}

export type DeployOk = {
  $$type: 'DeployOk';
  queryId: bigint;
};

export function storeDeployOk(src: DeployOk) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2952335191, 32);
    b_0.storeUint(src.queryId, 64);
  };
}

export function loadDeployOk(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2952335191) {
    throw Error('Invalid prefix');
  }
  let _queryId = sc_0.loadUintBig(64);
  return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
  let _queryId = source.readBigNumber();
  return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeDeployOk(src)).endCell());
    },
    parse: (src) => {
      return loadDeployOk(src.loadRef().beginParse());
    }
  };
}

export type FactoryDeploy = {
  $$type: 'FactoryDeploy';
  queryId: bigint;
  cashback: Address;
};

export function storeFactoryDeploy(src: FactoryDeploy) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1829761339, 32);
    b_0.storeUint(src.queryId, 64);
    b_0.storeAddress(src.cashback);
  };
}

export function loadFactoryDeploy(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1829761339) {
    throw Error('Invalid prefix');
  }
  let _queryId = sc_0.loadUintBig(64);
  let _cashback = sc_0.loadAddress();
  return {
    $$type: 'FactoryDeploy' as const,
    queryId: _queryId,
    cashback: _cashback
  };
}

function loadTupleFactoryDeploy(source: TupleReader) {
  let _queryId = source.readBigNumber();
  let _cashback = source.readAddress();
  return {
    $$type: 'FactoryDeploy' as const,
    queryId: _queryId,
    cashback: _cashback
  };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  builder.writeAddress(source.cashback);
  return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
    },
    parse: (src) => {
      return loadFactoryDeploy(src.loadRef().beginParse());
    }
  };
}

export type Boost = {
  $$type: 'Boost';
  queryId: bigint;
  tierId: bigint;
};

export function storeBoost(src: Boost) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3711086086, 32);
    b_0.storeUint(src.queryId, 64);
    b_0.storeUint(src.tierId, 16);
  };
}

export function loadBoost(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3711086086) {
    throw Error('Invalid prefix');
  }
  let _queryId = sc_0.loadUintBig(64);
  let _tierId = sc_0.loadUintBig(16);
  return { $$type: 'Boost' as const, queryId: _queryId, tierId: _tierId };
}

function loadTupleBoost(source: TupleReader) {
  let _queryId = source.readBigNumber();
  let _tierId = source.readBigNumber();
  return { $$type: 'Boost' as const, queryId: _queryId, tierId: _tierId };
}

function storeTupleBoost(source: Boost) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  builder.writeNumber(source.tierId);
  return builder.build();
}

function dictValueParserBoost(): DictionaryValue<Boost> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeBoost(src)).endCell());
    },
    parse: (src) => {
      return loadBoost(src.loadRef().beginParse());
    }
  };
}

export type SetTierPrice = {
  $$type: 'SetTierPrice';
  queryId: bigint;
  tierId: bigint;
  price: bigint;
};

export function storeSetTierPrice(src: SetTierPrice) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(742784761, 32);
    b_0.storeUint(src.queryId, 64);
    b_0.storeUint(src.tierId, 16);
    b_0.storeUint(src.price, 64);
  };
}

export function loadSetTierPrice(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 742784761) {
    throw Error('Invalid prefix');
  }
  let _queryId = sc_0.loadUintBig(64);
  let _tierId = sc_0.loadUintBig(16);
  let _price = sc_0.loadUintBig(64);
  return {
    $$type: 'SetTierPrice' as const,
    queryId: _queryId,
    tierId: _tierId,
    price: _price
  };
}

function loadTupleSetTierPrice(source: TupleReader) {
  let _queryId = source.readBigNumber();
  let _tierId = source.readBigNumber();
  let _price = source.readBigNumber();
  return {
    $$type: 'SetTierPrice' as const,
    queryId: _queryId,
    tierId: _tierId,
    price: _price
  };
}

function storeTupleSetTierPrice(source: SetTierPrice) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  builder.writeNumber(source.tierId);
  builder.writeNumber(source.price);
  return builder.build();
}

function dictValueParserSetTierPrice(): DictionaryValue<SetTierPrice> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeSetTierPrice(src)).endCell());
    },
    parse: (src) => {
      return loadSetTierPrice(src.loadRef().beginParse());
    }
  };
}

export type SetBeneficiary = {
  $$type: 'SetBeneficiary';
  queryId: bigint;
  beneficiary: Address;
};

export function storeSetBeneficiary(src: SetBeneficiary) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2404612536, 32);
    b_0.storeUint(src.queryId, 64);
    b_0.storeAddress(src.beneficiary);
  };
}

export function loadSetBeneficiary(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2404612536) {
    throw Error('Invalid prefix');
  }
  let _queryId = sc_0.loadUintBig(64);
  let _beneficiary = sc_0.loadAddress();
  return {
    $$type: 'SetBeneficiary' as const,
    queryId: _queryId,
    beneficiary: _beneficiary
  };
}

function loadTupleSetBeneficiary(source: TupleReader) {
  let _queryId = source.readBigNumber();
  let _beneficiary = source.readAddress();
  return {
    $$type: 'SetBeneficiary' as const,
    queryId: _queryId,
    beneficiary: _beneficiary
  };
}

function storeTupleSetBeneficiary(source: SetBeneficiary) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  builder.writeAddress(source.beneficiary);
  return builder.build();
}

function dictValueParserSetBeneficiary(): DictionaryValue<SetBeneficiary> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeSetBeneficiary(src)).endCell());
    },
    parse: (src) => {
      return loadSetBeneficiary(src.loadRef().beginParse());
    }
  };
}

export type Boosted = {
  $$type: 'Boosted';
  queryId: bigint;
  tierId: bigint;
  purchaseId: bigint;
  player: Address;
};

export function storeBoosted(src: Boosted) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3868694109, 32);
    b_0.storeUint(src.queryId, 64);
    b_0.storeUint(src.tierId, 16);
    b_0.storeUint(src.purchaseId, 64);
    b_0.storeAddress(src.player);
  };
}

export function loadBoosted(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3868694109) {
    throw Error('Invalid prefix');
  }
  let _queryId = sc_0.loadUintBig(64);
  let _tierId = sc_0.loadUintBig(16);
  let _purchaseId = sc_0.loadUintBig(64);
  let _player = sc_0.loadAddress();
  return {
    $$type: 'Boosted' as const,
    queryId: _queryId,
    tierId: _tierId,
    purchaseId: _purchaseId,
    player: _player
  };
}

function loadTupleBoosted(source: TupleReader) {
  let _queryId = source.readBigNumber();
  let _tierId = source.readBigNumber();
  let _purchaseId = source.readBigNumber();
  let _player = source.readAddress();
  return {
    $$type: 'Boosted' as const,
    queryId: _queryId,
    tierId: _tierId,
    purchaseId: _purchaseId,
    player: _player
  };
}

function storeTupleBoosted(source: Boosted) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  builder.writeNumber(source.tierId);
  builder.writeNumber(source.purchaseId);
  builder.writeAddress(source.player);
  return builder.build();
}

function dictValueParserBoosted(): DictionaryValue<Boosted> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeBoosted(src)).endCell());
    },
    parse: (src) => {
      return loadBoosted(src.loadRef().beginParse());
    }
  };
}

export type Purchase = {
  $$type: 'Purchase';
  tierId: bigint;
  player: Address;
  timestamp: bigint;
};

export function storePurchase(src: Purchase) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(src.tierId, 16);
    b_0.storeAddress(src.player);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadPurchase(slice: Slice) {
  let sc_0 = slice;
  let _tierId = sc_0.loadUintBig(16);
  let _player = sc_0.loadAddress();
  let _timestamp = sc_0.loadUintBig(32);
  return {
    $$type: 'Purchase' as const,
    tierId: _tierId,
    player: _player,
    timestamp: _timestamp
  };
}

function loadTuplePurchase(source: TupleReader) {
  let _tierId = source.readBigNumber();
  let _player = source.readAddress();
  let _timestamp = source.readBigNumber();
  return {
    $$type: 'Purchase' as const,
    tierId: _tierId,
    player: _player,
    timestamp: _timestamp
  };
}

function storeTuplePurchase(source: Purchase) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.tierId);
  builder.writeAddress(source.player);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

function dictValueParserPurchase(): DictionaryValue<Purchase> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storePurchase(src)).endCell());
    },
    parse: (src) => {
      return loadPurchase(src.loadRef().beginParse());
    }
  };
}

type GDTapBooster_init_args = {
  $$type: 'GDTapBooster_init_args';
  owner: Address;
  beneficiary: Address;
};

function initGDTapBooster_init_args(src: GDTapBooster_init_args) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeAddress(src.owner);
    b_0.storeAddress(src.beneficiary);
  };
}

async function GDTapBooster_init(owner: Address, beneficiary: Address) {
  const __code = Cell.fromBase64(
    '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'
  );
  const __system = Cell.fromBase64(
    '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'
  );
  let builder = beginCell();
  builder.storeRef(__system);
  builder.storeUint(0, 1);
  initGDTapBooster_init_args({
    $$type: 'GDTapBooster_init_args',
    owner,
    beneficiary
  })(builder);
  const __data = builder.endCell();
  return { code: __code, data: __data };
}

const GDTapBooster_errors: { [key: number]: { message: string } } = {
  2: { message: `Stack undeflow` },
  3: { message: `Stack overflow` },
  4: { message: `Integer overflow` },
  5: { message: `Integer out of expected range` },
  6: { message: `Invalid opcode` },
  7: { message: `Type check error` },
  8: { message: `Cell overflow` },
  9: { message: `Cell underflow` },
  10: { message: `Dictionary error` },
  13: { message: `Out of gas error` },
  32: { message: `Method ID not found` },
  34: { message: `Action is invalid or not supported` },
  37: { message: `Not enough TON` },
  38: { message: `Not enough extra-currencies` },
  128: { message: `Null reference exception` },
  129: { message: `Invalid serialization prefix` },
  130: { message: `Invalid incoming message` },
  131: { message: `Constraints error` },
  132: { message: `Access denied` },
  133: { message: `Contract stopped` },
  134: { message: `Invalid argument` },
  135: { message: `Code of a contract was not found` },
  136: { message: `Invalid address` },
  137: { message: `Masterchain support is not enabled for this contract` },
  5505: { message: `Hecker protection` },
  11304: { message: `Unauthorized: Only owner can set beneficiary` },
  14909: { message: `Not enough monies` }
};

const GDTapBooster_types: ABIType[] = [
  {
    name: 'StateInit',
    header: null,
    fields: [
      { name: 'code', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'data', type: { kind: 'simple', type: 'cell', optional: false } }
    ]
  },
  {
    name: 'Context',
    header: null,
    fields: [
      {
        name: 'bounced',
        type: { kind: 'simple', type: 'bool', optional: false }
      },
      {
        name: 'sender',
        type: { kind: 'simple', type: 'address', optional: false }
      },
      {
        name: 'value',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      },
      { name: 'raw', type: { kind: 'simple', type: 'slice', optional: false } }
    ]
  },
  {
    name: 'SendParameters',
    header: null,
    fields: [
      {
        name: 'bounce',
        type: { kind: 'simple', type: 'bool', optional: false }
      },
      {
        name: 'to',
        type: { kind: 'simple', type: 'address', optional: false }
      },
      {
        name: 'value',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      },
      {
        name: 'mode',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      },
      { name: 'body', type: { kind: 'simple', type: 'cell', optional: true } },
      { name: 'code', type: { kind: 'simple', type: 'cell', optional: true } },
      { name: 'data', type: { kind: 'simple', type: 'cell', optional: true } }
    ]
  },
  {
    name: 'Deploy',
    header: 2490013878,
    fields: [
      {
        name: 'queryId',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      }
    ]
  },
  {
    name: 'DeployOk',
    header: 2952335191,
    fields: [
      {
        name: 'queryId',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      }
    ]
  },
  {
    name: 'FactoryDeploy',
    header: 1829761339,
    fields: [
      {
        name: 'queryId',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'cashback',
        type: { kind: 'simple', type: 'address', optional: false }
      }
    ]
  },
  {
    name: 'Boost',
    header: 3711086086,
    fields: [
      {
        name: 'queryId',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'tierId',
        type: { kind: 'simple', type: 'uint', optional: false, format: 16 }
      }
    ]
  },
  {
    name: 'SetTierPrice',
    header: 742784761,
    fields: [
      {
        name: 'queryId',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'tierId',
        type: { kind: 'simple', type: 'uint', optional: false, format: 16 }
      },
      {
        name: 'price',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      }
    ]
  },
  {
    name: 'SetBeneficiary',
    header: 2404612536,
    fields: [
      {
        name: 'queryId',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'beneficiary',
        type: { kind: 'simple', type: 'address', optional: false }
      }
    ]
  },
  {
    name: 'Boosted',
    header: 3868694109,
    fields: [
      {
        name: 'queryId',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'tierId',
        type: { kind: 'simple', type: 'uint', optional: false, format: 16 }
      },
      {
        name: 'purchaseId',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'player',
        type: { kind: 'simple', type: 'address', optional: false }
      }
    ]
  },
  {
    name: 'Purchase',
    header: null,
    fields: [
      {
        name: 'tierId',
        type: { kind: 'simple', type: 'uint', optional: false, format: 16 }
      },
      {
        name: 'player',
        type: { kind: 'simple', type: 'address', optional: false }
      },
      {
        name: 'timestamp',
        type: { kind: 'simple', type: 'uint', optional: false, format: 32 }
      }
    ]
  }
];

const GDTapBooster_getters: ABIGetter[] = [
  {
    name: 'tier_price',
    arguments: [
      {
        name: 'tierId',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      }
    ],
    returnType: { kind: 'simple', type: 'int', optional: false, format: 257 }
  },
  {
    name: 'purchase',
    arguments: [
      {
        name: 'purchaseId',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      }
    ],
    returnType: { kind: 'simple', type: 'Purchase', optional: true }
  },
  {
    name: 'next_purchase_id',
    arguments: [],
    returnType: { kind: 'simple', type: 'int', optional: false, format: 257 }
  },
  {
    name: 'beneficiary',
    arguments: [],
    returnType: { kind: 'simple', type: 'address', optional: false }
  },
  {
    name: 'latestPurchase',
    arguments: [
      {
        name: 'player',
        type: { kind: 'simple', type: 'address', optional: false }
      }
    ],
    returnType: { kind: 'simple', type: 'int', optional: false, format: 257 }
  }
];

const GDTapBooster_receivers: ABIReceiver[] = [
  { receiver: 'internal', message: { kind: 'typed', type: 'Boost' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'SetTierPrice' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'SetBeneficiary' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'Deploy' } }
];

export class GDTapBooster implements Contract {
  static async init(owner: Address, beneficiary: Address) {
    return await GDTapBooster_init(owner, beneficiary);
  }

  static async fromInit(owner: Address, beneficiary: Address) {
    const init = await GDTapBooster_init(owner, beneficiary);
    const address = contractAddress(0, init);
    return new GDTapBooster(address, init);
  }

  static fromAddress(address: Address) {
    return new GDTapBooster(address);
  }

  readonly address: Address;
  readonly init?: { code: Cell; data: Cell };
  readonly abi: ContractABI = {
    types: GDTapBooster_types,
    getters: GDTapBooster_getters,
    receivers: GDTapBooster_receivers,
    errors: GDTapBooster_errors
  };

  private constructor(address: Address, init?: { code: Cell; data: Cell }) {
    this.address = address;
    this.init = init;
  }

  async send(
    provider: ContractProvider,
    via: Sender,
    args: { value: bigint; bounce?: boolean | null | undefined },
    message: Boost | SetTierPrice | SetBeneficiary | Deploy
  ) {
    let body: Cell | null = null;
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'Boost'
    ) {
      body = beginCell().store(storeBoost(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'SetTierPrice'
    ) {
      body = beginCell().store(storeSetTierPrice(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'SetBeneficiary'
    ) {
      body = beginCell().store(storeSetBeneficiary(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'Deploy'
    ) {
      body = beginCell().store(storeDeploy(message)).endCell();
    }
    if (body === null) {
      throw new Error('Invalid message type');
    }

    await provider.internal(via, { ...args, body: body });
  }

  async getTierPrice(provider: ContractProvider, tierId: bigint) {
    let builder = new TupleBuilder();
    builder.writeNumber(tierId);
    let source = (await provider.get('tier_price', builder.build())).stack;
    let result = source.readBigNumber();
    return result;
  }

  async getPurchase(provider: ContractProvider, purchaseId: bigint) {
    let builder = new TupleBuilder();
    builder.writeNumber(purchaseId);
    let source = (await provider.get('purchase', builder.build())).stack;
    const result_p = source.readTupleOpt();
    const result = result_p ? loadTuplePurchase(result_p) : null;
    return result;
  }

  async getNextPurchaseId(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get('next_purchase_id', builder.build()))
      .stack;
    let result = source.readBigNumber();
    return result;
  }

  async getBeneficiary(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get('beneficiary', builder.build())).stack;
    let result = source.readAddress();
    return result;
  }

  async getLatestPurchase(provider: ContractProvider, player: Address) {
    let builder = new TupleBuilder();
    builder.writeAddress(player);
    let source = (await provider.get('latestPurchase', builder.build())).stack;
    let result = source.readBigNumber();
    return result;
  }
}
