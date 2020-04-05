import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'

// Create IPFS instance
const ipfs = new IPFS()

// StartEngine will provide an orbitdb and ipfs instance
function StartEngine(): Promise<any> {
    // ToDo: check current identity with localforge
    odb = OrbitDB.createInstance(ipfs)
}