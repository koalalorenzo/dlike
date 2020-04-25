import { h, Component, render } from 'preact'
import { 
  NewDomainDatabase, 
  GetIPFS, 
  GetOnOrbit 
} from './connection'

class SetupKey extends Component {
  constructor(props) {
    super()
    this.orbit = null
    this.props = props
    this.state = { 
      domain: "qm64.tech", 
      key: "--",
    };
  }

  componentDidMount() {
    GetIPFS()
      .then(GetOnOrbit)
      .then((orbit) => {
        this.orbit = orbit
      })
  }

  updateState(e) {
    this.setState({domain: e.target.value})
  }

  generateAddress(e) {
    e.preventDefault()

    NewDomainDatabase(this.orbit, this.state.domain)
      .then((domainDB) => {
        this.setState({
          key: domainDB.address.toString()
        });    
      })
  }

  render() {
    return (
      <div>
        <input 
          type="text" 
          value={this.state.domain} 
          onChange={this.updateState} 
        />
        <button onClick={this.generateAddress}> Generate Key </button>
        <div>Your Key: {this.state.key}</div>
      </div>
    )
  }
}

render(<SetupKey />, document.getElementById('dlikes_setup'));