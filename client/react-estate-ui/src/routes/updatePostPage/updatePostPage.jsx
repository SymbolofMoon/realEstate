import "./updatePostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import cityData from "../../lib/cityData";
import { fetchPostById,updatePost } from "../../slice/singlepostSlice";

function UpdatePostPage() {
    const { postId } = useParams();
    console.log(postId);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const post = useSelector((state) => state.post.post);
    const status = useSelector((state) => state.post.status);
    const error = useSelector((state) => state.post.error);
    console.log(post);

  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (status === 'idle') {
        try {
          // Dispatch the async thunk and wait for it to resolve
          const action = await dispatch(fetchPostById(postId)).unwrap();
          console.log(action);
          // Access the result
        } catch (error) {
          console.error('Error dispatching fetchPostById:', error);
        }
      }
    };

    fetchPost();
    console.log(post);
  }, [dispatch, postId, status]);


  useEffect(() => {
    if (post) {
      setValue(post.postDetail.desc);
      setImages(post.images);
    }
  }, [post]);


  const handleSubmit = async(e) =>{
    e.preventDefault();

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    const postData = {
      postData:{
        title: inputs.title ,
        price: parseInt(inputs.price),
        address: inputs.address,
        city: inputs.city,
        bedroom: parseInt(inputs.bedroom),
        bathroom: parseInt(inputs.bathroom),
        latitude: inputs.latitude,
        longitude: inputs.longitude,
        type: inputs.type,
        property: inputs.property,
        images:images,
        img: "img"
      },
      postDetail: {
        desc: value,
        utilities: inputs.utilities,
        pet: inputs.pet,
        income: inputs.income,
        size: parseInt(inputs.size),
        school: parseInt(inputs.school),
        bus: parseInt(inputs.bus),
        restaurant: parseInt(inputs.restaurant),         
      }
    }

    try {
      const res = await dispatch(updatePost({ postId, postData })).unwrap();

      navigate(`/${postId}`);

    } catch (err) {
      console.log(err);
    }
  }


  return (
        <div className="updatePostPage">
          <div className="formContainer">
            <h1>Update Property Details</h1>
            <div className="wrapper">
            {status === 'succeeded' && (
              <form onSubmit={handleSubmit}>
                <div className="item">
                  <label htmlFor="title">Title</label>
                  <input id="title" name="title" type="text" defaultValue={post.title} />
                </div>
                
                <div className="item">
                  <label htmlFor="price">Price</label>
                  <input id="price" name="price" type="number" defaultValue={post.price}  />
                </div>
                <div className="item">
                  <label htmlFor="address">Address</label>
                  <input id="address" name="address" type="text" defaultValue={post.address} />
                </div>
                <div className="item description">
                  <label htmlFor="desc">Description</label>
                  <ReactQuill theme="snow" onChange={setValue} value={value}/>
                </div>
                <div className="item">
                  <label htmlFor="city">City</label>
                  {/* <input id="city" name="city" type="text" /> */}
                  <select name="city" id="city" defaultValue={post.city} >
                    <option value="" disabled="disabled" selected="selected">Any</option>
                    {cityData.map((city) => (
                      <option key={city.id} value={city.key}>
                        {city.value}
                      </option>
                    ))}
                </select>
                </div>
                <div className="item">
                  <label htmlFor="bedroom">Bedroom Number</label>
                  <input min={1} id="bedroom" name="bedroom" type="number"  defaultValue={post.bedroom}/>
                </div>
                <div className="item">
                  <label htmlFor="bathroom">Bathroom Number</label>
                  <input min={1} id="bathroom" name="bathroom" type="number" defaultValue={post.bathroom} />
                </div>
                <div className="item">
                  <label htmlFor="latitude">Latitude</label>
                  <input id="latitude" name="latitude" type="text" defaultValue={post.latitude} />
                </div>
                <div className="item">
                  <label htmlFor="longitude">Longitude</label>
                  <input id="longitude" name="longitude" type="text" defaultValue={post.longitude} />
                </div>
                <div className="item">
                  <label htmlFor="type">Type</label>
                  <select name="type" defaultValue={post.type}>
                    <option value="rent" defaultChecked>
                      Rent
                    </option>
                    <option value="buy">Buy</option>
                  </select>
                </div>
                <div className="item">
                  <label htmlFor="property">Property</label>
                  <select name="property" defaultValue={post.property}>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <div className="item">
                  <label htmlFor="utilities">Utilities Policy</label>
                  <select name="utilities"  defaultValue={post.postDetail && post.postDetail.utilities}>
                    <option value="owner">Owner is responsible</option>
                    <option value="tenant">Tenant is responsible</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>
                <div className="item">
                  <label htmlFor="pet">Pet Policy</label>
                  <select name="pet" defaultValue={post.postDetail && post.postDetail.pet}>
                    <option value="allowed">Allowed</option>
                    <option value="not-allowed">Not Allowed</option>
                  </select>
                </div>
                <div className="item">
                  <label htmlFor="income" defaultValue={post.postDetail && post.postDetail.income}>Income Policy</label>
                  <input
                    id="income"
                    name="income"
                    type="text"
                    placeholder="Income Policy"
                    defaultValue={post.postDetail && post.postDetail.income}
                  />
                </div>
                <div className="item">
                  <label htmlFor="size">Total Size (sqft)</label>
                  <input min={0} id="size" name="size" type="number" defaultValue={post.postDetail && post.postDetail.size} />
                </div>
                <div className="item">
                  <label htmlFor="school">School</label>
                  <input min={0} id="school" name="school" type="number" defaultValue={post.postDetail && post.postDetail.school}/>
                </div>
                <div className="item">
                  <label htmlFor="bus">bus</label>
                  <input min={0} id="bus" name="bus" type="number" defaultValue={post.postDetail && post.postDetail.bus} />
                </div>
                <div className="item">
                  <label htmlFor="restaurant">Restaurant</label>
                  <input min={0} id="restaurant" name="restaurant" type="number" defaultValue={post.postDetail && post.postDetail.restaurant} />
                </div>
                <button className="sendButton">Update</button>
                {status==="failed"  && <span>{error}</span>}
              </form>
  )}
            </div>
          </div>
          <div className="sideContainer">
            {images.map((image, index) => (
              <img src={image} key={index} alt="" />
            ))}
            <UploadWidget uwConfig={{
              cloudName: "dypcq5sej",
              uploadPreset:"estate",
              multiple:true,
              folder:"post"
            }} 
            setState={setImages}
            />
          </div>
        </div>
      );
  
}

export default UpdatePostPage;
