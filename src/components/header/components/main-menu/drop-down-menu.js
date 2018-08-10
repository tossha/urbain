import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Consumer } from "../../../../store/index";
import DropDownMenuItem from "./drop-down-menu-item";
import "./drop-down-menu.css";

class DropDownMenu extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
        })).isRequired,
        onSelect: PropTypes.func,
    };

    state = {
        isOpen: false,
    };

    handleToggle = () => {
        this.setState(prevState => ({isOpen: !prevState.isOpen}));
    };

    handleSelect = (selectedItem) => {
        const {store, dispatch, text} = this.props;

        const dropDownMenuData = store.topMenu.find(item => item.label === text);
        dropDownMenuData.onSelect(selectedItem);

        dispatch(store);
        this.setState({isOpen: false});
    };

    render() {
        const {isOpen} = this.state;
        const {text, options} = this.props;
        const hasOptionsToShow = options.length > 0;

        return (
            <ul className={cn("drop-down-menu", {"drop-down-menu--open": isOpen})}>
                <li>
                    <span className="drop-down-menu__toggler" onClick={this.handleToggle}>
                        {text}{hasOptionsToShow && <FontAwesomeIcon className="drop-down-menu__caret" icon="chevron-down"/>}
                    </span>
                    {isOpen && hasOptionsToShow &&
                    <ul className="drop-down-menu__menu">
                        {options.map(({label, selected}) => <DropDownMenuItem key={label}
                                                                              selected={selected}
                                                                              text={label}
                                                                              onClick={this.handleSelect}/>)}
                    </ul>
                    }
                </li>
            </ul>
        )
    }
}

export default props => (
    <Consumer>
        {({store, dispatch}) => {
            const dropDownMenuData = store.topMenu.find(item => item.label === props.text);
            const options = dropDownMenuData ? dropDownMenuData.options : [];

            return <DropDownMenu
                {...props}
                store={store}
                dispatch={dispatch}
                options={options}/>;
            }
        }
    </Consumer>
)
