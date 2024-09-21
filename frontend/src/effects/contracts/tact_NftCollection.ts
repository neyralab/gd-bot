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

export type CollectionData = {
  $$type: 'CollectionData';
  next_item_index: bigint;
  collection_content: Cell;
  owner_address: Address;
};

export function storeCollectionData(src: CollectionData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeInt(src.next_item_index, 257);
    b_0.storeRef(src.collection_content);
    b_0.storeAddress(src.owner_address);
  };
}

export function loadCollectionData(slice: Slice) {
  let sc_0 = slice;
  let _next_item_index = sc_0.loadIntBig(257);
  let _collection_content = sc_0.loadRef();
  let _owner_address = sc_0.loadAddress();
  return {
    $$type: 'CollectionData' as const,
    next_item_index: _next_item_index,
    collection_content: _collection_content,
    owner_address: _owner_address
  };
}

function loadTupleCollectionData(source: TupleReader) {
  let _next_item_index = source.readBigNumber();
  let _collection_content = source.readCell();
  let _owner_address = source.readAddress();
  return {
    $$type: 'CollectionData' as const,
    next_item_index: _next_item_index,
    collection_content: _collection_content,
    owner_address: _owner_address
  };
}

function storeTupleCollectionData(source: CollectionData) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.next_item_index);
  builder.writeCell(source.collection_content);
  builder.writeAddress(source.owner_address);
  return builder.build();
}

function dictValueParserCollectionData(): DictionaryValue<CollectionData> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeCollectionData(src)).endCell());
    },
    parse: (src) => {
      return loadCollectionData(src.loadRef().beginParse());
    }
  };
}

export type RoyaltyParams = {
  $$type: 'RoyaltyParams';
  numerator: bigint;
  denominator: bigint;
  destination: Address;
};

export function storeRoyaltyParams(src: RoyaltyParams) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeInt(src.numerator, 257);
    b_0.storeInt(src.denominator, 257);
    b_0.storeAddress(src.destination);
  };
}

export function loadRoyaltyParams(slice: Slice) {
  let sc_0 = slice;
  let _numerator = sc_0.loadIntBig(257);
  let _denominator = sc_0.loadIntBig(257);
  let _destination = sc_0.loadAddress();
  return {
    $$type: 'RoyaltyParams' as const,
    numerator: _numerator,
    denominator: _denominator,
    destination: _destination
  };
}

function loadTupleRoyaltyParams(source: TupleReader) {
  let _numerator = source.readBigNumber();
  let _denominator = source.readBigNumber();
  let _destination = source.readAddress();
  return {
    $$type: 'RoyaltyParams' as const,
    numerator: _numerator,
    denominator: _denominator,
    destination: _destination
  };
}

function storeTupleRoyaltyParams(source: RoyaltyParams) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.numerator);
  builder.writeNumber(source.denominator);
  builder.writeAddress(source.destination);
  return builder.build();
}

function dictValueParserRoyaltyParams(): DictionaryValue<RoyaltyParams> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeRoyaltyParams(src)).endCell());
    },
    parse: (src) => {
      return loadRoyaltyParams(src.loadRef().beginParse());
    }
  };
}

export type GetRoyaltyParams = {
  $$type: 'GetRoyaltyParams';
  query_id: bigint;
};

export function storeGetRoyaltyParams(src: GetRoyaltyParams) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1765620048, 32);
    b_0.storeUint(src.query_id, 64);
  };
}

export function loadGetRoyaltyParams(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1765620048) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  return { $$type: 'GetRoyaltyParams' as const, query_id: _query_id };
}

function loadTupleGetRoyaltyParams(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: 'GetRoyaltyParams' as const, query_id: _query_id };
}

function storeTupleGetRoyaltyParams(source: GetRoyaltyParams) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  return builder.build();
}

function dictValueParserGetRoyaltyParams(): DictionaryValue<GetRoyaltyParams> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeGetRoyaltyParams(src)).endCell());
    },
    parse: (src) => {
      return loadGetRoyaltyParams(src.loadRef().beginParse());
    }
  };
}

export type GetBeneficiary = {
  $$type: 'GetBeneficiary';
  query_id: bigint;
};

export function storeGetBeneficiary(src: GetBeneficiary) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1765620049, 32);
    b_0.storeUint(src.query_id, 64);
  };
}

export function loadGetBeneficiary(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1765620049) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  return { $$type: 'GetBeneficiary' as const, query_id: _query_id };
}

function loadTupleGetBeneficiary(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: 'GetBeneficiary' as const, query_id: _query_id };
}

function storeTupleGetBeneficiary(source: GetBeneficiary) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  return builder.build();
}

