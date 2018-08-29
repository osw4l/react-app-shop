import React from 'react'
import {Modal, Button, Col, Row, Table} from 'react-materialize';
import './FilterModal.css';
import DOMAIN from "../constants";
import axios from "axios/index";

export default class ModalNavbar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: this.props.show,
            purchase_url: `${DOMAIN}/api/shop/sales/`,
            purchases: [],
            current_purchase: {products:[]},
            show_modal_detail: false
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
    }

    componentWillMount() {
        this.getPurchases();
    }

    getPurchases() {
        axios.get(this.state.purchase_url, {})
            .then(res => {
                this.setState({
                    purchases: (res.data)
                });
            });
    }

    handleShow() {
        this.setState({show: true});
    }

    handleHide() {
        this.setState({show: false});
        setTimeout(()=> {
            this.props.handleModalCallback();
        }, 400);
    }

    render() {
        return (
            <div>
                <Modal
                    header='My purchases'
                    actions={
                        <Button onClick={this.handleHide}>
                            Close
                        </Button>
                    }
                    open={this.state.show}
                    className="expand-modal">
                    <Table>
                        <thead>
                            <tr>
                                <th data-field="created">
                                    created
                                </th>
                                <th data-field="items">
                                    products
                                </th>
                                <th data-field="total">
                                    total
                                </th>
                                <th data-field="actions">
                                    actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.purchases.map((purchase, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        {purchase.date}
                                    </td>
                                    <td>
                                        {purchase.products_count}
                                    </td>
                                    <td>
                                        $ {purchase.total}
                                    </td>
                                    <td>
                                        <button className="btn-2 btn-info"
                                        onClick={()=> {
                                            this.setState({
                                                current_purchase: purchase,
                                                show_modal_detail: true,
                                                show: false
                                            });
                                        }}>
                                            see detail <i className="fa fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </Modal>

                <Modal
                    header='Purchase detail'
                    actions={
                        <Button onClick={()=> {
                            this.getPurchases();
                            this.setState({
                                show_modal_detail: false,
                                show: true
                            });
                        }}>
                            Close
                        </Button>
                    }
                    open={this.state.show_modal_detail}
                    className="expand-modal">

                    <Row>
                        <Col m={4}>
                            <h3>
                                Total <span className="text-green">${this.state.current_purchase.total}</span>
                            </h3>
                            <h4>
                                Created <span className="text-green">{this.state.current_purchase.date}</span>
                            </h4>
                        </Col>
                        <Col m={8}>
                            <Table>
                                <thead>
                                    <tr>
                                        <th data-field="name">
                                            Name
                                        </th>
                                        <th data-field="price">
                                            price/item
                                        </th>
                                        <th data-field="quantity">
                                            quantity
                                        </th>
                                        <th data-field="total">
                                            total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.current_purchase.products.map((product, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {product.product_name}
                                            </td>
                                            <td>
                                                {product.price_item}
                                            </td>
                                            <td>
                                                {product.quantity}
                                            </td>
                                            <td>
                                                {product.total_item}
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                </Modal>

            </div>




        );
    }
}