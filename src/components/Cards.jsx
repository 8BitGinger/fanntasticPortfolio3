import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';


const PhotoCardLeft = ({ img, content, title, theme }) => {
  return (
    <motion.div className={`card photo-card card--${theme}`}
                 initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
    >
        <div className='img-block'>
            <img loading='lazy' src={img} alt={title} />
        </div>
        <div className='content-card'>
            <h2 className={`title3 title-${theme}`}>{title}</h2>
            <p>{content}</p>
        </div>
    </motion.div>
  )
}

const PhotoCardRight = ({ img, content, title, theme }) => {
  return (
    <motion.div className={`card photo-card card--${theme}`}
                initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
    >
        
        <div className='content-card'>
            <h2 className={`title3 title-${theme}`}>{title}</h2>
            <p>{content}</p>
        </div>
        <div className='img-block'>
            <img loading='lazy' src={img} alt={title} />
        </div>
    </motion.div>
  )
}

const Cards = { PhotoCardLeft, PhotoCardRight }

export default Cards;