function dictValueParserGetBeneficiary(): DictionaryValue<GetBeneficiary> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeGetBeneficiary(src)).endCell());
    },
    parse: (src) => {
      return loadGetBeneficiary(src.loadRef().beginParse());
    }
  };
}

export type Beneficiary = {
  $$type: 'Beneficiary';
  query_id: bigint;
  beneficiary: Address;
};

export function storeBeneficiary(src: Beneficiary) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1765620050, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.beneficiary);
  };
}

export function loadBeneficiary(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1765620050) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _beneficiary = sc_0.loadAddress();
  return {
    $$type: 'Beneficiary' as const,
    query_id: _query_id,
    beneficiary: _beneficiary
  };
}

function loadTupleBeneficiary(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _beneficiary = source.readAddress();
  return {
    $$type: 'Beneficiary' as const,
    query_id: _query_id,
    beneficiary: _beneficiary
  };
}

function storeTupleBeneficiary(source: Beneficiary) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.beneficiary);
  return builder.build();
}

function dictValueParserBeneficiary(): DictionaryValue<Beneficiary> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeBeneficiary(src)).endCell());
    },
    parse: (src) => {
      return loadBeneficiary(src.loadRef().beginParse());
    }
  };
}

export type GetPricePerMint = {
  $$type: 'GetPricePerMint';
  query_id: bigint;
};

export function storeGetPricePerMint(src: GetPricePerMint) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3933418328, 32);
    b_0.storeUint(src.query_id, 64);
  };
}

export function loadGetPricePerMint(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3933418328) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  return { $$type: 'GetPricePerMint' as const, query_id: _query_id };
}

function loadTupleGetPricePerMint(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: 'GetPricePerMint' as const, query_id: _query_id };
}

function storeTupleGetPricePerMint(source: GetPricePerMint) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  return builder.build();
}

function dictValueParserGetPricePerMint(): DictionaryValue<GetPricePerMint> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeGetPricePerMint(src)).endCell());
    },
    parse: (src) => {
      return loadGetPricePerMint(src.loadRef().beginParse());
    }
  };
}

export type Mint = {
  $$type: 'Mint';
  query_id: bigint;
  referer: Address | null;
};

export function storeMint(src: Mint) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2911380899, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.referer);
  };
}

export function loadMint(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2911380899) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _referer = sc_0.loadMaybeAddress();
  return { $$type: 'Mint' as const, query_id: _query_id, referer: _referer };
}

function loadTupleMint(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _referer = source.readAddressOpt();
  return { $$type: 'Mint' as const, query_id: _query_id, referer: _referer };
}

function storeTupleMint(source: Mint) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.referer);
  return builder.build();
}

function dictValueParserMint(): DictionaryValue<Mint> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeMint(src)).endCell());
    },
    parse: (src) => {
      return loadMint(src.loadRef().beginParse());
    }
  };
}

export type MintResponse = {
  $$type: 'MintResponse';
  query_id: bigint;
  nft_address: Address | null;
  item_id: bigint;
};

export function storeMintResponse(src: MintResponse) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3597069519, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.nft_address);
    b_0.storeUint(src.item_id, 64);
  };
}

export function loadMintResponse(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3597069519) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _nft_address = sc_0.loadMaybeAddress();
  let _item_id = sc_0.loadUintBig(64);
  return {
    $$type: 'MintResponse' as const,
    query_id: _query_id,
    nft_address: _nft_address,
    item_id: _item_id
  };
}

function loadTupleMintResponse(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _nft_address = source.readAddressOpt();
  let _item_id = source.readBigNumber();
  return {
    $$type: 'MintResponse' as const,
    query_id: _query_id,
    nft_address: _nft_address,
    item_id: _item_id
  };
}

function storeTupleMintResponse(source: MintResponse) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.nft_address);
  builder.writeNumber(source.item_id);
  return builder.build();
}

function dictValueParserMintResponse(): DictionaryValue<MintResponse> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeMintResponse(src)).endCell());
    },
    parse: (src) => {
      return loadMintResponse(src.loadRef().beginParse());
    }
  };
}

export type BuilkMint = {
  $$type: 'BuilkMint';
  query_id: bigint;
  receiver: Address;
  amount: bigint;
};

export function storeBuilkMint(src: BuilkMint) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(369969521, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.receiver);
    b_0.storeUint(src.amount, 32);
  };
}

export function loadBuilkMint(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 369969521) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _receiver = sc_0.loadAddress();
  let _amount = sc_0.loadUintBig(32);
  return {
    $$type: 'BuilkMint' as const,
    query_id: _query_id,
    receiver: _receiver,
    amount: _amount
  };
}

function loadTupleBuilkMint(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _receiver = source.readAddress();
  let _amount = source.readBigNumber();
  return {
    $$type: 'BuilkMint' as const,
    query_id: _query_id,
    receiver: _receiver,
    amount: _amount
  };
}

