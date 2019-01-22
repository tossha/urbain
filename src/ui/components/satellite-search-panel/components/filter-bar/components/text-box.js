import React from "react";
import PropTypes from "prop-types";

class TextBox extends React.Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        placeholder: PropTypes.string.isRequired,
    };

    state = {
        value: "",
    };

    handleChange = ({ target: { value } }) => {
        this.setState({ value });
    };

    render() {
        const { value } = this.state;
        const { placeholder } = this.props;

        return <input type="text" placeholder={placeholder} value={value} onChange={this.handleChange} />;
    }
}

export default TextBox;
