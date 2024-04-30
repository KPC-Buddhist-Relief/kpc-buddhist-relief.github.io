// Define a global array to store order data
var ordersData = [];

document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault(); // prevent form submission

    // Collect form data
    var organizationName = document.getElementById('organizationName').value;
    var itemName = document.getElementById('itemName').value;
    var quantity = document.getElementById('quantity').value;
    var units = document.getElementById('unitsDropdown').value; // Retrieve selected unit from dropdown
    var unitNumber = document.getElementById('unitNumber').value; // Retrieve numerical value
    var dateNeeded = document.getElementById('dateNeeded').value;

    // Construct a dictionary for the order item
    var orderData = {
        partner_name: organizationName,
        itemName: itemName,
        quantity: quantity,
        units: `${unitNumber} ${units}`,
        date: dateNeeded
    };

    // Add the order data to the global array
    ordersData.push(orderData);

    // Create a new dashboard item for the order
    var orderItem = document.createElement('div');
    orderItem.classList.add('dashboard-item');
    orderItem.innerHTML = `
        <strong class="organization-name">Organization:</strong> ${organizationName}<br>
        <strong class="item-name">Item:</strong> ${itemName}<br>
        <strong class="quantity">Quantity:</strong> ${quantity}<br>
        ${units ? `<strong class="units">Units:</strong> ${unitNumber} ${units} <br>` : ''} <!-- Conditionally include units -->
        <strong class="date-needed">Date Needed:</strong> ${dateNeeded}
        <button class="delete-button">Delete</button> <!-- Delete button -->
    `;

    // Append the new dashboard item to the dashboard
    document.getElementById('orders').appendChild(orderItem);

    // Clear the form fields
    document.getElementById('orderForm').reset();

    // Add event listener to the delete button
    var deleteButton = orderItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', function() {
        // Remove the dashboard item from the DOM
        orderItem.remove();

        // Remove the corresponding order data from the global array
        var index = ordersData.findIndex(function(order) {
            return order.organizationName === organizationName && order.itemName === itemName;
        });
        if (index !== -1) {
            ordersData.splice(index, 1);
        }
    });
});


function fetchAllPartners() {
    fetch('http://127.0.0.1:5000/partners')
        .then(response => response.json())
        .then(data => {
            const selectElement = $('#organizationName');
            data.forEach(partner => {
                const option = $('<option>').val(partner.partner_name).text(partner.partner_name);
                selectElement.append(option);
            });
            // Initialize selectize after options are added
            $('#organizationName').selectize({
                create: true,
                sortField: 'text',
                onOptionAdd: function(value, $item) {
                    // value will be null if a new option is created
                    console.log(`New option added with value: ${value}`);
                        // Get the newly created partner's data
                        const newPartnerName = this.options[value].text;
                        // Send the new partner's data to the backend for creation
                        console.log(`Adding option: ${value}`);
                        addNewPartner({partner_name: newPartnerName});
                        
                    
                }
            });
        })
        .catch(error => console.error('Error fetching partners:', error));
}

function addNewPartner(partnerData) {
    $.ajax({
        url: 'http://127.0.0.1:5000/partner-add', // Endpoint to add new partner
        type: 'POST', // POST request to add data
        contentType: 'application/json', // Specify content type as JSON
        data: JSON.stringify(partnerData), // Convert data to JSON string
        success: function(response) {
            // Handle success
            fetchAllPartners()
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
    ordersData = []
}

document.getElementById("submit-button").addEventListener('click', function(e) {
    
    if (ordersData.length > 0 ) {
        console.log("posting items")
// Send a POST request to your backend server
        fetch('http://127.0.0.1:5000/partner-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ordersData)
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



function main(){
    console.log("calling main")
  fetchAllPartners();
}


document.addEventListener('DOMContentLoaded', function() {
    main(); // Replace arg1, arg2 with actual arguments
});
