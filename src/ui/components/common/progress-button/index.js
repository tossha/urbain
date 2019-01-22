import React from "react";
import PropTypes from "prop-types";

import Button from "../button";
import "./index.scss";

const PreLoader = () => (
    <span className="pre-loader">
        <span className="pre-loader__circle pre-loader__circle--1" />
        <span className="pre-loader__circle pre-loader__circle--2" />
        <span className="pre-loader__circle pre-loader__circle--3" />
    </span>
);

class ProgressButton extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
        children: PropTypes.string.isRequired,
    };

    static defaultProps = {
        id: "",
        className: "",
        disabled: false,
    };

    state = {
        loading: false,
    };

    _handleClick = () => {
        if (this.state.loading) {
            return;
        }

        this.setState({
            loading: true,
        });

        return this.props.onClick().finally(() => {
            this.setState({
                loading: false,
            });
        });
    };

    render() {
        const { className, children, disabled, id } = this.props;

        return (
            <Button id={id} className={`progress-button ${className}`} disabled={disabled} onClick={this._handleClick}>
                {this.state.loading ? <PreLoader /> : children}
            </Button>
        );
    }
}

export default ProgressButton;
