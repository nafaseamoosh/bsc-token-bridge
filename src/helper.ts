import {BigInt, Bytes, log} from "@graphprotocol/graph-ts";
import {CompleteTransfer} from "../generated/schema";

export function processSequenceNumber(vaa: Bytes, hash: Bytes) : void {
	// log.info('Checking version', []);
	const version = vaa[0];
	if(version !== 1) {
		return;
	}
	const x = Math.floor(Math.random() * 1000).toString();
	// log.info('Version is OK 232130000', []);
	const signatureLength = vaa[5];
	log.error('{}: signatureLength: {}',[x, signatureLength.toString()]);
	const headerEnd = 5 + signatureLength * 66;
	log.error('{}: headerEnd: {}',[x, headerEnd.toString()]);
	const sequenceStart = headerEnd + 42 + 1;
	log.error('{}: sequenceStart: {}',[x, sequenceStart.toString()]);
	const emitterChainStart = headerEnd + 8 + 1;
	log.error('{}: emitterChainStart: {}',[x, emitterChainStart.toString()]);
	const emitterChain =  new Bytes(2);
	for (let i = 0; i < 2; i++) {
		emitterChain[i] = vaa[emitterChainStart + i];
		log.error('{}: emitterChain at {}: {}',[x, i.toString(), vaa[emitterChainStart + i].toString()]);
	}
	log.warning('Emitter chain: {}', [emitterChain.toHexString()]);
	let emitterResult: u16 = 0;
	emitterResult = (emitterResult | emitterChain[0]) << 8;
	emitterResult = (emitterResult | emitterChain[1]) << 8;

	const sequence =  new Bytes(8);
	for (let i = 0; i < 8; i++) {
		sequence[i] = vaa[sequenceStart + i];
	}
	// log.error('My value after that is: {}', [sequence.toHexString()]);
	// log.info('My value after that is same : {}', [sequence.toHexString()]);
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
