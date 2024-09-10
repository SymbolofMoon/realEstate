import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import apiRequest from '../../lib/apiRequest';
import { redirect, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostById, savePost, selectPost, getPostError, getPostStatus, resetPost } from "../../slice/singlepostSlice.js";
import { deletePost } from "../../slice/postSlice.js";


function SinglePage() {

  // const { postId } = useParams()
  const { postId } = useParams();

  console.log(postId);
 

  const post = useSelector(selectPost);
  const status = useSelector(getPostStatus);
  const error = useSelector(getPostError);
  const dispatch = useDispatch();
  const [saved, setSaved] = useState(post?.isSaved || false);
  ////console.log(post);

  useEffect(() => {
    const fetchPost = async () => {
      if (status === 'idle') {
        try {
          // Dispatch the async thunk and wait for it to resolve
          const action = await dispatch(fetchPostById(postId)).unwrap();
          ////console.log(action);
       
          // Access the result
        } catch (error) {
          console.error('Error dispatching fetchPostById:', error);
        }
      }
    };

    fetchPost();
  }, [dispatch,postId, status]);

  useEffect(() => {

    if(status==='succeeded'){
      ////console.log(post.isSaved);
      setSaved(post.isSaved);
    }

  }, [status, postId])

  useEffect(() => {
    return () => {
      dispatch(resetPost()); // If you have an action to reset the post state
    };
  }, [dispatch]);


  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate(); 
  if(!currentUser){
   redirect("/login");
  }


  const handleDelete = async(e) =>{
    e.preventDefault();
    try {
      const res = await dispatch(deletePost( post ));
      ////console.log(res);
      navigate('/list');

    } catch (err) {
      console.log(err);
    }
  }

  const handleSave = async() => {
   
    // setSaved((prev)=> !prev);
    let prev = !saved;
    setSaved(prev);
    ////console.log(saved);
    if(!currentUser){
      navigate("/login");
      return;
     }

    try {
      // await apiRequest.post("/user/save", {postId: post.id});
      await dispatch(savePost({ postId: post.id, saved: prev })).unwrap();
    } catch (error) {
      console.log(error);
      setSaved((prev) => !prev);
    }
  }

  return (
    status==='succeeded' && 
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div className="bottom" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.postDetail.desc)}}></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          {currentUser && currentUser.role==="agent" && currentUser.username===post.user.username && (
            <Link to={`/post/update/${post.id}`}>
                <button>Update Property Details</button>
            </Link>
          )}
          {currentUser && currentUser.role==="agent" && currentUser.username===post.user.username && (              
                          <button onClick={handleDelete}>Delete Property Details</button>                    
                    )}
          
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {
                 post.postDetail.utilities === "owner" ? (
                    <p>Owner is responsible</p>
                  ): (
                    <p>Tenant is responsible</p>
                  )
                }
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                { post.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ): (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income} </p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom}</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom}</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>{post.postDetail.school}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button 
            onClick={handleSave}
            style={{backgroundColor: (saved) ? "#fece51" : "white"}}
            >
              <img src="/save.png" alt="" />
              { (saved) ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
