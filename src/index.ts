import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'

// Create IPFS instance
const ipfs = new IPFS()
let odb

ipfs.on('ready', async () => {
  // ToDo: load a pre-existing identity
  odb = await OrbitDB.createInstance(ipfs)
})

