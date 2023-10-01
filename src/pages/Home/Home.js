import { Fragment, useEffect, useState } from "react";
import { Navbar,HotelCard,Categories } from "../../components";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Home.css";
import { useCategory } from "../../context";

export const Home = () => {
    const [hasMore, setHasMore]=useState(true);
    const [currentIndex, setCurrentIndex]=useState(16);
    const [testData, setTestData]=useState([]);
    const [hotels,setHotels]=useState([]);
    const { hotelCategory } = useCategory();

    useEffect(()=>{
        (async()=>{
            try{
                const {data} = await axios.get(
                    `https://travelappvikash.cyclic.cloud/api/hotels?category=${hotelCategory}`
                );
                setTestData(data);
                setHotels(data ? data.slice(0,16):[]);

            }catch(err){
                console.log(err);
            }
        })();
    },[hotelCategory]);

    const fetchMoreData = () =>{
        if(hotels.length >= testData.length){
            setHasMore(false);
            return;
        }
        setTimeout(()=>{
            if(hotels && hotels.length > 0){
                setHotels(hotels.concat(testData.slice(currentIndex,currentIndex+16)));
                setCurrentIndex(prev => prev+16);
            }else{
                setHotels([]);
            }
        },1000)
    };

    return(
        <Fragment>
            <Navbar/>
            <Categories/>
            {
                hotels && hotels.length > 0 ? (
                    <InfiniteScroll
                        dataLength={hotels.length}
                        next = {fetchMoreData}
                        hasMore={hasMore}
                        loader = {hotels.length > 0 && <h3 className="alert-text">Loading....</h3>}
                        endMessage={<p className="alert-text">You have seen it all!</p>}
                    >
                        <main className="main d-flex align-center wrap gap-larger">
                            {
                                hotels && hotels.map(hotel => <HotelCard key={hotel._id} hotel={hotel}/>)
                            }
                        </main>
                    </InfiniteScroll>
                ):[]
            }
            
            
        </Fragment>
        
    )
}
