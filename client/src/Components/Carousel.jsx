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
    <div className="w-full bg-gray-950 rounded-b-[30%]">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        speed={1000}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper rounded-b-3xl overflow-hidden shadow-2xl"
      >
        <SwiperSlide>
          <Slide
            image="https://images.unsplash.com/photo-1740744363813-47aacc1356d1?q=80&w=1920&auto=format&fit=crop"
            text="Bid Smart, Drive Your Dream — Join the Car Auction Today!"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Slide
            image="https://images.unsplash.com/photo-1740744362373-bbd648d38dac?q=80&w=1920&auto=format&fit=crop"
            text="Find the Best Deals at Live Car Auctions"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Slide
            image="https://plus.unsplash.com/premium_photo-1671430322969-d586ac907113?q=80&w=1920&auto=format&fit=crop"
            text="Buy, Sell & Win — Experience the Auction Excitement!"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
