import { Link } from "react-router-dom";

import Button from "components/Button";
import pageNotFound from "imgs/page_not_found.svg";

const NotFound = () => (
  <div className="mx-auto flex h-screen w-96 max-w-full flex-col items-center gap-4 p-4 pt-32 text-center">
    <img src={pageNotFound} alt="Not Found Image" />
    <h1 className="text-xl font-bold dark:text-primary-200">
      404 Page Not Found
    </h1>
    <p>We're sorry, the page you requested could not be found.</p>
    <Button className="w-32">
      <Link to="/">Home page</Link>
    </Button>
  </div>
);

export default NotFound;
