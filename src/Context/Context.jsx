import { useState, useEffect, createContext } from "react";
import api from "../api";

const AppContext = createContext({
    data: [],
    isError: "",
    cart: [],
    addToCart: (product) => {},
    removeFromCart: (productId) => {},
    refreshData: () => {},
    updateStockQuantity: (productId, newQuantity) => {},
    clearCart: () => {}
});

export const AppProvider = ({ children }) => {

    const [data, setData] = useState([]);
    const [isError, setIsError] = useState("");

    const [cart, setCart] = useState(
        JSON.parse(localStorage.getItem("cart")) || []
    );

    // =========================
    // ADD TO CART
    // =========================
    const addToCart = (product) => {

        const existingProductIndex = cart.findIndex(
            (item) => item.id === product.id
        );

        if (existingProductIndex !== -1) {

            const updatedCart = cart.map((item, index) =>
                index === existingProductIndex
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            );

            setCart(updatedCart);

            localStorage.setItem(
                "cart",
                JSON.stringify(updatedCart)
            );

        } else {

            const updatedCart = [
                ...cart,
                {
                    ...product,
                    quantity: 1
                }
            ];

            setCart(updatedCart);

            localStorage.setItem(
                "cart",
                JSON.stringify(updatedCart)
            );
        }
    };

    // =========================
    // REMOVE FROM CART
    // =========================
    const removeFromCart = (productId) => {

        console.log("productID", productId);

        const updatedCart = cart.filter(
            (item) => item.id !== productId
        );

        setCart(updatedCart);

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );

        console.log("CART", updatedCart);
    };

    // =========================
    // FETCH PRODUCTS
    // =========================
    const refreshData = async () => {

        const token = localStorage.getItem("token");
        if (!token) {
            setData([]);
            setIsError("");
            return;
        }

        try {

            const response = await api.get("/api/products");

            console.log("Products:", response.data);

            setData(response.data);

            setIsError("");

        } catch (error) {

            console.error(
                "Backend connection error:",
                error
            );

            if (error.response?.status === 401) {
                setIsError("Unauthorized. Please login.");
            }
            else if (error.response?.status === 403) {
                setIsError("Access denied. Please login.");
            }
            else {
                setIsError(error.message);
            }
        }
    };

    // =========================
    // CLEAR CART
    // =========================
    const clearCart = () => {
        setCart([]);
    };

    // =========================
    // FETCH PRODUCTS ON LOAD
    // =========================
    useEffect(() => {
        refreshData();
    }, []);

    // =========================
    // SAVE CART
    // =========================
    useEffect(() => {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }, [cart]);

    return (
        <AppContext.Provider
            value={{
                data,
                isError,
                cart,
                addToCart,
                removeFromCart,
                refreshData,
                clearCart
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;

