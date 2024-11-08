import "./cardcity.scss";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { alterfavoriteCity } from "../../slice/citySlice";


function CardCity({ city, isLike }) {

    const [isLiked, setIsLiked] = useState(isLike); // false = white, true = red
    const dispatch = useDispatch();

    useEffect(() => {
      setIsLiked(isLike); // Set the initial liked state when the component mounts
  }, [isLike]);
    // console.log(city);
    const toggleHeart = async() => {
      setIsLiked(!isLiked);  // Toggle heart color between red and white

     await dispatch(alterfavoriteCity({citynumber:city.id, cityname:city.value}));
    };
  return (
    <div className="cardbutton">
    <img src="https://i.imgur.com/oYiTqum.jpg" className="card__image" alt="" />
    <div className="card__overlay">
    <div className="card__header">
        <svg className="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                 
        {/* <img className="card__thumb" src="https://i.imgur.com/7D7I6dI.png" alt="" />
        
         {/* <button className="favoritebtn"><img className="card__thumb" src="/heart.png" alt="" /></button> */}

        <button className="heart-button" onClick={toggleHeart}>
        <svg
            className={`heart-icon ${isLiked ? "liked" : "unliked"}`}  // Dynamically apply the class
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
        >
            <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
        </svg>
        </button>
        <div className="card__header-text">
        <h3 className="card__title">{city.value}</h3>            
        <span className="card__status">1 hour ago</span>
      
        </div> 
        {/* {/* <button> <img src="/heart.png" alt=""></img></button> */}
    </div>
    <p className="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?</p>
    </div>
    </div> 
  );
}

export default CardCity;
