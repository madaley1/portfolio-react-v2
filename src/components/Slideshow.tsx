import { useState, useEffect } from 'react';

import Image from 'next/image';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

import styles from '@/Styles/sass/components/Slideshow.module.scss';

type SlideshowProps = {
  slides: Record<string, any> | null;
};

const Slideshow = (props: SlideshowProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    initial: 0,
    mode: 'snap',
    rubberband: true,
    slides: {
      origin: 'center',
      perView: 1,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  if (!props.slides) return <></>;
  const { slides } = props;
  const keys = Object.keys(props.slides);
  if (keys.length === 0) return <></>;

  return (
    <div className={styles.slideshow}>
      <div ref={sliderRef} className="keen-slider">
        {keys.map((id, index) => {
          const slide = slides[id];
          return (
            <div
              className={`${styles.slide} keen-slider__slide`}
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
        {loaded && instanceRef.current !== undefined ? (
          <div className={styles.arrowContainer}>
            <Arrow
              left
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
              disabled={currentSlide === 0}
            />

            <Arrow
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
              disabled={
                instanceRef.current &&
                currentSlide ===
                  instanceRef.current.track.details.slides.length - 1
                  ? true
                  : false
              }
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      {loaded && instanceRef.current !== undefined ? (
        <div className={styles.dots}>
          {[
            ...Array(
              instanceRef.current &&
                instanceRef.current.track.details.slides.length
            ).keys(),
          ].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={
                  `${styles.dot}` +
                  (currentSlide === idx ? ` ${styles.active}` : '')
                }
              ></button>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

function Arrow(props: {
  disabled: boolean;
  left?: boolean;
  onClick: (e: any) => void;
}) {
  const disabled = props.disabled ? ` ${styles['arrow--disabled']}` : '';
  return (
    <svg
      onClick={props.onClick}
      className={`${styles.arrow} ${
        props.left ? `${styles['arrow--left']}` : `${styles['arrow--right']}`
      } ${disabled}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}

export default Slideshow;
