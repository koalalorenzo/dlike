const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const crypto = require('crypto')

window.counter = null

IPFS.create().then(async ipfs => {
  if(window.ipfs === undefined) window.ipfs = ipfs

  const orbitdb = await OrbitDB.createInstance(ipfs)

  const hash = await crypto.subtle.digest("SHA-1", window.location.pathname)
  // Create / Open a database
  const db = await orbitdb.counter(`dlike/${hash}`)
  await db.load()
  
  console.log("Address:", db.address)
  // Listen for updates from peers
  db.events.on("replicated", address => {
    console.log(db.iterator({ limit: -1 }).collect())
  })

  window.counter = db
})