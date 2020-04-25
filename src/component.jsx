import { h, Component } from 'preact'
import { GetIPFS } from './connection'

export default class LikeCounter extends Component {

  constructor() {
    super();
    this.ipfs = GetIPFS()
    this.state = { time: Date.now() };
  }

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    // update time every second
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Lifecycle: Called just before our component will be destroyed
  componentWillUnmount() {
    // stop when not renderable
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}