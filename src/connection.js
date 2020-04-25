const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

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

export function NewDomainDatabase(orbit, domain) {
  return GetDomainDatabase(orbit, `DD1-${domain}`)
}

export function GetDomainDatabase(orbit, address) {
  console.log(`[GetDomainDatabase] Using ${address}`)
  return new Promise((resolve, reject) => {
    orbit.keyvalue(address)
      .then(db => {

        db.events.on('ready', () => {
          console.log(`[GetDomainDatabase] Ready ${address}`)
          resolve(db)
        })
        db.load()
      })
      .catch(reject)
  })

}

export function GetPageCounter(orbit, domainDB, page) {
  return new Promise((resolve, reject) => {
    const dbKeyPage = `${page.replace("/","-")}`

    let address = domainDB.get(dbKeyPage)
    let addressFound = true

    if(!address) {
      addressFound = false
      address = `DP1${dbKeyPage}`
    }

    console.log(`[GetPageCounter] Using ${address}`)

    orbit.counter(address)
      .then((pageDB) => {
        if(!addressFound) {
          domainDB.put(dbKeyPage, pageDB.address.toString())
          .then(() => {
            console.log("[GetPageCounter] Database created for the page")
            return pageDB
          })
          .catch(reject)
        }

        return pageDB
      })
      .then((pageDB) => {
        pageDB.events.on('ready', () => {
          console.log(`[GetDomainDatabase] Ready ${address}`)
          resolve(pageDB)
        })
        pageDB.load()
      })
      .catch(reject)
  })
}
