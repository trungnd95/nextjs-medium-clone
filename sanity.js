import {
    createClient, createImageUrlBuilder
} from "next-sanity";

export const config = {
    dataset: process.env.SANITY_DATASET || "production", 
    projectId: process.env.SANITY_PROJECT_ID, 
    apiVersion: "2021-10-21", 
    useCdn: process.env.NODE_ENV === "production"
}

export const sanityClient = createClient(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source);