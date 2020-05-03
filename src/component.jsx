import { h, Component } from 'preact'
import { 
  GetDomainDatabase, 
  GetIPFS, 
  GetOnOrbit 
} from './database'

export default class LikeCounter extends Component {
  constructor(props) {
    super()
    this.database = null
    this.props = props
    this.state = { 
      ready: false,
      counter: 0, 
      liked: false, 
      needsSetup: !props.dbkey ? true : false 
    };
  }

  componentDidMount() {
    GetIPFS()
      .then(GetOnOrbit)
      .then((orbit) => {
        console.log("[OrbitDB] Started", orbit)
        // Using Orbit now that we have it to get the Domain DB
        GetDomainDatabase(orbit, this.props.dbkey)
          .then((domainDB) => {
            console.log("[DomainDatabase] Started")
            domainDB.load()
            this.database = domainDB
            
            // Restart events
            this.onNewDatabaseState()
            domainDB.events.on('ready', this.onNewDatabaseState.bind(this))
            domainDB.events.on('replicated', this.onNewDatabaseState.bind(this))
            domainDB.events.on('replicate', this.onNewDatabaseState.bind(this))
          })
          .catch((err) => {
            console.error("[componentDidMount] Error", err)
          })
      })
  }

  componentWillUnmount() {
    if(this.database) this.database.stop()
  }

  onNewDatabaseState() {
    this.setState({
      ready: true,
      counter: this.database.value
    })
    console.log(`[onNewDatabaseState] New state: ${this.state.counter}`)
  }

  increaseCounter(e) {
    e.preventDefault()

    this.database.inc().then(this.onNewDatabaseState.bind(this))
    
  }

  render() {
    if(this.state.needsSetup) {
      return <div>Unable to find key value: Please ready qm64.tech blog post!</div>
    }

    return (
      this.state.ready && 
        <button onClick={this.increaseCounter.bind(this)}>
          {this.state.counter}
        </button>
    )
  }
}