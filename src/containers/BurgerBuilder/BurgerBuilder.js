import React, { Component } from "react";
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import axios from '../../axios-orders';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
// import * as actionTypes from '../../store/actions/actionTypes';
import * as actions from '../../store/actions/index';


class BurgerBuilder extends Component {
    // constructor (props){
    //     super(props);
    //     this.state = {...};
    // }
    state = {
        purchasing: false,
        // loading: false,
        // error: false
    }

    componentDidMount () {
        // ****** for learning purpose ********
        // axios.get('https://react-my-burger-eab06-default-rtdb.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data});
        //     })
        //     .catch(error => {
        //         this.setState({error: true});
        //     });
        console.log(this.props);
        this.props.onInitIngredients();
    }

    updatePurchaseState (ingredients)  {
        const sum = Object.keys(ingredients)
            .map(igkey => {
                return ingredients[igkey];
            })
            .reduce((sum, el) => {
                return sum + el
            },0);
            return sum > 0;
    }

    // ****** for learning purpose ***************//
    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     }
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if(oldCount <= 0){
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     }
    //     updatedIngredients[type] = updatedCount;
    //     const pricDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - pricDeduction;
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // }

    purchaseHandler = () => {
        if(this.props.isAuthentcated){
            this.setState({purchasing: true});
        } else {
            this.props.setAuthRedirectPath('/checkout')
            this.props.history.push("/auth");
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
        // const queryParams = [];
        // for(let i in this.state.ingredients){
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: '?' + queryString
        // });
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;

        let burger = this.props.error ? <p>Ingredientscan't be loaded!</p> : <Spinner/>

        if (this.props.ings){
            burger = (
                <Aux>
                    <Burger ingredients = {this.props.ings}/>
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredienRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                        // price={this.state.totalPrice}/>
                        price={this.props.price}/>
                </Aux>
            );
            orderSummary = <OrderSummary 
            ingredients={this.props.ings}
            price={this.props.price}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>;
        }

        // if( this.state.loading){
        //     orderSummary = <Spinner/>;
        // }
        
        // {salad: true, meat: false, ...}
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}
const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.idToken !== null
    }
}

const mapDispatchToProps = dispatch => {
    // return {
    //     onIngredientAdded : (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
    //     onIngredienRemoved : (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    // }

       return {
        onIngredientAdded : (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredienRemoved : (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) =>dispatch(actions.setAuthRedirectPath(path))

    }

}
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));