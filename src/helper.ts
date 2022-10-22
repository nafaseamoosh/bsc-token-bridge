import {BigInt, Bytes} from "@graphprotocol/graph-ts";
import {CompleteTransfer} from "../generated/schema";

export function processSequenceNumber(vaa: Bytes, hash: Bytes) : void {
	const version = vaa[0];
	if(version !== 1) {
		return;
	}
	const signatureLength: u8 = vaa[5];
	let signatures: i32 = 0;
	for (let i: u8 = 0; i < signatureLength; i++) {
		signatures = signatures + 66;
	}
	const headerEnd = 5 + signatures;
	const sequenceStart = headerEnd + 42 + 1;
	const emitterChainStart = headerEnd + 8 + 1;
	const emitterChain =  new Bytes(2);
	for (let i = 0; i < 2; i++) {
		emitterChain[i] = vaa[emitterChainStart + i];
	}
	let emitterResult: u16 = 0;
	emitterResult = (emitterResult | emitterChain[0]) << 8;
	emitterResult = emitterResult | emitterChain[1];
	if (emitterResult !== 1) {
		return;
	}

	const sequence =  new Bytes(8);
	for (let i = 0; i < 8; i++) {
		sequence[i] = vaa[sequenceStart + i];
	}
	let result: u64 = 0
	result = (result | sequence[0]) << 8;
	result = (result | sequence[1]) << 8;
	result = (result | sequence[2]) << 8;
	result = (result | sequence[3]) << 8;
	result = (result | sequence[4]) << 8;
	result = (result | sequence[5]) << 8;
	result = (result | sequence[6]) << 8;
	result = result | sequence[7];

	const id = hash.toHexString();
	const entity = new CompleteTransfer(id);
	entity.sequence = BigInt.fromU64(result);
	entity.emitterChain = emitterResult;
	entity.hash = hash;
	entity.save();
}
