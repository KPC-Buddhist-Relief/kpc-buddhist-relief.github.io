
const urlParams = new URLSearchParams(window.location.search);
const partnerName = urlParams.get('partner');
console.log(partnerName)

document.getElementById('partnerTitle').innerText = partnerName;
document.getElementById('partnerSubText').innerText = `Here is where you can see needs for ${partnerName} and visualizations`;
document.getElementById('needsSubText').innerText = `See the latest parter needs for ${partnerName}`

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}


function makeChart(data, labels) {
    const ctx = document.getElementById('myChart');
  
    // eslint-disable-next-line no-new
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          pointStyle: 'circle',
          pointRadius: 10,
          pointHoverRadius: 15,
          datasets: [{
            label: 'Partner Giving',
            data: data,
            // data: [22, 33, 44, 55, 66],
            backgroundColor: [
              'rgba(0, 0, 255, 0.2)',
            ],
            borderWidth: 1,
            borderColor: ['blue'],
            pointRadius: 5,
            pointHoverRadius: 10
    
          }],
          color: 'black'
        },
        options: {
          responsive: false,
          plugins: {
          title: {
              display: true,
              text: 'Partner Needs Trends'
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 0,
              title: {
                display: true,
                text: 'Count'
            },
              ticks: {
                color: 'black'
                
              }
    
            },
            x: {
                title: {
                    display: true,
                    text: 'Dates'
                },
              ticks: {
                color: 'black'
              }
            }
          }
        }
      });
    return myChart;
  }


function getPartnerData() {
    fetch(`http://127.0.0.1:5000/partner-latest-needs?partner=${partnerName}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const needsSubText = document.getElementById('needsSubText');
        
        // Clear any existing content
        needsSubText.innerHTML = '';

        // Loop through the data array and create p elements for each item
        data.forEach(item => {
            const p = document.createElement('p');
            // p.textContent = `${item.quantity} of ${item.item_name} ${item.units} needed on ${formatDate(item.date)}`;
            p.textContent = `${formatDate(item.date)}: ${item.quantity} count of ${item.units} ${item.item_name}`;
            needsSubText.appendChild(p);
        });
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

function getPartnerTrends() {
    fetch(`http://127.0.0.1:5000/partner-count-series?partner=${partnerName}`)
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
        const partnerCount = data.map(item => item.partner_count);
        // Convert date strings to formatted dates
        const dates = data.map(item => {
            const date = new Date(item.date);
            return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
        });
        makeChart(partnerCount, dates);
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
}


function main() {
    console.log("main")
    getPartnerData()
    getPartnerTrends()
}

document.addEventListener('DOMContentLoaded', function() {
    main(); 
});