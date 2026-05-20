import { useState, useEffect } from 'react'
import '../../styles/components/Carousel.css'

import { register } from 'swiper/element/bundle'
register()
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { Swiper, SwiperSlide } from 'swiper/react'

export default function Carousel({ images }) {
    const [slidesPerView, setSlidesPerView] = useState(2)

    useEffect(() => {

        function handleResize() {
            if (window.innerWidth < 720 || (images && images.length < 2)) {
                setSlidesPerView(1)
            } else {
                setSlidesPerView(2)
            }
        }

        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [images])

    return (

        <div className="container-carousel">

            <Swiper
                slidesPerView={slidesPerView}
                pagination={{ clickable: true }}
                navigation
                spaceBetween={4}
                className="carousel-swiper"
            >
                {images && images.map((item) => (
                    <SwiperSlide key={item.id_imagem} className="carousel-slide">
                        <img src={item.endereco_imagem} alt={`Imagem ${item.posicao_imagem}`} className='slide-item' />
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>

    )
}