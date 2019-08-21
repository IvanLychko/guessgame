import {AnyObject} from "./shared/types";
import Contract from "web3/eth/contract";

export default class Ethereum {
    public static callContract(contract : Contract, method : string, params: any[] = []) : Promise<AnyObject> {
        return (params.length > 0 ? contract.methods[method](...params) : contract.methods[method]()).call();
    }
}