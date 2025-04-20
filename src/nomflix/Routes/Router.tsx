import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "./Home";
import Tv from "./Tv";
import Search from "./Search";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/tv",
                element: <Tv />,
            },
            {
                path: "/search",
                element: <Search />,
            },
        ]
    }
    
],
{ 
    basename: "/ReactNetflix" 
}
);

export default Router;