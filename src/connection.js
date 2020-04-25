const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const crypto = require('crypto')

export function GetIPFS() {
  if(window.ipfs !== undefined) return Promise.resolve(ipfs)

  return IPFS.create().then(async ipfs => {
    if(window.ipfs === undefined) window.ipfs = ipfs
    return ipfs
  })
}
