import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
//import './CSS/Modal.css'

export default class Modal extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        if (!this.props.show) {
            return null;
        }
        return ReactDOM.createPortal(
            <div className="modal" id="modal">
                <div className="content">
                    <p>{this.props.children}</p>
                </div>
                <div className="actions">
                    <button className="toggle-button" onClick={ this.props.onConfirm }>
                        Yes!
                    </button>
                    <button className="toggle-button" onClick={ this.props.onDeny }>
                        No!
                    </button>
                </div>
            </div>,
            document.getElementById('modal-root')
        );
    }
}

Modal.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onDeny: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
}