/*const onClick = e => (...)

const SomeButton = props => {
  return <button onClick={onClick}>Click me!</button>
}*/

function formatMessage() {
  return intl.formatMessage.call(intl, ...arguments);
}

export * from 'react-intl';

export { formatMessage };