import { Link } from 'react-router-dom';
import Cards from './Cards';
import popPic from '../assets/pictures/onlyAtNightSmall.webp';
import rockPic from '../assets/pictures/theFallSmall.webp';
import jazzPic from '../assets/pictures/hiddenLevelSmall.webp';
import rapPic from '../assets/pictures/runTheStackSmall.webp';
import countryPic from '../assets/pictures/builtByHandSmall.webp';
import lofiPic from '../assets/pictures/theArchitectSmall.webp';
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
  const popInfo = "This one's the one I almost didn't want to share. Everybody else here is showing you the work — I wanted to show what it feels like when no one's watching. The late hours. The quiet doubt. The building anyway. \"Only At Night\" isn't a performance. It's just true.  Written by Ryan J Fann — performed by Auraveil.";
  const rockInfo = "Everyone else on this project talks about building. I talk about deciding what's worth building in the first place. \"The Fall\" isn't about the finished thing — it's about the control it takes to tear something down to the studs and not flinch. That's the part nobody wants to admit is the real skill.  Written by Ryan J Fann — performed by Blacklist Dahlia.";
  const jazzInfo = "Not everything's meant to be found on the first pass. This one's for whoever went looking. You already know the password.  The Secret track on \"Hidden Level\" is for the curious.  Written by Ryan J Fann — performed by 8BitGinger.";
  const rapInfo = "I don't do warmth. I do results. \"Run The Stack\" is what happens when you stop explaining your work and just let it speak — cold, precise, no apology. Every system I've touched, I've touched completely. This one's not for comfort. It's for anyone who needed proof.  Written by Ryan J Fann — performed by VNDAL.";
  const countryInfo = "Folks like to make technology sound complicated. It ain't, not really. You build it right, or you don't put your name on it — same rule as a good table, a good song, a good anything. \"Built By Hand\" is just me sayin' the quiet part out loud: I don't do nothin' I ain't willing to stand behind.  Written by Ryan J Fann — performed by Cash Harlan.";
  const lofiInfo = "This one's the foundation. Everybody wants the highlight reel, but I wanted people to feel the actual process — the coffee, the screen glow, the quiet hours nobody claps for. \"The Architect\" is me, plainly. Code, sound, story, whatever the medium — I build it the same way. Soulful, not sterile. That's the whole philosophy in one track. Written by Ryan J Fann — performed by 8BitGinger.";


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