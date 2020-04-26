const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const DEFAULT_DB_OPTIONS = {
  indexBy: 'page',
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
  console.log("[NewDomainDatabase] Got options", options)
  return GetDomainDatabase(orbit, `dlike-${domain}`, options)
}

export function GetDomainDatabase(orbit, address, options={}) {
  console.log(`[GetDomainDatabase] Using ${address}`)
  return new Promise((resolve, reject) => {
    // We tried counters, then key value containing counter addresses but it 
    // was causing a lot of problems for connections, then the solution was 
    // obvious: document db!
    orbit.docs(address, {...DEFAULT_DB_OPTIONS, ...options})
      .then(db => {

        db.events.on('ready', () => {
          console.log(`[GetDomainDatabase] Ready ${db.address.toString()}`)
          resolve(db)
        })
        // debug
        db.events.on('peer', console.log)
        db.events.on('data', console.log )
        db.load()
      })
      .catch(reject)
  })

}

export function PutALike(domainDB, page) {
  const like = {
    _id: domainDB.identity.publicKey,
    page: `${page.replace('/', '-')}`,
  }
  console.log(like)
  return domainDB.put(like)
}

export function GetAmountOfLikes(domainDB, page){
  return domainDB.query((doc) => doc.page === page).length
}