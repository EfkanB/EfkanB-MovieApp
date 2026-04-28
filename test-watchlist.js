const fetch = require('node-fetch');

async function testWatchlist() {
    try {
        // Login to get token
        console.log('Logging in...');
        const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'testuser',
                password: 'password123'
            })
        });

        if (!loginResponse.ok) {
            console.log('Login failed, creating user...');
            const registerResponse = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'password123'
                })
            });

            if (!registerResponse.ok) {
                throw new Error('Registration failed');
            }

            // Login again
            const loginAgain = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'password123'
                })
            });

            if (!loginAgain.ok) {
                throw new Error('Login failed after registration');
            }

            const loginData = await loginAgain.json();
            token = loginData.token;
        } else {
            const loginData = await loginResponse.json();
            token = loginData.token;
        }

        console.log('Token obtained:', token.substring(0, 20) + '...');

        // Get movies
        console.log('\nGetting movies...');
        const moviesResponse = await fetch('http://localhost:8080/api/movies');
        const movies = await moviesResponse.json();
        console.log(`Found ${movies.length} movies`);

        if (movies.length === 0) {
            console.log('No movies found, skipping watchlist test');
            return;
        }

        const movieId = movies[0].id;
        console.log(`Using movie ID: ${movieId}`);

        // Add to watchlist
        console.log('\nAdding movie to watchlist...');
        const addResponse = await fetch('http://localhost:8080/api/users/me/watchlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ movieId })
        });

        if (!addResponse.ok) {
            throw new Error(`Add to watchlist failed: ${addResponse.status}`);
        }

        console.log('Movie added to watchlist successfully');

        // Get watchlist
        console.log('\nGetting watchlist...');
        const watchlistResponse = await fetch('http://localhost:8080/api/users/me/watchlist', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!watchlistResponse.ok) {
            throw new Error(`Get watchlist failed: ${watchlistResponse.status}`);
        }

        const watchlist = await watchlistResponse.json();
        console.log(`Watchlist has ${watchlist.length} movies`);
        console.log('Watchlist movies:', watchlist.map(m => m.title));

        // Remove from watchlist
        console.log('\nRemoving movie from watchlist...');
        const removeResponse = await fetch(`http://localhost:8080/api/users/me/watchlist/${movieId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!removeResponse.ok) {
            throw new Error(`Remove from watchlist failed: ${removeResponse.status}`);
        }

        console.log('Movie removed from watchlist successfully');

        // Verify watchlist is empty
        const finalWatchlistResponse = await fetch('http://localhost:8080/api/users/me/watchlist', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const finalWatchlist = await finalWatchlistResponse.json();
        console.log(`Final watchlist has ${finalWatchlist.length} movies`);

        console.log('\n✅ Watchlist test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testWatchlist();