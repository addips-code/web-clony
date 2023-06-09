interface Image{
    asset:{
        url: string
    }
}

export interface Creator{
    _id: string
    name: string
    address: string
    slug: {
        current: string
    }
    image: Image
    bio: string
}

export interface Collection{
    nftCollectionName: string
    _id: string
    title: string
    description: string
    address: string
    slug:{
        current: string
    }
    creator: Creator
    mainImage: Image
    previewImage: Image
}