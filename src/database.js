const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const DEFAULT_IPFS_OPTIONS = {
  repo: '/dlike.qm64.tech',
  EXPERIMENTAL: { ipnsPubsub: true , sharding: false },
  preload: {enabled: false},
  config: { 
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
      ],
    }
  }
}

const DEFAULT_DB_OPTIONS = {
  // Give write access to everyone
  accessController: {
    write: ['*']
  }
}

export function GetIPFS() {
  if(window.ipfs !== undefined) return Promise.resolve(ipfs)

  return IPFS.create(DEFAULT_IPFS_OPTIONS).then(async ipfs => {
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

    // Setup the counter Database
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