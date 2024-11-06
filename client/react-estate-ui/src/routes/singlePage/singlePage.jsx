import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import RatingModal from "../../components/ratingmodal/RatingModal";
import SharingModal from "../../components/sharingmodal/SharingModal";
import { redirect } from "react-router-dom";
import DOMPurify from "dompurify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostById, savePost, selectPost, getPostError, getPostStatus, resetPost, likePost, addComment } from "../../slice/singlepostSlice.js";
import { deletePost } from "../../slice/postSlice.js";


function SinglePage() {

  // const { postId } = useParams()
  const { postId } = useParams();

  const post = useSelector(selectPost);
  const status = useSelector(getPostStatus);
  const error = useSelector(getPostError);
  const dispatch = useDispatch();
  const [saved, setSaved] = useState(post?.isSaved || false);

 

  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  // console.log("Likecount ", post);
  const [isLike, setIsLike] = useState(post?.isLiked || false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModelOpen, setIsShareModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => setIsShareModalOpen(false); 

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
      setIsLike(post.isLiked);
      setLikeCount(post.likeCount);
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

  const handleLike = async() => {
   
    // setSaved((prev)=> !prev);
    let someLike = !isLike;
    ////console.log(saved);
    // setIsLike(someLike);
    if(!currentUser){
      navigate("/login");
      return;
     }

    try {
      // await apiRequest.post("/user/save", {postId: post.id});
      setIsLike((prevIsLike) => {
        const newIsLike = !prevIsLike; // Toggle like state
        setLikeCount((prevCount) => newIsLike ? prevCount + 1 : prevCount - 1); // Update like count
        return newIsLike; // Return new like state
      });
      await dispatch(likePost( {postId, someLike })).unwrap();
      
      
      
    } catch (error) {
      console.log(error);
      setIsLike((prev)=> !prev);
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

  const handleComment = async(e) => {
    e.preventDefault();
    console.log()

    const formData = new FormData(e.target);
    console.log(formData);
    const text = Object.fromEntries(formData.entries());
    console.log(text.comment);

    if(!text.comment) return;

    try {
      await dispatch(addComment({postId: postId, content: text.comment})).unwrap();
    } catch (error) {
      console.log(error);
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
            <button
            onClick={handleLike}
            style={{backgroundColor: (isLike) ? "#fece51" : "white"}}
            >
              <img src="/chat.png" alt="" />
              {likeCount}
             {/* {(isLike) ? "UnLike": "Like"} */}
            </button>
            <button 
            onClick={handleSave}
            style={{backgroundColor: (saved) ? "#fece51" : "white"}}
            >
              <img src="/save.png" alt="" />
              { (saved) ? "Place Saved" : "Save the Place"}
            </button>
          </div>
          <p className="title">Comment</p>
          <div className="listVertical">
            {post.comments.map(comment=>(
              <div className="feature">
              <img src={comment.user.avatar || "/noavatar.jpg"} alt="" />
              <div className="featureText">
                <span>{comment.user.username}</span>
              </div>
              {comment.content}
            </div>
            ))}
            <div className="feature">
              <img src={currentUser.avatar || "/noavatar.jpg"} alt=""/>
              {/* <div className="featureText">
                <span>{currentUser.username}</span>
              </div> */}
              <form style={{display :"flex"}}
              onSubmit={handleComment}>
              <input style={{
                borderRadius:25,
                padding: 10,
                // borderColor: #ccc,
                borderStyle: "solid", 
                outline: "none",
                // width: 100%, // Full width
                // transition: border-color,
                // boxShadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                // fontSize: 16px,
                }} 
                placeholder="Add a Comment"
                type="text"
                name="comment"/>
               
              <button> Comment</button>
               </form>
            </div>
          </div>
          <p className="title">Ratings</p>
          <div className="listHorizontal">
            <div className="feature">
                <img src="/school.png" alt="" />
                <div className="featureText">
                  <span>Rating</span>
                  <p>{post.ratings?post.avgRating+" by "+post.ratings.length+" people.":"No Ratings"}</p>
                </div>
            </div>
            <div className="feature">
            <button
            onClick={openModal} className="open-modal-btn"
            > Submit a Rating </button>
            <RatingModal isOpen={isModalOpen} onClose={closeModal} postId={postId} />

              {/* <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      ...
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <p className="title">Share the Post</p>
          <button
            onClick={openShareModal} className="open-modal-btn"
            > Share the Post </button>
          <SharingModal isOpen={isShareModelOpen} onClose={closeShareModal} postId={postId} />
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
