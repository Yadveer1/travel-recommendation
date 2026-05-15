document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('btnSearch');
    const clearBtn = document.getElementById('btnClear');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');

    // Make sure we only add event listeners if the elements exist (Home Page)
    if (searchBtn && clearBtn && searchInput && resultsContainer) {
        searchBtn.addEventListener('click', handleSearch);
        clearBtn.addEventListener('click', clearResults);
    }

    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            return;
        }

        fetch('travel_recommendation_api.json')
            .then(response => response.json())
            .then(data => {
                let results = [];

                if (query.includes('beach')) {
                    results = data.beaches;
                } else if (query.includes('temple')) {
                    results = data.temples;
                } else if (query.includes('country') || query.includes('countries')) {
                    // Combine all cities from all countries
                    data.countries.forEach(country => {
                        results = results.concat(country.cities);
                    });
                } else {
                    // Try to match specific country name
                    const countryMatch = data.countries.find(country => 
                        country.name.toLowerCase().includes(query)
                    );
                    if (countryMatch) {
                        results = countryMatch.cities;
                    }
                }

                displayResults(results);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function displayResults(results) {
        resultsContainer.innerHTML = ''; // Clear previous results

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p style="color: white; padding: 1rem;">No recommendations found for your search. Try "beaches", "temples", or a country like "Japan".</p>';
            return;
        }

        results.forEach(item => {
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';

            const img = document.createElement('img');
            img.src = item.imageUrl;
            img.alt = item.name;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'result-content';

            const title = document.createElement('h3');
            title.textContent = item.name;

            const desc = document.createElement('p');
            desc.textContent = item.description;

            const visitBtn = document.createElement('a');
            visitBtn.href = '#';
            visitBtn.className = 'visit-btn';
            visitBtn.textContent = 'Visit';

            contentDiv.appendChild(title);
            contentDiv.appendChild(desc);
            contentDiv.appendChild(visitBtn);

            resultCard.appendChild(img);
            resultCard.appendChild(contentDiv);

            resultsContainer.appendChild(resultCard);
        });
    }

    function clearResults() {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
    }
});
