import HomePage from "./routes/homePage/homePage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux';

import  ListPage  from "./routes/listPage/listPage";
import  AgentListPage  from "./routes/agentlistPage/agentlistPage";
import {Layout,  RequireAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
// import CustomerProfilePage from "./routes/profilePage/customerprofilePage";
// import AgentProfilePage from "./routes/profilePage/agentprofilePage";
import ProtectedRoute from "./routes/protectedRoute/protectedRoute";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import UpdatePostPage from "./routes/updatePostPage/updatePostPage";

import { singlePageLoader, agentlistPageLoader, customerprofilePageLoader, agentprofilePageLoader  } from "./lib/loader";
import ProfilePage from "./routes/profilePage/profilePage";
import CityPage from "./routes/cityPage/cityPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
          path:"/",
          element:<HomePage/>
        },
        {
          path:"/list",
          element:<ListPage/>,
          // loader: listPageLoader
        },
        {
          path:"/:postId",
          element:<SinglePage/>,
          // loader: singlePageLoader
        },
        {
          path:"/login",
          element:<Login/>
        },
        {
          path:"/register",
          element:<Register/>
        },
        {
          path: "/agents",
          element: <AgentListPage />,
          loader: agentlistPageLoader
        }
      ]
    },
    {
      path: "/",
      element:<RequireAuth />,
      children:[
        {
          path:"/customer/profile",
          element: (
            <ProtectedRoute element={<ProfilePage role={'customer'} />} allowedRoles={['customer']} />
          ),
          //loader: customerprofilePageLoader
        },
        {
          path:"/agent/profile",
          element: (
            <ProtectedRoute element={<ProfilePage role={'agent'}/>} allowedRoles={['agent']} />
          ),
          // loader: agentprofilePageLoader

        },
        {
          path:"/post/update/:postId",
          element: (
            <ProtectedRoute element={<UpdatePostPage role={'agent'}/>} allowedRoles={['agent']} />
          ),
          // loader:singlePageLoader

        },


        // {
        //   path:"/agentprofile", 
        //   element:<AgentProfilePage />,
        //   loader: agentprofilePageLoader
        // },

        {
          path:"/profile/update",
          element: <ProfileUpdatePage />
        },
        {
          path:"/add",
          element: <NewPostPage />
        },
        {
          path:"/city",
          element: <CityPage />
        }
      ]
    }
  ]);

  return (
   
      <RouterProvider router={router}/>
    
  );
}

export default App;
