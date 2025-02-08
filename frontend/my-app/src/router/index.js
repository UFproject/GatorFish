import Homepage from "../page/Homepage"
import Product from "../page/Product"
import SignIn from "../page/SignIn"
import { createBrowserRouter } from 'react-router-dom'

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
  }
])

export default router