
var transactionsData = []
document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault(); // prevent form submission

    // Collect form data
    var itemName = document.getElementById('item-name').value;
    var itemCategory = document.getElementById('item-category').value;
    var quantity = document.getElementById('quantity').value;
    var unit = document.getElementById('unit').value;
    var unitNumber = document.getElementById('unitNumber').value; // Numeric value for unit
    var pricePerUnit = document.getElementById('price-per-unit').value;
    var totalPrice = document.getElementById('total-price').value;
    var store = document.getElementById('store').value;
    var storeLocation = document.getElementById('store-location').value;
    var purchaseDate = document.getElementById('purchase-date').value;

    var transactionData = {
        item_name: itemName,
        category: itemCategory,
        unit: `${unitNumber} ${unit}`,
        store: store,
        quantity: quantity,
        total_price: totalPrice,
        price_per_unit:pricePerUnit,
        date: purchaseDate,
        location_stored: storeLocation
    };

    // Add the order data to the global array
    transactionsData.push(transactionData);

    // Create a new order item
    // Create a new order item
    var orderItem = document.createElement('div');
    orderItem.classList.add('dashboard-item');
    orderItem.innerHTML = `
        <h2>${itemName}</h2>
        <p><strong>Item Category:</strong> ${itemCategory}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Unit:</strong> ${unit} ${unitNumber}</p>
        <p><strong>Price per Unit:</strong> ${pricePerUnit}</p>
        <p><strong>Total Price:</strong> ${totalPrice}</p>
        <p><strong>Store:</strong> ${store}</p>
        <p><strong>Store Location:</strong> ${storeLocation}</p>
        <p><strong>Purchase Date:</strong> ${purchaseDate}</p>
        <button class="delete-button">Delete</button> <!-- Delete button -->
    `;

    // Append the new order item to the dashboard
    document.getElementById('orders').appendChild(orderItem);

    // Clear the form fields
    document.getElementById('transaction-form').reset();
    var selectizeCategory = $('#item-category')[0].selectize;
    var selectizeStore = $('#store')[0].selectize;
    selectizeCategory.clear();
    selectizeStore.clear();

    // Add event listener to the delete button
    var deleteButton = orderItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', function() {
        // Remove the dashboard item from the DOM
        orderItem.remove();

        // Find the corresponding order data index in transactionsData array
        var itemNameToDelete = itemName; // Capture the current itemName
        var itemCategoryToDelete = itemCategory; // Capture the current itemCategory

        var index = transactionsData.findIndex(function(order) {
            return order.category === itemCategoryToDelete && order.item_name === itemNameToDelete;
        });

        // Remove the corresponding order data from the global array if found
        if (index !== -1) {
            transactionsData.splice(index, 1);
        }
    });


});


function fetchAllCategories() {
    fetch('http://127.0.0.1:5000/categories')
        .then(response => response.json())
        .then(data => {
            const selectElement = $('#item-category');
            data.forEach(category => {
                const option = $('<option>').val(category.category_name).text(category.category_name);
                selectElement.append(option);
            });
            // Initialize selectize after options are added
            $('#item-category').selectize({
                create: true,
                sortField: 'text',
                onOptionAdd: function(value, $item) {
                    // value will be null if a new option is created
                    console.log(`New option added with value: ${value}`);
                        // Get the newly created partner's data
                        const newCategoryName = this.options[value].text;
                        // Send the new partner's data to the backend for creation
                        console.log(`Adding option: ${value}`);
                        addNewCategory({category_name: newCategoryName});
                        
                    
                }
            });
        })
        .catch(error => console.error('Error fetching partners:', error));
}

function fetchAllStores() {
    fetch('http://127.0.0.1:5000/stores')
        .then(response => response.json())
        .then(data => {
            const selectElement = $('#store');
            data.forEach(store => {
                const option = $('<option>').val(store.store_name).text(store.store_name);
                selectElement.append(option);
            });
            // Initialize selectize after options are added
            $('#store').selectize({
                create: true,
                sortField: 'text',
                onOptionAdd: function(value, $item) {
                    // value will be null if a new option is created
                    console.log(`New option added with value: ${value}`);
                        // Get the newly created partner's data
                        const newStoreName = this.options[value].text;
                        // Send the new partner's data to the backend for creation
                        console.log(`Adding option: ${value}`);
                        addNewStore({store_name: newStoreName});
                        
                    
                }
            });
        })
        .catch(error => console.error('Error fetching partners:', error));
}


function addNewCategory(partnerData) {
    $.ajax({
        url: 'http://127.0.0.1:5000/category-add', // Endpoint to add new partner
        type: 'POST', // POST request to add data
        contentType: 'application/json', // Specify content type as JSON
        data: JSON.stringify(partnerData), // Convert data to JSON string
        success: function(response) {
            // Handle success
            fetchAllCategories()
            console.log('New partner added successfully:', response);
        },
        error: function(xhr, status, error) {
            // Handle error
            console.error('Error adding new partner:', error);
        }
    });
}

function addNewStore(storeData) {
    $.ajax({
        url: 'http://127.0.0.1:5000/store-add', // Endpoint to add new partner
        type: 'POST', // POST request to add data
        contentType: 'application/json', // Specify content type as JSON
        data: JSON.stringify(storeData), // Convert data to JSON string
        success: function(response) {
            // Handle success
            fetchAllStores()
            console.log('New partner added successfully:', response);
        },
        error: function(xhr, status, error) {
            // Handle error
            console.error('Error adding new partner:', error);
        }
    });
}