function storeTupleBuilkMint(source: BuilkMint) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.receiver);
  builder.writeNumber(source.amount);
  return builder.build();
}

function dictValueParserBuilkMint(): DictionaryValue<BuilkMint> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeBuilkMint(src)).endCell());
    },
    parse: (src) => {
      return loadBuilkMint(src.loadRef().beginParse());
    }
  };
}

export type ReportRoyaltyParams = {
  $$type: 'ReportRoyaltyParams';
  query_id: bigint;
  numerator: bigint;
  denominator: bigint;
  destination: Address;
};

export function storeReportRoyaltyParams(src: ReportRoyaltyParams) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2831876269, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeUint(src.numerator, 16);
    b_0.storeUint(src.denominator, 16);
    b_0.storeAddress(src.destination);
  };
}

export function loadReportRoyaltyParams(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2831876269) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _numerator = sc_0.loadUintBig(16);
  let _denominator = sc_0.loadUintBig(16);
  let _destination = sc_0.loadAddress();
  return {
    $$type: 'ReportRoyaltyParams' as const,
    query_id: _query_id,
    numerator: _numerator,
    denominator: _denominator,
    destination: _destination
  };
}

function loadTupleReportRoyaltyParams(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _numerator = source.readBigNumber();
  let _denominator = source.readBigNumber();
  let _destination = source.readAddress();
  return {
    $$type: 'ReportRoyaltyParams' as const,
    query_id: _query_id,
    numerator: _numerator,
    denominator: _denominator,
    destination: _destination
  };
}

function storeTupleReportRoyaltyParams(source: ReportRoyaltyParams) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.numerator);
  builder.writeNumber(source.denominator);
  builder.writeAddress(source.destination);
  return builder.build();
}

function dictValueParserReportRoyaltyParams(): DictionaryValue<ReportRoyaltyParams> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeReportRoyaltyParams(src)).endCell()
      );
    },
    parse: (src) => {
      return loadReportRoyaltyParams(src.loadRef().beginParse());
    }
  };
}

export type AssignBeneficiary = {
  $$type: 'AssignBeneficiary';
  query_id: bigint;
  beneficiary: Address;
};

export function storeAssignBeneficiary(src: AssignBeneficiary) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(4181920690, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.beneficiary);
  };
}

export function loadAssignBeneficiary(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 4181920690) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _beneficiary = sc_0.loadAddress();
  return {
    $$type: 'AssignBeneficiary' as const,
    query_id: _query_id,
    beneficiary: _beneficiary
  };
}

function loadTupleAssignBeneficiary(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _beneficiary = source.readAddress();
  return {
    $$type: 'AssignBeneficiary' as const,
    query_id: _query_id,
    beneficiary: _beneficiary
  };
}

function storeTupleAssignBeneficiary(source: AssignBeneficiary) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.beneficiary);
  return builder.build();
}

function dictValueParserAssignBeneficiary(): DictionaryValue<AssignBeneficiary> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeAssignBeneficiary(src)).endCell()
      );
    },
    parse: (src) => {
      return loadAssignBeneficiary(src.loadRef().beginParse());
    }
  };
}

export type AssignRefererReward = {
  $$type: 'AssignRefererReward';
  query_id: bigint;
  referer_reward: bigint;
};

export function storeAssignRefererReward(src: AssignRefererReward) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1250984720, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeInt(src.referer_reward, 257);
  };
}

export function loadAssignRefererReward(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1250984720) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _referer_reward = sc_0.loadIntBig(257);
  return {
    $$type: 'AssignRefererReward' as const,
    query_id: _query_id,
    referer_reward: _referer_reward
  };
}

function loadTupleAssignRefererReward(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _referer_reward = source.readBigNumber();
  return {
    $$type: 'AssignRefererReward' as const,
    query_id: _query_id,
    referer_reward: _referer_reward
  };
}

function storeTupleAssignRefererReward(source: AssignRefererReward) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.referer_reward);
  return builder.build();
}

function dictValueParserAssignRefererReward(): DictionaryValue<AssignRefererReward> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeAssignRefererReward(src)).endCell()
      );
    },
    parse: (src) => {
      return loadAssignRefererReward(src.loadRef().beginParse());
    }
  };
}

export type AssignPricePerMint = {
  $$type: 'AssignPricePerMint';
  query_id: bigint;
  price_per_mint: bigint;
};

export function storeAssignPricePerMint(src: AssignPricePerMint) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(632909978, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeInt(src.price_per_mint, 257);
  };
}

export function loadAssignPricePerMint(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 632909978) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _price_per_mint = sc_0.loadIntBig(257);
  return {
    $$type: 'AssignPricePerMint' as const,
    query_id: _query_id,
    price_per_mint: _price_per_mint
  };
}

