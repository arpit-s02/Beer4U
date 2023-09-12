import Card from "./Card";
import { useState, useEffect } from "react";
import axios from "axios";
import "./HomePage.css"

export default function HomePage() {
    const [beers, setBeers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [timeoutKey, setTimeoutKey] = useState(null);

    const fetchData = async () => {
        try {
            // make the API call to fetch the beers data
            const response = await axios.get("https://api.punkapi.com/v2/beers");

            // if the request is successfull return the response data
            return response.data;
        } catch (error) {
            // if any error occurs in the request console log the error
            if (error.response) {
                console.log('Error', error.response);
            }
            else {
                console.log('Error', error);
            }
        } finally {
            // set Loading as false
            setLoading(false);
        }
    };

    const handleSearch = async (value) => {
        try {
            if (value === "") {
                // if search value is empty, make an API call to fetch all the beers
                const response = await axios.get('https://api.punkapi.com/v2/beers');

                // if the request is successfull return the response data
                return response.data;

            }
            else {
                // if search value is not empty, make an API call to fetch the beers matching the search value
                const response = await axios.get(`https://api.punkapi.com/v2/beers?beer_name=${value}`);

                // if the request is successfull return the response data
                return response.data;
            }
        } catch (error) {
            // if any error occurs in the request console log the error
            if (error.response) {
                console.log('Error', error.response);
            }
            else {
                console.log('Error', error);
            }
        }
    }

    const debounceSearch = (e) => {
        // when user types anything on the search bar, set the searchValue as the value typed by the user
        setSearchValue(e.target.value);

        if (timeoutKey) {
            // if any timeout is scheduled clear that timeout
            clearTimeout(timeoutKey);
        }

        // create a new timeout to call the handleSearch function when the user stops typing for 500 milliseconds
        const key = setTimeout(async () => {
            const data = await handleSearch(e.target.value);
            setBeers(data);
        }, 500);

        // set the timeoutKey as the latest key
        setTimeoutKey(key);
    }

    useEffect(() => {
        (async () => {
            // when the page loads, fetch the beers from the API
            const beersData = await fetchData();

            if (beersData) {
                // if data is received from the fetchData function, set beers 
                setBeers(beersData);
            }
        })();
    }, []);

    return (
        <div className="homePage">

            <div className="searchContainer">
                <input
                    type="text"
                    name="search"
                    placeholder="Search for a beer..."
                    value={searchValue}
                    onChange={debounceSearch}
                />
            </div>

            <div className="cardsContainer">

                {
                    loading ? (
                        <div className="loaderContainer">
                            <div className="loader"></div>
                            <p>Loading Beers...</p>
                        </div>
                    ) : (
                        <>
                            {beers.length ? (
                                <>
                                    {
                                        beers.map((item) => {
                                            return (
                                                <Card
                                                    key={item.id}
                                                    name={item.name}
                                                    tagline={item.tagline}
                                                    image={item.image_url}
                                                />
                                            )
                                        })
                                    }
                                </>
                            ) : (
                                <div>Couldn't find anything for {searchValue}</div>
                            )}
                        </>
                    )
                }
            </div>
        </div>
    );
}
