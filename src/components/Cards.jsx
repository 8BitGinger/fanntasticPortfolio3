import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';


const PhotoCardLeft = ({ img, content, title, theme }) => {
  return (

    <motion.div className={`card photo-card card--${theme}`}
                 initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
     
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

const ChildCard = ({ children, theme }) => {
  return (
    <motion.div className={`card child-card card--${theme}`}
                initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
      <div className='flexRow'>
        {children}
      </div>
    </motion.div>
  )
}

const PhotoCardWide = ({ img, imgSmall, theme }) => {
  return (
    <>
   
    <motion.div className={`card photo-card-wide hide-small card--${theme}`}
                initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
            <img loading='lazy' src={img} alt={`${theme} Theme Photo`} />

    </motion.div>

    <motion.div className={`card photo-card-wide hide-large card--${theme}`}
                initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
            <img loading='lazy' src={imgSmall} alt={`${theme} Theme Photo`} />
    </motion.div>
     </>
  )
}

const Cards = { PhotoCardLeft, PhotoCardRight, ChildCard, PhotoCardWide }

export default Cards;