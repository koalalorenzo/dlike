import { h, Component } from 'preact'
import { 
  NewDomainDatabase, 
  GetIPFS, 
  GetOnOrbit 
} from '../database'
import LikeCounter from './widget.jsx'

export default class Setup extends Component {
  constructor(props) {
    super()
    this.orbit = null
    this.props = props
    this.state = { 
      domain: "", 
      key: "",
      tempKey: "", // used to fill before rendering an existing one
      resetDB: false,
    };

    GetIPFS()
      .then(GetOnOrbit)
      .then((orbit) => {
        this.orbit = orbit
        this.setState({loaded: true})
      })
  }

  updateDomainState(e) {
    this.setState({domain: e.target.value})
  }

  generateAddress(e) {
    e.preventDefault()

    NewDomainDatabase(this.orbit, this.state.domain, {overwrite: this.state.resetDB})
      .then((domainDB) => {
        this.setState({
          key: domainDB.address.toString()
        });    
      })
  }

  updateDBKeyValue(e) {
    this.setState({tempKey: e.target.value})
  }

  showExistingDB(e) {
    this.setState({key: this.state.tempKey})
  }

  toggleFoceNew(e) {
    e.preventDefault()

    this.setState({resetDB: !this.state.resetDB})
  }

  render() {
    if(!this.state.loaded) return <div>Loading... Please wait</div>
    return (
      <div>
        <div>
          <h3>New Widget</h3>
          <label for="domainTextbox">Your domain:</label>
          <input 
            type="text" 
            id="domainTextbox"
            value={this.state.domain}
            onChange={this.updateDomainState.bind(this)} 
          />
          <button onClick={this.generateAddress.bind(this)}> Generate Key </button>
          <input onChange={this.toggleFoceNew.bind(this)} type="checkbox" id="resetCheck"></input>
          <label for="resetCheck">Reset DB</label>
        </div>
        <div>
          <h3>Existing Widget</h3>
          <label for="dbkey">Your dbkey:</label>
          <input 
            type="text" 
            id="dbkey"
            value={this.state.tempKey}
            onChange={this.updateDBKeyValue.bind(this)} 
          />
          <button onClick={this.showExistingDB.bind(this)}> Show button </button>
        </div>
        {!!this.state.key && 
            <div>
              <h3>Results</h3>
              Widget Code: 
              <p><code>{`<div data-prop-dbkey="${this.state.key}"><script src="dlike.js"></script></div>`}</code></p>
              This is your button running live: <br />
              <br />
              <LikeCounter dbkey={this.state.key} /><br />
              <br />
              DO NOT close this window before visiting your website!
            </div>
          }

      </div>
    )
  }
}
