import habitat from 'preact-habitat'
import LikeCounter from './components/widget.jsx'

const { render } = habitat(LikeCounter)

render({
  defaultProps: undefined,
  inline: true,
  clean: false,
  clientSpecified: false,
})