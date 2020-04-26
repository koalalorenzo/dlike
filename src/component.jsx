import { h, Component } from 'preact'
import { 
  GetDomainDatabase, 
  GetAmountOfLikes,
  PutALike,
  GetIPFS, 
  GetOnOrbit 
} from './database'

export default class LikeCounter extends Component {
  constructor(props) {
    super()
    this.database = null
    this.props = {
      page: window.location.pathname,
      ...props
    }
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
        // Using Orbit now that we have it to get the Domain DB
        GetDomainDatabase(orbit, this.props.dbkey)
          .then((domainDB) => {
            domainDB.load()
            this.database = domainDB
            
            // Restart events
            this.onNewDatabaseState()
            domainDB.events.on('ready', this.onNewDatabaseState.bind(this))
            domainDB.events.on('replicated', this.onNewDatabaseState.bind(this))
            domainDB.events.on('replicate', this.onNewDatabaseState.bind(this))
            // debug
            domainDB.events.on('peer', console.log)
          })
      })
  }

  componentWillUnmount() {
    if(this.database) this.database.stop()
  }

  onNewDatabaseState() {
    this.setState({
      ready: true,
      counter: GetAmountOfLikes(this.database, this.props.page)
    })
    console.log(`[onNewDatabaseState] New state: ${this.state.counter}`)
  }

  increaseCounter(e) {
    e.preventDefault()
    // if(this.liked) return;

    PutALike(this.database, this.props.page)
  }

  render() {
    if(this.state.needsSetup) {
      return <div>Unable to find key value</div>
    }

    return (
      this.state.ready && 
        <button onClick={this.increaseCounter.bind(this)}>
          {this.state.counter}
        </button>
    )
  }
}