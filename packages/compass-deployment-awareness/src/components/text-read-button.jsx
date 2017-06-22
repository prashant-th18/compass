const React = require('react');
const PropTypes = require('prop-types');
const { TextButton } = require('hadron-react-buttons');
const { Tooltip } = require('hadron-react-components');
const ReadStateStore = require('../stores/read-state-store');

/**
 * The wrapper class.
 */
const WRAPPER = 'tooltip-button-wrapper';

/**
 * Button component that is aware of the read state of the application.
 * This button contains only text, no icons, no animations.
 */
class TextReadButton extends React.Component {

  /**
   * Instantiate the component.
   *
   * @param {Object} props - The properties.
   */
  constructor(props) {
    super(props);
    this.state = ReadStateStore.state;
  }

  /**
   * Subscribe to the state changing stores.
   */
  componentDidMount() {
    this.unsubscribeReadState = ReadStateStore.listen(this.readStateChanged.bind(this));
  }

  /**
   * Unsubscribe from the stores.
   */
  componentWillUnmount() {
    this.unsubscribeReadState();
  }

  /**
   * Handle read state changes.
   *
   * @param {Object} state - The read state.
   */
  readStateChanged(state) {
    this.setState(state);
  }

  /**
   * Get the tooltip text.
   *
   * @returns {String} The tooltip text.
   */
  tooltipText() {
    if (!this.state.isReadable) {
      return ReadStateStore.state.description;
    }
  }

  /**
   * Render the component.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    const tooltip = (this.state.isReadable) ? null : (<Tooltip id={this.props.tooltipId} />);
    return (
      <div className={WRAPPER} data-tip={this.tooltipText()} data-for={this.props.tooltipId}>
        <TextButton
          id={this.props.id}
          className={this.props.className}
          dataTestId={this.props.dataTestId}
          disabled={!this.state.isReadable}
          clickHandler={this.props.clickHandler}
          style={this.props.style}
          text={this.props.text} />
        {tooltip}
      </div>
    );
  }
}

TextReadButton.propTypes = {
  className: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
  dataTestId: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
  tooltipId: PropTypes.string.isRequired
};

TextReadButton.displayName = 'TextReadButton';

module.exports = TextReadButton;
