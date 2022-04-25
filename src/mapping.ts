import {BigInt, Bytes} from "@graphprotocol/graph-ts"
import {
  TokenBridge,
  AdminChanged,
  BeaconUpgraded,
  Upgraded,
  CompleteTransferCall,
  CompleteTransferAndUnwrapETHCall,
} from "../generated/TokenBridge/TokenBridge"
import {processSequenceNumber} from "./helper";


export function handleCompleteTransfer(call: CompleteTransferCall) : void {
  const vaa = call.inputs.encodedVm;
  processSequenceNumber(vaa, call.transaction.hash);
}

export function handleCompleteTransferAndUnwrapETH(call: CompleteTransferAndUnwrapETHCall) : void {
  const vaa = call.inputs.encodedVm;
  processSequenceNumber(vaa, call.transaction.hash);
}