function clearDashboard() {
    var ordersDiv = document.getElementById('orders');
    while (ordersDiv.firstChild) {
        ordersDiv.removeChild(ordersDiv.firstChild);
    }
    transactionsData = []
}

document.getElementById("submit-button").addEventListener('click', function(e) {
    
    if (transactionsData.length > 0 ) {
        console.log(transactionsData)
        console.log("posting items")
// Send a POST request to your backend server
        fetch('http://127.0.0.1:5000/transaction-add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionsData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to post order');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful response from the server
            console.log('Order posted successfully:', data);
            clearDashboard();
        })
        .catch(error => {
            // Handle error
            console.error('Error posting order:', error);
        });
    }
});

function makeChart(data, labels) {
    const ctx = document.getElementById('myChart');
  
    // eslint-disable-next-line no-new
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Store Spending',
          data: data,
          // data: [22, 33, 44, 55, 66],
          backgroundColor: [
            'rgba(0, 0, 255, 0.4)',
            'rgba(255, 0, 0, 0.4)',
            'rgba(255, 255, 0, 0.4)',
            'rgba(0, 100, 0, 0.4)',
            'rgba(0, 0, 255, 0.4)'],
          borderWidth: 2,
          borderColor: ['blue', 'red', 'yellow', 'green', 'blue']
  
        }],
        color: 'black'
      },
      options: {
        responsive: false,
        plugins: {
        title: {
            display: true,
            text: 'Average Store Spending Visualization'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 30,
            ticks: {
              color: 'black'
              
            }
  
          },
          x: {
            ticks: {
              color: 'black'
            }
          }
        }
      }
    });
    return myChart;
  }

  function makeChartTwo(data, labels) {
    const ctx = document.getElementById('myChartTwo');
  
    // eslint-disable-next-line no-new
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Category Spending',
            data: data,
            // data: [22, 33, 44, 55, 66],
            backgroundColor: [
              'rgba(0, 0, 255, 0.4)',
              'rgba(255, 0, 0, 0.4)',
              'rgba(255, 255, 0, 0.4)',
              'rgba(0, 100, 0, 0.4)',
              'rgba(0, 0, 255, 0.4)'],
            borderWidth: 2,
            borderColor: ['blue', 'red', 'yellow', 'green', 'blue']
    
          }],
          color: 'black'
        },
        options: {
          responsive: false,
          plugins: {
          title: {
              display: true,
              text: 'Average Category Spending Visualization'
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 0,
              ticks: {
                color: 'black'
                
              }
    
            },
            x: {
              ticks: {
                color: 'black'
              }
            }
          }
        }
      });
      return myChart;
  }

  function makeChartThree(data, labels) {
    const ctx = document.getElementById('myChartThree');
  
    // eslint-disable-next-line no-new
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Category Count',
            data: data,
            // data: [22, 33, 44, 55, 66],
            backgroundColor: [
              'rgba(0, 0, 255, 0.4)',
              'rgba(255, 0, 0, 0.4)',
              'rgba(255, 255, 0, 0.4)',
              'rgba(0, 100, 0, 0.4)',
              'rgba(0, 0, 255, 0.4)'],
            borderWidth: 2,
            borderColor: ['blue', 'red', 'yellow', 'green', 'blue']
    
          }],
          color: 'black'
        },
        options: {
          responsive: false,
          plugins: {
          title: {
              display: true,
              text: 'Category Inventory Data Visualization'
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 0,
              ticks: {
                color: 'black'
                
              }
    
            },
            x: {
              ticks: {
                color: 'black'
              }
            }
          }
        }
      });
      return myChart;
  }


  function getAvgStoreData() {
    fetch('http://127.0.0.1:5000/avg-price?limit=5')
    .then(response => {
        // Check if the response is successful (status code 200)
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        // Parse the JSON data from the response
        return response.json();
    })
    .then(data => {
        // Do something with the JSON data
        console.log(data);
        const avgPrices = data.map(item => item.avg_price);
        console.log(avgPrices)
        const storeNames = data.map(item => item.store_name);
        makeChart(avgPrices, storeNames);
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
  }

  function getAvgCategoryData() {
    fetch('http://127.0.0.1:5000/avg-category')
    .then(response => {
        // Check if the response is successful (status code 200)
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        // Parse the JSON data from the response
        return response.json();
    })
    .then(data => {
        // Do something with the JSON data
        console.log(data);
        const avgPrices = data.map(item => parseFloat(item.avg_price));
        console.log(avgPrices) 
        const categoryName = data.map(item => item.category_name);
        makeChartTwo(avgPrices, categoryName);
        
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
  }

  function getCountCategoryData() {
    fetch('http://127.0.0.1:5000/count-category')
    .then(response => {
        // Check if the response is successful (status code 200)
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        // Parse the JSON data from the response
        return response.json();
    })
    .then(data => {
        // Do something with the JSON data
        console.log(data);
        const avgPrices = data.map(item => item.category_count);
        console.log(avgPrices) 
        const categoryName = data.map(item => item.category_name);
        makeChartThree(avgPrices, categoryName);
        
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
  }

function main(){
    console.log("calling main")
    fetchAllCategories();
    fetchAllStores();
    getAvgStoreData()
    getAvgCategoryData();
    getCountCategoryData();
    
}


document.addEventListener('DOMContentLoaded', function() {
    main(); // Replace arg1, arg2 with actual arguments
});
