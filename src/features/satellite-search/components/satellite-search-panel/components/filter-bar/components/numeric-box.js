import React from "react";
import PropTypes from "prop-types";

class TextBox extends React.Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
    };

    state = {
        value: "",
    };

    handleChange = ({ target: { value } }) => {
        this.setState({ value });
    };

    render() {
        const { value } = this.state;

        return <input type="numeric" value={value} onChange={this.handleChange} />;
    }
}

export default TextBox;
