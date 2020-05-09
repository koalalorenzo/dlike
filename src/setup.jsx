import habitat from 'preact-habitat'
import Setup from './components/setup.jsx'

const { render } = habitat(Setup)

render({
  inline: true,
  clean: false,
  clientSpecified: false,
})
