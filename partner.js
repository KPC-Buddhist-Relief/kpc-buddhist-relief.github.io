
function makeChart(data, labels) {
    const ctx = document.getElementById('myChart');
  
    // eslint-disable-next-line no-new
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Partner Giving',
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
            text: 'Total Partner Giving Visualization'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 0,
            title: {
                display: true,
                text: 'Number of Needs'
            },
            ticks: {
              color: 'black'
              
            }
  
          },
          x: {
            title: {
                display: true,
                text: 'Partners'
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

  function makeChartTwo(data, labels) {
    const ctx = document.getElementById('myChartTwo');
  
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



function loadPartners() {
        // Fetch data from the API
    fetch('http://127.0.0.1:5000/partners')
    .then(response => response.json())
    .then(data => {
        // Get the container where partner items will be appended
        const partnerSection = document.getElementById('partnerSection');

        // Loop through the data and create a partner item for each entry
        data.forEach(partner => {
            // Create a new partner item
            const partnerItem = document.createElement('div');
            partnerItem.classList.add('partner-item');

            // Populate the partner item with data
            partnerItem.innerHTML = `
                <h2>${partner.partner_name}</h2>
                <a href="partner-view.html?partner=${partner.partner_name}">Visit ${partner.partner_name}</a>
            `;

            // Append the partner item to the container
            partnerSection.appendChild(partnerItem);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

}

function getPartnerGiving() {
    fetch('http://127.0.0.1:5000/partner-giving')
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
        const partnerNames = data.map(item => item.partner_name);
        makeChart(partnerCount, partnerNames);
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
  }

  function getPartnerTrends() {
    fetch('http://127.0.0.1:5000/partner-trends')
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
        makeChartTwo(partnerCount, dates);
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
}

function main() {
    loadPartners();
    getPartnerGiving()
    getPartnerTrends();
}


document.addEventListener('DOMContentLoaded', function() {
    main(); // Replace arg1, arg2 with actual arguments
});