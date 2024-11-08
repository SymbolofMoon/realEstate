import { listData } from "../../lib/dummydata";
import "./cityPage.scss";
import Filter from "../../components/filter/Filter"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import { useLoaderData, Await } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, getPostsError, getPostsStatus, selectAllPosts } from '../../slice/postSlice';
import cityData from "../../lib/cityData";
import CardCity from "../../components/cardcity/CardCity";
import { fetchfavoriteCities, resetfavoriteCities } from "../../slice/citySlice";


function CityPage() {
    const [isLiked, setIsLiked] = useState(false); // false = white, true = red
    const  favoriteCities  = useSelector(state=>state.city.favoriteCities);
    const status = useSelector(state=>state.city.status);
    const dispatch = useDispatch();

    useEffect(() => {
      return () => {
        dispatch(resetfavoriteCities()); // If you have an action to reset the post state
      };
    }, [dispatch]);

    useEffect(() => {
      if(status=="idle"){
       dispatch(fetchfavoriteCities());
      }
      }, [dispatch, status]);

    // console.log(favoriteCities);

  return (
    <ul className="cards">
          {cityData.map((city)=> 
            // 
            (
    <li key={city.key}>
      <CardCity 
        key={city.key} 
        city={city} 
        isLike={favoriteCities.some(fav => fav.cityNumber === city.id)}
      />         
    </li>
            )
)}
    {/* <li>
      <a href="" class="card">
        <img src="https://i.imgur.com/2DhmtJ4.jpg" class="card__image" alt="" />
        <div class="card__overlay">        
          <div class="card__header">
            <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                 
            <img class="card__thumb" src="https://i.imgur.com/sjLMNDM.png" alt="" />
            <div class="card__header-text">
              <h3 class="card__title">kim Cattrall</h3>
              <span class="card__status">3 hours ago</span>
            </div>
          </div>
          <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?</p>
        </div>
      </a>
    </li>
    <li>
      <a href="" class="card">
        <img src="https://i.imgur.com/oYiTqum.jpg" className="card__image" alt="" />
        <div class="card__overlay">
          <div class="card__header">
            <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                     
            <img class="card__thumb" src="https://i.imgur.com/7D7I6dI.png" alt="" />
            <div class="card__header-text">
              <h3 class="card__title">Jessica Parker</h3>
              <span class="card__tagline">Lorem ipsum dolor sit amet consectetur</span>            
              <span class="card__status">1 hour ago</span>
            </div>
          </div>
          <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?</p>
        </div>
      </a>
    </li>
    <li>
      <a href="" class="card">
        <img src="https://i.imgur.com/2DhmtJ4.jpg" class="card__image" alt="" />
        <div class="card__overlay">
          <div class="card__header">
            <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                 
            <img class="card__thumb" src="https://i.imgur.com/sjLMNDM.png" alt="" />
            <div class="card__header-text">
              <h3 class="card__title">kim Cattrall</h3>
              <span class="card__status">3 hours ago</span>
            </div>          
          </div>
          <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?</p>
        </div>
      </a>
    </li>     */}
  </ul>
  );
}

export default CityPage;
