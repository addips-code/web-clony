import { createCurrentUserHook, createClient } from 'next-sanity';
import createImageUrlBuilder from '@sanity/image-url';


export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: '2023-03-24',
    useCdn: process.env.NODE_ENV === 'production',
}

export const sanityClient = createClient(config)

export const UrlFor = (source) => createImageUrlBuilder(config).image(source)