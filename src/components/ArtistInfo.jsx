import { Link } from 'react-router-dom';
import Cards from './Cards';
import popPic from '../assets/pictures/onlyAtNightSmall.jpg';
import rockPic from '../assets/pictures/theFallSmall.jpg';
import jazzPic from '../assets/pictures/hiddenLevelSmall.jpg';
import rapPic from '../assets/pictures/runTheStackSmall.jpg';
import countryPic from '../assets/pictures/builtByHandSmall.jpg';
import lofiPic from '../assets/pictures/theArchitectSmall.jpg';
import { SiApplemusic } from "react-icons/si";
import { FaSpotify } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";


const ArtistInfo = ({ theme }) => {
  const popTitle = "Auraveil";
  const rockTitle = "Blacklist Dahlia";
  const jazzTitle = "8BitGinger";
  const rapTitle = "VNDAL";
  const countryTitle = "Cash Harlan";
  const lofiTitle = "8BitGinger";
  const popInfo = "I believe code should be as catchy as a top-40 hit and as polished as a neon skyline. I specialize in building vibrant OBS tools, engaging TTRPG experiences, and web sites that absolutely pop off the screen. For me, development isn't just about pure function—it's about creating joyful, frictionless experiences that your community will love.";
  const rockInfo = "I build things that break the mold. With a passion for heavy riffs and even heavier code, I specialize in creating custom Web apps and Game systems that punch through the noise to tell a story. When I'm not writing functions, I'm probably setting up a podcast or creating my next game.";
  const jazzInfo = "Welcome to the late-night lounge. I approach coding like improvisation—finding the perfect rhythm and elegant solutions to complex problems. I specialize in creating seamless user experiences and intuitive interfaces.";
  const rapInfo = "In development, just like on the mic, it's all about the hustle and the flow. I engineer custom OBS tools, dynamic web apps, and raw Game experiences that never skip a beat. Whether I'm dropping bars of code, slinging a fresh campaign, or optimizing a stream's setup, I bring relentless energy and street-level authenticity to every project I touch.";
  const countryInfo = "Just like a classic country ballad, the best applications and tabletop games are built on honest, compelling storytelling. I handcraft solid websites, reliable OBS tools and weave rich TTRPG campaigns that bring people together around the virtual campfire. I believe in hard work, strong foundations, and writing code that stands the test of time.";
  const lofiInfo = "There is a certain kind of magic that happens at 2 AM with a hot coffee and a steady, ambient beat. I specialize in deep-focus development, quietly crafting visual story-based websites, seamless OBS tools and vast TTRPG worlds while the rest of the world sleeps. My approach is all about creating a relaxed, intuitive user experience.";


    let artistPic = '';
    let artistInfo = '';

    switch (theme) {
        case 'pop':
            artistPic = popPic;
            artistInfo = popInfo;
            break;
        case 'rock':
            artistPic = rockPic;
            artistInfo = rockInfo;
            break;
        case 'rap':
            artistPic = rapPic;
            artistInfo = rapInfo;
            break;
        case 'country':
            artistPic = countryPic;
            artistInfo = countryInfo;
            break;
        case 'lofi':
            artistPic = lofiPic;
            artistInfo = lofiInfo;
            break;
        default:
            artistPic = jazzPic;
            artistInfo = jazzInfo;
    }

  return (
    <div className="bento ">
      <div className="bento-cell span-2">
        <Cards.PhotoCardRight
          img={artistPic}
          title={theme === 'pop' ? popTitle : theme === 'rock' ? rockTitle : theme === 'rap' ? rapTitle : theme === 'country' ? countryTitle : theme === 'lofi' ? lofiTitle : jazzTitle}
          content={artistInfo}
          theme={theme}
        >

        </Cards.PhotoCardRight>
        </div>
        <div className="bento-cell span-2 link-buttons">
            <Cards.ChildCard
                theme={theme}
            >
                       <Link
                to={theme === 'pop' ? 'https://music.apple.com/us/artist/auraveil/6776076042' : theme === 'rock' ? 'https://music.apple.com/us/artist/blacklist-dahlia/6782773395' : theme === 'rap' ? 'https://music.apple.com/us/artist/vndal/6775072343' : theme === 'country' ? 'https://music.apple.com/us/artist/cash-harlan/6779032164' : theme === 'lofi' ? 'https://music.apple.com/us/artist/8bitginger/6790270313' : 'https://music.apple.com/us/artist/8bitginger/6790270313'}
                className="link-button"
                rel="noreferrer"
                target="_blank"
            >
    Apple Music <SiApplemusic className="icon applemusic" />
            </Link>

                                   <Link
                to={theme === 'pop' ? 'https://open.spotify.com/artist/3VKojDijfmPKcLb6LgvCr2' : theme === 'rock' ? 'https://open.spotify.com/artist/5FJQMgl1O2hZf33jsV00Ie' : theme === 'rap' ? 'https://open.spotify.com/artist/7DafIEF0IwCIKzyIvKYXGU' : theme === 'country' ? 'https://open.spotify.com/artist/37fNf52rL7EOAvPdVqDfV0' : theme === 'lofi' ? 'https://open.spotify.com/artist/1Glm89iS2kmOQbqHhrEtOd' : 'https://open.spotify.com/artist/1Glm89iS2kmOQbqHhrEtOd'}
                className="link-button"
                rel="noreferrer"
                target="_blank"
            >
          Spotify <FaSpotify className="icon spotify" />
            </Link>

                                   <Link
                to={theme === 'pop' ? 'https://www.youtube.com/@AuraveilOfficial' : theme === 'rock' ? 'https://www.youtube.com/@BlacklistDahlia' : theme === 'rap' ? 'https://www.youtube.com/@VNDALOFFICIAL' : theme === 'country' ? 'https://www.youtube.com/@CashHarlanOfficial' : theme === 'lofi' ? 'https://www.youtube.com/@8BitGinger' : 'https://www.youtube.com/@8BitGinger'}
                className="link-button"
                rel="noreferrer"
                target="_blank"
            >
          YouTube <FaYoutube className="icon youtube" />
            </Link>
            </Cards.ChildCard>
    </div>
    </div>
  
  );
};

export default ArtistInfo;