function loadTupleAssignPricePerMint(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _price_per_mint = source.readBigNumber();
  return {
    $$type: 'AssignPricePerMint' as const,
    query_id: _query_id,
    price_per_mint: _price_per_mint
  };
}

function storeTupleAssignPricePerMint(source: AssignPricePerMint) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.price_per_mint);
  return builder.build();
}

function dictValueParserAssignPricePerMint(): DictionaryValue<AssignPricePerMint> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeAssignPricePerMint(src)).endCell()
      );
    },
    parse: (src) => {
      return loadAssignPricePerMint(src.loadRef().beginParse());
    }
  };
}

export type GetNftData = {
  $$type: 'GetNftData';
  is_initialized: boolean;
  index: bigint;
  collection_address: Address;
  owner_address: Address;
  individual_content: Cell;
};

export function storeGetNftData(src: GetNftData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeBit(src.is_initialized);
    b_0.storeInt(src.index, 257);
    b_0.storeAddress(src.collection_address);
    b_0.storeAddress(src.owner_address);
    b_0.storeRef(src.individual_content);
  };
}

export function loadGetNftData(slice: Slice) {
  let sc_0 = slice;
  let _is_initialized = sc_0.loadBit();
  let _index = sc_0.loadIntBig(257);
  let _collection_address = sc_0.loadAddress();
  let _owner_address = sc_0.loadAddress();
  let _individual_content = sc_0.loadRef();
  return {
    $$type: 'GetNftData' as const,
    is_initialized: _is_initialized,
    index: _index,
    collection_address: _collection_address,
    owner_address: _owner_address,
    individual_content: _individual_content
  };
}

function loadTupleGetNftData(source: TupleReader) {
  let _is_initialized = source.readBoolean();
  let _index = source.readBigNumber();
  let _collection_address = source.readAddress();
  let _owner_address = source.readAddress();
  let _individual_content = source.readCell();
  return {
    $$type: 'GetNftData' as const,
    is_initialized: _is_initialized,
    index: _index,
    collection_address: _collection_address,
    owner_address: _owner_address,
    individual_content: _individual_content
  };
}

function storeTupleGetNftData(source: GetNftData) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.is_initialized);
  builder.writeNumber(source.index);
  builder.writeAddress(source.collection_address);
  builder.writeAddress(source.owner_address);
  builder.writeCell(source.individual_content);
  return builder.build();
}

function dictValueParserGetNftData(): DictionaryValue<GetNftData> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeGetNftData(src)).endCell());
    },
    parse: (src) => {
      return loadGetNftData(src.loadRef().beginParse());
    }
  };
}

export type Transfer = {
  $$type: 'Transfer';
  query_id: bigint;
  new_owner: Address;
  response_destination: Address;
  custom_payload: Cell | null;
  forward_amount: bigint;
  forward_payload: Cell;
};

export function storeTransfer(src: Transfer) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1607220500, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.new_owner);
    b_0.storeAddress(src.response_destination);
    if (src.custom_payload !== null && src.custom_payload !== undefined) {
      b_0.storeBit(true).storeRef(src.custom_payload);
    } else {
      b_0.storeBit(false);
    }
    b_0.storeCoins(src.forward_amount);
    b_0.storeBuilder(src.forward_payload.asBuilder());
  };
}

export function loadTransfer(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1607220500) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _new_owner = sc_0.loadAddress();
  let _response_destination = sc_0.loadAddress();
  let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
  let _forward_amount = sc_0.loadCoins();
  let _forward_payload = sc_0.asCell();
  return {
    $$type: 'Transfer' as const,
    query_id: _query_id,
    new_owner: _new_owner,
    response_destination: _response_destination,
    custom_payload: _custom_payload,
    forward_amount: _forward_amount,
    forward_payload: _forward_payload
  };
}

function loadTupleTransfer(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _new_owner = source.readAddress();
  let _response_destination = source.readAddress();
  let _custom_payload = source.readCellOpt();
  let _forward_amount = source.readBigNumber();
  let _forward_payload = source.readCell();
  return {
    $$type: 'Transfer' as const,
    query_id: _query_id,
    new_owner: _new_owner,
    response_destination: _response_destination,
    custom_payload: _custom_payload,
    forward_amount: _forward_amount,
    forward_payload: _forward_payload
  };
}

function storeTupleTransfer(source: Transfer) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.new_owner);
  builder.writeAddress(source.response_destination);
  builder.writeCell(source.custom_payload);
  builder.writeNumber(source.forward_amount);
  builder.writeSlice(source.forward_payload);
  return builder.build();
}

