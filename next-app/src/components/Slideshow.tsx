import Image from 'next/image';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

type Slides = {
  path: string;
  description: string;
};
type SlideshowProps = {
  slides: Record<string, any> | null;
};
const Slideshow = (props: SlideshowProps) => {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
  });
  if (!props.slides) return <></>;
  const { slides } = props;
  const keys = Object.keys(props.slides);
  if (keys.length === 0) return <></>;

  return (
    <div ref={sliderRef} className=" slideshow keen-slider">
      {keys.map((id, index) => {
        const slide = slides[id];
        return (
          <div
            className="slide keen-slider__slide"
            key={index}
            data-slide={index}
          >
            <Image
              src={slide.path}
              alt={slide.description}
              width={0}
              height={0}
              sizes="100vw"
            />
            <p>{slide.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Slideshow;
