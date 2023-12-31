import { createCurrentUserHook, createClient } from "next-sanity";

import createImageUrlBuilder from "@sanity/image-url";

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: "2021-03-25",
  useCdn: process.env.NODE_BW === "production",
};

export const sanityClient = createClient(config);

const buidler = createImageUrlBuilder(sanityClient);

export const urlFor = (source) => buidler.image(source);
export const useCurrentUser = createCurrentUserHook(config);
