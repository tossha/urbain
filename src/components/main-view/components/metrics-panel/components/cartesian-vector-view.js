import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import VectorComponentView from "./vector-component-view";
import ExpandButton from "../../../../common/expand-button/index";
import "./cartesian-vector-view.scss";

class CartesianVectorView extends Component {
    static propTypes = {
        className: PropTypes.string,
        isExpanded: PropTypes.bool,
        vectorMagnitudeLabel: PropTypes.string.isRequired,
        dimension: PropTypes.string.isRequired,
    };

    static defaultProps = {
        isExpanded: false,
    };

    state = {
        isExpanded: this.props.isExpanded,
    };

    handleToggle = () => {
        this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }));
    };

    render() {
        const { isExpanded } = this.state;
        const { className, vectorMagnitudeLabel, dimension } = this.props;

        return (
            <div className={cn(className, "panel__field cartesian-vector-view")}>
                <div className="cartesian-vector-view__header">
                    <VectorComponentView
                        label={vectorMagnitudeLabel}
                        valueClassName="vec-magnitude"
                        dimension={dimension}
                    />
                    <ExpandButton
                        className="cartesian-vector-view__expand-button"
                        expanded={isExpanded}
                        onClick={this.handleToggle}
                    />
                </div>
                <div className={cn("cartesian-vector-view__vector-components", { hidden: !isExpanded })}>
                    <VectorComponentView label="x" valueClassName="vec-x" dimension={dimension} />
                    <VectorComponentView label="y" valueClassName="vec-y" dimension={dimension} />
                    <VectorComponentView label="z" valueClassName="vec-z" dimension={dimension} />
                </div>
            </div>
        );
    }
}

export default CartesianVectorView;
