import React, {Component} from 'react'
import {Navbar, NavItem, Icon, Dropdown } from 'react-materialize';
import './CustomNavbar.css'
import ModalNavbar from '../Modal/Modal';
import axios from "axios/index";
import DOMAIN from "../constants";


export default class CustomNavbar extends Component {

    constructor() {
        super();
        this.state = {
            show_modal: false,
            user: localStorage.getItem('user')
        };
        this.showModal = this.showModal.bind(this);
        this.handleModalCallback = this.handleModalCallback.bind(this);
        this.Logout = this.Logout.bind(this);
    }

    showModal() {
        this.setState({
            show_modal: true
        });
    }

    handleModalCallback() {
        this.setState({
            show_modal: false
        });
    }

    Logout() {
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
        axios.post(`${DOMAIN}/rest-auth/logout/`, {})
            .then(res => {
                localStorage.clear();
                window.location.reload();
            })
            .catch(function (error) {

            });
    }


    render() {
        return (
            <div>
                {this.state.show_modal ? (
                    <ModalNavbar
                        handleModalCallback={this.handleModalCallback}
                        show={this.state.show_modal}
                    />
                ) : (
                    ''
                )
                }

                <Navbar className="blue darken-2 position-sticky"
                        brand='Shop'
                        right>

                    <NavItem onClick={this.showModal}>
                        <Icon>shopping_cart</Icon>
                    </NavItem>

                    <Dropdown className="expand-dropdown" trigger={
                        <a className="waves-effect waves-light btn pull-little-right red darken-1">
                            <i className="material-icons">more_horiz</i>
                        </a>
                    }>
                        <NavItem onClick={() => console.log('user')}>
                            <i className="material-icons">person</i> <strong>{this.state.user}</strong>
                        </NavItem>
                        <NavItem divider/>
                        <NavItem onClick={this.Logout}>
                            <i className="material-icons">fingerprint</i> Logout
                        </NavItem>
                    </Dropdown>
                </Navbar>
            </div>

        )
    }
}
