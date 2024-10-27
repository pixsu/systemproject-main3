import React, { useState } from 'react';
import './components_css/sizepopupchartstyle.css'; 

const SizePopUpChart = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`size-popup-overlay ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="size-popup-content">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <h2>SIZE CHART</h2>
        <p>Here's a size guide to help you find the perfect fit for your shopping experience. Please refer to the measurements for each item to ensure a comfortable and accurate fit.</p>
        <div className="female-tables">
          <div className="size-chart-item">
            <div className="size-chart-title">Female Blouse</div>
            <table className="size-chart-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (inches)</th>
                  <th>Length (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>16</td>
                  <td>26</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>17</td>
                  <td>27</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>18</td>
                  <td>28</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>19</td>
                  <td>29</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="size-chart-item">
            <div className="size-chart-title">Female Pants</div>
            <table className="size-chart-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Waist (inches)</th>
                  <th>Height (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>25</td>
                  <td>37</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>26</td>
                  <td>38</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>28</td>
                  <td>39</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>30</td>
                  <td>40</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="size-chart-item">
            <div className="size-chart-title">Female Skirt</div>
            <table className="size-chart-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Waist (inches)</th>
                  <th>Height (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>25</td>
                  <td>30</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>26</td>
                  <td>31</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>28</td>
                  <td>32</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>30</td>
                  <td>33</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="size-chart-grid">
          <div className="size-chart-item">
            <div className="size-chart-title">Male Polo</div>
            <table className="size-chart-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (inches)</th>
                  <th>Length (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>17</td>
                  <td>27</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>18</td>
                  <td>28</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>19</td>
                  <td>29</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>20</td>
                  <td>30</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="size-chart-item">
            <div className="size-chart-title">Male Pants</div>
            <table className="size-chart-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Waist (inches)</th>
                  <th>Height (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>29</td>
                  <td>39</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>30</td>
                  <td>39.5</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>30</td>
                  <td>40</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>31</td>
                  <td>40.5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizePopUpChart;
