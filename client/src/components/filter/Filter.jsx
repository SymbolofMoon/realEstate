import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from "../../slice/postSlice.js";
import  cityData  from "../../lib/cityData.js";
import "./filter.scss";

function Filter() {

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectcity, setSelectCity] = useState("");

  const dispatch = useDispatch();
  const filter = useSelector((state) => state.posts.filter);
  const [localFilter, setLocalFilter] = useState(filter);

  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom"),
  })

  // const handleCity = (e) => {
  //   setSelectCity(e.target.value);
  //   setQuery({
  //     ...query,
  //     [e.target.name]: e.target.value
  //   })
  // }
  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value
    })
    const { name, value } = e.target;
    setLocalFilter({ ...localFilter, [name]: value });
  };

  const handleFilter = () => {
    dispatch(setFilter(localFilter));
  }
  return (
    <div className="filter">
      <h1>
        {/* Search results for <b>{searchParams.get("city")}</b> */}
         Search results for <b>{query.city}</b> 
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">City</label>
          {/* <select id="city" name="city" placeholder="City Location" value={selectcity} onChange={handleCity}> */}
          <select name="city" id="city" onChange={handleChange} value={query.city}>
            {/* Map cityData to <option> elements */}
            <option value="" selected="selected">Any</option>
            {cityData.map((city) => (
              <option key={city.id} value={city.key}>
                {city.value}
              </option>
            ))}
            {/* {Object.entries(cityData).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))} */}
          </select>
          {/* <input
            type="text"
            id="city"
            name="city"
            placeholder="City Location"
            onChange={handleChange}
            defaultValue={query.city}
          /> */}
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Type</label>
          <select name="type" id="type" onChange={handleChange} value={query.type}>
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Property</label>
          <select name="property" id="property" onChange={handleChange} value={query.property}>
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Any"
            onChange={handleChange}
            value={query.minPrice || ''}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="text"
            id="maxPrice"
            name="maxPrice"
            placeholder="Any"
            onChange={handleChange}
            value={query.maxPrice || ''}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Bedroom</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="Any"
            onChange={handleChange}
            value={query.bedroom}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
