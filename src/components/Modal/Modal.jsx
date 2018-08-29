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
            shop_url: `${DOMAIN}/api/shop/sales/`,
            shops: [],
            current_shop: {products:[]},
            show_modal_detail: false
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);
    }

    componentWillMount() {
        this.getShops();
    }

    getShops() {
        axios.get(this.state.shop_url, {})
            .then(res => {
                this.setState({
                    shops: (res.data)
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
                    header='My shops'
                    actions={
                        <Button onClick={this.handleHide}>
                            Cerrar
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
                                    *
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.shops.map((shop, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        {shop.date}
                                    </td>
                                    <td>
                                        {shop.products_count}
                                    </td>
                                    <td>
                                        $ {shop.total}
                                    </td>
                                    <td>
                                        <button className="btn-2 btn-info"
                                        onClick={()=> {
                                            this.setState({
                                                current_shop: shop,
                                                show_modal_detail: true,
                                                show: false
                                            });
                                        }}>
                                            view detail <i className="fa fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </Modal>

                <Modal
                    header='Shop detail'
                    actions={
                        <Button onClick={()=> {
                            this.getShops();
                            this.setState({
                                show_modal_detail: false,
                                show: true
                            });
                        }}>
                            Cerrar
                        </Button>
                    }
                    open={this.state.show_modal_detail}
                    className="expand-modal">

                    <Row>
                        <Col m={4}>
                            <h3>
                                Total <span className="text-green">${this.state.current_shop.total}</span>
                            </h3>
                            <h4>
                                Created <span className="text-green">{this.state.current_shop.date}</span>
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
                                {this.state.current_shop.products.map((product, index) => {
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