import Image from 'next/image';

type Slides = {
  path: string;
  description: string;
};
type SlideshowProps = {
  slides: Record<string, any> | null;
};
const Slideshow = (props: SlideshowProps) => {
  if (!props.slides) return <></>;
  const { slides } = props;
  const keys = Object.keys(props.slides);
  if (keys.length === 0) return <></>;

  return (
    <div className="slideshow">
      <div className="slideshow-container">
        {keys.map((id, index) => {
          const slide = slides[id];
          console.log(slide.path);
          return (
            <div className="slideshow-slide" key={index} data-slide={index}>
              <Image
                src={slide.path}
                alt={slide.description}
                width={100}
                height={100}
              />
              <p>{slide.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Slideshow;
