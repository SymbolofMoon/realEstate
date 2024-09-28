import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import  cityData  from "../../lib/cityData.js";
import "./filteragent.scss";

function Filter() {

  const [searchParams, setSearchParams] = useSearchParams();
  const [username, setUserName] = useState("");

  const [query, setQuery] = useState({   
    username: searchParams.get("username") || "",
  })

  const handleCity = (e) => {
    setUserName(e.target.value);
    setQuery({
      ...query,
      [e.target.name]: e.target.value
    })
  }
  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value
    })
  };

  const handleFilter = (e) => {
    console.log(e);
    setSearchParams(query);
  }
  return (
    <div className="filter">
      <h1>
        Search results for <b>{searchParams.get("username")}</b>
      </h1>
      <div className="top">
     <div className="item"> 
          <label htmlFor="username">Name</label>
         
          <input 
            type="text" 
            name="username" 
            id="username" 
            onChange={handleChange} 
            defaultValue={query.name}
        />
            {/* Map cityData to <option> elements */}
            {/* <option value="" selected="selected">Any</option>
            {cityData.map((city) => (
              <option key={city.id} value={city.key}>
                {city.value}
              </option>
            ))} */}
         
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
      {/* <div className="bottom">
        
      
      
      <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Any"
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
     
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div> */}
    </div>
  );
}

export default Filter;
