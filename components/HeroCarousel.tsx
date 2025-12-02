import React from 'react';
import { JOB_LISTINGS } from '../constants';

export const HeroCarousel: React.FC = () => {
  // Use job listings to create "cards" in the carousel
  // Duplicate to create seamless loop
  const displayItems = [...JOB_LISTINGS, ...JOB_LISTINGS];

  return (
    <div className="relative w-full h-[450px] bg-gray-100 overflow-hidden flex items-center">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

      {/* Scrolling Container */}
      <div className="flex animate-scroll-left hover:[animation-play-state:paused] gap-6 pl-6">
        {displayItems.map((job, index) => (
          <div 
            key={`${job.id}-${index}`} 
            className="relative w-[300px] h-[360px] flex-shrink-0 bg-white shadow-lg border border-gray-200 rounded-sm overflow-hidden group cursor-pointer hover:border-gray-400 transition-colors"
          >
            <img 
              src={job.coverImageUrl} 
              alt={job.title} 
              className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <img src={job.company.logoUrl} className="w-6 h-6 rounded-full bg-white p-0.5" alt="logo"/>
                    <span className="text-xs font-bold tracking-wider uppercase text-gray-300">{job.company.name}</span>
                </div>
                <h3 className="font-bold text-lg leading-tight line-clamp-3">
                    {job.title}
                </h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Vignette */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F3F4F6] to-transparent pointer-events-none z-10"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F3F4F6] to-transparent pointer-events-none z-10"></div>
    </div>
  );
};