function dictValueParserTransfer(): DictionaryValue<Transfer> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeTransfer(src)).endCell());
    },
    parse: (src) => {
      return loadTransfer(src.loadRef().beginParse());
    }
  };
}

export type OwnershipAssigned = {
  $$type: 'OwnershipAssigned';
  query_id: bigint;
  prev_owner: Address;
  forward_payload: Cell;
};

export function storeOwnershipAssigned(src: OwnershipAssigned) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(85167505, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.prev_owner);
    b_0.storeBuilder(src.forward_payload.asBuilder());
  };
}

export function loadOwnershipAssigned(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 85167505) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _prev_owner = sc_0.loadAddress();
  let _forward_payload = sc_0.asCell();
  return {
    $$type: 'OwnershipAssigned' as const,
    query_id: _query_id,
    prev_owner: _prev_owner,
    forward_payload: _forward_payload
  };
}

function loadTupleOwnershipAssigned(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _prev_owner = source.readAddress();
  let _forward_payload = source.readCell();
  return {
    $$type: 'OwnershipAssigned' as const,
    query_id: _query_id,
    prev_owner: _prev_owner,
    forward_payload: _forward_payload
  };
}

function storeTupleOwnershipAssigned(source: OwnershipAssigned) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.prev_owner);
  builder.writeSlice(source.forward_payload);
  return builder.build();
}

function dictValueParserOwnershipAssigned(): DictionaryValue<OwnershipAssigned> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeOwnershipAssigned(src)).endCell()
      );
    },
    parse: (src) => {
      return loadOwnershipAssigned(src.loadRef().beginParse());
    }
  };
}

export type Excesses = {
  $$type: 'Excesses';
  query_id: bigint;
};

export function storeExcesses(src: Excesses) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3576854235, 32);
    b_0.storeUint(src.query_id, 64);
  };
}

export function loadExcesses(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3576854235) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  return { $$type: 'Excesses' as const, query_id: _query_id };
}

function loadTupleExcesses(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: 'Excesses' as const, query_id: _query_id };
}

function storeTupleExcesses(source: Excesses) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  return builder.build();
}

function dictValueParserExcesses(): DictionaryValue<Excesses> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeExcesses(src)).endCell());
    },
    parse: (src) => {
      return loadExcesses(src.loadRef().beginParse());
    }
  };
}

export type GetStaticData = {
  $$type: 'GetStaticData';
  query_id: bigint;
};

export function storeGetStaticData(src: GetStaticData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(801842850, 32);
    b_0.storeUint(src.query_id, 64);
  };
}

export function loadGetStaticData(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 801842850) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function loadTupleGetStaticData(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function storeTupleGetStaticData(source: GetStaticData) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  return builder.build();
}

function dictValueParserGetStaticData(): DictionaryValue<GetStaticData> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeGetStaticData(src)).endCell());
    },
    parse: (src) => {
      return loadGetStaticData(src.loadRef().beginParse());
    }
  };
}

export type ReportStaticData = {
  $$type: 'ReportStaticData';
  query_id: bigint;
  index_id: bigint;
  collection: Address;
};

export function storeReportStaticData(src: ReportStaticData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2339837749, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeInt(src.index_id, 257);
    b_0.storeAddress(src.collection);
  };
}

export function loadReportStaticData(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2339837749) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _index_id = sc_0.loadIntBig(257);
  let _collection = sc_0.loadAddress();
  return {
    $$type: 'ReportStaticData' as const,
    query_id: _query_id,
    index_id: _index_id,
    collection: _collection
  };
}

function loadTupleReportStaticData(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _index_id = source.readBigNumber();
  let _collection = source.readAddress();
  return {
    $$type: 'ReportStaticData' as const,
    query_id: _query_id,
    index_id: _index_id,
    collection: _collection
  };
}

function storeTupleReportStaticData(source: ReportStaticData) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.index_id);
  builder.writeAddress(source.collection);
  return builder.build();
}

function dictValueParserReportStaticData(): DictionaryValue<ReportStaticData> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeReportStaticData(src)).endCell());
    },
    parse: (src) => {
      return loadReportStaticData(src.loadRef().beginParse());
    }
  };
}

type NftCollection_init_args = {
  $$type: 'NftCollection_init_args';
  owner_address: Address;
  beneficiary: Address;
  collection_content: Cell;
  price_per_mint: bigint;
  price_per_mint_step: bigint;
  price_per_mint_step_rise: bigint;
  royalty_params: RoyaltyParams;
};

function initNftCollection_init_args(src: NftCollection_init_args) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeAddress(src.owner_address);
    b_0.storeAddress(src.beneficiary);
    b_0.storeRef(src.collection_content);
    b_0.storeInt(src.price_per_mint, 257);
    let b_1 = new Builder();
    b_1.storeInt(src.price_per_mint_step, 257);
    b_1.storeInt(src.price_per_mint_step_rise, 257);
    let b_2 = new Builder();
    b_2.store(storeRoyaltyParams(src.royalty_params));
    b_1.storeRef(b_2.endCell());
    b_0.storeRef(b_1.endCell());
  };
}

