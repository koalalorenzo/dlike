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
  return GetDomainDatabase(orbit, `dlike-domain-v1-${domain}`)
}

export function GetDomainDatabase(orbit, address) {
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
    const keyPage = `${page.replace("/","-")}`

    let address = domainDB.get(keyPage)
    let addressFound = true

    if(!address) {
      addressFound = false
      address = `dlike-page${page.replace("/","-")}`

      console.log(`[GetPageCounter] Page not available in database, creating ${address}`)
    }

    orbit.counter(address).then((pageDB) => {
      if(!addressFound) {
        domainDB.put(keyPage, pageDB.address.toString())
        .then(() => {
          console.log("[GetPageCounter] Database created for the page")
          return resolve(pageDB)
        })
        .catch(reject)
      }

      return resolve(pageDB)
    })
  })
}
