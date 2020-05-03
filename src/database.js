const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const DEFAULT_DB_OPTIONS = {
  // Give write access to everyone
  accessController: {
    write: ['*']
  }
}

export function GetIPFS() {
  if(window.ipfs !== undefined) return Promise.resolve(ipfs)

  return IPFS.create().then(async ipfs => {
    if(window.ipfs === undefined) window.ipfs = ipfs
    return ipfs
  })
}

export function GetOnOrbit(ipfs) {
  return OrbitDB.createInstance(ipfs)
}

export function NewDomainDatabase(orbit, domain, options={}) {
  return GetDomainDatabase(orbit, `dlike-${domain}`, options)
}

export function GetDomainDatabase(orbit, address, options={}) {
  console.log(`[GetDomainDatabase] Using ${address}`)
  return new Promise((resolve, reject) => {
    // We tried counters, then key value containing counter addresses but it 
    // was causing a lot of problems for connections, then the solution was 
    // obvious: document db!
    const dbOptions = {...DEFAULT_DB_OPTIONS, ...options}
    console.log("[GetDomainDatabase] Got options", dbOptions)
    orbit.counter(address, dbOptions)
      .then(db => {
        console.log(`[GetDomainDatabase] Got DB ${db.address.toString()}`)
        console.log(`[GetDomainDatabase] Loading...`)

        db.events.on('ready', () => {
          console.log(`[GetDomainDatabase] Ready ${db.address.toString()}`)
          resolve(db)
        })
        // debug
        db.events.on('peer', () => console.log("[GetDomainDatabase] peer found"))
        db.events.on('data', () => console.log("[GetDomainDatabase] data found"))
        db.load()
      })
      .catch(reject)
  })

}