async function NftCollection_init(
  owner_address: Address,
  beneficiary: Address,
  collection_content: Cell,
  price_per_mint: bigint,
  price_per_mint_step: bigint,
  price_per_mint_step_rise: bigint,
  royalty_params: RoyaltyParams
) {
  const __code = Cell.fromBase64(
    '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'
  );
  const __system = Cell.fromBase64(
    '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'
  );
  let builder = beginCell();
  builder.storeRef(__system);
  builder.storeUint(0, 1);
  initNftCollection_init_args({
    $$type: 'NftCollection_init_args',
    owner_address,
    beneficiary,
    collection_content,
    price_per_mint,
    price_per_mint_step,
    price_per_mint_step_rise,
    royalty_params
  })(builder);
  const __data = builder.endCell();
  return { code: __code, data: __data };
}

const NftCollection_errors: { [key: number]: { message: string } } = {
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
  4637: { message: `Insufficient funds for minting.` },
  13566: { message: `Only owner can set beneficiary address` },
  23845: { message: `Only owner can perform bulk minting` },
  36704: { message: `Insufficient funds for storage and gas.` },
  37425: { message: `Only owner can set price per mint` },
  49280: { message: `not owner` },
  62742: { message: `non-sequential NFTs` }
};

const NftCollection_types: ABIType[] = [
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
    name: 'CollectionData',
    header: null,
    fields: [
      {
        name: 'next_item_index',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      },
      {
        name: 'collection_content',
        type: { kind: 'simple', type: 'cell', optional: false }
      },
      {
        name: 'owner_address',
        type: { kind: 'simple', type: 'address', optional: false }
      }
    ]
  },
  {
    name: 'RoyaltyParams',
    header: null,
    fields: [
      {
        name: 'numerator',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      },
      {
        name: 'denominator',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      },
      {
        name: 'destination',
        type: { kind: 'simple', type: 'address', optional: false }
      }
    ]
  },
  {
    name: 'GetRoyaltyParams',
    header: 1765620048,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      }
    ]
  },
  {
    name: 'GetBeneficiary',
    header: 1765620049,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      }
    ]
  },
  {
    name: 'Beneficiary',
    header: 1765620050,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'beneficiary',
        type: { kind: 'simple', type: 'address', optional: false }
      }
    ]
  },
  {
    name: 'GetPricePerMint',
    header: 3933418328,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      }
    ]
  },
  {
    name: 'Mint',
    header: 2911380899,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'referer',
        type: { kind: 'simple', type: 'address', optional: true }
      }
    ]
  },
  {
    name: 'MintResponse',
    header: 3597069519,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'nft_address',
        type: { kind: 'simple', type: 'address', optional: true }
      },
      {
        name: 'item_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      }
    ]
  },
  {
    name: 'BuilkMint',
    header: 369969521,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'receiver',
        type: { kind: 'simple', type: 'address', optional: false }
      },
      {
        name: 'amount',
        type: { kind: 'simple', type: 'uint', optional: false, format: 32 }
      }
    ]
  },
  {
    name: 'ReportRoyaltyParams',
    header: 2831876269,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'numerator',
        type: { kind: 'simple', type: 'uint', optional: false, format: 16 }
      },
      {
        name: 'denominator',
        type: { kind: 'simple', type: 'uint', optional: false, format: 16 }
      },
      {
        name: 'destination',
        type: { kind: 'simple', type: 'address', optional: false }
      }
    ]
  },
  {
    name: 'AssignBeneficiary',
    header: 4181920690,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'beneficiary',
        type: { kind: 'simple', type: 'address', optional: false }
      }
    ]
  },
  {
    name: 'AssignRefererReward',
    header: 1250984720,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'referer_reward',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      }
    ]
  },
  {
    name: 'AssignPricePerMint',
    header: 632909978,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'price_per_mint',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      }
    ]
  },
  {
    name: 'GetNftData',
    header: null,
    fields: [
      {
        name: 'is_initialized',
        type: { kind: 'simple', type: 'bool', optional: false }
      },
      {
        name: 'index',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      },
      {
        name: 'collection_address',
        type: { kind: 'simple', type: 'address', optional: false }
      },
      {
        name: 'owner_address',
        type: { kind: 'simple', type: 'address', optional: false }
      },
      {
        name: 'individual_content',
        type: { kind: 'simple', type: 'cell', optional: false }
      }
    ]
  },
  {
    name: 'Transfer',
    header: 1607220500,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'new_owner',
        type: { kind: 'simple', type: 'address', optional: false }
      },
      {
        name: 'response_destination',
        type: { kind: 'simple', type: 'address', optional: false }
      },
      {
        name: 'custom_payload',
        type: { kind: 'simple', type: 'cell', optional: true }
      },
      {
        name: 'forward_amount',
        type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' }
      },
      {
        name: 'forward_payload',
        type: {
          kind: 'simple',
          type: 'slice',
          optional: false,
          format: 'remainder'
        }
      }
    ]
  },
  {
    name: 'OwnershipAssigned',
    header: 85167505,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'prev_owner',
        type: { kind: 'simple', type: 'address', optional: false }
      },
      {
        name: 'forward_payload',
        type: {
          kind: 'simple',
          type: 'slice',
          optional: false,
          format: 'remainder'
        }
      }
    ]
  },
  {
    name: 'Excesses',
    header: 3576854235,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      }
    ]
  },
  {
    name: 'GetStaticData',
    header: 801842850,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      }
    ]
  },
  {
    name: 'ReportStaticData',
    header: 2339837749,
    fields: [
      {
        name: 'query_id',
        type: { kind: 'simple', type: 'uint', optional: false, format: 64 }
      },
      {
        name: 'index_id',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      },
      {
        name: 'collection',
        type: { kind: 'simple', type: 'address', optional: false }
      }
    ]
  }
];

