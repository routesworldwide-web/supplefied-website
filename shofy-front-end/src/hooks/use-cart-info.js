'use client';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getLineTotal } from "@/utils/pricing";

const useCartInfo = () => {
    const [quantity, setQuantity] = useState(0);
    const [ total, setTotal] = useState(0);
    const { cart_products, totalAmount, totalQuantity } = useSelector((state) => state.cart);

    useEffect(() => {
        if (typeof totalAmount === "number") {
            setQuantity(totalQuantity || 0);
            setTotal(totalAmount);
            return;
        }

        const cart = cart_products.reduce((cartTotal, cartItem) => {
            const { orderQuantity } = cartItem;
            const itemTotal = getLineTotal(cartItem);
            cartTotal.total += itemTotal
            cartTotal.quantity += orderQuantity

            return cartTotal;
        }, {
            total: 0,
            quantity: 0,
        })
        setQuantity(cart.quantity);
        setTotal(cart.total);
    }, [cart_products, totalAmount, totalQuantity])
    return {
        quantity,
        total,
        setTotal,
    }
}

export default useCartInfo;
