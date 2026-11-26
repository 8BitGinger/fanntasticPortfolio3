// Pieces shown in the Content view on the Projects page.
//
// To add one, drop the file in src/assets/content, import it here, and add an
// entry. `type` is 'video', 'youtube', or 'image':
//   video / image  -> set `src`
//   youtube        -> set `videoId` (and `playlistId` if it belongs to one)
//
// `process`, `purpose`, and `toolkit` fill the three info panels.
import backgroundVideo from '../assets/content/retro-background.mp4';
import cindervoidImg from '../assets/content/cindervoidProject.webp';

const contentList = [
  {
    id: 'retro-background',
    type: 'video',
    title: 'Retro Background Loop',
    src: backgroundVideo,
    process: 'Placeholder: describe how you made this, from first idea to final export.',
    purpose: 'Placeholder: describe why you made it and what you wanted it to do.',
    toolkit: ['Tool one', 'Tool two', 'Skill one'],
  },
  {
    id: 'spent-the-summer',
    type: 'youtube',
    title: 'Spent the Summer',
    videoId: 'EmWm957ZKXY',
    playlistId: 'OLAK5uy_mvNe5hE1SJA_Kl646x9RsbyvGG13CKnzU',
    process: 'Placeholder: describe how you wrote and produced this track.',
    purpose: 'Placeholder: describe why you made it and what it means to you.',
    toolkit: ['Tool one', 'Tool two', 'Skill one'],
  },
  {
    id: 'cindervoid-art',
    type: 'image',
    title: 'Cindervoid RPG',
    src: cindervoidImg,
    process: 'Placeholder: describe how you created this artwork.',
    purpose: 'Placeholder: describe why you made it and where it is used.',
    toolkit: ['Tool one', 'Tool two', 'Skill one'],
  },
];

export default contentList;
