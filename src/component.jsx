import { h, Component } from 'preact'
import { 
  GetDomainDatabase, 
  GetPageCounter, 
  GetIPFS, 
  GetOnOrbit 
} from './connection'

export default class LikeCounter extends Component {
  constructor(props) {
    super()
    this.database = null
    this.props = props
    this.state = { 
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
            return GetPageCounter(orbit, domainDB, window.location.pathname)
          })
          .then((db) => {
            this.database = db
            
            // Setting the events.
            this.onNewDatabaseState()
            db.events.on('ready', this.onNewDatabaseState.bind(this))
            db.events.on('replicated', this.onNewDatabaseState.bind(this))
            db.events.on('replicate', this.onNewDatabaseState.bind(this))
            db.events.on('peer', console.log)
          })
      })
  }

  componentWillUnmount() {
    if(this.database) this.database.stop()
  }

  onNewDatabaseState() {
    console.log(`[onNewDatabaseState] New state: ${this.database.value}`)
    this.setState({
      counter: this.database.value
    });
  }

  increaseCounter(e) {
    e.preventDefault()
    // if(this.liked) return;

    this.database.inc().then(() => {
      this.setState({
        counter: this.database.value,
        liked: true
      });  
    })
  }

  render() {
    if(this.state.needsSetup) {
      return <div>Unable to find key value</div>
    }

    return (
      <button onClick={this.increaseCounter.bind(this)}>
        {this.state.counter}
      </button>
    )
  }
}