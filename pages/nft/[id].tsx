import { useAddress, useDisconnect, useMetamask, useContract } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { sanityClient, UrlFor } from "../../sanity";
import { Collection } from "../../typings";

interface Props {
    collection: Collection,
}

function NFTDropPage({collection}: Props) {
    
    const [claimedSupply, setClaimedSupply ] = useState<number>(0);
    const [totalSupply, setTotalSupply ] = useState<BigNumber>();
    const {contract, isLoading, error} = useContract(collection.address);
    

    const connectWithMetaMask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();

    useEffect(() => {
        if(!contract) return;

        const fetchNFTDropData = async () => {
            const claimed = await contract.erc721.totalClaimedSupply();
            const total = await contract.erc721.totalCount();

            setClaimedSupply(claimed.toNumber)
            setTotalSupply(total)
        }
        fetchNFTDropData();
    },[contract])
    console.log(claimedSupply, totalSupply);
    

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
        {/* Left */}
        <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
            
            <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
                <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">                
                    <img className="w-44 rounded-xl object-cover lg:h-96 lg:w-72" src={UrlFor(collection.previewImage).url()} alt="" />
                </div>
                <div className="text-center p-5 space-y-2">
                    <h1 className="text-4xl font-bold text-white">{collection.nftCollectionName}</h1>
                    <h2 className="text-sm text-gray-300">{collection.description}</h2>
                </div>
            </div>
        </div>

        {/* Right */}
        <div className="flex flex-1 flex-col p-12 lg:col-span-6">
            {/* header */}
            <header className="flex items-center justify-between">

                <Link href={"/"}>
                    <h1 className="w-52 cursor-pointer tex-xl font-extralight sm:w-80">
                        The <span className="font-extrabold underline decoration-pink-600/50">Addips</span>
                        NFT Market Place
                    </h1>
                </Link>
                <button onClick={() => (address ? disconnect() : connectWithMetaMask())} className="rounded-full bg-rose-400 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base">{address ? 'Sign Out' : 'Sign In'}</button>
            </header>
            <hr className="my-2 border"/>
            {address&&(
                <p className="text-center text-sm text-rose-400">You're logged in with wallet {address.substring(0, 5)}...{address.substring(address.length - 5)}</p>
            )}

            {/* content */}
            <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0 lg:justify-center">
                <img className="w-80 object-cover pb-10 lg:h-40" src={UrlFor(collection.mainImage).url()} alt="" />
                <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">{collection.title}</h1>

                <p className="pt-2 text-xl text-green-500">{claimedSupply} / {totalSupply?.toNumber()} NFT's claimed</p>
            </div>

            {/* footer */}
            <button className="h-16 w-full bg-gradient-to-br from-blue-800 to-rose-500 text-white rounded-full mt-10 hover:-translate-y-[5px] duration-150">Mint NFT (0.01 ETH)</button>
        </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const query = `*[_type == "collection" && slug.current == $id][0]{
            _id,
            title,
            address,
            description,
            nftCollectionName,
            "mainImage": mainImage.asset->url,
            "previewImage": previewImage.asset->url,
            slug {current},
            "creator": creator->{
              _id,
              name,
              address,
              slug {current},
            }
          }`

    const collection = await sanityClient.fetch(query, {
        id: params?.id
    })


    if(!collection){
        return{
            notFound: true
        }
    }

    return {
        props: {
            collection
        }
    }
}
