import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome the DJ Shop",
  description: "We sell the best DJ equipments",
  keywords:
    "cd players, turntables, mixers, controllers, electronics, buy, cheap, shop",
};
export default Meta;
