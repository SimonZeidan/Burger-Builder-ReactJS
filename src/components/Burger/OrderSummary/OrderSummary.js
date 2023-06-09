import React, { Component } from "react";
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';


class OrderSummary extends Component {
    // This could be a functional component, doesn't have to be a class
    componentDidUpdate (){
        console.log('[OrderSummary] will update')
    }
    render(){
        const ingredientSummary = Object.keys(this.props.ingredients)
        .map(igkey =>{
            return (
            <li key={igkey}>
                <span style={{textTransform:'capitalize'}}>{igkey}</span>: {this.props.ingredients[igkey]}
            </li>);
        });
        return(
            <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
            <p>Continue to checkout?</p>
            <Button 
                btnType='Danger' 
                clicked={this.props.purchaseCancelled}>CANCEL</Button>
            <Button 
                btnType='Success' 
                clicked={this.props.purchaseContinued}>CONTINUE</Button>
        </Aux>
        );
    }
};

export default OrderSummary;