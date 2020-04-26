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
  return GetDomainDatabase(orbit, `DD1-${domain}`, options={})
}

export function GetDomainDatabase(orbit, address, options={}) {
  console.log(`[GetDomainDatabase] Using ${address}`)
  return new Promise((resolve, reject) => {
    orbit.keyvalue(address, {...DEFAULT_DB_OPTIONS, ...options})
      .then(db => {

        db.events.on('ready', () => {
          console.log(`[GetDomainDatabase] Ready ${db.address.toString()}`)
          resolve(db)
        })
        db.load()
      })
      .catch(reject)
  })

}

export function GetPageCounter(orbit, domainDB, page, options={}) {
  return new Promise((resolve, reject) => {
    const dbKeyPage = `${page.replace("/","-")}`

    let address = domainDB.get(dbKeyPage)
    let addressFound = true

    console.log(`[GetPageCounter] Got ${address}`)

    if(!address) {
      addressFound = false
      address = `DP1${dbKeyPage}`
    }


    orbit.counter(address, {...DEFAULT_DB_OPTIONS, ...options})
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
          console.log(`[GetPageCounter] Ready ${pageDB.address.toString()}`)
          resolve(pageDB)
        })
        pageDB.load()
      })
      .catch(reject)
  })
}
