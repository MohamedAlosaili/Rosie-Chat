import { Link } from "react-router-dom";

import Button from "components/Button";
import pageNotFound from "imgs/page_not_found.svg";

const NotFound = () => (
  <div className="mx-auto flex h-screen w-full max-w-full flex-col items-center gap-4 p-4 pt-32 text-center">
    <img src={pageNotFound} alt="Not Found Image" className="w-96" />
    <h1 className="text-xl font-bold text-primary-900 dark:text-primary-200">
      404 Page Not Found
    </h1>
    <p className="font-medium">
      We're sorry, the page you requested could not be found.
    </p>
    <Link to="/">
      <Button className="w-32">Home page</Button>
    </Link>
  </div>
);

export default NotFound;
