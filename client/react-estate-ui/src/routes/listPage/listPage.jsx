import { listData } from "../../lib/dummydata";
import "./listPage.scss";
import Filter from "../../components/filter/Filter"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import { useLoaderData, Await } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, getPostsError, getPostsStatus, selectAllPosts } from '../../slice/postSlice';


function ListPage() {
  // const data = useLoaderData();
  // console.log("This is posts", data);

  const dispatch = useDispatch();
  // const { posts, status, error } = useSelector((state) => state.posts);

  const posts = useSelector(selectAllPosts);
  
  const status = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);


  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);
  // dispatch(fetchPosts());

  let content;

  if (status === 'loading') {
    content =<p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = posts.map(post => (
        <Card key={post.id} itemId={post.id} />
      ))
    ;
  } else if (status === 'failed') {
    content = <div className="error">{error}</div>;
  }


  return (
   <div className="listPage">
    <div className="listContainer">
      <div className="wrapper">
        <Filter/>
       
            {content}
      
     
      </div>
    </div>
    {/* <div className="mapContainer">
    <Suspense fallback={<p>Loading...</p>}>
          <Await 
            resolve={data.postResponse}
            errorElement={<p>Error Loading Posts!!!</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
    </div> */}
  </div>
  );
}

export default ListPage;
