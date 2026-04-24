import React from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client/react";
import {GET_CATEGORIES} from "../../graphql/queries.js";
import Articles from "../articles/articles.jsx";

const Category = () => {
    const {category} = useParams();
    const {data} = useQuery(GET_CATEGORIES);

    const categoryId = data?.getCategories?.find(c => c.name === category)?.id;

    if (!categoryId) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-white text-2xl font-serif">Loading category...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Articles categoryId={categoryId}/>
        </div>
    );
}

export default Category;