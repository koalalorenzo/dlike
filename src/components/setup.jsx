import { h, Component } from 'preact'

import { Container, Row, Col } from 'muicss/react'
import { Form, Button, Input, Checkbox, Textarea } from 'muicss/react'

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
      customClassName: "mui-btn mui-btn--accent",
      beforeText: "",
      afterText: "",
      key: "",
      tempKey: "", // used to fill before rendering an existing one
    }

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

  updateClassName(e) {
    this.setState({customClassName: e.target.value})
  }

  updateBeforeText(e) {
    this.setState({beforeText: e.target.value})
  }

  updateAfterText(e) {
    this.setState({afterText: e.target.value})
  }

  generateAddress(e) {
    e.preventDefault()

    NewDomainDatabase(this.orbit, this.state.domain)
      .then((domainDB) => {
        this.setState({
          key: domainDB.address.toString()
        })    
      })
  }

  updateDBKeyValue(e) {
    this.setState({tempKey: e.target.value})
  }

  showExistingDB(e) {
    this.setState({key: this.state.tempKey})
  }

  render() {
    if(!this.state.loaded) return <div>Connecting to the network... Please wait</div>
    
    // build the button code
    let buttonCode = ""
    if(!!this.state.key) {
      buttonCode = `<div data-prop-dbkey="${this.state.key}"`
      
      if(this.state.afterText) buttonCode += ` afterText="${this.state.afterText}" `
      if(this.state.beforeText) buttonCode += ` beforeText="${this.state.beforeText}" `
      if(this.state.customClassName) buttonCode += ` className="${this.state.customClassName}" `

      buttonCode += `><script src="https://qm64.gitlab.io/dlike/dlike.js"></script></div>`
    }


    return (
      <Container>
        <Row>
          <Col md="6" md-offset="3" sm="12">
            <h1>Decentralised like button setup</h1>
            <p>
              This page helps with the setup of the decentralised like button 
              using p2p technologies like <a href="https://ipfs.io">IPFS</a> and
              {' '}<a href="https://orbitdb.org/">OrbitDB</a>. <br />
              <br />
              It is an <b>Experiment</b> and not suited for production. 
              If you want to know more about this project or contribute/help 
              please check the <a href="https://gitlab.com/qm64/dlike">Source Code</a>.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Form>
              <h3>Create New Widget</h3>
              <Input 
                label="Your domain:"
                placeholder="example.com"
                value={this.state.domain}
                onChange={this.updateDomainState.bind(this)} 
              />
              <Input 
                label="CSS Class"
                placeholder="custom-css-class"
                value={this.state.customClassName}
                onChange={this.updateClassName.bind(this)} 
              />
              <Input 
                label="Text before the number"
                placeholder="Likes: "
                value={this.state.beforeText}
                onChange={this.updateBeforeText.bind(this)} 
              />
              <Input 
                label="Text after the number"
                placeholder=" reaction(s)"
                value={this.state.afterText}
                onChange={this.updateAfterText.bind(this)} 
              />
              <Button color="primary" onClick={this.generateAddress.bind(this)}> Generate Key </Button>
            </Form>
          </Col>
          <Col md="6" >
            <h3>Existing Widget</h3>
            <label for="dbkey">Your dbkey:</label>
            <Input 
              label="Your dbkey:"
              placeholder="/orbitdb/Qm123..."
              value={this.state.tempKey}
              onChange={this.updateDBKeyValue.bind(this)} 
            />
            <Button color="primary" onClick={this.showExistingDB.bind(this)}> Show Button </Button>
          </Col>
        </Row>
        {!!this.state.key && 
            <Row>
               <Col md="6" md-offset="3" sm="12">
                <h3>Results</h3>
                Widget Code: 
                <Textarea defaultValue={buttonCode} />
                This is your button running live: <br />
                <br />
                <LikeCounter 
                  dbkey={this.state.key} 
                  beforeText={this.state.beforeText} 
                  className={this.state.customClassName} 
                  afterText={this.state.afterText} 
                /><br />
                <br />
                DO NOT close this window before visiting your website!
              </Col>
            </Row>
          }
        <div align="center">Made with Love by <a href="https://qm64.tech/">Qm64</a></div>
      </Container>
    )
  }
}
