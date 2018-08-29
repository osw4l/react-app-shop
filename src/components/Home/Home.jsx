import React, {Component} from 'react'
import {Col, Row, Table} from 'react-materialize';
import axios from "axios/index";
import './Home.css';
import DOMAIN from "../constants";
import SweetAlert from 'sweetalert-react';


export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            purchase_url: `${DOMAIN}/api/shop/sales/`,
            categories_url: `${DOMAIN}/api/shop/categories/`,
            categories: [],
            products_url: `${DOMAIN}/api/shop/products/`,
            products: [],
            items: [],
            total: '0',
            show_alert_success_send: false,
            show_alert_stock_empty: false
        };
        axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
    }

    componentWillMount() {
        this.getCategories();
        this.getProducts();
    }

    getCategories() {
        axios.get(this.state.categories_url, {})
            .then(res => {
                this.setState({
                    categories: (res.data)
                });
            });
    }

    getProducts() {
        axios.get(this.state.products_url, {})
            .then(res => {
                let products = res.data;
                let data = [];
                for (let item in products) {
                    if (data[products[item].id] === undefined) {
                        data[products[item].id] = products[item];
                    }
                }
                this.setState({
                    products: data
                });
            });
    }

    onFilterByCategory(id){
        axios.get(`${DOMAIN}/api/shopping_cart/categories/${id}/products/`, {})
            .then(res => {
                let products = res.data;
                let data = [];
                for (let item in products) {
                    if (data[products[item].id] === undefined) {
                        data[products[item].id] = products[item];
                    }
                }
                this.setState({
                    products: data
                });
            });
    }

    setData(products, items) {
        this.setState({
            products: products,
            items: items
        }, () => {
            this.onCalculateTotal()
        });
    }

    onAddToCart(id) {
        let dataset = this.state.products;
        let shopping_cart = this.state.items;

        if (dataset[id].stock > 0) {
            if (shopping_cart[id] === undefined) {
                shopping_cart[id] = {
                    id: dataset[id].id,
                    name: dataset[id].name,
                    price: dataset[id].price,
                    items: 0
                };
            }
            shopping_cart[id].items += 1;
            dataset[id].stock -= 1;
        } else {
            this.setState({
                show_alert_stock_empty: true
            });
        }

        this.setData(
            dataset,
            shopping_cart
        );

    }

    onClickRemove(id) {
        let dataset = this.state.products;
        let shopping_cart = this.state.items;

        shopping_cart[id].items -= 1;
        dataset[id].stock += 1;

        if (shopping_cart[id].items === 0) {
            delete shopping_cart[id];
        }

        this.setData(
            dataset,
            shopping_cart
        );
    }

    onClickDelete(id) {
        let dataset = this.state.products;
        let shopping_cart = this.state.items;

        dataset[id].stock += shopping_cart[id].items;

        delete shopping_cart[id];

        this.setData(
            dataset,
            shopping_cart
        );
    }

    humanize = (value) => {
        value = value.substring(0, value.length);
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    onCalculateTotal() {
        let total = 0;
        let shopping_cart = this.state.items;
        for (let item in shopping_cart){
            total += (shopping_cart[item].price * shopping_cart[item].items);
        }

        this.setState({
            total: this.humanize(`${total}`)
        });
    }

    sendPurchase() {
        axios.post(this.state.purchase_url, this.state.items)
            .then(res => {
                this.setState({
                    items: [],
                    total: '0',
                    show_alert_success_send: true
                });
                this.getProducts();
            })
            .catch(error => {

            });
    }

    render() {
        return (
            <div>
                { /* ALERTS */ }
                <SweetAlert
                    show={this.state.show_alert_success_send}
                    type="success"
                    title="Data send successfully"
                    text="your sell was created successfully"
                    onConfirm={() => this.setState({ show_alert_success_send: false })}
                />
                <SweetAlert
                    show={this.state.show_alert_stock_empty}
                    type="error"
                    title="insufficient items"
                    text="this products has 0 items"
                    onConfirm={() => this.setState({ show_alert_stock_empty: false })}
                />
                <Row className="pull-bottom-20p">
                    <Col m={1}>
                        <button
                            className="btn-2 btn-success pull-right"
                            onClick={this.getProducts.bind(this)}>
                            All products
                        </button>
                    </Col>
                        {this.state.categories.map((category, index) => {
                            return (
                                <Col m={1}
                                     key={index}>
                                    <button
                                        className="btn-2 btn-info pull-left"
                                        onClick={this.onFilterByCategory.bind(this, category.id)}>
                                        {category.name}
                                    </button>
                                </Col>
                            )
                        })}

                </Row>
                <Row>
                    <Col m={7}>
                        <Row>
                            {this.state.products.map((product, index) => {
                                return (
                                    <Col m={4}
                                         key={index}>
                                        <div className="card">
                                            <div className="card-image">
                                                <img src={product.link_cover} alt={product.name} />
                                                <span className="card-title">{product.name}</span>
                                            </div>
                                            <div className="card-content">
                                                <p>
                                                    $ {product.end_price}
                                                </p>
                                                <p>
                                                    {product.category_name}
                                                </p>
                                                <p>
                                                    Available <strong className={(product.stock > 0 ? 'text-green' : 'text-red')}>{product.stock}</strong>
                                                </p>

                                            </div>
                                            <div className="card-action">
                                                <button onClick={this.onAddToCart.bind(
                                                    this,
                                                    product.id
                                                )} className="waves-effect waves-light btn">
                                                    <span>buy</span>
                                                    <span>&nbsp;&nbsp;</span>
                                                    <i className="fa fa-shopping-cart"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </Col>
                                )
                            })}
                        </Row>
                    </Col>

                    <Col m={5}>
                        <Row>
                            <Col m={8}>
                                <h2 className="green-text text-light-green ">
                                    $ {this.state.total}
                                </h2>
                            </Col>
                            {this.state.total !== "0" &&
                                <Col m={4}>
                                    <button onClick={this.sendPurchase.bind(this)}
                                            className="btn-floating btn-login shopping_cart-button btn-float btn-large waves-effect waves-light green pulse"
                                            type="submit"
                                            name="action">
                                        <i className="material-icons">send</i>
                                    </button>
                                </Col>
                            }
                        </Row>
                        <Table>
                            <thead>
                                <tr>
                                    <th data-field="name">
                                        Name
                                    </th>
                                    <th data-field="price">
                                        $
                                    </th>
                                    <th data-field="quantity">
                                        #
                                    </th>
                                    <th data-field="actions">
                                        *
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.items.map((item, index) => {
                                return (
                                    <tr key={index} tabIndex={index}>
                                        <td>
                                            {item.name}
                                        </td>
                                        <td>
                                            {this.humanize(`${item.price * item.items}`)}
                                        </td>
                                        <td>
                                            {item.items}
                                        </td>
                                        <td>
                                            <button
                                                onClick={this.onAddToCart.bind(this, item.id)}
                                                className="btn-2 btn-success btn-xs" type="submit" name="action">
                                                <i className="fa fa-plus"></i>
                                            </button>
                                            <button
                                                onClick={this.onClickRemove.bind(this, item.id)}
                                                className="btn-2 btn-warning btn-xs" type="submit" name="action">
                                                <i className="fa fa-minus"></i>
                                            </button>
                                            <button
                                                onClick={this.onClickDelete.bind(this, item.id)}
                                                className="btn-2 btn-danger btn-xs" type="submit" name="action">
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        )
    }
}
