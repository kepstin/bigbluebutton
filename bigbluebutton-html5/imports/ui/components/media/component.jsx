import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import WebcamDraggableOverlay from './webcam-draggable-overlay/component';

import { styles } from './styles';

const propTypes = {
  children: PropTypes.element.isRequired,
  floatingOverlay: PropTypes.bool,
  hideOverlay: PropTypes.bool,
};

const defaultProps = {
  floatingOverlay: false,
  hideOverlay: true,
};


export default class Media extends Component {
  constructor(props) {
    super(props);
    this.refContainer = React.createRef();
  }

  componentWillUpdate() {
    window.dispatchEvent(new Event('resize'));
  }

  componentDidUpdate(prevProps) {
    const {
      userWasInWebcam,
      audioModalIsOpen,
      joinVideo,
    } = this.props;

    const {
      audioModalIsOpen: oldAudioModalIsOpen,
    } = prevProps;

    if ((!audioModalIsOpen && oldAudioModalIsOpen) && userWasInWebcam) {
      Session.set('userWasInWebcam', false);
      joinVideo();
    }
  }

  render() {
    const {
      swapLayout,
      floatingOverlay,
      hideOverlay,
      disableVideo,
      children,
      audioModalIsOpen,
    } = this.props;

    const contentClassName = cx({
      [styles.content]: true,
    });

    const overlayClassName = cx({
      [styles.overlay]: true,
      [styles.hideOverlay]: hideOverlay,
      [styles.floatingOverlay]: floatingOverlay,
    });

    return (
      <div
        id="container"
        className={cx(styles.container)}
        ref={this.refContainer}
      >
        <div className={!swapLayout ? contentClassName : overlayClassName}>
          {children}
        </div>
        <WebcamDraggableOverlay
          refMediaContainer={this.refContainer}
          swapLayout={swapLayout}
          floatingOverlay={floatingOverlay}
          hideOverlay={hideOverlay}
          disableVideo={disableVideo}
          audioModalIsOpen={audioModalIsOpen}
        />
      </div>
    );
  }
}

Media.propTypes = propTypes;
Media.defaultProps = defaultProps;
