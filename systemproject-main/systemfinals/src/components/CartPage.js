import React, { useState, useEffect } from 'react';
import './components_css/cartpagestyle.css';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, isSunday, format, min, max } from 'date-fns';

import NavBar from './NavBar';
import ContactSection from './ContactSection';
import ScrollToTopButton from './ScrollToTopButton';
import FeedbackPage from './FeedbackPage';
import ConfirmationModal from './ConfirmationModal';

import barcodeImage from '../imgs/barcode.png';
import ordersummlogo from '../imgs/websitelogo2.png';

const CartPage = () => {
  const [quantities, setQuantities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Fetch user details on component load
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5000/api/${userId}`);
        const data = await response.json();
        if (data.user) {
          const userCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
          setCartItems(userCart);
          setQuantities(userCart.map(item => item.quantity || 1)); // Dynamically set quantities based on cart
          setUser(data.user);
          localStorage.setItem('userDetails', JSON.stringify(data.user));
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  const [availableDate, setAvailableDate] = useState([
    { id: '1', date: 'October 28, 2024', slots: 25 },
    { id: '2', date: 'October 29, 2024', slots: 0 },
    { id: '3', date: 'October 30, 2024', slots: 25 },
    { id: '4', date: 'October 31, 2024', slots: 25 },
    { id: '5', date: 'November 1, 2024', slots: 25 },
  ]);

  // BAGO TO set kung anong month yung lalabas sa date picker
  const availablePickupDates = availableDate.map(({ date }) => new Date(date));
  const minDate = min(availablePickupDates);
  const maxDate = max(availablePickupDates);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalItems = () => quantities.reduce((sum, quantity) => sum + quantity, 0);
  // check if total quantity exceeds the limit
  const isLimitReached = () => totalItems() >= 5;

  const increaseQuantity = (index) => {
    setQuantities(prevQuantities => {
      const newQuantities = [...prevQuantities];
      const product = cartItems[index];
      const totalItemsInCart = newQuantities.reduce((acc, qty) => acc + qty, 0);

      // Check if the product is 'merchandise' and if quantity is within the allowed limit
      if (product.category === 'merchandise') {
        if (totalItemsInCart < 5) {
          // Ensure that the total items in the cart do not exceed 5
          if (newQuantities[index] < 5) {
            newQuantities[index] += 1;
          }
        }
      } else {
        // If the product has sizes, limit to 2, otherwise allow adding as long as total is below 5
        if (product.size) {
          if (newQuantities[index] < 2) {
            newQuantities[index] += 1;
          }
        } else {
          if (totalItemsInCart < 5) {
            newQuantities[index] += 1;
          }
        }
      }

      return newQuantities;
    });
  };

  const decreaseQuantity = (index) => {
    setQuantities(prevQuantities => {
      const newQuantities = [...prevQuantities];
      if (newQuantities[index] > 1) {
        newQuantities[index] -= 1;
      }
      return newQuantities;
    });
  };


  // delete button function
  const removeProduct = (index) => {
    const newCartItems = cartItems.filter((_, i) => i !== index);
    const newQuantities = quantities.filter((_, i) => i !== index);

    setCartItems(newCartItems);
    setQuantities(newQuantities);
    const userId = localStorage.getItem('userId');
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(newCartItems)); // Update localStorage per user
    }
  };

  // for footer
  const navigate = useNavigate();
  const setSelectedCategory = (category) => {
    navigate('/products', { state: { selectedCategory: category } });
  };

  // BAGO TOOOOOOOOO function to adjust slot availability
  const adjustSlotAvailability = () => {
    if (!selectedDate) return;

    setAvailableDate((prevAvailableDates) =>
      prevAvailableDates.map((date) => {
        if (date.date === format(selectedDate, 'MMMM d, yyyy') && date.slots > 0) {
          return { ...date, slots: date.slots - 1 };
        }
        return date;
      })
    );
  };

  // generate pdf function
  const generatePDF = (orderId) => {
    const doc = new jsPDF();

    const margin = 20.0;
    const lineSpacing = 10;

    const img = new Image();
    img.src = ordersummlogo;

    img.onload = function () {
      const logoWidth = img.width / 4;
      const logoHeight = img.height / 4;

      // logo
      const logoXPosition = margin;
      doc.addImage(img, 'PNG', logoXPosition, margin, logoWidth, logoHeight);

      const headerXPosition = doc.internal.pageSize.getWidth() - margin;

      // header
      doc.setFont(undefined, 'bold');
      doc.setTextColor(61, 59, 146);
      doc.setFontSize(20);
      const headerText = 'Bulldogs Exchange';
      const headerTextWidth = doc.getTextWidth(headerText);
      doc.text(headerText, headerXPosition - headerTextWidth, margin + (logoHeight / 2) + 5);

      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      const orderSummaryText = 'Order Summary';
      const orderSummaryTextWidth = doc.getTextWidth(orderSummaryText);
      doc.text(orderSummaryText, headerXPosition - orderSummaryTextWidth, margin + (logoHeight / 2) + 15);

      const lineSpacingAfterTitle = 10;
      doc.line(margin, margin + (logoHeight / 2) + 10 + lineSpacingAfterTitle, 210 - margin, margin + (logoHeight / 2) + 10 + lineSpacingAfterTitle);

      const formattedDate = selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Not selected'; // Format the date

      // user info
      let currentYPosition = margin + (logoHeight / 2) + 20 + lineSpacingAfterTitle;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`Name: ${user ? `${user.firstName} ${user.lastName}` : 'User'}`, margin, currentYPosition);
      currentYPosition += lineSpacing;
      doc.text(`Items: ${totalItems()}`, margin, currentYPosition);
      currentYPosition += lineSpacing;
      doc.text(`Pickup Date: ${formattedDate}`, margin, currentYPosition);

      currentYPosition += lineSpacing;
      doc.line(margin, currentYPosition, 210 - margin, currentYPosition);
      currentYPosition += lineSpacing;

      // products purchased
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Products:', margin, currentYPosition);

      currentYPosition += lineSpacing;

      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      cartItems.forEach((product, index) => {
        const productYPosition = currentYPosition + index * (lineSpacing - 2);
        doc.text(`${index + 1}. ${product.name}. (${product.selectedSize})`, margin, productYPosition);

        const priceXPosition = 210 - margin;
        doc.text(
          `PHP ${product.price} x ${quantities[index]} = PHP ${quantities[index] * product.price}`,
          priceXPosition,
          productYPosition,
          { align: 'right' }
        );
      });

      const totalYPosition = currentYPosition + cartItems.length * (lineSpacing - 2);
      doc.line(margin, totalYPosition + 5, 210 - margin, totalYPosition + 5);

      const totalPrice = quantities.reduce(
        (sum, quantity, index) => sum + quantity * cartItems[index].price,
        0
      );

      // total price
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`Total Price: PHP ${totalPrice}`, 210 - margin, totalYPosition + 10, { align: 'right' });

      // barcode pic
      const pageWidth = doc.internal.pageSize.getWidth();
      const barcodeWidth = pageWidth - 2 * margin;
      const barcodeHeight = (10 / 50) * barcodeWidth;

      currentYPosition = totalYPosition + 20;
      doc.addImage(barcodeImage, 'PNG', margin, currentYPosition, barcodeWidth, barcodeHeight);

      currentYPosition += barcodeHeight + 5;

      const orderIdXPosition = doc.internal.pageSize.getWidth() / 2;
      doc.setFontSize(10);

      // get orderID
      doc.text(`${orderId}`, orderIdXPosition, currentYPosition, { align: 'center' });

      currentYPosition += lineSpacing - 5;

      // footer
      const thankYouMessage =
        'Thank you for your purchase! Please present this along with your school ID to the cashier when you come to pick up your order.';
      const messageXPosition = doc.internal.pageSize.getWidth() / 2;
      const pageHeight = doc.internal.pageSize.getHeight();
      const footerYPosition = pageHeight - 20;

      doc.setFontSize(8);
      doc.text(thankYouMessage, messageXPosition, footerYPosition, {
        align: 'center',
        baseline: 'middle',
      });

      // show orderId sa file name
      const fileName = `Order_${orderId}_${user ? user.lastName : 'User'}.pdf`; // Set user name dynamically
      doc.save(fileName);
      setQuantities([]);
      setCartItems([]);
    };
  };

  const handleCheckout = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify([])); // Clear the cart in localStorage
    }

    generatePDF();
    adjustSlotAvailability();
    setIsModalOpen(false);
    setQuantities([]);
    setCartItems([]);
  };


  // function to check if the date is valid (not a Sunday and at least 10 days from today)
  // filters the dates to disable those with zero slots
  const isDateValid = (date) => {
    const today = new Date();
    const maxDate = addDays(today, 6);
    const formattedDate = format(date, 'MMMM d, yyyy');

    return (
      date >= today &&
      date <= maxDate &&
      !isSunday(date) &&
      availableDate.some((d) => d.date === formattedDate && d.slots > 0)
    );
  };


  return (
    <div>
      <NavBar />
      <div className='carttop'>
        <h1>Cart Summary</h1>
        <p>We take extra care to ensure your products are safely packaged and securely shipped, so they arrive fresh and in perfect condition every time!</p>
      </div>

      <section>
        <div className="notice-section">
          <p>
            Pickup Reminder: If you miss your pickup date, you can collect your order on another date, provided the items are in stock. Thank you!
          </p>
        </div>
      </section>

      <div className='cart-page'>
        {cartItems.length === 0 ? (
          // if cart is empty
          <div className='empty-cart'>
            <h2>Cart is empty</h2>
            <p>Your cart is currently empty. Browse our products and add items to your cart.</p>
            <button onClick={() => navigate('/products')} className="browse-button">
              Browse Products
            </button>
          </div>
        ) : (
          <div className='productsadded'>
            <div className='productsaddedheader'>
              <p>Product</p>
              <p>Selling Price</p>
              <p>Quantity</p>
              <p>Price</p>
            </div>

            {/* products list mapping */}
            {cartItems.map((item, index) => (
              <div className='individualproducts' key={index}>
                <div className='productimagename'>
                  <img src={`http://localhost:5000${item.image}`} alt={item.name} />
                  <p>{item.name}</p>
                </div>
                <p>PHP {item.price}</p>
                <div className='quantity-control'>
                  <button onClick={() => decreaseQuantity(index)} aria-label="Decrease quantity">
                    <i className="fas fa-minus"></i>
                  </button>
                  <p>{quantities[index]}</p>
                  <button onClick={() => increaseQuantity(index)} aria-label="Increase quantity">
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <p>PHP {quantities[index] * item.price}</p>
                <button className="delete-button" onClick={() => removeProduct(index)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className='ordersummary'>
          <h1>Order Summary</h1>
          <div className='summary-item'>
            <p>Name:</p>
            <p className='userinfovalue'>{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</p>
          </div>
          <div className='summary-item'>
            <p>Items:</p>
            <p className='userinfovalue'>{totalItems()}</p>
          </div>
          <div className='summary-item'>
            <p>Pickup Date:</p>
            {cartItems.length > 0 ? (
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                filterDate={isDateValid}
                placeholderText="Select pickup date"
                dateFormat="MMMM d, yyyy"
                minDate={minDate}
                maxDate={maxDate}
                className="react-datepicker__input"
                required
              />
            ) : (
              <p></p>
            )}
          </div>
          <hr />

          <div className='summary-item'>
            <p>Payment Method:</p>
            <p className='userinfovalue'>Over-the-Counter</p>
          </div>

          <div className='total-price'>
            <p>Total Price:</p>
            <p>PHP {cartItems.reduce((total, item, index) => total + item.price * quantities[index], 0)}</p>
          </div>

          {cartItems.length > 0 && (
            <button className='checkoutbutton'
              onClick={() => {
                if (!selectedDate) {
                  alert("Please select a pickup date before proceeding.");
                } else {
                  setIsModalOpen(true);
                }
              }}
              disabled={!selectedDate} // disable the button if no date is selected
            >
              Proceed To Checkout
            </button>
          )}
        </div>

        {/* for pop up window, checkout validation */}
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleCheckout}
        />

      </div>

      <FeedbackPage />
      <ContactSection setSelectedCategory={setSelectedCategory} />
      <ScrollToTopButton />
    </div>
  );
};

export default CartPage;