import Homepage from "../page/Homepage"
import Product from "../page/Product"
import SignIn from "../page/SignIn"
import SignUp from "../page/SignUp"
import { createBrowserRouter } from 'react-router-dom'
import UploadItem from "../page/UploadItem"
import Profile from "../page/Profile"
import CategoryPage from "../page/Category"
import Account from "../page/Account"
import Favorites from "../page/Favorites"
import UpdateItems from "../page/UpdateItem"

const router = createBrowserRouter([
  {
    path:'/',
    element: <Homepage />
  },
  {
    path:'/item',
    element: <Product />
  },
  {
    path:'login',
    element: <SignIn />
  },
  {
    path:'register',
    element: <SignUp />
  },
  {
    path:'uploadItem',
    element: <UploadItem />
  },
  {
    path:'profile',
    element: <Profile />,
    children: [
      {
        index: true,
        element: <Favorites />
      },
      {
        path: 'account',
        element: <Account />
      },
      {
        path: 'updateItem',
        element: <UpdateItems />
      }
    ]
  },
  {
    path:'category',
    element: <CategoryPage />
  },
])

export default router