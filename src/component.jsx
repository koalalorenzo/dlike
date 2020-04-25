import { h, Component } from 'preact'
import { GetIPFS } from './connection'

export default class LikeCounter extends Component {

  constructor() {
    super()
    this.ipfs = null
    this.database = null
    this.state = { counter: 0, liked: false };
  }

  componentDidMount() {
    GetIPFS().then((ipfs) => {
      this.ipfs = ipfs
    })
  }

  increaseCounter(e){
    e.preventDefault()
    if(this.liked) return;

    this.setState(state => ({
      counter: state.counter + 1,
      liked: true
    }));

  }

  render() {
    return (
      <button onClick={this.increaseCounter.bind(this)}>
        {this.state.counter}
      </button>
    )
  }
}