import React from "react";
import BurgerLogo from '../../assests/images/burger-logo.png';
import classes from './Logo.css';


const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={BurgerLogo} alt="MyBurger"/>
    </div>
);


export default logo;