const NftCollection_getters: ABIGetter[] = [
  {
    name: 'get_collection_data',
    arguments: [],
    returnType: { kind: 'simple', type: 'CollectionData', optional: false }
  },
  {
    name: 'get_nft_address_by_index',
    arguments: [
      {
        name: 'item_index',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      }
    ],
    returnType: { kind: 'simple', type: 'address', optional: true }
  },
  {
    name: 'getNftItemInit',
    arguments: [
      {
        name: 'item_index',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      }
    ],
    returnType: { kind: 'simple', type: 'StateInit', optional: false }
  },
  {
    name: 'get_nft_content',
    arguments: [
      {
        name: 'index',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      },
      {
        name: 'individual_content',
        type: { kind: 'simple', type: 'cell', optional: false }
      }
    ],
    returnType: { kind: 'simple', type: 'cell', optional: false }
  },
  {
    name: 'royalty_params',
    arguments: [],
    returnType: { kind: 'simple', type: 'RoyaltyParams', optional: false }
  },
  {
    name: 'beneficiary',
    arguments: [],
    returnType: { kind: 'simple', type: 'address', optional: false }
  },
  {
    name: 'calc_price_per_mint',
    arguments: [
      {
        name: 'price',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      },
      {
        name: 'item_index',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      },
      {
        name: 'step',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      },
      {
        name: 'rise',
        type: { kind: 'simple', type: 'int', optional: false, format: 257 }
      }
    ],
    returnType: { kind: 'simple', type: 'int', optional: false, format: 257 }
  },
  {
    name: 'price_per_mint',
    arguments: [],
    returnType: { kind: 'simple', type: 'int', optional: false, format: 257 }
  },
  {
    name: 'owner',
    arguments: [],
    returnType: { kind: 'simple', type: 'address', optional: false }
  },
  {
    name: 'referer_reward',
    arguments: [],
    returnType: { kind: 'simple', type: 'int', optional: false, format: 257 }
  },
  {
    name: 'total_bought',
    arguments: [
      {
        name: 'buyer',
        type: { kind: 'simple', type: 'address', optional: false }
      }
    ],
    returnType: { kind: 'simple', type: 'int', optional: false, format: 257 }
  }
];

const NftCollection_receivers: ABIReceiver[] = [
  { receiver: 'internal', message: { kind: 'typed', type: 'Mint' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'BuilkMint' } },
  {
    receiver: 'internal',
    message: { kind: 'typed', type: 'GetRoyaltyParams' }
  },
  { receiver: 'internal', message: { kind: 'typed', type: 'GetBeneficiary' } },
  {
    receiver: 'internal',
    message: { kind: 'typed', type: 'AssignBeneficiary' }
  },
  {
    receiver: 'internal',
    message: { kind: 'typed', type: 'AssignPricePerMint' }
  },
  { receiver: 'internal', message: { kind: 'typed', type: 'GetPricePerMint' } }
];

export class NftCollection implements Contract {
  static async init(
    owner_address: Address,
    beneficiary: Address,
    collection_content: Cell,
    price_per_mint: bigint,
    price_per_mint_step: bigint,
    price_per_mint_step_rise: bigint,
    royalty_params: RoyaltyParams
  ) {
    return await NftCollection_init(
      owner_address,
      beneficiary,
      collection_content,
      price_per_mint,
      price_per_mint_step,
      price_per_mint_step_rise,
      royalty_params
    );
  }

