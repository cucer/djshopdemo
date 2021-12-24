import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

// IMPORTANT, component name is "Paginate" not "Pagination". Because React Bootstrap has a "Pagination" component. We dont want to be confused
// We have 2 paths in App.js! One of them is "pagination with keyword" and the other one is "pagination without keyword". We have to define both conditions.
// isAdmin important! Because we use pagination in admin products page. But it should not route products when clicked as main page. It should only list
const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
  return (
    pages > 1 && (
      <Pagination size='sm'>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
