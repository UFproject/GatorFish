import Homepage from "../page/Homepage"
import Product from "../page/Product"
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
    {
        path:'/',
        element: <Homepage />
    },
    {
        path:'/item',
        element: <Product />
    }
])

export default router