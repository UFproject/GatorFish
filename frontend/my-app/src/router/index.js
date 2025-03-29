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
import ManageItem from "../page/ManageItem"
import ChnagePassword from "../page/ChangePassword"
import UpdateItem from "../page/UpdateItem"

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
        path: 'manageItem',
        element: <ManageItem />
      }
    ]
  },
  {
    path:'category',
    element: <CategoryPage />
  },
  {
    path:'password',
    element: <ChnagePassword />
  },
  {
    path:'updateItem',
    element: <UpdateItem />
  },
])

export default router