import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Navbar = ({ onSelectCategory }) => {

    const getInitialTheme = () => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme ? storedTheme : "light-theme";
    };

    const [selectedCategory, setSelectedCategory] = useState("");
    const [theme, setTheme] = useState(getInitialTheme());
    const [input, setInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const navbarRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                navbarRef.current &&
                !navbarRef.current.contains(event.target)
            ) {
                setIsNavCollapsed(true);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fetch initial products
    const fetchInitialData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await api.get("/api/products");

            console.log(response.data, "navbar initial data");

        } catch (error) {
            console.error("Error fetching initial data:", error);

            if (error.response?.status === 401 ||
                error.response?.status === 403) {

                console.log("User is not authenticated.");
            }
        }
    };

    // Toggle navbar
    const handleNavbarToggle = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };

    // Close navbar
    const handleLinkClick = () => {
        setIsNavCollapsed(true);
    };

    // Update search input
    const handleInputChange = (value) => {
        setInput(value);
    };

    // Search products
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (input.trim() === "") {
            return;
        }

        setShowNoProductsMessage(false);
        setNoResults(false);
        setIsLoading(true);
        setIsNavCollapsed(true);

        try {
            const response = await api.get(
                `/api/products/search?keyword=${encodeURIComponent(input)}`
            );

            setSearchResults(response.data);

            if (response.data.length === 0) {

                setNoResults(true);
                setShowNoProductsMessage(true);

            } else {

                navigate("/search-results", {
                    state: {
                        searchData: response.data
                    }
                });
            }

            console.log("Search results:", response.data);

        } catch (error) {

            console.error("Error searching:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                console.log("User is not authenticated.");
            }

            setShowNoProductsMessage(true);

        } finally {

            setIsLoading(false);
        }
    };

    // Category selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);

        if (onSelectCategory) {
            onSelectCategory(category);
        }

        setIsNavCollapsed(true);
    };

    // Theme toggle
    const toggleTheme = () => {

        const newTheme =
            theme === "dark-theme"
                ? "light-theme"
                : "dark-theme";

        setTheme(newTheme);

        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const categories = [
        "Laptop",
        "Headphone",
        "Mobile",
        "Electronics",
        "Toys",
        "Fashion",
        "Other",
    ];

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");

        navigate("/login");

        handleLinkClick();
    };

    return (
        <nav
            className="navbar navbar-expand-lg fixed-top bg-white shadow-sm"
            ref={navbarRef}
        >

            <div className="container-fluid">

                {/* Brand */}
                <a className="navbar-brand" href="/">
                    <b>TechCart</b>
                </a>

                {/* Mobile navbar button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={handleNavbarToggle}
                    aria-controls="navbarSupportedContent"
                    aria-expanded={!isNavCollapsed}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar content */}
                <div
                    className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
                    id="navbarSupportedContent"
                >

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        {/* Home */}
                        <li className="nav-item">
                            <a
                                className="nav-link active"
                                aria-current="page"
                                href="/"
                                onClick={handleLinkClick}
                            >
                                Home
                            </a>
                        </li>

                        {/* Add Product */}
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="/add_product"
                                onClick={handleLinkClick}
                            >
                                Add Product
                            </a>
                        </li>

                        {/* Categories */}
                        {/*
                        <li className="nav-item dropdown">

                            <a
                                className="nav-link dropdown-toggle"
                                href="/"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Categories
                            </a>

                            <ul className="dropdown-menu">

                                {categories.map((category) => (
                                    <li key={category}>

                                        <button
                                            className="dropdown-item"
                                            onClick={() =>
                                                handleCategorySelect(category)
                                            }
                                        >
                                            {category}
                                        </button>

                                    </li>
                                ))}

                            </ul>

                        </li>
                        */}

                        {/* Ask AI */}
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="/askai"
                                onClick={handleLinkClick}
                            >
                                Ask AI
                            </a>
                        </li>

                        {/* Orders */}
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="/orders"
                                onClick={handleLinkClick}
                            >
                                Orders
                            </a>
                        </li>

                    </ul>

                    {/* Right side */}
                    <div className="d-flex align-items-center">

                        {/* Login / Logout */}
                        {localStorage.getItem("token") ? (

                            <button
                                className="btn btn-outline-danger btn-sm me-3"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        ) : (

                            <a
                                href="/login"
                                className="nav-link text-dark me-3"
                                onClick={handleLinkClick}
                            >
                                Login
                            </a>

                        )}

                        {/* Cart */}
                        <a
                            href="/cart"
                            className="nav-link text-dark me-3"
                            onClick={handleLinkClick}
                        >
                            <i className="bi bi-cart me-1"></i>
                            Cart
                        </a>

                        {/* Search */}
                        <form
                            className="d-flex"
                            role="search"
                            onSubmit={handleSubmit}
                            id="searchForm"
                        >

                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="type to search"
                                aria-label="Search"
                                value={input}
                                onChange={(e) =>
                                    handleInputChange(e.target.value)
                                }
                            />

                            {isLoading ? (

                                <button
                                    className="btn btn-outline-success"
                                    type="button"
                                    disabled
                                >

                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>

                                    <span className="visually-hidden">
                                        Loading...
                                    </span>

                                </button>

                            ) : (

                                <button
                                    className="btn btn-outline-success"
                                    type="submit"
                                >
                                    Search
                                </button>

                            )}

                        </form>

                        {/* No products message */}
                        {showNoProductsMessage && (

                            <div
                                className="alert alert-warning position-absolute mt-2"
                                style={{
                                    top: "100%",
                                    zIndex: 1000
                                }}
                            >
                                No products found matching your search.
                            </div>

                        )}

                    </div>

                </div>

            </div>

        </nav>
    );
};

export default Navbar;

