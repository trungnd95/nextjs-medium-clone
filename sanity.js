import createImageUrlBuilder from '@sanity/image-url';
// import { createClient } from "next-sanity";
import sanityClient from '@sanity/client';

export const config = {
    dataset: process.env.SANITY_DATASET || "production", 
    projectId: "xidv70eb",//process.env.SANITY_PROJECT_ID, 
    apiVersion: "2021-10-21", 
    useCdn: process.env.NODE_ENV === "production"
}

export default sanityClient(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source);