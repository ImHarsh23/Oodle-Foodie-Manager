import { Carousel } from "@material-tailwind/react";

export default function CustomCarousel() {
  return (
    <Carousel
      autoplay
      loop
      autoplayDelay={3000}
      className="rounded-xl h-80 shadow-2xl shadow-purple-200 my-10"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      <img
        src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="image 1"
        className="h-full w-full object-fill object-center"
      />
      <img
        src="https://media.istockphoto.com/id/1204371265/photo/flat-lay-of-turkish-traditional-foods-for-celebrating-holiday-wode-composition.jpg?s=2048x2048&w=is&k=20&c=Vy7nok9uRRFTnpMi32aCZBgh9B0zt1BjeAjOFSE8HH0="
        alt="image 2"
        className="h-full w-full object-cover"
      />
      <img
        src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="image 3"
        className="h-full w-full object-fill"
      />
    </Carousel>
  );
}
