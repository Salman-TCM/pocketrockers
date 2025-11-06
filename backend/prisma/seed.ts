import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tracks = [
  { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration_seconds: 355, genre: 'Rock' },
  { title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', duration_seconds: 482, genre: 'Rock' },
  { title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', duration_seconds: 391, genre: 'Rock' },
  { title: 'Imagine', artist: 'John Lennon', album: 'Imagine', duration_seconds: 183, genre: 'Pop' },
  { title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', album: 'Appetite for Destruction', duration_seconds: 356, genre: 'Rock' },
  { title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', duration_seconds: 294, genre: 'Pop' },
  { title: 'Like a Rolling Stone', artist: 'Bob Dylan', album: 'Highway 61 Revisited', duration_seconds: 370, genre: 'Folk Rock' },
  { title: 'Purple Haze', artist: 'Jimi Hendrix', album: 'Are You Experienced', duration_seconds: 167, genre: 'Rock' },
  { title: 'Yesterday', artist: 'The Beatles', album: 'Yesterday and Today', duration_seconds: 125, genre: 'Pop' },
  { title: 'Satisfaction', artist: 'The Rolling Stones', album: 'Out of Our Heads', duration_seconds: 223, genre: 'Rock' },
  { title: 'What\'s Going On', artist: 'Marvin Gaye', album: 'What\'s Going On', duration_seconds: 232, genre: 'Soul' },
  { title: 'Good Vibrations', artist: 'The Beach Boys', album: 'Smiley Smile', duration_seconds: 217, genre: 'Pop' },
  { title: 'Born to Run', artist: 'Bruce Springsteen', album: 'Born to Run', duration_seconds: 270, genre: 'Rock' },
  { title: 'Bridge Over Troubled Water', artist: 'Simon & Garfunkel', album: 'Bridge Over Troubled Water', duration_seconds: 295, genre: 'Folk' },
  { title: 'Respect', artist: 'Aretha Franklin', album: 'I Never Loved a Man', duration_seconds: 147, genre: 'Soul' },
  { title: 'Hey Jude', artist: 'The Beatles', album: 'The Beatles 1967-1970', duration_seconds: 431, genre: 'Pop' },
  { title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', duration_seconds: 301, genre: 'Grunge' },
  { title: 'Losing My Religion', artist: 'R.E.M.', album: 'Out of Time', duration_seconds: 269, genre: 'Alternative' },
  { title: 'My Generation', artist: 'The Who', album: 'The Who Sings My Generation', duration_seconds: 195, genre: 'Rock' },
  { title: 'A Change Is Gonna Come', artist: 'Sam Cooke', album: 'Ain\'t That Good News', duration_seconds: 192, genre: 'Soul' },
  { title: 'Blue Suede Shoes', artist: 'Elvis Presley', album: 'Elvis Presley', duration_seconds: 120, genre: 'Rock and Roll' },
  { title: 'Waterloo Sunset', artist: 'The Kinks', album: 'Something Else by The Kinks', duration_seconds: 214, genre: 'Rock' },
  { title: 'Midnight Train to Georgia', artist: 'Gladys Knight & the Pips', album: 'Imagination', duration_seconds: 278, genre: 'Soul' },
  { title: 'Take Five', artist: 'Dave Brubeck Quartet', album: 'Time Out', duration_seconds: 324, genre: 'Jazz' },
  { title: 'Clair de Lune', artist: 'Claude Debussy', album: 'Suite Bergamasque', duration_seconds: 300, genre: 'Classical' },
  { title: 'The Girl from Ipanema', artist: 'Stan Getz & João Gilberto', album: 'Getz/Gilberto', duration_seconds: 325, genre: 'Bossa Nova' },
  { title: 'Autumn Leaves', artist: 'Miles Davis', album: 'Somethin\' Else', duration_seconds: 623, genre: 'Jazz' },
  { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', duration_seconds: 287, genre: 'Jazz' },
  { title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', duration_seconds: 320, genre: 'Electronic' },
  { title: 'Around the World', artist: 'Daft Punk', album: 'Homework', duration_seconds: 429, genre: 'Electronic' },
  { title: 'Blue Monday', artist: 'New Order', album: 'Power, Corruption & Lies', duration_seconds: 463, genre: 'Electronic' },
  { title: 'Born Slippy', artist: 'Underworld', album: 'Second Toughest in the Infants', duration_seconds: 569, genre: 'Electronic' },
  { title: 'Windowlicker', artist: 'Aphex Twin', album: 'Windowlicker', duration_seconds: 360, genre: 'Electronic' },
  { title: 'Oxygène IV', artist: 'Jean-Michel Jarre', album: 'Oxygène', duration_seconds: 244, genre: 'Electronic' },
  { title: 'Kraftwerk', artist: 'Trans-Europe Express', album: 'Trans-Europe Express', duration_seconds: 383, genre: 'Electronic' },
  { title: 'Personal Jesus', artist: 'Depeche Mode', album: 'Violator', duration_seconds: 223, genre: 'Electronic' },
  { title: 'Sweet Dreams', artist: 'Eurythmics', album: 'Sweet Dreams', duration_seconds: 216, genre: 'Pop' },
  { title: 'Don\'t Stop Believin\'', artist: 'Journey', album: 'Escape', duration_seconds: 251, genre: 'Rock' },
  { title: 'Tainted Love', artist: 'Soft Cell', album: 'Non-Stop Erotic Cabaret', duration_seconds: 152, genre: 'Synth-pop' },
  { title: 'Blue Eyes', artist: 'Elton John', album: 'Jump Up!', duration_seconds: 209, genre: 'Pop' },
  
  // Contemporary hits (2000s-2020s)
  { title: 'Mr. Brightside', artist: 'The Killers', album: 'Hot Fuss', duration_seconds: 222, genre: 'Alternative Rock' },
  { title: 'Crazy', artist: 'Gnarls Barkley', album: 'St. Elsewhere', duration_seconds: 178, genre: 'Hip Hop/Soul' },
  { title: 'Hey Ya!', artist: 'OutKast', album: 'Speakerboxxx/The Love Below', duration_seconds: 235, genre: 'Hip Hop' },
  { title: 'Seven Nation Army', artist: 'The White Stripes', album: 'Elephant', duration_seconds: 231, genre: 'Rock' },
  { title: 'Somebody That I Used to Know', artist: 'Gotye ft. Kimbra', album: 'Making Mirrors', duration_seconds: 244, genre: 'Indie Pop' },
  { title: 'Rolling in the Deep', artist: 'Adele', album: '21', duration_seconds: 228, genre: 'Soul/Pop' },
  { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', album: 'Uptown Special', duration_seconds: 270, genre: 'Funk/Pop' },
  { title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)', duration_seconds: 233, genre: 'Pop' },
  { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration_seconds: 200, genre: 'Synth-pop' },
  { title: 'Bad Guy', artist: 'Billie Eilish', album: 'When We All Fall Asleep, Where Do We Go?', duration_seconds: 194, genre: 'Alt Pop' },
  { title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration_seconds: 174, genre: 'Pop Rock' },
  { title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration_seconds: 178, genre: 'Pop Punk' },
  { title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', duration_seconds: 238, genre: 'Indie Pop' },
  
  // Hip Hop/Rap classics
  { title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile Soundtrack', duration_seconds: 326, genre: 'Hip Hop' },
  { title: 'Stan', artist: 'Eminem ft. Dido', album: 'The Marshall Mathers LP', duration_seconds: 404, genre: 'Hip Hop' },
  { title: 'Gold Digger', artist: 'Kanye West ft. Jamie Foxx', album: 'Late Registration', duration_seconds: 207, genre: 'Hip Hop' },
  { title: 'Empire State of Mind', artist: 'Jay-Z ft. Alicia Keys', album: 'The Blueprint 3', duration_seconds: 276, genre: 'Hip Hop' },
  { title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', duration_seconds: 177, genre: 'Hip Hop' },
  
  // International hits
  { title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', album: 'Vida', duration_seconds: 229, genre: 'Reggaeton' },
  { title: 'Gangnam Style', artist: 'PSY', album: 'Psy 6 (Six Rules), Part 1', duration_seconds: 219, genre: 'K-Pop' },
  { title: 'Dynamite', artist: 'BTS', album: 'BE', duration_seconds: 199, genre: 'K-Pop' },
  { title: 'Butter', artist: 'BTS', album: 'Butter', duration_seconds: 164, genre: 'K-Pop' },
  { title: 'La Vie En Rose', artist: 'Édith Piaf', album: 'La Vie En Rose', duration_seconds: 167, genre: 'French Chanson' },
  { title: 'Bambaataa', artist: 'Shpongle', album: 'Are You Shpongled?', duration_seconds: 498, genre: 'Psybient' },
  
  // Electronic/EDM
  { title: 'Levels', artist: 'Avicii', album: 'Levels', duration_seconds: 202, genre: 'EDM' },
  { title: 'Titanium', artist: 'David Guetta ft. Sia', album: 'Nothing but the Beat', duration_seconds: 245, genre: 'EDM' },
  { title: 'Wake Me Up', artist: 'Avicii', album: 'True', duration_seconds: 247, genre: 'EDM' },
  { title: 'Clarity', artist: 'Zedd ft. Foxes', album: 'Clarity', duration_seconds: 271, genre: 'EDM' },
  { title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', duration_seconds: 244, genre: 'Electronic' },
  
  // Alternative/Indie
  { title: 'Somebody Told Me', artist: 'The Killers', album: 'Hot Fuss', duration_seconds: 193, genre: 'Alternative Rock' },
  { title: 'Take Me Out', artist: 'Franz Ferdinand', album: 'Franz Ferdinand', duration_seconds: 237, genre: 'Indie Rock' },
  { title: 'Float On', artist: 'Modest Mouse', album: 'Good News for People Who Love Bad News', duration_seconds: 208, genre: 'Indie Rock' },
  { title: 'Time to Dance', artist: 'The Sounds', album: 'Living in America', duration_seconds: 194, genre: 'Rock' },
  
  // Modern pop favorites
  { title: 'Can\'t Stop the Feeling!', artist: 'Justin Timberlake', album: 'Trolls Soundtrack', duration_seconds: 236, genre: 'Pop' },
  { title: 'Shake It Off', artist: 'Taylor Swift', album: '1989', duration_seconds: 219, genre: 'Pop' },
  { title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', duration_seconds: 200, genre: 'Pop' },
  { title: 'Flowers', artist: 'Miley Cyrus', album: 'Endless Summer Vacation', duration_seconds: 200, genre: 'Pop' },
  { title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", duration_seconds: 167, genre: 'Pop' }
];

const playlistItems = [
  { track_index: 0, position: 1.0, votes: 8, added_by: 'Alice', is_playing: true }, // Bohemian Rhapsody
  { track_index: 46, position: 2.0, votes: 12, added_by: 'Bob' }, // Mr. Brightside
  { track_index: 2, position: 3.0, votes: 3, added_by: 'Charlie' }, // Hotel California
  { track_index: 53, position: 4.0, votes: 9, added_by: 'Diana' }, // Uptown Funk
  { track_index: 4, position: 5.0, votes: -1, added_by: 'Eve' }, // Sweet Child O' Mine
  { track_index: 55, position: 6.0, votes: 7, added_by: 'Frank' }, // Blinding Lights
  { track_index: 15, position: 7.0, votes: 4, added_by: 'Grace' }, // Hey Jude
  { track_index: 61, position: 8.0, votes: 6, added_by: 'Henry' }, // Lose Yourself
  { track_index: 70, position: 9.0, votes: 5, added_by: 'Ivy' }, // Dynamite - BTS
  { track_index: 76, position: 10.0, votes: 8, added_by: 'Jack' }, // Levels - Avicii
  { track_index: 48, position: 11.0, votes: 4, added_by: 'Kate' }, // Hey Ya! - OutKast
  { track_index: 52, position: 12.0, votes: 10, added_by: 'Leo' }, // Rolling in the Deep - Adele
  { track_index: 68, position: 13.0, votes: 2, added_by: 'Maya' }, // Despacito
  { track_index: 59, position: 14.0, votes: 3, added_by: 'Nick' } // Heat Waves
];

async function main() {
  console.log('🎵 Loading demo songs for SyncPlay...');

  // Check if database is already seeded
  const existingTracks = await prisma.track.count();
  const forceReseed = process.env.SEED_DATABASE === 'true';
  
  if (existingTracks > 0 && !forceReseed) {
    console.log(`✅ Database already contains ${existingTracks} tracks, skipping seed.`);
    console.log('💡 Set SEED_DATABASE=true to force re-seed, or delete database to start fresh.');
    return;
  }
  
  if (forceReseed) {
    console.log('🔄 Force re-seeding database...');
  }

  // Clean slate for seeding
  await prisma.playlistTrack.deleteMany();
  await prisma.track.deleteMany();

  console.log(`📀 Creating ${tracks.length} demo tracks...`);
  const createdTracks: any[] = [];
  for (const track of tracks) {
    const created = await prisma.track.create({
      data: track,
    });
    createdTracks.push(created);
    console.log(`   ♪ ${track.title} by ${track.artist}`);
  }

  console.log(`🎶 Setting up sample playlist with ${playlistItems.length} tracks...`);
  for (const item of playlistItems) {
    const track = createdTracks[item.track_index];
    await prisma.playlistTrack.create({
      data: {
        track_id: track.id,
        position: item.position,
        votes: item.votes,
        added_by: item.added_by,
        is_playing: item.is_playing || false,
      },
    });
    
    const status = item.is_playing ? '▶️ Now Playing' : `👍 ${item.votes} votes`;
    console.log(`   ${item.position}. ${track.title} - ${status}`);
  }

  console.log('');
  console.log('🎉 Demo database seeded successfully!');
  console.log('🌐 Visit http://localhost:3001 to start collaborating!');
  console.log('🎵 Featured tracks include:');
  console.log('   • Bohemian Rhapsody - Queen');
  console.log('   • Billie Jean - Michael Jackson'); 
  console.log('   • Hotel California - Eagles');
  console.log('   • Imagine - John Lennon');
  console.log('   • Stairway to Heaven - Led Zeppelin');
  console.log('   ...and many more!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });