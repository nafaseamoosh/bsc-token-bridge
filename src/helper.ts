import {BigInt, Bytes, log} from "@graphprotocol/graph-ts";
import {CompleteTransfer} from "../generated/schema";

export function processSequenceNumber(vaa: Bytes, hash: Bytes) : void {
	log.info('Checking version', []);
	const version = vaa[0];
	if(version !== 1) {
		return;
	}
	log.info('Version is OK', []);
	const signatureLength = vaa[5];
	const headerEnd = 5 + signatureLength * 66;
	const sequenceStart = headerEnd + 42 + 1;
	const sequence = vaa.slice(sequenceStart, 8) as Bytes;
	log.info('My value is: {}', [sequence.toHexString()]);
	const result = sequence.toU64();
	const id = hash.toHexString();
	const entity = new CompleteTransfer(id);
	entity.sequence = BigInt.fromU64(result);
	entity.hash = hash;
	entity.save();
}
