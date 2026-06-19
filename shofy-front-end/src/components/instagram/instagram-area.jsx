'use client';
import React from 'react';
import Image from 'next/image';
// internal
import ins_1 from '@assets/img/instagram/instagram-1.png';
import ins_2 from '@assets/img/instagram/instagram-2.png';
import ins_3 from '@assets/img/instagram/instagram-3.png';
import ins_4 from '@assets/img/instagram/instagram-4.png';
import ins_5 from '@assets/img/instagram/instagram-5.png';

// instagram data 
const instagram_data = [
  { id: 1, link: 'https://www.instagram.com/p/DMZwEjUR5_W/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==', img: ins_1 },
  { id: 2, link: 'https://www.instagram.com/reel/DZCUmC-srRR/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', img: ins_2 },
  { id: 3, link: 'https://www.instagram.com/reel/DKevEzjR98B/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', img: ins_3 },
  { id: 4, link: 'https://www.instagram.com/reel/DKPe7w8S2cp/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', img: ins_4 },
  { id: 5, link: 'https://www.instagram.com/reel/DMfg2TYRX1O/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', img: ins_5 },
]

const InstagramArea = () => {
  return (
    <div className="tp-instagram-area pb-70">
      <div className="container">
        <div className="row row-cols-lg-5 row-cols-md-3 row-cols-sm-2 row-cols-1">
          {instagram_data.map((item) => (
            <div key={item.id} className="col">
              <div className="tp-instagram-item p-relative z-index-1 fix mb-30 w-img">
                <Image src={item.img} alt="instagram img" />
                <div className="tp-instagram-icon">
                  <a href={item.link} target="_blank" className="popup-image">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstagramArea;