  static async fromInit(
    owner_address: Address,
    beneficiary: Address,
    collection_content: Cell,
    price_per_mint: bigint,
    price_per_mint_step: bigint,
    price_per_mint_step_rise: bigint,
    royalty_params: RoyaltyParams
  ) {
    const init = await NftCollection_init(
      owner_address,
      beneficiary,
      collection_content,
      price_per_mint,
      price_per_mint_step,
      price_per_mint_step_rise,
      royalty_params
    );
    const address = contractAddress(0, init);
    return new NftCollection(address, init);
  }

  static fromAddress(address: Address) {
    return new NftCollection(address);
  }

  readonly address: Address;
  readonly init?: { code: Cell; data: Cell };
  readonly abi: ContractABI = {
    types: NftCollection_types,
    getters: NftCollection_getters,
    receivers: NftCollection_receivers,
    errors: NftCollection_errors
  };

  private constructor(address: Address, init?: { code: Cell; data: Cell }) {
    this.address = address;
    this.init = init;
  }

  async send(
    provider: ContractProvider,
    via: Sender,
    args: { value: bigint; bounce?: boolean | null | undefined },
    message:
      | Mint
      | BuilkMint
      | GetRoyaltyParams
      | GetBeneficiary
      | AssignBeneficiary
      | AssignPricePerMint
      | GetPricePerMint
  ) {
    let body: Cell | null = null;
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'Mint'
    ) {
      body = beginCell().store(storeMint(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'BuilkMint'
    ) {
      body = beginCell().store(storeBuilkMint(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'GetRoyaltyParams'
    ) {
      body = beginCell().store(storeGetRoyaltyParams(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'GetBeneficiary'
    ) {
      body = beginCell().store(storeGetBeneficiary(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'AssignBeneficiary'
    ) {
      body = beginCell().store(storeAssignBeneficiary(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'AssignPricePerMint'
    ) {
      body = beginCell().store(storeAssignPricePerMint(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'GetPricePerMint'
    ) {
      body = beginCell().store(storeGetPricePerMint(message)).endCell();
    }
    if (body === null) {
      throw new Error('Invalid message type');
    }

    await provider.internal(via, { ...args, body: body });
  }

  async getGetCollectionData(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get('get_collection_data', builder.build()))
      .stack;
    const result = loadTupleCollectionData(source);
    return result;
  }

  async getGetNftAddressByIndex(
    provider: ContractProvider,
    item_index: bigint
  ) {
    let builder = new TupleBuilder();
    builder.writeNumber(item_index);
    let source = (
      await provider.get('get_nft_address_by_index', builder.build())
    ).stack;
    let result = source.readAddressOpt();
    return result;
  }

  async getGetNftItemInit(provider: ContractProvider, item_index: bigint) {
    let builder = new TupleBuilder();
    builder.writeNumber(item_index);
    let source = (await provider.get('getNftItemInit', builder.build())).stack;
    const result = loadTupleStateInit(source);
    return result;
  }

  async getGetNftContent(
    provider: ContractProvider,
    index: bigint,
    individual_content: Cell
  ) {
    let builder = new TupleBuilder();
    builder.writeNumber(index);
    builder.writeCell(individual_content);
    let source = (await provider.get('get_nft_content', builder.build())).stack;
    let result = source.readCell();
    return result;
  }

  async getRoyaltyParams(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get('royalty_params', builder.build())).stack;
    const result = loadTupleRoyaltyParams(source);
    return result;
  }

  async getBeneficiary(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get('beneficiary', builder.build())).stack;
    let result = source.readAddress();
    return result;
  }

  async getCalcPricePerMint(
    provider: ContractProvider,
    price: bigint,
    item_index: bigint,
    step: bigint,
    rise: bigint
  ) {
    let builder = new TupleBuilder();
    builder.writeNumber(price);
    builder.writeNumber(item_index);
    builder.writeNumber(step);
    builder.writeNumber(rise);
    let source = (await provider.get('calc_price_per_mint', builder.build()))
      .stack;
    let result = source.readBigNumber();
    return result;
  }

  async getPricePerMint(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get('price_per_mint', builder.build())).stack;
    let result = source.readBigNumber();
    return result;
  }

  async getOwner(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get('owner', builder.build())).stack;
    let result = source.readAddress();
    return result;
  }

  async getRefererReward(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get('referer_reward', builder.build())).stack;
    let result = source.readBigNumber();
    return result;
  }

  async getTotalBought(provider: ContractProvider, buyer: Address) {
    let builder = new TupleBuilder();
    builder.writeAddress(buyer);
    let source = (await provider.get('total_bought', builder.build())).stack;
    let result = source.readBigNumber();
    return result;
  }
}
