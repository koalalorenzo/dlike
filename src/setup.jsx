import { h, Component } from 'preact'
import habitat from 'preact-habitat'
import { 
  NewDomainDatabase, 
  GetIPFS, 
  GetOnOrbit 
} from './database'

class SetupKey extends Component {
  constructor(props) {
    super()
    this.orbit = null
    this.props = props
    this.state = { 
      domain: "", 
      key: "",
      resetDB: false,
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

    NewDomainDatabase(this.orbit, this.state.domain, {overwrite: this.state.resetDB})
      .then((domainDB) => {
        this.setState({
          key: domainDB.address.toString()
        });    
      })
  }

  toggleFoceNew(e) {
    e.preventDefault()

    this.setState({resetDB: !this.state.resetDB})
  }

  render() {
    return (
      <div>
        <label for="domainTextbox">Your domain:</label>
        <input 
          type="text" 
          id="domainTextbox"
          value={this.state.domain}
          onChange={this.updateState.bind(this)} 
        />
        <button onClick={this.generateAddress.bind(this)}> Generate Key </button>
        <input onChange={this.toggleFoceNew.bind(this)} type="checkbox" id="resetCheck"></input>
        <label for="resetCheck">Reset DB</label>
        {!!this.state.key && 
          <div>
            Your Code: 
            <p><code>{`<div data-prop-dbkey="${this.state.key}"><script src="dlike.js"></script></div>`}</code></p>
            DO NOT close this window before visiting your website!
          </div>
        }
      </div>
    )
  }
}


const { render } = habitat(SetupKey)

render({
  inline: true,
  clean: false,
  clientSpecified: false,
})
