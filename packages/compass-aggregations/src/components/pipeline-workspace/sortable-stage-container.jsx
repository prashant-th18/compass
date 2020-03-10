import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend'
import PropTypes from 'prop-types';

function makeDragSource(component) {
  const spec = {
    beginDrag: (props) => {
      return {
        index: props.index,
        stageOperator: props.stageOperator
      };
    }
  };

  const collect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  });

  return DragSource('stage', spec, collect)(component);
}

function makeDropTarget(component) {
  const spec = {
    hover(props, monitor, hoverComponent) {
      const fromIndex = monitor.getItem().index;
      const toIndex = props.index;

      if (fromIndex !== toIndex) {
        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(hoverComponent).getBoundingClientRect();
        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        // Dragging downwards
        if (fromIndex < toIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        // Dragging upwards
        if (fromIndex > toIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        monitor.getItem().index = toIndex;
        props.onMove(fromIndex, toIndex);
      }
    }
  };

  const collect = (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver()
    };
  };

  return DropTarget('stage', spec, collect)(component);
}

class SortableStageContainer extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isDragging: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onMove: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { connectDragPreview } = this.props
    if (connectDragPreview) {
      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true,
      })
    }
  }

  render() {
    const connectDragSource = this.props.connectDragSource;
    const connectDropTarget = this.props.connectDropTarget;

    return connectDragSource(
      connectDropTarget(
        <div>{this.props.children}</div>
      ));
  }
}

export default makeDragSource(makeDropTarget(SortableStageContainer));
