import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const TourImageGallery = ({ images }) => {
    
    const imageSlide = images.map((img) => {
        // console.log('Image ID',img.id); 
        // console.log('Image URL',img.url); 
        return {
            original: img.url,
            thumbnail: img.url,
        };
    });

    return (
        <div className="h-full w-full">
            <ImageGallery
                items={imageSlide}
                showFullscreenButton={false}
                showPlayButton={false}
                thumbnailPosition="bottom"
                additionalClass="tour-image-gallery"
            />
            <style>{`
                .tour-image-gallery .image-gallery {
                    height: 100%;
                }

                .tour-image-gallery .image-gallery-slide-wrapper {
                    height: 100%;
                }

                .tour-image-gallery .image-gallery-slides {
                    height: 100%;
                }

                .tour-image-gallery .image-gallery-slide img {
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                    border-radius: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default TourImageGallery;