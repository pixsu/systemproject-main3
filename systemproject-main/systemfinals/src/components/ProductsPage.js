import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './components_css/productspagestyle.css';
import axios from 'axios';

import NavBar from './NavBar';
import ContactSection from './ContactSection';
import ScrollToTopButton from './ScrollToTopButton';
import FeedbackPage from './FeedbackPage';
import SizePopUpChart from './SizePopUpChart';

const ProductsPage = () => {
  // State variables to manage product data, category filters, search, cart, and other UI elements
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalItemsInCart, setTotalItemsInCart] = useState(0);
  const [uniformCount, setUniformCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const navigate = useNavigate();

  // Fetch products from the backend (MongoDB) on initial render
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        console.log('Fetched Products:', response.data); // Log fetched data for debugging
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on the selected category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Size chart modal state management
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const handleOpenSizeChart = () => {
    setIsSizeChartOpen(true);
  };

  const handleCloseSizeChart = () => {
    setIsSizeChartOpen(false);
  };

  // Set selected size for the chosen product
  const handleSizeClick = (id, size) => {
    setSelectedSize(size);

    // Update the product's selected size in the state
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id ? { ...product, selectedSize: size } : product
      )
    );

    if (selectedProduct) {
      setSelectedProduct(prev => ({ ...prev, selectedSize: size }));
    }
  };

  // Add selected product to the cart with validation on quantity and selected size
  const handleAddToCart = () => {
    const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage
    if (selectedProduct) {
      // Ensure size is selected if the product has size options
      if (selectedProduct.hasSizes && !selectedSize) {
        setCartMessage('Please select a size before adding to cart.');
        return;
      }

      // Retrieve the user's current cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

      // Check if the product with the chosen size is already in the cart
      const isProductInCart = existingCart.some(
        (item) =>
          item._id === selectedProduct._id &&
          (!selectedProduct.hasSizes || item.selectedSize === selectedSize)
      );

      if (isProductInCart) {
        setCartMessage('This item is already in your cart.');
        setTimeout(() => {
          setCartMessage('');
        }, 2000);
        return;
      }

      // Limit the number of uniforms to 2 per student
      const isUniform = selectedProduct.category !== 'merchandise';
      const newUniformCount = isUniform ? uniformCount + 1 : uniformCount;

      const cartItem = {
        ...selectedProduct,
        selectedSize,
        quantity,
      };

      if (isUniform && newUniformCount > 2) {
        setCartMessage('You can only add up to 2 uniforms.');
        return;
      }

      // Limit total items in cart to 5
      const newTotalItems = totalItemsInCart + 1;
      if (newTotalItems > 5) {
        setCartMessage('You can only add up to 5 items.');
        return;
      }

      // Update the cart and save it in localStorage
      const updatedCart = [...existingCart, cartItem];
      setCart(updatedCart);
      localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));

      // Update UI state
      setCartMessage('Added to cart!');
      setSelectedProduct(null);
      setSelectedSize();
      setQuantity(1);
      setTotalItemsInCart(newTotalItems);
      setUniformCount(newUniformCount);

      setTimeout(() => {
        setCartMessage('');
      }, 2000);
    }
  };

  // Display selected product in a modal with options for size and quantity
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedSize(null); // Reset size for new product selection
    setQuantity(1); // Reset quantity
  };

  // Close product modal
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      <NavBar />

      {/* Introduction section with size chart button */}
      <section className='introduction'>
        <h1>Wear your pride, embrace the blue!</h1>
        <p>Happy shopping! Enjoy exploring our collection and finding the perfect gear to showcase your Bulldog spirit!</p>
        <button className="size-chart-button" onClick={handleOpenSizeChart}>View Size Chart</button>
      </section>

      {/* Display size chart popup if open */}
      {isSizeChartOpen && <SizePopUpChart onClose={handleCloseSizeChart} />}

      <section>
        <div className="notice-section">
          <p> {/* Additional notices can go here */} </p>
        </div>
      </section>

      {/* Product listing section with category filters and search bar */}
      <section className="product-container">
        <h1 className="product-header">Products</h1>

        <div className="category-filter">
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
            <i className="fas fa-search search-icon"></i>
          </div>

          {/* Category filter buttons */}
          <button className={selectedCategory === 'all' ? 'selected' : ''} onClick={() => setSelectedCategory('all')}>All</button>
          <button className={selectedCategory === 'college' ? 'selected' : ''} onClick={() => setSelectedCategory('college')}>College</button>
          <button className={selectedCategory === 'senior high school' ? 'selected' : ''} onClick={() => setSelectedCategory('senior high school')}>Senior High School</button>
          <button className={selectedCategory === 'merchandise' ? 'selected' : ''} onClick={() => setSelectedCategory('merchandise')}>Merchandise</button>
        </div>

        {/* Display filtered products */}
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div className="individual-product" key={product._id}>
                <div className="image-wrapper" onClick={() => handleProductClick(product)}>
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    className="product-img"
                  />
                </div>
                <h2 className="product-name">{product.name}</h2>
                <p className="description-text">{product.description}</p>
                <div className="price-section">
                  <span className="price-label">PHP {product.price}</span>
                  {product.stock === 0 ? (
                    <span className="out-of-stock">Out of stock</span>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </section>

      {/* Display modal with product details if a product is selected */}
      {selectedProduct && (
        <div className="product-modal">
          <div className="modal-content">
            <div className="modal-image">
              <img src={`http://localhost:5000${selectedProduct.image}`} alt={selectedProduct.name} />
            </div>
            <div className="modal-info">
              <h2 className="product-name">{selectedProduct.name}</h2>
              <p className="description-text">{selectedProduct.description}</p>
              {selectedProduct.hasSizes && (
                <div className="modal-size-selection">
                  <label htmlFor="size">Select Size:</label>
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      className={`modal-size-option ${selectedProduct.selectedSize === size ? 'modal-size-selected' : ''}`}
                      onClick={() => handleSizeClick(selectedProduct.id, size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
              <div className="modal-price-section">
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#34408e' }}>
                  Price: PHP {selectedProduct.price.toFixed(2)}
                </span>
              </div>
              <div className="quantity-selection">
                <label htmlFor="quantity">Quantity:</label>
                {selectedProduct.hasSizes ? (
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max="2" // limit to 2 if the product has sizes
                    defaultValue={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    onKeyDown={(e) => e.preventDefault()} // disables typing
                  />
                ) : (
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max={Math.min(selectedProduct.stock, 5)} // max at 5, but consider stock limit
                    defaultValue={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    onKeyDown={(e) => e.preventDefault()} // disables typing
                  />
                )}
              </div>
              <p className='pnote'>
                Please note: Students can only avail up to 2 uniforms per student
                and a maximum of 5 items per transaction.
              </p>

              {selectedProduct.stock === 0 && (
                <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px', fontSize: '18px', textAlign: 'right' }}>
                  Out of Stock
                </p>
              )}

              <div className="button-container">
                <button
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                  disabled={selectedProduct.stock === 0} // Disable if out of stock
                >
                  Add to Cart
                </button>
                <button className="close-modal-button" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display cart message overlay */}
      {cartMessage && <div className="overlay">{cartMessage}</div>}

      {/* Include additional page components */}
      <FeedbackPage />
      <ContactSection setSelectedCategory={setSelectedCategory} />
      <ScrollToTopButton />
    </div>
  );
};

export default ProductsPage;
