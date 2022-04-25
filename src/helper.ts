import {Bytes} from "@graphprotocol/graph-ts";
import {CompleteTransfer} from "../generated/schema";

export function processSequenceNumber(vaa: Bytes, hash: Bytes) : void {
	const version = vaa[0];
	if(version !== 1) {
		return;
	}
	const signatureLength = vaa[5];
	const headerEnd = 5 + signatureLength * 66;
	const sequenceStart = headerEnd + 42 + 1;
	const sequence = vaa.slice(sequenceStart, 8) as Bytes;
	const result = sequence.toU64();
	const id = hash.toHexString();
	const entity = new CompleteTransfer(id);
	entity.sequence = result;
	entity.hash = hash;
	entity.save();
}
