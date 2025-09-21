import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageLightboxProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex: number;
  propertyTitle: string;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  isOpen,
  onClose,
  initialIndex,
  propertyTitle
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/90" />
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full border-0 p-0 bg-transparent shadow-none">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Carousel */}
        <div className="flex items-center justify-center h-full w-full p-8">
          <Carousel 
            className="w-full max-w-5xl"
            opts={{
              startIndex: initialIndex,
              loop: true,
            }}
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="flex items-center justify-center">
                    <img
                      src={image}
                      alt={`${propertyTitle} - Image ${index + 1}`}
                      className="max-w-full max-h-[80vh] object-contain rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-4 bg-black/50 text-white hover:bg-black/70 border-0" />
                <CarouselNext className="right-4 bg-black/50 text-white hover:bg-black/70 border-0" />
              </>
            )}
          </Carousel>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {initialIndex + 1} / {images.length}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;