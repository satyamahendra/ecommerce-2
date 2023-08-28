import React, { useEffect, useState } from "react";

import CartContext from "./CartContext";

const CartContextProvider = ({ children }) => {
	const [toggleCart, setToggleCart] = useState(false);
	const [cartItems, setCartItems] = useState([]);

	useEffect(() => {
		fetch("http://localhost:8000/cart")
			.then((res) => res.json())
			.then((data) => setCartItems(data));
	}, []);

	const addToCart = (thisProduct) => {
		const isItemExist = cartItems.find((item) => item.id === thisProduct.id);

		if (isItemExist) {
			fetch(`http://localhost:8000/cart/${thisProduct.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(thisProduct),
			}).then((res) => {
				if (!res.ok) {
					console.log(res.status);
				} else {
					setCartItems((prev) =>
						prev.map((item) =>
							item.id === thisProduct.id
								? { ...item, quantity: item.quantity + thisProduct.quantity }
								: item
						)
					);
				}
			});
		} else {
			fetch("http://localhost:8000/cart", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(thisProduct),
			}).then((res) => {
				if (!res.ok) {
					console.log(res.status);
				} else {
					setCartItems((prev) => [...prev, thisProduct]);
				}
			});
		}
	};

	const removeFromCart = (id) => {
		fetch(`http://localhost:8000/cart/${id}`, {
			method: "DELETE",
		}).then((res) => {
			if (!res.ok) {
				console.log(res.status);
			} else {
				setCartItems((prev) => prev.filter((item) => item.id !== id));
			}
		});
	};

	return (
		<CartContext.Provider
			value={{
				toggleCart,
				setToggleCart,
				cartItems,
				addToCart,
				removeFromCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export default CartContextProvider;
