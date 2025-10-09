// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Slide from "./Slide";

export default function Carousel() {
  return (
    <div className="container px-6 py-10 mx-auto">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Slide
            image="https://images.unsplash.com/photo-1740744363813-47aacc1356d1?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            text="Bid Smart, Drive Your Dream — Join the Car Auction Today!"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Slide
            image="https://images.unsplash.com/photo-1740744362373-bbd648d38dac?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            text="Find the Best Deals at Live Car Auctions"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Slide
            image="https://plus.unsplash.com/premium_photo-1671430322969-d586ac907113?q=80&w=1097&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            text="Buy, Sell & Win — Experience the Auction Excitement!"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
