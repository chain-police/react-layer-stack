import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ACTIONS } from './reducer'

export const LayerStackMountPoint = (namespace = 'layer_stack') => connect(
  (store) => store[namespace],
  dispatch => bindActionCreators(ACTIONS, dispatch)
)(({ renderFn, // from props
  views, displaying, show, hide}) => { // from redux
  return (
    <div> { renderFn ? renderFn({views, displaying, show, hide})
      : (displaying.length ? displaying.map (
      (index) => <div key={index}>{ views[index]({index, show, hide, displaying, views}) }</div>
    )
      : <noscript />) }
    </div>
  )
});

export const Layer = (namespace = 'layer_stack') => connect(
  (store) => store[namespace],
  dispatch => bindActionCreators(ACTIONS, dispatch)
)((React.createClass({
  componentWillMount() {
    this.props.register(this.props.id, this.props.renderFn);
  },
  shouldComponentUpdate(newProps) {
    const { use, renderFn, register, id } = this.props;
    let needUpdate = false;
    if (id !== newProps.id) {
      needUpdate = true;
    }
    else if (renderFn.toString() !== newProps.renderFn.toString()) {
      needUpdate = true;
    }
    else if (use) {
      if (use.length !== newProps.use.length) {
        needUpdate = true;
      } else {
        let i = use.length;
        while (i--) {
          if (JSON.stringify(use[i]) !== JSON.stringify(newProps.use[i])) {
            needUpdate = true;
          }
        }
      }
    }

    if (needUpdate) {
      register(newProps.id, newProps.renderFn);
      return true;
    }
    return false;
  },

  componentWillUnmount() {
    // TODO: garbage collection
    // this.props.unregister(this.props.id)
  },

  render() {
    return <noscript />
  }
})));

export const LayerToggle = (namespace = 'layer_stack') => connect(
  (store) => store[namespace],
  dispatch => bindActionCreators(ACTIONS, dispatch)
)(({ renderFn, // from props
  displaying, show, hide, // from redux
}) => {
  return renderFn({ show, hide, displaying });
});